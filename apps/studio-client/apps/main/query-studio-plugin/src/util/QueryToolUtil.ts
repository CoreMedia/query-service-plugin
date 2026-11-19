import RemoteService from "@coremedia/studio-client.client-core/data/impl/RemoteService";
import int from "@jangaroo/runtime/int";
import SorterCollection from "@jangaroo/ext-ts/util/SorterCollection";
import ObjectUtil from "@jangaroo/ext-ts/Object";

class QueryToolUtil {

  static readonly DEFAULT_VALUE_DOCUMENT_TYPE: string = "Document_";

  static readonly DEFAULT_VALUE_LOAD_COUNT: int = 50;

  static readonly DEFAULT_VALUE_MAX_COUNT: int = -1;

  static readonly DEFAULT_VALUE_PAGE: int = 1;

  static readonly DEFAULT_VALUE_QUERY_DATA: Array<any> = [];

  static readonly DEFAULT_VALUE_SEND_QUERY: boolean = false;

  static readonly DEFAULT_VALUE_TOTAL_COUNT: int = -1;

  static downloadResultCSV(
    queryData: Array<any>,
    contentTypeName: string,
    includeSubtypes: boolean = true,
    limit: int = QueryToolUtil.DEFAULT_VALUE_MAX_COUNT,
    page: number = QueryToolUtil.DEFAULT_VALUE_PAGE,
    sorters: SorterCollection|null = null,
    fileName: string = "QueryCSVDownload"): void {

    const query: string = JSON.stringify(queryData);
    const paramObject: Record<string, any> = {
      queryjson: query,
      ctype: contentTypeName,
      includeSubs: includeSubtypes,
      page: page,
      max: limit
    };

    // add sort parameter if sorters are present
    if (sorters && sorters.getCount() > 0) paramObject["sort"] = QueryToolUtil.getSortDataJSON(sorters);

    const url = RemoteService.calculateRequestURI("/rest/api/plugins/query-service-lib/qsrest/queryToCSV?" + ObjectUtil.toQueryString(paramObject));
    window.open(url, fileName);
  }

  /**
   * Building a JSON-Array as String of the grid sorters.
   * @param sorters
   *
   * @return String - JSON-Array as String
   */
  static getSortDataJSON(sorters: SorterCollection): string {

    let jsonArray: string = "";

    if (sorters && sorters.getCount() > 0) {
      jsonArray = "[";
      for (let i: number = 0; i < sorters.getCount(); i++) {
        const sorter: any = sorters.getAt(i);
        jsonArray += "{\"property\":\"" + sorter._property + "\",\"direction\":\"" + sorter._direction + "\"}";
        if (i < sorters.getCount() - 1) jsonArray += ",";
      }
      jsonArray += "]";
    }
    return jsonArray;
  }

}

export default QueryToolUtil;
