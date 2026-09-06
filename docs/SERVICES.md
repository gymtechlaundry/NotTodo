# Services — Not ToDo

No cloud vendors. Data is local SQLite + Capacitor local notifications. Optional lock uses the OS biometric / device-passcode prompt on-device.

Playbook: `~/Projects/hyperion-studio/Playbooks/secrets.md`.

## Status

```
Slug:                          not-todo
Supabase project ref:          none
Bundle ID:                     com.darcsoftware.nottodo
1Password vault:               Hyperion / studio (Apple + Play logins only)
```

## Vendors

| Vendor | Why | Dashboard / IDs (not secrets) | Env names | Vault item | Runtime |
| --- | --- | --- | --- | --- | --- |
| Apple | App Store | Apple ID `6751084588` | — | `Hyperion / studio / Apple Developer` | Store listing |
| Google Play | Play listing | `com.darcsoftware.nottodo` | — | `Hyperion / studio / Google Play` | Store listing |
| Cloudflare Pages | Legal / support site | `hyperionappstudio.com/nottodo/` | — | `Hyperion / studio / Cloudflare` | Public HTTPS pages |

## Local files (paths only)

```
Play listing assets:           store-listing/ (feature graphic, screenshots, 512 icon)
Legal site source:             ~/Projects/hyperion-studio/website/nottodo/
Legal mirrors:                 docs/legal/
```
