# Smoke tests — Not ToDo

Run this list on a **physical device** for every TestFlight / Play internal build. Browser and simulator are extra, not a substitute.

Universal how-to:  
`~/Projects/hyperion-studio/Playbooks/testing/ios.md`  
`~/Projects/hyperion-studio/Playbooks/testing/android.md`

Replace the bullets with this product’s real screens.

## Cold start

- [ ] Splash → welcome or restored session
- [ ] No live-reload white screen

## Account

- [ ] Register / OTP
- [ ] Sign out / sign in
- [ ] In-app account delete (required if you have accounts)

## Core loop

- [ ] The one thing the app exists to do
- [ ] Empty state
- [ ] Error / offline if relevant

## Settings / legal

- [ ] Privacy / terms / support links open
- [ ] Studio credit / About

## Native (if the binary uses them)

- [ ] Push permission → token stored
- [ ] Camera / calendar / photos — only what you ship
