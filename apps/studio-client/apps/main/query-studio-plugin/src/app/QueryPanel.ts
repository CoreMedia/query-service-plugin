import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ContentTypeSelector from "@coremedia/studio-client.ext.cap-base-components/contenttypes/ContentTypeSelector";
import OpenDialogAction from "@coremedia/studio-client.ext.ui-components/actions/OpenDialogAction";
import LocalComboBox from "@coremedia/studio-client.ext.ui-components/components/LocalComboBox";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";
import ContainerSkin from "@coremedia/studio-client.ext.ui-components/skins/ContainerSkin";
import Editor_properties from "@coremedia/studio-client.main.editor-components/Editor_properties";
import Container from "@jangaroo/ext-ts/container/Container";
import Checkbox from "@jangaroo/ext-ts/form/field/Checkbox";
import VBoxLayout from "@jangaroo/ext-ts/layout/container/VBox";
import Item from "@jangaroo/ext-ts/menu/Item";
import Menu from "@jangaroo/ext-ts/menu/Menu";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import QueryLoadDialog from "../dialog/QueryLoadDialog";
import QuerySaveDialog from "../dialog/QuerySaveDialog";
import QueryToolManager from "../QueryToolManager";
import QueryTool_properties from "../properties/QueryTool_properties";
import QueryPanelBase from "./QueryPanelBase";
import PremularBase from "@coremedia/studio-client.main.editor-components/sdk/premular/PremularBase";
import Spacer from "@jangaroo/ext-ts/toolbar/Spacer";
import Button from "@jangaroo/ext-ts/button/Button";
import ButtonSkin from "@coremedia/studio-client.ext.ui-components/skins/ButtonSkin";
import HBoxLayout from "@jangaroo/ext-ts/layout/container/HBox";
import Panel from "@jangaroo/ext-ts/panel/Panel";
import PanelSkin from "@coremedia/studio-client.ext.ui-components/skins/PanelSkin";
import BindVisibilityPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindVisibilityPlugin";
import DisplayField from "@jangaroo/ext-ts/form/field/Display";
import DisplayFieldSkin from "@coremedia/studio-client.ext.ui-components/skins/DisplayFieldSkin";

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
    "queryDataValueExpression"
>> {
}

class QueryPanel extends QueryPanelBase {
  declare Config: QueryPanelConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.queryPanel";

  constructor(config: Config<QueryPanel> = null) {
    const queryToolManager = QueryToolManager.getInstance();
    super(((): any => ConfigUtils.apply(Config(QueryPanel, {
      itemId: QueryPanelBase.QUERY_PANEL_ID,
      ui: PanelSkin.CARD_100.getSkin(),
      minWidth: PremularBase.DEFAULT_DOCUMENT_CONTAINER_MIN_WIDTH,
      layout: Config(VBoxLayout, { align: "stretch" }),
      items: [

        // top toolbar: contentTypeSelector, loadCountSelector, adding of query conditions, sending query
        Config(Container, {
          ui: ContainerSkin.GRID_100.getSkin(),
          padding: "10px 0 0 0",
          items: [

            Config(Container, {
              ui: ContainerSkin.GRID_100.getSkin(),
              padding: "0 12px 10px 12px",
              items: [
                Config(DisplayField, {
                  value: QueryTool_properties.QueryPanel_title,
                  ui: DisplayFieldSkin.MEDIUM_BIG_HEADLINE.getSkin(),
                }),
                Config(Spacer, {
                  flex: 1
                }),
                Config(Button, {
                  itemId: "query-configuration-menu",
                  ui: ButtonSkin.TOOLBAR.getSkin(),
                  text: "...",
                  arrowVisible: false,
                  margin: "0 0 0 12px",
                  tooltip: QueryTool_properties.button_query_configuration_menu,
                  ariaLabel: QueryTool_properties.button_query_configuration_menu,
                  menu: Config(Menu, {
                    items: [
                      Config(Item, {
                        itemId: "load",
                        iconCls: QueryTool_properties.button_load_icon,
                        baseAction: new OpenDialogAction({
                          text: QueryTool_properties.button_load,
                          dialog: Config(QueryLoadDialog, {
                            loadCallBack: (content: Content) => queryToolManager.loadQueryConfiguration(content, bind(this, this.applyQueryConfiguration)),
                          }),
                        }),
                      }),
                      Config(Item, {
                        itemId: "save",
                        iconCls: QueryTool_properties.button_save_icon,
                        baseAction: new OpenDialogAction({
                          text: QueryTool_properties.button_save,
                          dialog: Config(QuerySaveDialog, {
                            saveCallBack: (filename: string) => queryToolManager.saveQueryConfiguration(filename, this.getQueryConditions()),
                            initialName: queryToolManager.getInitialFileName(),
                          }),
                        }),
                      }),
                    ],
                  }),
                }),
              ],
              layout: Config(HBoxLayout, { align: "stretch" }),
            }),

            Config(Container, {
              ui: ContainerSkin.GRID_100.getSkin(),
              padding: "0 12px 0 12px",
              items: [
                // ContentTypeSelector
                Config(ContentTypeSelector, {
                  itemId: "ctBox",
                  margin: "0 13 0 0",
                  flex: 2,
                  minWidth: 100,
                  emptyText: Editor_properties.SearchArea_content_type_selector_empty_text,
                  ariaLabel: Editor_properties.SearchArea_contenttypeselector_tooltip,
                  fieldLabel: "Type",
                  labelAlign: "top",
                  entries: this.getContentTypeData(),
                  contentTypeValueExpression: config.contentTypeValueExpression,
                }),
                Config(Spacer, { width: 20 }),
                // LoadCountSelector as ComboBox
                Config(LocalComboBox, {
                  itemId: "loadCount",
                  name: "loadCount",
                  cls: "query-control",
                  fieldLabel: "Limit",
                  labelAlign: "top",
                  store: [
                    [500, "500"],
                    [250, "250"],
                    [100, "100"],
                    [50, "50"],
                    [20, "20"],
                    [-1, "all"],
                  ],
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

                Config(Spacer, { width: 20 }),

                // Button send query
                Config(Button, {
                  itemId: "executeQuery",
                  cls: "query-tool-send-icon-button",
                  handler: bind(this, this.sendQuery),
                  iconCls: QueryTool_properties.button_send_icon,
                  tooltip: QueryTool_properties.button_send_tooltip,
                  ui: ButtonSkin.PRIMARY_LIGHT.getSkin(),
                  width: 80,
                })
              ],
              layout: Config(HBoxLayout, { align: "stretch" }),
            }),

            Config(Container, {
              ui: ContainerSkin.GRID_100.getSkin(),
              items: [
                // ContentTypeSelector
                Config(Checkbox, {
                  itemId: "check-subtypes",
                  cls: "query-control",
                  margin: "0 0 0 6px",
                  flex: 1,
                  boxLabel: QueryTool_properties.checkbox_subtypes,
                  plugins: [
                    Config(BindPropertyPlugin, {
                      bindTo: config.includeSubTypesValueExpression,
                      bidirectional: true,
                      ifUndefined: true,
                    }),
                    Config(BindVisibilityPlugin, {
                      bindTo: config.includeSubTypesDisabledValueExpression,
                      transformer: (value: boolean) => !value,
                    }),
                  ],
                }),
                Config(Spacer, { flex: 1 }),
              ],
              layout: Config(HBoxLayout, { align: "stretch" }),
            }),

          ],
          layout: Config(VBoxLayout, { align: "stretch" }),
        }),

        // scrollable container for conditions container
        Config(Panel, {
          itemId: "conditionContainerOuter",
          ui: PanelSkin.GRID_200.getSkin(),
          flex: 1,
          overflowY: "scroll",
          margin: "10 0 0 0",
          items: [
            Config(Container, {
              itemId: QueryPanelBase.CONDITION_CONTAINER_ID,
              id: QueryPanelBase.CONDITION_CONTAINER_ID,
              items: [
                Config(Container, {
                  padding: "10px",
                  items: [
                    Config(Button, {
                      itemId: "performQueryButton",
                      text: QueryTool_properties.button_send_text,
                      tooltip: QueryTool_properties.button_send_tooltip,
                      handler: bind(this, this.sendQuery),
                      ui: ButtonSkin.MATERIAL_PRIMARY.getSkin(),
                    }),
                    Config(Spacer, { width: 10 }),
                    Config(Button, {
                      itemId: "addQueryConditionButton",
                      text: QueryTool_properties.button_add_condition_text,
                      tooltip: QueryTool_properties.button_add_condition_tooltip,
                      handler: bind(this, this.addNewQueryCondition),
                      ui: ButtonSkin.MATERIAL_SECONDARY.getSkin(),
                    }),
                  ],
                  layout: Config(HBoxLayout, { align: "middle", pack: "center" }),
                })
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
