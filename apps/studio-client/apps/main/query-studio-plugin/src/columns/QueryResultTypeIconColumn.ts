import Config from "@jangaroo/runtime/Config";
import TypeIconColumn from "@coremedia/studio-client.ext.cap-base-components/columns/TypeIconColumn";
import IconColumn from "@coremedia/studio-client.ext.ui-components/grid/column/IconColumn";
import GridColumns_properties from "@coremedia/studio-client.ext.cap-base-components/columns/GridColumns_properties";
import ContentTypes_properties from "@coremedia/studio-client.cap-base-models/content/ContentTypes_properties";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import {as} from "@jangaroo/runtime";
import Ext from "@jangaroo/ext-ts";
import Model from "@jangaroo/ext-ts/data/Model";
import Store from "@jangaroo/ext-ts/data/Store";


interface  QueryResultTypeIconColumnConfig extends Config<TypeIconColumn>, Partial<Pick<QueryResultTypeIconColumn,
        "showTypeName"
>> {
}

class QueryResultTypeIconColumn extends TypeIconColumn {
    declare Config: QueryResultTypeIconColumnConfig;

  constructor(config: Config<QueryResultTypeIconColumn> = null) {
    super(ConfigUtils.apply(Config(QueryResultTypeIconColumn, {
      header: GridColumns_properties.type_header,
      width: config.showTypeName ? 90 : IconColumn.DEFAULT_WIDTH,
      fixed: !config.showTypeName,
      iconOnly: !config.showTypeName,
      stateId: "type",
      dataIndex: "typeCls",

    }), config));
  }
  protected override calculateIconCls(value: any, metadata: any, record: Model, rowIndex: number, colIndex: number, store: Store): string {
    const data: any = Ext.apply({}, record.data, record.getAssociatedData());
    const type: string   = as(data.type, String);
    let iconCls: string = ContentTypes_properties[type + "_icon"]
    if (!iconCls) {
      iconCls = ContentTypes_properties[type + "__icon"]
    }
    return iconCls || ""
  }

  protected override calculateIconText(value: any, metadata: any, record: Model, rowIndex: number, colIndex: number, store: Store): string {
    const data: any = Ext.apply({}, record.data, record.getAssociatedData());
    const t: string  = as(data.type, String);

    let type: string = ContentTypes_properties[t + "_text"]
    if (!type) {
      type = ContentTypes_properties[t + "__text"]
    }
    return type || t
  }
}

export default QueryResultTypeIconColumn;
