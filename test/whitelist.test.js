import assert from "node:assert/strict";
import { test } from "node:test";
import { challengeAnswer, pendingWord } from "../slskd-whitelist/index.js";

const PROVEIT =
  'ProveIt: To prove you are a human downloading these files, please type "download" in this chat to be added to my whitelist.';

test("reads the answer from each challenge format", () => {
  const cases = [
    [PROVEIT, "download"],
    ['ProveIt: please type "yellow" in this chat to verify that you are not a robot.', "yellow"],
    ['Please type the word "download" in this chat (without the quotes), to prove you are a human', "download"],
    ['To start your download respond with the keyword. The keyword is "download" (without the quotation marks).', "download"],
    ["To prove you are a human downloading these files, say > please daddy give it to me < in this chat to be added to my whitelist.", "please daddy give it to me"],
    ['Human check for your requested album "Bonobo - Black Sands Remixed". Reply only with this word / Antworte nur mit diesem Wort: REMIXED. Send !challenge to request a new one.', "REMIXED"],
    ["Hi! To download from me, reply to this message with the word: sparrow. Then retry your download.", "sparrow"],
  ];
  for (const [message, answer] of cases) assert.equal(challengeAnswer(message), answer, message);
});

test("leaves ordinary messages alone", () => {
  for (const message of [
    'just type "hello" lol',
    "Please share something before downloading anything from my own shares.",
    "ProveIt: You are verified. Please try your downloads again.",
  ]) {
    assert.equal(challengeAnswer(message), null, message);
  }
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
