# Installation

--------------------------------------------------------------------------------

\[[Up](README.md)\] \[[Top](#top)\]

--------------------------------------------------------------------------------

## Table of Content

1. [Introduction](#introduction)
2. [Use Git](#use-git)
3. [Download Release](#download-release)
4. [Activate the Plugin](#activate-the-plugin)
5. [Configure the Plugin](#configure-the-plugin)
6. [Intellij IDEA Hints](#intellij-idea-hints)

## Introduction

Depending on your setup and your plans, you can integrate this project in different ways.

* If you want to use the plugin in your project, clone or fork the repository.
* If you do not want to use GitHub, proceed as described in [Download Release](#download-release).
* If you want to contribute a new feature or a bugfix, as an external developer, you need a fork of the repository to create a Pull Request.

## Use Git

Clone this repository or your fork. Make sure to use the suitable branch
for your workspace version (see [README](../README.md)). A fork is required if
you plan to customize the plugin.

Continue with [Activate the plugin](#activate-the-plugin).

## Download Release

Go to [Release](https://github.com/coremedia-contributions/query-service/releases) and download the version that matches your CMCC release version.
The ZIP file provides the Maven workspace of the plugin.

## Activate the Plugin

The query service is a plugin for studio-server and studio-client.
The deployment of plugins is described [here](https://documentation.coremedia.com/cmcc-12/artifacts/2506.0/webhelp/coremedia-en/content/ch04s01s06s03s03s02.html).

In short, for a quick development roundtrip:
1. Add the release link to plugins.json for both studio-client and studio-server.
2. Build the workspace
    1. Run `mvn clean install` in the `studio-server` folder.

       Checkpoint: A zip file exists in `studio-server/spring-boot/studio-server-app/target/plugins`.
    2. Run `pnpm install && pnpm -r run build` in the folder `studio-client`.

       Checkpoint: A zip file exists in `studio-client/apps/main/apps/build/additional-packages`.
3. Add the following to to studio-server application.properties:
    1. server.servlet.session.cookie.path=/
    2. server.servlet.context-path=/rest
    3. If running studio server locally, adjust "plugins.directories=" to the target directory
4. Start the studio server as usual, e.g. `mvn spring-boot:run`
5. Start the studio client with additional pnpm arguments to correctly route query requests to /plugins
   1.pnpm run start \
   --proxyTargetUri=http://localhost:41080 \
   --proxyPathSpec=/ \
   --proxyTargetUri=http://localhost:41080/rest/api/plugins \
   --proxyPathSpec=/plugins \
   --proxyTargetUri=http://localhost:41080/rest \
   --proxyPathSpec=/rest

Now the plugin is running.  you can start using it via the studio sidebar menu

## Intellij IDEA Hints

For the IDEA import:
- Ignore folder ".remote-package"
- Disable "Settings > Compiler > Clear output directory on rebuild"
