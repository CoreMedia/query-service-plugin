import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";
import TextField from "@jangaroo/ext-ts/form/field/Text";
import { is } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";

interface QueryStringPropertyFieldConfig extends Config<TextField>, Partial<Pick<QueryStringPropertyField,
  "bindTo"
>> {
}

/**
 * An editor for a string query condition.
 **/
class QueryStringPropertyField extends TextField {
  declare Config: QueryStringPropertyFieldConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.queryStringPropertyField";

  constructor(config: Config<QueryStringPropertyField> = null) {
    super(ConfigUtils.apply(Config(QueryStringPropertyField, {

      hideLabel: true,
      emptyText: config.emptyText,

      plugins: [
        Config(BindPropertyPlugin, {
          bindTo: config.bindTo,
          bidirectional: true,
          transformer: (value: any): string => {
            if (is(value, String)) {
              return value;
            }
            return "";
          },
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

export default QueryStringPropertyField;
