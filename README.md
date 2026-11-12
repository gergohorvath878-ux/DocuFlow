# DocuFlow Desktop

Offline-first, többplatformos üzleti dokumentumkezelő desktop alkalmazás Electron + SQLite alapon.

A teljes forráskód és a magyar dokumentáció a repository `docs/` mappájában található. A [dokumentumgenerátor útmutató](docs/DOCUMENT-GENERATOR-HU.md) bemutatja a céges arculatot, a sablonokat és a PDF-készítést. A részletes [magyar felhasználói kézikönyv](docs/TELJES-FELHASZNALOI-KEZIKONYV-HU.md) bemutatja a telepítést, az ügyfél- és dokumentumkezelést, a PDF-exportot, a sablonokat, a mentést és a visszaállítást.

## Funkciók
- Ügyfélkezelés
- Árajánlatok, szerződések, megrendelők és teljesítési igazolások
- Tételsorok és szerkeszthető saját sablonok
- Céges profil, logó, arculati szín és PDF-fejléc/lábléc
- Beépített üzleti minták és automatikus helyőrző-kitöltés
- PDF export
- Helyi SQLite-adatbázis
- Adatmentés és visszaállítás
- Offline működés

A szerződéstervezet, teljesítésigazolás és átadás-átvételi jegyzőkönyv szerkeszthető minta; a program nem biztosít jogi hitelességet, elektronikus aláírást vagy hatósági megfelelőséget.

## Jogi megjegyzés
Ez a kiadás nem minősített számlázóprogram, nem NAV-integrált rendszer. Számlázási célú használat előtt szakértői ellenőrzés szükséges.

## Build állapot
A projekt Electron Builder konfigurációt és GitHub Actions workflow-t tartalmaz Windows, macOS és Linux csomagokhoz. A telepítők buildje és platformonkénti tesztelése még hátravan.
