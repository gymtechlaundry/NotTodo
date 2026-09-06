# Smoke tests — Not ToDo

Run this list on a **physical device** for every TestFlight / Play internal build. Browser and simulator are extra, not a substitute.

Universal how-to:  
`~/Projects/hyperion-studio/Playbooks/testing/ios.md`  
`~/Projects/hyperion-studio/Playbooks/testing/android.md`

## Cold start

- [ ] Splash → Home (empty state or restored list)
- [ ] No live-reload white screen
- [ ] If app lock is on, lock screen appears before the list is readable

## Core loop

- [ ] Empty state copy, then Add a not-to-do
- [ ] Cancel on add-item leaves the list unchanged
- [ ] Tap an item → fail count increments
- [ ] Swipe to delete
- [ ] Stats shows total slips and a pie of items with fails
- [ ] Tabs: Home, Stats, Settings all open

## Reminders

- [ ] Settings → Do Not Remind Me on → grant notification permission
- [ ] Send a test reminder → notification in ~3 seconds
- [ ] Reload / cold start with reminders on: toggle stays on
- [ ] Toggle off cancels pending reminders
- [ ] Background the app and confirm a scheduled nudge can still fire

## App lock

- [ ] Settings → Lock this app on → Face ID / fingerprint / device passcode prompt
- [ ] Background then reopen → lock gate, list not visible
- [ ] Unlock succeeds and shows the list
- [ ] Turning lock off requires authenticate first

## Settings / legal

- [ ] Privacy / terms / support open `https://hyperionappstudio.com/nottodo/…`
- [ ] Studio credit opens hyperionappstudio.com
