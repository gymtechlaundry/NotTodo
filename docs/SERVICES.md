# Services — Not ToDo

No cloud vendors. Data is local SQLite + Capacitor local notifications. Optional lock uses the OS biometric / device-passcode prompt on-device.

Playbook: `~/Projects/hyperion-studio/Playbooks/secrets.md`.

## Status

```
Slug:                          not-todo
Supabase project ref:          none
Bundle ID:                     com.darcsoftware.nottodo
1Password vault:               Hyperion (studio logins + Hyperion / not-todo / Play upload keystore)
```

## Vendors

| Vendor | Why | Dashboard / IDs (not secrets) | Env names | Vault item | Runtime |
| --- | --- | --- | --- | --- | --- |
| Apple | App Store | Apple ID `6751084588` | — | `Hyperion / studio / Apple Developer` | Store listing |
| Google Play Console | Play listing | `com.darcsoftware.nottodo` | — | `Hyperion / studio / Google Play` | Store listing |
| Play upload key | Sign AABs | alias `not-todo-upload` | — | `Hyperion / not-todo / Play upload keystore` | `android/key.properties` (gitignored) |
| Cloudflare Pages | Legal / support site | `hyperionappstudio.com/nottodo/` | — | `Hyperion / studio / Cloudflare` | Public HTTPS pages |

## Local files (paths only)

```
Play listing assets:           store-listing/ (feature graphic, screenshots, 512 icon)
Legal site source:             ~/Projects/hyperion-studio/website/nottodo/
Legal mirrors:                 docs/legal/
Upload keystore:               ~/Projects/hyperion-studio/Admin/signing/not-todo/not-todo-upload.jks
Upload certificate (PEM):      ~/Projects/hyperion-studio/Admin/signing/not-todo/not-todo-upload-certificate.pem
Gradle signing:                android/key.properties (gitignored)
```
