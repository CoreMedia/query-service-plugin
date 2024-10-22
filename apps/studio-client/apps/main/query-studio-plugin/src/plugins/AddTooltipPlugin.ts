import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import AddTooltipPluginBase from "./AddTooltipPluginBase";

interface AddTooltipPluginConfig extends Config<AddTooltipPluginBase>, Partial<Pick<AddTooltipPlugin,
  "tooltip"
>> {
}

/**
 * @public
 */
class AddTooltipPlugin extends AddTooltipPluginBase {
  declare Config: AddTooltipPluginConfig;

  static readonly xtype: string = "com.coremedia.labs.query.studio.config.addTooltipPlugin";

  constructor(config: Config<AddTooltipPlugin> = null) {
    super(ConfigUtils.apply(Config(AddTooltipPlugin), config));
  }

  #tooltip: string = null;

  get tooltip(): string {
    return this.#tooltip;
  }

  set tooltip(value: string) {
    this.#tooltip = value;
  }
}

export default AddTooltipPlugin;
