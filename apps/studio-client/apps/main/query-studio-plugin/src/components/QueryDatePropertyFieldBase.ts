import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import DateField from "@jangaroo/ext-ts/form/field/Date";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import QueryDatePropertyField from "./QueryDatePropertyField";

interface QueryDatePropertyFieldBaseConfig extends Config<DateField> {
}

/**
 * Base class for the query date field.
 */
class QueryDatePropertyFieldBase extends DateField {
  declare Config: QueryDatePropertyFieldBaseConfig;

  #bindTo: ValueExpression = null;

  #initialValue: Date = null;

  /**
   *
   * @param config the config object
   */
  constructor(config: Config<QueryDatePropertyField> = null) {
    super(((): any => {
      this.#bindTo = config.bindTo;
      this.#initialValue = config.initialValue;
      return config;
    })());
    this.addListener("afterrender", bind(this, this.#setDefaultValue));
  }

  /**
   * Setting the default value.
   * @param dateField
   */
  #setDefaultValue(dateField: DateField): void {
    this.#bindTo.setValue(this.#initialValue ? this.#initialValue : "");
  }
}

export default QueryDatePropertyFieldBase;
