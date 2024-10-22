/*
 * Copyright (c) 2018 T-Systems Multimedia Solutions GmbH
 * Riesaer Str. 5, D-01129 Dresden, Germany
 * All rights reserved.
 */
package com.coremedia.labs.studio.rest.common;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Generic json mapped class for sort data by studio grid panel
 *
 * @author wimo
 * @version $Id$
 */

public class GridSortData {
  private static final ObjectMapper jsonMapper = new ObjectMapper();

  private List<GridSortValue> sortData;

  public List<GridSortValue> getSortData() {
    return sortData;
  }

  public void setSortData(List<GridSortValue> sortData) {
    this.sortData = sortData;
  }

  /**
   * Parsing JSON-String from QueryParam
   * String is a JSON-Array of Sorter-Objects [1..n] or empty:
   * <p>
   * [
   * {
   * "property":  "property_value",
   * "direction": "direction_value"
   * },
   * { ... },
   * ...
   * ]
   */
  public GridSortData(String jsonString) {
    try {
      setSortData(Arrays.asList(jsonMapper.readValue(jsonString, GridSortValue[].class)));
    } catch (IOException e) {
      setSortData(Collections.emptyList());
    }
  }


  public static class GridSortValue {
    private String property;
    private String direction;

    public String getProperty() {
      return property;
    }

    public void setProperty(String property) {
      this.property = property;
    }

    public String getDirection() {
      return direction;
    }

    public void setDirection(String direction) {
      this.direction = direction;
    }
  }
}
