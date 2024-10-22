
/**
 * Interface values for ResourceBundle "QueryTool".
 * @see QueryTool_properties#INSTANCE
 */
interface QueryTool_properties {

  Tab_QueryTool_title: string;
  Action_showQueryTool_text: string;
  conditionTitle: string;
/**
 *grid columns
 */
  column_status_title: string;
  column_doctype_title: string;
  column_id_title: string;
  column_title_title: string;
  column_path_title: string;
/**
 *action
 */
  label_showInLibrary: string;
  label_undelete: string;
/**
 *docTypes
 */
  folder_label: string;
/**
 *toolbar
 */
  button_new: string;
  button_remove: string;
  button_send: string;
  checkbox_subtypes: string;
  combo_loadcount_label: string;
/**
 *properties
 */
  REFERENCED: string;
  REFERENCES: string;
  REFERENCED_BY: string;
  BELOW: string;
  baseFolder: string;
  containsWideLink: string;
  creationDate: string;
  creator: string;
  editor: string;
  id: string;
  isDeleted: string;
  isCheckedIn: string;
  isCheckedOut: string;
  isDocument: string;
  isFolder: string;
  isInProduction: string;
  isMoved: string;
  isNew: string;
  isPlaceApproved: string;
  isRenamed: string;
  isToBeDeleted: string;
  isToBeWithdrawn: string;
  isUndeleted: string;
  lastParent: string;
  modificationDate: string;
  modifier: string;
  name: string;
  parent: string;
  placeApprovalDate: string;
  placeApprover: string;
  publicationName: string;
  publicationParent: string;
/**
 *mapping siehe: https://support.coremedia.com/hc/en-us/requests/47255
 */
  publicationDate: string;
  publisher: string;
  isPublished: string;
  versionApprovalDate: string;
  versionApprover: string;
  versionIsApproved: string;
  versionIsPublished: string;
  versionPublicationDate: string;
  versionPublisher: string;
  versionEditionDate: string;
/**
 *comparator options
 */
  CONTAINS: string;
  NOT_CONTAINS: string;
  EQUAL: string;
  NOT_EQUAL: string;
  LESS: string;
  GREATER: string;
  LESS_EQUAL: string;
  GREATER_EQUAL: string;
  EXISTS: string;
  NOT_EXISTS: string;
/**
 *REFERENCES=references
 */
  NOT_REFERENCES: string;
/**
 *status
 */
  prod: string;
  cout: string;
  appr: string;
  publ: string;
  del: string;
  label_me: string;
/**
 *paging
 */
  button_page_prev: string;
  button_page_next: string;
  page_label: string;
  paging_label_items: string;
  paging_label_page: string;
/**
 *csv
 */
  button_save_csv: string;
  button_save: string;
  button_load: string;
/**
 *save dialog
 */
  dialog_save_title: string;
  textField_name_label: string;
  button_dialog_save: string;
/**
 *load dialog
 */
  dialog_load_title: string;
  button_dialog_load: string;
}

/**
 * Singleton for the current user Locale's instance of ResourceBundle "QueryTool".
 * @see QueryTool_properties
 */
const QueryTool_properties: QueryTool_properties = {
  Tab_QueryTool_title: "Query Tool",
  Action_showQueryTool_text: "Query Tool",
  conditionTitle: "Query Condition",
  column_status_title: "Status",
  column_doctype_title: "DocType",
  column_id_title: "Content ID",
  column_title_title: "Content Title",
  column_path_title: "Path",
  label_showInLibrary: "Show in library",
  label_undelete: "Undelete",
  folder_label: "Folder",
  button_new: "add new query condition",
  button_remove: "remove query condition",
  button_send: "send query",
  checkbox_subtypes: "Include subtypes",
  combo_loadcount_label: "Number of items to load:",
  REFERENCED: "is referenced",
  REFERENCES: "references",
  REFERENCED_BY: "is referenced by",
  BELOW: "path",
  baseFolder: "base folder of the site",
  containsWideLink: "contains references across sites",
  creationDate: "creation date",
  creator: "creator",
  editor: "editor",
  id: "content id",
  isDeleted: "deleted",
  isCheckedIn: "checked in",
  isCheckedOut: "checked out",
  isDocument: "is a document",
  isFolder: "is a folder",
  isInProduction: "in production",
  isMoved: "moved",
  isNew: "new",
  isPlaceApproved: "place is approved",
  isRenamed: "renamed",
  isToBeDeleted: "to be deleted",
  isToBeWithdrawn: "marked for withdrawel",
  isUndeleted: "undeleted",
  lastParent: "last parent folder (before deletion)",
  modificationDate: "modification date",
  modifier: "modifier",
  name: "name",
  parent: "parent folder",
  placeApprovalDate: "place approval date",
  placeApprover: "place approver",
  publicationName: "publication name",
  publicationParent: "parent folder at publication time",
  publicationDate: "place publication date",
  publisher: "place publisher",
  isPublished: "place is published",
  versionApprovalDate: "approval date",
  versionApprover: "approver",
  versionIsApproved: "is approved",
  versionIsPublished: "is published",
  versionPublicationDate: "publication date",
  versionPublisher: "publisher",
  versionEditionDate: "edition date",
  CONTAINS: "contains",
  NOT_CONTAINS: "does not contain",
  EQUAL: "equal",
  NOT_EQUAL: "not equal",
  LESS: "less than",
  GREATER: "greater than",
  LESS_EQUAL: "less equal than",
  GREATER_EQUAL: "greater equal than",
  EXISTS: "exist(s)",
  NOT_EXISTS: "do(es) not exist",
  NOT_REFERENCES: "do(es) not reference",
  prod: "In Production",
  cout: "Checked out by",
  appr: "Approved",
  publ: "Published",
  del: "Deleted",
  label_me: "me",
  button_page_prev: "show previous page",
  button_page_next: "show next page",
  page_label: "page 0/0 (items: 0-0/0)",
  paging_label_items: "items",
  paging_label_page: "page",
  button_save_csv: "export query results - CSV",
  button_save: "save query configuration",
  button_load: "load query configuration",
  dialog_save_title: "Save query configuration",
  textField_name_label: "name of the query-data file",
  button_dialog_save: "Save",
  dialog_load_title: "Load query configuration",
  button_dialog_load: "Load",
};

export default QueryTool_properties;
