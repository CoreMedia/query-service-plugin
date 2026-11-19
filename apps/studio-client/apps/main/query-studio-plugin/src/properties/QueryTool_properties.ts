import { SvgIconUtil } from "@coremedia/studio-client.base-models";
import csvIcon from "../icons/csv.svg";
import fileSaveIcon from "../icons/file-save.svg";
import fileOpenIcon from "../icons/file-open.svg";
import { search } from "@coremedia/studio-client.common-icons";
import documentSearchIcon from "../icons/document-search.svg";

/**
 * Interface values for ResourceBundle "QueryTool".
 * @see QueryTool_properties#INSTANCE
 */
interface QueryTool_properties {

  Tab_QueryTool_title: string;
  Tab_QueryTool_icon: string;
  Action_showQueryTool_text: string;
  conditionTitle: string;
  empty_results_title: string;
  empty_results_text: string;
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
  button_add_condition_text: string;
  button_add_condition_tooltip: string;
  button_remove: string;
  button_send_text: string;
  button_send_tooltip: string;
  button_send_icon: string;
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
  button_page_first: string;
  button_page_prev: string;
  button_page_next: string;
  button_page_last: string;
  page_label: string;
  paging_label_items: string;
  paging_label_page: string;
  /**
   *csv
   */
  button_save_csv: string;
  button_save_csv_icon: string;
  button_query_configuration_menu: string;
  button_save: string;
  button_save_icon: string;
  button_load: string;
  button_load_icon: string;
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

  QueryPanel_title: string;
  QueryResultGrid_singleResult: string;
  QueryResultGrid_multipleResults: string;

  QueryStringPropertyField_emptyText: string;
  QueryIntegerPropertyField_emptyText: string;
}

/**
 * Singleton for the current user Locale's instance of ResourceBundle "QueryTool".
 * @see QueryTool_properties
 */
const QueryTool_properties: QueryTool_properties = {
  QueryPanel_title: "Query for",
  QueryResultGrid_singleResult: "{0} Result",
  QueryResultGrid_multipleResults: "{0} Results",
  Tab_QueryTool_title: "Query Tool",
  Tab_QueryTool_icon: SvgIconUtil.getIconStyleClassForSvgIcon(documentSearchIcon),
  Action_showQueryTool_text: "Query Tool",
  conditionTitle: "Query Condition",
  empty_results_title: "No query results",
  empty_results_text: "Run a query or adjust its conditions to find results.",
  column_status_title: "Status",
  column_doctype_title: "DocType",
  column_id_title: "Content ID",
  column_title_title: "Content Title",
  column_path_title: "Path",
  label_showInLibrary: "Show in library",
  label_undelete: "Undelete",
  folder_label: "Folder",
  button_add_condition_text: "Add Query Condition ...",
  button_add_condition_tooltip: "Add a new query condition",
  button_remove: "Remove query condition",
  button_send_text: "Run Query",
  button_send_tooltip: "Run query with the current conditions",
  button_send_icon: SvgIconUtil.getIconStyleClassForSvgIcon(search),
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
  button_page_first: "Show first page",
  button_page_prev: "show previous page",
  button_page_next: "show next page",
  button_page_last: "Show last page",
  page_label: "/ 0 (items: 0-0/0)",
  paging_label_items: "items",
  paging_label_page: "page",
  button_save_csv: "Export query results as CSV",
  button_save_csv_icon: SvgIconUtil.getIconStyleClassForSvgIcon(csvIcon),
  button_query_configuration_menu: "Query configuration actions",
  button_save: "Save Query Configuration",
  button_save_icon: SvgIconUtil.getIconStyleClassForSvgIcon(fileSaveIcon),
  button_load: "Load Query Configuration",
  button_load_icon: SvgIconUtil.getIconStyleClassForSvgIcon(fileOpenIcon),
  dialog_save_title: "Save Query Configuration",
  textField_name_label: "name of the query-data file",
  button_dialog_save: "Save",
  dialog_load_title: "Load Query Configuration",
  button_dialog_load: "Load",
  QueryStringPropertyField_emptyText: "Enter text here.",
  QueryIntegerPropertyField_emptyText: "Enter a number here.",
};

export default QueryTool_properties;
