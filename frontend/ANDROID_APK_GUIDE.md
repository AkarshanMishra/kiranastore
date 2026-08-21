# Android APK Generation Guide for Kirana Store

The Capacitor Android project is already initialized at:
`frontend/android`

---

## Method 1: Build APK via Android Studio (Recommended)

1. Open **Android Studio**.
2. Select **Open** and choose the folder:
   `c:\Users\Akarshan mishra1207\OneDrive\Desktop\kiranastore\frontend\android`
3. Wait for Gradle sync to complete.
4. Click **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
5. Once built, click **locate** in the popup notification to get your `app-debug.apk`.
6. Transfer this APK to your Android phone and install it!

---

## Method 2: Command Line (Requires Java 17/21 + Android SDK)

If you have JDK 17+ installed:

> **IMPORTANT:** Capacitor 8 / AGP 8.13 refuse to build with Java 8. If your default
> `java` is Java 8 you will get:
> `Dependency requires at least JVM runtime version 11. This build uses a Java 8 JVM.`
> Point `JAVA_HOME` at a JDK 17+ install first (JDK21 is installed at
> `%USERPROFILE%\AppData\Local\JDK21`):
> ```bash
> set JAVA_HOME=C:\Users\Akarshan mishra1207\AppData\Local\JDK21\jdk-21.0.12+8
> ```

```bash
cd frontend/android
./gradlew assembleDebug
```
The APK will be saved at:
`frontend/android/app/build/outputs/apk/debug/app-debug.apk`

> On Windows use `gradlew.bat` instead of `./gradlew`.

---

## Whenever You Make Frontend Changes:

To update the Android app with new changes:
```bash
cd frontend
npm run build
npx cap sync android
```
