// a) Purpose: Configures Firefox to behave like the custom Ulo Browser.
// c) Install/Test: Place in ~/.mozilla/firefox/*.default-release/user.js
// d) Open decisions: Disabling Pocket and Firefox Sync in favor of Ulo's unified sync if desired.

// Enable userChrome.css to allow deep UI customization
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);

// Enable hardware acceleration (crucial for QEMU virgl/virtio-gpu)
user_pref("gfx.webrender.all", true);
user_pref("media.ffmpeg.vaapi.enabled", true);

// Privacy / Debloat (Ulo philosophy)
user_pref("extensions.pocket.enabled", false);
user_pref("browser.newtabpage.activity-stream.feeds.telemetry", false);
user_pref("browser.ping-centre.telemetry", false);
user_pref("toolkit.telemetry.enabled", false);

// Make the browser feel native to the UloShell (Dark mode)
user_pref("ui.systemUsesDarkTheme", 1);
user_pref("browser.theme.content-theme", 0); // 0 = dark, 1 = light, 2 = system

// Smooth scrolling matching the Ulo UI feel
user_pref("general.smoothScroll.msdPhysics.enabled", true);
