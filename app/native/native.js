// GINI Studio app layer. Runs only inside the Capacitor app; on a normal browser it does nothing.
(function () {
  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  var P = C.Plugins;
  document.documentElement.classList.add("is-app", "is-" + C.getPlatform());
  function $(id) { return document.getElementById(id); }
  function toast(t) { var el = $("toast"); if (el) el.textContent = t; }
  function tap() { try { P.Haptics && P.Haptics.impact({ style: "LIGHT" }); } catch (e) {} }

  // Status bar + splash
  try { P.StatusBar && P.StatusBar.setStyle({ style: "DARK" }); } catch (e) {}
  try { P.StatusBar && C.getPlatform() === "android" && P.StatusBar.setBackgroundColor({ color: "#151211" }); } catch (e) {}
  function hideSplash() { try { P.SplashScreen && P.SplashScreen.hide({ fadeOutDuration: 250 }); } catch (e) {} }
  if (document.readyState === "complete") setTimeout(hideSplash, 300); else addEventListener("load", function () { setTimeout(hideSplash, 300); });

  // Light haptic tick on every chip / button / print tap
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest("button, .chips > *, .prints > *, .filter > *, .fabric > *")) tap();
  }, true);

  // External links (WhatsApp order, anything http) open in the right app, never inside the app view.
  function openOut(url) {
    var go = P.AppLauncher ? P.AppLauncher.openUrl({ url: url }) : Promise.reject();
    return go.catch(function () { window.open(url, "_system"); });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (!/^(https?:|whatsapp:|tel:|mailto:)/i.test(href)) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (a.getAttribute("aria-disabled") === "true") return;
    var m = href.match(/^https:\/\/wa\.me\/(\d*)\?text=(.*)$/);
    if (m) {
      // Try the WhatsApp app directly, then the wa.me web link.
      var direct = "whatsapp://send?" + (m[1] ? "phone=" + m[1] + "&" : "") + "text=" + m[2];
      (P.AppLauncher ? P.AppLauncher.openUrl({ url: direct }) : Promise.reject())
        .then(function (r) { if (r && r.completed === false) throw 0; })
        .catch(function () { openOut(href); });
      return;
    }
    openOut(href);
  }, true);

  // "Save mockup image": write the mockup to a file and open the share sheet (Save Image / WhatsApp / Instagram ...)
  var save = $("save");
  if (save) {
    save.textContent = "Share / save mockup";
    save.addEventListener("click", function (e) {
      e.preventDefault(); e.stopImmediatePropagation();
      var cv = $("cv"); if (!cv || !P.Filesystem || !P.Share) return;
      var data = cv.toDataURL("image/jpeg", 0.92).split(",")[1];
      var name = "gini-mockup-" + Date.now() + ".jpg";
      P.Filesystem.writeFile({ path: name, data: data, directory: "CACHE" })
        .then(function (r) {
          return P.Share.share({ title: "My GINI design", text: "My GINI design from GINI Studio", files: [r.uri], dialogTitle: "Share or save your design" });
        })
        .catch(function (err) { if (!/cancel/i.test(String(err && err.message))) toast("Could not open share. Try again."); });
    }, true);
  }

  // "Copy order": native clipboard is not needed; the page's own copy works in the app web view.

  // Android back button: close the open preview, else go back, else leave the app.
  if (P.App) P.App.addListener("backButton", function (ev) {
    var w = $("saveWrap");
    if (w && !w.hidden) { w.hidden = true; return; }
    if (ev && ev.canGoBack) history.back(); else P.App.minimizeApp ? P.App.minimizeApp() : P.App.exitApp();
  });
})();
