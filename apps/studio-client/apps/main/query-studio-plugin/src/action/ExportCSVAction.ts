import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import Action from "@jangaroo/ext-ts/Action";
import QueryTool_properties from "../properties/QueryTool_properties";
import { bind } from "@jangaroo/runtime";
import QueryToolManager from "../QueryToolManager";

interface ExportCSVActionConfig extends Config<Action> {

}

class ExportCSVAction extends Action {

  declare Config: ExportCSVActionConfig;

  static readonly ACTION_ID: string = "exportCSV";

  constructor(config: Config<ExportCSVAction> = null) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    super(ConfigUtils.apply(
      Config(ExportCSVAction, {
        iconCls: QueryTool_properties.button_save_csv_icon,
        text: QueryTool_properties.button_save_csv,
        tooltip: QueryTool_properties.button_save_csv,
        handler: bind(this$, this$.#handleExportCSV),
      }), config));
  }

  #handleExportCSV(): void {
    QueryToolManager.getInstance().download();
  }

}

export default ExportCSVAction;
