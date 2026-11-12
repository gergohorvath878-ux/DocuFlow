# DocuFlow – offline licenc kiadása

## Fontos
A Professional licenc Ed25519 digitális aláírással működik. A magánkulcs a kiadóé, és soha nem kerülhet a nyilvános GitHub-repóba vagy az alkalmazásba. A nyilvános kulcs az alkalmazás része, a licencfájl pedig a vásárló gépén offline ellenőrizhető.

## Egyszeri kulcsgenerálás a kiadónál
1. Klónozd a privát/kiadói munkapéldányt.
2. Futtasd: `npm install`.
3. Futtasd: `npm run license:keys`.
4. A parancs létrehozza a gyökérmappában a `license-private.pem` magánkulcsot és a `src/license-public.pem` nyilvános kulcsot.
5. A magánkulcsról készíts titkosított offline biztonsági mentést. Ne küldd e-mailben, ne töltsd fel GitHubra, és ne tedd a telepítőbe.
6. A `src/license-public.pem` fájlt commitold a repóba, majd készíts új telepítőket. Az összes értékesített példánynak ugyanezt a nyilvános kulcsot kell tartalmaznia.

## Professional licenc kiadása
Futtasd:
```bash
npm run license:issue -- "Vásárló neve vagy cégnév" "vasarlo@example.com" professional
```
A program létrehoz egy `DocuFlow-professional-....json` fájlt. Ezt add át a vásárlónak. A vásárló a DocuFlow **Licenc** menüpontjában importálja.

## Korlátok
- A licenc korlátlan számú saját eszközön használható; nem eszközhöz kötött.
- Nincs lejárat és nincs online aktiválás.
- A licencfájl másolása technikailag nem akadályozható meg teljesen.
- Teljesen offline működés mellett távoli visszavonás nem lehetséges.
- Ha a kiadó elveszíti a magánkulcsot, a meglévő licencek tovább működnek, de új licenc nem állítható ki ugyanazzal a kulccsal.
- Ha a magánkulcs kompromittálódik, új kulcspárt és új telepítőverziót kell kiadni; a régi nyilvános kulccsal készült licencek kezelése külön migrációt igényel.

## Kiadás előtti kötelező ellenőrzés
Először tesztkulccsal, tesztvásárlóval és tesztgépen ellenőrizd a licenc kiadását, importját, hibás aláírás elutasítását, valamint az adatbázis-mentést és visszaállítást. Éles vásárlói adatot ne használj a teszteléshez.
