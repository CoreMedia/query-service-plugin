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
import RemoteServiceMethod from "@coremedia/studio-client.client-core/data/impl/RemoteServiceMethod";
import Ext from "@jangaroo/ext-ts";
import Store from "@jangaroo/ext-ts/data/Store";
import AjaxProxy from "@jangaroo/ext-ts/data/proxy/Ajax";
import Panel from "@jangaroo/ext-ts/panel/Panel";
import { as, bind, is } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import int from "@jangaroo/runtime/int";
import QueryPanel from "./QueryPanel";
import QueryToolTab from "./QueryToolTab";
import QueryToolUtil from "../util/QueryToolUtil";
import QueryToolManager from "../QueryToolManager";

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

  static readonly COLUMN_NAME_STATUS: string = "status";

  #storeValueExpression: ValueExpression = null;

  #store: Store = null;

  #selectedValueExpression: ValueExpression = null;

  #selectedContentValueExpression: ValueExpression = null;

  #isAbstractContentTypeValueExpression: ValueExpression = null;

  #maxCountValueExpression: ValueExpression = null;

  #sendQueryValueExpression: ValueExpression = null;

  #totalCountValueExpression: ValueExpression = null;

  #undeleteValueExpression: ValueExpression = null;

  constructor(config: Config<QueryToolTab> = null) {
    super(config || {});
  }

  protected override afterRender(): any {
    QueryToolManager.getInstance().getPageValueExpression().addChangeListener(bind(this, this.onPaging));
    return super.afterRender();
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
      this.#selectedValueExpression = ValueExpressionFactory.createFromValue([]);
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

  protected getIsAbstractContentTypeValueExpression(): ValueExpression {
    if (!this.#isAbstractContentTypeValueExpression) {
      this.#isAbstractContentTypeValueExpression = ValueExpressionFactory.createFromFunction((): boolean => {
        const contentTypeString: string = QueryToolManager.getInstance().getContentTypeValueExpression().getValue();
        if (is(contentTypeString, String) && contentTypeString.length > 0) {
          const contentType: ContentType = session._.getConnection().getContentRepository().getContentType(contentTypeString);
          return is(contentType, ContentType) && contentType.isAbstract();
        }
        return undefined;
      });
      this.#isAbstractContentTypeValueExpression.addChangeListener((ve: ValueExpression): void => {
        if (is(ve.getValue(), Boolean) && ve.getValue()) {
          QueryToolManager.getInstance().getIncludeSubTypesValueExpression().setValue(true);
        }
      });
    }
    return this.#isAbstractContentTypeValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Contains the number of data sets found by the query
   *
   * @return ValueExpression
   */
  protected getMaxCountValueExpression(): ValueExpression {
    if (!this.#maxCountValueExpression) {
      this.#maxCountValueExpression = ValueExpressionFactory.createFromValue(QueryToolUtil.DEFAULT_VALUE_MAX_COUNT);
    }
    return this.#maxCountValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Contains a boolean value which is used to trigger sending the query to QueryResource (backend)
   *
   * @return ValueExpression
   */
  protected getSendQueryValueExpression(): ValueExpression {
    if (!this.#sendQueryValueExpression) {
      this.#sendQueryValueExpression = ValueExpressionFactory.createFromValue(QueryToolUtil.DEFAULT_VALUE_SEND_QUERY);
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
      this.#totalCountValueExpression = ValueExpressionFactory.createFromValue(QueryToolUtil.DEFAULT_VALUE_TOTAL_COUNT);
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
      if (QueryToolManager.getInstance().getPageValueExpression().getValue() === QueryToolUtil.DEFAULT_VALUE_PAGE) {
        this.reload();
      } else {
        // trigger reload over paging to guarantee the right page number
        QueryToolManager.getInstance().getPageValueExpression().setValue(QueryToolUtil.DEFAULT_VALUE_PAGE);
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
  }

  /**
   * Trigger reloading.
   * Collecting data, change the proxy parameters and reload the store.
   */
  protected reload(): void {
    const queryData: any[] = QueryToolManager.getInstance().getQueryDataValueExpression().getValue() || [];
    const query: string = JSON.stringify(queryData);
    const contentType: string = QueryToolManager.getInstance().getContentTypeValueExpression().getValue();
    const resultLimit: int = QueryToolManager.getInstance().getLoadCountValueExpression().getValue();
    // @ts-ignore
    const httpProxy: AjaxProxy = as(this.#store.getProxy(), AjaxProxy);

    httpProxy.setExtraParams({
      queryjson: query,
      ctype: contentType,
      includeSubs: QueryToolManager.getInstance().getIncludeSubTypesValueExpression().getValue(),
      page: QueryToolManager.getInstance().getPageValueExpression().getValue(),
      max: resultLimit ? resultLimit : QueryToolUtil.DEFAULT_VALUE_LOAD_COUNT,
    });
    this.#store.load();
  }

  /**
   * Trigger undelete of deleted documents.
   */
  undeleteContent(): void {
    const toBeUndeleted: any[] = this.getUndeleteValueExpression().getValue() || [];
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

  static #getContentIds(contents: any[]): any[] {
    const contentIds: any[] = [];
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
