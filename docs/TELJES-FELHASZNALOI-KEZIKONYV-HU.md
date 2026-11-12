# DocuFlow Desktop – teljes magyar felhasználói kézikönyv

**Verzió:** 1.0.0  
**Dokumentum állapota:** a jelenlegi 1.0.0 forráskód alapján készült  
**Alkalmazás típusa:** helyi, egyfelhasználós üzleti dokumentumkezelő

Ez a kézikönyv a DocuFlow 1.0.0 ténylegesen megvalósított funkcióit ismerteti. A későbbi verziókban megjelenő funkciókat nem tekinti jelenleg elérhetőnek.

---

## 1. Mire való a DocuFlow?

A DocuFlow kisvállalkozások és szolgáltatók számára készült asztali alkalmazás, amellyel ügyféladatok, üzleti dokumentumok és újrafelhasználható szövegsablonok tarthatók nyilván.

A program helyben, a számítógépen tárolja az adatokat. A működéséhez nincs szükség DocuFlow-fiókra vagy folyamatos internetkapcsolatra.

### A 1.0.0 verzió fő funkciói

- Ügyfelek felvétele, módosítása, törlése.
- Árajánlat, szerződés, megrendelő, teljesítési igazolás, számlához kapcsolódó dokumentum és egyéb dokumentum rögzítése.
- Dokumentumokhoz tételsorok, mennyiség, egységár és ÁFA-kulcs rögzítése.
- Dokumentumok státuszának nyilvántartása.
- Dokumentumok PDF-fájlba exportálása.
- Saját szövegsablonok tárolása és szerkesztése.
- A helyi adatbázis biztonsági mentése és korábbi mentés visszaállítása.
- Áttekintő felület az ügyfelek, dokumentumok, piszkozatok és legutóbbi dokumentumok számával.

### Ami nem része az 1.0.0 verziónak

- NAV-kapcsolat és elektronikus számlázás.
- Könyvelőprogram-integráció.
- E-mail-küldés, automatikus emlékeztetők.
- Felhőalapú szinkronizálás és többfelhasználós közös adatbázis.
- Elektronikus aláírás.
- Automatikus sablonkitöltés.
- Felhasználói fiókok és szerepkörök.

## 2. Telepítés és első indítás

### Windows

1. Töltsd le a DocuFlow Windows telepítőcsomagját a projekt hivatalos GitHub Actions futásának **Artifacts** részéből.
2. Csomagold ki a letöltött ZIP-fájlt.
3. Indítsd el a `DocuFlow-Setup-1.0.0.exe` fájlt.
4. Kövesd a telepítő lépéseit.
5. A telepítés után indítsd el a DocuFlow alkalmazást a Start menüből vagy az asztali parancsikonról.

A jelenlegi telepítő nincs digitális kódaláírással ellátva, ezért a Windows SmartScreen „Ismeretlen kiadó” figyelmeztetést jeleníthet meg. Ez nem bizonyítja sem azt, hogy a fájl veszélyes, sem azt, hogy biztonságos. Csak a projekt saját, ellenőrzött GitHub Actions futásából letöltött telepítőt használd. Ha a fájl eredete nem ellenőrizhető, ne futtasd.

### macOS és Linux

A kiadási csomagok között a megfelelő rendszerhez készült DMG, AppImage vagy DEB fájlt kell kiválasztani. A platformonkénti telepítési és aláírási követelmények eltérhetnek. A jelen útmutató nem tekinti a Windows telepítési lépéseit érvényesnek más rendszerekre.

### Első indítás

Az alkalmazás első indításkor létrehozza a helyi SQLite adatbázist és az alapvető táblákat. Kezdetben az ügyfél- és dokumentumlisták üresek.

## 3. Az alkalmazás felülete

A bal oldali navigáció négy fő területet tartalmaz:

- **Áttekintés:** összesítő számok és legutóbbi dokumentumok.
- **Dokumentumok:** dokumentumok listája, létrehozása, szerkesztése, PDF-exportja és törlése.
- **Ügyfelek:** ügyféladatok kezelése.
- **Sablonok:** saját szövegminták nyilvántartása.

A felső sávban található az **Új dokumentum**, **Mentés** és **Visszaállítás** művelet.

## 4. Ügyfelek kezelése

Nyisd meg az **Ügyfelek** menüpontot, majd válaszd az **Új ügyfél** lehetőséget.

### Rögzíthető adatok

- Ügyfél neve – kötelező.
- E-mail-cím.
- Telefonszám.
- Adószám.
- Cím.

A **Mentés** gomb rögzíti az adatokat. A listában a **Szerkesztés** gombbal módosíthatók a meglévő adatok, a **Törlés** gombbal pedig eltávolítható az ügyfél.

**Fontos:** ha olyan ügyfelet törölsz, akihez már dokumentum tartozik, a dokumentum megmarad, de az ügyfélkapcsolata megszűnik. A dokumentum nem törlődik.

Adatvédelmi szempontból csak a szükséges ügyféladatokat tárold, és gondoskodj a számítógép védelméről.

## 5. Dokumentumok kezelése

A **Dokumentumok** oldalon az **Új dokumentum** gombbal lehet új dokumentumot rögzíteni.

### 5.1. Dokumentum alapadatai

- **Dokumentumtípus:** Árajánlat, Szerződés, Megrendelő, Teljesítési igazolás, Számlához kapcsolódó dokumentum vagy Egyéb.
- **Dokumentum címe:** kötelező mező.
- **Ügyfél:** választható a korábban rögzített ügyfelek közül.
- **Kiállítás dátuma:** alapértelmezésben az aktuális dátum.
- **Határidő / érvényesség:** opcionális dátum.
- **Pénznem:** HUF, EUR vagy USD.
- **Státusz:** Piszkozat, Elküldve, Elfogadva, Elutasítva vagy Teljesítve.
- **Megjegyzés:** szabad szöveges kiegészítés.

### 5.2. Tételsorok

A dokumentumhoz a **Tétel hozzáadása** gombbal lehet új sort felvenni. Egy tételsorban megadható:

- Megnevezés.
- Mennyiség.
- Egységár.
- ÁFA százalék.

A mennyiség és az egységár nem lehet negatív. Az alkalmazás a tételsorokból számolja a nettó értéket, az ÁFA összegét és a bruttó végösszeget. A jelenlegi felületen a mennyiségi egység alapértelmezett értéke „db”.

A dokumentum mentéséhez kattints a **Dokumentum mentése** gombra. A dokumentum megjelenik a listában.

### 5.3. Dokumentumszám és státusz

Új dokumentum mentésekor a program automatikusan belső azonosítót készít, például `DF-2026-123456` formában. Ez az alkalmazás saját nyilvántartási azonosítója, nem hatósági vagy számlázóprogram által kiadott sorszám.

A státusz a dokumentum munkafolyamatának nyilvántartására szolgál. A státusz megváltoztatása önmagában nem küldi el a dokumentumot az ügyfélnek.

### 5.4. Szerkesztés és törlés

A dokumentumlistában a **Szerkesztés** gombbal módosíthatók az adatok és a tételek. A **Törlés** gomb megerősítést kér. A törölt dokumentum és a hozzá tartozó tételsorok eltávolításra kerülnek az adatbázisból.

A törlés előtt készíts mentést, ha bizonytalan vagy.

## 6. PDF exportálás

A dokumentumlistában a megfelelő dokumentum sorában kattints a **PDF** gombra.

1. Megjelenik a fájlmentési ablak.
2. Válaszd ki a célmappát és a fájl nevét.
3. Mentsd el a PDF-et.

A PDF tartalmazza a DocuFlow fejlécet, a dokumentum címét és azonosítóját, a dátumokat, az ügyfél elérhető adatait, a tételeket, az összesített nettó, ÁFA- és bruttó összeget, valamint a megjegyzést.

### PDF és magyar karakterek

A PDF-generálás a beépített DejaVu Sans betűtípust használja, ha az alkalmazás csomagjában elérhető. Ha ez a betűfájl hiányzik, a program Helvetica betűtípusra vált. A Helvetica nem feltétlenül jelenít meg minden magyar ékezetes karaktert megfelelően. Ezért a magyar nyelvű PDF-eket ellenőrizd megnyitás után, különösen az ő és ű karaktereket. Hibás karakterek esetén a PDF-et ne küldd ki hivatalos dokumentumként.

A PDF export nem teszi a dokumentumot hitelesített elektronikus aláírással ellátott irattá.

## 7. Saját szövegsablonok

A **Sablonok** oldalon új szövegmintákat lehet rögzíteni.

A sablon mezői:
- Sablon neve – kötelező.
- Dokumentumtípus.
- Sablonszöveg / megjegyzés.

A sablonok megjeleníthetők, szerkeszthetők és törölhetők. Az 1.0.0 verzióban a sablonok külön nyilvántartásként működnek: a program nem illeszti be automatikusan a tartalmukat az új dokumentumokba.

## 8. Biztonsági mentés és visszaállítás

A DocuFlow adatbázisa helyben tárolja az ügyfél-, dokumentum-, tétel- és sablonadatokat. A program nem helyettesíti a felhasználó saját biztonsági mentési felelősségét.

### 8.1. Mentés készítése

1. Kattints a felső sávban a **Mentés** gombra.
2. Válaszd ki a mentési fájl helyét.
3. Mentsd el a `.sqlite` kiterjesztésű fájlt.

A mentést lehetőleg külső meghajtóra vagy más, a számítógéptől elkülönülő biztonságos helyre is másold. A mentés bizalmas üzleti és személyes adatokat tartalmazhat.

Javasolt mentési rend:
- fontosabb adatbevitel után;
- minden munkanap végén;
- alkalmazásfrissítés előtt;
- a mentések időszakos visszaállítási próbájával.

### 8.2. Mentés visszaállítása

1. Kattints a **Visszaállítás** gombra.
2. Válaszd ki a korábban készített SQLite mentési fájlt.
3. Olvasd el a figyelmeztetést.
4. Csak akkor válaszd a **Visszaállítás** lehetőséget, ha biztos vagy benne.

**Figyelem:** a visszaállítás felülírja a jelenlegi adatbázist a kiválasztott mentéssel. A művelet előtt készíts külön mentést az aktuális állapotról. A visszaállítás után az alkalmazás újraindul.

Ne válassz ki ismeretlen eredetű vagy sérült adatbázisfájlt.

## 9. Adattárolás és adatvédelem

A DocuFlow az Electron által biztosított, felhasználói alkalmazásadatok számára fenntartott helyi mappában tárolja a `docuflow.sqlite` adatbázist. Az adatbázis nem a telepítő ZIP-fájljában található, és az alkalmazás eltávolítása vagy frissítése nem feltétlenül törli.

A pontos mappa operációs rendszerenként eltér. A felhasználói adatkönyvtár tartalmazhat személyes és üzleti adatokat, ezért ne oszd meg nyilvánosan.

### Biztonsági korlátok

- Az adatbázis nincs alkalmazásszinten titkosítva.
- A hozzáférést a számítógép operációs rendszerének felhasználói jogosultságai védik.
- A jelenlegi kiadás egyfelhasználós, helyi használatra készült.
- Közös hálózati mappából vagy több számítógépről történő egyidejű használat nem támogatott.
- Nincs felhasználói bejelentkezés, szerepkörkezelés vagy beépített felhőszinkronizálás.

Használj erős eszközjelszót, naprakész operációs rendszert és lehetőség szerint teljes lemeztitkosítást.

## 10. Jogi és számlázási figyelmeztetés

A DocuFlow 1.0.0 dokumentumkezelő és nyilvántartó alkalmazás. **Nem minősített számlázóprogram, nem NAV-integrált, és nem teljesíti automatikusan a jogszabály szerinti számlázás követelményeit.**

A „Számlához kapcsolódó dokumentum” típus nem jelent számlakiállítási vagy NAV-adatszolgáltatási funkciót. Ne használd a programot jogszabály szerinti számla kiállítására, és ne tekintsd a belső dokumentumszámot hivatalos számlaszámnak.

A dokumentumok jogi megfelelőségét, adózási kezelését és megőrzését minden esetben ellenőriztesd könyvelővel vagy megfelelő szakértővel.

## 11. Hibaelhárítás

### Nem indul el a telepítő
Ellenőrizd, hogy a telepítő a saját, hivatalos GitHub Actions futásból származik-e. A SmartScreen figyelmeztetése az aláírás hiánya miatt jelenhet meg. Ha a forrás nem ellenőrizhető, ne futtasd.

### Nem indul el az alkalmazás
- Indítsd újra a számítógépet.
- Ellenőrizd, hogy a telepítés befejeződött-e.
- Próbáld elindítani a Start menüből.
- Jegyezd fel a hibaüzenetet, és a pontos szöveggel kérj segítséget.

### Nem sikerül PDF-et menteni
- Válassz olyan mappát, amelybe van írási jogosultságod.
- Ellenőrizd, hogy a célfájl nincs-e megnyitva vagy zárolva egy másik programban.
- Próbálj másik fájlnevet és mappát választani.

### Hibásak az ékezetek a PDF-ben
A PDF-hez használt Unicode betűtípus hiányozhat a csomagból. Ellenőrizd a PDF-et, és ne küldd tovább hibás karakterekkel. Készíts mentést, és jelezd a problémát a fejlesztőnek.

### Nem sikerül a visszaállítás
Ellenőrizd, hogy a kiválasztott fájl valódi, DocuFlow-ból készített SQLite mentés-e. Ne töröld az eredeti mentést. Ha az adatbázis sérültnek tűnik, őrizd meg a fájlt, és kérj segítséget.

## 12. Adatvesztés megelőzése – gyors ellenőrzőlista

- [ ] Rendszeresen készítek SQLite mentést.
- [ ] A mentést a számítógéptől külön helyen is tárolom.
- [ ] Visszaállítás előtt mentem az aktuális adatbázist.
- [ ] Nem osztom meg nyilvánosan a mentési fájlokat.
- [ ] A PDF-eket megnyitás után ellenőrzöm.
- [ ] A programot nem használom hivatalos számla kiállítására.

## 13. Fejlesztői és technikai információk

A DocuFlow technológiai alapjai:
- Electron desktop keretrendszer.
- SQLite adatbázis a `better-sqlite3` csomaggal.
- PDF-generálás PDFKit segítségével.
- HTML, CSS és JavaScript alapú felhasználói felület.
- Electron IPC kommunikáció preload rétegen keresztül.

A fejlesztői indításhoz Node.js és npm szükséges. A telepített alkalmazás használatához a felhasználónak nem kell külön Node.js-t telepítenie.

A forráskód és a kiadási fájlok a projekt GitHub-adattárában érhetők el:
https://github.com/gergohorvath878-ux/DocuFlow

A GitHub Actions build sikeressége önmagában nem helyettesíti a telepített alkalmazás funkcionális és biztonsági tesztelését. Minden kiadást célszerű külön tesztelni az adott operációs rendszeren.

---

**DocuFlow Desktop 1.0.0 – magyar felhasználói kézikönyv**  
A dokumentum a jelenlegi forráskód alapján készült. A funkciók és a kezelőfelület későbbi verziókban változhatnak.
