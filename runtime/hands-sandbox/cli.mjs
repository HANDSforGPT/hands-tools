#!/usr/bin/env node
/**
 * HANDS Sandbox Engine 0.1 — optional Lima/Apple Virtualization guest runner.
 * No host mounts, no native fallback. macOS Apple Silicon is the only implemented provider.
 * The guest DOES have outbound internet access by default: not an air-gapped sandbox.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

export const INSTANCE = 'hands-sandbox-1';
const MAX_TIMEOUT = 600;
const MIN_FREE = 6 * 2**30;
const MAX_OUTPUT = 256 * 1024;
const GUEST_CEILING_GIB = 12;
const ROOT_DEFAULT = '/Volumes/EMTEC X200E/HANDS/Sandbox Engine';
const VERSION = '0.1.0';

export function parseArgs(argv) {
  const flags = {};
  const boolean = new Set(['approve','network-aware','help']);
  for (let i = 1; i < argv.length; i++) {
    const part = argv[i];
    if (!part.startsWith('--')) throw new Error('Unexpected argument: '+part);
    const name = part.slice(2);
    if (!['approve','network-aware','help','cmd','timeout'].includes(name)) throw new Error('Unknown flag: '+part);
    if (Object.hasOwn(flags,name)) throw new Error('Duplicate flag: '+part);
    if (boolean.has(name)) flags[name] = true;
    else {
      if (i+1 >= argv.length || argv[i+1].startsWith('--')) throw new Error('Missing value for '+part);
      flags[name] = argv[++i];
    }
  }
  return {action:argv[0] || 'help', flags};
}
function fail(msg,code=2) {const err=new Error(msg);err.exitCode=code;throw err;}
function macSupported() {
  if (process.platform !== 'darwin' || process.arch !== 'arm64') return false;
  const [major,minor] = os.release().split('.').map(Number);
  return major>22 || (major===22 && minor>=6);
}
export function locateLima() {
  const explicit=process.env.HANDS_SANDBOX_LIMACTL;
  if (explicit) {
    if (!path.isAbsolute(explicit) || !fs.existsSync(explicit)) return null;
    return explicit;
  }
  const paths = (process.env.PATH||'').split(path.delimiter);
  for (const folder of paths) {
    if (!folder || !path.isAbsolute(folder)) continue;
    const p=path.join(folder,'limactl');
    try { fs.accessSync(p,fs.constants.X_OK); return p; } catch {}
  }
  return null;
}
export function homePath() {
  const chosen=process.env.HANDS_SANDBOX_HOME || (process.platform==='darwin'?ROOT_DEFAULT:'');
  if (!chosen || !path.isAbsolute(chosen)) fail('Set HANDS_SANDBOX_HOME to an absolute external-drive folder.');
  // This is intentionally macOS-only until equivalent Windows/Linux isolation is implemented.
  return path.resolve(chosen);
}
export function checkLocation(home,{create=false}={}) {
  const volume='/Volumes';
  const parent=path.dirname(home);
  const target=fs.existsSync(home)?fs.realpathSync(home):fs.existsSync(parent)?fs.realpathSync(parent):'';
  if (process.platform!=='darwin' || !target.startsWith(volume+'/'))
    fail('Refusing internal/unmounted storage; HANDS_SANDBOX_HOME must resolve to a mounted external /Volumes disk.');
  const parts=target.split(path.sep);
  const disk=path.join(volume,parts[2]||'');
  if (disk===volume || !fs.existsSync(disk)) fail('External volume is not mounted.');
  const info=spawnSync('/sbin/mount',[],{encoding:'utf8',timeout:3000});
  if (info.error || !info.stdout.split('\n').some(line=>line.includes(' on '+disk+' (')))
    fail('External volume not actually mounted; refusing fallback onto internal storage.');
  if (create) fs.mkdirSync(home,{recursive:true,mode:0o700});
  const stat=fs.statfsSync(fs.existsSync(home)?home:disk);
  return {path:home,volume:disk,freeBytes:Number(stat.bavail)*Number(stat.bsize)};
}
function envFor(home) {
  return {...process.env,LIMA_HOME:path.join(home,'lima'),XDG_CACHE_HOME:path.join(home,'cache'),TMPDIR:path.join(home,'tmp')+path.sep};
}
function prepare(home) {
  const space=checkLocation(home,{create:true});
  for (const p of ['lima','cache','tmp']) fs.mkdirSync(path.join(home,p),{recursive:true,mode:0o700});
  return space;
}
export function runnerSpec(action,{name=INSTANCE,command,seconds=60}={}) {
  const base=['--tty=false'];
  if (action==='list') return [...base,'list','--json'];
  if (action==='setup') return [...base,'create','--name',name,'--vm-type','vz','--cpus','2','--memory','2','--disk',String(GUEST_CEILING_GIB),'--mount-none','--containerd','none','--plain','template:default'];
  if (action==='start') return [...base,'start',name];
  if (action==='stop') return [...base,'stop',name];
  if (action==='shell') {
    // Linux timeout terminates the process IN THE GUEST; host timeout is a secondary safeguard.
    return [...base,'shell',name,'--','/usr/bin/timeout','-k','3s',String(seconds)+'s','/bin/sh','-lc',command];
  }
  throw Error('Unknown action');
}
function lock(home) {
  const p=path.join(home,'operation.lock');
  try {
    const fd=fs.openSync(p,'wx',0o600);
    fs.writeSync(fd,JSON.stringify({pid:process.pid,time:Date.now()}));
    fs.closeSync(fd);
  } catch(e) {
    if(e.code!=='EEXIST') throw e;
    fail('Another operation may be active. Check '+p+' manually before removing a stale lock.');
  }
  return () => {try {fs.unlinkSync(p);} catch {}};
}
export function runHost(executable,args,{env,timeoutMs=30000}={}) {
  return new Promise((resolve,reject)=>{
    const child=spawn(executable,args,{env:env||process.env,stdio:['ignore','pipe','pipe'],shell:false});
    let stdout='',stderr='',truncated=false,settled=false,timedOut=false;
    const append=(key,chunk)=>{
      const data=chunk.toString('utf8');
      if (key==='stdout') {
        if(stdout.length<MAX_OUTPUT) stdout+=data.slice(0,MAX_OUTPUT-stdout.length);
        else truncated=true;
      } else {
        if(stderr.length<MAX_OUTPUT) stderr+=data.slice(0,MAX_OUTPUT-stderr.length);
        else truncated=true;
      }
    };
    const timer=setTimeout(()=>{timedOut=true;child.kill('SIGTERM');},timeoutMs);
    child.stdout.on('data',c=>append('stdout',c));
    child.stderr.on('data',c=>append('stderr',c));
    child.on('error',err=>{if(settled)return;settled=true;clearTimeout(timer);reject(err);});
    child.on('close',(code,signal)=>{
      if(settled)return;settled=true;clearTimeout(timer);
      resolve({ok:code===0&&!timedOut,exitCode:code,signal,timedOut,stdout,stderr,truncated});
    });
  });
}
function output(payload){console.log(JSON.stringify(payload,null,2));}
function requireApproval(flags) {
  if (!flags.approve) fail('Explicit --approve flag required. HANDS terminal local approval is ALSO required.');
}
function requireBackend() {
  if(!macSupported()) fail('No supported isolation provider for this OS. Only macOS Apple Silicon 13.5+ is supported.');
  const bin=locateLima();
  if(!bin) fail('Lima not installed. No VM was created. Install Lima only with user approval.');
  return bin;
}
async function main() {
  const {action,flags}=parseArgs(process.argv.slice(2));
  if (action==='help'||flags.help) {
    console.log('HANDS Sandbox Engine '+VERSION+'\nCommands: doctor | status | setup --approve | run --approve --network-aware --cmd "..." [--timeout 60] | stop --approve\nUses external disk; network enabled in VM; no host mounts; no automatic Linux image downloads.');
    return;
  }
  if (!['doctor','status','setup','run','stop'].includes(action)) fail('Unknown command '+action);
  const home=homePath();
  const supported=macSupported();
  const lima=locateLima();
  let location;
  try {location=checkLocation(home);} catch(e) {
    if(action==='doctor'||action==='status') {
      output({ok:false,action,version:VERSION,platform:process.platform,arch:process.arch,supported,limaInstalled:!!lima,storage:home,error:e.message});
      process.exitCode=1;return;
    }
    throw e;
  }
  if(action==='doctor') {
    output({ok:supported&&!!lima&&location.freeBytes>=MIN_FREE,action,version:VERSION,provider:supported?'lima-vz':'unsupported',limaInstalled:!!lima,root:location.path,freeGiB:+(location.freeBytes/2**30).toFixed(2),minimumSetupGiB:6,networkIsolation:false,noHostMounts:true,diskCeilingGiB:GUEST_CEILING_GIB,
      note:!lima?'Install Lima separately with approval; do not download VM yet.': 'Preflight complete; VM not installed by doctor.'});
    return;
  }
  const bin=requireBackend();
  const env=envFor(home);
  if(action==='status') {
    const result=await runHost(bin,runnerSpec('list'),{env,timeoutMs:10000});
    output({action,version:VERSION,root:home,networkIsolation:false,result});
    if(!result.ok) process.exitCode=1;
    return;
  }
  requireApproval(flags);
  if(action==='run'&&!flags['network-aware'])
    fail('The guest has outbound networking. Pass --network-aware only after explicitly accepting this limitation.');
  const available=prepare(home);
  const unlock=lock(home);
  try {
    if (action==='setup') {
      if (available.freeBytes<MIN_FREE) fail('External disk needs at least 6 GiB available before provisioning.');
      const existing=await runHost(bin,runnerSpec('list'),{env,timeoutMs:10000});
      if (!existing.ok) fail('Unable to list existing Lima machines: '+existing.stderr);
      if(existing.stdout.includes(INSTANCE)) fail('Sandbox instance already exists; use status.');
      const result=await runHost(bin,runnerSpec('setup'),{env,timeoutMs:600000});
      output({action,version:VERSION,result,storage:home,note:'This may download Linux; VM not automatically started. No host mounts.'});
      if(!result.ok) process.exitCode=1;
    } else if(action==='stop') {
      const result=await runHost(bin,runnerSpec('stop'),{env,timeoutMs:60000});
      output({action,result});if(!result.ok)process.exitCode=1;
    } else if(action==='run') {
      const command=flags.cmd;
      if(typeof command!=='string'||!command.trim()||command.length>4000||command.includes('\0')) fail('Provide a guest --cmd of 1–4000 characters.');
      const seconds=flags.timeout===undefined?60:Number(flags.timeout);
      if(!Number.isInteger(seconds)||seconds<1||seconds>MAX_TIMEOUT) fail('Timeout must be between 1 and '+MAX_TIMEOUT+' seconds.');
      const instances=await runHost(bin,runnerSpec('list'),{env,timeoutMs:10000});
      if(!instances.ok||!instances.stdout.includes(INSTANCE)) fail('Sandbox VM not provisioned. Run setup --approve first.');
      let startResult,commandResult,stopResult;
      try {
        startResult=await runHost(bin,runnerSpec('start'),{env,timeoutMs:180000});
        if(!startResult.ok) fail('VM did not start: '+startResult.stderr);
        commandResult=await runHost(bin,runnerSpec('shell',{command,seconds}),{env,timeoutMs:(seconds+15)*1000});
      } finally {
        stopResult=await runHost(bin,runnerSpec('stop'),{env,timeoutMs:90000}).catch(e=>({ok:false,error:e.message}));
      }
      output({action,result:commandResult,vmStopped:!!stopResult?.ok,stop:stopResult,storage:home,warning:'Guest had outbound network; host filesystem was not mounted.'});
      if(!commandResult?.ok||!stopResult?.ok)process.exitCode=1;
    }
  } finally {unlock();}
}
if(process.argv[1]&&path.resolve(process.argv[1])===decodeURI(new URL(import.meta.url).pathname)) {
  main().catch(e=>{console.error(JSON.stringify({ok:false,error:e.message}));process.exitCode=e.exitCode||1;});
}
