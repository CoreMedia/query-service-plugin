import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import ActionConfigUtil from "@coremedia/studio-client.ext.cap-base-components/actions/ActionConfigUtil";
import LinkListActions_properties from "@coremedia/studio-client.ext.link-list-components/actions/LinkListActions_properties";
import { bind, is } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import resourceManager from "@jangaroo/runtime/l10n/resourceManager";
import QueryAbstractModifyLinksAction from "./QueryAbstractModifyLinksAction";
import QueryDeleteSelectedLinksAction from "./QueryDeleteSelectedLinksAction";

interface QueryDeleteSelectedLinksActionBaseConfig extends Config<QueryAbstractModifyLinksAction> {
}

class QueryDeleteSelectedLinksActionBase extends QueryAbstractModifyLinksAction {
  declare Config: QueryDeleteSelectedLinksActionBaseConfig;

  #selectedPositionsExpression: ValueExpression = null;

  constructor(config: Config<QueryDeleteSelectedLinksAction> = null) {
    const selectedPositionsExpression: ValueExpression = config.selectedPositionsExpression;

    super(((): any => {
      this.setSelectedPositionsExpression(selectedPositionsExpression ? selectedPositionsExpression : ValueExpressionFactory.createFromValue([]));
      return ActionConfigUtil.extendConfiguration(
        resourceManager.getResourceBundle(null, LinkListActions_properties).content,
        config,
        "deleteSelectedLinks",
        { handler: bind(this, this.#deleteSelectedLinks) });
    })());
  }

  /**
   * @private
   */
  setSelectedPositions(positions: Array<any>): void {
    this.#selectedPositionsExpression.setValue(positions);
  }

  /**
   * @private
   */
  setSelectedPositionsExpression(expression: ValueExpression): void {
    // Switch to new expression.
    this.#selectedPositionsExpression = expression;
  }

  protected override isDisabledFor(contents: Array<any>): boolean {
    return super.isDisabledFor(contents) || this.#isNothingSelected();
  }

  #isNothingSelected(): boolean {
    const selectedPositions: Array<any> = this.#selectedPositionsExpression.getValue();
    return !selectedPositions || selectedPositions.length === 0;
  }

  #deleteSelectedLinks(): void {
    let links: Array<any> = this.getLinks();
    const originalValue = this.getPropertyValueExpression().getValue();

    if (!links || this.#isNothingSelected()) {
      // Should not happen, but be cautious.
      return;
    }

    const isStringProperty: boolean = is(originalValue, String);
    if (isStringProperty) {
      links = String(originalValue).split(",");
    }

    const selectedPositions: Array<any> = this.#selectedPositionsExpression.getValue();
    let newValue: any = links.filter((val: any, pos: number): boolean =>
      selectedPositions.indexOf(pos) < 0,
    );

    if (isStringProperty) {
      newValue = newValue.join(",");
    }
    this.setLinks(newValue);
  }
}

export default QueryDeleteSelectedLinksActionBase;
