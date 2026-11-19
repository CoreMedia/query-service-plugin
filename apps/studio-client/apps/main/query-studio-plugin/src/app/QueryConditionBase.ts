import CapPropertyDescriptor from "@coremedia/studio-client.cap-rest-client/common/CapPropertyDescriptor";
import session from "@coremedia/studio-client.cap-rest-client/common/session";
import ContentType from "@coremedia/studio-client.cap-rest-client/content/ContentType";
import Calendar from "@coremedia/studio-client.client-core/data/Calendar";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import beanFactory from "@coremedia/studio-client.client-core/data/beanFactory";
import IconWithTextBEMEntities from "@coremedia/studio-client.ext.ui-components/bem/IconWithTextBEMEntities";
import LocalComboBox from "@coremedia/studio-client.ext.ui-components/components/LocalComboBox";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";
import TextfieldSkin from "@coremedia/studio-client.ext.ui-components/skins/TextfieldSkin";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import PropertyEditorUtil from "@coremedia/studio-client.main.editor-components/sdk/util/PropertyEditorUtil";
import Ext from "@jangaroo/ext-ts";
import Component from "@jangaroo/ext-ts/Component";
import Container from "@jangaroo/ext-ts/container/Container";
import JsonStore from "@jangaroo/ext-ts/data/JsonStore";
import DataField from "@jangaroo/ext-ts/data/field/Field";
import Sorter from "@jangaroo/ext-ts/util/Sorter";
import { as, bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import QueryBooleanPropertyField from "../components/QueryBooleanPropertyField";
import QueryDatePropertyField from "../components/QueryDatePropertyField";
import QueryIntegerPropertyField from "../components/QueryIntegerPropertyField";
import QueryLinkListPropertyField from "../components/QueryLinkListPropertyField";
import QueryStringPropertyField from "../components/QueryStringPropertyField";
import QueryTool_properties from "../properties/QueryTool_properties";
import QueryCondition from "./QueryCondition";
import QueryPanel from "./QueryPanel";
import QueryPanelBase from "./QueryPanelBase";
import { SvgIconUtil } from "@coremedia/studio-client.base-models";
import blobPropertyIcon from "../icons/property-type--blob.svg";
import booleanPropertyIcon from "../icons/property-type--boolean.svg";
import contentLinkPropertyIcon from "../icons/property-type--content-link.svg";
import datePropertyIcon from "../icons/property-type--date.svg";
import folderLinkPropertyIcon from "../icons/property-type--folder-link.svg";
import integerPropertyIcon from "../icons/property-type--integer.svg";
import linkPropertyIcon from "../icons/property-type--link.svg";
import markupPropertyIcon from "../icons/property-type--markup.svg";
import stringPropertyIcon from "../icons/property-type--string.svg";
import structPropertyIcon from "../icons/property-type--struct.svg";
import userPropertyIcon from "../icons/property-type--user.svg";

interface QueryConditionBaseConfig extends Config<Container> {
}

/**
 * Query Condition
 * Query condition with a property ComboBox on the left, stacked comparator
 * and value editors in the middle, and a remove button on the right.
 *
 * @author dasc
 * @version $Id$
 */
class QueryConditionBase extends Container {
  declare Config: QueryConditionBaseConfig;

  static readonly INPUTS_CONTAINER_ID: string = "conditionInputs";

  #propertyTypeMapping: Record<string, string> = null;

  #activeType: string = "";

  #comparatorComponent: Component = null;

  #valueComponent: Component = null;

  #userListValueExpression: ValueExpression = null;

  #queryValueExpression: ValueExpression = null;

  readonly #propertyName: string = null;

  readonly #comparator: string = null;

  readonly #value: any;

  /**
   * Mapping of the displayed icon to the type of each possible property.
   * Used for Property-ComboBox.
   */
  static typeIconMapping: Record<string, any> = {
    STRING: SvgIconUtil.getIconStyleClassForSvgIcon(stringPropertyIcon),
    LINK: SvgIconUtil.getIconStyleClassForSvgIcon(linkPropertyIcon),
    INTEGER: SvgIconUtil.getIconStyleClassForSvgIcon(integerPropertyIcon),
    STRUCT: SvgIconUtil.getIconStyleClassForSvgIcon(structPropertyIcon),
    DATE: SvgIconUtil.getIconStyleClassForSvgIcon(datePropertyIcon),
    MARKUP: SvgIconUtil.getIconStyleClassForSvgIcon(markupPropertyIcon),
    BOOLEAN: SvgIconUtil.getIconStyleClassForSvgIcon(booleanPropertyIcon),
    CONTENT_LINK: SvgIconUtil.getIconStyleClassForSvgIcon(contentLinkPropertyIcon),
    FOLDER_LINK: SvgIconUtil.getIconStyleClassForSvgIcon(folderLinkPropertyIcon),
    USER: SvgIconUtil.getIconStyleClassForSvgIcon(userPropertyIcon),
    BLOB: SvgIconUtil.getIconStyleClassForSvgIcon(blobPropertyIcon),
  };

  constructor(config: Config<QueryCondition> = null) {
    super(((): any => {
      this.#userListValueExpression = config.userListValueExpression;
      this.#propertyTypeMapping = config.propertyTypeMapping;
      return config;
    })());

    // when data is loaded from settings, these will have values
    this.#propertyName = config.propertyName;
    this.#comparator = config.comparator;
    this.#value = config.value;
    // end

    const pnVE: ValueExpression = this.getPropertyNameVEx();
    pnVE.addChangeListener(bind(this, this.addTypeSpecificInputs));
    if (this.#propertyName)
      pnVE.setValue(this.#propertyName);
    else
      pnVE.setValue("name");

    const cVE: ValueExpression = this.getComparatorVEx();
    cVE.addChangeListener(bind(this, this.onComparatorChange));

    // each component gets an individual itemId, depending on the time of its creation
    this.itemId = "qc_" + (new Date()).getTime();
  }

  /******************************
   ****** ValueExpressions ******
   ******************************/

  /**
   * Initialising ValueExpression
   * Contains the data of the query condition.
   *
   * @return ValueExpression
   */
  protected getQueryValueExpression(): ValueExpression {
    if (!this.#queryValueExpression) {
      this.#queryValueExpression = ValueExpressionFactory.create("query", beanFactory._.createLocalBean());
      this.#queryValueExpression.setValue(beanFactory._.createLocalBean({ properties: beanFactory._.createLocalBean() }));
    }
    return this.#queryValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Contains the property name [String] of the condition.
   *
   * @return ValueExpression
   */
  getPropertyNameVEx(): ValueExpression {
    return this.getQueryValueExpression().extendBy("properties", "name");
  }

  /**
   * Initialising ValueExpression
   * Contains the comparator [String] of the condition.
   *
   * @return ValueExpression
   */
  getComparatorVEx(): ValueExpression {
    return this.getQueryValueExpression().extendBy("properties", "comparator");
  }

  /**
   * Initialising ValueExpression
   * Contains the value [Object] of the condition.
   *
   * @return ValueExpression
   */
  getPropertyValueVEx(): ValueExpression {
    return this.getQueryValueExpression().extendBy("properties", "value");
  }

  /**
   * Returns the type of the property.
   *
   * @return String
   */
  getActiveType(): string {
    return this.#activeType;
  }

  /******************************
   ******** Functionality *******
   ******************************/

  /**
   * Returns a JsonStore with data for the ComboBox for the properties available for the active contentType.
   * @param docType
   * @param propertyTypeMapping
   *
   * @return [JsonStore] - data store for the ComboBox
   */
  protected getPropertiesStore(docType: string, propertyTypeMapping: any): JsonStore {
    return Ext.create(JsonStore, {
      data: this.getPropertiesStoreData(docType, propertyTypeMapping),
      sorters: [
        Ext.create(Sorter, {
          property: "label",
          direction: "ASC",
        }),
      ],
      fields: [
        Ext.create(DataField, { name: "name" }),
        Ext.create(DataField, { name: "label" }),
        Ext.create(DataField, { name: "icon" }),
      ],
    });
  }

  /**
   * Calculates the data for the JsonStore for the properties ComboBox.
   * @param docType
   * @param propertyTypeMapping
   *
   * @return [Array] - data array for the store
   */
  protected getPropertiesStoreData(docType: string, propertyTypeMapping: any): Array<any> {
    const dataArray: Array<any> = [];
    const contentType: ContentType = session._.getConnection().getContentRepository().getContentType(docType);

    if (contentType) {
      if (!contentType.isAbstract()) {
        const descriptors: Array<CapPropertyDescriptor> = contentType.getDescriptors();
        for (let i: number = 0; i < descriptors.length; i++) {
          const descriptor: CapPropertyDescriptor = as(descriptors[i], CapPropertyDescriptor);
          const propertyName: string = descriptor.name;
          const icon: string = QueryConditionBase.typeIconMapping[descriptor.type];
          const displayName: string = PropertyEditorUtil.getLocalizedLabel(docType, propertyName);
          if (propertyName != "id") {
            dataArray.push([propertyName, displayName, icon]);
            propertyTypeMapping[propertyName] = descriptor.type;
          }
        }
      }

      const additionalParam: Array<any> = QueryPanelBase.ADDITIONAL_QUERY_PARAM;
      for (let p: number = 0; p < additionalParam.length; p++) {
        const add_propertyName: string = additionalParam[p].name;
        const add_propertyType: string = additionalParam[p].type;
        const add_icon: string = QueryConditionBase.typeIconMapping[add_propertyType];
        const add_displayName = QueryTool_properties[add_propertyName];
        dataArray.push([add_propertyName, add_displayName, add_icon]);
        propertyTypeMapping[add_propertyName] = add_propertyType;
      }
    }
    return dataArray;
  }

  /**
   * The template for displaying the combobox entries.
   *
   * @return [Array]
   */
  static getComboBoxTemplate(): Array<any> {
    return ["<tpl for=\".\">",
      "<div class=\"x-menu-item x-menu-item-default " + LocalComboBox.COMBO_BOX_TPL_ITEM_CLASS + "\" role=\"option\">",
      "<span class=\"" + IconWithTextBEMEntities.BLOCK + "\">",
      "<span class=\"" + IconWithTextBEMEntities.ELEMENT_ICON + " {icon}\"></span>",
      "<span class=\"" + IconWithTextBEMEntities.ELEMENT_TEXT + "\">{label}</span>",
      "</span>",
      "</div>",
      "</tpl>"];
  }

  static SPECIAL_CASE__TYPE: string = "BOOLEAN";
  static SPECIAL_CASE__PROPERTY: string = "REFERENCED";

  protected updatePropertyIcon(): void {
    const combo = as(this.queryById("propertyName"), LocalComboBox);
    if (!combo.rendered) {
      return;
    }
    const record = combo.findRecordByValue(combo.getValue());
    const icon = record ? record.get("icon") : "";
    combo.getEl().down(".query-condition-property-icon").setCls(
      "query-condition-property-icon" + (icon ? " " + icon : ""),
    );
  }

  /**
   * Callback function, that is called after the property selection in the corresponding ComboBox changed.
   * Adds additional inputs (dependent on the type of the selected property) to the QueryCondition and binds it
   * to the corresponding ValueExpressions ('comparator' and 'propertyValue')
   */
  protected addTypeSpecificInputs(): void {
    const inputs = as(this.queryById(QueryConditionBase.INPUTS_CONTAINER_ID), Container);
    const propertyName: string = this.getPropertyNameVEx().getValue();
    const conditionType: string = this.#propertyTypeMapping[propertyName];
    const isSpecialCase: boolean = conditionType === QueryConditionBase.SPECIAL_CASE__TYPE && propertyName === QueryConditionBase.SPECIAL_CASE__PROPERTY;

    if (conditionType == this.#activeType && conditionType !== QueryConditionBase.SPECIAL_CASE__TYPE)
      this.resetPreviousInputs(conditionType, false);
    else {
      this.#activeType = conditionType;
      this.removePreviousInputs();

      const comparatorConditionType: string = isSpecialCase
        ? conditionType + "_" + QueryConditionBase.SPECIAL_CASE__PROPERTY
        : conditionType;
      // creating a second ComboBox for comparators
      const comparatorOptions: any = QueryPanelBase.QUERY_TYPE_COMPARATORS[comparatorConditionType];
      if (comparatorOptions?.length > 0) {
        this.#comparatorComponent = Ext.create(LocalComboBox, {
          itemId: "comparator",
          name: "comparator",
          minWidth: 0,
          cls: "query-control query-condition--comparator",
          store: this.getComparatorStore(comparatorOptions),
          ui: TextfieldSkin.SEMI_TRANSPARENT.getSkin(),
          plugins: [
            Ext.create(BindPropertyPlugin, {
              componentEvent: "change",
              bindTo: this.getComparatorVEx(),
              bidirectional: true,
            }),
          ],
        });
        inputs.add(this.#comparatorComponent);
        const combo: LocalComboBox = as(this.#comparatorComponent, LocalComboBox);
        if (this.#comparator)
          combo.setValue(this.#comparator);
        else
          combo.setValue(combo.getStore().getAt(0).data.field1);
      }

      // creating the value-component depending on the type of the property
      switch (conditionType) {
      case "STRUCT":
      case "MARKUP":
      case "STRING":
      case "BLOB":
        this.#valueComponent = Ext.create(QueryStringPropertyField, {
          bindTo: this.getPropertyValueVEx(),
          margin: "8px 0 0 0",
          ui: TextfieldSkin.SEMI_TRANSPARENT.getSkin(),
        });
        inputs.add(this.#valueComponent);
        if (this.#value) {
          const text: QueryStringPropertyField = as(this.#valueComponent, QueryStringPropertyField);
          text.setValue(this.#value);
        }
        break;
      case "INTEGER":
        this.#valueComponent = Ext.create(QueryIntegerPropertyField, {
          bindTo: this.getPropertyValueVEx(),
          margin: "8px 0 0 0",
          ui: TextfieldSkin.SEMI_TRANSPARENT.getSkin(),
        });
        inputs.add(this.#valueComponent);
        if (this.#value) {
          const number: QueryIntegerPropertyField = as(this.#valueComponent, QueryIntegerPropertyField);
          number.setValue(this.#value);
        }
        break;
      case "LINK":
      case "CONTENT_LINK":
        this.#valueComponent = Ext.create(QueryLinkListPropertyField, {
          bindTo: this.getPropertyValueVEx(),
          propertyName: "link",
          linkType: "Document_",
          maxCardinality: 1,
          forceReadOnlyValueExpression: ValueExpressionFactory.createFromValue(false),
          margin: "8px 0 0 0",
        });
        const cLink: QueryLinkListPropertyField = as(this.#valueComponent, QueryLinkListPropertyField);
        if (this.#value)
          cLink.getLinkValueExpression().setValue([this.#value]);
        else
          cLink.getLinkValueExpression().setValue([]);
        inputs.add(this.#valueComponent);
        break;
      case "FOLDER_LINK":
        this.#valueComponent = Ext.create(QueryLinkListPropertyField, {
          bindTo: this.getPropertyValueVEx(),
          propertyName: "link",
          linkType: "Folder_",
          maxCardinality: 1,
          forceReadOnlyValueExpression: ValueExpressionFactory.createFromValue(false),
          margin: "8px 0 0 0",
          openCollectionViewHandler: QueryConditionBase.#openLibrary,
        });
        const fLink: QueryLinkListPropertyField = as(this.#valueComponent, QueryLinkListPropertyField);
        if (this.#value)
          fLink.getLinkValueExpression().setValue([this.#value]);
        else
          fLink.getLinkValueExpression().setValue([]);
        inputs.add(this.#valueComponent);
        break;
      case "DATE":
        this.#valueComponent = Ext.create(QueryDatePropertyField, {
          bindTo: this.getPropertyValueVEx(),
          initialValue: this.#value ? (this.#value as Calendar).getDate() : undefined,
          margin: "8px 0 0 0",
          ui: TextfieldSkin.SEMI_TRANSPARENT.getSkin(),
        });
        inputs.add(this.#valueComponent);
        break;
      case "BOOLEAN":
        this.#valueComponent = Ext.create(QueryBooleanPropertyField, {
          bindTo: this.getPropertyValueVEx(),
          margin: "8px 0 0 0",
          initialValue: this.#value ? this.#value : false,
        });
        inputs.add(this.#valueComponent);
        break;
      case "USER":
        this.#valueComponent = Ext.create(LocalComboBox, {
          itemId: "userCombo",
          name: "userCombo",
          cls: "query-control query-condition--user",
          margin: "8px 0 0 0",
          store: this.getUserStore(),
          ui: TextfieldSkin.SEMI_TRANSPARENT.getSkin(),
          plugins: [
            Ext.create(BindPropertyPlugin, {
              componentEvent: "change",
              bindTo: this.getPropertyValueVEx(),
              bidirectional: true,
            }),
          ],
        });
        inputs.add(this.#valueComponent);
        const user: LocalComboBox = as(this.#valueComponent, LocalComboBox);
        if (this.#value)
          user.setValue(this.#value);
        else
          user.setValue(user.getStore().getAt(0).data.field1);
        break;
      default: break;

      }
      if (this.#valueComponent) {
        this.#valueComponent.setMinHeight(36);
        this.#valueComponent.addCls("query-condition--property-value");
      }
    }
  }

  /**
   * Opening the library of CoreMedia Studio
   */
  static #openLibrary(): void {
    editorContext._.getCollectionViewManager().openRepository();
  }

  /**
   * Callback function, that is called after the selection of the comparator changed.
   * Handling visibility of valueComponent dependent on the value of the comparator.
   */
  protected onComparatorChange(): void {
    if (!this.#valueComponent) {
      return;
    }

    const compValue: string = this.getComparatorVEx().getValue();
    if (compValue === "IS NULL" || compValue === "IS NOT NULL") {
      this.#valueComponent.hide();
      this.resetPreviousInputs(this.#activeType, true);
    } else {
      this.#valueComponent.show();
    }
  }

  /**
   * Calculates the data array for the comparator-ComboBox.
   * @param options
   *
   * @return [Array] - data array for the ComboBox
   */
  protected getComparatorStore(options: any): Array<any> {
    const arrayStore: Array<any> = [];
    for (let o: number = 0; o < options.length; o++) {
      const comparatorName: string = options[o].name;
      const comparatorValue: string = options[o].value;
      const displayName = QueryTool_properties[comparatorName];
      arrayStore.push([comparatorValue, displayName]);
    }
    return arrayStore;
  }

  /**
   * Calculates the data array for the user-ComboBox
   *
   * @return [Array] - data array for the ComboBox
   */
  protected getUserStore(): Array<any> {
    const arrayStore: Array<any> = [];
    const userArray = this.#userListValueExpression.getValue();
    for (let u: number = 0; u < userArray.length; u++) {
      arrayStore.push([userArray[u].uriPath, userArray[u].name]);
    }
    return arrayStore;
  }

  /**
   * Resetting the data of the valueComponent.
   * @param conditionType
   * @param isComparatorChange
   */
  protected resetPreviousInputs(conditionType: string, isComparatorChange: boolean): void {
    if (!isComparatorChange && this.#comparatorComponent) {
      const combo: LocalComboBox = as(this.#comparatorComponent, LocalComboBox);
      combo.setValue(combo.getStore().getAt(0).data.field1);
    }

    if (!this.#valueComponent) {
      return;
    }

    switch (conditionType) {
    case "STRUCT":
    case "MARKUP":
    case "STRING":
    case "BLOB":
      const text: QueryStringPropertyField = as(this.#valueComponent, QueryStringPropertyField);
      text.setValue("");
      break;
    case "INTEGER":
      const number: QueryIntegerPropertyField = as(this.#valueComponent, QueryIntegerPropertyField);
      number.setValue(undefined);
      break;
    case "LINK":
    case "CONTENT_LINK":
    case "FOLDER_LINK":
      const link: QueryLinkListPropertyField = as(this.#valueComponent, QueryLinkListPropertyField);
      link.getLinkValueExpression().setValue([]);
      break;
    case "DATE":
      const date: QueryDatePropertyField = as(this.#valueComponent, QueryDatePropertyField);
      date.setValue("");
      break;
    case "BOOLEAN":
      const bool: QueryBooleanPropertyField = as(this.#valueComponent, QueryBooleanPropertyField);
      bool.setValue(false);
      break;
    case "USER":
      const user: LocalComboBox = as(this.#valueComponent, LocalComboBox);
      user.setValue(user.getStore().getAt(0).data.field1);
      break;
    default: break;
    }
  }

  /**
   * Remove comparatorComponent and valueComponent.
   */
  protected removePreviousInputs(): void {
    const comparatorComponent = this.#comparatorComponent;
    const valueComponent = this.#valueComponent;
    this.#comparatorComponent = null;
    this.#valueComponent = null;

    comparatorComponent?.destroy();
    this.getComparatorVEx().setValue("");
    valueComponent?.destroy();
    this.getPropertyValueVEx().setValue(undefined);
    this.updateLayout();
  }

  protected override onDestroy(): void {
    this.getPropertyNameVEx().removeChangeListener(bind(this, this.addTypeSpecificInputs));
    this.getComparatorVEx().removeChangeListener(bind(this, this.onComparatorChange));
    super.onDestroy();
  }

  /**
   * Trigger removing this condition from parent QueryPanel.
   */
  protected removeCondition(): void {
    const queryPanel: QueryPanel = as(this.findParentByType(QueryPanel.xtype), QueryPanel);
    queryPanel.removeCondition(as(this, QueryCondition));
  }
}

export default QueryConditionBase;
