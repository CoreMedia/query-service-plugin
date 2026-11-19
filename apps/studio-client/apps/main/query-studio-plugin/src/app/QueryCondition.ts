import { SvgIconUtil } from "@coremedia/studio-client.base-models";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import { trashBin } from "@coremedia/studio-client.common-icons";
import IconButton from "@coremedia/studio-client.ext.ui-components/components/IconButton";
import LocalComboBox from "@coremedia/studio-client.ext.ui-components/components/LocalComboBox";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";
import TextfieldSkin from "@coremedia/studio-client.ext.ui-components/skins/TextfieldSkin";
import Container from "@jangaroo/ext-ts/container/Container";
import HBoxLayout from "@jangaroo/ext-ts/layout/container/HBox";
import VBoxLayout from "@jangaroo/ext-ts/layout/container/VBox";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import QueryTool_properties from "../properties/QueryTool_properties";
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

      padding: "4px",
      componentCls: "query-condition",

      items: [
        Config(LocalComboBox, {
          itemId: "propertyName",
          name: "propertyName",
          flex: 1,
          minWidth: 0,
          cls: "query-control query-condition--property-name",
          store: this.getPropertiesStore(config.docType, config.propertyTypeMapping),
          valueField: "name",
          displayField: "label",
          typeAhead: true,
          allowBlank: false,
          anyMatch: true,
          tpl: QueryConditionBase.getComboBoxTemplate(),
          beforeSubTpl: "<span class=\"query-condition-property-icon\" aria-hidden=\"true\"></span>",
          listeners: {
            afterrender: bind(this, this.updatePropertyIcon),
            change: bind(this, this.updatePropertyIcon),
          },
          ui: TextfieldSkin.SEMI_TRANSPARENT.getSkin(),
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
        Config(Container, {
          itemId: QueryConditionBase.INPUTS_CONTAINER_ID,
          flex: 2,
          margin: "0 0 0 8px",
          layout: Config(VBoxLayout, { align: "stretch" }),
        }),
        Config(IconButton, {
          itemId: "removeCondition",
          margin: "0 0 0 8px",
          iconCls: SvgIconUtil.getIconStyleClassForSvgIcon(trashBin),
          tooltip: QueryTool_properties.button_remove,
          ariaLabel: QueryTool_properties.button_remove,
          handler: bind(this, this.removeCondition),
        }),
      ],

      layout: Config(HBoxLayout, { align: "top" }),

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

  #propertyTypeMapping: Record<string, string> = null;

  // Array to store mapping for properties/types of properties
  get propertyTypeMapping(): Record<string, string> {
    return this.#propertyTypeMapping;
  }

  set propertyTypeMapping(value: Record<string, string>) {
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
