// 단어비(rain)와 풍선 팡팡(balloon): 움직이는 단어를 쳐서 없애는 게임. 둘은 움직이는 방향과 그림만 다릅니다.
var HT = globalThis.HT = globalThis.HT || {};
HT.Views = HT.Views || {};

HT.FONT_KO = "Jua, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif";
HT.FONT_EMOJI = "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";
HT.FONT_PIXEL = "'Press Start 2P', 'Courier New', monospace";
HT.BALLOON_COLORS = ['#FF004D', '#29ADFF', '#00B543', '#FF77A8', '#FFA300', '#83769C'];

// 게임에 나올 단어 묶음
HT.gamePool = function (content, level) {
  if (content === 'jamo') {
    return 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣㅐㅔ'.split('').map(function (j) { return { text: j, sub: '[' + HT.JINFO[j][1] + ']', say: HT.JINFO[j][0] }; });
  }
  if (content === 'syl') return (level >= 3 ? HT.SYLLABLES.concat(HT.SYLLABLES_B) : HT.SYLLABLES).map(function (s) { return { text: s, say: s }; });
  return HT.ALL_WORDS.filter(function (w) { return w.text.indexOf(' ') < 0; })
    .map(function (w) { return { text: w.text, sub: w.en, emoji: w.emoji, say: w.text, word: true }; });
};

HT.Views.game = function (kind) {
  var view = HT.$('#view'), C = HT.CONFIG[kind], P = HT.Store.data(), ime = new HT.Hangul();
  var cfg = Object.assign({ content: 'word', speed: 'slow', hint: true }, P.gameCfg[kind] || {});
  var canvas, ctx, W = 800, H = 500, FS = 34, raf = 0, last = 0, stars = [], clouds = [];
  var G = null, hudCache = '', hintCache = null, typedCache = null;

  view.innerHTML = '<section class="gv gv-' + kind + '">' +
    '<div class="bar"><button type="button" class="btn small" data-back>← ' + HT.esc(HT.t('back')) + '</button><h2>' + HT.esc(HT.t(kind)) + '</h2>' +
    '<div class="hud" id="gv-hud"></div><button type="button" class="btn small" id="gv-pause" aria-label="pause">❚❚</button></div>' +
    '<div class="screen" id="gv-frame"><canvas id="gv-canvas"></canvas>' +
    '<div class="overlay" id="ov-start"></div><div class="overlay" id="ov-pause" hidden></div><div class="overlay" id="ov-over" hidden></div>' +
    '<div class="debug-hud" id="gv-debug" hidden></div></div>' +
    '<div class="gin"><div class="typed game" id="gv-typed"></div>' +
    '<button type="button" class="btn small toggle" id="gv-hint" aria-pressed="' + cfg.hint + '">💡 ' + HT.esc(HT.t('hint')) + '</button></div>' +
    '<p class="hintline" id="gv-hintline">&nbsp;</p><div id="gv-kb"></div></section>';
  canvas = HT.$('#gv-canvas'); ctx = canvas.getContext('2d');
  var kb = HT.Keyboard(HT.$('#gv-kb'), onKey, { enter: true });

  function newState() {
    return { state: 'menu', ents: [], parts: [], floats: [], score: 0, level: 1, hearts: C.lives, combo: 0, maxCombo: 0,
      pops: 0, caught: [], spawnT: 0.4, slowT: 0, t: 0, shake: 0, banner: null, keysOk: 0, keysBad: 0, god: false };
  }
  G = newState();

  // ---- 크기 ----
  function resize() {
    var cssW = HT.$('#gv-frame').clientWidth || 800, narrow = cssW < 600;
    W = narrow ? 480 : 800; FS = narrow ? 30 : 34;
    var cssH = narrow ? Math.min(cssW * 1.0, innerHeight * 0.46) : Math.min(cssW * 0.56, innerHeight * 0.56);
    cssH = Math.max(cssH, 230);
    H = Math.round(W * cssH / cssW);
    canvas.style.height = cssH + 'px';
    var dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(canvas.width / W, 0, 0, canvas.width / W, 0, 0);
    stars = []; for (var i = 0; i < 60; i++) stars.push({ x: Math.random() * W, y: Math.random() * H * 0.8, r: Math.random() < 0.2 ? 3 : 2, sp: HT.rand(0.5, 2), ph: Math.random() * 6 });
    clouds = []; for (var c = 0; c < 4; c++) clouds.push({ x: Math.random() * W, y: HT.rand(20, H * 0.6), s: HT.rand(0.7, 1.3), v: HT.rand(6, 14) });
    G.ents.forEach(function (e) { e.x = HT.clamp(e.x, 10, W - 10); });
  }

  // ---- 난이도 계산 (모두 CONFIG 값에서 나옴) ----
  function speedMul() { return Math.min(C.maxSpeedMul, 1 + (G.level - 1) * C.speedUpPerLevel); }
  function travelSeconds() { return (kind === 'rain' ? C.fallSeconds : C.riseSeconds)[cfg.speed] / speedMul(); }
  function spawnEvery() { return Math.max(C.minSpawnSeconds, C.spawnSeconds[cfg.speed] / speedMul()); }
  function maxOnScreen() { return Math.min(C.onScreen.max, C.onScreen.base + (G.level - 1) * C.onScreen.perLevel); }
  HT._gameDebug = function () { return { level: G.level, speedMul: speedMul(), travel: travelSeconds(), spawnEvery: spawnEvery(), max: maxOnScreen(), ents: G.ents.length }; };

  function textW(e) {
    ctx.font = FS + 'px ' + HT.FONT_KO;
    return ctx.measureText(e.text).width;
  }
  function conflicts(keys) {
    return G.ents.some(function (e) { return HT.isPrefix(keys, e.keys) || HT.isPrefix(e.keys, keys); });
  }
  function spawn() {
    var pool = HT.gamePool(cfg.content, G.level), item = null, missedWords = Object.keys(P.missed);
    for (var tries = 0; tries < 12 && !item; tries++) {
      var cand = (cfg.content === 'word' && missedWords.length && Math.random() < 0.25)
        ? pool.filter(function (p) { return p.text === HT.pick(missedWords); })[0] : HT.pick(pool);
      if (cand && !conflicts(HT.keysOf(cand.text))) item = cand;
    }
    if (!item) return;
    var e = Object.assign({ keys: HT.keysOf(item.text), gold: Math.random() < C.goldChance, t: 0 }, item);
    var w = textW(e);
    var v = 0;
    if (kind === 'rain') {
      e.w = w; e.x = HT.rand(16 + w / 2, W - 16 - w / 2); e.y = -FS * 0.6;
      v = (H - 34) / travelSeconds();
    } else {
      e.r = Math.max(e.emoji ? FS * 1.5 : FS * 1.2, w / 2 + 16);
      e.x = HT.rand(e.r + 12, W - e.r - 12); e.y = H + e.r * 1.2;
      e.ph = Math.random() * 6; e.amp = HT.rand(8, 18); e.wf = HT.rand(0.8, 1.6);
      e.color = e.gold ? '#FFEC27' : HT.pick(HT.BALLOON_COLORS);
      v = (H + e.r * 3.4) / travelSeconds();
    }
    e.v = v * HT.rand(0.9, 1.1);
    G.ents.push(e);
  }

  // ---- 진행 ----
  function update(dt) {
    G.t += dt;
    var slow = G.slowT > 0 ? C.slowFactor || 1 : 1;
    if (G.slowT > 0) G.slowT -= dt;
    for (var i = G.ents.length - 1; i >= 0; i--) {
      var e = G.ents[i];
      e.t += dt;
      if (kind === 'rain') {
        e.y += e.v * dt * slow;
        if (e.y + FS * 0.5 >= H - 34) miss(e, i);
      } else {
        e.y -= e.v * dt * slow;
        e.cx = e.x + Math.sin(e.t * e.wf + e.ph) * e.amp;
        if (e.y + e.r * 1.15 < 0) miss(e, i);
      }
      if (G.state !== 'play') return; // 마지막 하트를 잃으면 즉시 멈춤
    }
    G.spawnT -= dt;
    if ((G.spawnT <= 0 || G.ents.length === 0) && G.ents.length < maxOnScreen()) { spawn(); G.spawnT = spawnEvery(); }
    G.parts = G.parts.filter(function (p) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 600 * dt; p.life -= dt; return p.life > 0; });
    G.floats = G.floats.filter(function (f) { f.y -= 28 * dt; f.life -= dt; return f.life > 0; });
    if (G.shake > 0) G.shake -= dt;
    if (G.banner) { G.banner.life -= dt; if (G.banner.life <= 0) G.banner = null; }
    clouds.forEach(function (c) { c.x += c.v * dt; if (c.x > W + 80) c.x = -120; });
  }

  function miss(e, i) {
    G.ents.splice(i, 1);
    if (e.word) HT.Store.markMiss(e.text, true);
    G.combo = 0;
    G.floats.push({ x: kind === 'rain' ? e.x : e.cx || e.x, y: kind === 'rain' ? H - 60 : 40, text: HT.t('missed') + ' ' + e.text, color: '#FF004D', life: 1.6, max: 1.6 });
    G.shake = 0.3;
    if (!G.god) G.hearts--;
    HT.Sfx.miss();
    validateBuffer();
    if (G.hearts <= 0) gameOver();
  }

  function popEnt(e) {
    var idx = G.ents.indexOf(e); if (idx < 0) return;
    G.ents.splice(idx, 1);
    G.combo++; G.maxCombo = Math.max(G.maxCombo, G.combo); G.pops++;
    var S = HT.CONFIG.score, mul = Math.min(S.comboMaxMul, 1 + (G.combo - 1) * S.comboStep);
    var pts = Math.round(e.keys.length * S.perKey * mul * (e.gold ? 2 : 1));
    G.score += pts;
    var x = kind === 'rain' ? e.x : e.cx, y = e.y;
    var cols = kind === 'rain' ? ['#29ADFF', '#FFF1E8', '#FFEC27'] : [e.color, '#FFF1E8', '#1D2B53'];
    for (var i = 0; i < 16; i++) {
      var a = Math.random() * Math.PI * 2, sp = HT.rand(80, 260);
      G.parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 120, life: HT.rand(0.4, 0.8), c: HT.pick(cols), s: HT.rand(3, 7) });
    }
    G.floats.push({ x: x, y: y - FS, text: (e.emoji ? e.emoji + ' ' : '') + (e.sub || e.text) + '  +' + pts, color: '#FFEC27', life: 1.3, max: 1.3 });
    if (e.word) HT.Store.markMiss(e.text, false);
    if (G.caught.indexOf(e.text) < 0) G.caught.push(e.text);
    HT.Sfx.pop();
    if (e.gold) {
      if (kind === 'rain') { G.slowT = C.slowSeconds; G.banner = { text: HT.t('slowTime'), life: 1.4 }; }
      else if (G.hearts < C.maxLives) { G.hearts++; G.banner = { text: HT.t('bonusHeart'), life: 1.4 }; }
      HT.Sfx.star();
    } else if (e.say) {
      HT.Speech.say(e.say);
    }
    if (G.pops % C.levelEvery === 0) {
      G.level++;
      G.banner = { text: HT.t('levelUp', { n: G.level }), life: 1.6 };
      HT.Sfx.level();
    }
  }

  function validateBuffer() {
    if (!ime.value) return;
    var tk = HT.keysOf(ime.value);
    if (!G.ents.some(function (e) { return HT.isPrefix(tk, e.keys); })) ime.reset();
  }

  // ---- 입력 ----
  function onKey(k) {
    if (k.type === 'esc') { if (G.state === 'play') pause(); else if (G.state === 'pause') resume(); return; }
    if (G.state !== 'play') { if (k.type === 'enter' && (G.state === 'menu' || G.state === 'over')) start(); return; }
    if (k.type === 'bs') { ime.backspace(); HT.Sfx.tick(); return; }
    if (k.type === 'enter' || k.type === 'space') { ime.reset(); return; }
    var snap = ime.snapshot();
    if (k.type === 'jamo') ime.input(k.j); else if (k.type === 'char') ime.char(k.ch);
    var tk = HT.keysOf(ime.value);
    var cands = G.ents.filter(function (e) { return HT.isPrefix(tk, e.keys); });
    if (!cands.length) {
      ime.restore(snap); G.combo = 0; G.keysBad++; HT.Sfx.wrong();
      var el = HT.$('#gv-typed'); el.classList.remove('bad'); void el.offsetWidth; el.classList.add('bad');
      return;
    }
    G.keysOk++; HT.Sfx.tick();
    var exact = cands.filter(function (e) { return e.keys.length === tk.length; })[0];
    if (exact) { popEnt(exact); ime.reset(); }
  }

  // ---- 그리기 ----
  function draw() {
    ctx.save();
    if (G.shake > 0) ctx.translate(HT.rand(-6, 6) * G.shake / 0.3, HT.rand(-6, 6) * G.shake / 0.3);
    drawBg();
    var tk = ime.value ? HT.keysOf(ime.value) : null;
    G.ents.forEach(function (e) {
      var match = tk && HT.isPrefix(tk, e.keys);
      if (kind === 'rain') drawWord(e, match); else drawBalloon(e, match);
    });
    G.parts.forEach(function (p) { ctx.globalAlpha = Math.max(0, p.life * 1.6); ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.s, p.s); });
    ctx.globalAlpha = 1;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    G.floats.forEach(function (f) {
      ctx.globalAlpha = Math.min(1, f.life / f.max * 1.5);
      ctx.font = Math.round(FS * 0.6) + 'px ' + HT.FONT_KO;
      ctx.lineWidth = 5; ctx.strokeStyle = '#1D2B53'; ctx.strokeText(f.text, f.x, f.y);
      ctx.fillStyle = f.color; ctx.fillText(f.text, f.x, f.y);
    });
    ctx.globalAlpha = 1;
    if (G.banner) {
      ctx.font = Math.round(FS * 0.75) + 'px ' + HT.FONT_PIXEL + ', ' + HT.FONT_KO;
      ctx.lineWidth = 8; ctx.strokeStyle = '#1D2B53'; ctx.strokeText(G.banner.text, W / 2, H * 0.42);
      ctx.fillStyle = '#FFEC27'; ctx.fillText(G.banner.text, W / 2, H * 0.42);
    }
    if (G.slowT > 0) { ctx.fillStyle = 'rgba(41,173,255,0.12)'; ctx.fillRect(0, 0, W, H); }
    ctx.restore();
  }
  function drawBg() {
    var g;
    if (kind === 'rain') {
      g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0B1230'); g.addColorStop(1, '#3A1D4A');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      stars.forEach(function (s) { ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(G.t * s.sp + s.ph)); ctx.fillStyle = '#FFF1E8'; ctx.fillRect(s.x, s.y, s.r, s.r); });
      ctx.globalAlpha = 1;
      var gy = H - 34;
      ctx.fillStyle = '#7E2553'; ctx.fillRect(0, gy, W, 34);
      ctx.fillStyle = '#AB5236';
      for (var row = 0, y = gy + 6; y < H; y += 12, row++) for (var x = row % 2 ? -12 : 0; x < W; x += 24) ctx.fillRect(x + 1, y, 22, 10);
      ctx.fillStyle = '#00E436'; ctx.fillRect(0, gy, W, 5);
    } else {
      g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#29ADFF'); g.addColorStop(1, '#C2E9FF');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      clouds.forEach(function (c) {
        var s = 12 * c.s;
        ctx.fillRect(c.x, c.y, s * 8, s * 2); ctx.fillRect(c.x + s * 2, c.y - s, s * 4, s); ctx.fillRect(c.x + s, c.y + s * 2, s * 6, s * 0.8);
      });
      ctx.fillStyle = '#00B543'; ctx.fillRect(0, H - 16, W, 16);
      ctx.fillStyle = '#008751'; for (var gx = 0; gx < W; gx += 16) ctx.fillRect(gx, H - 16, 8, 6);
    }
  }
  function drawText(e, x, y, match) {
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = FS + 'px ' + HT.FONT_KO;
    ctx.lineWidth = 7; ctx.strokeStyle = '#1D2B53'; ctx.strokeText(e.text, x, y);
    ctx.fillStyle = match ? '#FFEC27' : (e.gold && kind === 'rain') ? '#FFA300' : '#FFFFFF';
    ctx.fillText(e.text, x, y);
  }
  function drawWord(e, match) {
    if (match) { ctx.fillStyle = 'rgba(255,236,39,0.18)'; ctx.fillRect(e.x - e.w / 2 - 10, e.y - FS * 0.7, e.w + 20, FS * 1.4); }
    if (e.emoji) { ctx.font = Math.round(FS * 0.85) + 'px ' + HT.FONT_EMOJI; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(e.emoji, e.x, e.y - FS * 1.0); }
    if (e.gold) { ctx.font = Math.round(FS * 0.6) + 'px ' + HT.FONT_KO; ctx.fillStyle = '#FFEC27'; ctx.fillText('★', e.x - e.w / 2 - 14, e.y); }
    drawText(e, e.x, e.y, match);
    if (e.sub) { ctx.font = Math.round(FS * 0.42) + 'px ' + HT.FONT_KO; ctx.fillStyle = '#9FD8FF'; ctx.fillText(e.sub, e.x, e.y + FS * 0.78); }
  }
  function drawBalloon(e, match) {
    var x = e.cx == null ? e.x : e.cx, y = e.y, r = e.r, ry = r * 1.15;
    ctx.strokeStyle = 'rgba(29,43,83,0.7)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y + ry + 6); ctx.quadraticCurveTo(x + 10, y + ry + r * 0.6, x - 4, y + ry + r * 1.1); ctx.stroke();
    if (match) { ctx.strokeStyle = '#FFEC27'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(x, y, r + 7, ry + 7, 0, 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = e.color; ctx.beginPath(); ctx.ellipse(x, y, r, ry, 0, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = '#1D2B53'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 7, y + ry + 8); ctx.lineTo(x + 7, y + ry + 8); ctx.lineTo(x, y + ry - 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillRect(x - r * 0.55, y - ry * 0.55, r * 0.18, ry * 0.32);
    var ty = y;
    if (e.emoji) { ctx.font = Math.round(FS * 0.75) + 'px ' + HT.FONT_EMOJI; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(e.emoji, x, y - ry * 0.45); ty = y + ry * 0.28; }
    drawText(e, x, ty, match);
    if (e.sub) {
      ctx.font = Math.round(FS * 0.42) + 'px ' + HT.FONT_KO; ctx.lineWidth = 4; ctx.strokeStyle = '#FFFFFF';
      ctx.strokeText(e.sub, x, y + ry + 22); ctx.fillStyle = '#1D2B53'; ctx.fillText(e.sub, x, y + ry + 22);
    }
  }

  // ---- 화면 표시 ----
  function hud() {
    var s = '<span class="hud-i"><small>' + HT.esc(HT.t('score')) + '</small><b>' + G.score + '</b></span>' +
      '<span class="hud-i"><small>' + HT.esc(HT.t('level')) + '</small><b>' + G.level + '</b></span>' +
      '<span class="hud-i"><small>' + HT.esc(HT.t('combo')) + '</small><b>' + G.combo + '</b></span>' +
      '<span class="hearts" aria-label="' + G.hearts + ' hearts">' + '♥'.repeat(Math.max(0, G.hearts)) + '<span class="lost">' + '♥'.repeat(Math.max(0, C.lives - G.hearts)) + '</span></span>';
    if (s !== hudCache) { HT.$('#gv-hud').innerHTML = s; hudCache = s; }
    var v = ime.value, comp = ime.compChar(), typed = v ? HT.esc(ime.text) + (comp ? '<span class="comp">' + HT.esc(comp) + '</span>' : '') : '<span class="ph">' + HT.esc(HT.t('typeHere')) + '</span>';
    if (typed !== typedCache) { HT.$('#gv-typed').innerHTML = typed; typedCache = typed; }
    var nextKey = null;
    if (cfg.hint && G.state === 'play' && G.ents.length) {
      var tk = HT.keysOf(v), target = null;
      if (v) target = G.ents.filter(function (e) { return HT.isPrefix(tk, e.keys); })[0];
      if (!target) target = G.ents.slice().sort(function (a, b) { return kind === 'rain' ? b.y - a.y : a.y - b.y; })[0];
      nextKey = target.keys[tk.length] || null;
    }
    if (nextKey !== hintCache) { HT.showNextKey(kb, HT.$('#gv-hintline'), nextKey); hintCache = nextKey; }
    if (HT.debugOn) {
      var dbg = HT.$('#gv-debug'); dbg.hidden = false;
      var d = HT._gameDebug();
      dbg.textContent = 'LV ' + d.level + ' · x' + d.speedMul.toFixed(2) + ' · travel ' + d.travel.toFixed(1) + 's · spawn ' + d.spawnEvery.toFixed(2) + 's · ' + d.ents + '/' + d.max + (G.god ? ' · GOD' : '');
    }
  }
  function loop(ts) {
    raf = requestAnimationFrame(loop);
    var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0; last = ts;
    if (G.state === 'play') update(dt);
    else G.t += dt;
    draw(); hud();
  }

  // ---- 시작/멈춤/끝 ----
  function startMenu() {
    var ov = HT.$('#ov-start');
    ov.innerHTML = '<div class="ov-box"><h3>' + HT.esc(HT.t(kind)) + '</h3><p>' + HT.esc(HT.t(kind + 'Desc')) + '</p>' +
      '<p class="lbl">' + HT.esc(HT.t('content')) + '</p>' + HT.segmented('sg-content', [['jamo', HT.t('cJamo')], ['syl', HT.t('cSyl')], ['word', HT.t('cWord')]], cfg.content) +
      '<p class="lbl">' + HT.esc(HT.t('speedSel')) + '</p>' + HT.segmented('sg-speed', [['slow', HT.t('slow')], ['normal', HT.t('normal')], ['fast', HT.t('fast')]], cfg.speed) +
      '<p class="best">🏆 ' + HT.esc(HT.t('bestLbl')) + ' ' + (P.best[kind] || 0) + '</p>' +
      '<button type="button" class="btn primary big" id="gv-start">' + HT.esc(HT.t('start')) + '</button></div>';
    HT.bindSegmented(ov, 'sg-content', function (v) { cfg.content = v; saveCfg(); });
    HT.bindSegmented(ov, 'sg-speed', function (v) { cfg.speed = v; saveCfg(); });
    HT.$('#gv-start').onclick = start;
  }
  function saveCfg() { P.gameCfg[kind] = cfg; HT.Store.save(); }
  function start() {
    HT.Sfx.ensure(); HT.Sfx.click();
    G = newState(); G.state = 'play'; ime.reset();
    ['#ov-start', '#ov-pause', '#ov-over'].forEach(function (s) { HT.$(s).hidden = true; });
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }
  function pause() {
    if (G.state !== 'play') return;
    G.state = 'pause';
    var ov = HT.$('#ov-pause');
    ov.innerHTML = '<div class="ov-box"><h3>' + HT.esc(HT.t('paused')) + '</h3><p class="tipbox">' + HT.tipHTML(HT.randomTip()) + '</p>' +
      '<button type="button" class="btn primary big" id="gv-resume">' + HT.esc(HT.t('resume')) + '</button></div>';
    ov.hidden = false;
    HT.$('#gv-resume').onclick = resume;
  }
  function resume() { if (G.state !== 'pause') return; G.state = 'play'; HT.$('#ov-pause').hidden = true; last = 0; }
  function gameOver() {
    G.state = 'over'; G.ents = [];
    HT.Sfx.over();
    var isBest = G.score > (P.best[kind] || 0);
    P.best[kind] = Math.max(P.best[kind] || 0, G.score);
    P.maxCombo = Math.max(P.maxCombo, G.maxCombo);
    if (kind === 'balloon') P.maxPop = Math.max(P.maxPop, G.pops);
    if (cfg.content === 'word') P.wordsTyped += G.pops;
    P.keysTyped += G.keysOk;
    HT.Store.touchDay(); HT.Store.save();
    var ov = HT.$('#ov-over');
    ov.innerHTML = '<div class="ov-box"><h3>' + HT.esc(HT.t('gameOver')) + '</h3>' + (isBest && G.score ? '<p class="newbest">🎉 ' + HT.esc(HT.t('newBest')) + '</p>' : '') +
      '<div class="statbar"><div class="stat"><small>' + HT.esc(HT.t('score')) + '</small><b>' + G.score + '</b></div>' +
      '<div class="stat"><small>' + HT.esc(HT.t('level')) + '</small><b>' + G.level + '</b></div>' +
      '<div class="stat"><small>' + HT.esc(HT.t('maxCombo')) + '</small><b>' + G.maxCombo + '</b></div></div>' +
      (G.caught.length ? '<p class="lbl">' + HT.esc(HT.t('caught')) + '</p><div class="chips">' + G.caught.map(function (w) {
        var it = HT.WORD_INDEX[w];
        return '<button type="button" class="chip" data-say="' + HT.esc(it ? w : (HT.JINFO[w] ? HT.JINFO[w][0] : w)) + '">' + (it ? it.emoji + ' ' : '') + HT.esc(w) + (it ? ' <small>' + HT.esc(it.en) + '</small>' : '') + '</button>';
      }).join('') + '</div>' : '') +
      '<p class="tipbox">' + HT.tipHTML(HT.randomTip()) + '</p>' +
      '<div class="actions"><button type="button" class="btn primary" id="gv-again">' + HT.esc(HT.t('retry')) + '</button>' +
      '<button type="button" class="btn" id="gv-menu">' + HT.esc(HT.t('content')) + '</button></div></div>';
    ov.hidden = false;
    HT.$('#gv-again').onclick = start;
    HT.$('#gv-menu').onclick = function () { ov.hidden = true; G.state = 'menu'; startMenu(); HT.$('#ov-start').hidden = false; };
    ov.onclick = function (e) { var c = e.target.closest('[data-say]'); if (c) HT.Speech.say(c.dataset.say); };
    HT.checkBadges();
  }

  // 디버그 패널에서 쓰는 조작
  HT._gameCtl = {
    levelUp: function () { G.level++; G.banner = { text: HT.t('levelUp', { n: G.level }), life: 1.2 }; },
    heart: function () { G.hearts = Math.min(C.lives, G.hearts + 1); },
    god: function () { G.god = !G.god; },
    end: function () { if (G.state === 'play') gameOver(); }
  };

  view.onclick = function (e) {
    if (e.target.closest('[data-back]')) return HT.go('home');
    if (e.target.closest('#gv-pause')) { if (G.state === 'play') pause(); else resume(); return; }
    var hb = e.target.closest('#gv-hint');
    if (hb) { cfg.hint = !cfg.hint; hb.setAttribute('aria-pressed', String(cfg.hint)); hintCache = undefined; saveCfg(); }
  };
  function onVis() { if (document.hidden) pause(); }
  document.addEventListener('visibilitychange', onVis);
  addEventListener('resize', resize);
  resize(); startMenu();
  HT.inputHandler = onKey;
  raf = requestAnimationFrame(loop);
  if (document.fonts && document.fonts.load) document.fonts.load(FS + 'px Jua').catch(function () {});

  return function () {
    cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange', onVis);
    removeEventListener('resize', resize);
    view.onclick = null; HT._gameCtl = null; HT._gameDebug = null;
  };
};

HT.Views.rain = function () { return HT.Views.game('rain'); };
HT.Views.balloon = function () { return HT.Views.game('balloon'); };
