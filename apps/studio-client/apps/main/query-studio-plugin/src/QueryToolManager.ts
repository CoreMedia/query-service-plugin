import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import QueryToolUtil from "./util/QueryToolUtil";
import int from "@jangaroo/runtime/int";
import session from "@coremedia/studio-client.cap-rest-client/common/session";
import StructSubBean from "@coremedia/studio-client.cap-rest-client/common/impl/StructSubBean";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import ContentErrorCodes from "@coremedia/studio-client.cap-rest-client/content/ContentErrorCodes";
import IssuesDetectedError from "@coremedia/studio-client.cap-rest-client/content/IssuesDetectedError";
import Struct from "@coremedia/studio-client.cap-rest-client/struct/Struct";
import User from "@coremedia/studio-client.cap-rest-client/user/User";
import RemoteBean from "@coremedia/studio-client.client-core/data/RemoteBean";
import RemoteError from "@coremedia/studio-client.client-core/data/error/RemoteError";
import EditorErrors_properties from "@coremedia/studio-client.ext.errors-validation-components/error/EditorErrors_properties";
import RemoteErrorHandlers from "@coremedia/studio-client.ext.errors-validation-components/error/RemoteErrorHandlers";
import RepositoryState from "@coremedia/studio-client.main.editor-components/sdk/collectionview/RepositoryState";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import MessageBoxUtil from "@coremedia/studio-client.main.editor-components/sdk/util/MessageBoxUtil";
import DateUtil from "@jangaroo/ext-ts/Date";
import { as, is } from "@jangaroo/runtime";

interface ConditionSource {
  getActiveType(): string;
  getPropertyNameVEx(): ValueExpression;
  getComparatorVEx(): ValueExpression;
  getPropertyValueVEx(): ValueExpression;
}

interface SavedCondition {
  type: string;
  name: string;
  comparator: string;
  value?: string | number | boolean | Content | Date;
}

export interface QueryConfiguration {
  contentType?: string;
  loadCount?: number;
  conditions: SavedCondition[];
}

class QueryToolManager {

  static #instance: QueryToolManager;

  #queryDataValueExpression: ValueExpression<any[]> = null;
  #contentTypeValueExpression: ValueExpression<string> = null;
  #includeSubTypesValueExpression: ValueExpression<boolean> = null;
  #loadCountValueExpression: ValueExpression<number> = null;
  #pageValueExpression: ValueExpression<number> = null;
  #userValueExpression: ValueExpression<User|undefined> = null;

  static getInstance(): QueryToolManager {
    if (!QueryToolManager.#instance) {
      QueryToolManager.#instance = new QueryToolManager();
    }
    return QueryToolManager.#instance;
  }

  /**
   * Trigger download of the query results as CSV file.
   */
  download(): void {
    const queryData: any[] = this.getQueryDataValueExpression().getValue() || [];
    const contentType: string = this.getContentTypeValueExpression().getValue();
    const includeSubtypes = this.getIncludeSubTypesValueExpression().getValue();
    const resultLimit: int = this.getLoadCountValueExpression().getValue();
    const page = this.getPageValueExpression().getValue();

    // TODO: Implement sorting for the query results. The following line is commented out because the store is not available in this context.
    //const sorters: SorterCollection = this.#store.getSorters();

    QueryToolUtil.downloadResultCSV(queryData, contentType, includeSubtypes, resultLimit, page);
  }

  getInitialFileName(): string {
    return DateUtil.format(new Date(), "ymd") + "_query";
  }

  saveQueryConfiguration(filename: string, conditions: readonly ConditionSource[]): void {
    // Capture the current form, not the last submitted query or later edits.
    const configuration: QueryConfiguration = {
      contentType: this.getContentTypeValueExpression().getValue(),
      loadCount: this.getLoadCountValueExpression().getValue(),
      conditions: conditions.map(condition => this.#serializeCondition(condition)),
    };
    const homeFolder = this.getUserValueExpression().getValue().getHomeFolder();
    const settingsType = session._.getConnection().getContentRepository().getContentType("CMSettings");
    settingsType.create(homeFolder, filename, result => {
      const content = result.createdContent;
      if (!content) {
        this.#showSaveError(result.error);
        return;
      }

      this.#loadSettings(content, settings => this.#writeConfiguration(settings, configuration));
      editorContext._.getWorkAreaTabManager().openTabsForEntities([content], true);
      const state = new RepositoryState();
      state.folder = homeFolder;
      editorContext._.getCollectionViewManager().openRepository(state);
    });
  }

  loadQueryConfiguration(content: Content, onLoad: (configuration: QueryConfiguration) => void): void {
    if (content) {
      this.#loadSettings(content, settings => onLoad(this.#readConfiguration(settings)));
    }
  }

  #loadSettings(content: Content, onLoad: (settings: Struct) => void): void {
    content.load(() => {
      const remoteSettings = as(content.getProperties().get("settings"), RemoteBean);
      remoteSettings.load(() => onLoad(as(remoteSettings, Struct)));
    });
  }

  #serializeCondition(condition: ConditionSource): SavedCondition {
    const data: SavedCondition = {
      type: condition.getActiveType(),
      name: condition.getPropertyNameVEx().getValue(),
      comparator: condition.getComparatorVEx().getValue(),
    };
    const value = condition.getPropertyValueVEx();
    switch (data.type) {
    case "STRUCT":
    case "MARKUP":
    case "STRING":
    case "USER":
    case "BLOB":
      data.value = value.getValue() || "";
      break;
    case "INTEGER":
      data.value = value.getValue() || 0;
      break;
    case "BOOLEAN":
      data.value = value.getValue();
      break;
    case "LINK":
    case "CONTENT_LINK":
    case "FOLDER_LINK":
      data.value = value.extendBy("properties", "link").getValue()?.[0] || false;
      break;
    case "DATE":
      data.value = as(value.getValue(), Date);
      break;
    }
    return data;
  }

  // Keep the existing CMSettings schema so previously saved queries remain loadable.
  #writeConfiguration(settings: Struct, configuration: QueryConfiguration): void {
    settings.getType().addStructProperty("query");
    const query: StructSubBean = settings.get("query");
    query.getType().addStringProperty("contentType", 50, configuration.contentType);
    query.getType().addIntegerProperty("dataCount", configuration.loadCount);
    query.getType().addStructListProperty("querydata");
    configuration.conditions.forEach((condition, index) => query.addAt("querydata", index, condition));
  }

  #readConfiguration(settings: Struct): QueryConfiguration {
    const configuration: QueryConfiguration = { conditions: [] };
    if (!settings.getType().hasProperty("query")) {
      return configuration;
    }

    const query: StructSubBean = settings.get("query");
    if (query.getType().hasProperty("contentType")) {
      configuration.contentType = query.get("contentType");
    }
    if (query.getType().hasProperty("dataCount")) {
      configuration.loadCount = query.get("dataCount");
    }
    if (query.getType().hasProperty("querydata")) {
      const conditions: StructSubBean[] = query.get("querydata");
      configuration.conditions = conditions.map(condition => ({
        type: condition.get("type"),
        name: condition.get("name"),
        comparator: condition.get("comparator"),
        value: condition.get("value"),
      }));
    }
    return configuration;
  }

  #showSaveError(error: RemoteError): void {
    if (is(error, IssuesDetectedError)) {
      RemoteErrorHandlers.showIssues(as(error, IssuesDetectedError));
    } else if (error.errorCode === ContentErrorCodes.NOT_AUTHORIZED) {
      MessageBoxUtil.showError(
        EditorErrors_properties.notAuthorized_title,
        EditorErrors_properties.notAuthorized_message,
      );
    } else {
      MessageBoxUtil.showError("HTTP Error", "HTTP Error: " + error.errorCode + " " + error.message);
    }
    error.setHandled(true);
  }

  /**
   * Initialising ValueExpression
   * Contains an array of the data sets (JSON-Objects) of the query conditions
   *
   * @return ValueExpression
   */
  getQueryDataValueExpression(): ValueExpression<any[]> {
    if (!this.#queryDataValueExpression) {
      this.#queryDataValueExpression = ValueExpressionFactory.createFromValue(QueryToolUtil.DEFAULT_VALUE_QUERY_DATA);
    }
    return this.#queryDataValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Contains the selected ContentType of the query (dropdown)
   *
   * Default: "Document_"
   * @return ValueExpression
   */
  getContentTypeValueExpression(): ValueExpression {
    if (!this.#contentTypeValueExpression) {
      this.#contentTypeValueExpression = ValueExpressionFactory.createFromValue(QueryToolUtil.DEFAULT_VALUE_DOCUMENT_TYPE);
    }
    return this.#contentTypeValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Indicates if the query should deliver results including documents of a subtype of the selected content type.
   *
   * Default: "true"
   * @return ValueExpression
   */
  getIncludeSubTypesValueExpression(): ValueExpression {
    if (!this.#includeSubTypesValueExpression) {
      this.#includeSubTypesValueExpression = ValueExpressionFactory.createFromValue(true);
    }
    return this.#includeSubTypesValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Contains the number of data sets to load for visualising in the grid
   *
   * Default: 50
   * @return ValueExpression
   */
  getLoadCountValueExpression(): ValueExpression {
    if (!this.#loadCountValueExpression) {
      this.#loadCountValueExpression = ValueExpressionFactory.createFromValue(QueryToolUtil.DEFAULT_VALUE_LOAD_COUNT);
    }
    return this.#loadCountValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Contains the number of the active page of the paging
   *
   * @return ValueExpression
   */
  getPageValueExpression(): ValueExpression {
    if (!this.#pageValueExpression) {
      this.#pageValueExpression = ValueExpressionFactory.createFromValue(QueryToolUtil.DEFAULT_VALUE_PAGE);
    }
    return this.#pageValueExpression;
  }

  /**
   * Initialising ValueExpression
   * Contains the active user
   *
   * @return ValueExpression
   */
  getUserValueExpression(): ValueExpression<User|undefined> {
    if (!this.#userValueExpression) {
      this.#userValueExpression = ValueExpressionFactory.createFromValue(session._?.getUser());
    }
    return this.#userValueExpression;
  }

}

export default QueryToolManager;
