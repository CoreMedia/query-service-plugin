import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import int from "@jangaroo/runtime/int";
import QueryAbstractModifyLinksActionBase from "./QueryAbstractModifyLinksActionBase";

interface QueryAbstractModifyLinksActionConfig extends Config<QueryAbstractModifyLinksActionBase>, Partial<Pick<QueryAbstractModifyLinksAction,
  "bindTo" |
  "propertyName" |
  "maxCardinality" |
  "linkType"
>> {
}

class QueryAbstractModifyLinksAction extends QueryAbstractModifyLinksActionBase {
  declare Config: QueryAbstractModifyLinksActionConfig;

  static readonly xtype: string = "com.coremedia.labs.query.studio.config.queryAbstractModifyLinksAction";

  constructor(config: Config<QueryAbstractModifyLinksAction> = null) {
    super(ConfigUtils.apply(Config(QueryAbstractModifyLinksAction), config));
  }

  #bindTo: ValueExpression = null;

  /**
   * Name of the LinkList, Link or String property to modify.
   */
  get bindTo(): ValueExpression {
    return this.#bindTo;
  }

  set bindTo(value: ValueExpression) {
    this.#bindTo = value;
  }

  #propertyName: string = null;

  /**
   * Name of the LinkList, Link or String property to modify.
   */
  get propertyName(): string {
    return this.#propertyName;
  }

  set propertyName(value: string) {
    this.#propertyName = value;
  }

  #maxCardinality: int = 0;

  /**
   * Optional. The maximum cardinality that the link list property should hold.
   *If not specified the maximum cardinality of the property descriptor of the link list property will be applied.
   */
  get maxCardinality(): int {
    return this.#maxCardinality;
  }

  set maxCardinality(value: int) {
    this.#maxCardinality = value;
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
}

export default QueryAbstractModifyLinksAction;
