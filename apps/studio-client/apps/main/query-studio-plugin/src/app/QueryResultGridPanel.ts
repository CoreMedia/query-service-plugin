import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ContextMenuPlugin from "@coremedia/studio-client.ext.ui-components/plugins/ContextMenuPlugin";
import TableViewSkin from "@coremedia/studio-client.ext.ui-components/skins/TableViewSkin";
import Ext from "@jangaroo/ext-ts";
import JsonStore from "@jangaroo/ext-ts/data/JsonStore";
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
import QueryResultTypeIconColumn from "../columns/QueryResultTypeIconColumn";
import NameColumn from "@coremedia/studio-client.ext.cap-base-components/columns/NameColumn";
import QueryResultStatusColumn from "../columns/QueryResultStatusColumn";
import DataField from "@coremedia/studio-client.ext.ui-components/store/DataField";
import Toolbar from "@jangaroo/ext-ts/toolbar/Toolbar";
import IconButton from "@coremedia/studio-client.ext.ui-components/components/IconButton";
import OpenInTabAction from "@coremedia/studio-client.ext.form-services-toolkit/actions/OpenInTabAction";
import BindSelectionPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindSelectionPlugin";
import Separator from "@jangaroo/ext-ts/toolbar/Separator";
import ActionRef from "@jangaroo/ext-ts/ActionRef";
import BookmarkAction from "@coremedia/studio-client.main.editor-components/sdk/bookmarks/BookmarkAction";
import PublishAction from "@coremedia/studio-client.ext.cap-base-components/actions/PublishAction";
import ApproveAction from "@coremedia/studio-client.ext.cap-base-components/actions/ApproveAction";
import ApprovePublishAction from "@coremedia/studio-client.ext.cap-base-components/actions/ApprovePublishAction";
import CopyToClipboardAction from "@coremedia/studio-client.main.editor-components/sdk/clipboard/CopyToClipboardAction";
import WithdrawAction from "@coremedia/studio-client.ext.cap-base-components/actions/WithdrawAction";
import CutToClipboardAction from "@coremedia/studio-client.main.editor-components/sdk/clipboard/CutToClipboardAction";
import DeleteAction from "@coremedia/studio-client.main.editor-components/sdk/actions/DeleteAction";
import UndeleteAction from "@coremedia/studio-client.ext.cap-base-components/actions/UndeleteAction";
import ContentExportAction from "@coremedia/studio-client.main.editor-components/sdk/util/ContentExportAction";
import { SvgIconUtil } from "@coremedia/studio-client.base-models";
import { noRights } from "@coremedia/studio-client.common-icons";
import ContentLocalizationUtil from "@coremedia/studio-client.cap-base-models/content/ContentLocalizationUtil";
import ExportCSVAction from "../action/ExportCSVAction";
import ToolbarSkin from "@coremedia/studio-client.ext.ui-components/skins/ToolbarSkin";
import Label from "@jangaroo/ext-ts/form/Label";
import NumberField from "@jangaroo/ext-ts/form/field/Number";
import Spacer from "@jangaroo/ext-ts/toolbar/Spacer";
import firstPageIcon from "../icons/first-page.svg";
import prevPageIcon from "../icons/previous-page.svg";
import nextPageIcon from "../icons/next-page.svg";
import lastPageIcon from "../icons/last-page.svg";
import ShowStartTranslationWorkflowWindowAction
  from "@coremedia/studio-client.main.control-room-editor-components/actions/ShowStartTranslationWorkflowWindowAction";
import ShowStartPublicationWorkflowWindowAction
  from "@coremedia/studio-client.main.control-room-editor-components/actions/ShowStartPublicationWorkflowWindowAction";

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

  static readonly BUTTON_FIRST_PAGE_ID: string = "first-page-button";

  static readonly BUTTON_PREV_PAGE_ID: string = "prev-button";

  static readonly BUTTON_NEXT_PAGE_ID: string = "next-button";

  static readonly BUTTON_LAST_PAGE_ID: string = "last-page-button";

  static readonly PAGE_INPUT_ITEM_ID: string = "page-input";

  static readonly PAGING_LABEL_ITEM_ID: string = "paging-label";

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
            name: "typeCls",
            mapping: QueryToolTabBase.COLUMN_NAME_DOCTYPE,
            ifUnreadable: SvgIconUtil.getIconStyleClassForSvgIcon(noRights),
            convert: ContentLocalizationUtil.getIconStyleClassForContentTypeName,
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
        Config(QueryResultTypeIconColumn, {
          showTypeName: false,
          sortable: true,
          ...{ sortField: "type" },
        }),
        Config(Column, {
          stateId: QueryToolTabBase.COLUMN_NAME_CONTENT_ID,
          sortable: true,
          dataIndex: QueryToolTabBase.COLUMN_NAME_CONTENT_ID,
          width: 100,
          header: QueryTool_properties.column_id_title,
        }),
        Config(NameColumn, {
          sortable: true,
          flex: 1,
        }),
        Config(Column, {
          stateId: QueryToolTabBase.COLUMN_NAME_PATH,
          sortable: true,
          dataIndex: QueryToolTabBase.COLUMN_NAME_PATH,
          renderer: QueryResultGridPanelBase.renderStringValueWithTooltip,
          flex: 2,
          header: QueryTool_properties.column_path_title,
        }),
        Config(QueryResultStatusColumn, {
          width: 60,
          sortable: true,
        }),
      ],
      viewConfig: Config(TableView, {
        ui: TableViewSkin.LIGHT.getSkin(),
        deferEmptyText: false,
        emptyText: "",
        stripeRows: true,
      }),

      tbar: Config(Toolbar, {
        ui: ToolbarSkin.LIGHT.getSkin(),
        items: [
          Config(IconButton, {
            itemId: "open",
            baseAction: new OpenInTabAction({ contentValueExpression: config.selectedContentValueExpression }),
          }),
          Config(IconButton, {
            itemId: "copyToClipboard",
            baseAction: Config(ActionRef, { actionId: CopyToClipboardAction.ACTION_ID }),
          }),
          Config(Separator),
          Config(IconButton, {
            itemId: "bookmark",
            baseAction: Config(ActionRef, { actionId: BookmarkAction.ACTION_ID }),
          }),
          Config(Separator),
          Config(IconButton, {
            itemId: "approve",
            baseAction: Config(ActionRef, { actionId: ApproveAction.ACTION_ID }),
          }),
          Config(IconButton, {
            itemId: "publish",
            baseAction: Config(ActionRef, { actionId: PublishAction.ACTION_ID }),
          }),
          Config(IconButton, {
            itemId: "finish",
            baseAction: Config(ActionRef, { actionId: ApprovePublishAction.ACTION_ID }),
          }),
          Config(Separator),
          Config(IconButton, {
            itemId: "startPublicationWorkflow",
            baseAction: new ShowStartPublicationWorkflowWindowAction({ contentValueExpression: config.selectedContentValueExpression }),
          }),
          Config(IconButton, {
            itemId: "startTranslationWorkflow",
            baseAction: new ShowStartTranslationWorkflowWindowAction({ contentValueExpression: config.selectedContentValueExpression }),
          }),
          Config(Separator),
          Config(IconButton, {
            itemId: "withdraw",
            baseAction: Config(ActionRef, { actionId: WithdrawAction.ACTION_ID }),
          }),
          Config(Separator),
          Config(IconButton, {
            itemId: "delete",
            baseAction: Config(ActionRef, { actionId: DeleteAction.ACTION_ID }),
          }),
          Config(IconButton, {
            itemId: "undelete",
            baseAction: Config(ActionRef, { actionId: UndeleteAction.ACTION_ID }),
          }),
        ]
      }),

      bbar: Config(Toolbar, {
        ui: ToolbarSkin.LIGHT.getSkin(),
        items: [
          Config(IconButton, {
            itemId: "csvExport",
            baseAction: new ExportCSVAction(),
          }),
          // paging
          Config(Spacer, { flex: 1 }),
          Config(IconButton, {
            itemId: QueryResultGridPanel.BUTTON_FIRST_PAGE_ID,
            iconCls: SvgIconUtil.getIconStyleClassForSvgIcon(firstPageIcon),
            margin: "0 0 0 12px",
            handler: bind(this, this.pageFirst),
            disabled: true,
            tooltip: QueryTool_properties.button_page_first,
            ariaLabel: QueryTool_properties.button_page_first,
          }),
          Config(IconButton, {
            itemId: QueryResultGridPanel.BUTTON_PREV_PAGE_ID,
            iconCls: SvgIconUtil.getIconStyleClassForSvgIcon(prevPageIcon),
            margin: "0 0 0 12px",
            handler: bind(this, this.pagePrev),
            disabled: true,
            tooltip: QueryTool_properties.button_page_prev,
          }),
          Config(Label, {
            margin: "3px 4px 0 12px",
            text: QueryTool_properties.paging_label_page + ":",
          }),
          Config(NumberField, {
            itemId: QueryResultGridPanel.PAGE_INPUT_ITEM_ID,
            ariaLabel: QueryTool_properties.paging_label_page,
            width: 64,
            value: 0,
            disabled: true,
            minValue: 1,
            allowBlank: false,
            allowDecimals: false,
            allowExponential: false,
            regex: /^\d+$/,
            hideTrigger: true,
            keyNavEnabled: false,
            mouseWheelEnabled: false,
            selectOnFocus: true,
            listeners: {
              specialkey: bind(this, this.onPageInputKey),
              blur: bind(this, this.onPageInputBlur),
            },
          }),
          Config(Label, {
            itemId: QueryResultGridPanel.PAGING_LABEL_ITEM_ID,
            margin: "3px 0 0 4px",
            text: QueryTool_properties.page_label,
          }),
          Config(IconButton, {
            itemId: QueryResultGridPanel.BUTTON_NEXT_PAGE_ID,
            iconCls: SvgIconUtil.getIconStyleClassForSvgIcon(nextPageIcon),
            margin: "0 0 0 12px",
            handler: bind(this, this.pageNext),
            disabled: true,
            tooltip: QueryTool_properties.button_page_next,
          }),
          Config(IconButton, {
            itemId: QueryResultGridPanel.BUTTON_LAST_PAGE_ID,
            iconCls: SvgIconUtil.getIconStyleClassForSvgIcon(lastPageIcon),
            margin: "0 0 0 12px",
            handler: bind(this, this.pageLast),
            disabled: true,
            tooltip: QueryTool_properties.button_page_last,
            ariaLabel: QueryTool_properties.button_page_last,
          }),
          Config(Spacer, { flex: 1 }),
        ]
      }),

      plugins: [
        Config(BindSelectionPlugin, {
          selectedPositions: config.selectedValueExpression,
        }),
        Config(ContextMenuPlugin, {
          // @ts-ignore
          contextMenu: config.contextMenu,
          disableDoubleClick: true,
        }),
      ],

      ...ConfigUtils.append({
        actionList: [
          new CutToClipboardAction({ contentValueExpression: config.selectedContentValueExpression }),
          new CopyToClipboardAction({ contentValueExpression: config.selectedContentValueExpression }),
          new ApproveAction({ contentValueExpression: config.selectedContentValueExpression }),
          new PublishAction({ contentValueExpression: config.selectedContentValueExpression }),
          new ApprovePublishAction({ contentValueExpression: config.selectedContentValueExpression }),
          new WithdrawAction({ contentValueExpression: config.selectedContentValueExpression }),
          new DeleteAction({ contentValueExpression: config.selectedContentValueExpression }),
          new UndeleteAction({ contentValueExpression: config.selectedContentValueExpression }),
          new ContentExportAction({ contentValueExpression: config.selectedContentValueExpression }),
          new BookmarkAction({ contentValueExpression: config.selectedContentValueExpression }),
          new ExportCSVAction(),
        ],
      }),

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
   * A valueExpression for the selected store record indices
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
