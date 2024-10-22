import StringUtil from "@jangaroo/ext-ts/String";
import Button from "@jangaroo/ext-ts/button/Button";
import TextField from "@jangaroo/ext-ts/form/field/Text";
import Window from "@jangaroo/ext-ts/window/Window";
import { as, bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import { AnyFunction } from "@jangaroo/runtime/types";
import QuerySaveDialog from "./QuerySaveDialog";

interface QuerySaveDialogBaseConfig extends Config<Window> {
}

/**
 * Query Save Dialog
 *
 * @author dasc
 * @version $Id$
 */
class QuerySaveDialogBase extends Window {
  declare Config: QuerySaveDialogBaseConfig;

  protected static readonly FORM_FIELD_NAME: string = "name";

  protected static readonly FORM_BUTTON_CANCEL: string = "cancelBtn";

  protected static readonly FORM_BUTTON_OK: string = "okButton";

  readonly #initialName: string = null;

  #saveCallBack: AnyFunction = null;

  nameTextField: TextField = null;

  okButton: Button = null;

  constructor(config: Config<QuerySaveDialog> = null) {
    super(config);
    this.#initialName = config.initialName;
    this.#saveCallBack = config.saveCallBack;
  }

  protected isOkDisabled(): boolean {
    return !QuerySaveDialogBase.validateName(this.nameTextField.getValue());
  }

  okPressed(): void {
    this.close();
    this.#saveCallBack.call(this, this.nameTextField.getValue());
  }

  #findNameTextField(): TextField {
    return as(this.queryById(QuerySaveDialogBase.FORM_FIELD_NAME), TextField);
  }

  #findOkButton(): Button {
    return as(this.queryById(QuerySaveDialogBase.FORM_BUTTON_OK), Button);
  }

  static validateName(value: string): boolean {
    return value !== null && value !== undefined && StringUtil.trim(value).length > 0;
  }

  protected override afterRender(): void {
    super.afterRender();

    this.nameTextField = this.#findNameTextField();
    this.nameTextField.focus(false, 300);
    this.okButton = this.#findOkButton();

    // funktioniert nicht über ne ValueExpression mit ChangeListener
    this.nameTextField.addListener("change", bind(this, this.#activateOkButton));
    this.nameTextField.setValue(this.#initialName);
  }

  #activateOkButton(): void {
    this.okButton.setDisabled(this.isOkDisabled());
  }
}

export default QuerySaveDialogBase;
