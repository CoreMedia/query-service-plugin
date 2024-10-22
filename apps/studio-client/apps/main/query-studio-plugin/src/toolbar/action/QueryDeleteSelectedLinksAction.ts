import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import DeleteAction from "@coremedia/studio-client.main.editor-components/sdk/actions/DeleteAction";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import QueryDeleteSelectedLinksActionBase from "./QueryDeleteSelectedLinksActionBase";

interface QueryDeleteSelectedLinksActionConfig extends Config<QueryDeleteSelectedLinksActionBase>, Partial<Pick<QueryDeleteSelectedLinksAction,
  "selectedPositionsExpression" |
  "selectedPositionsVariableName"
>> {
}

class QueryDeleteSelectedLinksAction extends QueryDeleteSelectedLinksActionBase {
  declare Config: QueryDeleteSelectedLinksActionConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.queryDeleteSelectedLinksAction";

  constructor(config: Config<QueryDeleteSelectedLinksAction> = null) {
    super(ConfigUtils.apply(Config(QueryDeleteSelectedLinksAction), config));
  }

  /**
   * ACTION_ID
   */
  static readonly ACTION_ID: string = DeleteAction.ACTION_ID;

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

export default QueryDeleteSelectedLinksAction;
