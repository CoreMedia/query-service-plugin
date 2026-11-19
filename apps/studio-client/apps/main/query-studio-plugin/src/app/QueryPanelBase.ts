/*
 * Copyright (c) 2015-2024 T-Systems Multimedia Solutions GmbH
 * Riesaer Str. 5, D-01129 Dresden, Germany
 * All rights reserved.
 */
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import User from "@coremedia/studio-client.cap-rest-client/user/User";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import RemoteServiceMethod from "@coremedia/studio-client.client-core/data/impl/RemoteServiceMethod";
import RemoteServiceMethodResponse from "@coremedia/studio-client.client-core/data/impl/RemoteServiceMethodResponse";
import DateUtil from "@jangaroo/ext-ts/Date";
import Container from "@jangaroo/ext-ts/container/Container";
import JsonStore from "@jangaroo/ext-ts/data/JsonStore";
import Panel from "@jangaroo/ext-ts/panel/Panel";
import SorterCollection from "@jangaroo/ext-ts/util/SorterCollection";
import { as, bind, is } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import int from "@jangaroo/runtime/int";
import QueryTool_properties from "../properties/QueryTool_properties";
import QueryCondition from "./QueryCondition";
import QueryPanel from "./QueryPanel";
import QueryToolTab from "./QueryToolTab";
import { getAllContentTypeEntries } from "@coremedia/studio-client.cap-base-models/contenttypes/contentTypes";
import QueryToolManager, { type QueryConfiguration } from "../QueryToolManager";

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

  protected PROPERTY_TYPE_MAPPING: Record<string, string> = {};

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

  static readonly QUERY_PANEL_ID: string = "queryPanel";

  static readonly CONDITION_CONTAINER_ID: string = "conditionContainer";

  static readonly DATE_FORMAT_SETTINGS: string = "Y-m-d\\TH:i:sP";

  #conditionsValueExpression: ValueExpression<QueryCondition[]> = null;

  #contentTypeValueExpression: ValueExpression = null;

  #loadCountValueExpression: ValueExpression = null;

  #maxCountValueExpression: ValueExpression = null;

  #pageValueExpression: ValueExpression = null;

  #queryDataValueExpression: ValueExpression = null;

  #sendQueryValueExpression: ValueExpression = null;

  #storeValueExpression: ValueExpression = null;

  #totalCountValueExpression: ValueExpression = null;

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

  #conditionContainer: Container = null;

  #queryToolTab: QueryToolTab = null;

  #conditionContentType: string;

  constructor(config: Config<QueryPanel> = null) {
    super(config);

    this.#contentTypeValueExpression = config.contentTypeValueExpression;
    this.#conditionContentType = this.#contentTypeValueExpression.getValue();
    this.#contentTypeValueExpression.addChangeListener(bind(this, this.onContentTypeChange));

    this.#loadCountValueExpression = config.loadCountValueExpression;
    this.#maxCountValueExpression = config.maxCountValueExpression;
    this.#pageValueExpression = config.pageValueExpression;
    this.#queryDataValueExpression = config.queryDataValueExpression;
    this.#sendQueryValueExpression = config.sendQueryValueExpression;
    this.#storeValueExpression = config.storeValueExpression;
    this.#totalCountValueExpression = config.totalCountValueExpression;
    this.#conditionsValueExpression = ValueExpressionFactory.createFromValue([]);

    this.#conditionContainer = as(this.queryById(QueryPanelBase.CONDITION_CONTAINER_ID), Container);

    if (!this.#userListValueExpression) this.#userListValueExpression = ValueExpressionFactory.createFromValue(undefined);
    this.#loadUsers();
  }

  protected getContentTypeData(): Array<any> {
    const data: Array<any> = getAllContentTypeEntries();
    return QueryPanelBase.docTypes.concat(data);
  }

  protected onContentTypeChange(): void {
    const contentType = this.#contentTypeValueExpression.getValue();
    if (contentType !== this.#conditionContentType) {
      this.#conditionContentType = contentType;
      this.#resetConditions();
    }
  }

  #resetConditions(): void {
    for (const condition of this.getQueryConditions()) {
      this.removeCondition(condition);
    }
    this.#pageValueExpression.setValue(1);
    this.clearSorters();
  }

  protected override onDestroy(): void {
    this.#contentTypeValueExpression.removeChangeListener(bind(this, this.onContentTypeChange));
    super.onDestroy();
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
    const condition = new QueryCondition({
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
   * Adds the QueryCondition-component to 'conditionsValueExpression' and inserts it before the add-condition button container.
   * @param condition
   */
  #addCondition(condition: QueryCondition): void {
    const conditions: Array<any> = this.#conditionsValueExpression.getValue().slice(); //we need a copy to trigger the change handler
    conditions.push(condition);
    this.#conditionsValueExpression.setValue(conditions);
    this.#conditionContainer.insert(conditions.length - 1, condition);
    this.updateLayout();
  }

  /**********************************
   ************** csv ***************
   **********************************/

  /**
   * Triggers the CSV-download of the QueryToolTab.
   */
  protected download(): void {
    QueryToolManager.getInstance().download();
  }

  protected getQueryConditions(): readonly QueryCondition[] {
    return this.#conditionsValueExpression.getValue();
  }

  protected applyQueryConfiguration(configuration: QueryConfiguration): void {
    if (this.destroyed) {
      return;
    }

    this.#resetConditions();
    if (configuration.contentType !== undefined) {
      this.#contentTypeValueExpression.setValue(configuration.contentType);
    }
    if (configuration.loadCount !== undefined) {
      this.#loadCountValueExpression.setValue(configuration.loadCount);
    }

    // The deferred notification must not clear controls already built for this type.
    this.#conditionContentType = this.#contentTypeValueExpression.getValue();
    for (const data of configuration.conditions) {
      this.#addCondition(new QueryCondition({
        docType: this.#conditionContentType,
        userListValueExpression: this.getUsersListValueExpression(),
        propertyTypeMapping: this.PROPERTY_TYPE_MAPPING,
        type: data.type,
        propertyName: data.name,
        comparator: data.comparator,
        value: data.value,
      }));
    }
  }

  /**********************************
   *** load all users recursively ***
   **********************************/

  /**
   * Trigger the calculation of a list of registered users of CoreMedia Studio.
   * Recursive calculation, beginning with the base group. This group is loaded.
   */
  #loadUsers(): void {
    const remoteServiceMethod: RemoteServiceMethod = new RemoteServiceMethod("/rest/api/plugins/query-service-lib/qsrest/users", "GET");
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
