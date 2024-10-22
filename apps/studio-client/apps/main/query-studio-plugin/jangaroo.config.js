const { jangarooConfig } = require("@jangaroo/core");

module.exports = jangarooConfig({
  type: "code",
  sencha: {
    name: "com.coremedia.blueprint__query-studio-plugin",
    namespace: "com.coremedia.labs.query.studio",
    css: [
      {
        path: "resources/css/query.css"
      },
    ],
    studioPlugins: [
      {
        mainClass: "com.coremedia.labs.query.studio.QueryStudioPlugin",
        name: "Query Studio Plugin"
      },
    ],
  },
  appManifests: {
    en: {
      categories: [
        "Content",
      ],
      cmServiceShortcuts: [
        {
          cmKey: "queryTool",
          cmOrder: 90,
          cmCategory: "Content",
          name: "Query Tool",
          url: "",
          cmAdministrative: true,
          cmService: {
            name: "launchSubAppService",
            method: "launchSubApp",
          },
        },
      ],
    },
  },
  command: {
    build: {
      ignoreTypeErrors: true
    },
  },
});
