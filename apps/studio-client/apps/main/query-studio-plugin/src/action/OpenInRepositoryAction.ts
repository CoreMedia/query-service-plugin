import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import OpenInRepositoryActionBase from "./OpenInRepositoryActionBase";

interface OpenInRepositoryActionConfig extends Config<OpenInRepositoryActionBase> {
}

class OpenInRepositoryAction extends OpenInRepositoryActionBase {
  declare Config: OpenInRepositoryActionConfig;

  static readonly xtype: string = "com.coremedia.labs.query.studio.config.openInRepositoryAction";

  constructor(config: Config<OpenInRepositoryAction> = null) {
    super(ConfigUtils.apply(Config(OpenInRepositoryAction), config));
  }
}

export default OpenInRepositoryAction;
