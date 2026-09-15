# Deployment: current status and automatic publishing

## Current state

- The existing private tutor runs at https://groundup-lab.sumil.chatgpt.site.
- This change adds the reader at **public/theory/index.html** and a **Study theory** link in the tutor header.
- The build step generates the reader catalog and browser-lab runtime from authored lessons and Python checks, then copies the SVG assets.
- The current build workspace became unavailable during this change. The revised application has **not** been built or deployed to the existing Sites URL.
- The previous deployed site therefore still lacks this reader until a successful Sites publication.
- A repository commit or passing content check must never be reported as a successful production deployment.

## Pipeline behavior

The GitHub Actions workflow **.github/workflows/theory.yml** runs on pushes, pull requests to main, and manual dispatch. It regenerates the catalog, validates links and JavaScript syntax, checks CPU lab references, checks private-host authentication, and uploads a deployable static-reader artifact.

Optional publishing runs only on main after validation, with **DEPLOY_THEORY_SITE=true**. Deployments are serialized. It uses Cloudflare's official Wrangler action to deploy the tested static artifact to a separate private reader Worker.

**This optional target is not the existing chatgpt.site website and does not migrate its tutor API or D1 progress database.** It provides a supported GitHub-to-host path for the theory reader. Full application migration requires a separate decision and integration work.

## Why the existing URL is not wired to Actions yet

The available Sites connector publishes through its managed source repository and short-lived repository credentials. No durable GitHub Actions credential or supported external deployment endpoint for that existing Sites project was exposed in this session.

Do not store an expiring Sites token in GitHub or invent an API endpoint. To update the existing URL, restore the build workspace, integrate this GitHub revision into the Sites source, run the build, and use the Sites publishing flow. Unattended publishing to that same URL remains blocked until a supported durable integration is available.

## Activate the optional Cloudflare reader target

Before enabling publishing, configure a Cloudflare account and create a scoped Workers deployment API token. In the private GitHub repository, create a production environment and add:

| GitHub secret | Purpose |
|---|---|
| CLOUDFLARE_API_TOKEN | Scoped Workers deployment credential |
| CLOUDFLARE_ACCOUNT_ID | Account that will own the Worker |
| READER_USERNAME | Login name; no colon character |
| READER_PASSWORD | Strong unique reader password |

Set repository variable **DEPLOY_THEORY_SITE=true** only after reviewing the different target and providing these values. A subsequent push to main or manual workflow run publishes the reader. Never paste tokens or passwords into repository files or chat.

The Worker authenticates before serving every asset, including the catalog. Missing credentials return 503; missing or wrong login returns 401. Successful private responses are not publicly cached. This preserves a private reading experience rather than making a private course publicly readable through an asset URL.

Cloudflare Workers' own account controls and any additional access restrictions must be configured in that account. The GitHub connector available here cannot create repository secrets.

Official mechanisms: [Wrangler GitHub Action](https://github.com/cloudflare/wrangler-action) and [Worker-first asset routing](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/).

## Local verification

Run:

~~~sh
node scripts/build-theory.mjs
node scripts/check-theory.mjs
python -m labs.checks --reference
python scripts/check_browser_labs.py
node scripts/check-worker.mjs
python -m http.server 8000 --directory public
~~~

Open **http://localhost:8000/theory/index.html** and check mobile navigation, inline/display math, Mermaid, SVGs, solution disclosure, notes persistence, and lesson links. The current content/syntax checks are not a substitute for this browser check.

For a lesson with a CPU lab, also verify that the exercise link opens the Python editor on the right without moving the reading position, the desktop layout remains side by side, and the narrower layout becomes a dismissible right drawer. Then verify that a correct implementation passes, an incorrect implementation shows its traceback, task tabs preserve separate work, progress survives a reload, Stop recovers from an infinite loop, and Reset restores the starter. Python runs in a Web Worker so learner code does not block the lesson interface.

For the full tutor build, **pnpm build** invokes the catalog prebuild automatically. The full application still requires its existing runtime bindings and API-key configuration.

## Release and rollback

Every generated catalog includes the source revision. The workflow publishes the tested artifact from that run. To roll back content through GitHub, revert the offending commit and let the main pipeline redeploy. Reverting this static reader does not change the separate Sites application or its database.

Renderer dependencies currently use pinned KaTeX and major-version CDN URLs for Marked, DOMPurify, and Mermaid. Runnable exercises use a pinned Pyodide browser runtime from its documented CDN. Their external availability is required for rich rendering and Python execution; ordinary lesson reading still works when the Python runtime is unavailable. A future reproducible offline release should vendor exact library versions and licenses. No browser render or cloud deployment success is claimed for this change until verified.
