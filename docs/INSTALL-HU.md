# Telepítési útmutató

## Végfelhasználóknak
A kiadási csomagból az operációs rendszerednek megfelelő telepítőt kell futtatni:
- Windows: DocuFlow-Setup-1.0.0.exe
- macOS: DocuFlow-1.0.0.dmg
- Linux: .AppImage vagy .deb

A telepítő elkészülte után nem kell Node.js-t, npm-et, SQLite-ot vagy Dockert telepíteni. Ezek a futtatáshoz szükséges összetevők az alkalmazáscsomag részei.

## Fejlesztőknek
1. Telepíts Node.js 20+ verziót.
2. Nyisd meg a projekt mappáját terminálban.
3. Futtasd: npm install
4. Teszteld: npm start
5. A célplatformon futtasd a megfelelő npm run dist:* parancsot.

A better-sqlite3 natív Node modul, ezért Electron ABI-hoz újra kell építeni. macOS aláírás/notarizáció ajánlott, Windows kódaláírás hiányában SmartScreen figyelmeztethet.

## Frissítés
Az alkalmazás frissítése előtt készíts adatbázis-mentést. Nagyobb adatmodell-változásnál migrációs eljárás szükséges.
