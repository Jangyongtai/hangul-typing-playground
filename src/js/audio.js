// 8비트 효과음(Web Audio로 직접 합성, 파일 없음)과 한국어 읽어주기(브라우저 음성)
var HT = globalThis.HT = globalThis.HT || {};

HT.Sfx = {
  ctx: null,
  on: true,
  ensure: function () {
    try {
      if (!this.ctx) {
        var AC = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    } catch (e) { return null; }
  },
  tone: function (freq, dur, o) {
    o = o || {};
    if (!this.on) return;
    var c = this.ensure(); if (!c) return;
    var t = c.currentTime + (o.delay || 0);
    var osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'square';
    osc.frequency.setValueAtTime(freq, t);
    if (o.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + o.slide), t + dur);
    g.gain.setValueAtTime(o.vol || 0.06, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(c.destination);
    osc.start(t); osc.stop(t + dur + 0.02);
  },
  noise: function (dur, vol, delay) {
    if (!this.on) return;
    var c = this.ensure(); if (!c) return;
    var t = c.currentTime + (delay || 0);
    var len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 1800;
    src.buffer = buf; g.gain.value = vol || 0.12;
    src.connect(f); f.connect(g); g.connect(c.destination); src.start(t);
  },
  tick: function () { this.tone(1250, 0.025, { vol: 0.025 }); },
  click: function () { this.tone(520, 0.05, { type: 'triangle', vol: 0.08 }); },
  ok: function () { this.tone(660, 0.07); this.tone(990, 0.12, { delay: 0.07 }); },
  wrong: function () { this.tone(140, 0.16, { type: 'sawtooth', vol: 0.05 }); },
  pop: function () { this.noise(0.12, 0.14); this.tone(700, 0.09, { slide: 700, vol: 0.05 }); },
  miss: function () { this.tone(330, 0.3, { type: 'triangle', slide: -220, vol: 0.12 }); },
  level: function () { var s = this; [523, 659, 784, 1047].forEach(function (f, i) { s.tone(f, 0.11, { delay: i * 0.09 }); }); },
  over: function () { var s = this; [392, 330, 262, 196].forEach(function (f, i) { s.tone(f, 0.18, { delay: i * 0.16, type: 'triangle', vol: 0.1 }); }); },
  star: function () { var s = this; [880, 1175, 1568].forEach(function (f, i) { s.tone(f, 0.1, { delay: i * 0.07, vol: 0.05 }); }); },
  count: function (last) { this.tone(last ? 1047 : 523, last ? 0.35 : 0.15, { vol: 0.07 }); },
  fanfare: function () { var s = this; [523, 523, 784, 659, 1047].forEach(function (f, i) { s.tone(f, 0.14, { delay: i * 0.12, vol: 0.07 }); }); }
};

HT.Speech = {
  on: true,
  voice: null,
  init: function () {
    if (!('speechSynthesis' in globalThis)) return;
    var self = this;
    var pick = function () {
      try {
        var vs = speechSynthesis.getVoices();
        self.voice = vs.filter(function (v) { return /^ko/i.test(v.lang); })[0] || null;
      } catch (e) { self.voice = null; }
    };
    pick();
    try { speechSynthesis.onvoiceschanged = pick; } catch (e) { /* 무시 */ }
  },
  say: function (text) {
    if (!this.on || !text || !('speechSynthesis' in globalThis)) return;
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'ko-KR'; u.rate = 0.85;
      if (this.voice) u.voice = this.voice;
      speechSynthesis.speak(u);
    } catch (e) { /* 음성을 못 쓰는 기기 */ }
  }
};
