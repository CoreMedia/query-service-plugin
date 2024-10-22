import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import OpenInTabAction from "@coremedia/studio-client.ext.form-services-toolkit/actions/OpenInTabAction";
import FloatingToolbar from "@coremedia/studio-client.ext.ui-components/components/FloatingToolbar";
import IconButton from "@coremedia/studio-client.ext.ui-components/components/IconButton";
import AddItemsPlugin from "@coremedia/studio-client.ext.ui-components/plugins/AddItemsPlugin";
import ToolbarSkin from "@coremedia/studio-client.ext.ui-components/skins/ToolbarSkin";
import CopyToClipboardAction from "@coremedia/studio-client.main.editor-components/sdk/clipboard/CopyToClipboardAction";
import CutToClipboardAction from "@coremedia/studio-client.main.editor-components/sdk/clipboard/CutToClipboardAction";
import PropertyField from "@coremedia/studio-client.main.editor-components/sdk/premular/PropertyField";
import LinkListPropertyField from "@coremedia/studio-client.main.editor-components/sdk/premular/fields/LinkListPropertyField";
import LinkListPropertyFieldToolbar from "@coremedia/studio-client.main.editor-components/sdk/premular/fields/LinkListPropertyFieldToolbar";
import Separator from "@jangaroo/ext-ts/toolbar/Separator";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import int from "@jangaroo/runtime/int";
import QueryCutSelectedLinksAction from "./action/QueryCutSelectedLinksAction";
import QueryDeleteSelectedLinksAction from "./action/QueryDeleteSelectedLinksAction";
import QueryPasteLinkAction from "./action/QueryPasteLinkAction";

interface QueryLinkListPropertyFieldToolbarConfig extends Config<FloatingToolbar>, Partial<Pick<QueryLinkListPropertyFieldToolbar,
  "bindTo" |
  "forceReadOnlyValueExpression" |
  "selectedValuesExpression" |
  "selectedPositionsExpression" |
  "propertyName" |
  "linkType" |
  "maxCardinality" |
  "additionalToolbarItems"
>> {
}

class QueryLinkListPropertyFieldToolbar extends FloatingToolbar {
  declare Config: QueryLinkListPropertyFieldToolbarConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.queryLinkListPropertyFieldToolbar";

  constructor(config: Config<QueryLinkListPropertyFieldToolbar> = null) {
    super(ConfigUtils.apply(Config(QueryLinkListPropertyFieldToolbar, {

      ui: ToolbarSkin.LIGHT.getSkin(),
      defaultType: PropertyField.xtype,

      defaults: Config<PropertyField>({
        bindTo: config.bindTo.extendBy("properties", config.propertyName),
        forceReadOnlyValueExpression: config.forceReadOnlyValueExpression,
      }),

      plugins: [
        Config(AddItemsPlugin, { items: config.additionalToolbarItems }),
      ],

      items: [
        Config(IconButton, {
          itemId: LinkListPropertyField.DELETE_BUTTON_ITEM_ID,
          baseAction: new QueryDeleteSelectedLinksAction({
            actionId: QueryDeleteSelectedLinksAction.ACTION_ID,
            bindTo: config.bindTo,
            propertyName: config.propertyName,
            selectedPositionsExpression: config.selectedPositionsExpression,
            forceReadOnlyValueExpression: config.forceReadOnlyValueExpression,
          }),
        }),
        Config(IconButton, {
          itemId: LinkListPropertyField.OPEN_BUTTON_ITEM_ID,
          baseAction: new OpenInTabAction({ contentValueExpression: config.selectedValuesExpression }),
        }),
        Config(Separator, { itemId: LinkListPropertyFieldToolbar.LINK_LIST_SEP_FIRST_ITEM_ID }),
        Config(IconButton, {
          itemId: LinkListPropertyField.CUT_BUTTON_ITEM_ID,
          baseAction: new QueryCutSelectedLinksAction({
            actionId: CutToClipboardAction.ACTION_ID,
            bindTo: config.bindTo,
            propertyName: config.propertyName,
            selectedPositionsExpression: config.selectedPositionsExpression,
            forceReadOnlyValueExpression: config.forceReadOnlyValueExpression,
          }),
        }),
        Config(IconButton, {
          itemId: LinkListPropertyField.COPY_BUTTON_ITEM_ID,
          baseAction: new CopyToClipboardAction({
            actionId: CopyToClipboardAction.ACTION_ID,
            contentValueExpression: config.selectedValuesExpression,
          }),
        }),
        Config(IconButton, {
          itemId: LinkListPropertyField.PASTE_BUTTON_ITEM_ID,
          baseAction: new QueryPasteLinkAction({
            bindTo: config.bindTo,
            maxCardinality: config.maxCardinality,
            linkType: config.linkType,
            propertyName: config.propertyName,
            forceReadOnlyValueExpression: config.forceReadOnlyValueExpression,
          }),
        }),
      ],

    }), config));
  }

  #bindTo: ValueExpression = null;

  /**
   * A property path expression leading to the Bean whose property is edited. This property editor
   * assumes that this bean has a property 'properties'.
   */
  get bindTo(): ValueExpression {
    return this.#bindTo;
  }

  set bindTo(value: ValueExpression) {
    this.#bindTo = value;
  }

  #forceReadOnlyValueExpression: ValueExpression = null;

  /**
   * An optional ValueExpression which makes the component read-only if it is evaluated to true.
   */
  get forceReadOnlyValueExpression(): ValueExpression {
    return this.#forceReadOnlyValueExpression;
  }

  set forceReadOnlyValueExpression(value: ValueExpression) {
    this.#forceReadOnlyValueExpression = value;
  }

  #selectedValuesExpression: ValueExpression = null;

  get selectedValuesExpression(): ValueExpression {
    return this.#selectedValuesExpression;
  }

  set selectedValuesExpression(value: ValueExpression) {
    this.#selectedValuesExpression = value;
  }

  #selectedPositionsExpression: ValueExpression = null;

  get selectedPositionsExpression(): ValueExpression {
    return this.#selectedPositionsExpression;
  }

  set selectedPositionsExpression(value: ValueExpression) {
    this.#selectedPositionsExpression = value;
  }

  #propertyName: string = null;

  /**
   * The name of the link list property
   */
  get propertyName(): string {
    return this.#propertyName;
  }

  set propertyName(value: string) {
    this.#propertyName = value;
  }

  #linkType: string = null;

  /**
   * The allowed type of links is usually derived from the link property descriptor found through bindTo and propertyName,
   * but to override this or provide an initial value for link properties in Structs that are created by this
   * property field, you may specify a custom link type.
   */
  get linkType(): string {
    return this.#linkType;
  }

  set linkType(value: string) {
    this.#linkType = value;
  }

  #maxCardinality: int = 0;

  /**
   * Optional. The maximum cardinality that the link list property should hold.
   * If not specified the maximum cardinality of the property descriptor of the link list property will be applied.
   */
  get maxCardinality(): int {
    return this.#maxCardinality;
  }

  set maxCardinality(value: int) {
    this.#maxCardinality = value;
  }

  #additionalToolbarItems: Array<any> = null;

  /*
     * Additional items that are appended to the toolbar
     */
  get additionalToolbarItems(): Array<any> {
    return this.#additionalToolbarItems;
  }

  set additionalToolbarItems(value: Array<any>) {
    this.#additionalToolbarItems = value;
  }
}

export default QueryLinkListPropertyFieldToolbar;
