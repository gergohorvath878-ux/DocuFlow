const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const PDFDocument = require('pdfkit');
const crypto = require('crypto');

let db;
let mainWindow;
const LICENSE_PUBLIC_KEY = (()=>{try{return fs.readFileSync(path.join(__dirname,'license-public.pem'),'utf8');}catch{return '';}})();

function initDatabase() {
  const dataDir = app.getPath('userData');
  fs.mkdirSync(dataDir, { recursive: true });
  db = new Database(path.join(dataDir, 'docuflow.sqlite'));
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
      email TEXT DEFAULT '', phone TEXT DEFAULT '', tax_number TEXT DEFAULT '',
      address TEXT DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT, number TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL, title TEXT NOT NULL, customer_id INTEGER,
      issue_date TEXT NOT NULL, due_date TEXT DEFAULT '',
      currency TEXT NOT NULL DEFAULT 'HUF', status TEXT NOT NULL DEFAULT 'draft',
      notes TEXT DEFAULT '', content TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE SET NULL
    );
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT, document_id INTEGER NOT NULL,
      description TEXT NOT NULL, quantity REAL NOT NULL DEFAULT 1,
      unit TEXT NOT NULL DEFAULT 'db', unit_price REAL NOT NULL DEFAULT 0,
      vat_rate REAL NOT NULL DEFAULT 27,
      FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS company_profile (id INTEGER PRIMARY KEY CHECK(id=1), name TEXT DEFAULT '', contact TEXT DEFAULT '', email TEXT DEFAULT '', phone TEXT DEFAULT '', address TEXT DEFAULT '', tax_number TEXT DEFAULT '', website TEXT DEFAULT '', accent_color TEXT DEFAULT '#4169e1', footer_text TEXT DEFAULT '', logo_path TEXT DEFAULT '', logo_data TEXT DEFAULT '');
    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'custom', body TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  const companyCols=db.prepare('PRAGMA table_info(company_profile)').all().map(c=>c.name);
  if(!companyCols.includes('logo_data')) db.exec("ALTER TABLE company_profile ADD COLUMN logo_data TEXT DEFAULT ''");
  const cols=db.prepare('PRAGMA table_info(documents)').all().map(c=>c.name);
  if(!cols.includes('content')) db.exec("ALTER TABLE documents ADD COLUMN content TEXT NOT NULL DEFAULT ''");
  if(db.prepare('SELECT COUNT(*) n FROM templates').get().n===0){
    const seed=db.prepare('INSERT INTO templates(name,type,body) VALUES(?,?,?)');
    seed.run('Árajánlat – alap','Árajánlat','Tisztelt {{customer_name}}!\n\nKöszönjük megkeresését. Ajánlatunk részletei: \n\nAjánlati összeg: {{total}}\nAjánlat kelte: {{issue_date}}\nÉrvényesség: {{due_date}}\n\nA minta nem minősül számlának vagy automatikusan kötelező erejű szerződésnek.');
    seed.run('Megrendelőlap – alap','Megrendelőlap','Megrendelő: {{customer_name}}\nCím: {{customer_address}}\nMegrendelés dátuma: {{issue_date}}\n\nMegrendelt tételek:\n{{items}}\n\nBecsült összeg: {{total}}');
    seed.run('Szerződéstervezet – alap','Szerződéstervezet','SZERZŐDÉSTERVEZET\n\nFelek: {{company_name}} és {{customer_name}}\n\nA megállapodás tárgya: [részletes leírás]\nTeljesítési határidő: {{due_date}}\nDíjazás: {{total}}\n\nEgyedi feltételek: [kitöltendő]\n\nEz szerkeszthető tervezet, jogi ellenőrzés nélkül nem tekinthető végleges szerződésnek.');
    seed.run('Teljesítésigazolás – alap','Teljesítésigazolás','TELJESÍTÉSIGAZOLÁS – MINTA\n\nMegrendelő: {{customer_name}}\nSzolgáltató: {{company_name}}\nTeljesítés dátuma: {{issue_date}}\n\nElvégzett munka: [kitöltendő]\nMegjegyzések: [kitöltendő]\n\nMegrendelő aláírása: ____________________\nSzolgáltató aláírása: ____________________');
    seed.run('Átadás-átvételi jegyzőkönyv – alap','Átadás-átvételi jegyzőkönyv','ÁTADÁS-ÁTVÉTELI JEGYZŐKÖNYV – MINTA\n\nÁtadó: {{company_name}}\nÁtvevő: {{customer_name}}\nDátum: {{issue_date}}\n\nÁtadott eszköz / munka / dokumentum: [kitöltendő]\nÁllapot és megjegyzések: [kitöltendő]\n\nÁtadó aláírása: ____________________\nÁtvevő aláírása: ____________________');
  }
}
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1320, height: 860, minWidth: 980, minHeight: 680,
    backgroundColor: '#f4f6fa',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}
function canonical(value){if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';return JSON.stringify(value);}
function verifyLicenseObject(obj){try{if(!LICENSE_PUBLIC_KEY||!obj||!obj.payload||!obj.signature)return false;const p=obj.payload;if(p.product!=='docuflow'||p.edition!=='professional'||p.perpetual!==true||p.offline!==true||p.deviceLimit!==0)return false;const key=crypto.createPublicKey(LICENSE_PUBLIC_KEY);return crypto.verify(null,Buffer.from(canonical(p)),key,Buffer.from(obj.signature,'base64'));}catch{return false;}}
function currentLicense(){try{const file=path.join(app.getPath('userData'),'license.json');return verifyLicenseObject(JSON.parse(fs.readFileSync(file,'utf8')));}catch{return false;}}
function safeText(value, max = 5000) { return String(value ?? '').trim().slice(0, max); }

ipcMain.handle('license:status',()=>({professional:currentLicense(),edition:currentLicense()?'professional':'standard'}));
ipcMain.handle('license:import',async()=>{const r=await dialog.showOpenDialog(mainWindow,{title:'DocuFlow licenc importálása',properties:['openFile'],filters:[{name:'DocuFlow licenc',extensions:['json']}]});if(r.canceled||!r.filePaths[0])return null;let obj;try{obj=JSON.parse(fs.readFileSync(r.filePaths[0],'utf8'));}catch{throw new Error('A licencfájl formátuma hibás.');}if(!verifyLicenseObject(obj))throw new Error('A licenc aláírása érvénytelen, vagy a kiadói kulcs nincs beállítva.');fs.copyFileSync(r.filePaths[0],path.join(app.getPath('userData'),'license.json'));return true;});
ipcMain.handle('company:get',()=>db.prepare('SELECT * FROM company_profile WHERE id=1').get()||{name:'',contact:'',email:'',phone:'',address:'',tax_number:'',website:'',accent_color:'#4169e1',footer_text:'',logo_path:'',logo_data:''});
ipcMain.handle('company:save',(_,data)=>{const d=data||{};const v=[safeText(d.name,250),safeText(d.contact,250),safeText(d.email,250),safeText(d.phone,80),safeText(d.address,1000),safeText(d.tax_number,80),safeText(d.website,250),/^#[0-9a-fA-F]{6}$/.test(d.accent_color)?d.accent_color:'#4169e1',safeText(d.footer_text,500)];db.prepare("INSERT INTO company_profile(id,name,contact,email,phone,address,tax_number,website,accent_color,footer_text) VALUES(1,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,contact=excluded.contact,email=excluded.email,phone=excluded.phone,address=excluded.address,tax_number=excluded.tax_number,website=excluded.website,accent_color=excluded.accent_color,footer_text=excluded.footer_text").run(...v);return true;});
ipcMain.handle('company:choose-logo',async()=>{const r=await dialog.showOpenDialog(mainWindow,{title:'Céges logó kiválasztása',properties:['openFile'],filters:[{name:'Képfájlok',extensions:['png','jpg','jpeg']}]});if(r.canceled||!r.filePaths[0])return null;const stat=fs.statSync(r.filePaths[0]);if(stat.size>5*1024*1024)throw new Error('A logó legfeljebb 5 MB lehet.');const ext=path.extname(r.filePaths[0]).toLowerCase(),mime=ext==='.png'?'image/png':'image/jpeg',data=fs.readFileSync(r.filePaths[0]).toString('base64');db.prepare("INSERT INTO company_profile(id,logo_path,logo_data) VALUES(1,'',?) ON CONFLICT(id) DO UPDATE SET logo_path='',logo_data=excluded.logo_data").run(mime+';base64,'+data);return 'data:'+mime+';base64,'+data;});
ipcMain.handle('company:remove-logo',()=>{db.prepare("INSERT INTO company_profile(id,logo_path,logo_data) VALUES(1,'','') ON CONFLICT(id) DO UPDATE SET logo_path='',logo_data=''").run();return true;});
ipcMain.handle('dashboard:get', () => ({
  customers: db.prepare('SELECT COUNT(*) n FROM customers').get().n,
  documents: db.prepare('SELECT COUNT(*) n FROM documents').get().n,
  drafts: db.prepare("SELECT COUNT(*) n FROM documents WHERE status='draft'").get().n,
  recent: db.prepare('SELECT d.*, c.name customer_name FROM documents d LEFT JOIN customers c ON c.id=d.customer_id ORDER BY d.id DESC LIMIT 8').all()
}));
ipcMain.handle('customers:list', () => db.prepare('SELECT * FROM customers ORDER BY name COLLATE NOCASE').all());
ipcMain.handle('customers:save', (_, data) => {
  const d=data||{}, values=[safeText(d.name,250),safeText(d.email,250),safeText(d.phone,80),safeText(d.tax_number,80),safeText(d.address,1000)];
  if(!values[0]) throw new Error('Az ügyfél neve kötelező.');
  if(d.id){db.prepare('UPDATE customers SET name=?,email=?,phone=?,tax_number=?,address=? WHERE id=?').run(...values,Number(d.id));return Number(d.id);}
  return db.prepare('INSERT INTO customers(name,email,phone,tax_number,address) VALUES(?,?,?,?,?)').run(...values).lastInsertRowid;
});
ipcMain.handle('customers:delete',(_,id)=>db.prepare('DELETE FROM customers WHERE id=?').run(Number(id)).changes);
ipcMain.handle('documents:list',()=>db.prepare(`
 SELECT d.*,c.name customer_name,
 COALESCE((SELECT SUM(i.quantity*i.unit_price*(1+i.vat_rate/100)) FROM items i WHERE i.document_id=d.id),0) total
 FROM documents d LEFT JOIN customers c ON c.id=d.customer_id ORDER BY d.id DESC
`).all());
ipcMain.handle('documents:get',(_,id)=>{
 const d=db.prepare('SELECT d.*,c.name customer_name,c.address customer_address,c.email customer_email,c.tax_number customer_tax FROM documents d LEFT JOIN customers c ON c.id=d.customer_id WHERE d.id=?').get(Number(id));
 if(!d)return null; d.items=db.prepare('SELECT * FROM items WHERE document_id=? ORDER BY id').all(Number(id)); return d;
});
ipcMain.handle('documents:save',(_,data)=>{
 const d=data||{},title=safeText(d.title,250); if(!title)throw new Error('A dokumentum címe kötelező.');
 const type=safeText(d.type,80)||'Egyéb',issueDate=safeText(d.issue_date,20)||new Date().toISOString().slice(0,10);
 const currency=safeText(d.currency,8)||'HUF',items=Array.isArray(d.items)?d.items.slice(0,100):[];
 return db.transaction(()=>{
  let id=Number(d.id||0);
  if(id){db.prepare('UPDATE documents SET type=?,title=?,customer_id=?,issue_date=?,due_date=?,currency=?,status=?,notes=?,content=? WHERE id=?').run(type,title,d.customer_id?Number(d.customer_id):null,issueDate,safeText(d.due_date,20),currency,safeText(d.status,30)||'draft',safeText(d.notes,5000),safeText(d.content,20000),id);db.prepare('DELETE FROM items WHERE document_id=?').run(id);}
  else {const number=`DF-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;id=db.prepare('INSERT INTO documents(number,type,title,customer_id,issue_date,due_date,currency,status,notes,content) VALUES(?,?,?,?,?,?,?,?,?,?)').run(number,type,title,d.customer_id?Number(d.customer_id):null,issueDate,safeText(d.due_date,20),currency,safeText(d.status,30)||'draft',safeText(d.notes,5000),safeText(d.content,20000)).lastInsertRowid;}
  const insert=db.prepare('INSERT INTO items(document_id,description,quantity,unit,unit_price,vat_rate) VALUES(?,?,?,?,?,?)');
  for(const item of items){const desc=safeText(item.description,500);if(desc)insert.run(id,desc,Math.max(0,Number(item.quantity)||0),safeText(item.unit,20)||'db',Math.max(0,Number(item.unit_price)||0),Math.max(0,Number(item.vat_rate)||0));}
  return id;
 })();
});
ipcMain.handle('documents:delete',(_,id)=>db.prepare('DELETE FROM documents WHERE id=?').run(Number(id)).changes);
ipcMain.handle('templates:list',()=>db.prepare('SELECT * FROM templates ORDER BY name').all());
ipcMain.handle('templates:save',(_,d)=>{ if(!currentLicense())throw new Error('Saját sablon létrehozása és módosítása Professional licencet igényel.');
 const name=safeText(d?.name,200),type=safeText(d?.type,80)||'custom',body=safeText(d?.body,10000);
 if(!name)throw new Error('A sablon neve kötelező.');
 if(d.id){db.prepare('UPDATE templates SET name=?,type=?,body=? WHERE id=?').run(name,type,body,Number(d.id));return Number(d.id);}
 return db.prepare('INSERT INTO templates(name,type,body) VALUES(?,?,?)').run(name,type,body).lastInsertRowid;
});
ipcMain.handle('templates:delete',(_,id)=>{if(!currentLicense())throw new Error('Saját sablon törlése Professional licencet igényel.');return db.prepare('DELETE FROM templates WHERE id=?').run(Number(id)).changes;});
function money(n,c){try{return new Intl.NumberFormat('hu-HU',{style:'currency',currency:c}).format(n);}catch{return `${Number(n).toFixed(2)} ${c}`;}}
ipcMain.handle('documents:pdf',async(_,id)=>{
 const d=db.prepare('SELECT d.*,c.name customer_name,c.address customer_address,c.email customer_email,c.tax_number customer_tax FROM documents d LEFT JOIN customers c ON c.id=d.customer_id WHERE d.id=?').get(Number(id));if(!d)throw new Error('A dokumentum nem található.');
 const items=db.prepare('SELECT * FROM items WHERE document_id=?').all(Number(id)),company=db.prepare('SELECT * FROM company_profile WHERE id=1').get()||{};
 const itemText=items.map(x=>x.description+' — '+x.quantity+' '+x.unit+' × '+money(x.unit_price,d.currency)).join('\n'),gross=items.reduce((sum,x)=>sum+x.quantity*x.unit_price*(1+x.vat_rate/100),0);
 const tokens={company_name:company.name||'DocuFlow',customer_name:d.customer_name||'',customer_address:d.customer_address||'',document_title:d.title||'',document_number:d.number||'',issue_date:d.issue_date||'',due_date:d.due_date||'',items:itemText,total:money(gross,d.currency)};
 const renderedContent=String(d.content||'').replace(/\{\{([a-z_]+)\}\}/gi,(m,k)=>tokens[k.toLowerCase()]??m);
 const r=await dialog.showSaveDialog(mainWindow,{title:'PDF mentése',defaultPath:d.number+'.pdf',filters:[{name:'PDF dokumentum',extensions:['pdf']}]});if(r.canceled||!r.filePath)return null;
 await new Promise((resolve,reject)=>{const doc=new PDFDocument({size:'A4',margin:48}),stream=fs.createWriteStream(r.filePath);doc.pipe(stream);
 const fontCandidates=process.platform==='win32'?['C:/Windows/Fonts/arial.ttf','C:/Windows/Fonts/calibri.ttf']:process.platform==='darwin'?['/System/Library/Fonts/Supplemental/Arial.ttf','/System/Library/Fonts/Supplemental/Helvetica.ttf']:['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf'];
 const fontPath=[path.join(process.resourcesPath||__dirname,'assets','DejaVuSans.ttf'),...fontCandidates].find(p=>fs.existsSync(p));if(fontPath)doc.font(fontPath);else doc.font('Helvetica');
 const accent=/^#[0-9a-fA-F]{6}$/.test(company.accent_color)?company.accent_color:'#4169e1';
 const logoData=company.logo_data||'';const logoBuffer=logoData.includes(';base64,')?Buffer.from(logoData.split(';base64,')[1],'base64'):null;if(logoBuffer){try{doc.image(logoBuffer,48,38,{fit:[90,55]});}catch{}}
 const bx=logoBuffer?155:48;doc.fillColor('#17233c').fontSize(16).text(company.name||'DocuFlow',bx,42,{width:350});
 const lines=[company.contact,company.address,company.email,company.phone,company.website,company.tax_number?'Adószám: '+company.tax_number:''].filter(Boolean);doc.fillColor('#667085').fontSize(8);if(lines.length)doc.text(lines.join('  |  '),bx,64,{width:380});
 doc.moveTo(48,112).lineTo(547,112).strokeColor(accent).lineWidth(2).stroke();doc.moveDown(3);doc.fillColor('#17233c').fontSize(21).text(d.title,{width:500});doc.moveDown(.6);doc.fillColor('#667085').fontSize(9);
 doc.text('Dokumentumszám: '+d.number);doc.text('Típus: '+d.type);doc.text('Dátum: '+d.issue_date);if(d.due_date)doc.text('Határidő / érvényesség: '+d.due_date);
 doc.moveDown();doc.fillColor('#17233c').fontSize(11).text('Ügyfél');doc.fillColor('#566176').fontSize(9);doc.text(d.customer_name||'Nincs megadva');if(d.customer_address)doc.text(d.customer_address);if(d.customer_email)doc.text(d.customer_email);if(d.customer_tax)doc.text('Adószám: '+d.customer_tax);
 doc.moveDown();let net=0,vat=0;doc.fillColor('#17233c').fontSize(9).text('TÉTELEK');doc.moveDown(.5);
 for(const item of items){const n=item.quantity*item.unit_price,v=n*item.vat_rate/100;net+=n;vat+=v;doc.fillColor('#26334d').fontSize(9).text(item.description,{width:260});doc.fillColor('#667085').text(item.quantity+' '+item.unit+' × '+money(item.unit_price,d.currency)+' + '+item.vat_rate+'% ÁFA',{align:'right'});doc.fillColor(accent).text(money(n+v,d.currency),{align:'right'});doc.moveDown(.5);}
 doc.moveDown();doc.fillColor('#667085').fontSize(9).text('Nettó összesen: '+money(net,d.currency),{align:'right'});doc.text('ÁFA összesen: '+money(vat,d.currency),{align:'right'});doc.fillColor('#17233c').fontSize(14).text('Bruttó összesen: '+money(net+vat,d.currency),{align:'right'});
 if(renderedContent){doc.moveDown(1.5);doc.fillColor('#17233c').fontSize(11).text('Dokumentum szövege');doc.moveDown(.4);doc.fillColor('#344054').fontSize(9).text(renderedContent,{width:499,lineGap:3});}
 if(d.notes){doc.moveDown();doc.fillColor('#667085').fontSize(9).text('Megjegyzés: '+d.notes,{width:499});}if(company.footer_text){doc.moveDown(2);doc.fillColor('#667085').fontSize(8).text(company.footer_text,{align:'center',width:499});}
 doc.end();stream.on('finish',resolve);stream.on('error',reject);});return r.filePath;
});
ipcMain.handle('backup:export',async()=>{
 const {canceled,filePath}=await dialog.showSaveDialog(mainWindow,{title:'Adatbázis mentése',defaultPath:`DocuFlow-backup-${new Date().toISOString().slice(0,10)}.sqlite`,filters:[{name:'SQLite adatbázis',extensions:['sqlite']}]});
 if(canceled||!filePath)return null;db.pragma('wal_checkpoint(FULL)');fs.copyFileSync(path.join(app.getPath('userData'),'docuflow.sqlite'),filePath);return filePath;
});
ipcMain.handle('backup:import',async()=>{
 const result=await dialog.showOpenDialog(mainWindow,{title:'Biztonsági mentés visszaállítása',properties:['openFile'],filters:[{name:'SQLite adatbázis',extensions:['sqlite']}]});
 if(result.canceled||!result.filePaths[0])return null;
 const answer=await dialog.showMessageBox(mainWindow,{type:'warning',buttons:['Mégse','Visszaállítás'],defaultId:0,cancelId:0,message:'A visszaállítás felülírja a jelenlegi DocuFlow adatokat. Folytatod?'});
 if(answer.response!==1)return null;db.close();fs.copyFileSync(result.filePaths[0],path.join(app.getPath('userData'),'docuflow.sqlite'));app.relaunch();app.exit(0);return true;
});
app.whenReady().then(()=>{initDatabase();createWindow();});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
app.on('before-quit',()=>{try{if(db?.open)db.close();}catch{}});
