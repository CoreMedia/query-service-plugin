import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import VerticalSpacingPlugin from "@coremedia/studio-client.ext.ui-components/plugins/VerticalSpacingPlugin";
import ButtonSkin from "@coremedia/studio-client.ext.ui-components/skins/ButtonSkin";
import TextfieldSkin from "@coremedia/studio-client.ext.ui-components/skins/TextfieldSkin";
import Button from "@jangaroo/ext-ts/button/Button";
import FormPanel from "@jangaroo/ext-ts/form/Panel";
import VBoxLayout from "@jangaroo/ext-ts/layout/container/VBox";
import MessageBoxWindow from "@jangaroo/ext-ts/window/MessageBox";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import { AnyFunction } from "@jangaroo/runtime/types";
import QueryLinkListPropertyField from "../components/QueryLinkListPropertyField";
import QueryTool_properties from "../properties/QueryTool_properties";
import QueryLoadDialogBase from "./QueryLoadDialogBase";
import QuerySaveDialog from "./QuerySaveDialog";

interface QueryLoadDialogConfig extends Config<QueryLoadDialogBase>, Partial<Pick<QueryLoadDialog,
  "loadCallBack"
>> {
}

class QueryLoadDialog extends QueryLoadDialogBase {
  declare Config: QueryLoadDialogConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.queryLoadDialog";

  constructor(config: Config<QuerySaveDialog> = null) {
    super(((): any => ConfigUtils.apply(Config(QueryLoadDialog, {

      title: QueryTool_properties.dialog_load_title,
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
            Config(QueryLinkListPropertyField, {
              bindTo: this.getPropertyValueVEx(),
              itemId: QueryLoadDialogBase.FORM_FIELD_LINK,
              propertyName: "link",
              linkType: "CMSettings",
              maxCardinality: 1,
              forceReadOnlyValueExpression: ValueExpressionFactory.createFromValue(false),
              openCollectionViewHandler: bind(this, this.customOpenCollectionViewHandler),
              ui: TextfieldSkin.WINDOW_HEADER.getSkin(),
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
          itemId: QueryLoadDialogBase.FORM_BUTTON_CANCEL,
          handler: bind(this, this.close),
          ui: ButtonSkin.INLINE.getSkin(),
        }),
        Config(Button, {
          text: QueryTool_properties.button_dialog_load,
          handler: bind(this, this.okPressed),
          itemId: QueryLoadDialogBase.FORM_BUTTON_OK,
          disabled: true,
          ui: ButtonSkin.INLINE.getSkin(),
        }),
      ],

    }), config))());
  }

  #loadCallBack: AnyFunction = null;

  // Callback which takes care of importing the query data from the selected settings document
  get loadCallBack(): AnyFunction {
    return this.#loadCallBack;
  }

  set loadCallBack(value: AnyFunction) {
    this.#loadCallBack = value;
  }
}

export default QueryLoadDialog;
