import fs from 'node:fs';
import crypto from 'node:crypto';
const index=JSON.parse(fs.readFileSync('registry.json','utf8'));const seen=new Set();
for(const row of index.tools){
 if(!/^[a-z][a-z0-9-]{2,49}$/.test(row.id)||seen.has(row.id))throw Error('Invalid or duplicate ID');
 seen.add(row.id);
 const file='packages/'+row.id+'/package.json',raw=fs.readFileSync(file),pkg=JSON.parse(raw),m=pkg.manifest;
 if(raw.length>65536||m.schema!==1||m.id!==row.id||m.name!==row.name||m.version!==row.version)throw Error('Invalid package '+row.id);
 if(!Array.isArray(m.requires)||m.requires.length>28||!m.requires.every(x=>/^hands_[a-z0-9_]+$/.test(x)))throw Error('Invalid commands '+row.id);
 if(typeof pkg.instructions!=='string'||pkg.instructions.length>12000||!Array.isArray(pkg.recipes))throw Error('Invalid content '+row.id);
 const digest=crypto.createHash('sha256').update(raw).digest('hex');
 if(digest!==row.sha256)throw Error('Registry hash mismatch '+row.id);
 if(row.url!=='https://raw.githubusercontent.com/HANDSforGPT/hands-tools/main/'+file)throw Error('Bad package URL');
}
console.log('VALID:',seen.size,'tool packages');
