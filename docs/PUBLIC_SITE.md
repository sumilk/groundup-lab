# Publish the reader publicly while GitHub remains private

**The GitHub repository stays private.** The public website is a separate static Cloudflare Worker named `groundup-lab-public`, prepared in `deploy-public/`. It does not expose the GitHub repository, version history, private tutor API, D1 database, or project build files.

## Publish

1. In Cloudflare, create a scoped API token with Workers Scripts: Edit rights for your account.
2. In the private GitHub repo, create the GitHub Actions environment named `public-site`. Put `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the environment's **secrets**. Never put their values in source files.
3. In GitHub Actions, manually run **Publish public learning reader** from the main branch.
4. Inspect the action logs for the resulting `groundup-lab-public.<account>.workers.dev` URL. Confirm the site works in an incognito window.
5. Optionally attach a custom domain using Cloudflare's Workers custom domain settings.

This workflow does not run automatically and does **not** change repository visibility. The existing authenticated theory Worker and the private chatgpt.site tutor are unchanged.

## What is public?

The site publishes only the generated `public/theory/` folder, including the HTML, JS, CSS, SVGs, all authored lesson text in `catalog.json`, and browser lab exercises/checks in `lab-runtime.json`. Any visitor can inspect/download these assets through browser developer tools. Keeping GitHub private **does not** prevent visitors from saving or copying publicly delivered HTML, lesson content, SVGs, JavaScript, or embedded exercises.

Before pressing Publish, review the generated JSON and each lesson for private notes, copyrighted course materials, credentials, or instructor-only answer keys. At present the generated catalog contains lesson solutions and the lab runtime contains checks. This setup does not conceal those.

The public site has a copyright notice; that is attribution/legal notice, not an anti-copying technical measure. Third-party rights still apply.

## Verify

The manual workflow builds and checks the reader before publishing. Review the site in an incognito browser, confirm there is no login gate, and check that routes outside `/theory/` return 404 (aside from the root redirect). The workflow has not been executed merely by committing these files.
