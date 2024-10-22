import BaseModels_properties from "@coremedia/studio-client.base-models/BaseModels_properties";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import QueryDatePropertyFieldBase from "./QueryDatePropertyFieldBase";

interface QueryDatePropertyFieldConfig extends Config<QueryDatePropertyFieldBase>, Partial<Pick<QueryDatePropertyField,
  "bindTo" |
  "initialValue"
>> {
}

/**
 * An editor for a date/calendar query condition.
 **/
class QueryDatePropertyField extends QueryDatePropertyFieldBase {
  declare Config: QueryDatePropertyFieldConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.queryDatePropertyField";

  constructor(config: Config<QueryDatePropertyField> = null) {
    super(ConfigUtils.apply(Config(QueryDatePropertyField, {

      format: ConfigUtils.asString(BaseModels_properties.dateFormat || "m/d/Y H:i"),
      itemId: "queryDateField",
      hideLabel: true,

      plugins: [
        Config(BindPropertyPlugin, {
          bindTo: config.bindTo,
          bidirectional: true,
        }),
      ],

    }), config));
  }

  #bindTo: ValueExpression = null;

  /**
   * Holds the value.
   */
  get bindTo(): ValueExpression {
    return this.#bindTo;
  }

  set bindTo(value: ValueExpression) {
    this.#bindTo = value;
  }

  #initialValue: Date = null;

  /**
   * Holds the inital value.
   */
  get initialValue(): Date {
    return this.#initialValue;
  }

  set initialValue(value: Date) {
    this.#initialValue = value;
  }
}

export default QueryDatePropertyField;
