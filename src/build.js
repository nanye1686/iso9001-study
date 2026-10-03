const fs = require('fs');
const path = require('path');
const SRC = __dirname;
const OUT = path.join(__dirname, '..', 'iso9001-quiz.html');

const FILES = ['bank-single.js','bank-multi.js','bank-judge.js','bank-blank.js','bank-case.js','bank-short.js','bank-term.js','bank-v2026.js'];
const VARS  = ['BANK_SINGLE','BANK_MULTI','BANK_JUDGE','BANK_BLANK','BANK_CASE','BANK_SHORT','BANK_TERM','BANK_V2026'];
const NAMES = ['SINGLE','MULTI','JUDGE','BLANK','CASE','SHORT','TERM','V2026'];

const banks = FILES.map(f => '/* ===== ' + f + ' ===== */\n' + fs.readFileSync(path.join(SRC, f), 'utf8').trim());
const bankCode = banks.join('\n\n');
const tpl = fs.readFileSync(path.join(SRC, 'app-template.html'), 'utf8');
if (!tpl.includes('/*__BANK_DATA__*/')) throw new Error('placeholder not found');
const html = tpl.replace('/*__BANK_DATA__*/', bankCode);
fs.writeFileSync(OUT, html, 'utf8');
console.log('Wrote', OUT, (Buffer.byteLength(html,'utf8')/1024).toFixed(1)+' KB');

const res = new Function(bankCode + '\nreturn ['+VARS.join(',')+'].map(function(a){return a.length;});')();
let total = 0;
res.forEach((v,i)=>{ console.log(NAMES[i]+':', v); total+=v; });
console.log('TOTAL:', total);

new Function(bankCode + '\nvar m={}; ['+VARS.join(',')+'].forEach(function(a){a.forEach(function(q){ if(m[q.id]) throw new Error("重复ID: "+q.id); m[q.id]=1; });}); return true;')();
console.log('ID 唯一性: OK');
