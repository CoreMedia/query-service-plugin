import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import LocalComboBox from "@coremedia/studio-client.ext.ui-components/components/LocalComboBox";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";
import TextfieldSkin from "@coremedia/studio-client.ext.ui-components/skins/TextfieldSkin";
import AnchorLayout from "@jangaroo/ext-ts/layout/container/Anchor";
import Tool from "@jangaroo/ext-ts/panel/Tool";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import QueryConditionBase from "./QueryConditionBase";

interface QueryConditionConfig extends Config<QueryConditionBase>, Partial<Pick<QueryCondition,
  "userListValueExpression" |
  "docType" |
  "propertyTypeMapping" |
  "type" |
  "propertyName" |
  "comparator" |
  "value"
>> {
}

class QueryCondition extends QueryConditionBase {
  declare Config: QueryConditionConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.queryCondition";

  constructor(config: Config<QueryCondition> = null) {
    super(((): any => ConfigUtils.apply(Config(QueryCondition, {

      padding: "10px 10px 0 10px",
      componentCls: "query-condition",

      items: [
        // first visible item of QueryCondition is a ComboBox with all document and system document properties available for filtering
        Config(LocalComboBox, {
          name: "propertyName",
          width: 300,
          cls: "query-control",
          margin: "0 0 0 0",
          padding: "8px 0 0 0",
          store: this.getPropertiesStore(config.docType, config.propertyTypeMapping),
          valueField: "name",
          displayField: "label",
          tpl: QueryConditionBase.getComboBoxTemplate(),
          ui: TextfieldSkin.WINDOW_HEADER.getSkin(),
          ...ConfigUtils.append({
            plugins: [
              Config(BindPropertyPlugin, {
                componentEvent: "change",
                bindTo: this.getPropertyNameVEx(),
                bidirectional: true,
              }),
            ],
          }),
        }),
      ],

      tools: [
        Config(Tool, {
          type: "close",
          handler: bind(this, this.removeCondition),
        }),
      ],

      layout: Config(AnchorLayout),

    }), config))());
  }

  #userListValueExpression: ValueExpression = null;

  // Available users.
  get userListValueExpression(): ValueExpression {
    return this.#userListValueExpression;
  }

  set userListValueExpression(value: ValueExpression) {
    this.#userListValueExpression = value;
  }

  #docType: string = null;

  // ContentType to determine the available properties
  get docType(): string {
    return this.#docType;
  }

  set docType(value: string) {
    this.#docType = value;
  }

  #propertyTypeMapping: Array<any> = null;

  // Array to store mapping for properties/types of properties
  get propertyTypeMapping(): Array<any> {
    return this.#propertyTypeMapping;
  }

  set propertyTypeMapping(value: Array<any>) {
    this.#propertyTypeMapping = value;
  }

  #type: string = null;

  // if available on generation - type of the condition
  get type(): string {
    return this.#type;
  }

  set type(value: string) {
    this.#type = value;
  }

  #propertyName: string = null;

  // if available on generation - name of the property
  get propertyName(): string {
    return this.#propertyName;
  }

  set propertyName(value: string) {
    this.#propertyName = value;
  }

  #comparator: string = null;

  // if available on generation - comparator
  get comparator(): string {
    return this.#comparator;
  }

  set comparator(value: string) {
    this.#comparator = value;
  }

  #value: any = null;

  // if available on generation - value
  get value(): any {
    return this.#value;
  }

  set value(value: any) {
    this.#value = value;
  }
}

export default QueryCondition;
