import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import ActionConfigUtil from "@coremedia/studio-client.ext.cap-base-components/actions/ActionConfigUtil";
import ContentAction from "@coremedia/studio-client.ext.cap-base-components/actions/ContentAction";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import resourceManager from "@jangaroo/runtime/l10n/resourceManager";
import QueryTool_properties from "../properties/QueryTool_properties";
import OpenInRepositoryAction from "./OpenInRepositoryAction";

interface OpenInRepositoryActionBaseConfig extends Config<ContentAction> {
}

class OpenInRepositoryActionBase extends ContentAction {
  declare Config: OpenInRepositoryActionBaseConfig;

  constructor(config: Config<OpenInRepositoryAction> = null) {
    super(((): any => {
      return ActionConfigUtil.extendConfiguration(
        resourceManager.getResourceBundle(null, QueryTool_properties).content,
        config,
        "openInRepository",
        { handler: bind(this, this.#openInRepository) });
    })());
  }

  protected override isDisabledFor(contents: Array<any>): boolean {
    //handle everything - even folders
    return false;
  }

  #openInRepository(contents: any): void {
    const myContents: Array<any> = (contents instanceof Array && contents) || this.getContents();
    if (!this.isDisabledFor(myContents) && myContents.length > 0) {
      const first: Content = myContents[0];
      editorContext._.getCollectionViewManager().showInRepository(first);
    }
  }
}

export default OpenInRepositoryActionBase;
