import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ActionConfigUtil from "@coremedia/studio-client.ext.cap-base-components/actions/ActionConfigUtil";
import ContentAction from "@coremedia/studio-client.ext.cap-base-components/actions/ContentAction";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import resourceManager from "@jangaroo/runtime/l10n/resourceManager";
import QueryTool_properties from "../properties/QueryTool_properties";
import UndeleteAction from "./UndeleteAction";

interface UndeleteActionBaseConfig extends Config<ContentAction> {
}

class UndeleteActionBase extends ContentAction {
  declare Config: UndeleteActionBaseConfig;

  #undeleteValueExpression: ValueExpression = null;

  constructor(config: Config<UndeleteAction> = null) {
    super(((): any => {
      this.#undeleteValueExpression = config.undeleteValueExpression;
      return ActionConfigUtil.extendConfiguration(
        resourceManager.getResourceBundle(null, QueryTool_properties).content,
        config,
        "undeleteContent",
        { handler: bind(this, this.#undeleteContent) });
    })());
  }

  protected override isHiddenFor(contents: Array<any>): boolean {
    return contents.some((content: Content): boolean =>
      !(content.getState().readable && content.isDeleted()),
    );
  }

  #undeleteContent(contents: any): void {
    const myContents: Array<any> = (contents instanceof Array && contents) || this.getContents();
    if (myContents.length > 0) {
      this.#undeleteValueExpression.setValue(myContents);
    }
  }
}

export default UndeleteActionBase;
