GitHub Workflow
===============

CI
---
The workflow configured in `build.yml` will automatically run
for Pull Requests against the `main` branch (on creation and on push),
and when the `main` branch is pushed (e.g. by merging a Pull Request).

The workflow builds the workspace and attaches the created descriptor and
plugin-zips as a single "Bundle"-artifact to the workflow run.

Releases
--------
When running the workflow manually on the `main` branch, a new release is created.
The version is computed by removing the `-SNAPSHOT` suffix.
The workflow creates a tag and attaches the release artifacts to it.
It also uses the pinned
[`release-plugins` action](https://github.com/CoreMedia/oci-tooling/tree/v0.1.0/actions/release-plugins)
to package the plugin ZIPs as OCI artifacts. Dry runs only build the OCI
artifacts; real releases push them and require the registry secrets described
below.
Afterwards the next snapshot-version is created and pushed.

Republishing existing releases as OCI
-------------------------------------
Run **Republish Release as OCI** (`republish-release-as-oci.yml`) from the
Actions tab on the default branch. Enter an existing release version such as
`v3.0.0` or `3.0.0`, then select `public` (the default) or `ephemeral` for a
trial publication. Both options push artifacts; neither is a dry run.

The workflow uses the pinned
[`republish-plugins` action](https://github.com/CoreMedia/oci-tooling/tree/v0.1.0/actions/republish-plugins).
It reads this repository's `v<version>` release using the built-in GitHub
token with `contents: read`. The release must contain
`query-service-<version>.json` with URL-based plugin entries and all ZIP
assets referenced by that descriptor. No source checkout, Maven build, new
Git tag, or GitHub release is created.

Make the `PLUGINS_NEXUS_USER` and `PLUGINS_NEXUS_PASSWORD` repository or
organization secrets available to this repository, with write access to the
selected registry. Public artifacts are pushed through
`repository.coremedia.com/public-images` and pulled from
`container-registry.coremedia.com`; ephemeral artifacts use
`repository.coremedia.com/ephemeral-images` and
`ephemeral-container-registry.coremedia.com`, respectively.
The descriptor reference is
`<pull-registry>/plugins/query-service:<version>` (without the `v` prefix).
The action logs the resulting artifact references.