import session from "@coremedia/studio-client.cap-rest-client/common/session";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import beanFactory from "@coremedia/studio-client.client-core/data/beanFactory";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import Button from "@jangaroo/ext-ts/button/Button";
import Window from "@jangaroo/ext-ts/window/Window";
import { as, bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import { AnyFunction } from "@jangaroo/runtime/types";
import QueryLinkListPropertyField from "../components/QueryLinkListPropertyField";
import QueryLoadDialog from "./QueryLoadDialog";

interface QueryLoadDialogBaseConfig extends Config<Window> {
}

/**
 * Query Save Dialog
 *
 * @author dasc
 * @version $Id$
 */
class QueryLoadDialogBase extends Window {
  declare Config: QueryLoadDialogBaseConfig;

  protected static readonly FORM_FIELD_LINK: string = "link";

  protected static readonly FORM_BUTTON_CANCEL: string = "cancelBtn";

  protected static readonly FORM_BUTTON_OK: string = "okButton";

  #loadCallBack: AnyFunction = null;

  #settingsPropertyVE: ValueExpression = null;

  #linkPropertyVE: ValueExpression = null;

  linkField: QueryLinkListPropertyField = null;

  okButton: Button = null;

  constructor(config: Config<QueryLoadDialog> = null) {
    super(config);
    this.#loadCallBack = config.loadCallBack;
  }

  protected isOkDisabled(): boolean {
    return !QueryLoadDialogBase.validateLink(this.#linkPropertyVE.getValue());
  }

  okPressed(): void {
    this.close();
    this.#loadCallBack.call(this, this.#linkPropertyVE.getValue()[0]);
  }

  #findLinkField(): QueryLinkListPropertyField {
    return as(this.queryById(QueryLoadDialogBase.FORM_FIELD_LINK), QueryLinkListPropertyField);
  }

  #findOkButton(): Button {
    return as(this.queryById(QueryLoadDialogBase.FORM_BUTTON_OK), Button);
  }

  static validateLink(value: Array<any>): boolean {
    return Array.isArray(value) && value.length > 0;
  }

  protected override afterRender(): void {
    super.afterRender();

    this.linkField = this.#findLinkField();
    this.linkField.focus(false, 300);
    this.okButton = this.#findOkButton();

    this.#linkPropertyVE = this.getPropertyValueVEx().extendBy("properties", "link");
    this.#linkPropertyVE.setValue([]);

    this.#linkPropertyVE.addChangeListener(bind(this, this.#activateOkButton));
  }

  #activateOkButton(): void {
    this.okButton.setDisabled(this.isOkDisabled());
  }

  getPropertyValueVEx(): ValueExpression {
    if (!this.#settingsPropertyVE) {
      this.#settingsPropertyVE = ValueExpressionFactory.create("settings", beanFactory._.createLocalBean());
      this.#settingsPropertyVE.setValue(beanFactory._.createLocalBean({ properties: beanFactory._.createLocalBean() }));
    }
    return this.#settingsPropertyVE;
  }

  customOpenCollectionViewHandler(): void {
    const baseFolder = session._.getUser().getHomeFolder();
    editorContext._.getCollectionViewManager().openSearchForType("CMSettings", null, baseFolder);
  }
}

export default QueryLoadDialogBase;
