# Changelog

## Unreleased

* Restrict the Query Tool to members of the groups `administratoren`, `developer` and `query-tool-user`. The groups are configurable via the studio-server property `query-service.allowed-groups`. The REST endpoints reject other users with 403 and the Studio client only activates for permitted users.

## 3.0.0

* Update to CMCC 13 2512.0.0
* Use Java 21 SDK
* Use Node 24.x

## 2.0.0
* Update to CMCC 12 2406.1.1

## 1.0.0

* T-Systems extension implementation
* Switch from Extensions to Plugin architecture, suitable for CMCC 2101 and newer.
* Use Java 17 SDK
* Use Node 20.x
