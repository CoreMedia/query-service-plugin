import OpenInTabAction from "@coremedia/studio-client.ext.form-services-toolkit/actions/OpenInTabAction";
import ShowInRepositoryAction from "@coremedia/studio-client.ext.library-services-toolkit/actions/ShowInRepositoryAction";
import ContextMenuPlugin from "@coremedia/studio-client.ext.ui-components/plugins/ContextMenuPlugin";
import HideObsoleteSeparatorsPlugin from "@coremedia/studio-client.ext.ui-components/plugins/HideObsoleteSeparatorsPlugin";
import CopyToClipboardAction from "@coremedia/studio-client.main.editor-components/sdk/clipboard/CopyToClipboardAction";
import LinkListPropertyField from "@coremedia/studio-client.main.editor-components/sdk/premular/fields/LinkListPropertyField";
import VBoxLayout from "@jangaroo/ext-ts/layout/container/VBox";
import Item from "@jangaroo/ext-ts/menu/Item";
import Menu from "@jangaroo/ext-ts/menu/Menu";
import Separator from "@jangaroo/ext-ts/menu/Separator";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import QueryLinkListPropertyFieldToolbar from "../toolbar/QueryLinkListPropertyFieldToolbar";
import QueryCutSelectedLinksAction from "../toolbar/action/QueryCutSelectedLinksAction";
import QueryDeleteSelectedLinksAction from "../toolbar/action/QueryDeleteSelectedLinksAction";
import QueryPasteLinkAction from "../toolbar/action/QueryPasteLinkAction";
import QueryLinkListPropertyFieldBase from "./QueryLinkListPropertyFieldBase";
import QueryLinkListPropertyFieldGridPanel from "./QueryLinkListPropertyFieldGridPanel";

interface QueryLinkListPropertyFieldConfig extends Config<QueryLinkListPropertyFieldBase> {
}

/**
 * An editor for a link query condition.
 **/
class QueryLinkListPropertyField extends QueryLinkListPropertyFieldBase {
  declare Config: QueryLinkListPropertyFieldConfig;

  static override readonly xtype: string = "com.coremedia.labs.query.studio.config.queryLinkListPropertyField";

  constructor(config: Config<QueryLinkListPropertyField> = null) {
    super(((): any => ConfigUtils.apply(Config(QueryLinkListPropertyField, {

      bindTo: config.bindTo,
      hideLabel: true,
      defaultField: "#" + LinkListPropertyField.GRID_ITEM_ID + " gridview",

      items: [
        Config(QueryLinkListPropertyFieldGridPanel, {
          itemId: LinkListPropertyField.GRID_ITEM_ID,
          bindTo: config.bindTo,
          propertyName: config.propertyName,
          propertyFieldName: config.propertyFieldName,
          showThumbnails: config.showThumbnails,
          siteId: QueryLinkListPropertyFieldBase.getSiteId(),
          selectedPositionsExpression: this.getSelectedPositionsExpression(),
          selectedValuesExpression: this.getSelectedValuesExpression(),
          linkType: config.linkType,
          maxCardinality: config.maxCardinality,
          forceReadOnlyValueExpression: config.forceReadOnlyValueExpression,
          openCollectionViewHandler: config.openCollectionViewHandler,
          ...ConfigUtils.append({
            plugins: [
              Config(ContextMenuPlugin, {
                contextMenu: Config(Menu, {
                  plain: true,
                  plugins: [
                    Config(HideObsoleteSeparatorsPlugin),
                  ],
                  items: [
                    Config(Item, {
                      itemId: LinkListPropertyField.OPEN_IN_TAB_MENU_ITEM_ID,
                      baseAction: new OpenInTabAction({ contentValueExpression: this.getSelectedValuesExpression() }),
                    }),
                    Config(Item, {
                      itemId: LinkListPropertyField.SHOW_IN_LIBRARY_MENU_ITEM_ID,
                      baseAction: new ShowInRepositoryAction({ contentValueExpression: this.getSelectedValuesExpression() }),
                    }),
                    Config(Separator),
                    Config(Item, {
                      itemId: LinkListPropertyField.CUT_BUTTON_ITEM_ID,
                      baseAction: new QueryCutSelectedLinksAction({
                        bindTo: config.bindTo,
                        propertyName: config.propertyName,
                        selectedPositionsExpression: this.getSelectedPositionsExpression(),
                        forceReadOnlyValueExpression: config.forceReadOnlyValueExpression,
                      }),
                    }),
                    Config(Item, {
                      itemId: LinkListPropertyField.COPY_BUTTON_ITEM_ID,
                      baseAction: new CopyToClipboardAction({ contentValueExpression: this.getSelectedValuesExpression() }),
                    }),
                    Config(Item, {
                      itemId: LinkListPropertyField.PASTE_BUTTON_ITEM_ID,
                      baseAction: new QueryPasteLinkAction({
                        bindTo: config.bindTo,
                        maxCardinality: config.maxCardinality,
                        linkType: config.linkType,
                        propertyName: config.propertyName,
                        forceReadOnlyValueExpression: config.forceReadOnlyValueExpression,
                      }),
                    }),
                    Config(Separator),
                    Config(Item, {
                      itemId: LinkListPropertyField.REMOVE_FROM_LIST_MENU_ITEM_ID,
                      baseAction: new QueryDeleteSelectedLinksAction({
                        bindTo: config.bindTo,
                        propertyName: config.propertyName,
                        selectedPositionsExpression: this.getSelectedPositionsExpression(),
                        forceReadOnlyValueExpression: config.forceReadOnlyValueExpression,
                      }),
                    }),
                  ],
                }),
              }),
            ],
          }),
          tbar: Config(QueryLinkListPropertyFieldToolbar, {
            itemId: LinkListPropertyField.TOOLBAR_ITEM_ID,
            bindTo: config.bindTo,
            propertyName: config.propertyName,
            linkType: config.linkType,
            maxCardinality: config.maxCardinality,
            additionalToolbarItems: config.additionalToolbarItems,
            selectedPositionsExpression: this.getSelectedPositionsExpression(),
            selectedValuesExpression: this.getSelectedValuesExpression(),
            forceReadOnlyValueExpression: config.forceReadOnlyValueExpression,
          }),
        }),
      ],

      layout: Config(VBoxLayout, { align: "stretch" }),

    }), config))());
  }

}

export default QueryLinkListPropertyField;
