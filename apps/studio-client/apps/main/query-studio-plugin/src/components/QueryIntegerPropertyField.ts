import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import StatefulNumberField from "@coremedia/studio-client.ext.ui-components/components/StatefulNumberField";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";
import IntegerPropertyField from "@coremedia/studio-client.main.editor-components/sdk/premular/fields/IntegerPropertyField";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";

interface QueryIntegerPropertyFieldConfig extends Config<StatefulNumberField>, Partial<Pick<QueryIntegerPropertyField,
  "bindTo"
>> {
}

/**
 * An editor for an integer query condition.
 **/
class QueryIntegerPropertyField extends StatefulNumberField {
  declare Config: QueryIntegerPropertyFieldConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.queryIntegerPropertyField";

  constructor(config: Config<QueryIntegerPropertyField> = null) {
    super(ConfigUtils.apply(Config(QueryIntegerPropertyField, {

      allowBlank: true,
      allowDecimals: false,
      itemId: IntegerPropertyField.INTEGER_PROPERTY_FIELD_ITEM_ID,
      hideLabel: true,
      hideTrigger: true,
      maxValue: IntegerPropertyField.MAX_VALUE,
      minValue: IntegerPropertyField.MIN_VALUE,

      plugins: [
        Config(BindPropertyPlugin, {
          bindTo: config.bindTo,
          bidirectional: true,
          reverseTransformer: (value: any): any =>
            (value || (value === 0))
              ? value
              : null,
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
}

export default QueryIntegerPropertyField;
