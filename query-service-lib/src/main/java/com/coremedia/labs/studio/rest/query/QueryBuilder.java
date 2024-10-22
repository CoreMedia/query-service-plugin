/*
 * Copyright (c) 2015 T-Systems Multimedia Solutions GmbH
 * Riesaer Str. 5, D-01129 Dresden, Germany
 * All rights reserved.
 */
package com.coremedia.labs.studio.rest.query;

import com.coremedia.labs.studio.rest.common.GridSortData;

import java.util.Collections;
import java.util.List;

/**
 * Generating the Query-String.
 * @see <a href="https://documentation.coremedia.com/cms-9/artifacts/1710/webhelp/uapi-developer-en/content/QueryService.html">...</a>
 *
 * @author dasc
 * @version $Id$
 */

public class QueryBuilder {

  public  static final String DEFAULT_CONTENT_TYPE = "Document_";
  private static final int    DEFAULT_LIMIT = -1;

  private static final String CONDITION_TYPE__DATE           = "DATE";
  private static final String CONDITION_TYPE__STRING         = "STRING";
  private static final String CONDITION_TYPE__LINK           = "LINK";
  private static final String CONDITION_TYPE__CONTENT_LINK   = "CONTENT_LINK";
  private static final String CONDITION_TYPE__FOLDER_LINK    = "FOLDER_LINK";
  private static final String CONDITION_TYPE__INTEGER        = "INTEGER";
  private static final String CONDITION_TYPE__STRUCT         = "STRUCT";
  private static final String CONDITION_TYPE__MARKUP         = "MARKUP";
  private static final String CONDITION_TYPE__BOOLEAN        = "BOOLEAN";
  private static final String CONDITION_TYPE__USER           = "USER";

  private static final String PROPERTY_TYPE__REFERENCES      = "REFERENCES";
  private static final String PROPERTY_TYPE__REFERENCED_BY   = "REFERENCED_BY";

  private static final String COMPARATOR_TYPE__CONTAINS      = "CONTAINS";
  private static final String COMPARATOR_TYPE__NOT_CONTAINS  = "NOT CONTAINS";
  private static final String COMPARATOR_TYPE__REFERNCES     = "REFERENCES";
  private static final String COMPARATOR_TYPE__NOT_REFERNCES = "NOT REFERENCES";
  private static final String COMPARATOR_TYPE__EQUAL         = "=";
  private static final String COMPARATOR_TYPE__NOT_EQUAL     = "NOT =";
  private static final String COMPARATOR_TYPE__LESS          = "<";
  private static final String COMPARATOR_TYPE__GREATER       = ">";
  private static final String COMPARATOR_TYPE__LESS_EQUAL    = "<=";
  private static final String COMPARATOR_TYPE__GREATER_EQUAL = ">=";
  private static final String COMPARATOR_TYPE__EXISTS        = "IS NOT NULL";
  private static final String COMPARATOR_TYPE__NOT_EXISTS    = "IS NULL";

  private static final String KEYWORD_FALSE                  = "false";
  private static final String KEYWORD_TRUE                   = "true";
  private static final String KEYWORD_NEGATIVE_CONDITION     = "NOT ";
  private static final String KEYWORD_ID                     = " ID ";
  private static final String KEYWORD_PATH                   = " PATH ";
  private static final String KEYWORD_DATE                   = " DATE ";
  private static final String KEYWORD_USER                   = " USER ";
  private static final String KEYWORD_BELOW                  = "BELOW";
  private static final String KEYWORD_LINKS                  = "containsWideLink";
  private static final String KEYWORD_REFERENCES             = "REFERENCES";
  private static final String KEYWORD_REFERENCED             = "REFERENCED";
  private static final String KEYWORD_REFERENCED_BY          = "REFERENCED BY";
  private static final String KEYWORD_OR_CONDITION           = " OR ";
  private static final String KEYWORD_AND_CONDITION          = " AND ";
  private static final String KEYWORD_LIMIT_RESULTS          = " LIMIT ";
  private static final String KEYWORD_ORDER_BY               = " ORDER BY ";
  private static final String KEYWORD_ORDER_NEXT             = " , ";
  private static final String KEYWORD_ORDER_ASC              = " ASC";
  private static final String KEYWORD_ORDER_DESC             = " DESC";

  private static final String SPACE                          = " ";
  private static final String APOSTROPHE                     = "'";

  /**
   * Constructor for Query Builder
   */
  public QueryBuilder() {
    String emptyJSONString = "";
    setQueryData(new QueryData(emptyJSONString));
    setContentType(DEFAULT_CONTENT_TYPE);
    setIncludeSubtypes(true);
    setLimit(DEFAULT_LIMIT);
    setSorters(Collections.emptyList());
  }

  /**
   * Constructor for Query Builder
   * @param queryData [QueryData]
   */
  public QueryBuilder(QueryData queryData, String contentType, boolean includeSubtypes, int limit, GridSortData sorters) {
    setQueryData(queryData);
    setContentType(contentType.isEmpty() ? DEFAULT_CONTENT_TYPE : contentType);
    setIncludeSubtypes(includeSubtypes);
    setLimit(limit);
    setSorters(sorters != null?sorters.getSortData(): Collections.emptyList());
  }

  public String buildQuery() {
    List<QueryCondition> conditions = queryData.getConditions();

    String usedContentType = !(contentType == null || contentType.isEmpty()) ? contentType : DEFAULT_CONTENT_TYPE;
    StringBuilder queryBase = new StringBuilder("TYPE "+ (includeSubtypes ? "" : "= ") +usedContentType);
    StringBuilder query = new StringBuilder();

    if (!conditions.isEmpty()) {

      boolean first=true;

      for (QueryCondition qc : conditions) {

        if (!first) {
          query.append(KEYWORD_AND_CONDITION);
        } else {
          first=false;
        }

        String name       = qc.getName();
        String value      = qc.getValue();
        String comparator = qc.getComparator();

        if (comparator.equals(COMPARATOR_TYPE__EXISTS) || comparator.equals(COMPARATOR_TYPE__NOT_EXISTS)) {

          query.append(name).append(SPACE).append(comparator);
        } else {

          boolean isNegativeCondition = comparator.startsWith(KEYWORD_NEGATIVE_CONDITION);
          if (isNegativeCondition) comparator = comparator.split(KEYWORD_NEGATIVE_CONDITION)[1];

          switch (qc.getType()) {
            case CONDITION_TYPE__STRUCT:
            case CONDITION_TYPE__MARKUP:
            case CONDITION_TYPE__STRING:
              if (!value.isEmpty()) {
                if (isNegativeCondition) query.append(KEYWORD_NEGATIVE_CONDITION);
                query.append(name).append(SPACE).append(comparator).append(SPACE).append(APOSTROPHE).append(value).append(APOSTROPHE);
              }
              break;
            case CONDITION_TYPE__INTEGER:
              if (!value.isEmpty()) {
                if (isNegativeCondition) query.append(KEYWORD_NEGATIVE_CONDITION);
                query.append(name).append(SPACE).append(comparator).append(SPACE).append(value);
              }
              break;
            case CONDITION_TYPE__BOOLEAN:
              if (!value.isEmpty()) {
                if (value.equals(KEYWORD_FALSE)) query.append(KEYWORD_NEGATIVE_CONDITION);
                query.append(name);
              }
              break;
            case CONDITION_TYPE__CONTENT_LINK:
              String referenceType = name.equals(PROPERTY_TYPE__REFERENCES) ? KEYWORD_REFERENCES : KEYWORD_REFERENCED_BY;
              if (!value.isEmpty()) {
                if (isNegativeCondition) query.append(KEYWORD_NEGATIVE_CONDITION);
                query.append(referenceType).append(KEYWORD_ID).append(APOSTROPHE).append(value).append(APOSTROPHE);
              } else {
                String referenceKey = name.equals(PROPERTY_TYPE__REFERENCES) ? KEYWORD_LINKS : KEYWORD_REFERENCED;
                query.append(KEYWORD_NEGATIVE_CONDITION).append(referenceKey);
              }
              break;
            case CONDITION_TYPE__FOLDER_LINK:
              if (!value.isEmpty()) {
                if (isNegativeCondition) query.append(KEYWORD_NEGATIVE_CONDITION);
                if (name.equals(KEYWORD_BELOW)) {
                  query.append(KEYWORD_BELOW + KEYWORD_PATH + APOSTROPHE).append(value).append(APOSTROPHE);
                } else {
                  query.append(name).append(SPACE).append(COMPARATOR_TYPE__EQUAL).append(KEYWORD_PATH).append(APOSTROPHE).append(value).append(APOSTROPHE);
                }
              }
              break;
            case CONDITION_TYPE__DATE:
              if (!value.isEmpty()) {
                if (isNegativeCondition) query.append(KEYWORD_NEGATIVE_CONDITION);
                query.append(name).append(SPACE).append(comparator).append(KEYWORD_DATE).append(APOSTROPHE).append(value).append(APOSTROPHE);
              }
              break;
            case CONDITION_TYPE__LINK:
            case CONDITION_TYPE__USER:
              if (!value.isEmpty()) {
                if (isNegativeCondition) query.append(KEYWORD_NEGATIVE_CONDITION);
                query.append(name).append(SPACE).append(comparator).append(KEYWORD_ID).append(APOSTROPHE).append(value).append(APOSTROPHE);
              }
              break;
            default:
              break;
          }
        }
      }
    }

    queryBase.append(!(query == null || "".equals(query)) ? " : "+ query.toString() : "");

    /* SORTING */
    int sSize = sorters.size();
    if (sSize > 0) {
      queryBase.append(KEYWORD_ORDER_BY);
      for (int q=0; q<sSize; q++) {
        GridSortData.GridSortValue qs = sorters.get(q);
        queryBase.append(qs.getProperty()).append(SPACE).append(qs.getDirection());
        if (q < sSize-1) queryBase.append(KEYWORD_ORDER_NEXT);
      }
    }

    /* LIMIT */
    if (limit>0) queryBase.append(KEYWORD_LIMIT_RESULTS).append(limit);
    return queryBase.toString();
  }

  private QueryData queryData;

  private String contentType;

  private boolean includeSubtypes;

  private int limit;

  private List<GridSortData.GridSortValue> sorters;

  public QueryData getQueryData() {
    return queryData;
  }

  public void setQueryData(QueryData queryData) {
    this.queryData = queryData;
  }

  public String getContentType() {
    return contentType;
  }

  public void setContentType(String contentType) {
    this.contentType = contentType;
  }

  public boolean isIncludeSubtypes() {
    return includeSubtypes;
  }

  public void setIncludeSubtypes(boolean includeSubtypes) {
    this.includeSubtypes = includeSubtypes;
  }

  public int getLimit() {
    return limit;
  }

  public void setLimit(int limit) {
    this.limit = limit;
  }

  public List<GridSortData.GridSortValue> getSorters() {
    return sorters;
  }

  public void setSorters(List<GridSortData.GridSortValue> sorters) {
    this.sorters = sorters;
  }
}
