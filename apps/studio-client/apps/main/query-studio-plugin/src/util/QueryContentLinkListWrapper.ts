import session from "@coremedia/studio-client.cap-rest-client/common/session";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import ContentPropertyNames from "@coremedia/studio-client.cap-rest-client/content/ContentPropertyNames";
import ContentProxyHelper from "@coremedia/studio-client.cap-rest-client/content/ContentProxyHelper";
import ContentType from "@coremedia/studio-client.cap-rest-client/content/ContentType";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import LinkListWrapperBase from "@coremedia/studio-client.link-list-models/LinkListWrapperBase";
import LinkListUtil from "@coremedia/studio-client.main.editor-components/sdk/util/LinkListUtil";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import int from "@jangaroo/runtime/int";
import { AnyFunction } from "@jangaroo/runtime/types";

interface QueryContentLinkListWrapperConfig extends Config<LinkListWrapperBase>, Partial<Pick<QueryContentLinkListWrapper,
  "bindTo" |
  "propertyName" |
  "linkTypeName" |
  "maxCardinality" |
  "readOnlyVE"
>> {
}

class QueryContentLinkListWrapper extends LinkListWrapperBase {
  declare Config: QueryContentLinkListWrapperConfig;

  #bindTo: ValueExpression = null;

  get bindTo(): ValueExpression {
    return this.#bindTo;
  }

  set bindTo(value: ValueExpression) {
    this.#bindTo = value;
  }

  #propertyName: string = null;

  get propertyName(): string {
    return this.#propertyName;
  }

  set propertyName(value: string) {
    this.#propertyName = value;
  }

  #linkTypeName: string = null;

  get linkTypeName(): string {
    return this.#linkTypeName;
  }

  set linkTypeName(value: string) {
    this.#linkTypeName = value;
  }

  #maxCardinality: int = 0;

  get maxCardinality(): int {
    return this.#maxCardinality;
  }

  set maxCardinality(value: int) {
    this.#maxCardinality = value;
  }

  #readOnlyVE: ValueExpression = null;

  get readOnlyVE(): ValueExpression {
    return this.#readOnlyVE;
  }

  set readOnlyVE(value: ValueExpression) {
    this.#readOnlyVE = value;
  }

  #ve: ValueExpression = null;

  constructor(config: Config<QueryContentLinkListWrapper> = null) {
    super(config);
    this.bindTo = config.bindTo;
    this.propertyName = config.propertyName;
    this.linkTypeName = config.linkTypeName;
    this.maxCardinality = config.maxCardinality || 0;
    this.readOnlyVE = config.readOnlyVE;
  }

  override getVE(): ValueExpression {
    if (!this.#ve) {
      const innerValueExpression: ValueExpression = this.bindTo.extendBy(ContentPropertyNames.PROPERTIES + "." + this.propertyName);
      this.#ve = ValueExpressionFactory.createTransformingValueExpression(innerValueExpression, bind(this, this.#atomicTransformer), bind(this, this.#atomicReverseTransformer), []);
    }
    return this.#ve;
  }

  override getTotalCapacity(): int {
    return this.maxCardinality > 0 ? this.maxCardinality : 1;
  }

  override getFreeCapacity(): int {
    if (this.maxCardinality > 0) {
      return this.maxCardinality - this.getLinks().length;
    }
    return 0;
  }

  getContentType(): ContentType {
    const targetContentType: ContentType = session._.getConnection().getContentRepository().getContentType(this.linkTypeName);
    return targetContentType;
  }

  override acceptsLinks(links: Array<any>, replaceLinks: boolean = false): boolean {
    if (!links) {
      return false;
    }
    const contents: Array<Content> = ContentProxyHelper.getContents(links);
    // if anything has been filtered out, do not accept
    if (links.length !== contents.length) {
      return false;
    }
    return this.#acceptsContents(contents, true);
  }

  #acceptsContents(contents: Array<any>, throwError: boolean): boolean {
    if (!contents) {
      return false;
    }
    const enoughCapacity: boolean = this.getTotalCapacity() >= contents.length;
    const failedContent: Content = LinkListUtil.containsContentNotMatchingType(this.getContentType(), contents, throwError);
    return enoughCapacity && failedContent === null;
  }

  override getLinks(): Array<any> {
    return this.getVE().getValue();
  }

  override setLinks(links: Array<any>): Promise<any> {
    return new Promise((resolve: AnyFunction): void => {
      if (links) {
        const contents: Array<Content> = ContentProxyHelper.getContents(links);
        // if anything has been filtered out, do not accept
        if (links.length === contents.length && this.#acceptsContents(contents, false)) {
          this.getVE().setValue(contents);
        }
      }
    });
  }

  override addLinksAtIndex(links: Array<any>, index: int): Promise<any> {
    return new Promise((resolve: AnyFunction): void => {
      if (links) {
        const currentLinks: Array<any> = this.getLinks() || [];

        if (index < 0 || index > currentLinks.length) {
          return;
        }

        const contents: Array<Content> = ContentProxyHelper.getContents(links);
        // if anything has been filtered out, do not accept
        // throw error if content to add is invalid
        if (links.length === contents.length && this.#acceptsContents(contents, false)) {
          const newLinks: Array<any> = currentLinks.concat([]);

          // insert contents into newLinks at position index
          newLinks.splice(index, 0, ...contents);

          this.getVE().setValue(newLinks);
        }
      }
    });
  }

  override isReadOnly(): boolean {
    return this.readOnlyVE ? this.readOnlyVE.getValue() : false;
  }

  #atomicTransformer(value: any): Array<any> {
    if (value === null) {
      return [];
    }
    if (value === undefined) {
      return undefined;
    }
    return this.#isAtomic() ? [value] : value;
  }

  #atomicReverseTransformer(value: Array<any>): any {
    if (this.#isAtomic()) {
      return value && value.length > 0 ? value[0] : null;
    }
    return value;
  }

  #isAtomic(): boolean {
    return false;
  }

}

export default QueryContentLinkListWrapper;
