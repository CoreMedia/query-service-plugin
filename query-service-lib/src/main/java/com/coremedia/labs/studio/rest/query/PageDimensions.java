/*
 * Copyright (c) 2016 T-Systems Multimedia Solutions GmbH
 * Riesaer Str. 5, D-01129 Dresden, Germany
 * All rights reserved.
 */
package com.coremedia.labs.studio.rest.query;


/**
 * POJO to represent the dimension of a page
 *
 * @author dasc
 * @version $Id$
 */

public class PageDimensions {

  private int start;

  private int end;

  public PageDimensions() {
    this.start = -1;
    this.end = -1;
  }

  public PageDimensions(int start, int end) {
    this.start = start;
    this.end = end;
  }

  public int getStart() {
    return start;
  }

  public void setStart(int start) {
    this.start = start;
  }

  public int getEnd() {
    return end;
  }

  public void setEnd(int end) {
    this.end = end;
  }
}
