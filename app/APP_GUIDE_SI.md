# GINI Studio App: තනියම Play Store / App Store එකට දාන විදිය

මේ guide එක ලිව්වේ Claude නැතුව වුණත් ඔයාටම app එක build කරලා publish කරන්න පුළුවන් වෙන්න. පියවරෙන් පියවර යන්න. එක පියවරක් ඉවර කරලා ඊළඟ එකට යන්න.

---

## 0. හැදුවේ මොකක්ද, තියෙන්නේ කොහෙද

- App නම: **GINI Studio**. App ID (package name / bundle ID): **`lk.gini.studio`** (මේක පස්සේ වෙනස් කරන්න බෑ, ඒ නිසා මේකම පාවිච්චි කරන්න).
- Repo: `https://github.com/dileepab/gini-studio`, ෆෝල්ඩරය **`app/`**.
  - `app/android/` = Android project (Android Studio එකෙන් open වෙනවා)
  - `app/ios/` = iPhone project (Mac එකේ Xcode එකෙන් open වෙනවා)
  - `app/assets/` = icon + splash මුල් images (ගිනි wordmark එකෙන්)
  - `app/store/` = store එකට දාන්න හදපු screenshots, feature graphic, 512 icon
  - `app/native/` = app එකට විතරක් එකතු කරපු දේවල් (WhatsApp app එකෙන් order, share/save mockup, back button, vibration)
  - `privacy.html` (repo root) = privacy policy. Link එක: **https://dileepab.github.io/gini-studio/privacy.html**
- App එක ඇතුළේ website එකේම copy එකක් තියෙනවා (designs 76, garments 14, prices). ඒ නිසා **internet නැතුවත් වැඩ** කරනවා. Order එක යන්නේ WhatsApp **0702010070** ට.
- Personal prints (personal_dileepa) app එකේ නෑ. Build script එක ඒවා ආවොත් නවත්තනවා.

> වැදගත්: website එකේ designs/prices වෙනස් කළාම **app එක auto update වෙන්නේ නෑ**. අලුත් version එකක් build කරලා store එකට upload කරන්න ඕනේ (පියවර 7).

---

## 1. Android phone එකේ test කරන්න (සල්ලි නෑ)

1. `https://github.com/dileepab/gini-studio/actions` වලට යන්න.
2. වම් පැත්තේ **Android app** click කරන්න. අලුත්ම run එක (කොළ ✓) open කරන්න.
   - Run එකක් නැත්නම්: **Run workflow** බොත්තම ඔබලා branch එක තෝරලා run කරන්න.
3. පහළ **Artifacts** යටතේ **gini-studio-debug-apk** download කරන්න (zip එකක්). Unzip කළාම `app-debug.apk`.
4. ඒක phone එකට WhatsApp/Drive එකෙන් යවලා open කරන්න. "Install unknown apps" allow කරන්න කියයි, allow කරන්න.
5. Check කරන්න: icon එක, splash එක, design තෝරන එක, **Order on WhatsApp** (WhatsApp app එක open වෙන්න ඕනේ), **Share / save mockup**, back බොත්තම.

---

## 2. Android signing key එක හදන්න (එක පාරයි, ඉතා වැදගත්)

Play Store එකට upload කරන හැම version එකක්ම මේ key එකෙන් sign කරන්න ඕනේ.

1. Mac එකේ **Android Studio** install කරන්න: https://developer.android.com/studio (free).
2. Terminal එක open කරලා මේක paste කරන්න (Android Studio එකේ එන keytool එක):
   ```
   cd ~/Desktop
   "/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin/keytool" -genkeypair -v -keystore gini-upload.jks -alias gini -keyalg RSA -keysize 2048 -validity 10000
   ```
3. Password එකක් අහයි (අඩුම 6 අකුරු). ඊට පස්සේ නම, city (Colombo), country code (**LK**) වගේ දේවල් අහයි. අන්තිමට `yes`.
4. Desktop එකේ **gini-upload.jks** file එක හැදෙනවා.

### Backup (මේක මඟ අරින්න එපා)
- `gini-upload.jks` file එක **තැන් දෙකක** තියන්න: Google Drive (private folder) + USB/pen drive.
- Password එක, alias එක (`gini`) ලියලා තියන්න (password manager / notebook).
- මේ file එක **කවදාවත් GitHub repo එකට දාන්න එපා**, WhatsApp එකේ කාටවත් යවන්න එපා.
- Play App Signing on කරලා තියෙන නිසා (පියවර 4) මේ key එක නැති වුණොත් Play Console එකෙන් "upload key reset" ඉල්ලන්න පුළුවන්. ඒත් දවස් කීපයක් යනවා, ඒ නිසා backup කරන්න.

---

## 3. Upload කරන්න පුළුවන් AAB file එක හදන්න

**ක්‍රමය A (ලේසිම, GitHub එකෙන්):** key එක GitHub secrets වලට දාන්න, එතකොට හැම build එකකම signed AAB එකක් ලැබෙනවා.

1. Terminal එකේ:
   ```
   base64 -i ~/Desktop/gini-upload.jks | pbcopy
   ```
   (දැන් key එක clipboard එකේ.)
2. `https://github.com/dileepab/gini-studio/settings/secrets/actions` → **New repository secret**. මේ 4 හදන්න:
   - `ANDROID_KEYSTORE_BASE64` = paste (Cmd+V)
   - `ANDROID_KEYSTORE_PASSWORD` = keystore password එක
   - `ANDROID_KEY_ALIAS` = `gini`
   - `ANDROID_KEY_PASSWORD` = key password එක (සාමාන්‍යයෙන් keystore password එකමයි)
3. Actions → **Android app** → **Run workflow**. ඉවර වුණාම Artifacts වල **gini-studio-release-aab** download කරන්න. ඇතුළේ `app-release.aab`. **මේකයි Play Store එකට දාන්නේ.**

> GitHub build එක තත්පර 2-3 කින් නවතිනවා නම් සහ run එකේ **"account is locked due to a billing issue"** කියලා තියෙනවා නම්:
> 1. https://github.com/settings/billing → **Payment information**: card එක update කරන්න / ගෙවන්න තියෙන මුදල (outstanding balance) ගෙවන්න.
> 2. Paid plan එකක් (Pro/Copilot) ඕනේ නැත්නම් **Plans and usage → Downgrade to Free**, Copilot subscription එකක් තියෙනවා නම් ඒකත් cancel කරන්න. Free plan එකේ public repo වලට Actions free.
> 3. Lock එක අයින් වුණාම (සමහර වෙලාවට පැයක් විතර යනවා) Actions → run එක → **Re-run all jobs**.
> ඒක හරි යනකම් ක්‍රමය B පාවිච්චි කරන්න.

**ක්‍රමය B (Mac එකේ Android Studio එකෙන්):**

1. Mac එකට **Node.js 22** install කරන්න: https://nodejs.org (LTS installer).
2. Terminal:
   ```
   cd ~/Personal/TikTokBrand/07_web
   git clone https://github.com/dileepab/gini-studio.git
   cd gini-studio/app
   npm ci
   npm run android
   ```
   (`git clone` කරලා තියෙනවා නම් `git pull` විතරක් ඇති.) Android Studio open වෙනවා. පළමු පාර Android SDK එක download කරන්න කියයි, **Accept/Next** දෙන්න. "Gradle sync" ඉවර වෙනකම් (පහළ progress bar එක) ඉන්න.

   **Test කරන්න විතරක් (key එක ඕනේ නෑ):** Menu **Build → Build App Bundle(s) / APK(s) → Build APK(s)**. ඉවර වුණාම "locate" click කරන්න. File එක: `app/android/app/build/outputs/apk/debug/app-debug.apk`. ඒක phone එකට යවලා install කරන්න (පියවර 1 වගේ).
   නැත්නම් phone එකේ **Developer options → USB debugging** on කරලා USB එකෙන් connect කරලා Android Studio එකේ උඩ ▶ (Run) ඔබන්න, app එක phone එකට කෙලින්ම install වෙනවා.
3. Android Studio: **Build → Generate Signed App Bundle or APK → Android App Bundle → Next**. Key store path = `gini-upload.jks`, passwords දාලා, **release** තෝරලා **Create**.
4. AAB එක හැදෙන්නේ `app/android/app/release/app-release.aab`.

---

## 4. Google Play Console (USD 25, එක පාරයි)

1. https://play.google.com/console → GINI එකට පාවිච්චි කරන Google account එකෙන් sign in.
2. Account type: **Personal** (ලේසියි) හරි **Organization** (business registration + D-U-N-S number ඕනේ).
3. $25 card එකෙන් ගෙවන්න. ID (NIC/passport) verification කරන්න, phone number verify කරන්න. මේකට දවස් කීපයක් යන්න පුළුවන්.
4. **Create app**: App name `GINI Studio`, language English, type **App**, **Free**. Declarations tick කරන්න.

### Personal account නම් තියෙන නීතිය (වැදගත්)
අලුත් personal accounts වලට production (හැමෝටම) දාන්න කලින් **closed testing** එකක් කරන්න ඕනේ: **අඩුම testers 12 දෙනෙක්** opt-in වෙලා **දවස් 14ක්** test කරන්න ඕනේ.
- Testing → Closed testing → track එකක් හදන්න → AAB එක upload කරන්න.
- Testers list එකට යාළුවන් 12+ ගේ Gmail දාන්න. Opt-in link එක එයාලට යවන්න, එයාලා link එකෙන් join වෙලා Play Store එකෙන් install කරන්න ඕනේ. දවස් 14 install කරගෙන ඉන්න කියන්න.
- දවස් 14ට පස්සේ Dashboard එකේ **Apply for production** එන්න ඕනේ. ප්‍රශ්න කීපයකට උත්තර දෙන්න.
- (Organization account එකකට මේ 12/14 නීතිය නෑ.)

### Play App Signing
පළමු AAB එක upload කරනකොට **Play App Signing** on කරන්න කියයි. **On කරන්න** (Google ලඟ app signing key එක තියාගන්නවා; ඔයාගේ `gini-upload.jks` එක upload key එක විතරයි).

---

## 5. Play Store listing එක පුරවන්න

**Main store listing:**
- App name: `GINI Studio`
- Short description (අකුරු 80 ට අඩු):
  `Design your own GINI tee or hoodie, see it live, order on WhatsApp.`
- Full description:
  ```
  GINI Studio is the official design studio of GINI, a Sri Lankan streetwear brand.

  • Pick a garment: oversized tee (220 gsm or 250 gsm premium), hoodie, long sleeve or arm-cut (skinner)
  • Pick a colour and choose from 70+ original GINI prints made for that colour
  • See a live mockup at the true print size for your size (S, M, L, XL)
  • Order in one tap on WhatsApp, free island-wide delivery in Sri Lanka
  • Share or save your design to show friends
  • Works offline

  Every piece is made to order in our own garment factory in Sri Lanka.

  ඔයාගේම ගිනි ඇඳුම හදාගන්න. ඇඳුම, පාට, design එක තෝරලා, live බලලා, WhatsApp එකෙන් order කරන්න.
  ```
- App icon: `app/store/android/icon_512.png`
- Feature graphic: `app/store/android/feature_graphic_1024x500.png`
- Phone screenshots: `app/store/android/screen_1.png` ... `screen_4.png`
- Category: **Shopping**. Email: GINI email එක. Website: `https://dileepab.github.io/gini-studio/`

**App content (Policy) කොටස:**
- Privacy policy: `https://dileepab.github.io/gini-studio/privacy.html`
- Ads: **No ads**
- App access: **All functionality available without special access** (login නෑ)
- Content rating: questionnaire එක පුරවන්න (violence/sex/gambling සේරම No) → Everyone/3+ වගේ එනවා
- Target audience: **18 and over** (හරි 13+). Children target කරන්න එපා.
- Data safety: **No data collected, no data shared** (app එක server එකකට කිසිම දෙයක් යවන්නේ නෑ; order එක යන්නේ user ම WhatsApp එකෙන් send කළාම)
- Government app: No. Financial features: None. Health: No. News: No.

ඊට පස්සේ release එක **Send for review**. සාමාන්‍යයෙන් දවස් 1-7.

---

## 6. iPhone App Store (USD 99 / අවුරුද්දට)

### 6.1 Apple Developer account
1. https://developer.apple.com/programs/enroll → Apple ID එකෙන් **Individual** විදියට enroll කරන්න. $99 card එකෙන්. Approve වෙන්න පැය 24-48 යන්න පුළුවන්.

### 6.2 Mac එක ලෑස්ති කරන්න
1. Mac App Store එකෙන් **Xcode** (අලුත්ම version එක) install කරන්න. එක පාරක් open කරලා extra components install කරන්න දෙන්න.
2. Node.js 22 (පියවර 3B වගේ).
3. Terminal:
   ```
   cd ~/Personal/TikTokBrand/07_web/gini-studio/app
   git pull
   npm ci
   npm run ios
   ```
   Xcode එකේ project එක open වෙනවා (`app/ios/App/App.xcodeproj`). Swift Package Manager එකෙන් Capacitor packages ටික auto download වෙනවා (පළමු පාර විනාඩි කීපයක්).

### 6.3 Xcode එකේ
1. වම් පැත්තේ **App** project → **Signing & Capabilities** tab.
2. **Team** = ඔයාගේ Apple Developer account එක. **Bundle Identifier** = `lk.gini.studio`. "Automatically manage signing" tick.
3. **General** tab: Version `1.0`, Build `1` (හැම upload එකකටම Build එක 1කින් වැඩි කරන්න).
4. iPhone එක USB එකෙන් connect කරලා උඩින් phone එක තෝරලා ▶ ඔබලා test කරන්න.
5. Upload: උඩින් device = **Any iOS Device (arm64)** → menu **Product → Archive** → Organizer window එකේ **Distribute App → App Store Connect → Upload**.

### 6.4 App Store Connect
1. https://appstoreconnect.apple.com → **Apps → + → New App**: Platform iOS, Name `GINI Studio` (අරගෙන නම් `GINI Custom Studio`), language English, Bundle ID `lk.gini.studio`, SKU `gini-studio-1`.
2. Screenshots: 6.9" display එකට `app/store/ios_6.9in/screen_1..4.png`, 6.5" එකට `app/store/ios_6.5in/...`.
3. Description, keywords (`tshirt, hoodie, custom, design, streetwear, sri lanka, gini, print`), Support URL `https://dileepab.github.io/gini-studio/`, Privacy Policy URL `https://dileepab.github.io/gini-studio/privacy.html`.
4. App Privacy: **Data Not Collected**.
5. Category: **Shopping**. Age rating: questionnaire සේරම None → 4+.
6. Upload කරපු build එක තෝරලා **Add for Review → Submit**.

### Apple reject කරොත්
- Apple සමහර වෙලාවට "website එකක් wrap කරලා" (Guideline **4.2 Minimum Functionality**) කියලා reject කරනවා. අපි ඒක අඩු කරන්න offline වැඩ කරන එක, native share sheet, WhatsApp app එකට කෙලින්ම යන එක, haptics, splash එක දාලා තියෙනවා.
- Reject වුණොත් Resolution Center එකේ reply කරන්න: "The app works fully offline with all 76 designs bundled, renders a live garment mockup on device at true print size per size, and uses the native share sheet and WhatsApp ordering. It is not a website wrapper." ඊට පස්සේ re-submit.
- Orders යන්නේ WhatsApp එකෙන් නිසා (physical goods) Apple In-App Purchase ඕනේ නෑ.

---

## 7. අලුත් designs / prices දාලා update එකක් යවන්න

1. සුපුරුදු විදියට website එක update කරන්න (`07_web/gini_designer/` → `build_from_page.py` → repo `main` එකට push). Website එක එතකොටම update වෙනවා.
2. App එකට:
   - Android: `app/android/app/build.gradle` එකේ `versionCode` 1කින් වැඩි කරන්න (1 → 2 → 3...), `versionName` (1.0 → 1.1). Push කරන්න. Actions එකෙන් අලුත් `app-release.aab` ගන්න → Play Console → Production (හරි testing) → **Create new release** → upload.
   - iPhone: `npm run ios` → Xcode එකේ Build number වැඩි කරලා Archive → Upload → App Store Connect එකේ අලුත් version එකක් හදලා submit.

---

## 8. Files map (කවදාහරි වෙනස් කරන්න ඕනේ නම්)

| මොකක්ද | කොහෙද |
|---|---|
| App නම, app ID, splash settings | `app/capacitor.config.json` |
| Icon/splash හදන්නේ | `app/brand/gini_logo_on-dark.svg` → `npm run icons` |
| Website එක app එකට copy කරන script එක | `app/scripts/build-web.mjs` (`npm run web`) |
| App-only features | `app/native/native.js`, `native.css` |
| Android version, signing | `app/android/app/build.gradle` |
| iPhone settings | `app/ios/App/App/Info.plist`, Xcode |
| GitHub build | `.github/workflows/android-app.yml` |
| Store images | `app/store/` |
| Privacy policy | `privacy.html` |

## ඉක්මන් checklist
- [ ] Debug APK එක phone එකේ test කළා
- [ ] `gini-upload.jks` හැදුවා + තැන් දෙකක backup + password ලිව්වා
- [ ] GitHub secrets 4 දැම්මා, signed AAB ගත්තා
- [ ] Play Console $25, ID verify
- [ ] Closed test: testers 12, දවස් 14
- [ ] Store listing + App content පිරෙව්වා → production review
- [ ] Apple $99, Xcode, Archive → Upload → App Store Connect → Submit
