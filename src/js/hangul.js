// 두벌식 한글 조합기. 영문 자판 키를 받아 한글 글자를 만듭니다. (한글 입력기 설치 불필요)
var HT = globalThis.HT = globalThis.HT || {};

(function () {
  var CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
  var JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
  var JONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  var VCOMB = { 'ㅗㅏ': 'ㅘ', 'ㅗㅐ': 'ㅙ', 'ㅗㅣ': 'ㅚ', 'ㅜㅓ': 'ㅝ', 'ㅜㅔ': 'ㅞ', 'ㅜㅣ': 'ㅟ', 'ㅡㅣ': 'ㅢ' };
  var CCOMB = { 'ㄱㅅ': 'ㄳ', 'ㄴㅈ': 'ㄵ', 'ㄴㅎ': 'ㄶ', 'ㄹㄱ': 'ㄺ', 'ㄹㅁ': 'ㄻ', 'ㄹㅂ': 'ㄼ', 'ㄹㅅ': 'ㄽ', 'ㄹㅌ': 'ㄾ', 'ㄹㅍ': 'ㄿ', 'ㄹㅎ': 'ㅀ', 'ㅂㅅ': 'ㅄ' };
  var SPLIT = {};
  [VCOMB, CCOMB].forEach(function (m) {
    Object.keys(m).forEach(function (k) { SPLIT[m[k]] = [k[0], k[1]]; });
  });

  function isVowel(j) { return JUNG.indexOf(j) >= 0; }
  function isCons(j) { return CHO.indexOf(j) >= 0 || !!SPLIT[j] && !isVowel(j); }

  function composeBlock(c) {
    if (c.c && c.v) {
      return String.fromCharCode(0xAC00 + (CHO.indexOf(c.c) * 21 + JUNG.indexOf(c.v)) * 28 + JONG.indexOf(c.f));
    }
    return c.c || c.v || '';
  }

  function Hangul() { this.reset(); }
  Hangul.prototype.reset = function () { this.text = ''; this.comp = { c: '', v: '', f: '' }; };
  Hangul.prototype.compChar = function () { return composeBlock(this.comp); };
  Object.defineProperty(Hangul.prototype, 'value', { get: function () { return this.text + composeBlock(this.comp); } });
  Hangul.prototype.commit = function () { this.text += composeBlock(this.comp); this.comp = { c: '', v: '', f: '' }; };
  Hangul.prototype.snapshot = function () { return { text: this.text, comp: { c: this.comp.c, v: this.comp.v, f: this.comp.f } }; };
  Hangul.prototype.restore = function (s) { this.text = s.text; this.comp = { c: s.comp.c, v: s.comp.v, f: s.comp.f }; };

  Hangul.prototype.input = function (j) {
    var c = this.comp;
    if (isVowel(j)) {
      if (c.f) {
        // 받침이 다음 글자 첫소리로 넘어감: 각 + ㅏ → 가가
        var parts = SPLIT[c.f];
        var moved;
        if (parts) { c.f = parts[0]; moved = parts[1]; } else { moved = c.f; c.f = ''; }
        this.commit();
        this.comp = { c: moved, v: j, f: '' };
      } else if (c.v) {
        var m = VCOMB[c.v + j];
        if (m) c.v = m; else { this.commit(); this.comp = { c: '', v: j, f: '' }; }
      } else if (c.c) {
        c.v = j;
      } else {
        this.comp = { c: '', v: j, f: '' };
      }
    } else if (isCons(j)) {
      if (c.f) {
        var cf = CCOMB[c.f + j];
        if (cf) c.f = cf; else { this.commit(); this.comp = { c: j, v: '', f: '' }; }
      } else if (c.v) {
        if (c.c && JONG.indexOf(j) > 0) c.f = j;
        else { this.commit(); this.comp = { c: j, v: '', f: '' }; }
      } else if (c.c) {
        this.commit(); this.comp = { c: j, v: '', f: '' };
      } else {
        c.c = j;
      }
    } else {
      this.char(j);
    }
  };

  Hangul.prototype.space = function () { this.commit(); this.text += ' '; };
  Hangul.prototype.char = function (ch) { this.commit(); this.text += ch; };

  // 지우기: 조합 중이면 자모 하나씩, 아니면 글자 하나
  Hangul.prototype.backspace = function () {
    var c = this.comp, p;
    if (c.f) { p = SPLIT[c.f]; c.f = p ? p[0] : ''; }
    else if (c.v) { p = SPLIT[c.v]; c.v = p ? p[0] : ''; }
    else if (c.c) { c.c = ''; }
    else if (this.text) { this.text = this.text.slice(0, -1); }
  };

  // 글자를 실제로 눌러야 하는 키(자모) 순서로 풀어냅니다. 과 → ㄱ ㅗ ㅏ
  function keysOf(str) {
    var out = [];
    function push(j) { var p = SPLIT[j]; if (p) { out.push(p[0], p[1]); } else out.push(j); }
    for (var i = 0; i < str.length; i++) {
      var ch = str[i], code = ch.charCodeAt(0);
      if (code >= 0xAC00 && code <= 0xD7A3) {
        var n = code - 0xAC00;
        out.push(CHO[Math.floor(n / 588)]);
        push(JUNG[Math.floor((n % 588) / 28)]);
        var jong = n % 28;
        if (jong) push(JONG[jong]);
      } else {
        push(ch);
      }
    }
    return out;
  }

  function isPrefix(a, b) {
    if (a.length > b.length) return false;
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }

  HT.Hangul = Hangul;
  HT.keysOf = keysOf;
  HT.isPrefix = isPrefix;
  HT.isVowel = isVowel;
  HT.composeBlock = composeBlock;
})();
