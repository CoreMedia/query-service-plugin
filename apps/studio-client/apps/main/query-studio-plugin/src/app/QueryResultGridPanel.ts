import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ContextMenuPlugin from "@coremedia/studio-client.ext.ui-components/plugins/ContextMenuPlugin";
import TableViewSkin from "@coremedia/studio-client.ext.ui-components/skins/TableViewSkin";
import Ext from "@jangaroo/ext-ts";
import JsonStore from "@jangaroo/ext-ts/data/JsonStore";
import DataField from "@jangaroo/ext-ts/data/field/Field";
import Column from "@jangaroo/ext-ts/grid/column/Column";
import Menu from "@jangaroo/ext-ts/menu/Menu";
import RowSelectionModel from "@jangaroo/ext-ts/selection/RowModel";
import TableView from "@jangaroo/ext-ts/view/Table";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import QueryTool_properties from "../properties/QueryTool_properties";
import QueryResultGridPanelBase from "./QueryResultGridPanelBase";
import QueryToolTabBase from "./QueryToolTabBase";
import ListViewStatusColumn
  from "@coremedia/studio-client.main.editor-components/sdk/collectionview/list/ListViewStatusColumn";
import ListViewNameColumn
  from "@coremedia/studio-client.main.editor-components/sdk/collectionview/list/ListViewNameColumn";
import ListViewTypeIconColumn
  from "@coremedia/studio-client.main.editor-components/sdk/collectionview/list/ListViewTypeIconColumn";

interface QueryResultGridPanelConfig extends Config<QueryResultGridPanelBase>, Partial<Pick<QueryResultGridPanel,
  "maxCountValueExpression" |
  "selectedValueExpression" |
  "selectedContentValueExpression" |
  "storeValueExpression" |
  "totalCountValueExpression" |
  "userValueExpression" |
  "contextMenu"
>> {
}

class QueryResultGridPanel extends QueryResultGridPanelBase {
  declare Config: QueryResultGridPanelConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.queryResultGridPanel";

  constructor(config: Config<QueryResultGridPanel> = null) {
    super(((): any => ConfigUtils.apply(Config(QueryResultGridPanel, {

      itemId: QueryResultGridPanelBase.QUERY_GRID_ID,
      selModel: Ext.create(RowSelectionModel, { mode: "MULTI" }),

      // creating the store for the grid, listener will read maxCount and totalCount from response
      store: new JsonStore({
        autoLoad: false,
        autoDestroy: true,
        autoSync: true,
        remoteSort: true,
        proxy: this.getQueryDataProxy(),
        listeners: { load: bind(this, this.loadListener) },
        fields: [
          Config(DataField, {
            name: QueryToolTabBase.COLUMN_NAME_CONTENT,
            mapping: QueryToolTabBase.COLUMN_NAME_CONTENT,
          }),
          Config(DataField, {
            name: QueryToolTabBase.COLUMN_NAME_CONTENT_ID,
            mapping: QueryToolTabBase.COLUMN_NAME_CONTENT_ID,
          }),
          Config(DataField, {
            name: QueryToolTabBase.COLUMN_NAME_DOCTYPE,
            mapping: QueryToolTabBase.COLUMN_NAME_DOCTYPE,
          }),
          Config(DataField, {
            name: QueryToolTabBase.COLUMN_NAME_TITLE,
            mapping: QueryToolTabBase.COLUMN_NAME_TITLE,
          }),
          Config(DataField, {
            name: QueryToolTabBase.COLUMN_NAME_PATH,
            mapping: QueryToolTabBase.COLUMN_NAME_PATH,
          }),
          Config(DataField, {
            name: QueryToolTabBase.COLUMN_NAME_IN_PRODUCTION,
            mapping: QueryToolTabBase.COLUMN_NAME_IN_PRODUCTION,
          }),
          Config(DataField, {
            name: QueryToolTabBase.COLUMN_NAME_DELETED,
            mapping: QueryToolTabBase.COLUMN_NAME_DELETED,
          }),
          Config(DataField, {
            name: QueryToolTabBase.COLUMN_NAME_CHECKED_OUT,
            mapping: QueryToolTabBase.COLUMN_NAME_CHECKED_OUT,
          }),
          Config(DataField, {
            name: QueryToolTabBase.COLUMN_NAME_APPROVED,
            mapping: QueryToolTabBase.COLUMN_NAME_APPROVED,
          }),
          Config(DataField, {
            name: QueryToolTabBase.COLUMN_NAME_PUBLISHED,
            mapping: QueryToolTabBase.COLUMN_NAME_PUBLISHED,
          }),
          Config(DataField, {
            name: QueryToolTabBase.COLUMN_NAME_EDITOR,
            mapping: QueryToolTabBase.COLUMN_NAME_EDITOR,
          }),
          Config(DataField, {
            name: QueryToolTabBase.COLUMN_NAME_STATUS,
            mapping: QueryToolTabBase.COLUMN_NAME_STATUS,
          }),
          Config(DataField, {
            name: QueryToolTabBase.COLUMN_NAME_MAX_COUNT,
            mapping: QueryToolTabBase.COLUMN_NAME_MAX_COUNT,
          }),
        ],
      }),

      // grid columns: status, contentType, contentId, document name, document path
      columns: [
        Config(ListViewStatusColumn, {
          width: 46,
          sortable: true,
        }),
        Config(ListViewTypeIconColumn, {
          showTypeName: true,
          sortable: true,
          ...{ sortField: "type" },
        }),
        Config(Column, {
          stateId: QueryToolTabBase.COLUMN_NAME_CONTENT_ID,
          sortable: true,
          dataIndex: QueryToolTabBase.COLUMN_NAME_CONTENT_ID,
          width: 50,
          header: QueryTool_properties.column_id_title,
        }),
        Config(ListViewNameColumn, { sortable: true }),
        Config(Column, {
          stateId: QueryToolTabBase.COLUMN_NAME_PATH,
          sortable: true,
          dataIndex: QueryToolTabBase.COLUMN_NAME_PATH,
          renderer: QueryResultGridPanelBase.renderStringValueWithTooltip,
          flex: 1,
          header: QueryTool_properties.column_path_title,
        }),
      ],
      viewConfig: Config(TableView, {
        ui: TableViewSkin.LIGHT.getSkin(),
        deferEmptyText: false,
        emptyText: "",
        stripeRows: true,
      }),

      plugins: [
        Config(ContextMenuPlugin, {
          // @ts-ignore
          contextMenu: config.contextMenu,
          disableDoubleClick: true,
        }),
      ],

    }), config))());
  }

  #maxCountValueExpression: ValueExpression = null;

  /**
   * A valueExpression for the maximum amount of data that can be loaded
   */
  get maxCountValueExpression(): ValueExpression {
    return this.#maxCountValueExpression;
  }

  set maxCountValueExpression(value: ValueExpression) {
    this.#maxCountValueExpression = value;
  }

  #selectedValueExpression: ValueExpression = null;

  /**
   * A valueExpression for the selected store record
   */
  get selectedValueExpression(): ValueExpression {
    return this.#selectedValueExpression;
  }

  set selectedValueExpression(value: ValueExpression) {
    this.#selectedValueExpression = value;
  }

  #selectedContentValueExpression: ValueExpression = null;

  /**
   * A valueExpression for the selected content
   */
  get selectedContentValueExpression(): ValueExpression {
    return this.#selectedContentValueExpression;
  }

  set selectedContentValueExpression(value: ValueExpression) {
    this.#selectedContentValueExpression = value;
  }

  #storeValueExpression: ValueExpression = null;

  /**
   * A valueExpression for the store of the grid
   */
  get storeValueExpression(): ValueExpression {
    return this.#storeValueExpression;
  }

  set storeValueExpression(value: ValueExpression) {
    this.#storeValueExpression = value;
  }

  #totalCountValueExpression: ValueExpression = null;

  /**
   * A valueExpression for the total amount of data that has been loaded
   */
  get totalCountValueExpression(): ValueExpression {
    return this.#totalCountValueExpression;
  }

  set totalCountValueExpression(value: ValueExpression) {
    this.#totalCountValueExpression = value;
  }

  #userValueExpression: ValueExpression = null;

  /**
   * A valueExpression for the active user
   */
  get userValueExpression(): ValueExpression {
    return this.#userValueExpression;
  }

  set userValueExpression(value: ValueExpression) {
    this.#userValueExpression = value;
  }

  #contextMenu: Menu = null;

  /**
   *   The context menu to use for the linked content object.
   * */
  get contextMenu(): Menu {
    return this.#contextMenu;
  }

  set contextMenu(value: Menu) {
    this.#contextMenu = value;
  }
}

export default QueryResultGridPanel;
