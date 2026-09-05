# Docs — Not ToDo

Same set of files in every Hyperion app. Universal test/store steps live in the studio playbooks, not here.

Studio: `~/Projects/hyperion-studio`

| File | What belongs here |
| --- | --- |
| [PRODUCT.md](./PRODUCT.md) | What this app is |
| [IDENTITY.md](./IDENTITY.md) | IDs, versions, URLs, signing paths |
| [status.json](./status.json) | Dashboard: stage, store tracks, next action, blockers |
| [ROADMAP.md](./ROADMAP.md) | Backlog beyond `status.json` `next` (skip if another backlog file exists) |
| [SERVICES.md](./SERVICES.md) | Vendors, project refs, env names, 1Password titles (no keys) |
| [SMOKE.md](./SMOKE.md) | Device checklist for **this** product |
| [LISTING.md](./LISTING.md) | Short public copy (also lives in STORE-SUBMISSION) |
| [STORE-SUBMISSION.md](./STORE-SUBMISSION.md) | **Full** App Store + Play packet (testing → production) |
| [STORE.md](./STORE.md) | Links to studio iOS/Android playbooks |

Studio dashboard: `~/Projects/hyperion-studio/catalog/DASHBOARD.md` (refresh with `./scripts/studio-status.sh`).

Add extra files for architecture, schema, integrations. Do not paste Xcode Archive or Play AAB procedures into this repo.
