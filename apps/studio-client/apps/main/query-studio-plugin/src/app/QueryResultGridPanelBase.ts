import UndocContentUtil from "@coremedia/studio-client.cap-rest-client/content/UndocContentUtil";
import User from "@coremedia/studio-client.cap-rest-client/user/User";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import RemoteService from "@coremedia/studio-client.client-core-impl/data/impl/RemoteService";
import Logger from "@coremedia/studio-client.client-core-impl/logging/Logger";
import Ext from "@jangaroo/ext-ts";
import XTemplate from "@jangaroo/ext-ts/XTemplate";
import AjaxProxy from "@jangaroo/ext-ts/data/proxy/Ajax";
import JsonReader from "@jangaroo/ext-ts/data/reader/Json";
import Event from "@jangaroo/ext-ts/event/Event";
import GridPanel from "@jangaroo/ext-ts/grid/Panel";
import RowSelectionModel from "@jangaroo/ext-ts/selection/RowModel";
import { as, bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import QueryTool_properties from "../properties/QueryTool_properties";
import QueryResultGridPanel from "./QueryResultGridPanel";
import QueryToolTabBase from "./QueryToolTabBase";

interface QueryResultGridPanelBaseConfig extends Config<GridPanel> {
}

/**
 * QueryTool Grid
 * Displays the query results in a data grid.
 *
 * @author dasc
 * @version $Id$
 */
class QueryResultGridPanelBase extends GridPanel {
  declare Config: QueryResultGridPanelBaseConfig;

  static readonly QUERY_ROOT_NODE: string = "queryData";

  static readonly QUERY_GRID_ID: string = "queryGrid";

  static readonly QUERY_REST_SERVICE_URL: string = "qsrest/query";

  #maxCountValueExpression: ValueExpression = null;

  #selectedValueExpression: ValueExpression = null;

  #selectedContentValueExpression: ValueExpression = null;

  #totalCountValueExpression: ValueExpression = null;

  #userValueExpression: ValueExpression = null;

  #httpProxy: AjaxProxy = null;

  #statusMapping: Array<any> = [
    {
      name: "prod",
      icon: "",
    },
    {
      name: "cout_me",
      icon: "cm-core-icons cm-core-icons--pencil",
    },
    {
      name: "cout_other",
      icon: "cm-core-icons cm-core-icons--edited-by-user",
    },
    {
      name: "appr",
      icon: "cm-core-icons cm-core-icons--approve",
    },
    {
      name: "publ",
      icon: "cm-core-icons cm-core-icons--publish",
    },
    {
      name: "del",
      icon: "cm-core-icons cm-core-icons--trash-bin",
    },
  ];

  constructor(config: Config<QueryResultGridPanel> = null) {
    super(config);
    this.#maxCountValueExpression = config.maxCountValueExpression;
    this.#selectedValueExpression = config.selectedValueExpression;
    this.#selectedContentValueExpression = config.selectedContentValueExpression;
    this.#totalCountValueExpression = config.totalCountValueExpression;
    this.#userValueExpression = config.userValueExpression;

    this.getSelectionModel().addListener("selectionchange", bind(this, this.onSelectionChange));

    //The QueryToolTabBase needs access to the store to add / delete records
    config.storeValueExpression.setValue(this.getStore());

    //preventing DoubleClick -> used for ContextMenu: OpenInTabAction O.o
    // @ts-ignore
    this.addListener("dblclick", (e: Event): any =>
      e.preventDefault(),
    );
  }

  /**
   * Creating the proxy for the store.
   *
   * @return [AjaxProxy] - the proxy, the store of the grid is using to load its data
   */
  getQueryDataProxy(): AjaxProxy {

    if (!this.#httpProxy) {
      const url: string = RemoteService.calculateRequestURI(QueryResultGridPanelBase.QUERY_REST_SERVICE_URL);

      const reader: any = Config(JsonReader, { rootProperty: QueryResultGridPanelBase.QUERY_ROOT_NODE });

      //noinspection JSUnusedGlobalSymbols
      this.#httpProxy = Ext.create(AjaxProxy, {
        method: "GET",
        url: url,
        // renaming the paging parameter to be able to set it manually
        pageParam: "foo",
        // data parameter for the proxy
        extraParams: {
          page: 1,
          queryjson: "",
          ctype: QueryToolTabBase.DEFAULT_VALUE_DOCUMENT_TYPE,
          max: QueryToolTabBase.DEFAULT_VALUE_LOAD_COUNT,
        },
        reader: reader,
      });
    }

    return this.#httpProxy;
  }

  /**
   * Callback function, that is called after finishing loading the store.
   * Reads the maxCount and totalCount from response and sets them as value for the corresponding ValueExpressions.
   * @param store
   * @param records
   * @param success
   * @param operation
   */
  protected loadListener(store: any, records: Array<any>, success: boolean, operation: any): void {
    const response: any = operation.getResponse();
    if (success) {
      if (response && response.responseJson) {
        this.#maxCountValueExpression.setValue(parseInt(response.responseJson.maxCount));
        this.#totalCountValueExpression.setValue(parseInt(response.responseJson.total));
      }
    } else {
      this.#resetCounts();
      Logger.info("Request for resultCount failed.");
    }
  }

  /**
   * Reset the values of ValueExpressions for 'maxCount' and 'totalCount'.
   */
  #resetCounts(): void {
    this.#maxCountValueExpression.setValue(QueryToolTabBase.DEFAULT_VALUE_MAX_COUNT);
    this.#totalCountValueExpression.setValue(QueryToolTabBase.DEFAULT_VALUE_TOTAL_COUNT);
  }

  /**
   * Callback function, that is called after the selection of rows in the grid changed.
   * Calculating and setting the values of ValueExpressions for 'selected' and 'selectedContent'
   * @param selModel
   * @param selection
   */
  onSelectionChange(selModel: RowSelectionModel, selection: Array<any>): void {
    if (selection && selection.length > 0) {
      this.#selectedValueExpression.setValue(selection);
      const contentArray: Array<any> = [];
      for (let s: number = 0; s < selection.length; s++) {
        const contentId: string = selection[s].data[QueryToolTabBase.COLUMN_NAME_CONTENT_ID];
        const content = UndocContentUtil.getContent(contentId);
        contentArray.push(content);
      }
      this.#selectedContentValueExpression.setValue(contentArray);
    }
  }

  /**
   * Calculating the values of the status column.
   * @param value
   * @param metaData
   * @param record
   * @param rowIndex
   * @param colIndex
   * @param store
   *
   * @return [String] - HTML for the cells of the status column.
   */
  protected renderStatusColumn(value: any, metaData: any, record: any, rowIndex: any, colIndex: any, store: any): string {
    let editor: string = record.data.editor;
    let status: number = 0;
    if (record.data.isCheckedOut) {
      if (editor == as(this.#userValueExpression.getValue(), User).getName()) {
        editor = QueryTool_properties.label_me;
        status = 1;
      } else status = 2;
    }
    if (record.data.isApproved) status = 3;
    if (record.data.isPublished) status = 4;
    if (record.data.isDeleted) status = 5;

    let text = QueryTool_properties[this.#statusMapping[status].name];
    if (status == 1 || status == 2) text += " " + editor;
    const icon: string = this.#statusMapping[status].icon;

    record.data.status = text;

    let columnHTML: string = "";
    columnHTML += "<div aria-label='" + text + "' class='cm-icon-with-text cm-icon-with-text--icon-only' data-qtip='" + text + "'>";
    columnHTML += "<span class='cm-icon-with-text__icon " + icon + "'></span>";
    columnHTML += "<span class='cm-icon-with-text__text'>" + text + "</span>";
    columnHTML += "</div>";
    return columnHTML;
  }

  // getter for inner HTML of cells with long values - will create cell with tooltip
  protected static renderStringValueWithTooltip(value: any, metaData: any, record: any, rowIndex: any, colIndex: any, store: any): string {
    if (value !== undefined) {
      return QueryResultGridPanelBase.getStringWithToolTipTemplate().apply({
        value: value,
        toolTip: value,
      });
    }
  }

  // template for cells with long values
  protected static getStringWithToolTipTemplate(): XTemplate {
    return new XTemplate([
      "<div {toolTip:unsafeQtip}>",
      "<span>{value:escape}</span>",
      "</div>",
    ]);
  }

}

export default QueryResultGridPanelBase;
