import test from 'node:test';
import assert from 'node:assert/strict';
import {parseArgs,runnerSpec,runHost,INSTANCE,homePath,locateLima} from './cli.mjs';

test('rejects unknown flags and duplicated approval flags',()=>{
 assert.throws(()=>parseArgs(['run','--unknown']),/Unknown flag/);
 assert.throws(()=>parseArgs(['run','--approve','--approve']),/Duplicate/);
 assert.throws(()=>parseArgs(['run','--cmd']),/Missing value/);
});
test('setup always creates a capped VM without host mounts',()=>{
 const args=runnerSpec('setup');
 assert.equal(args.includes('--vm-type'),true);
 assert.equal(args[args.indexOf('--vm-type')+1],'vz');
 assert.equal(args[args.indexOf('--disk')+1],'12');
 assert.ok(args.includes('--mount-none'));
 assert.ok(args.includes('--plain'));
 assert.ok(!args.includes('--mount-writable'));
 assert.ok(!args.includes('--mount'));
});
test('guest command remains an argument, not host-shell interpolation',()=>{
 const payload="echo safe; touch /tmp/guest-only";
 const a=runnerSpec('shell',{command:payload,seconds:11});
 assert.deepEqual(a.slice(-6),['/usr/bin/timeout','-k','3s','11s','/bin/sh','-lc',payload].slice(-6));
 assert.ok(!a.includes('sudo'));
});
test('only recognized lifecycle actions are allowed',()=>{
 assert.throws(()=>runnerSpec('delete'),/Unknown action/);
 assert.deepEqual(runnerSpec('stop').slice(-2),['stop',INSTANCE]);
});
test('process runner captures exit status and output',async()=>{
 const ok=await runHost(process.execPath,['-e',"process.stdout.write('ready')"],{timeoutMs:3000});
 assert.equal(ok.ok,true);assert.equal(ok.stdout,'ready');
 const err=await runHost(process.execPath,['-e','process.exit(9)'],{timeoutMs:3000});
 assert.equal(err.ok,false);assert.equal(err.exitCode,9);
});
test('root is explicitly on external disk by default',()=>{
 if(process.platform==='darwin' && !process.env.HANDS_SANDBOX_HOME) assert.match(homePath(),/^\/Volumes\//);
});
test('missing Lima is reported, never automatically installed',()=>{
 if(!process.env.HANDS_SANDBOX_LIMACTL) assert.ok(locateLima()===null||typeof locateLima()==='string');
});
