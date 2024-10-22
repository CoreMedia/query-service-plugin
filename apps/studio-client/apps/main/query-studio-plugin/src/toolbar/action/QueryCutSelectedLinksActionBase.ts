import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import BeanState from "@coremedia/studio-client.client-core/data/BeanState";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import ActionConfigUtil from "@coremedia/studio-client.ext.cap-base-components/actions/ActionConfigUtil";
import LinkListActions_properties from "@coremedia/studio-client.ext.link-list-components/actions/LinkListActions_properties";
import Clipboard from "@coremedia/studio-client.main.editor-components/sdk/clipboard/Clipboard";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import resourceManager from "@jangaroo/runtime/l10n/resourceManager";
import QueryAbstractModifyLinksAction from "./QueryAbstractModifyLinksAction";
import QueryCutSelectedLinksAction from "./QueryCutSelectedLinksAction";

interface QueryCutSelectedLinksActionBaseConfig extends Config<QueryAbstractModifyLinksAction> {
}

class QueryCutSelectedLinksActionBase extends QueryAbstractModifyLinksAction {
  declare Config: QueryCutSelectedLinksActionBaseConfig;

  #selectedPositionsExpression: ValueExpression = null;

  constructor(config: Config<QueryCutSelectedLinksAction> = null) {
    const selectedPositionsExpression: ValueExpression = config.selectedPositionsExpression;

    super(((): any => {
      this.setSelectedPositionsExpression(selectedPositionsExpression ? selectedPositionsExpression : ValueExpressionFactory.createFromValue([]));
      return ActionConfigUtil.extendConfiguration(
        resourceManager.getResourceBundle(null, LinkListActions_properties).content,
        config,
        "cutToClipboard",
        { handler: bind(this, this.#cutSelectedLinks) });
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
    return super.isDisabledFor(contents) || this.#isNothingSelected() || this.#isSomethingNotReadable();
  }

  #isNothingSelected(): boolean {
    const selectedPositions: Array<any> = this.#selectedPositionsExpression.getValue();
    return !selectedPositions || selectedPositions.length === 0;
  }

  #isSomethingNotReadable(): boolean {
    const selectedPositions: Array<any> = this.#selectedPositionsExpression.getValue();
    const linkContents: Array<any> = this.getLinks();
    if (selectedPositions.length > 0) {
      for (let i: number = 0; i < selectedPositions.length; i++) {
        const item: Content = linkContents[selectedPositions[i]];
        // In the case of a race condition, the selected positions may still refer to a deleted item.
        if (!item) {
          return true;
        }
        // Make sure the content is loaded eventually.
        item.load();
        // We found something unreadable.
        if (item.getState() !== BeanState.READABLE) {
          return true;
        }
      }
    }

    return !selectedPositions || selectedPositions.length === 0;
  }

  #cutSelectedLinks(): void {
    const originalValue: Array<any> = this.getLinks();
    if (!originalValue || this.#isNothingSelected()) {
      // Should not happen, but be cautious.
      return;
    }

    const selectedPositions: Array<any> = this.#selectedPositionsExpression.getValue();
    const newValue: Array<any> = originalValue.filter((val: any, pos: number): boolean =>
      selectedPositions.indexOf(pos) < 0,
    );
    this.setLinks(newValue);
    const cutValue: Array<any> = originalValue.filter((val: any, pos: number): boolean =>
      selectedPositions.indexOf(pos) >= 0,
    );
    const clipboard: Clipboard = Clipboard.getInstance();
    clipboard.setValue(cutValue, Clipboard.CUTLINK);
  }

}

export default QueryCutSelectedLinksActionBase;
