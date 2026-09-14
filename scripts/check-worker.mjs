import assert from "node:assert/strict";
import worker from "../deploy/worker.mjs";
let assetCalls=0;
const env={READER_USERNAME:"reader",READER_PASSWORD:"test-only-pass",
  ASSETS:{fetch:async()=>{assetCalls++;return new Response("private lesson");}}};
const request=(header)=>new Request("https://example.test/theory/catalog.json",{headers:header?{authorization:header}:{}});
assert.equal((await worker.fetch(request(),{})).status,503);
assert.equal((await worker.fetch(request(),env)).status,401);
assert.equal((await worker.fetch(request("Basic !!!"),env)).status,401);
assert.equal((await worker.fetch(request("Basic "+btoa("reader:wrong")),env)).status,401);
assert.equal(assetCalls,0,"Unauthenticated requests must never reach assets");
const valid=await worker.fetch(request("Basic "+btoa("reader:test-only-pass")),env);
assert.equal(valid.status,200);assert.equal(await valid.text(),"private lesson");
assert.equal(valid.headers.get("Cache-Control"),"private, no-store");
console.log("Private-reader auth and asset-access checks passed.");
