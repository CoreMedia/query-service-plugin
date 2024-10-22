/*
 * Copyright (c) 2016 T-Systems Multimedia Solutions GmbH
 * Riesaer Str. 5, D-01129 Dresden, Germany
 * All rights reserved.
 */
package com.coremedia.labs.studio.rest.query;


import java.util.List;

/**
 * Value bean to hold query results for the REST service.
 *
 * @author dasc
 * @version $Id$
 */

public class QueryResult {

  private List<Match> queryData;
  private Integer total;
  private Integer maxCount;

  public List<Match> getQueryData() {
    return queryData;
  }

  public void setQueryData(List<Match> queryData) {
    this.queryData = queryData;
  }

  public Integer getTotal() {
    return total;
  }

  public void setTotal(Integer total) {
    this.total = total;
  }

  public Integer getMaxCount() {
    return maxCount;
  }

  public void setMaxCount(Integer maxCount) {
    this.maxCount = maxCount;
  }
}
