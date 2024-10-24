/*
 * Copyright (c) 2015-2024 T-Systems Multimedia Solutions GmbH
 * Riesaer Str. 5, D-01129 Dresden, Germany
 * All rights reserved.
 */
import session from "@coremedia/studio-client.cap-rest-client/common/session";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import ContentCreateResult from "@coremedia/studio-client.cap-rest-client/content/ContentCreateResult";
import ContentErrorCodes from "@coremedia/studio-client.cap-rest-client/content/ContentErrorCodes";
import ContentProperties from "@coremedia/studio-client.cap-rest-client/content/ContentProperties";
import ContentType from "@coremedia/studio-client.cap-rest-client/content/ContentType";
import IssuesDetectedError from "@coremedia/studio-client.cap-rest-client/content/IssuesDetectedError";
import Struct from "@coremedia/studio-client.cap-rest-client/struct/Struct";
import User from "@coremedia/studio-client.cap-rest-client/user/User";
import StructSubBean from "@coremedia/studio-client.cap-rest-client-impl/common/impl/StructSubBean";
import RemoteBean from "@coremedia/studio-client.client-core/data/RemoteBean";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import RemoteError from "@coremedia/studio-client.client-core/data/error/RemoteError";
import RemoteServiceMethod from "@coremedia/studio-client.client-core-impl/data/impl/RemoteServiceMethod";
import RemoteServiceMethodResponse from "@coremedia/studio-client.client-core-impl/data/impl/RemoteServiceMethodResponse";
import ContentTypeSelectorBase from "@coremedia/studio-client.ext.cap-base-components/contenttypes/ContentTypeSelectorBase";
import EditorErrors_properties from "@coremedia/studio-client.ext.errors-validation-components/error/EditorErrors_properties";
import RemoteErrorHandlers from "@coremedia/studio-client.ext.errors-validation-components/error/RemoteErrorHandlers";
import IconButton from "@coremedia/studio-client.ext.ui-components/components/IconButton";
import RepositoryState from "@coremedia/studio-client.main.editor-components/sdk/collectionview/RepositoryState";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import MessageBoxUtil from "@coremedia/studio-client.main.editor-components/sdk/util/MessageBoxUtil";
import Ext from "@jangaroo/ext-ts";
import DateUtil from "@jangaroo/ext-ts/Date";
import Container from "@jangaroo/ext-ts/container/Container";
import JsonStore from "@jangaroo/ext-ts/data/JsonStore";
import Label from "@jangaroo/ext-ts/form/Label";
import Panel from "@jangaroo/ext-ts/panel/Panel";
import Toolbar from "@jangaroo/ext-ts/toolbar/Toolbar";
import SorterCollection from "@jangaroo/ext-ts/util/SorterCollection";
import { as, bind, is } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import int from "@jangaroo/runtime/int";
import QueryTool_properties from "../properties/QueryTool_properties";
import QueryCondition from "./QueryCondition";
import QueryPanel from "./QueryPanel";
import QueryToolTab from "./QueryToolTab";

interface QueryPanelBaseConfig extends Config<Panel> {
}

/**
 * Query Panel
 * Contains the controls of the query tool and the collection of the query conditions.
 *
 * @author dasc
 * @version $Id$
 */
class QueryPanelBase extends Panel {
  declare Config: QueryPanelBaseConfig;

  protected PROPERTY_TYPE_MAPPING: Record<string, any> = {};

  /**
   * Possible query parameters defined for QueryService.
   * Additional to the normal document properties of each contentType.
   */
  static readonly ADDITIONAL_QUERY_PARAM: Array<any> = [
    {
      name: "containsWideLink",
      type: "BOOLEAN",
    },
    {
      name: "REFERENCES",
      type: "CONTENT_LINK",
    },
    {
      name: "REFERENCED",
      type: "BOOLEAN",
    },
    {
      name: "REFERENCED_BY",
      type: "CONTENT_LINK",
    },
    {
      name: "BELOW",
      type: "FOLDER_LINK",
    },
    {
      name: "baseFolder",
      type: "FOLDER_LINK",
    },
    {
      name: "creationDate",
      type: "DATE",
    },
    {
      name: "creator",
      type: "USER",
    },
    {
      name: "editor",
      type: "USER",
    },
    {
      name: "id",
      type: "INTEGER",
    },
    {
      name: "isDeleted",
      type: "BOOLEAN",
    },
    {
      name: "isCheckedIn",
      type: "BOOLEAN",
    },
    {
      name: "isCheckedOut",
      type: "BOOLEAN",
    },
    {
      name: "isDocument",
      type: "BOOLEAN",
    },
    {
      name: "isFolder",
      type: "BOOLEAN",
    },
    {
      name: "isInProduction",
      type: "BOOLEAN",
    },
    {
      name: "isMoved",
      type: "BOOLEAN",
    },
    {
      name: "isNew",
      type: "BOOLEAN",
    },
    {
      name: "isPlaceApproved",
      type: "BOOLEAN",
    },
    {
      name: "isPublished",
      type: "BOOLEAN",
    },
    {
      name: "isRenamed",
      type: "BOOLEAN",
    },
    {
      name: "isToBeDeleted",
      type: "BOOLEAN",
    },
    {
      name: "isToBeWithdrawn",
      type: "BOOLEAN",
    },
    {
      name: "isUndeleted",
      type: "BOOLEAN",
    },
    {
      name: "lastParent",
      type: "FOLDER_LINK",
    },
    {
      name: "modificationDate",
      type: "DATE",
    },
    {
      name: "modifier",
      type: "USER",
    },
    {
      name: "name",
      type: "STRING",
    },
    {
      name: "parent",
      type: "FOLDER_LINK",
    },
    {
      name: "placeApprovalDate",
      type: "DATE",
    },
    {
      name: "placeApprover",
      type: "USER",
    },
    {
      name: "publicationDate",
      type: "DATE",
    },
    {
      name: "publicationName",
      type: "STRING",
    },
    {
      name: "publicationParent",
      type: "FOLDER_LINK",
    },
    {
      name: "publisher",
      type: "USER",
    },
    //mapping siehe: https://support.coremedia.com/hc/en-us/requests/47255
    {
      name: "versionApprovalDate",
      type: "DATE",
    },
    {
      name: "versionApprover",
      type: "USER",
    },
    {
      name: "versionIsApproved",
      type: "BOOLEAN",
    },
    {
      name: "versionPublicationDate",
      type: "DATE",
    },
    {
      name: "versionPublisher",
      type: "USER",
    },
    {
      name: "versionIsPublished",
      type: "BOOLEAN",
    },
    {
      name: "versionEditionDate",
      type: "DATE",
    },
  ];

  /* used Properties for QueryService:
   baseFolder
   containsWideLink
   creationDate
   creator
   editor
   id
   isDeleted
   isCheckedIn
   isCheckedOut
   isDocument
   isFolder
   isInProduction
   isMoved
   isNew
   isPlaceApproved
   isPublished
   isRenamed
   isToBeDeleted
   isToBeWithdrawn
   isUndeleted
   lastParent
   modificationDate
   modifier
   name
   parent
   placeApprovalDate
   placeApprover
   publicationDate
   publicationName
   publicationParent
   publisher
   versionApprovalDate
   versionApprover
   versionIsApproved
   versionIsPublished
   versionPublicationDate
   versionPublisher
   versionEditionDate
   */

  /* still unused Properties:
   checkedInVersion
   checkedOutVersion
   latestApprovedVersion
   latestPublishedVersion
   versionEditor
   version
   workingVersion
   */

  /**
   * Comparators defined for each parameter type.
   * Derived from sitemanager functionality.
   */
  static readonly QUERY_TYPE_COMPARATORS: Record<string, any> = {
    DATE: [
      {
        name: "LESS",
        value: "<",
      },
      {
        name: "GREATER",
        value: ">",
      },
      {
        name: "EXISTS",
        value: "IS NOT NULL",
      },
      {
        name: "NOT_EXISTS",
        value: "IS NULL",
      },
    ],
    STRING: [
      {
        name: "CONTAINS",
        value: "CONTAINS",
      },
      {
        name: "NOT_CONTAINS",
        value: "NOT CONTAINS",
      },
      {
        name: "EQUAL",
        value: "=",
      },
      {
        name: "NOT_EQUAL",
        value: "NOT =",
      },
      {
        name: "LESS",
        value: "<",
      },
      {
        name: "GREATER",
        value: ">",
      },
      {
        name: "EXISTS",
        value: "IS NOT NULL",
      },
      {
        name: "NOT_EXISTS",
        value: "IS NULL",
      },
    ],
    LINK: [
      {
        name: "REFERENCES",
        value: "REFERENCES",
      },
      {
        name: "NOT_REFERENCES",
        value: "NOT REFERENCES",
      },
      {
        name: "EXISTS",
        value: "IS NOT NULL",
      },
      {
        name: "NOT_EXISTS",
        value: "IS NULL",
      },
    ],
    CONTENT_LINK: [],
    FOLDER_LINK: [],
    INTEGER: [
      {
        name: "EQUAL",
        value: "=",
      },
      {
        name: "NOT_EQUAL",
        value: "NOT =",
      },
      {
        name: "LESS",
        value: "<",
      },
      {
        name: "GREATER",
        value: ">",
      },
      {
        name: "LESS_EQUAL",
        value: "<=",
      },
      {
        name: "GREATER_EQUAL",
        value: ">=",
      },
      {
        name: "EXISTS",
        value: "IS NOT NULL",
      },
      {
        name: "NOT_EXISTS",
        value: "IS NULL",
      },
    ],
    STRUCT: [
      {
        name: "CONTAINS",
        value: "CONTAINS",
      },
      {
        name: "NOT_CONTAINS",
        value: "NOT CONTAINS",
      },
      {
        name: "EXISTS",
        value: "IS NOT NULL",
      },
      {
        name: "NOT_EXISTS",
        value: "IS NULL",
      },
    ],
    MARKUP: [
      {
        name: "CONTAINS",
        value: "CONTAINS",
      },
      {
        name: "NOT_CONTAINS",
        value: "NOT CONTAINS",
      },
      {
        name: "EXISTS",
        value: "IS NOT NULL",
      },
      {
        name: "NOT_EXISTS",
        value: "IS NULL",
      },
    ],
    BOOLEAN: [
      {
        name: "EQUAL",
        value: "=",
      },
      {
        name: "EXISTS",
        value: "IS NOT NULL",
      },
      {
        name: "NOT_EXISTS",
        value: "IS NULL",
      },
    ],
    BOOLEAN_REFERENCED: [
      {
        name: "EQUAL",
        value: "=",
      },
    ],
    USER: [
      {
        name: "EQUAL",
        value: "=",
      },
      {
        name: "NOT_EQUAL",
        value: "NOT =",
      },
      {
        name: "EXISTS",
        value: "IS NOT NULL",
      },
      {
        name: "NOT_EXISTS",
        value: "IS NULL",
      },
    ],
    BLOB: [
      {
        name: "EXISTS",
        value: "IS NOT NULL",
      },
      {
        name: "NOT_EXISTS",
        value: "IS NULL",
      },
    ],
  };

  static readonly CONTENT_REPOSITORY_PREFIX: string = "coremedia:///cap/";

  static readonly SUFFIX_FILE_NAME: string = "_query";

  static readonly BUTTON_PREV_PAGE_ID: string = "prev-button";

  static readonly BUTTON_NEXT_PAGE_ID: string = "next-button";

  static readonly PAGING_LABEL_ITEM_ID: string = "paging-label";

  static readonly QUERY_PANEL_ID: string = "queryPanel";

  static readonly CONDITION_CONTAINER_ID: string = "conditionContainer";

  static readonly DATE_FORMAT_DOCUMENT_NAME: string = "ymd";

  static readonly DATE_FORMAT_SETTINGS: string = "Y-m-d\\TH:i:sP";

  #conditionsValueExpression: ValueExpression = null;

  #contentTypeValueExpression: ValueExpression = null;

  #loadCountValueExpression: ValueExpression = null;

  #maxCountValueExpression: ValueExpression = null;

  #pageValueExpression: ValueExpression = null;

  #queryDataValueExpression: ValueExpression = null;

  #sendQueryValueExpression: ValueExpression = null;

  #storeValueExpression: ValueExpression = null;

  #totalCountValueExpression: ValueExpression = null;

  #userValueExpression: ValueExpression = null;

  #userListValueExpression: ValueExpression = null;

  protected static docTypes: Array<any> = [
    {
      icon: "cm-core-icons cm-core-icons--folder",
      id: "query_folder",
      label: QueryTool_properties.folder_label,
      name: "Folder_",
    },
  ];

  #userArray: Array<any> = [];

  #userCount: int = 0;

  #userReadyCount: int = 0;

  #pagingLabel: Label = null;

  #prevPageButton: IconButton = null;

  #nextPageButton: IconButton = null;

  #conditionContainer: Container = null;

  #queryToolTab: QueryToolTab = null;

  #settingsConditionLoaded: boolean = false;

  constructor(config: Config<QueryPanel> = null) {
    super(config);

    this.#contentTypeValueExpression = config.contentTypeValueExpression;
    this.#contentTypeValueExpression.addChangeListener(bind(this, this.onContentTypeChange));

    this.#loadCountValueExpression = config.loadCountValueExpression;
    this.#maxCountValueExpression = config.maxCountValueExpression;
    this.#pageValueExpression = config.pageValueExpression;
    this.#queryDataValueExpression = config.queryDataValueExpression;
    this.#sendQueryValueExpression = config.sendQueryValueExpression;
    this.#storeValueExpression = config.storeValueExpression;
    this.#totalCountValueExpression = config.totalCountValueExpression;
    this.#userValueExpression = config.userValueExpression;

    this.#conditionsValueExpression = ValueExpressionFactory.createFromValue([]);

    this.#conditionContainer = as(this.queryById(QueryPanelBase.CONDITION_CONTAINER_ID), Container);

    if (!this.#userListValueExpression) this.#userListValueExpression = ValueExpressionFactory.createFromValue(undefined);
    this.#loadUsers();
  }

  protected getContentTypeData(): Array<any> {
    const data: Array<any> = ContentTypeSelectorBase.getAllContentTypeEntries();
    return QueryPanelBase.docTypes.concat(data);
  }

  /**
   * Reset the panel on change of contentType.
   * Different contentTypes have different document properties.
   *
   * There is a bug with triggering this event when loading the data from settings:
   * it is triggered to late so that the conditions are deleted right after beeing generetad.
   * Workaround is performing it dependent on the value of the Boolean 'settingsConditionLoaded'.
   */
  protected onContentTypeChange(): void {
    if (!this.#settingsConditionLoaded) {
      const conditions: Array<any> = this.#conditionsValueExpression.getValue();
      for (let q: number = 0; q < conditions.length; q++) {
        // @ts-ignore
        const condition: QueryCondition = as(conditions[q], QueryCondition);
        this.removeCondition(condition);
      }
      //set page back to initial value
      this.#pageValueExpression.setValue(1);
      this.clearSorters();
    } else {
      this.#settingsConditionLoaded = false;
    }
  }

  protected clearSorters(): void {
    const store: JsonStore = this.#storeValueExpression.getValue();
    if (store) {
      const sorters: SorterCollection = store.getSorters();
      if (sorters) {
        sorters.clear();
      }
    }
  }

  /**
   * Initialising ValueExpression
   * Contains a list of registered users of the CoreMedia Studio.
   *
   * @return ValueExpression
   */
  protected getUsersListValueExpression(): ValueExpression {
    if (!this.#userListValueExpression) {
      this.#userListValueExpression = ValueExpressionFactory.createFromValue(undefined);
    }
    return this.#userListValueExpression;
  }

  /**
   * Preparing sending the query via REST to the backend.
   * Writing the data from QueryConditions-components to an array of query data objects
   * and trigger sending from QueryToolTab-component via 'sendQueryValueExpression'.
   */
  protected sendQuery(): void {

    const queryData: Array<any> = [];
    const conditions: Array<any> = this.#conditionsValueExpression.getValue();
    for (let c: number = 0; c < conditions.length; c++) {

      const condition: QueryCondition = conditions[c];
      const conditionType: string = condition.getActiveType();
      let propertyValue: string = "";
      const propertyValueVEx: ValueExpression = condition.getPropertyValueVEx();

      switch (conditionType) {
      case "STRUCT":
      case "MARKUP":
      case "STRING":
      case "USER":
      case "BLOB":
        const sValue: string = propertyValueVEx.getValue();
        propertyValue = sValue ? sValue : propertyValue;
        break;
      case "INTEGER":
        const iValue: int = propertyValueVEx.getValue();
        propertyValue = iValue || iValue === 0 ? "" + iValue : propertyValue;
        break;
      case "BOOLEAN":
        propertyValue += propertyValueVEx.getValue();
        break;
      case "LINK":
      case "CONTENT_LINK":
        const cLinks: Array<any> = propertyValueVEx.extendBy("properties", "link").getValue();
        const cFirst: Content = cLinks[0];
        propertyValue = cFirst ? cFirst.getId() : propertyValue;
        break;
      case "FOLDER_LINK":
        const fLinks: Array<any> = propertyValueVEx.extendBy("properties", "link").getValue();
        const fFirst: Content = fLinks[0];
        propertyValue = fFirst ? fFirst.getPath() : propertyValue;
        break;
      case "DATE":
        propertyValue = DateUtil.format(as(propertyValueVEx.getValue(), Date), QueryPanelBase.DATE_FORMAT_SETTINGS);
        break;
      default: break;
      }

      queryData.push({
        type: conditionType,
        name: condition.getPropertyNameVEx().getValue(),
        comparator: condition.getComparatorVEx().getValue(),
        value: propertyValue,
      });
    }
    this.#queryDataValueExpression.setValue(queryData);
    this.#sendQueryValueExpression.setValue(true);
  }

  /**
   * Creates a QueryCondition component and calls addCondition()
   */
  protected addNewQueryCondition(): void {
    // @ts-ignore
    const condition: QueryCondition = Ext.create(QueryCondition, {
      docType: this.#contentTypeValueExpression.getValue(),
      userListValueExpression: this.getUsersListValueExpression(),
      propertyTypeMapping: this.PROPERTY_TYPE_MAPPING,
    });
    this.#addCondition(condition);
  }

  /**
   * Removes a QueryCondition-component from the array stored in 'conditionsValueExpression' and destroys it.
   * @param condition
   */
  removeCondition(condition: QueryCondition): void {
    const conditions: Array<any> = this.#conditionsValueExpression.getValue().slice(); //we need a copy to trigger the change handler

    for (let index: number = 0; index < conditions.length; index++) {
      if (conditions[index].itemId === condition.itemId) {
        conditions.splice(index, 1);
        this.#conditionsValueExpression.setValue(conditions);
        condition.destroy();
        this.updateLayout();
        break;
      }
    }
  }

  /**
   * Adds the QueryCondition-component to the array stored in 'conditionsValueExpression' and to the conditionsContainer-component.
   * @param condition
   */
  #addCondition(condition: QueryCondition): void {
    const conditions: Array<any> = this.#conditionsValueExpression.getValue().slice(); //we need a copy to trigger the change handler
    conditions.push(condition);
    this.#conditionsValueExpression.setValue(conditions);
    this.#conditionContainer.add(condition);
    this.updateLayout();
  }

  /**********************************
   ************** csv ***************
   **********************************/

  /**
   * Triggers the CSV-download of the QueryToolTab.
   */
  protected download(): void {
    if (!this.#queryToolTab) this.#queryToolTab = as(this.findParentByType(QueryToolTab.xtype), QueryToolTab);
    this.#queryToolTab.download();
  }

  /**********************************
   ************** save **************
   **********************************/

  /**
   * Returns a suggestion for a possible name for the settings-document to store the query data in
   *
   * @return [String] document name
   */
  protected static getInitialFileName(): string {
    return QueryPanelBase.getDateString() + QueryPanelBase.SUFFIX_FILE_NAME;
  }

  /**
   * Returns the actual date in format 'ymd'
   *
   * @return [String] Date in format 'ymd
   */
  protected static getDateString(): string {
    return DateUtil.format(new Date(), QueryPanelBase.DATE_FORMAT_DOCUMENT_NAME);
  }

  /**
   * Trigger saving the query data to a settings document in the home folder of the active user.
   * @param filename
   */
  protected saveQueryDataToSettings(filename: string): void {
    const user: User = this.#userValueExpression.getValue();
    const settingsType: ContentType = session._.getConnection().getContentRepository().getContentType("CMSettings");
    settingsType.create(user.getHomeFolder(), filename, bind(this, this.creationCallback));
  }

  /**
   * Callback function, that is called after the creation of the settings document.
   * Loading the content, that has just been created.
   * Opening the home folder of the user and opening the document in a background tab.
   * @param result
   */
  protected creationCallback(result: ContentCreateResult): void {
    const content = result.createdContent;
    if (content) {
      content.load(bind(this, this.loadSettings));
      // making the content visible
      // open it in a background tab
      editorContext._.getWorkAreaTabManager().openTabsForEntities([content], true);
      //open home folder of the user in library
      const state: RepositoryState = new RepositoryState();
      state.folder = as(this.#userValueExpression.getValue(), User).getHomeFolder();
      editorContext._.getCollectionViewManager().openRepository(state);
    } else {
      this.#failure(result.error);
    }
  }

  /**
   * Reacting to possible Errors thrown when loading the content fails.
   * @see com.coremedia.cms.editor.sdk.actions.NewContentActionBase.failure()
   * @param error
   */
  #failure(error: RemoteError): void {
    if (is(error, IssuesDetectedError)) {
      RemoteErrorHandlers.showIssues(as(error, IssuesDetectedError));
      // @ts-ignore
    } else if (error.errorCode === ContentErrorCodes.NOT_AUTHORIZED) {
      MessageBoxUtil.showError(
        EditorErrors_properties.notAuthorized_title,
        EditorErrors_properties.notAuthorized_message,
      );
    } else {
      MessageBoxUtil.showError(
        "HTTP Error",
        // @ts-ignore
        "HTTP Error: " + error.errorCode + " " + error.message,
      );
    }
    error.setHandled(true);
  }

  /**
   * Callback function that is called after the content has been loaded.
   * Loading the settings-property of the document to write the data to it.   *
   * @param content
   */
  protected loadSettings(content: Content): void {
    const properties: ContentProperties = content.getProperties();
    const remoteSettings: RemoteBean = as(properties.get("settings"), RemoteBean);
    remoteSettings.load(bind(this, this.writeDataToSettings));
  }

  /**
   * Writing the query data to the settings-property of the settings-document.
   * @param remoteSettings
   */
  protected writeDataToSettings(remoteSettings: RemoteBean): void {
    const settings: Struct = as(remoteSettings, Struct);

    settings.getType().addStructProperty("query");
    const query: StructSubBean = settings.get("query");
    query.getType().addStringProperty("contentType", 50, this.#contentTypeValueExpression.getValue());
    query.getType().addIntegerProperty("dataCount", this.#loadCountValueExpression.getValue());
    query.getType().addStructListProperty("querydata");

    const conditions: Array<any> = this.#conditionsValueExpression.getValue();
    for (let c: number = 0; c < conditions.length; c++) {

      const dataSet: Record<string, any> = {};
      const condition: QueryCondition = conditions[c];
      const conditionType: string = condition.getActiveType();
      dataSet["type"] = conditionType;
      dataSet["name"] = condition.getPropertyNameVEx().getValue();
      dataSet["comparator"] = condition.getComparatorVEx().getValue();

      const propertyValueVEx: ValueExpression = condition.getPropertyValueVEx();

      switch (conditionType) {
      case "STRUCT":
      case "MARKUP":
      case "STRING":
      case "USER":
      case "BLOB":
        const sValue: string = propertyValueVEx.getValue();
        dataSet["value"] = sValue ? sValue : "";
        break;
      case "INTEGER":
        const iValue: int = propertyValueVEx.getValue();
        dataSet["value"] = iValue ? iValue : 0;
        break;
      case "BOOLEAN":
        dataSet["value"] = propertyValueVEx.getValue();
        break;
        // if the link-property-fields are empty, the stored value will be a negative boolean - easier to handle
      case "LINK":
      case "CONTENT_LINK":
        const cLinks: Array<any> = propertyValueVEx.extendBy("properties", "link").getValue();
        dataSet["value"] = cLinks[0] ? cLinks[0] : false;
        break;
        // if the link-property-fields are empty, the stored value will be a negative boolean - easier to handle
      case "FOLDER_LINK":
        const fLinks: Array<any> = propertyValueVEx.extendBy("properties", "link").getValue();
        dataSet["value"] = fLinks[0] ? fLinks[0] : false;
        break;
      case "DATE":
        dataSet["value"] = as(propertyValueVEx.getValue(), Date);
        break;
      default:
        break;
      }

      query.addAt("querydata", c, dataSet);
    }
  }

  /**********************************
   ************** load **************
   **********************************/

  /**
   * Trigger the loading of the query data from a settings-document.
   * @param content
   */
  protected loadQueryDataFromSettings(content: Content): void {
    if (content) {
      content.load(bind(this, this.loadSettingsForImport));
    }
  }

  /**
   * Trigger the loading of the settings-property of the settings-document to read the query-data
   * @param content
   */
  protected loadSettingsForImport(content: Content): void {
    const props: ContentProperties = content.getProperties();
    const remoteSettings: RemoteBean = as(props.get("settings"), RemoteBean);
    remoteSettings.load(bind(this, this.createQueryFromSettings));
  }

  /**
   * Read the query data and deal with it:
   * Storing the data to different ValueExpressions, create the QueryCondition-components and add it to the panel.
   * @param remoteSettings
   */
  protected createQueryFromSettings(remoteSettings: RemoteBean): void {
    const settings: Struct = as(remoteSettings, Struct);

    settings.getType().addStructProperty("query");
    const query: StructSubBean = settings.get("query");

    //somehow the change of contentType is triggered after adding all conditions
    //so they are removed again, which leads to errors
    this.#contentTypeValueExpression.removeChangeListener(bind(this, this.onContentTypeChange));
    //trigger manually
    this.onContentTypeChange();
    if (this.#contentTypeValueExpression.getValue() != query.get("contentType")) this.#settingsConditionLoaded = true;
    if (query.getType().hasProperty("contentType")) this.#contentTypeValueExpression.setValue(query.get("contentType"));

    if (query.getType().hasProperty("dataCount")) this.#loadCountValueExpression.setValue(query.get("dataCount"));
    if (query.getType().hasProperty("querydata")) {

      const queryData: Array<any> = query.get("querydata");
      // we have to collect the conditions and add them at once - otherwise the change event is triggered too often
      for (let q: number = 0; q < queryData.length; q++) {
        const dataSet: StructSubBean = as(queryData[q], StructSubBean);
        // @ts-ignore
        const condition: QueryCondition = Ext.create(QueryCondition, {
          docType: this.#contentTypeValueExpression.getValue(),
          userListValueExpression: this.getUsersListValueExpression(),
          propertyTypeMapping: this.PROPERTY_TYPE_MAPPING,
          // data
          type: dataSet.get("type"),
          propertyName: dataSet.get("name"),
          comparator: dataSet.get("comparator"),
          value: dataSet.get("value"),
        });
        this.#addCondition(condition);
      }
    }

    //adding the change listener again
    this.#contentTypeValueExpression.addChangeListener(bind(this, this.onContentTypeChange));
  }

  /**********************************
   ************* paging *************
   **********************************/

  /**
   * Trigger navigating to the previous page.
   * Handling button-visibility.
   */
  protected pagePrev(): void {
    let page = this.#pageValueExpression.getValue();
    if (page > 1) {
      page -= 1;
      this.#pageValueExpression.setValue(page);

      // enable next-button
      this.disableNextButton(false);
    } else {
      //disable prev-button inactive
      this.disablePrevButton(true);
    }
  }

  /**
   * Trigger navigating to the next page.
   * Handling button-visibility.
   */
  protected pageNext(): void {
    const count = this.#maxCountValueExpression.getValue();
    const limit = this.#loadCountValueExpression.getValue();
    const pages: any = Math.ceil(count / limit);
    let page = this.#pageValueExpression.getValue();
    if (page < pages) {
      page += 1;
      this.#pageValueExpression.setValue(page);

      // enable prev-button
      this.disablePrevButton(false);
    } else {
      //disable next-button
      this.disableNextButton(true);
    }
  }

  /**
   * Handling visibility of the button 'to previous page'
   * @param disable
   */
  protected disablePrevButton(disable: boolean): void {
    if (!this.#prevPageButton) {
      const toolbar: Toolbar = as(this.getDockedItems("toolbar[dock=bottom]")[0], Toolbar);
      this.#prevPageButton = as(toolbar.queryById(QueryPanelBase.BUTTON_PREV_PAGE_ID), IconButton);
    }
    this.#prevPageButton.setDisabled(disable);
  }

  /**
   * Handling visibility of the button 'to next page'
   * @param disable
   */
  protected disableNextButton(disable: boolean): void {
    if (!this.#nextPageButton) {
      const toolbar: Toolbar = as(this.getDockedItems("toolbar[dock=bottom]")[0], Toolbar);
      this.#nextPageButton = as(toolbar.queryById(QueryPanelBase.BUTTON_NEXT_PAGE_ID), IconButton);
    }
    this.#nextPageButton.setDisabled(disable);
  }

  /**
   * Calculate the text of the paging-label and write it out.
   * Handling button-visibility.
   */
  writeLabel(): void {
    if (!this.#pagingLabel) {
      const toolbar: Toolbar = as(this.getDockedItems("toolbar[dock=bottom]")[0], Toolbar);
      this.#pagingLabel = as(toolbar.queryById(QueryPanelBase.PAGING_LABEL_ITEM_ID), Label);
    }

    const count = this.#maxCountValueExpression.getValue();
    const limit = this.#loadCountValueExpression.getValue();
    const page = this.#pageValueExpression.getValue();
    const total = this.#totalCountValueExpression.getValue();

    const pages: any = limit > 0 ? Math.ceil(count / limit) : 1;
    const base: any = (page - 1) * limit;

    let text: any = QueryTool_properties.paging_label_page + ": " + (total == 0 ? 0 : page) + "/" + pages;
    text += " (" + QueryTool_properties.paging_label_items + ": " + (total == 0 ? 0 : base + 1) + "-" + (base + total) + "/" + count + ")";

    this.#pagingLabel.setText(text);

    // handling buttons
    if (page == 1)
      this.disablePrevButton(true);
    else
      this.disablePrevButton(false);

    if (page == pages || total == 0)
      this.disableNextButton(true);
    else
      this.disableNextButton(false);
  }

  /**********************************
   *** load all users recursively ***
   **********************************/

  /**
   * Trigger the calculation of a list of registered users of CoreMedia Studio.
   * Recursive calculation, beginning with the base group. This group is loaded.
   */
  #loadUsers(): void {
    const remoteServiceMethod: RemoteServiceMethod = new RemoteServiceMethod("qsrest/users", "GET");
    const params: any = {};
    remoteServiceMethod.request(
      params,
      (response: RemoteServiceMethodResponse): void => {
        if (response && response.getResponseJSON() && is(response.getResponseJSON().items, Array)) {
          const users: Array<any> = as(response.getResponseJSON().items, Array);
          this.#userReadyCount = users.length;
          if (this.#userReadyCount > 0) {
            for (let u: int = 0; u < users.length; u++) {
              const user: User = users[u];
              if (is(user, User)) {
                user.load((user: User) => {
                  this.#userLoaded(user);
                });
              }
            }
          } else {
            this.#triggerReady();
          }
        }
      },
      (/*response: RemoteServiceMethodResponse*/): void => {
        // nothing
      },
    );
  }

  /**
   * Callback function, that is called after loading a user.
   * Storing the user to the list of users.
   * Stored as (JSON)-Object:
   * {
   *   name:    [String] name of the user
   *   uriPath: [String] path of the user in ContentRepository
   * }
   * @param user
   */
  #userLoaded(user: User): void {
    this.#userArray.push({
      name: user.getName(),
      uriPath: QueryPanelBase.CONTENT_REPOSITORY_PREFIX + user.getUriPath(),
    });
    this.#userCount += 1;
    this.#checkIfReady();
  }

  /**
   * Checks if all users have been loaded.
   * Therefor the handled groups are counted.
   */
  #checkIfReady(): void {
    if (this.#userCount === this.#userReadyCount) this.#triggerReady();
  }

  /**
   * When all users have been loaded, the userList is set as value of 'userListValueExpression'.
   */
  #triggerReady(): void {
    this.#userArray.sort(function(a: any, b: any): int {
      const x: String = a.name.toLowerCase();
      const y: String = b.name.toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });
    this.#userListValueExpression.setValue(this.#userArray);
  }
}

export default QueryPanelBase;
