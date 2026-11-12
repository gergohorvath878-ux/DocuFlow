# DocuFlow – dokumentumgenerátor útmutató

## Rendeltetés
A DocuFlow ügyfél- és üzleti adatkezelő, valamint általános dokumentum-előkészítő alkalmazás. Szerkeszthető üzleti mintákat és PDF-eket készít. Nem számlázóprogram, nem NAV-integrált rendszer, és önmagában nem garantál jogi vagy hatósági érvényességet.

## Céges arculat
1. Nyisd meg a **Céges arculat** menüpontot.
2. Add meg a cégnevet, kapcsolattartót, címet és elérhetőségeket.
3. Válassz PNG vagy JPG logót.
4. Állítsd be az arculati színt és a dokumentum láblécét.
5. Mentsd a céges adatokat.

A céges profil helyben tárolódik az SQLite-adatbázisban. A logó a DocuFlow felhasználói adatkönyvtárába kerül.

## Dokumentum készítése
1. Válaszd az **Új dokumentum** lehetőséget.
2. Válassz típust: árajánlat, megrendelőlap, szerződéstervezet, teljesítésigazolás, átadás-átvételi jegyzőkönyv vagy egyéb.
3. Válassz ügyfelet a mentett ügyfelek közül.
4. Add meg a címet, dátumokat, pénznemet, státuszt és a dokumentum tételeit.
5. Írd meg a dokumentum szövegét vagy tölts be egy mentett sablont.
6. Mentsd a dokumentumot, majd a dokumentumlistában válaszd a **PDF** műveletet.

## Sablonok
A **Sablonok** menüpontban saját mintaszövegek hozhatók létre és szerkeszthetők. Első adatbázis-indításkor a program öt alapmintát készít, ha még nincsenek sablonok.

Használható helyőrzők:
- `{{company_name}}` – cégnév
- `{{customer_name}}` – ügyfél neve
- `{{customer_address}}` – ügyfél címe
- `{{document_title}}` – dokumentum címe
- `{{document_number}}` – dokumentumszám
- `{{issue_date}}` – dátum
- `{{due_date}}` – határidő / érvényesség
- `{{items}}` – tételek összefoglalója
- `{{total}}` – bruttó összeg

A dokumentumszerkesztőben kiválasztott sablon szövege a dokumentum tartalommezőjébe kerül, utána szabadon módosítható.

## PDF és korlátozások
A PDF tartalmazhatja a logót, céges arculatot, ügyféladatokat, tételeket, összegeket, dokumentumszöveget és láblécet. A szerződésminta kizárólag szerkeszthető tervezet; a teljesítésigazolás és átadás-átvételi jegyzőkönyv minta. A PDF-export nem elektronikus aláírás, nem hatósági benyújtás, és nem számlakiállítás. A dokumentumok jogi és adóügyi megfelelőségének ellenőrzése a felhasználó feladata.

## Mentés
A felső **Mentés** gombbal exportálható az adatbázis. A logó külön helyi fájl, ezért teljes gépköltöztetéskor a DocuFlow felhasználói adatkönyvtáráról is készíts biztonsági másolatot.
