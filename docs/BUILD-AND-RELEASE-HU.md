# Build és kiadási folyamat

A GitHub Actions workflow négy célra készít csomagot:
- Windows x64: NSIS .exe
- macOS Intel x64: .dmg
- macOS Apple Silicon arm64: .dmg
- Linux x64: .AppImage és .deb

## Indítás
1. Engedélyezd a repository Actions funkcióját.
2. Az Actions oldalon indítsd el a Build DocuFlow installers workflow-t, vagy pusholj v1.0.0 formátumú taget.
3. Sikeres build után a csomagok letölthetők az Artifacts részből. Tag esetén a GitHub Release-hez is csatolódnak.

## Aláírás
A workflow aláírás nélküli telepítőket készít. Nyilvános terjesztéshez Windows Authenticode tanúsítvány, illetve Apple Developer ID és notarizáció ajánlott. Titkos kulcsokat GitHub Actions Secrets formájában kell megadni.

## Kiadás előtti ellenőrzés
A TEST-PLAN-HU.md ellenőrzőlistáját minden célplatformon végre kell hajtani. A sikeres CI build önmagában nem bizonyítja a teljes funkcionális helyességet. A kiadási workflow a `main` ágra pusholt commitokra is lefut; a `v*` tag a GitHub Release-hez csatolja a telepítőket.

## Licenckulcs
A `npm run license:keys` parancsot kizárólag a kiadó futtassa. A `license-private.pem` titkos kulcsot soha ne töltsd fel a repóba vagy a build artefaktumba. A generált `src/license-public.pem` nyilvános kulcsot commitold, majd építs új kiadást. A magánkulcs elvesztése vagy kompromittálódása licencmigrációt igényel.
