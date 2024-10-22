import session from "@coremedia/studio-client.cap-rest-client/common/session";
import ContentType from "@coremedia/studio-client.cap-rest-client/content/ContentType";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ContentUpdateAction from "@coremedia/studio-client.main.editor-components/sdk/actions/ContentUpdateAction";
import Config from "@jangaroo/runtime/Config";
import int from "@jangaroo/runtime/int";
import QueryAbstractModifyLinksAction from "./QueryAbstractModifyLinksAction";

interface QueryAbstractModifyLinksActionBaseConfig extends Config<ContentUpdateAction> {
}

class QueryAbstractModifyLinksActionBase extends ContentUpdateAction {
  declare Config: QueryAbstractModifyLinksActionBaseConfig;

  #propertyName: string = null;

  #maxCardinality: int = 0;

  #linkType: string = null;

  #propertyValueExpression: ValueExpression = null;

  constructor(config: Config<QueryAbstractModifyLinksAction> = null) {
    super(((): any => {
      this.#propertyName = config.propertyName;
      this.#maxCardinality = config.maxCardinality;
      this.#linkType = config.linkType;
      this.#propertyValueExpression = config.bindTo.extendBy("properties", this.#propertyName);
      config.contentValueExpression = this.#propertyValueExpression;
      return config;
    })());
  }

  protected getPropertyName(): string {
    return this.#propertyName;
  }

  protected getMaxCardinality(): int {
    return this.#maxCardinality;
  }

  protected getLinkType(): ContentType {
    return session._.getConnection().getContentRepository().getContentType(this.#linkType);
  }

  protected getLinks(): Array<any> {
    return this.#propertyValueExpression.getValue();
  }

  protected setLinks(links: Array<any>): void {
    if (links && links instanceof Array) {
      this.#propertyValueExpression.setValue(links);
    }
  }

  protected getPropertyValueExpression(): ValueExpression {
    return this.#propertyValueExpression;
  }
}

export default QueryAbstractModifyLinksActionBase;
