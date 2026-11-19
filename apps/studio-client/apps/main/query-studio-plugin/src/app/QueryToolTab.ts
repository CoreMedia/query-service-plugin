import AnimationImages from "@coremedia/studio-client.ext.animation-components/components/AnimationImages";
import TitledStudioAnimation from "@coremedia/studio-client.ext.base-components/animations/TitledStudioAnimation";
import OpenInTabAction from "@coremedia/studio-client.ext.form-services-toolkit/actions/OpenInTabAction";
import SwitchingContainer from "@coremedia/studio-client.ext.ui-components/components/SwitchingContainer";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";
import ContainerSkin from "@coremedia/studio-client.ext.ui-components/skins/ContainerSkin";
import DisplayFieldSkin from "@coremedia/studio-client.ext.ui-components/skins/DisplayFieldSkin";
import PanelSkin from "@coremedia/studio-client.ext.ui-components/skins/PanelSkin";
import SplitterSkin from "@coremedia/studio-client.ext.ui-components/skins/SplitterSkin";
import CopyToClipboardAction from "@coremedia/studio-client.main.editor-components/sdk/clipboard/CopyToClipboardAction";
import StringUtil from "@jangaroo/ext-ts/String";
import Container from "@jangaroo/ext-ts/container/Container";
import HBoxLayout from "@jangaroo/ext-ts/layout/container/HBox";
import VBoxLayout from "@jangaroo/ext-ts/layout/container/VBox";
import Item from "@jangaroo/ext-ts/menu/Item";
import Menu from "@jangaroo/ext-ts/menu/Menu";
import Splitter from "@jangaroo/ext-ts/resizer/Splitter";
import Format from "@jangaroo/ext-ts/util/Format";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import OpenInRepositoryAction from "../action/OpenInRepositoryAction";
import UndeleteAction from "../action/UndeleteAction";
import QueryTool_properties from "../properties/QueryTool_properties";
import QueryPanel from "./QueryPanel";
import QueryResultGridPanel from "./QueryResultGridPanel";
import QueryToolTabBase from "./QueryToolTabBase";
import QueryToolManager from "../QueryToolManager";
import DisplayField from "@jangaroo/ext-ts/form/field/Display";
import Panel from "@jangaroo/ext-ts/panel/Panel";

interface QueryToolTabConfig extends Config<QueryToolTabBase> {
}

class QueryToolTab extends QueryToolTabBase {
  declare Config: QueryToolTabConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.queryToolTab";

  static readonly QUERY_TOOL_TAB_ID: string = "query-tool-tab";

  constructor(config: Config<QueryToolTab> = null) {
    super(((): any => ConfigUtils.apply(Config(QueryToolTab, {
      title: QueryTool_properties.Tab_QueryTool_title,
      ui: PanelSkin.CARD.getSkin(),
      iconCls: QueryTool_properties.Tab_QueryTool_icon,
      cls: "query-tool",
      id: QueryToolTab.QUERY_TOOL_TAB_ID,
      closable: true,
      layout: Config(HBoxLayout, { align: "stretch" }),
      items: [
        // Left area: panel for query controls and conditions
        Config(QueryPanel, {
          flex: 1,
          contentTypeValueExpression: QueryToolManager.getInstance().getContentTypeValueExpression(),
          includeSubTypesValueExpression: QueryToolManager.getInstance().getIncludeSubTypesValueExpression(),
          includeSubTypesDisabledValueExpression: this.getIsAbstractContentTypeValueExpression(),
          loadCountValueExpression: QueryToolManager.getInstance().getLoadCountValueExpression(),
          maxCountValueExpression: this.getMaxCountValueExpression(),
          pageValueExpression: QueryToolManager.getInstance().getPageValueExpression(),
          queryDataValueExpression: QueryToolManager.getInstance().getQueryDataValueExpression(),
          sendQueryValueExpression: this.getSendQueryValueExpression(),
          storeValueExpression: this.getStoreValueExpression(),
          totalCountValueExpression: this.getTotalCountValueExpression(),
        }),

        Config(Splitter, {
          width: "4px",
          ui: SplitterSkin.DARK.getSkin(),
        }),

        // Right area: empty view or result grid
        Config(SwitchingContainer, {
          id: "queryScrollablePanelContainer",
          flex: 3,
          activeItemValueExpression: this.getTotalCountValueExpression(),
          transformer: (count: number): string => count > 0 ? "queryResultGridContainer" : "queryEmptyView",
          items: [
            Config(Container, {
              itemId: "queryEmptyView",
              layout: Config(VBoxLayout, { align: "stretch", pack: "center" }),
              items: [
                Config(TitledStudioAnimation, {
                  padding: "0 12px",
                  svg: AnimationImages.EMPTY_SEARCH,
                  title: QueryTool_properties.empty_results_title,
                  text: QueryTool_properties.empty_results_text,
                }),
              ],
            }),
            Config(Panel, {
              itemId: "queryResultGridContainer",
              id: "query_gridContainer",
              flex: 1,
              ui: PanelSkin.CARD_100.getSkin(),
              layout: Config(VBoxLayout, { align: "stretch" }),
              items: [
                Config(DisplayField, {
                  ui: DisplayFieldSkin.MEDIUM_BIG_HEADLINE.getSkin(),
                  margin: "10px 12px",
                  plugins: [
                    Config(BindPropertyPlugin, {
                      bindTo: this.getMaxCountValueExpression(),
                      componentProperty: "value",
                      transformer: (count: number): string => StringUtil.format(
                        count === 1 ? QueryTool_properties.QueryResultGrid_singleResult : QueryTool_properties.QueryResultGrid_multipleResults,
                        Format.number(count, "0,000"),
                      ),
                    }),
                  ],
                }),
                Config(QueryResultGridPanel, {
                  flex: 1,
                  maxCountValueExpression: this.getMaxCountValueExpression(),
                  selectedValueExpression: this.getSelectedValueExpression(),
                  selectedContentValueExpression: this.getSelectedContentValueExpression(),
                  storeValueExpression: this.getStoreValueExpression(),
                  totalCountValueExpression: this.getTotalCountValueExpression(),
                  userValueExpression: QueryToolManager.getInstance().getUserValueExpression(),
                  // @ts-ignore
                  contextMenu: Config(Menu, {
                    shadow: false,
                    itemId: "contextMenu",
                    items: [
                      Config(Item, {
                        baseAction: new OpenInTabAction({
                          actionId: "openInTabAction",
                          contentValueExpression: this.getSelectedContentValueExpression(),
                        }),
                      }),
                      Config(Item, {
                        iconCls: "cm-core-icons cm-core-icons--show-in-library",
                        text: QueryTool_properties.label_showInLibrary,
                        baseAction: new OpenInRepositoryAction({
                          actionId: "openInRepositoryAction",
                          contentValueExpression: this.getSelectedContentValueExpression(),
                        }),
                      }),
                      Config(Item, {
                        baseAction: new CopyToClipboardAction({
                          actionId: CopyToClipboardAction.ACTION_ID,
                          contentValueExpression: this.getSelectedContentValueExpression(),
                        }),
                      }),
                      Config(Item, {
                        iconCls: "cm-core-icons cm-core-icons--undelete",
                        text: QueryTool_properties.label_undelete,
                        baseAction: new UndeleteAction({
                          actionId: "undeleteAction",
                          undeleteValueExpression: this.getUndeleteValueExpression(),
                          contentValueExpression: this.getSelectedContentValueExpression(),
                        }),
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        }),
      ],
    }), config))());
  }
}

export default QueryToolTab;
