# HB QA Tools

One toolset, three platforms. Opens happybingo.ph (or any URL) with one **Test** panel that shows everything on one screen:

- **Live stats**: FPS (and lowest FPS seen), max main-thread lag, requests per 2s, DOM size, running/looping animations, video/canvas/iframe counts. Updates every 2 seconds.
- **Animation list**: every running animation grouped by element, looping ones first, with how many are on-screen. Tap Refresh list to re-scan.
- Buttons: Refresh list, Copy all (stats + list), Min (shrinks the panel so you can see the game), Close.

Desktop also has a **Mobile view** toggle (Tools menu, Ctrl/Cmd+M) that emulates a phone-size screen without resizing the window.

## Build (GitHub Actions)
1. Create a private GitHub repo and push this folder to `main`.
2. Open the Actions tab, run "Build apps" (or it runs on push).
3. Download the artifacts:
   - `android-apk`: debug APK. On the phone, allow "Install unknown apps" for your browser/file manager, then open the APK.
   - `desktop-windows-latest`: portable `.exe`, no installer.
   - `desktop-macos-latest`: `.dmg` and `.zip`. Unsigned, so first launch: right-click the app, Open.

## Use
Open the app, wait about 10 seconds in the lobby, tap Test. Tap Copy all and paste the result. Open a game, tap Refresh list, Copy all again.

Desktop shortcut: Ctrl/Cmd+1.

Note: these tools run inside each app's built-in browser (Chromium WebView on Android, Electron on desktop), so readings reflect that engine, not the iPhone's Safari/Chrome.
