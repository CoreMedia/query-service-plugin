import StudioPlugin from "@coremedia/studio-client.main.editor-components/configuration/StudioPlugin";
import IEditorContext from "@coremedia/studio-client.main.editor-components/sdk/IEditorContext";
import Ext from "@jangaroo/ext-ts";
import Config from "@jangaroo/runtime/Config";
import QueryStudioPlugin from "./QueryStudioPlugin";

interface QueryStudioPluginBaseConfig extends Config<StudioPlugin> {
}

class QueryStudioPluginBase extends StudioPlugin {
  declare Config: QueryStudioPluginBaseConfig;

  constructor(config: Config<QueryStudioPlugin> = null) {
    super(config);
  }

  override init(editorContext: IEditorContext): void {
    super.init(editorContext);

    // deactivate aria warnings to keep browserlog clean
    Ext["ariaWarn"] = Ext.emptyFn;
  }
}

export default QueryStudioPluginBase;
