import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ContentTypeSelector from "@coremedia/studio-client.ext.cap-base-components/contenttypes/ContentTypeSelector";
import OpenDialogAction from "@coremedia/studio-client.ext.ui-components/actions/OpenDialogAction";
import IconButton from "@coremedia/studio-client.ext.ui-components/components/IconButton";
import LocalComboBox from "@coremedia/studio-client.ext.ui-components/components/LocalComboBox";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";
import ContainerSkin from "@coremedia/studio-client.ext.ui-components/skins/ContainerSkin";
import TextfieldSkin from "@coremedia/studio-client.ext.ui-components/skins/TextfieldSkin";
import ToolbarSkin from "@coremedia/studio-client.ext.ui-components/skins/ToolbarSkin";
import Editor_properties from "@coremedia/studio-client.main.editor-components/Editor_properties";
import Container from "@jangaroo/ext-ts/container/Container";
import Label from "@jangaroo/ext-ts/form/Label";
import Checkbox from "@jangaroo/ext-ts/form/field/Checkbox";
import VBoxLayout from "@jangaroo/ext-ts/layout/container/VBox";
import Separator from "@jangaroo/ext-ts/toolbar/Separator";
import Toolbar from "@jangaroo/ext-ts/toolbar/Toolbar";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import QueryLoadDialog from "../dialog/QueryLoadDialog";
import QuerySaveDialog from "../dialog/QuerySaveDialog";
import AddTooltipPlugin from "../plugins/AddTooltipPlugin";
import QueryTool_properties from "../properties/QueryTool_properties";
import QueryPanelBase from "./QueryPanelBase";
import Premular from "@coremedia/studio-client.main.editor-components/sdk/premular/Premular";
import PremularBase from "@coremedia/studio-client.main.editor-components/sdk/premular/PremularBase";
import TabBarSkin from "@coremedia/studio-client.ext.ui-components/skins/TabBarSkin";
import Spacer from "@jangaroo/ext-ts/toolbar/Spacer";

interface QueryPanelConfig extends Config<QueryPanelBase>, Partial<Pick<QueryPanel,
    "contentTypeValueExpression" |
    "includeSubTypesValueExpression" |
    "includeSubTypesDisabledValueExpression" |
    "loadCountValueExpression" |
    "maxCountValueExpression" |
    "pageValueExpression" |
    "sendQueryValueExpression" |
    "storeValueExpression" |
    "totalCountValueExpression" |
    "userValueExpression" |
    "queryDataValueExpression"
>> {
}

class QueryPanel extends QueryPanelBase {
  declare Config: QueryPanelConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.queryPanel";

  constructor(config: Config<QueryPanel> = null) {
    super(((): any => ConfigUtils.apply(Config(QueryPanel, {

      itemId: QueryPanelBase.QUERY_PANEL_ID,
      width: 627,
      minWidth: PremularBase.DEFAULT_DOCUMENT_CONTAINER_MIN_WIDTH,
      layout: Config(VBoxLayout, { align: "stretch" }),

      // top toolbar: contentTypeSelector, loadCountSelector, adding of query conditions, sending query
      tbar: Config(Toolbar, {
        ui: TabBarSkin.WORKAREA_PANEL.getSkin(),
        dock: "top",
        cls: "query-toolbar",
        height:  Premular.TOOLBAR_HEIGHT,
        items: [
          Config(Spacer, { width: "6px" }),
          // ContentTypeSelector
          Config(ContentTypeSelector, {
            itemId: "ctBox",
            margin: "0 13 0 0",
            flex: 0.3,
            minWidth: 100,
            emptyText: Editor_properties.SearchArea_content_type_selector_empty_text,
            ariaLabel: Editor_properties.SearchArea_contenttypeselector_tooltip,
            entries: this.getContentTypeData(),
            contentTypeValueExpression: config.contentTypeValueExpression,
            ui: TextfieldSkin.SEMI_TRANSPARENT.getSkin(),
          }),
          Config(Checkbox, {
            itemId: "check-subtypes",
            hideLabel: true,
            cls: "query-control",
            margin: "0 0 0 6px",
            boxLabel: "",
            plugins: [
              Config(BindPropertyPlugin, {
                bindTo: config.includeSubTypesValueExpression,
                bidirectional: true,
                ifUndefined: true,
              }),
              Config(BindPropertyPlugin, {
                componentProperty: "disabled",
                ifUndefined: "true",
                bindTo: config.includeSubTypesDisabledValueExpression,
              }),
            ],
          }),
          Config(Label, {
            itemId: "check-subtypes-tooltip",
            cls: "query-label tooltip-base",
            margin: "0 0 0 3px",
            text: "?",
            plugins: [
              Config(AddTooltipPlugin, { tooltip: QueryTool_properties.checkbox_subtypes }),
            ],
          }),
          Config(Label, {
            itemId: "combo-loadcount-label",
            cls: "query-label",
            margin: "0 0 0 22px",
            text: QueryTool_properties.combo_loadcount_label,
          }),
          // LoadCountSelector as ComboBox
          Config(LocalComboBox, {
            itemId: "loadCount",
            name: "loadCount",
            width: 100,
            cls: "query-control",
            margin: "0 0 0 17px",
            store: [
              [500, "500"],
              [250, "250"],
              [100, "100"],
              [50, "50"],
              [20, "20"],
              [-1, "all"],
            ],
            ui: TextfieldSkin.SEMI_TRANSPARENT.getSkin(),
            ...ConfigUtils.append({
              plugins: [
                Config(BindPropertyPlugin, {
                  componentEvent: "change",
                  bindTo: config.loadCountValueExpression,
                  bidirectional: true,
                }),
              ],
            }),
          }),
          // Button new QueryCondition
          Config(IconButton, {
            itemId: "newQueryCondition",
            iconCls: "query-new cm-core-icons cm-core-icons--add",
            cls: "query-control",
            margin: "0 0 0 12px",
            handler: bind(this, this.addNewQueryCondition),
            tooltip: QueryTool_properties.button_new,
          }),
          // Button send query
          Config(IconButton, {
            itemId: "sendQuery",
            iconCls: "query-send cm-core-icons cm-core-icons--research",
            cls: "query-control",
            margin: "0 0 0 12px",
            handler: bind(this, this.sendQuery),
            tooltip: QueryTool_properties.button_send,
          }),
          Config(Spacer, { width: "6px" }),
        ],
      }),

      // footer toolbar: save query result as CSV, saving and loading query configuration, paging
      fbar: Config(Toolbar, {
        ui: ToolbarSkin.WINDOW_HEADER.getSkin(),
        cls: "query-paging-toolbar",
        dock: "bottom",
        height: 80,
        items: [
          // export csv
          Config(IconButton, {
            itemId: "save_csv",
            iconCls: "query-save-csv cm-core-icons cm-core-icons--save",
            cls: "query-control",
            margin: "0 0 0 12px",
            handler: bind(this, this.download),
            tooltip: QueryTool_properties.button_save_csv,
          }),
          // save query configuration to settings
          Config(Separator),
          Config(IconButton, {
            itemId: "save",
            iconCls: "query-save cm-core-icons cm-core-icons--download",
            cls: "query-control",
            margin: "0 0 0 12px",
            tooltip: QueryTool_properties.button_save,
            baseAction: new OpenDialogAction({
              dialog: Config(QuerySaveDialog, {
                saveCallBack: bind(this, this.saveQueryDataToSettings),
                initialName: QueryPanelBase.getInitialFileName(),
              }),
            }),
          }),
          // load query configuration from settings
          Config(IconButton, {
            itemId: "load",
            iconCls: "query-load cm-core-icons cm-core-icons--upload",
            cls: "query-control",
            margin: "0 0 0 12px",
            tooltip: QueryTool_properties.button_load,
            baseAction: new OpenDialogAction({ dialog: Config(QueryLoadDialog, { loadCallBack: bind(this, this.loadQueryDataFromSettings) }) }),
          }),
          // paging
          Config(Separator),
          Config(IconButton, {
            itemId: QueryPanelBase.BUTTON_PREV_PAGE_ID,
            iconCls: "query-page-prev cm-core-icons cm-core-icons--arrow-left",
            cls: "query-control",
            margin: "0 0 0 12px",
            handler: bind(this, this.pagePrev),
            disabled: true,
            tooltip: QueryTool_properties.button_page_prev,
          }),
          Config(Label, {
            itemId: QueryPanelBase.PAGING_LABEL_ITEM_ID,
            cls: "query-label",
            margin: "3px 0 0 12px",
            text: QueryTool_properties.page_label,
          }),
          Config(IconButton, {
            itemId: QueryPanelBase.BUTTON_NEXT_PAGE_ID,
            iconCls: "query-page-next  cm-core-icons cm-core-icons--arrow-right",
            cls: "query-control",
            margin: "0 0 0 12px",
            handler: bind(this, this.pageNext),
            disabled: true,
            tooltip: QueryTool_properties.button_page_next,
          }),
        ],
      }),

      items: [
        // scrollable container for conditions container
        Config(Container, {
          itemId: "conditionContainerOuter",
          ui: ContainerSkin.LIGHT.getSkin(),
          flex: 1,
          cls: "cm-app-loading-screen",
          baseCls: "cm-app-loading-screen",
          overflowY: "scroll",
          items: [
            Config(Container, {
              itemId: QueryPanelBase.CONDITION_CONTAINER_ID,
              id: QueryPanelBase.CONDITION_CONTAINER_ID,
              cls: "cm-app-loading-screen",
              baseCls: "cm-app-loading-screen",
              items: [
              ],
            }),
          ],
        }),
      ],

    }), config))());
  }

  #contentTypeValueExpression: ValueExpression = null;

  /**
   * A valueExpression for the selected content type
   */
  get contentTypeValueExpression(): ValueExpression {
    return this.#contentTypeValueExpression;
  }

  set contentTypeValueExpression(value: ValueExpression) {
    this.#contentTypeValueExpression = value;
  }

  #includeSubTypesValueExpression: ValueExpression = null;

  /**
   * A valueExpression indicating the use of subtypes during evaluation of query results
   */
  get includeSubTypesValueExpression(): ValueExpression {
    return this.#includeSubTypesValueExpression;
  }

  set includeSubTypesValueExpression(value: ValueExpression) {
    this.#includeSubTypesValueExpression = value;
  }

  #includeSubTypesDisabledValueExpression: ValueExpression = null;

  /**
   * A valueExpression indicating if the property field (checkbox) for subtype inclusion is disabled
   */
  get includeSubTypesDisabledValueExpression(): ValueExpression {
    return this.#includeSubTypesDisabledValueExpression;
  }

  set includeSubTypesDisabledValueExpression(value: ValueExpression) {
    this.#includeSubTypesDisabledValueExpression = value;
  }

  #loadCountValueExpression: ValueExpression = null;

  /**
   * A valueExpression for the amount of data to load
   */
  get loadCountValueExpression(): ValueExpression {
    return this.#loadCountValueExpression;
  }

  set loadCountValueExpression(value: ValueExpression) {
    this.#loadCountValueExpression = value;
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

  #pageValueExpression: ValueExpression = null;

  /**
   * A valueExpression for the page to load
   */
  get pageValueExpression(): ValueExpression {
    return this.#pageValueExpression;
  }

  set pageValueExpression(value: ValueExpression) {
    this.#pageValueExpression = value;
  }

  #sendQueryValueExpression: ValueExpression = null;

  /**
   * A valueExpression to trigger the query
   */
  get sendQueryValueExpression(): ValueExpression {
    return this.#sendQueryValueExpression;
  }

  set sendQueryValueExpression(value: ValueExpression) {
    this.#sendQueryValueExpression = value;
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

  #queryDataValueExpression: ValueExpression = null;

  /**
   * A valueExpression for the data of the query
   */
  get queryDataValueExpression(): ValueExpression {
    return this.#queryDataValueExpression;
  }

  set queryDataValueExpression(value: ValueExpression) {
    this.#queryDataValueExpression = value;
  }
}

export default QueryPanel;
