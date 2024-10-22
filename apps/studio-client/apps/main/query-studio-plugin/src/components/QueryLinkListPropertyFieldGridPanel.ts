import MoveLinkAction from "@coremedia/studio-client.main.editor-components/sdk/actions/MoveLinkAction";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import QueryLinkListPropertyFieldGridPanelBase from "./QueryLinkListPropertyFieldGridPanelBase";

interface QueryLinkListPropertyFieldGridPanelConfig extends Config<QueryLinkListPropertyFieldGridPanelBase> {
}

class QueryLinkListPropertyFieldGridPanel extends QueryLinkListPropertyFieldGridPanelBase {
  declare Config: QueryLinkListPropertyFieldGridPanelConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.queryLinkListPropertyFieldGridPanel";

  constructor(config: Config<QueryLinkListPropertyFieldGridPanel> = null) {
    super(((): any => ConfigUtils.apply(Config(QueryLinkListPropertyFieldGridPanel, {

      hideHeaders: true,
      forceFit: true,
      linkListWrapper: this.getContentLinkListWrapper(config),
      dropAreaHandler: bind(this, this.processOpenCollectionViewHandler),
      dropAreaText: this.getDropAreaText(config),
      readOnlyValueExpression: config.forceReadOnlyValueExpression,

      ...ConfigUtils.append({
        actionList: [
          new MoveLinkAction({
            actionId: MoveLinkAction.ACTION_ID_UP,
            grid: this,
            direction: MoveLinkAction.ACTION_ID_UP,
            linkListWrapper: this.getContentLinkListWrapper(config),
          }),
          new MoveLinkAction({
            actionId: MoveLinkAction.ACTION_ID_DOWN,
            grid: this,
            direction: MoveLinkAction.ACTION_ID_DOWN,
            linkListWrapper: this.getContentLinkListWrapper(config),
          }),
        ],
      }),

    }), config))());
  }
}

export default QueryLinkListPropertyFieldGridPanel;
