# GroundUp Lab — public release checklist

This checklist is for preparing a **future** public release; adding this file does not publish the repository or deploy the site.

## 1. Rights and attribution
- [ ] Decide on licenses separately for original source code and authored educational text/diagrams. Until then, [COPYRIGHT.md](../COPYRIGHT.md) reserves rights, and the repository is **not** open source.
- [ ] Audit copied excerpts, assignments, photos, illustrations, fonts, datasets and course slides for redistribution rights; replace or obtain permission where needed.
- [ ] Preserve attribution to CMU 11-785, UC Berkeley CS189 and any other referenced courses without implying endorsement.
- [ ] Document AI assistance and independently review mathematical statements and exercise solutions.

## 2. Security and privacy — required **before** changing visibility
- [ ] Examine **all Git history**, current tracked files, committed blobs, workflows and configuration for passwords, API tokens, keys, account IDs, private URLs, personal records and credentials.
- [ ] Check GitHub secrets and deployment environments (without revealing values), and rotate any credential that has ever entered Git history. Deleting a current file does **not** erase historical commits.
- [ ] Verify the separate live tutor, auth-gated reader, backend API and progress database cannot expose private content through public routes or generated static assets.
- [ ] Audit generated content and deployment artifacts; ensure private notes, assessments, traces and user data are excluded.
- [ ] Review dependencies and open-source notices; include their licenses when distributing bundles.

## 3. Quality gate
- [ ] Run `node scripts/build-theory.mjs`
- [ ] Run `node scripts/check-theory.mjs`
- [ ] Run `python -m labs.checks --reference`
- [ ] Run `python scripts/check_browser_labs.py`
- [ ] Run `node scripts/check-worker.mjs`
- [ ] Test browser experience, mobile layout, Pyodide execution, accessibility, notes storage and authentication.
- [ ] Have independent learners and reviewers test the first two DL Core lessons.

## 4. Publication
- [ ] Create a public-facing landing page that clearly separates complete lessons from planned modules.
- [ ] Add CONTRIBUTING.md, CODE_OF_CONDUCT.md and a security reporting contact.
- [ ] After all security/legal checks pass, change GitHub repository visibility in **Settings → General → Danger Zone → Change repository visibility**.
- [ ] Configure a **separate public deployment**. The existing Sites tutor and optional Cloudflare reader are private; setting a GitHub repository to public does not make either site publicly accessible.
- [ ] Test access in a logged-out browser, then announce the beta.

## Important

A public GitHub repository shares files **and commit history**. Do not change visibility until sensitive-data/history review is complete. See [deployment details](DEPLOYMENT.md).
