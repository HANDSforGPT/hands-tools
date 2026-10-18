import fs from 'node:fs';
import crypto from 'node:crypto';
const dirs=fs.readdirSync('packages',{withFileTypes:true}).filter(x=>x.isDirectory()).map(x=>x.name).sort();
const tools=dirs.map(id=>{
 const file='packages/'+id+'/package.json',raw=fs.readFileSync(file),m=JSON.parse(raw).manifest;
 if(id!==m.id)throw Error('Tool folder differs from manifest ID');
 return {id:m.id,name:m.name,version:m.version,description:m.summary,category:m.category||'Community',author:m.author||'Community',
 url:'https://raw.githubusercontent.com/HANDSforGPT/hands-tools/main/'+file,sha256:crypto.createHash('sha256').update(raw).digest('hex')};
});
fs.writeFileSync('registry.json',JSON.stringify({schema:1,source:'HANDSforGPT/hands-tools',tools},null,2)+'\n');
console.log('Built tool index:',tools.length);
