import assert from "node:assert/strict";
import { test } from "node:test";
import { pendingWord, whitelistWord } from "../slskd-whitelist/index.js";

const PROVEIT =
  'ProveIt: To prove you are a human downloading these files, please type "download" in this chat to be added to my whitelist.';

test("reads the word from whitelist prompts only", () => {
  assert.equal(whitelistWord(PROVEIT), "download");
  assert.equal(whitelistWord("Type “banana” to join my whitelist"), "banana");
  assert.equal(whitelistWord('type "download" to get my files'), null);
  assert.equal(whitelistWord('whitelist: type "two words" here'), null);
  assert.equal(whitelistWord("hey, thanks for sharing"), null);
});

const at = (minutes) => new Date(Date.UTC(2026, 10, 21, 12, minutes)).toISOString();
const since = Date.UTC(2026, 10, 21, 0, 0);

test("answers a prompt once, and again when it asks again", () => {
  const prompt = { direction: "In", message: PROVEIT, timestamp: at(0) };
  const answer = { direction: "Out", message: "download", timestamp: at(5) };
  const again = { direction: "In", message: PROVEIT, timestamp: at(10) };

  assert.equal(pendingWord([prompt], since), "download");
  assert.equal(pendingWord([answer, prompt], since), null);
  assert.equal(pendingWord([prompt, answer, again], since), "download");
});

test("leaves stale prompts alone", () => {
  const old = { direction: "In", message: PROVEIT, timestamp: "2026-11-19T12:00:00" };
  assert.equal(pendingWord([old], since), null);
});
