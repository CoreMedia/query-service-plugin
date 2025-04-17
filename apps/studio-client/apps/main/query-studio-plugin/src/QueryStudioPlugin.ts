import {studioAppsContext} from "@coremedia/studio-client.app-context-models";
import {StudioAppsContextImpl} from "@coremedia/studio-client.app-context-models/apps/StudioAppsContextImpl";
import IEditorContext from "@coremedia/studio-client.main.editor-components/sdk/IEditorContext";
import OpenTabAction from "@coremedia/studio-client.main.editor-components/sdk/actions/OpenTabAction";
import ComponentBasedWorkAreaTabType from "@coremedia/studio-client.main.editor-components/sdk/desktop/ComponentBasedWorkAreaTabType";
import WorkArea from "@coremedia/studio-client.main.editor-components/sdk/desktop/WorkArea";
import WorkAreaTabTypesPlugin from "@coremedia/studio-client.main.editor-components/sdk/desktop/WorkAreaTabTypesPlugin";
import Button from "@jangaroo/ext-ts/button/Button";
import {cast} from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import QueryStudioPluginBase from "./QueryStudioPluginBase";
import QueryToolTab from "./app/QueryToolTab";
import QueryTool_properties from "./properties/QueryTool_properties";

interface QueryStudioPluginConfig extends Config<QueryStudioPluginBase> {
}

class QueryStudioPlugin extends QueryStudioPluginBase {
  declare Config: QueryStudioPluginConfig;

  static readonly xtype: string = "com.coremedia.labs.query.studio.config.queryStudioPlugin";

  override init(editorContext: IEditorContext): void {
    super.init(editorContext);

    const buttonCfg = Config(Button);
    buttonCfg.id = "showQueryTool";
    buttonCfg.itemId = "btn-query-tool";
    buttonCfg.text = QueryTool_properties.Action_showQueryTool_text;
    buttonCfg.iconCls = "cm-core-icons--research cm-core-icons--200";
    buttonCfg.iconAlign = "top";
    buttonCfg.baseAction = new OpenTabAction({
      singleton: true,
      tab: Config(QueryToolTab),
    });
    const button = new Button(buttonCfg);

    cast(StudioAppsContextImpl, studioAppsContext._).getShortcutRunnerRegistry().registerShortcutRunner("queryTool", (): void => {
      typeof button.handler !== "string" && button.handler(button, null);
    });
  }

  constructor(config: Config<QueryStudioPlugin> = null) {
    super(ConfigUtils.apply(Config(QueryStudioPlugin, {
      rules: [

        Config(WorkArea, {
          plugins: [
            Config(WorkAreaTabTypesPlugin, {
              tabTypes: [
                new ComponentBasedWorkAreaTabType({ tabComponent: Config(QueryToolTab, { closable: true }) }),
              ],
            }),
          ],
        }),
      ],

      configuration: [],

    }), config));
  }
}

export default QueryStudioPlugin;
