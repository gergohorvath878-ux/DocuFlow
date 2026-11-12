# Tesztterv

## Telepítés és indulás
- [ ] Windows 10/11 telepítő telepít és eltávolít.
- [ ] macOS DMG megnyílik, alkalmazás indul, aláírás ellenőrizhető.
- [ ] Linux AppImage indul, DEB telepíthető.
- [ ] Első indításkor adatbázis létrejön.

## Ügyfélkezelés
- [ ] Ügyfél létrehozása kötelező névvel.
- [ ] Ügyfél szerkesztése menti a módosításokat.
- [ ] Ügyfél törlése nem törli a dokumentumot.

## Dokumentumok
- [ ] Dokumentum létrehozása és módosítása.
- [ ] Több tételsor mentése.
- [ ] Nettó, ÁFA és bruttó összeg helyes.
- [ ] Dokumentum törlése a tételeket is törli.
- [ ] PDF export ékezetes karakterekkel és több oldallal.

## Adatmentés
- [ ] SQLite mentés létrejön.
- [ ] Mentésből visszaállítás után az adatok megmaradnak.
- [ ] Frissítés után az adatbázis nem tűnik el.

A fenti teszteket a kiadáskészítőnek kell végrehajtania. A teljes platformos build és manuális QA még nem történt meg.


## 1.1.0 dokumentumgenerátor és licenc tesztek
- [ ] Régi adatbázis megnyitása a `content` és `logo_data` mezők migrációjával.
- [ ] Céges profil mentése, logó kiválasztása (PNG/JPG, 5 MB limit), eltávolítása.
- [ ] Adatbázis-mentés és visszaállítás után a logó is megmarad.
- [ ] Öt beépített sablon első adatbázis-indításkor létrejön.
- [ ] Sablon kiválasztása a dokumentumszerkesztőben a szöveget betölti.
- [ ] Helyőrzők behelyettesítése a PDF-be.
- [ ] Magyar ékezetek megjelenése Windows/macOS/Linux rendszeren.
- [ ] Standard módban saját sablon mentése/törlése tiltott.
- [ ] Professional licencfájl aláírása ellenőrződik; módosított licencfájl elutasításra kerül.
- [ ] Professional licenc importja internet nélkül működik.
- [ ] Licencfájl több saját számítógépen használható, eszközaktiválás nélkül.
- [ ] Minden célplatform telepítőjének kézi indítása és alapfunkcióinak ellenőrzése.
