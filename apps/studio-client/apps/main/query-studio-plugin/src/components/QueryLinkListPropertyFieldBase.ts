import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import LinkListPropertyField from "@coremedia/studio-client.main.editor-components/sdk/premular/fields/LinkListPropertyField";
import Site from "@coremedia/studio-client.multi-site-models/Site";
import Config from "@jangaroo/runtime/Config";
import QueryLinkListPropertyField from "./QueryLinkListPropertyField";

interface QueryLinkListPropertyFieldBaseConfig extends Config<LinkListPropertyField> {
}

/**
 * Base class for the linklist property editor.
 */
class QueryLinkListPropertyFieldBase extends LinkListPropertyField {
  declare Config: QueryLinkListPropertyFieldBaseConfig;

  constructor(config: Config<QueryLinkListPropertyField> = null) {
    super(((): any => {
      this.bindTo = config.bindTo;
      this.bindTo.extendBy("type").setValue({ name: config.linkType });
      return config;
    })());
  }

  /**
   * Contains the value of the LinkPropertyField
   * @return [ValueExpression]
   */
  getLinkValueExpression(): ValueExpression {
    return this.bindTo.extendBy("properties", this.propertyName);
  }

  /**
   * Returns the siteId of the first Site registered.
   * @return [String] siteId
   */
  protected static getSiteId(): string {
    const sites: Array<Site> = editorContext._.getSitesService().getSites();
    const firstSite: Site = sites.length > 0 ? sites[0] : null;
    if (firstSite) {
      return firstSite.getId();
    }
    return undefined;
  }

}

export default QueryLinkListPropertyFieldBase;
