import Config from "@jangaroo/runtime/Config";
import StatusColumn from "@coremedia/studio-client.ext.cap-base-components/columns/StatusColumn";
import GridColumns_properties from "@coremedia/studio-client.ext.cap-base-components/columns/GridColumns_properties";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import Model from "@jangaroo/ext-ts/data/Model";
import Store from "@jangaroo/ext-ts/data/Store";
import ContentLocalizationUtil from "@coremedia/studio-client.cap-base-models/content/ContentLocalizationUtil";
import Ext from "@jangaroo/ext-ts";



interface QueryResultStatusColumnConfig extends Config<StatusColumn> {
}

class QueryResultStatusColumn extends StatusColumn {
  declare Config: QueryResultStatusColumnConfig;

  constructor(config: Config<QueryResultStatusColumn> = null) {
    super(ConfigUtils.apply(Config(QueryResultStatusColumn, {
      header: GridColumns_properties.status_header,
      align: "center",
      width: 40,
      fixed: true,
      stateId: "status",
      dataIndex: "status",

    }), config));
  }

  /** @private */
  protected override calculateIconCls(value: any, metadata: any, record: Model, rowIndex: number, colIndex: number, store: Store): string {
    const data: any = Ext.apply({}, record.data, record.getAssociatedData());
    if (data.deleted){
      return ContentLocalizationUtil.getIconStyleClassForStatus("deleted");
    }else if (data.checkedOut) {
      return ContentLocalizationUtil.getIconStyleClassForStatus("checked-out");
    }else if (data.published) {
      return ContentLocalizationUtil.getIconStyleClassForStatus("published");
    } else if (data.approved) {
      return ContentLocalizationUtil.getIconStyleClassForStatus("approved");
    }
    return "";
  }
}

export default QueryResultStatusColumn;
