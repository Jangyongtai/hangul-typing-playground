// 한글 조합기 테스트: node tests/hangul.test.mjs
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx = { console };
ctx.globalThis = ctx;
vm.createContext(ctx);
for (const f of ['config', 'hangul', 'data', 'data-stories']) vm.runInContext(readFileSync(new URL(`../src/js/${f}.js`, import.meta.url), 'utf8'), ctx);
const HT = ctx.HT;

function type(keys) {
  const h = new HT.Hangul();
  for (const k of keys) { if (k === ' ') h.space(); else if (k === '<') h.backspace(); else h.input(k); }
  return h.value;
}
const cases = [
  ['ㄱㅏ', '가'], ['ㄱㅏㄱ', '각'], ['ㄱㅏㄱㅏ', '가가'], ['ㅅㅏㄱㅗㅏ', '사과'], ['ㄱㅗㅐㄴㅊㅏㄴㅎㅇㅏ', '괜찮아'],
  ['ㅇㅣㄹㄱㅇㅓ', '읽어'], ['ㅇㅣㄹㄱㅓ', '일거'], ['ㅇㅏㄴㄴㅕㅇㅎㅏㅅㅔㅇㅛ', '안녕하세요'], ['ㅁㅏㅅㅇㅣㅆㅇㅓㅇㅛ', '맛있어요'],
  ['ㅇㅣㅃㅏㄹ', '이빨'], ['ㅃㅏㅇ', '빵'], ['ㅈㅏㄹ ㅈㅏ', '잘 자'], ['ㄱ', 'ㄱ'], ['ㅏ', 'ㅏ'], ['ㄱㄴ', 'ㄱㄴ'],
  ['ㅇㅡㅣㅈㅏ', '의자'], ['ㄱㅏㄱ<', '가'], ['ㄱㅗㅏ<', '고'], ['ㄱㅏ<<', ''], ['ㄷㅏㄹㄱ<', '달'], ['ㅇㅕㄷㅓㄹㅂ', '여덟']
];
let n = 0;
for (const [keys, want] of cases) { assert.equal(type(keys), want, `${keys} → ${want}`); n++; }

// 모든 낱말/문장: 정답 키 순서대로 치면 정확히 그 글자가 나와야 함 (힌트와 판정이 맞물리는지 확인)
const all = [...HT.ALL_WORDS.map((w) => w.text), ...HT.SENTENCES.map((s) => s.text), ...HT.SYLLABLES, ...HT.STORIES.flatMap((s) => s.lines)];
for (const text of all) {
  const keys = HT.keysOf(text);
  const h = new HT.Hangul();
  keys.forEach((k, i) => {
    if (k === ' ') h.space(); else h.input(k);
    assert.ok(HT.isPrefix(HT.keysOf(h.value), keys), `prefix broken at ${i} in ${text}: ${h.value}`);
  });
  assert.equal(h.value, text, `round trip ${text}`);
  n++;
}
// 모든 자모 키가 자판에 있어야 함
const PUNCT = new Set(['.', ',', '!', '?', '"']);
for (const text of all) for (const k of HT.keysOf(text)) if (k !== ' ' && !PUNCT.has(k)) assert.ok(HT.JAMO2KEY[k], `no key for "${k}" in ${text}`);
// 같은 낱말이 두 번 들어가지 않았는지
const seen = new Set();
for (const w of HT.ALL_WORDS) { assert.ok(!seen.has(w.text), `duplicate word ${w.text}`); seen.add(w.text); }
for (const w of HT.ALL_WORDS) assert.ok(w.rom && w.en && w.emoji, `missing field ${w.text}`);
console.log(`ok ${n} checks`);
