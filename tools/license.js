#!/usr/bin/env node
// DocuFlow offline Ed25519 license issuer. Keep license-private.pem outside source control.
const fs=require('fs');const crypto=require('crypto');const path=require('path');
function canonical(v){if(Array.isArray(v))return '['+v.map(canonical).join(',')+']';if(v&&typeof v==='object')return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}';return JSON.stringify(v);}
const root=path.resolve(__dirname,'..'),privatePath=path.join(root,'license-private.pem'),publicPath=path.join(root,'src','license-public.pem');
const cmd=process.argv[2];
if(cmd==='generate'){
 if(fs.existsSync(privatePath)){console.error('A license-private.pem már létezik. Biztonsági okból nem írom felül.');process.exit(1);}
 const pair=crypto.generateKeyPairSync('ed25519');
 fs.writeFileSync(privatePath,pair.privateKey.export({type:'pkcs8',format:'pem'}),{mode:0o600});
 fs.writeFileSync(publicPath,pair.publicKey.export({type:'spki',format:'pem'}));
 console.log('Kulcspár elkészült. A license-private.pem fájlt offline, titkosított adathordozón tárold; SOHA ne töltsd fel GitHubra.');
 console.log('A src/license-public.pem nyilvános kulcsot commitold, majd építs új telepítőket.');
}else if(cmd==='issue'){
 if(!fs.existsSync(privatePath)){console.error('Hiányzik a license-private.pem. Előbb futtasd: npm run license:keys');process.exit(1);}
 const [customerName,email,edition='professional']=process.argv.slice(3);
 if(!customerName){console.error('Használat: npm run license:issue -- "Vásárló neve" email@example.com professional');process.exit(1);}
 if(edition!=='professional'){console.error('Jelenleg csak Professional licenc állítható ki ezzel az eszközzel.');process.exit(1);}
 const payload={product:'docuflow',licenseId:crypto.randomUUID(),customerName,email:email||'',edition,issuedAt:new Date().toISOString(),perpetual:true,offline:true,deviceLimit:0,versionEntitlement:'1.x'};
 const key=crypto.createPrivateKey(fs.readFileSync(privatePath));const signature=crypto.sign(null,Buffer.from(canonical(payload)),key).toString('base64');
 const output={payload,signature};const out=path.join(root,'DocuFlow-'+edition+'-'+payload.licenseId.slice(0,8)+'.json');
 fs.writeFileSync(out,JSON.stringify(output,null,2),{mode:0o600});console.log('Licenc elkészült: '+out);
}else{console.log('Parancsok: generate | issue');process.exit(cmd?1:0);}
