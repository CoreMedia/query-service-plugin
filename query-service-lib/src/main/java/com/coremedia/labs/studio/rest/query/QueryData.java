/*
 * Copyright (c) 2015 T-Systems Multimedia Solutions GmbH
 * Riesaer Str. 5, D-01129 Dresden, Germany
 * All rights reserved.
 */
package com.coremedia.labs.studio.rest.query;

import com.fasterxml.jackson.databind.ObjectMapper;


import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Value bean for the list of query conditions.
 * Sent via JSON-String as QueryParam.
 *
 * @author dasc
 * @version $Id$
 */

public class QueryData {

  private static final String PARAM_TYPE = "type";
  private static final String PARAM_NAME = "name";
  private static final String PARAM_COMPARATOR = "comparator";
  private static final String PARAM_VALUE = "value";

  private static final ObjectMapper jsonMapper = new ObjectMapper();

  /**
   * Parsing JSON-String from QueryParam
   * String is a JSON-Array of query conditions [1..n] or empty:
   * <p>
   * [
   * {
   * "type":       "type_value",
   * "name":       "name_value"
   * "comparator": "comparator_value",
   * "value":      "value_value"
   * },
   * { ... },
   * ...
   * ]
   *
   * @param jsonQueryParam [String]
   */
  public QueryData(String jsonQueryParam) {
    try {
      setConditions(Arrays.asList(jsonMapper.readValue(jsonQueryParam, QueryCondition[].class)));
    } catch (IOException e) {
      setConditions(Collections.emptyList());
    }
  }

  public QueryData() {
  }

  private List<QueryCondition> conditions;

  public List<QueryCondition> getConditions() {
    return conditions;
  }

  public void setConditions(List<QueryCondition> conditions) {
    this.conditions = conditions;
  }
}
