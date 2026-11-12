# Architektúra

## Technológiai döntések
- Electron: cross-platform desktop shell és csomagolt Chromium/Node futtatókörnyezet.
- SQLite / better-sqlite3: egyfájlos, helyi adatbázis.
- PDFKit: PDF generálás.
- Natív HTML/CSS/JavaScript renderer: minimális függőségű felület.

## Folyamatok
A renderer nem kap közvetlen Node.js hozzáférést. A preload.js egy szűk, név szerint meghatározott API-t tesz elérhetővé a contextBridge segítségével. Az adatbázist és a fájlrendszert kizárólag a főfolyamat kezeli IPC hívásokon keresztül.

## Adatmodell
- customers: ügyféladatok
- documents: dokumentumfejlécek
- items: dokumentumtétel-sorok
- templates: felhasználói szövegsablonok

A dokumentum és tételsorok kapcsolata egy-a-többhöz. Ügyfél törlésekor a dokumentum ügyfélkapcsolata nullázódik, a dokumentum nem törlődik.

## Adattárolás
Az adatbázis az Electron userData mappájában található. A telepítési mappán kívüli elhelyezés megőrzi az adatokat az alkalmazás frissítésekor.

## Biztonsági alapelvek
- contextIsolation: true
- nodeIntegration: false
- sandbox: true
- Content Security Policy
- Renderer oldali bemenetek escape-elése
- Paraméterezett SQL lekérdezések
- IPC műveletek explicit csatornanevekkel

A függőségek és natív modulok platformonkénti buildje szükséges. A forráscsomag nem tartalmaz előre lefordított telepítőket.
