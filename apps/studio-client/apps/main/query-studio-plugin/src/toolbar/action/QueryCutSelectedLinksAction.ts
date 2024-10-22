import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import CutToClipboardAction from "@coremedia/studio-client.main.editor-components/sdk/clipboard/CutToClipboardAction";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import QueryCutSelectedLinksActionBase from "./QueryCutSelectedLinksActionBase";

interface QueryCutSelectedLinksActionConfig extends Config<QueryCutSelectedLinksActionBase>, Partial<Pick<QueryCutSelectedLinksAction,
  "selectedPositionsExpression" |
  "selectedPositionsVariableName"
>> {
}

class QueryCutSelectedLinksAction extends QueryCutSelectedLinksActionBase {
  declare Config: QueryCutSelectedLinksActionConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.queryCutSelectedLinksAction";

  constructor(config: Config<QueryCutSelectedLinksAction> = null) {
    super(ConfigUtils.apply(Config(QueryCutSelectedLinksAction), config));
  }

  /**
   * ACTION_ID
   */
  static readonly ACTION_ID: string = CutToClipboardAction.ACTION_ID;

  #selectedPositionsExpression: ValueExpression = null;

  /**
   * DEPRECATED: Use the selectedPositionsVariableName config instead.
   * A value expression holding the positions of the selected items in the LinkList.
   */
  get selectedPositionsExpression(): ValueExpression {
    return this.#selectedPositionsExpression;
  }

  set selectedPositionsExpression(value: ValueExpression) {
    this.#selectedPositionsExpression = value;
  }

  #selectedPositionsVariableName: string = null;

  /**
   * The name of the selected positions variable to be injected to the selected positions property.
   * The context value should be an array of numbers
   */
  get selectedPositionsVariableName(): string {
    return this.#selectedPositionsVariableName;
  }

  set selectedPositionsVariableName(value: string) {
    this.#selectedPositionsVariableName = value;
  }
}

export default QueryCutSelectedLinksAction;
