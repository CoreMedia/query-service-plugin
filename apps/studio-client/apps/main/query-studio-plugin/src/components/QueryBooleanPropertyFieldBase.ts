import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import Checkbox from "@jangaroo/ext-ts/form/field/Checkbox";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import QueryBooleanPropertyField from "./QueryBooleanPropertyField";

interface QueryBooleanPropertyFieldBaseConfig extends Config<Checkbox> {
}

/**
 * Base class for Query CheckBox.
 */
class QueryBooleanPropertyFieldBase extends Checkbox {
  declare Config: QueryBooleanPropertyFieldBaseConfig;

  #bindTo: ValueExpression = null;

  #initialValue: boolean = false;

  /**
   *
   * @param config the config object
   */
  constructor(config: Config<QueryBooleanPropertyField> = null) {
    super(((): any => {
      this.#bindTo = config.bindTo;
      this.#initialValue = config.initialValue;
      return config;
    })());
    this.addListener("afterrender", bind(this, this.#setDefaultValue));
  }

  /**
   * Setting the default value.
   * @param checkbox
   */
  #setDefaultValue(checkbox: Checkbox): void {
    this.#bindTo.setValue(this.#initialValue ? this.#initialValue : false);
  }
}

export default QueryBooleanPropertyFieldBase;
