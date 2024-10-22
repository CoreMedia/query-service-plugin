/*
 * Copyright (c) 2015 T-Systems Multimedia Solutions GmbH
 * Riesaer Str. 5, D-01129 Dresden, Germany
 * All rights reserved.
 */
package com.coremedia.labs.studio.rest.query;


/**
 * Value bean for Query Condition.
 *
 * @author dasc
 * @version $Id$
 */

public class QueryCondition {
  private String type;
  private String name;
  private String comparator;
  private String value;

  public QueryCondition(String type, String name, String comparator, String value) {
    this.type = type;
    this.name = name;
    this.comparator = comparator;
    this.value = value;
  }

  public QueryCondition() {
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getComparator() {
    return comparator;
  }

  public void setComparator(String comparator) {
    this.comparator = comparator;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }
}
