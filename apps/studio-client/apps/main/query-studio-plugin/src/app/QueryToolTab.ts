import OpenInTabAction from "@coremedia/studio-client.ext.form-services-toolkit/actions/OpenInTabAction";
import ContainerSkin from "@coremedia/studio-client.ext.ui-components/skins/ContainerSkin";
import PanelSkin from "@coremedia/studio-client.ext.ui-components/skins/PanelSkin";
import SplitterSkin from "@coremedia/studio-client.ext.ui-components/skins/SplitterSkin";
import CopyToClipboardAction from "@coremedia/studio-client.main.editor-components/sdk/clipboard/CopyToClipboardAction";
import Container from "@jangaroo/ext-ts/container/Container";
import HBoxLayout from "@jangaroo/ext-ts/layout/container/HBox";
import VBoxLayout from "@jangaroo/ext-ts/layout/container/VBox";
import Item from "@jangaroo/ext-ts/menu/Item";
import Menu from "@jangaroo/ext-ts/menu/Menu";
import Splitter from "@jangaroo/ext-ts/resizer/Splitter";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import OpenInRepositoryAction from "../action/OpenInRepositoryAction";
import UndeleteAction from "../action/UndeleteAction";
import QueryTool_properties from "../properties/QueryTool_properties";
import QueryPanel from "./QueryPanel";
import QueryResultGridPanel from "./QueryResultGridPanel";
import QueryToolTabBase from "./QueryToolTabBase";

interface QueryToolTabConfig extends Config<QueryToolTabBase> {
}

class QueryToolTab extends QueryToolTabBase {
  declare Config: QueryToolTabConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.queryToolTab";

  constructor(config: Config<QueryToolTab> = null) {
    super(((): any => ConfigUtils.apply(Config(QueryToolTab, {

      title: QueryTool_properties.Tab_QueryTool_title,
      ui: PanelSkin.FRAME.getSkin(),
      iconCls: "cm-core-icons cm-core-icons--research",
      cls: "query-tool",
      itemId: "query-tool-tab",
      closable: true,

      layout: Config(HBoxLayout, { align: "stretch" }),

      items: [

        // Left area: panel for query controls and conditions
        Config(QueryPanel, {
          contentTypeValueExpression: this.getContentTypeValueExpression(),
          includeSubTypesValueExpression: this.getIncludeSubTypesValueExpression(),
          includeSubTypesDisabledValueExpression: this.getIsAbstractContentTypeValueExpression(),
          loadCountValueExpression: this.getLoadCountValueExpression(),
          maxCountValueExpression: this.getMaxCountValueExpression(),
          pageValueExpression: this.getPageValueExpression(),
          queryDataValueExpression: this.getQueryDataValueExpression(),
          sendQueryValueExpression: this.getSendQueryValueExpression(),
          storeValueExpression: this.getStoreValueExpression(),
          totalCountValueExpression: this.getTotalCountValueExpression(),
          userValueExpression: this.getUserValueExpression(),
        }),

        Config(Splitter, {
          width: "4px",
          ui: SplitterSkin.DARK.getSkin(),
        }),

        // Right area: result grid
        Config(Container, {
          id: "queryScrollablePanelContainer",
          flex: 1,
          items: [
            Config(Container, {
              itemId: "queryResultGridContainer",
              id: "query_gridContainer",
              flex: 1,
              ui: ContainerSkin.LIGHT.getSkin(),
              autoScroll: true,
              defaults: "",
              items: [
                Config(QueryResultGridPanel, {
                  maxCountValueExpression: this.getMaxCountValueExpression(),
                  selectedValueExpression: this.getSelectedValueExpression(),
                  selectedContentValueExpression: this.getSelectedContentValueExpression(),
                  storeValueExpression: this.getStoreValueExpression(),
                  totalCountValueExpression: this.getTotalCountValueExpression(),
                  userValueExpression: this.getUserValueExpression(),
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

          layout: Config(VBoxLayout, { align: "stretch" }),
        }),

      ],

    }), config))());
  }
}

export default QueryToolTab;
