import PasteFromClipboardAction from "@coremedia/studio-client.main.editor-components/sdk/clipboard/PasteFromClipboardAction";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import QueryPasteLinkActionBase from "./QueryPasteLinkActionBase";

interface QueryPasteLinkActionConfig extends Config<QueryPasteLinkActionBase> {
}

class QueryPasteLinkAction extends QueryPasteLinkActionBase {
  declare Config: QueryPasteLinkActionConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.queryPasteLinkAction";

  constructor(config: Config<QueryPasteLinkAction> = null) {
    super(ConfigUtils.apply(Config(QueryPasteLinkAction), config));
  }

  /**
   * ACTION_ID
   */
  static readonly ACTION_ID: string = PasteFromClipboardAction.ACTION_ID;
}

export default QueryPasteLinkAction;
