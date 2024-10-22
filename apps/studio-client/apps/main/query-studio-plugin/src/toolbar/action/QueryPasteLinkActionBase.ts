import ContentLocalizationUtil from "@coremedia/studio-client.cap-base-models/content/ContentLocalizationUtil";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import ContentType from "@coremedia/studio-client.cap-rest-client/content/ContentType";
import BeanState from "@coremedia/studio-client.client-core/data/BeanState";
import ActionConfigUtil from "@coremedia/studio-client.ext.cap-base-components/actions/ActionConfigUtil";
import LinkListActions_properties from "@coremedia/studio-client.ext.link-list-components/actions/LinkListActions_properties";
import Editor_properties from "@coremedia/studio-client.main.editor-components/Editor_properties";
import Clipboard from "@coremedia/studio-client.main.editor-components/sdk/clipboard/Clipboard";
import LinkListUtil from "@coremedia/studio-client.main.editor-components/sdk/util/LinkListUtil";
import MessageBoxUtil from "@coremedia/studio-client.main.editor-components/sdk/util/MessageBoxUtil";
import StringUtil from "@jangaroo/ext-ts/String";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import int from "@jangaroo/runtime/int";
import resourceManager from "@jangaroo/runtime/l10n/resourceManager";
import QueryAbstractModifyLinksAction from "./QueryAbstractModifyLinksAction";
import QueryPasteLinkAction from "./QueryPasteLinkAction";

interface QueryPasteLinkActionBaseConfig extends Config<QueryAbstractModifyLinksAction> {
}

class QueryPasteLinkActionBase extends QueryAbstractModifyLinksAction {
  declare Config: QueryPasteLinkActionBaseConfig;

  constructor(config: Config<QueryPasteLinkAction> = null) {
    super(((): any => {
      return ActionConfigUtil.extendConfiguration(
        resourceManager.getResourceBundle(null, LinkListActions_properties).content,
        config,
        "pasteFromClipboard",
        { handler: bind(this, this.#pasteLink) });
    })());
  }

  protected override calculateDisabled(): boolean {
    let disabled: boolean = true;
    const clipboard: Clipboard = Clipboard.getInstance();
    const content: Content = clipboard.getContents()[0];
    if (content) {
      disabled = (this.#getFreeCapacity() < clipboard.getContents().length);
    }
    return disabled || clipboard.getContents().length === 0 || clipboard.getOperation() === Clipboard.MOVE;
  }

  #getFreeCapacity(): int {
    const links: Array<any> = this.getLinks();
    return links ? this.maxCardinality - links.length : this.maxCardinality;
  }

  #pasteLink(): void {
    // fetch old link list value
    const originalValue: Array<any> = this.getLinks();
    if (!originalValue) {
      // Should not happen, but be cautious.
      return;
    }

    // fetch clipboard contents
    const clipboard: Clipboard = Clipboard.getInstance();
    const contentsToPaste: Array<any> = clipboard.getContents();
    if (contentsToPaste.length === 0) {
      return;
    }

    // check that content types of clipboard contents are allowed in link list
    const targetType: ContentType = this.getLinkType();
    const failedContent: Content = LinkListUtil.containsContentNotMatchingType(targetType, contentsToPaste);
    if (failedContent != null) {
      if (failedContent.getState() !== BeanState.READABLE) {
        MessageBoxUtil.showInfo(Editor_properties.dialog_pasteErrorTitle_text,
          StringUtil.format(Editor_properties.dialog_pasteErrorUnreadableMessage_text));

      } else {
        MessageBoxUtil.showInfo(Editor_properties.dialog_pasteErrorTitle_text,
          StringUtil.format(Editor_properties.dialog_pasteErrorMessage_text,
            failedContent.getName(),
            ContentLocalizationUtil.localizeDocumentTypeName(failedContent.getType().getName()),
            ContentLocalizationUtil.localizeDocumentTypeName(targetType.getName())));
      }
      return;
    }

    // actually paste clipboard contents into link list (append)
    const newValue: Array<any> = originalValue.concat(contentsToPaste);
    this.setLinks(newValue);
  }

}

export default QueryPasteLinkActionBase;
