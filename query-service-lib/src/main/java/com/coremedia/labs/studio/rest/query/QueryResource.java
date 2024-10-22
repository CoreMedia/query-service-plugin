/*
 * Copyright (c) 2016 T-Systems Multimedia Solutions GmbH
 * Riesaer Str. 5, D-01129 Dresden, Germany
 * All rights reserved.
 */
package com.coremedia.labs.studio.rest.query;

import com.coremedia.cap.content.Content;
import com.coremedia.cap.content.ContentRepository;
import com.coremedia.cap.content.Version;
import com.coremedia.cap.content.publication.PublicationService;
import com.coremedia.cap.content.query.QueryService;
import com.coremedia.cap.content.results.BulkOperationResult;
import com.coremedia.cap.user.User;
import com.coremedia.cap.user.UserRepository;
import com.coremedia.cms.common.plugins.plugin_base.PluginRestController;
import com.coremedia.cotopaxi.content.ContentImpl;
import com.coremedia.labs.studio.rest.common.GridSortData;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * Offers access to ContentRepository to filter Content with keywords.
 *
 * @author dasc
 * @version $Id$
 */
@RestController
@RequestMapping(
  value = "qsrest",
  produces = MediaType.APPLICATION_JSON_VALUE
)
public class QueryResource implements PluginRestController {

  private static final String QUERY_PARAM_AS_JSON = "queryjson";
  private static final String CONTENT_TYPE = "ctype";
  private static final String INCLUDE_SUBTYPES = "includeSubs";
  private static final String MAX = "max";
  private static final String PAGE = "page";
  private static final String SORT = "sort";
  private static final String CM_IDS = "contentIds";

  ContentRepository contentRepository;
  QueryService queryService;

  public QueryResource(
    ContentRepository contentRepository
  ) {
    this.contentRepository = contentRepository;
    this.queryService = contentRepository.getQueryService();
  }

  @GetMapping(
    value = "query"
  )
  public QueryResult find(@RequestParam(value = QUERY_PARAM_AS_JSON, required = false) QueryData queryData,
                          @RequestParam(CONTENT_TYPE) String contentType,
                          @RequestParam(INCLUDE_SUBTYPES) boolean includeSubtypes,
                          @RequestParam(MAX) int resultLimit,
                          @RequestParam(PAGE) int page,
                          @RequestParam(value = SORT, required = false) GridSortData sortData) {

    Collection<Content> contents = getQueryCollection(queryData, contentType, includeSubtypes, resultLimit, page, sortData);

    QueryResult qr = new QueryResult();

    List<Match> matches = getMatchPage(contents, page, resultLimit);

    qr.setQueryData(matches);
    qr.setTotal(matches.size());
    qr.setMaxCount(contents.size());

    return qr;
  }

  private Collection<Content> getQueryCollection(QueryData queryData,
                                                 String contentType,
                                                 boolean includeSubtypes,
                                                 int resultLimit,
                                                 int page,
                                                 GridSortData sortData) {

    // if someone really wants all data - not really performant
    boolean usePaging = page > 0;
    int activeResultLimit = usePaging ? -1 : resultLimit;

    QueryBuilder builder = new QueryBuilder(queryData, contentType, includeSubtypes, activeResultLimit, sortData);
    String query = builder.buildQuery();

    QueryService queryService = contentRepository.getQueryService();
    return queryService.poseContentQuery(query);
  }

  /**
   * Collects the contents of a page.
   * @param contents: Collection<Content> - the collection of all content
   * @param page: int - page number
   * @param resultLimit: int - maximum number of content on a page
   * #
   * @return List<Match> - List of Matches that are displayed on a page
   */
  private List<Match> getMatchPage(Collection<Content> contents, int page, int resultLimit) {

    List<Match> pageList = new ArrayList<>();
    PublicationService pubSer = contentRepository.getPublicationService();

    PageDimensions pd = getPageDimensions(page, resultLimit, contents.size());
    Object[] contentArray = contents.toArray();

    for (int o=pd.getStart(); o<=pd.getEnd(); o++) {
      Content c = (Content)contentArray[o];
      int contentId = ((ContentImpl)c).getNumericId();
      boolean isCheckedOut = !c.isFolder() && c.isCheckedOut();
      Version checkedInVersion = c.getCheckedInVersion();

      pageList.add(
        new Match(
          contentId,
          c.getName(),
          c.getType().getName(),
          c.getParent() != null ? c.getParent().getPath() : "",
          c.isInProduction(),
          c.isDeleted(),
          isCheckedOut,
          isCheckedOut ? false : (c.isFolder() ? false : pubSer.isApproved(checkedInVersion)),
          isCheckedOut ? false : (c.isFolder() || checkedInVersion == null ? false : pubSer.isPublished(checkedInVersion)),
          isCheckedOut ? c.getEditor().getName() : ""
        )
      );
    }

    return pageList;
  }

  /**
   * Calculates the dimensions of a page.
   * @param page: int - page number
   * @param resultLimit: int - maximum number of content on a page
   * @param resultSize: int - size of the complete content list
   *
   * @return PageDimensions - Object containing the start and the end of a range of contents on a page.
   */
  private PageDimensions getPageDimensions(int page, int resultLimit, int resultSize) {
    if (resultLimit > 0) {
      if (page <= 1) {
        if (resultSize > resultLimit) {
          return new PageDimensions(0, resultLimit-1);
        }
      } else {
        if (resultSize > page*resultLimit) {
          return new PageDimensions((page-1)*resultLimit, (page)*resultLimit-1);
        } else if (resultSize < page*resultLimit) {
          return new PageDimensions((page-1)*resultLimit, resultSize-1);
        }
      }
    }
    return new PageDimensions(0, resultSize-1);
  }

  @GetMapping(
    value = "queryToCSV",
    produces = MediaType.TEXT_PLAIN_VALUE
  )
  public ResponseEntity<byte[]> findToCSV(@RequestParam(value = QUERY_PARAM_AS_JSON, required = false) QueryData queryData,
                                          @RequestParam(CONTENT_TYPE) String contentType,
                                          @RequestParam(INCLUDE_SUBTYPES) boolean includeSubtypes,
                                          @RequestParam(MAX) int resultLimit,
                                          @RequestParam(PAGE) int page,
                                          @RequestParam(value = SORT, required = false) GridSortData sortData) throws Exception {

    Collection<Content> contents = getQueryCollection(queryData, contentType, includeSubtypes, resultLimit, page, sortData);

    StringBuilder res = new StringBuilder();

    for (Content c : contents) {
      res.append(org.apache.commons.text.StringEscapeUtils.escapeCsv(c.getType().getName())).append(";");
      res.append(((ContentImpl)c).getNumericId()).append(";");
      res.append(org.apache.commons.text.StringEscapeUtils.escapeCsv(c.getName())).append(";");
      res.append(StringEscapeUtils.escapeCsv(c.getParent() != null ? c.getParent().getPath() : "")).append(";");
      res.append(";\n");
    }

    HttpHeaders responseHeaders = new HttpHeaders();
    responseHeaders.add("Content-Type", "application/vnd.ms-excel");
    responseHeaders.add("Content-Disposition", "attachment; filename=query.csv");

    return new ResponseEntity<>(res.toString().getBytes("ISO8859-15"), responseHeaders, HttpStatus.OK);
  }

  @GetMapping(
    value = "undelete",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  public ResponseEntity<byte[]> undelete(@RequestParam(CM_IDS) List<String> contentIds) {

    boolean success = true;

    if (contentIds != null) {
      for (String contentId : contentIds) {
        Content c = contentRepository.getContent(contentId);
        BulkOperationResult r = null;

        if (c != null && c.isDeleted()) {
          r = c.undelete();
        }
        success &= (r != null && r.isSuccessful());
      }
    }

    String res = "{\"success\":\""+success+"\"}";

    HttpHeaders responseHeaders = new HttpHeaders();
    responseHeaders.add("Content-Type",  MediaType.APPLICATION_JSON_VALUE);

    return new ResponseEntity<>(res.getBytes(StandardCharsets.UTF_8), responseHeaders, HttpStatus.OK);
  }

  @GetMapping(
    value = "users",
    produces = MediaType.APPLICATION_JSON_VALUE
  )
  public ResponseEntity<Collection<User>> getAllUsers() {

    UserRepository userRepository = contentRepository.getConnection().getUserRepository();
    Collection<User> users = null;
    if (userRepository != null) {
      users = userRepository.findUsers("","",false,0);
    }

    HttpHeaders responseHeaders = new HttpHeaders();
    responseHeaders.add("Content-Type",  MediaType.APPLICATION_JSON_VALUE);

    return new ResponseEntity<>(users != null ? users : Collections.EMPTY_LIST, responseHeaders, HttpStatus.OK);
  }
}
