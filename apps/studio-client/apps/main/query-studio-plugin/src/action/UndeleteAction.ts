import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import UndeleteActionBase from "./UndeleteActionBase";

interface UndeleteActionConfig extends Config<UndeleteActionBase>, Partial<Pick<UndeleteAction,
  "undeleteValueExpression"
>> {
}

class UndeleteAction extends UndeleteActionBase {
  declare Config: UndeleteActionConfig;

  static readonly xtype: string = "com.coremedia.labs.query.studio.config.undeleteAction";

  constructor(config: Config<UndeleteAction> = null) {
    super(ConfigUtils.apply(Config(UndeleteAction), config));
  }

  #undeleteValueExpression: ValueExpression = null;

  get undeleteValueExpression(): ValueExpression {
    return this.#undeleteValueExpression;
  }

  set undeleteValueExpression(value: ValueExpression) {
    this.#undeleteValueExpression = value;
  }
}

export default UndeleteAction;
