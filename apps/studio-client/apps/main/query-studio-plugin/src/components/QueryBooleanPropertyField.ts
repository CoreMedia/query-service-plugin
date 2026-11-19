import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import { bind } from "@jangaroo/runtime";
import Checkbox from "@jangaroo/ext-ts/form/field/Checkbox";
import TextField from "@jangaroo/ext-ts/form/field/Text";
import TextfieldSkin from "@coremedia/studio-client.ext.ui-components/skins/TextfieldSkin";

interface QueryBooleanPropertyFieldConfig extends Config<Checkbox>, Partial<Pick<QueryBooleanPropertyField,
  "bindTo" |
  "initialValue"
>> {
}

/**
 * A switch editor for a boolean query condition with its current value on the right.
 **/
class QueryBooleanPropertyField extends Checkbox {
  declare Config: QueryBooleanPropertyFieldConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.queryBooleanPropertyField";

  constructor(config: Config<QueryBooleanPropertyField> = null) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    super(ConfigUtils.apply(Config(QueryBooleanPropertyField, {
      cls: "boolean-property-field query-boolean-switch",
      hideLabel: true,
      ariaRole: "switch",
      boxLabel: config.initialValue ? "true" : "false",
      boxLabelAlign: "after",
      ui: TextfieldSkin.SEMI_TRANSPARENT.getSkin(),
      plugins: [
        Config(BindPropertyPlugin, {
          bindTo: config.bindTo,
          bidirectional: true,
          value: config.initialValue ? config.initialValue : false,
        }),
      ],

    }), config));

    this$.#bindTo = config.bindTo;
    this$.#initialValue = config.initialValue;
    this$.addListener("change", bind(this$, this$.#updateValueLabel));
    this$.addListener("afterrender", bind(this$, this$.#setDefaultValue));
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

  /**
   * Setting the default value.
   * @param checkbox
   */
  #setDefaultValue(checkbox: Checkbox): void {
    this.#bindTo.setValue(this.#initialValue ? this.#initialValue : false);
    this.#updateValueLabel();
  }

  #updateValueLabel(): void {
    this.setBoxLabel(this.getValue() ? "true" : "false");
  }
}

export default QueryBooleanPropertyField;
