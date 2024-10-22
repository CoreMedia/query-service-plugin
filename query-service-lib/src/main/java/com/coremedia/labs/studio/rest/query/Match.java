/*
 * Copyright (c) 2016 T-Systems Multimedia Solutions GmbH
 * Riesaer Str. 5, D-01129 Dresden, Germany
 * All rights reserved.
 */
package com.coremedia.labs.studio.rest.query;


/**
 * POJO to hold an entry for the free query result collection.
 *
 * @author dasc
 * @version $Id$
 */

public class Match {

  private Integer id;

  private String name;

  private String type;

  private String parent;

  private String editor;

  private Boolean isInProduction;

  private Boolean isDeleted;

  private Boolean isCheckedOut;

  private Boolean isApproved;

  private Boolean isPublished;

  public Match(
    Integer id,
    String name,
    String type,
    String parent,
    Boolean isInProduction,
    Boolean isDeleted,
    Boolean isCheckedOut,
    Boolean isApproved,
    Boolean isPublished,
    String editor
  ) {
    this.name = name;
    this.id = id;
    this.type = type;
    this.parent = parent;
    this.isInProduction = isInProduction;
    this.isDeleted = isDeleted;
    this.isCheckedOut = isCheckedOut;
    this.isApproved = isApproved;
    this.isPublished = isPublished;
    this.editor = editor;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public String getParent() {
    return parent;
  }

  public void setParent(String parent) {
    this.parent = parent;
  }

  public String getEditor() {
    return editor;
  }

  public void setEditor(String editor) {
    this.editor = editor;
  }

  public Boolean getInProduction() {
    return isInProduction;
  }

  public void setInProduction(Boolean inProduction) {
    isInProduction = inProduction;
  }

  public Boolean getDeleted() {
    return isDeleted;
  }

  public void setDeleted(Boolean deleted) {
    isDeleted = deleted;
  }

  public Boolean getCheckedOut() {
    return isCheckedOut;
  }

  public void setCheckedOut(Boolean checkedOut) {
    isCheckedOut = checkedOut;
  }

  public Boolean getApproved() {
    return isApproved;
  }

  public void setApproved(Boolean approved) {
    isApproved = approved;
  }

  public Boolean getPublished() {
    return isPublished;
  }

  public void setPublished(Boolean published) {
    isPublished = published;
  }
}
