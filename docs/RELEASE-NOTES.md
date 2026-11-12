# DocuFlow Desktop 1.1.0 – fejlesztési kiadás

## Újdonságok
- Céges profil, saját logó, arculati szín és PDF-lábléc.
- Logó tárolása az SQLite-adatbázisban, így az adatbázis-mentés a logót is tartalmazza.
- Szerkeszthető dokumentumtörzs és helyőrzőcsere.
- Öt beépített üzleti dokumentumminta.
- Sablon kiválasztása a dokumentum szerkesztésekor.
- Offline Professional licencfájl importálása és Ed25519 aláírás-ellenőrzése.
- Kiadói kulcsgeneráló és licenckiadó parancssori eszköz.
- GitHub Actions tesztlépés és platformos telepítőbuild.

## Fontos kiadási feltételek
- A kiadó futtassa a `npm run license:keys` parancsot, őrizze meg a privát kulcsot offline, és commitolja a létrehozott `src/license-public.pem` nyilvános kulcsot. A jelenlegi repóban a publikus kulcs helyőrző; Professional licencet éles kulcs beállítása és új build nélkül nem lehet aktiválni.
- A Standard az alapértelmezett kiadás. A Professional jelenleg a saját sablonok létrehozását/szerkesztését/törlését nyitja meg.
- A UI jelenleg magyar nyelvű. Az angol és további felületi fordítások külön kiadás előtti feladatok.
- A licenc teljesen offline és korlátlan saját eszközön használható, ezért távoli visszavonás és biztos másolásvédelem nem lehetséges.
- Kódaláírás, Apple notarizáció, jogi felülvizsgálat és célplatformon végzett kézi QA szükséges a nyilvános kereskedelmi kiadáshoz.

Ez fejlesztési kiadás, nem állítás arról, hogy minden operációs rendszeren teljes körűen tesztelt vagy jogilag kész a kereskedelmi forgalmazásra.
