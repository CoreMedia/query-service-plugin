import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import QueryBooleanPropertyFieldBase from "./QueryBooleanPropertyFieldBase";

interface QueryBooleanPropertyFieldConfig extends Config<QueryBooleanPropertyFieldBase>, Partial<Pick<QueryBooleanPropertyField,
  "bindTo" |
  "initialValue"
>> {
}

/**
 * An editor for a boolean query condition.
 **/
class QueryBooleanPropertyField extends QueryBooleanPropertyFieldBase {
  declare Config: QueryBooleanPropertyFieldConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.queryBooleanPropertyField";

  constructor(config: Config<QueryBooleanPropertyField> = null) {
    super(ConfigUtils.apply(Config(QueryBooleanPropertyField, {

      cls: "boolean-property-field",
      hideLabel: true,

      plugins: [
        Config(BindPropertyPlugin, {
          bindTo: config.bindTo,
          bidirectional: true,
          value: config.initialValue ? config.initialValue : false,
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

  #initialValue: boolean = false;

  /**
   * Holds the initial value.
   */
  get initialValue(): boolean {
    return this.#initialValue;
  }

  set initialValue(value: boolean) {
    this.#initialValue = value;
  }
}

export default QueryBooleanPropertyField;
