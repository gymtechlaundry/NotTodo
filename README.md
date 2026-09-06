# Not ToDo

**A list of things you should not do.**

Add habits you want to avoid. Tap an item when you slip. Stats show where you slip most. Optional daily reminders and an optional Face ID / fingerprint / device-passcode lock.

No account. No cloud. Your list stays on the device.

App id: `com.darcsoftware.nottodo` (grandfathered — never change) · Operator: Hyperion App Studio

Legal / support: https://hyperionappstudio.com/nottodo/

---

## Stack

- Ionic Angular (standalone) + Capacitor (iOS / Android)
- Local SQLite (`@capacitor-community/sqlite`) with a web `localStorage` fallback
- Local notifications for optional daily reminders
- Optional app lock via the OS biometric / device-passcode prompt

---

## Quick start

```bash
npm install
npm start
```

List every npm script and what it does:

```bash
npm run help:scripts
```

### iOS Simulator & device

```bash
npm run ios:list
npm run ios:run
npm run ios:live

# Physical iPhone live-reload (two terminals):
npm run start:lan          # terminal 1 — LAN web server on :4200
npm run ios:live:device    # terminal 2 — attach Cap live-reload to the phone

npm run ios:sync
npm run release:ios
```

Never archive a live-reload build (`ios:live` / `ios:live:device`).

### Android

```bash
npm run release:android
npm run android:sync
npm run android:bundle   # Play Store .aab (needs android/key.properties)
npm run android:apk      # release APK for sideload testing
```

### Tests

```bash
npm test
npm run test:ci
```

---

## App surface

| Area | Route | Notes |
| --- | --- | --- |
| Home | `/tabs/home` | List of not-to-dos; tap to increment a fail |
| Stats | `/tabs/stats` | Where you slip |
| Settings | `/tabs/settings` | Reminders, optional lock, legal links |
| Add | `/add-item` | Title + optional category |

---

## Documentation

| Doc | Contents |
| --- | --- |
| [docs/PRODUCT.md](./docs/PRODUCT.md) | What this app is |
| [docs/IDENTITY.md](./docs/IDENTITY.md) | IDs, versions, URLs, signing paths |
| [docs/SERVICES.md](./docs/SERVICES.md) | Vendors (none in the binary) |
| [docs/SMOKE.md](./docs/SMOKE.md) | Device checklist |
| [docs/LISTING.md](./docs/LISTING.md) | Short store copy |
| [docs/STORE-SUBMISSION.md](./docs/STORE-SUBMISSION.md) | Full App Store + Play packet |
| [docs/STORE.md](./docs/STORE.md) | Pointers to studio playbooks |

Studio dashboard: `~/Projects/hyperion-studio/catalog/DASHBOARD.md` (refresh with `./scripts/studio-status.sh`).
