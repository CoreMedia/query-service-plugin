import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import LinkListGridPanel from "@coremedia/studio-client.main.editor-components/sdk/premular/fields/LinkListGridPanel";
import PropertyEditorUtil from "@coremedia/studio-client.main.editor-components/sdk/util/PropertyEditorUtil";
import Ext from "@jangaroo/ext-ts";
import DelayedTask from "@jangaroo/ext-ts/util/DelayedTask";
import Observable from "@jangaroo/ext-ts/util/Observable";
import { as, bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import int from "@jangaroo/runtime/int";
import { AnyFunction } from "@jangaroo/runtime/types";
import QueryContentLinkListWrapper from "../util/QueryContentLinkListWrapper";
import QueryLinkListPropertyFieldGridPanel from "./QueryLinkListPropertyFieldGridPanel";

interface QueryLinkListPropertyFieldGridPanelBaseConfig extends Config<LinkListGridPanel>, Partial<Pick<QueryLinkListPropertyFieldGridPanelBase,
  "bindTo" |
  "forceReadOnlyValueExpression" |
  "propertyName" |
  "propertyFieldName" |
  "linkType" |
  "maxCardinality" |
  "hideIssues" |
  "openCollectionViewHandler" |
  "siteId"
>> {
}

/**
 * Base class for the linklist property grid panel.
 */
class QueryLinkListPropertyFieldGridPanelBase extends LinkListGridPanel {
  declare Config: QueryLinkListPropertyFieldGridPanelBaseConfig;

  #bindTo: ValueExpression = null;

  get bindTo(): ValueExpression {
    return this.#bindTo;
  }

  set bindTo(value: ValueExpression) {
    this.#bindTo = value;
  }

  #forceReadOnlyValueExpression: ValueExpression = null;

  get forceReadOnlyValueExpression(): ValueExpression {
    return this.#forceReadOnlyValueExpression;
  }

  set forceReadOnlyValueExpression(value: ValueExpression) {
    this.#forceReadOnlyValueExpression = value;
  }

  #propertyName: string = null;

  get propertyName(): string {
    return this.#propertyName;
  }

  set propertyName(value: string) {
    this.#propertyName = value;
  }

  #propertyFieldName: string = null;

  get propertyFieldName(): string {
    return this.#propertyFieldName;
  }

  set propertyFieldName(value: string) {
    this.#propertyFieldName = value;
  }

  #linkType: string = null;

  get linkType(): string {
    return this.#linkType;
  }

  set linkType(value: string) {
    this.#linkType = value;
  }

  #maxCardinality: int = 0;

  get maxCardinality(): int {
    return this.#maxCardinality;
  }

  set maxCardinality(value: int) {
    this.#maxCardinality = value;
  }

  #hideIssues: boolean = false;

  get hideIssues(): boolean {
    return this.#hideIssues;
  }

  set hideIssues(value: boolean) {
    this.#hideIssues = value;
  }

  #openCollectionViewHandler: AnyFunction = null;

  get openCollectionViewHandler(): AnyFunction {
    return this.#openCollectionViewHandler;
  }

  set openCollectionViewHandler(value: AnyFunction) {
    this.#openCollectionViewHandler = value;
  }

  #siteId: string = null;

  get siteId(): string {
    return this.#siteId;
  }

  set siteId(value: string) {
    this.#siteId = value;
  }

  #_contentLinkListWrapper: QueryContentLinkListWrapper = null;

  #restoreHighlighted: boolean = false;

  #prolongedHighlighting: boolean = false;

  constructor(config: Config<QueryLinkListPropertyFieldGridPanel> = null) {
    super(config);
  }

  /**
   * If an openCollectionViewHandler is passed as config parameter, call this instead of openCollectionView()
   */
  protected processOpenCollectionViewHandler(): void {
    if (this.openCollectionViewHandler) {
      this.openCollectionViewHandler.call(null);
    } else {
      this.#openCollectionView();
    }
  }

  /**
   * Create drop target for this component.
   */
  #openCollectionView(): void {
    if (!this.disabled) {
      const targetSite = editorContext._.getSitesService().getSite(this.siteId);
      const baseFolder: Content = targetSite && targetSite.getSiteRootFolder();
      editorContext._.getCollectionViewManager().openSearchForType(this.linkType, null, baseFolder);
    }
  }

  protected getContentLinkListWrapper(config: Config<QueryLinkListPropertyFieldGridPanelBase>): QueryContentLinkListWrapper {
    if (!this.#_contentLinkListWrapper) {
      this.#_contentLinkListWrapper = Ext.create(QueryContentLinkListWrapper, {
        bindTo: config.bindTo,
        propertyName: config.propertyName,
        linkTypeName: config.linkType,
        maxCardinality: config.maxCardinality,
      });
    }
    return this.#_contentLinkListWrapper;
  }

  protected getDropAreaText(config: Config<QueryLinkListPropertyFieldGridPanelBase>): string {
    const contentType = this.getContentLinkListWrapper(config).getContentType();
    if (contentType) {
      return PropertyEditorUtil.getLocalizedStringWithoutFallback(contentType.getName(), config.propertyFieldName || config.propertyName, PropertyEditorUtil.EMPTY_TEXT);
    }
    return null;
  }

  override focus(selectText?: any, delay?: any, callback: AnyFunction = null, scope: AnyFunction = null): this {
    // Workaround: check if focus is triggered by DocumentTabPanelBase#showPropertyFieldByName
    const isFromPBE: boolean = delay === 1;
    if (!this.#prolongedHighlighting && isFromPBE) {
      this.#prolongedHighlighting = true;
      this.#restoreHighlighted = this.highlighted;
      this.highlighted = true;
      const observable = as(this, Observable);
      observable.addListener("highlightedChanged", bind(this, this.#changeRestoreHighlighted));
      const task = new DelayedTask((): void => {
        observable.removeListener("highlightedChanged", bind(this, this.#changeRestoreHighlighted));
        this.highlighted = this.#restoreHighlighted;
        this.#prolongedHighlighting = false;
      });
      task.delay(3000);
    }
    return super.focus(selectText, delay, callback, scope);
  }

  #changeRestoreHighlighted(obs: Observable, newHighlighted: boolean, oldHighlighted: boolean): void {
    this.#restoreHighlighted = newHighlighted;
  }
}

export default QueryLinkListPropertyFieldGridPanelBase;
