/*
 * Copyright (c) 2015-2024 T-Systems Multimedia Solutions GmbH
 * Riesaer Str. 5, D-01129 Dresden, Germany
 * All rights reserved.
 */
import session from "@coremedia/studio-client.cap-rest-client/common/session";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import ContentType from "@coremedia/studio-client.cap-rest-client/content/ContentType";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import beanFactory from "@coremedia/studio-client.client-core/data/beanFactory";
import RemoteService from "@coremedia/studio-client.client-core-impl/data/impl/RemoteService";
import RemoteServiceMethod from "@coremedia/studio-client.client-core-impl/data/impl/RemoteServiceMethod";
import Ext from "@jangaroo/ext-ts";
import ObjectUtil from "@jangaroo/ext-ts/Object";
import Store from "@jangaroo/ext-ts/data/Store";
import AjaxProxy from "@jangaroo/ext-ts/data/proxy/Ajax";
import Panel from "@jangaroo/ext-ts/panel/Panel";
import SorterCollection from "@jangaroo/ext-ts/util/SorterCollection";
import { as, bind, is } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import int from "@jangaroo/runtime/int";
import QueryPanel from "./QueryPanel";
import QueryPanelBase from "./QueryPanelBase";
import QueryToolTab from "./QueryToolTab";

interface QueryToolTabBaseConfig extends Config<Panel> {
}

/**
 * Query Tool Tab
 * Rebuilding the query-functionality of the site manager
 *
 * @author dasc
 * @version $Id$
 */
class QueryToolTabBase extends Panel {
  declare Config: QueryToolTabBaseConfig;

  static readonly COLUMN_NAME_CONTENT: string = "content";

  static readonly COLUMN_NAME_CONTENT_ID: string = "id";

  static readonly COLUMN_NAME_DOCTYPE: string = "type";

  static readonly COLUMN_NAME_MAX_COUNT: string = "maxCount";

  static readonly COLUMN_NAME_IN_PRODUCTION: string = "isInProduction";

  static readonly COLUMN_NAME_DELETED: string = "isDeleted";

  static readonly COLUMN_NAME_CHECKED_OUT: string = "isCheckedOut";

  static readonly COLUMN_NAME_APPROVED: string = "isApproved";

  static readonly COLUMN_NAME_PUBLISHED: string = "isPublished";

  static readonly COLUMN_NAME_EDITOR: string = "editor";

  static readonly COLUMN_NAME_TITLE: string = "name";

  static readonly COLUMN_NAME_PATH: string = "parent";

  static readonly DEFAULT_VALUE_DOCUMENT_TYPE: string = "Document_";

  static readonly DEFAULT_VALUE_LOAD_COUNT: int = 50;

  static readonly DEFAULT_VALUE_MAX_COUNT: int = -1;

  static readonly DEFAULT_VALUE_PAGE: int = 1;

  static readonly DEFAULT_VALUE_QUERY_DATA: Array<any> = [];

  static readonly DEFAULT_VALUE_SEND_QUERY: boolean = false;

  static readonly DEFAULT_VALUE_TOTAL_COUNT: int = -1;

  static readonly COLUMN_NAME_STATUS: string = "status";

  #storeValueExpression: ValueExpression = null;

  #store: Store = null;

  #selectedValueExpression: ValueExpression = null;

  #selectedContentValueExpression: ValueExpression = null;

  #contentTypeValueExpression: ValueExpression = null;

  #isAbstractContentTypeValueExpression: ValueExpression = null;

  #includeSubTypesValueExpression: ValueExpression = null;

  #loadCountValueExpression: ValueExpression = null;

  #maxCountValueExpression: ValueExpression = null;

  #pageValueExpression: ValueExpression = null;

  #queryDataValueExpression: ValueExpression = null;

  #sendQueryValueExpression: ValueExpression = null;

  #totalCountValueExpression: ValueExpression = null;

  #undeleteValueExpression: ValueExpression = null;

  #userValueExpression: ValueExpression = null;

  #queryPanel: QueryPanel = null;

  constructor(config: Config<QueryToolTab> = null) {
    super(config || {});
  }

  /******************************
   ****** ValueExpressions ******
   ******************************/

  /**
   * Initialising ValueExpression
   * Contains the selected positions in the grid
   *
   * @return ValueExpression
   */
  protected getSelectedValueExpression(): ValueExpression {
    if (!this.#selectedValueExpression) {
      this.#selectedValueExpression = ValueExpressionFactory.createFromValue(null);
    }
    return this.#selectedValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Contains the selected content represented by the selected positions in the grid
   *
   * @return ValueExpression
   */
  protected getSelectedContentValueExpression(): ValueExpression {
    if (!this.#selectedContentValueExpression) {
      const bean = beanFactory._.createLocalBean();
      this.#selectedContentValueExpression = ValueExpressionFactory.create("content", bean);
    }
    return this.#selectedContentValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Contains the selected ContentType of the query (dropdown)
   *
   * Default: "Document_"
   * @return ValueExpression
   */
  protected getContentTypeValueExpression(): ValueExpression {
    if (!this.#contentTypeValueExpression) {
      this.#contentTypeValueExpression = ValueExpressionFactory.createFromValue(QueryToolTabBase.DEFAULT_VALUE_DOCUMENT_TYPE);
    }
    return this.#contentTypeValueExpression;
  }

  protected getIsAbstractContentTypeValueExpression(): ValueExpression {
    if (!this.#isAbstractContentTypeValueExpression) {
      this.#isAbstractContentTypeValueExpression = ValueExpressionFactory.createFromFunction((): boolean => {
        const contentTypeString: string = this.getContentTypeValueExpression().getValue();
        if (is(contentTypeString, String) && contentTypeString.length > 0) {
          const contentType: ContentType = session._.getConnection().getContentRepository().getContentType(contentTypeString);
          return is(contentType, ContentType) && contentType.isAbstract();
        }
        return undefined;
      });
      this.#isAbstractContentTypeValueExpression.addChangeListener((ve: ValueExpression): void => {
        if (is(ve.getValue(), Boolean) && ve.getValue()) {
          this.getIncludeSubTypesValueExpression().setValue(true);
        }
      });
    }
    return this.#isAbstractContentTypeValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Indicates if the query should deliver results including documents of a subtype of the selected content type.
   *
   * Default: "true"
   * @return ValueExpression
   */
  protected getIncludeSubTypesValueExpression(): ValueExpression {
    if (!this.#includeSubTypesValueExpression) {
      this.#includeSubTypesValueExpression = ValueExpressionFactory.createFromValue(true);
    }
    return this.#includeSubTypesValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Contains the number of data sets to load for visualising in the grid
   *
   * Default: 50
   * @return ValueExpression
   */
  protected getLoadCountValueExpression(): ValueExpression {
    if (!this.#loadCountValueExpression) {
      this.#loadCountValueExpression = ValueExpressionFactory.createFromValue(QueryToolTabBase.DEFAULT_VALUE_LOAD_COUNT);
    }
    return this.#loadCountValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Contains the number of data sets found by the query
   *
   * @return ValueExpression
   */
  protected getMaxCountValueExpression(): ValueExpression {
    if (!this.#maxCountValueExpression) {
      this.#maxCountValueExpression = ValueExpressionFactory.createFromValue(QueryToolTabBase.DEFAULT_VALUE_MAX_COUNT);
    }
    return this.#maxCountValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Contains the number of the active page of the paging
   *
   * @return ValueExpression
   */
  protected getPageValueExpression(): ValueExpression {
    if (!this.#pageValueExpression) {
      this.#pageValueExpression = ValueExpressionFactory.createFromValue(QueryToolTabBase.DEFAULT_VALUE_PAGE);
      this.#pageValueExpression.addChangeListener(bind(this, this.onPaging));
    }
    return this.#pageValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Contains an array of the data sets (JSON-Objects) of the query conditions
   *
   * @return ValueExpression
   */
  protected getQueryDataValueExpression(): ValueExpression {
    if (!this.#queryDataValueExpression) {
      this.#queryDataValueExpression = ValueExpressionFactory.createFromValue(QueryToolTabBase.DEFAULT_VALUE_QUERY_DATA);
    }
    return this.#queryDataValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Contains a boolean value which is used to trigger sending the query to QueryResource (backend)
   *
   * @return ValueExpression
   */
  protected getSendQueryValueExpression(): ValueExpression {
    if (!this.#sendQueryValueExpression) {
      this.#sendQueryValueExpression = ValueExpressionFactory.createFromValue(QueryToolTabBase.DEFAULT_VALUE_SEND_QUERY);
      this.#sendQueryValueExpression.addChangeListener(bind(this, this.onSendQuery));
    }
    return this.#sendQueryValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Contains the number of data sets delivered by the query and visible in the grid
   * (either equal to loadCount or maxCount)
   *
   * @return ValueExpression
   */
  protected getTotalCountValueExpression(): ValueExpression {
    if (!this.#totalCountValueExpression) {
      this.#totalCountValueExpression = ValueExpressionFactory.createFromValue(QueryToolTabBase.DEFAULT_VALUE_TOTAL_COUNT);
    }
    return this.#totalCountValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Contains a list of content to be undeleted
   *
   * @return ValueExpression
   */
  protected getUndeleteValueExpression(): ValueExpression {
    if (!this.#undeleteValueExpression) {
      this.#undeleteValueExpression = ValueExpressionFactory.createFromValue(undefined);
      this.#undeleteValueExpression.addChangeListener(bind(this, this.undeleteContent));
    }
    return this.#undeleteValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Contains the active user
   *
   * @return ValueExpression
   */
  protected getUserValueExpression(): ValueExpression {
    if (!this.#userValueExpression) {
      this.#userValueExpression = ValueExpressionFactory.createFromValue(session._.getUser());
    }
    return this.#userValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Contains the store of the ResultGrid.
   * Used to listen to the 'load'-Event of the store as indicator for a finished query.
   *
   * @return ValueExpression
   */
  protected getStoreValueExpression(): ValueExpression {
    if (!this.#storeValueExpression) {
      this.#storeValueExpression = ValueExpressionFactory.createFromValue(null);
      this.#storeValueExpression.addChangeListener((): void => {
        this.#store = this.#storeValueExpression.getValue();
        if (this.#store.isLoaded()) this.onStoreReload();
        this.#store.addListener("load", bind(this, this.onStoreReload));
      });
    }
    return this.#storeValueExpression;
  }

  /******************************
   ******** Functionality *******
   ******************************/

  /**
   * Sending the query if it's triggered by button "send query".
   * Triggered also when the value of 'sendQueryValueExpression' is set back to 'false'.
   */
  protected onSendQuery(): void {
    if (this.#sendQueryValueExpression.getValue()) {
      if (this.#pageValueExpression.getValue() === QueryToolTabBase.DEFAULT_VALUE_PAGE) {
        this.reload();
      } else {
        // trigger reload over paging to guarantee the right page number
        this.#pageValueExpression.setValue(QueryToolTabBase.DEFAULT_VALUE_PAGE);
      }
    }
  }

  /**
   * Sending the query if it's triggered by paging.
   * Triggered also when the value of 'sendQueryValueExpression' is set back to 'false'.
   */
  protected onPaging(): void {
    this.reload();
  }

  /**
   * Triggered, when Store finished loading:
   * * resetting the 'sendQueryValueExpression' is set back to 'false',
   * * writing the paging label.
   */
  protected onStoreReload(): void {
    this.#sendQueryValueExpression.setValue(false);
    // writing the paging label
    if (!this.#queryPanel) this.#queryPanel = as(this.queryById(QueryPanelBase.QUERY_PANEL_ID), QueryPanel);
    if (this.#queryPanel) this.#queryPanel.writeLabel();
  }

  /**
   * Trigger reloading.
   * Collecting data, change the proxy parameters and reload the store.
   */
  protected reload(): void {
    const queryData: Array<any> = this.getQueryDataValueExpression().getValue();
    const query: string = JSON.stringify(queryData);
    const contentType: string = this.getContentTypeValueExpression().getValue();
    const resultLimit: int = this.getLoadCountValueExpression().getValue();
    // @ts-ignore
    const httpProxy: AjaxProxy = as(this.#store.getProxy(), AjaxProxy);

    httpProxy.setExtraParams({
      queryjson: query,
      ctype: contentType,
      includeSubs: this.getIncludeSubTypesValueExpression().getValue(),
      page: this.#pageValueExpression.getValue(),
      max: resultLimit ? resultLimit : QueryToolTabBase.DEFAULT_VALUE_LOAD_COUNT,
    });
    this.#store.load();
  }

  /**
   * Trigger download of the query results as CSV file.
   */
  download(): void {
    const resultLimit: int = this.getLoadCountValueExpression().getValue();
    const queryDataVE: ValueExpression = this.getQueryDataValueExpression();
    const queryData: Array<any> = queryDataVE.getValue();
    const query: string = JSON.stringify(queryData);
    const contentType: string = this.getContentTypeValueExpression().getValue();
    const paramObject: Record<string, any> = {
      queryjson: query,
      ctype: contentType,
      includeSubs: this.getIncludeSubTypesValueExpression().getValue(),
      page: this.#pageValueExpression.getValue(),
      max: resultLimit ? resultLimit : QueryToolTabBase.DEFAULT_VALUE_TOTAL_COUNT,
    };
    const sorters: SorterCollection = this.#store.getSorters();
    if (sorters && sorters.getCount() > 0) paramObject["sort"] = QueryToolTabBase.getSortDataJSON(sorters);

    const url = RemoteService.calculateRequestURI("/rest/api/plugins/query-service-lib/qsrest/queryToCSV?" + ObjectUtil.toQueryString(paramObject));
    window.open(url, "QueryCSVDownload");
  }

  /**
   * Building a JSON-Array as String of the grid sorters.
   * @param sorters
   *
   * @return String - JSON-Array as String
   */
  protected static getSortDataJSON(sorters: SorterCollection): string {

    let jsonArray: string = "";

    if (sorters && sorters.getCount() > 0) {
      jsonArray = "[";
      for (let i: number = 0; i < sorters.getCount(); i++) {
        const sorter: any = sorters.getAt(i);
        jsonArray += "{\"property\":\"" + sorter._property + "\",\"direction\":\"" + sorter._direction + "\"}";
        if (i < sorters.getCount() - 1) jsonArray += ",";
      }
      jsonArray += "]";
    }
    return jsonArray;
  }

  /**
   * Trigger undelete of deleted documents.
   */
  undeleteContent(): void {
    const toBeUndeleted: Array<any> = this.getUndeleteValueExpression().getValue();
    if (Ext.isArray(toBeUndeleted)) {
      const remoteServiceMethod: RemoteServiceMethod = new RemoteServiceMethod("/rest/api/plugins/query-service-lib/qsrest/undelete", "GET");
      const params: Record<string, any> = { contentIds: QueryToolTabBase.#getContentIds(toBeUndeleted) };
      remoteServiceMethod.request(
        params,
        (/*response: RemoteServiceMethodResponse*/): void => {
          this.getUndeleteValueExpression().setValue(undefined);
          this.reload();
        },
        (/*response: RemoteServiceMethodResponse*/): void => {
          // nothing
        });
    }
  }

  static #getContentIds(contents: Array<any>): Array<any> {
    const contentIds: Array<any> = [];
    if (Ext.isArray(contents) && contents.length > 0) {
      for (let c = 0; c < contents.length; c++) {
        const content: Content = contents[c];
        if (is(content, Content)) {
          contentIds.push(content.getId());
        }
      }
    }
    return contentIds;
  }

}

export default QueryToolTabBase;
