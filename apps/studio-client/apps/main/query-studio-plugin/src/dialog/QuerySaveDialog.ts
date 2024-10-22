import VerticalSpacingPlugin from "@coremedia/studio-client.ext.ui-components/plugins/VerticalSpacingPlugin";
import ButtonSkin from "@coremedia/studio-client.ext.ui-components/skins/ButtonSkin";
import Button from "@jangaroo/ext-ts/button/Button";
import FormPanel from "@jangaroo/ext-ts/form/Panel";
import TextField from "@jangaroo/ext-ts/form/field/Text";
import VBoxLayout from "@jangaroo/ext-ts/layout/container/VBox";
import MessageBoxWindow from "@jangaroo/ext-ts/window/MessageBox";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import { AnyFunction } from "@jangaroo/runtime/types";
import QueryTool_properties from "../properties/QueryTool_properties";
import QuerySaveDialogBase from "./QuerySaveDialogBase";

interface QuerySaveDialogConfig extends Config<QuerySaveDialogBase>, Partial<Pick<QuerySaveDialog,
  "initialName" |
  "saveCallBack"
>> {
}

class QuerySaveDialog extends QuerySaveDialogBase {
  declare Config: QuerySaveDialogConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.querySaveDialog";

  constructor(config: Config<QuerySaveDialog> = null) {
    super(((): any => ConfigUtils.apply(Config(QuerySaveDialog, {

      title: QueryTool_properties.dialog_save_title,
      layout: "fit",
      modal: false,
      width: 350,
      resizable: false,
      collapsible: false,
      constrainHeader: true,

      items: [
        Config(FormPanel, {
          padding: "5px 25px 20px 15px",
          items: [
            Config(TextField, {
              itemId: QuerySaveDialogBase.FORM_FIELD_NAME,
              name: QuerySaveDialogBase.FORM_FIELD_NAME,
              width: 300,
              validator: QuerySaveDialogBase.validateName,
              fieldLabel: QueryTool_properties.textField_name_label,
              labelAlign: "top",
            }),
          ],

          layout: Config(VBoxLayout, { align: "stretch" }),
          plugins: [
            Config(VerticalSpacingPlugin),
          ],
        }),
      ],

      buttons: [
        Config(Button, {
          text: ConfigUtils.asString(MessageBoxWindow.getInstance().buttonText.cancel),
          itemId: QuerySaveDialogBase.FORM_BUTTON_CANCEL,
          handler: bind(this, this.close),
          ui: ButtonSkin.INLINE.getSkin(),
        }),
        Config(Button, {
          text: QueryTool_properties.button_dialog_save,
          handler: bind(this, this.okPressed),
          itemId: QuerySaveDialogBase.FORM_BUTTON_OK,
          disabled: true,
          ui: ButtonSkin.INLINE.getSkin(),
        }),
      ],

    }), config))());
  }

  #initialName: string = null;

  // Default name of the document
  get initialName(): string {
    return this.#initialName;
  }

  set initialName(value: string) {
    this.#initialName = value;
  }

  #saveCallBack: AnyFunction = null;

  // Callback which takes care of creating the document for saving the query data
  get saveCallBack(): AnyFunction {
    return this.#saveCallBack;
  }

  set saveCallBack(value: AnyFunction) {
    this.#saveCallBack = value;
  }
}

export default QuerySaveDialog;
