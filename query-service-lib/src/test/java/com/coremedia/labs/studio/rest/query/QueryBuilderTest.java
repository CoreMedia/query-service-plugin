package com.coremedia.labs.studio.rest.query;

import com.coremedia.amaro.query.ASTBuilder;
import com.coremedia.amaro.query.QueryAST;
import com.coremedia.amaro.query.QueryParser;
import com.coremedia.amaro.query.QueryTypeChecker;
import com.coremedia.cap.content.Content;
import com.coremedia.cap.content.ContentRepository;
import com.coremedia.labs.studio.rest.BeanNames;
import com.coremedia.labs.studio.rest.context.QueryTestConfiguration;
import org.apache.commons.lang3.StringUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Collection;
import java.util.List;

import static com.coremedia.labs.studio.rest.BeanNames.CMArticle;
import static com.coremedia.labs.studio.rest.BeanNames.CMTeasable;
import static org.junit.Assert.assertTrue;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {
  QueryTestConfiguration.class
})
public class QueryBuilderTest {

  @Autowired
  private ContentRepository repository;

  private QueryBuilder builder;

  private QueryParser parser;

  private QueryTypeChecker typeChecker;

  private ASTBuilder astBuilder;

  @Before
  public void setup() {
    builder = new QueryBuilder();
    parser = new QueryParser();
    typeChecker = new QueryTypeChecker(repository);
    astBuilder = new ASTBuilder();
  }

  // Not testable with XmlUapi, due to bug:
  // @see https://support.coremedia.com/hc/en-us/requests/85118
  // @Test
  public void testId() {
    QueryData data = new QueryData();

    data.setConditions(List.of(getContentIdCondition()));
    Collection<Content> queryResult = testQuery(data, null);
    assertTrue(queryResult != null && queryResult.isEmpty());
  }

  @Test // Integer
  public void testNotSearchable() {
    QueryData data = new QueryData();

    data.setConditions(List.of(getNotSearchableCondition(false, false)));
    Collection<Content> queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 1);

    data.setConditions(List.of(getNotSearchableCondition(true, false)));
    queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 13);

    data.setConditions(List.of(getNotSearchableCondition(false, true)));
    queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 12);

    data.setConditions(List.of(getNotSearchableCondition(true, true)));
    queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 2);
  }

  @Test //String
  public void testTeaserTitle() {
    QueryData data = new QueryData();

    data.setConditions(List.of(getTeaserTitleCondition(false, false)));
    Collection<Content> queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 3);

    data.setConditions(List.of(getTeaserTitleCondition(true, false)));
    queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 11);

    data.setConditions(List.of(getTeaserTitleCondition(false, true)));
    queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 9);

    data.setConditions(List.of(getTeaserTitleCondition(true, true)));
    queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 5);
  }

  @Test //Boolean, special case REFERENCED
  public void testReferenced() {
    QueryData data = new QueryData();

    data.setConditions(List.of(getReferencedCondition(false)));
    Collection<Content> queryResult = testQuery(data, null);
    assertTrue(queryResult != null && queryResult.size() == 4);

    data.setConditions(List.of(getReferencedCondition(true)));
    queryResult = testQuery(data, null);
    assertTrue(queryResult != null && queryResult.size() == 15);

    // REFERENCED is not combinable with NULL in queries
  }

  @Test //Boolean
  public void testIsDocument() {
    QueryData data = new QueryData();

    data.setConditions(List.of(getIsDocumentCondition(false, false)));
    Collection<Content> queryResult = testQuery(data, null);
    assertTrue(queryResult != null && queryResult.size() == 19);

    data.setConditions(List.of(getIsDocumentCondition(true, false)));
    queryResult = testQuery(data, null);
    assertTrue(queryResult != null && queryResult.isEmpty());

    // Boolean properties are usually combinable with null, but as they are some kind of document status properties, they are always set.
    data.setConditions(List.of(getIsDocumentCondition(false, true)));
    queryResult = testQuery(data, null);
    assertTrue(queryResult != null && queryResult.isEmpty());

    data.setConditions(List.of(getIsDocumentCondition(true, true)));
    queryResult = testQuery(data, null);
    assertTrue(queryResult != null && queryResult.size() == 19);
  }

  @Test //Date
  public void testValidFromDate() {
    QueryData data = new QueryData();

    data.setConditions(List.of(getValidFromDateCondition(false, false)));
    Collection<Content> queryResult = testQuery(data, CMTeasable);
    assertTrue(queryResult != null && queryResult.size() == 1);

    data.setConditions(List.of(getValidFromDateCondition(true, false)));
    queryResult = testQuery(data, CMTeasable);
    assertTrue(queryResult != null && queryResult.size() == 16);

    data.setConditions(List.of(getValidFromDateCondition(false, true)));
    queryResult = testQuery(data, CMTeasable);
    assertTrue(queryResult != null && queryResult.size() == 16);

    data.setConditions(List.of(getValidFromDateCondition(true, true)));
    queryResult = testQuery(data, CMTeasable);
    assertTrue(queryResult != null && queryResult.size() == 1);
  }

  @Test //Settings
  public void testLocalSettings() {
    QueryData data = new QueryData();

    data.setConditions(List.of(getLocalSettingsCondition(false, false)));
    Collection<Content> queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 1);

    data.setConditions(List.of(getLocalSettingsCondition(true, false)));
    queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 13);

    data.setConditions(List.of(getLocalSettingsCondition(false, true)));
    queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 12);

    data.setConditions(List.of(getLocalSettingsCondition(true, true)));
    queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 2);
  }

  @Test //Markup
  public void testTeaserText() {
    QueryData data = new QueryData();

    data.setConditions(List.of(getTeaserTextCondition(false, false)));
    Collection<Content> queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 1);

    data.setConditions(List.of(getTeaserTextCondition(true, false)));
    queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 13);

    data.setConditions(List.of(getTeaserTextCondition(false, true)));
    queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 13);

    data.setConditions(List.of(getTeaserTextCondition(true, true)));
    queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 1);
  }

  @Test //Link
  public void testSubjectTaxonomy() {
    QueryData data = new QueryData();

    data.setConditions(List.of(getSubjectTaxonomyCondition(false, false)));
    Collection<Content> queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 2);

    data.setConditions(List.of(getSubjectTaxonomyCondition(true, false)));
    queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 12);

    data.setConditions(List.of(getSubjectTaxonomyCondition(false, true)));
    queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 12);

    data.setConditions(List.of(getSubjectTaxonomyCondition(true, true)));
    queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 2);
  }

  @Test //Content Link
  public void testContentLink() {
    QueryData data = new QueryData();

    data.setConditions(List.of(getContentLinkCondition()));
    Collection<Content> queryResult = testQuery(data, null);
    assertTrue(queryResult != null && queryResult.size() == 2);
  }

  @Test //Folder Link
  public void testFolderLink() {
    QueryData data = new QueryData();

    data.setConditions(List.of(getFolderLinkCondition()));
    Collection<Content> queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 6);
  }

  @Test //Folder Link
  public void testCombinedConditions() {
    QueryData data = new QueryData();

    data.setConditions(
      List.of(
        getFolderLinkCondition(),
        getTeaserTitleCondition(true, false),
        getNotSearchableCondition(true, false),
        getLocalSettingsCondition(false, false),
        getTeaserTextCondition(true, false),
        getSubjectTaxonomyCondition(false, false)
      )
    );

    Collection<Content> queryResult = testQuery(data, CMArticle);
    assertTrue(queryResult != null && queryResult.size() == 1);
  }

  private Collection<Content> testQuery(QueryData data, String contentType) {
    boolean errorFree = true;
    builder.setQueryData(data);
    builder.setContentType(StringUtils.isEmpty(contentType) ? QueryBuilder.DEFAULT_CONTENT_TYPE : contentType);
    String query = builder.buildQuery();
    try {
      QueryAST ast = parser.parse(query, astBuilder);
      typeChecker.check(ast, null);
    } catch (Exception ex) {
      errorFree = false;
    }
    assertTrue(errorFree);
    return repository.getQueryService().poseContentQuery(query);
  }

  private static final String TEST__NEGATIVE_CONDITION = "NOT ";
  private static final String TEST__NULL_CONDITION = "IS NULL";
  private static final String TEST__NOT_NULL_CONDITION = "IS NOT NULL";

  private QueryCondition getContentIdCondition() {
    return new QueryCondition("INTEGER", "id", ">", "10000");
  }

  private QueryCondition getNotSearchableCondition(boolean negate, boolean isNull) {
    return new QueryCondition(
      "INTEGER",
            BeanNames.NOT_SEARCHABLE,
      (negate ? (isNull ? TEST__NOT_NULL_CONDITION : TEST__NEGATIVE_CONDITION) : "") + (isNull ? (negate ? "" : TEST__NULL_CONDITION) : "="),
      isNull ? "" : "1"
    );
  }

  private QueryCondition getTeaserTitleCondition(boolean negate, boolean isNull) {
    return new QueryCondition(
      "STRING",
            BeanNames.TEASER_TITLE,
      (negate ? (isNull ? TEST__NOT_NULL_CONDITION : TEST__NEGATIVE_CONDITION) : "") + (isNull ? (negate ? "" : TEST__NULL_CONDITION) : "CONTAINS"),
      isNull ? "" : "article"
    );
  }

  private QueryCondition getReferencedCondition(boolean negate) {
    return new QueryCondition(
      "BOOLEAN",
      "REFERENCED",
      "=",
      negate ? "false" : "true"
    );
  }

  private QueryCondition getIsDocumentCondition(boolean negate, boolean isNull) {
    return new QueryCondition(
      "BOOLEAN",
      "isDocument",
      isNull ? (negate ? TEST__NOT_NULL_CONDITION : TEST__NULL_CONDITION) : "=",
      isNull ? "" : (negate ? "false" : "true")
    );
  }

  private QueryCondition getValidFromDateCondition(boolean negate, boolean isNull) {
    return new QueryCondition(
      "DATE",
      BeanNames.VALID_FROM,
      negate ? (isNull ? TEST__NOT_NULL_CONDITION : "<") : (isNull ? TEST__NULL_CONDITION : ">"),
      isNull ? "" : "2005-01-01T00:00:00+02:00"
    );
  }

  private QueryCondition getLocalSettingsCondition(boolean negate, boolean isNull) {
    return new QueryCondition(
      "STRUCT",
      BeanNames.LOCAL_SETTINGS,
      (negate ? (isNull ? TEST__NOT_NULL_CONDITION : TEST__NEGATIVE_CONDITION) : "") + (isNull ? (negate ? "" : TEST__NULL_CONDITION) : "CONTAINS"),
      isNull ? "" : "string list"
    );
  }

  private QueryCondition getTeaserTextCondition(boolean negate, boolean isNull) {
    return new QueryCondition(
      "MARKUP",
            BeanNames.TEASER_TEXT,
      (negate ? (isNull ? TEST__NOT_NULL_CONDITION : TEST__NEGATIVE_CONDITION) : "") + (isNull ? (negate ? "" : TEST__NULL_CONDITION) : "CONTAINS"),
      isNull ? "" : "teaserText"
    );
  }

  private QueryCondition getSubjectTaxonomyCondition(boolean negate, boolean isNull) {
    return new QueryCondition(
      "LINK",
      BeanNames.SUBJECT_TAXONOMY,
      (negate ? (isNull ? TEST__NOT_NULL_CONDITION : TEST__NEGATIVE_CONDITION) : "") + (isNull ? (negate ? "" : TEST__NULL_CONDITION) : "REFERENCES"),
      isNull ? "" : "coremedia:///cap/content/76"
    );
  }

  private QueryCondition getContentLinkCondition() {
    return new QueryCondition(
      "CONTENT_LINK",
      "REFERENCES",
      "",
      "coremedia:///cap/content/76"
    );
  }

  private QueryCondition getFolderLinkCondition() {
    return new QueryCondition(
      "FOLDER_LINK",
      "BELOW",
      "",
      "/Content Test"
    );
  }
}
