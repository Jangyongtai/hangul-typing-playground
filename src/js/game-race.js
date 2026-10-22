// 타자 레이스: 4레인 (나 + 컴퓨터 3명). 맞게 친 타 수만큼 앞으로 달립니다.
// 컴퓨터 속도는 아이의 최근 평균 타수에 맞춰 정해집니다(CONFIG.race.cpuRatios).
var HT = globalThis.HT = globalThis.HT || {};
HT.Views = HT.Views || {};

HT.Views.race = function () {
  var view = HT.$('#view'), C = HT.CONFIG.race, P = HT.Store.data(), prof = HT.Store.profile(), ime = new HT.Hangul();
  var cfg = Object.assign({ content: 'word', diff: 'normal', dist: 'normal', hint: true }, P.gameCfg.race || {});
  var canvas, ctx, W = 800, H = 360, raf = 0, last = 0;
  var R = null, hintCache, typedCache, hudCache;

  view.innerHTML = '<section class="gv gv-race">' +
    '<div class="bar"><button type="button" class="btn small" data-back>← ' + HT.esc(HT.t('back')) + '</button><h2>' + HT.esc(HT.t('race')) + '</h2>' +
    '<div class="hud" id="rc-hud"></div></div>' +
    '<div class="screen" id="rc-frame"><canvas id="rc-canvas"></canvas>' +
    '<div class="overlay" id="rc-setup"></div><div class="overlay" id="rc-over" hidden></div>' +
    '<div class="debug-hud" id="rc-debug" hidden></div></div>' +
    '<div class="race-target" id="rc-target"></div>' +
    '<div class="gin"><div class="typed game" id="rc-typed"></div>' +
    '<button type="button" class="btn small toggle" id="rc-hint" aria-pressed="' + cfg.hint + '">💡 ' + HT.esc(HT.t('hint')) + '</button></div>' +
    '<p class="hintline" id="rc-hintline">&nbsp;</p><div id="rc-kb"></div></section>';
  canvas = HT.$('#rc-canvas'); ctx = canvas.getContext('2d');
  var kb = HT.Keyboard(HT.$('#rc-kb'), onKey);

  // ---- 상대 선수 속도 정하기 ----
  function rivalKpms() {
    var base = HT.Store.playerKpm();
    return C.cpuRatios[cfg.diff].slice(0, C.cpuCount).map(function (r) {
      return Math.round(HT.clamp(base * r, C.cpuKpmMin, C.cpuKpmMax));
    });
  }
  HT._raceDebug = function () { return { playerAvg: HT.Store.playerKpm(), rivals: rivalKpms(), state: R && R.state }; };

  function buildCourse() {
    var src = cfg.content === 'sent' ? HT.shuffle(HT.SENTENCES) : HT.shuffle(HT.ALL_WORDS);
    var items = [], total = 0, i = 0, need = C.raceKeys[cfg.dist];
    while (total < need) {
      var it = src[i % src.length]; i++;
      var keys = HT.keysOf(it.text);
      items.push(Object.assign({ keys: keys }, it));
      total += keys.length;
    }
    return { items: items, total: total };
  }

  function newRace() {
    var course = buildCourse(), kpms = rivalKpms(), rivals = HT.shuffle(HT.RIVALS).slice(0, C.cpuCount);
    var racers = [{ me: true, name: prof.name, emoji: prof.avatar, kpm: 0, prog: 0, shown: 0, fin: 0, stumble: 0, noise: 0, nt: 0 }];
    rivals.forEach(function (rv, i) {
      racers.push({ me: false, name: HT.L(rv.ko, rv.en), emoji: rv.emoji, kpm: kpms[i], prog: 0, shown: 0, fin: 0, stumble: 0, noise: 0, nt: 0 });
    });
    // 내 레인은 위에서 두 번째(보기 편한 자리)
    var me = racers.shift(); racers.splice(1, 0, me);
    return { state: 'setup', course: course, idx: 0, doneKeys: 0, racers: racers, me: me, t: 0, cd: 0, ok: 0, bad: 0, place: 0, dust: [] };
  }
  R = newRace();

  function resize() {
    var cssW = HT.$('#rc-frame').clientWidth || 800, narrow = cssW < 600;
    W = narrow ? 480 : 800;
    var cssH = narrow ? Math.max(220, cssW * 0.62) : Math.max(260, cssW * 0.4);
    H = Math.round(W * cssH / cssW);
    canvas.style.height = cssH + 'px';
    var dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(canvas.width / W, 0, 0, canvas.width / W, 0, 0);
  }

  function myKeys() { return R.doneKeys + HT.keysOf(ime.value).length; }
  function curItem() { return R.course.items[R.idx]; }

  // ---- 진행 ----
  function update(dt) {
    R.t += dt;
    if (R.state === 'count') {
      var before = Math.ceil(R.cd);
      R.cd -= dt;
      var after = Math.ceil(R.cd);
      if (after !== before) HT.Sfx.count(after <= 0);
      if (R.cd <= 0) { R.state = 'run'; R.t0 = performance.now(); }
      return;
    }
    if (R.state !== 'run') return;
    var total = R.course.total;
    R.racers.forEach(function (r) {
      if (r.me) { r.prog = myKeys() / total; }
      else if (!r.fin) {
        r.nt -= dt;
        if (r.nt <= 0) { r.noise = HT.rand(-C.cpuJitter, C.cpuJitter); r.nt = 0.6; }
        if (r.stumble > 0) r.stumble -= dt;
        else {
          if (Math.random() < C.stumblePerSecond * dt) r.stumble = C.stumbleSeconds;
          r.prog += (r.kpm / 60) * (1 + r.noise) * dt / total;
        }
      }
      if (r.prog >= 1 && !r.fin) {
        r.prog = 1; r.fin = R.t;
        if (!r.me) HT.Sfx.tone(440, 0.08, { type: 'triangle' });
      }
      var before = r.shown;
      r.shown += (r.prog - r.shown) * Math.min(1, dt * 8);
      if (r.shown - before > 0.0004 && Math.random() < 0.5) R.dust.push({ lane: r, x: r.shown, life: 0.5 });
    });
    R.dust = R.dust.filter(function (d) { d.life -= dt; return d.life > 0; });
    if (R.me.fin) finish();
  }

  // ---- 입력 ----
  function onKey(k) {
    if (R.state === 'setup' || R.state === 'over') { if (k.type === 'enter') start(); return; }
    if (R.state !== 'run' || k.type === 'esc' || k.type === 'enter') return;
    var it = curItem();
    if (k.type === 'bs') { ime.backspace(); HT.Sfx.tick(); renderTarget(); return; }
    var snap = ime.snapshot();
    if (k.type === 'jamo') ime.input(k.j); else if (k.type === 'space') ime.space(); else if (k.type === 'char') ime.char(k.ch);
    var tk = HT.keysOf(ime.value);
    if (!HT.isPrefix(tk, it.keys)) {
      ime.restore(snap); R.bad++; HT.Sfx.wrong();
      var el = HT.$('#rc-typed'); el.classList.remove('bad'); void el.offsetWidth; el.classList.add('bad');
      return;
    }
    R.ok++; HT.Sfx.tick();
    if (tk.length === it.keys.length) {
      R.doneKeys += it.keys.length; ime.reset();
      if (HT.WORD_INDEX[it.text]) P.wordsTyped += 1;
      HT.Sfx.ok(); HT.Speech.say(it.text);
      if (R.idx < R.course.items.length - 1) R.idx++;
    }
    renderTarget();
  }

  // ---- 그리기 ----
  function draw() {
    var x0 = W < 600 ? 92 : 130, x1 = W - 36, top = 26, laneH = (H - top - 14) / R.racers.length;
    ctx.fillStyle = '#00B543'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#008751'; for (var gx = 0; gx < W; gx += 20) ctx.fillRect(gx, 0, 10, 8);
    // 관중석 대신 상단 깃발
    var flagCols = ['#FF004D', '#FFEC27', '#29ADFF', '#FF77A8'];
    for (var f = 0; f < W; f += 28) { ctx.fillStyle = flagCols[(f / 28) % 4]; ctx.beginPath(); ctx.moveTo(f, 10); ctx.lineTo(f + 22, 10); ctx.lineTo(f + 11, 22); ctx.fill(); }
    R.racers.forEach(function (r, i) {
      var y = top + i * laneH;
      ctx.fillStyle = r.me ? '#C75B3A' : '#AB5236'; ctx.fillRect(0, y, W, laneH - 2);
      ctx.fillStyle = 'rgba(255,241,232,0.8)'; ctx.fillRect(0, y + laneH - 3, W, 2);
      // 이름표
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.font = Math.round(laneH * 0.3) + 'px ' + HT.FONT_KO;
      ctx.fillStyle = r.me ? '#FFEC27' : '#FFF1E8';
      ctx.fillText((r.me ? '★ ' : '') + r.name, 8, y + laneH * 0.36);
      ctx.font = Math.round(laneH * 0.2) + 'px ' + HT.FONT_KO;
      ctx.fillStyle = 'rgba(255,241,232,0.85)';
      var kpmTxt = r.me ? (liveKpm() + ' ' + HT.t('speedUnit')) : (r.kpm + ' ' + HT.t('speedUnit'));
      ctx.fillText(kpmTxt, 8, y + laneH * 0.72);
    });
    // 출발선, 결승선
    ctx.fillStyle = '#FFF1E8'; ctx.fillRect(x0 - 2, top, 3, H - top - 14);
    for (var cy = top, n = 0; cy < H - 14; cy += 8, n++) {
      ctx.fillStyle = n % 2 ? '#1D2B53' : '#FFFFFF'; ctx.fillRect(x1, cy, 8, 8);
      ctx.fillStyle = n % 2 ? '#FFFFFF' : '#1D2B53'; ctx.fillRect(x1 + 8, cy, 8, 8);
    }
    // 먼지
    R.dust.forEach(function (d) {
      var i = R.racers.indexOf(d.lane), y = top + i * laneH + laneH * 0.7;
      ctx.globalAlpha = d.life * 1.4; ctx.fillStyle = '#FFE0B0';
      ctx.fillRect(x0 + d.x * (x1 - x0) - 22 - (0.5 - d.life) * 40, y, 5, 5);
    });
    ctx.globalAlpha = 1;
    // 선수
    R.racers.forEach(function (r, i) {
      var y = top + i * laneH + laneH * 0.48, x = x0 + r.shown * (x1 - x0 - 10);
      var running = R.state === 'run' && !r.fin && !(r.stumble > 0) && (r.me ? true : true);
      var bob = running ? Math.abs(Math.sin(R.t * 14 + i)) * laneH * 0.12 : 0;
      var size = Math.round(laneH * 0.62);
      ctx.save(); ctx.translate(x, y - bob); ctx.scale(-1, 1);
      if (r.stumble > 0) ctx.rotate(0.6);
      ctx.font = size + 'px ' + HT.FONT_EMOJI; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(r.emoji, 0, 0);
      ctx.restore();
      if (r.stumble > 0) { ctx.font = Math.round(size * 0.5) + 'px ' + HT.FONT_EMOJI; ctx.fillText('💫', x, y - size * 0.6); }
      if (r.fin) {
        var place = placeOf(r);
        ctx.font = Math.round(size * 0.55) + 'px ' + HT.FONT_EMOJI; ctx.textAlign = 'center';
        ctx.fillText(place === 1 ? '🥇' : place === 2 ? '🥈' : place === 3 ? '🥉' : '🏅', x - size * 0.9, y);
      }
    });
    if (R.state === 'count') {
      var n2 = Math.ceil(R.cd), txt = n2 > 0 ? String(n2) : HT.t('go');
      ctx.font = Math.round(H * 0.22) + 'px ' + HT.FONT_PIXEL + ', ' + HT.FONT_KO; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 10; ctx.strokeStyle = '#1D2B53'; ctx.strokeText(txt, W / 2, H / 2);
      ctx.fillStyle = '#FFEC27'; ctx.fillText(txt, W / 2, H / 2);
    }
  }

  function placeOf(r) {
    var finished = R.racers.filter(function (x) { return x.fin; }).sort(function (a, b) { return a.fin - b.fin; });
    var i = finished.indexOf(r);
    if (i >= 0) return i + 1;
    var rest = R.racers.filter(function (x) { return !x.fin; }).sort(function (a, b) { return b.prog - a.prog; });
    return finished.length + rest.indexOf(r) + 1;
  }
  function liveKpm() {
    if (R.state !== 'run' && R.state !== 'over') return 0;
    var secs = ((R.state === 'over' ? R.endAt : performance.now()) - R.t0) / 1000;
    return secs > 1 ? Math.round(myKeys() / (secs / 60)) : 0;
  }

  // ---- 글자 표시 ----
  function renderTarget() {
    var it = curItem(), el = HT.$('#rc-target');
    if (R.state === 'setup') { el.innerHTML = ''; return; }
    var done = ime.text.length, full = HT.keysOf(ime.value).length === it.keys.length;
    var nextItems = R.course.items.slice(R.idx + 1, R.idx + 3).map(function (n) { return HT.esc(n.text); }).join(' · ');
    el.innerHTML = '<div class="rt-main">' + (it.emoji ? '<span class="rt-emoji">' + it.emoji + '</span>' : '') +
      '<span class="target">' + it.text.split('').map(function (ch, i) {
        var cls = full || i < done ? 'done' : i === done ? 'cur' : '';
        return '<span class="ch ' + cls + (ch === ' ' ? ' sp' : '') + '">' + (ch === ' ' ? '·' : HT.esc(ch)) + '</span>';
      }).join('') + '</span>' + (it.en ? '<span class="rt-en">' + HT.esc(it.en) + '</span>' : '') + '</div>' +
      (nextItems ? '<div class="rt-next">→ ' + nextItems + '</div>' : '');
  }
  function hud() {
    var place = R.state === 'run' || R.state === 'over' ? placeOf(R.me) : 0;
    var pct = Math.round(R.me.prog * 100);
    var s = '<span class="hud-i"><small>' + HT.esc(HT.t('speed')) + '</small><b>' + liveKpm() + '</b></span>' +
      '<span class="hud-i"><small>%</small><b>' + pct + '</b></span>' +
      (place ? '<span class="hud-i"><small>' + HT.esc(HT.L('순위', 'Place')) + '</small><b>' + place + '</b></span>' : '');
    if (s !== hudCache) { HT.$('#rc-hud').innerHTML = s; hudCache = s; }
    var comp = ime.compChar();
    var typed = ime.value ? HT.esc(ime.text).replace(/ /g, '&nbsp;') + (comp ? '<span class="comp">' + HT.esc(comp) + '</span>' : '') : '<span class="ph">' + HT.esc(HT.t('typeHere')) + '</span>';
    if (typed !== typedCache) { HT.$('#rc-typed').innerHTML = typed; typedCache = typed; }
    var nk = cfg.hint && R.state === 'run' ? curItem().keys[HT.keysOf(ime.value).length] || null : null;
    if (nk !== hintCache) { HT.showNextKey(kb, HT.$('#rc-hintline'), nk); hintCache = nk; }
    if (HT.debugOn) {
      var dbg = HT.$('#rc-debug'); dbg.hidden = false;
      dbg.textContent = 'avg ' + HT.Store.playerKpm() + ' · rivals ' + R.racers.filter(function (r) { return !r.me; }).map(function (r) { return r.kpm; }).join('/') + ' · keys ' + myKeys() + '/' + R.course.total;
    }
  }
  function loop(ts) {
    raf = requestAnimationFrame(loop);
    var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0; last = ts;
    update(dt); draw(); hud();
  }

  // ---- 설정/시작/끝 ----
  function setup() {
    var ov = HT.$('#rc-setup');
    ov.innerHTML = '<div class="ov-box"><h3>🏁 ' + HT.esc(HT.t('race')) + '</h3><p>' + HT.esc(HT.t('raceDesc')) + '</p>' +
      '<p class="lbl">' + HT.esc(HT.t('content')) + '</p>' + HT.segmented('rs-content', [['word', HT.t('cWord')], ['sent', HT.t('cSent')]], cfg.content) +
      '<p class="lbl">' + HT.esc(HT.t('diffSel')) + '</p>' + HT.segmented('rs-diff', [['easy', HT.t('easy')], ['normal', HT.t('normal')], ['hard', HT.t('hard')]], cfg.diff) +
      '<p class="lbl">' + HT.esc(HT.t('lengthSel')) + '</p>' + HT.segmented('rs-dist', [['short', HT.t('short')], ['normal', HT.t('normal')], ['long', HT.t('long')]], cfg.dist) +
      '<p class="note" id="rs-note"></p>' +
      '<button type="button" class="btn primary big" id="rc-start">' + HT.esc(HT.t('start')) + '</button></div>';
    function note() { HT.$('#rs-note').textContent = HT.t('rivalNote', { n: HT.Store.playerKpm() }) + ' → ' + rivalKpms().join(' / '); }
    HT.bindSegmented(ov, 'rs-content', function (v) { cfg.content = v; saveCfg(); });
    HT.bindSegmented(ov, 'rs-diff', function (v) { cfg.diff = v; saveCfg(); note(); });
    HT.bindSegmented(ov, 'rs-dist', function (v) { cfg.dist = v; saveCfg(); });
    note();
    HT.$('#rc-start').onclick = start;
    ov.hidden = false;
  }
  function saveCfg() { P.gameCfg.race = cfg; HT.Store.save(); }
  function start() {
    HT.Sfx.ensure(); HT.Sfx.click();
    R = newRace(); R.state = 'count'; R.cd = 3; ime.reset();
    HT.$('#rc-setup').hidden = true; HT.$('#rc-over').hidden = true;
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    renderTarget();
  }
  function finish() {
    R.state = 'over'; R.endAt = performance.now();
    var place = placeOf(R.me), kpm = liveKpm(), acc = R.ok + R.bad ? Math.round(R.ok / (R.ok + R.bad) * 100) : 100;
    if (place === 1) { P.raceWins++; HT.Sfx.fanfare(); } else HT.Sfx.ok();
    // 비정상적으로 큰 값(기계 입력 등)이 실력 평균을 망치지 않도록 상한을 둠
    var counted = Math.min(kpm, C.cpuKpmMax);
    if (acc >= C.minAccuracyToCount && counted > 0) { P.raceKpms.push(counted); P.raceKpms = P.raceKpms.slice(-20); }
    P.bestSpeed = Math.max(P.bestSpeed, counted);
    P.keysTyped += R.ok;
    HT.Store.touchDay(); HT.Store.save();
    var order = R.racers.slice().sort(function (a, b) { return placeOf(a) - placeOf(b); });
    var ov = HT.$('#rc-over');
    ov.innerHTML = '<div class="ov-box"><h3>' + HT.esc(HT.t('raceDone')) + '</h3>' +
      '<p class="place">' + (place === 1 ? '🥇' : place === 2 ? '🥈' : place === 3 ? '🥉' : '🏅') + ' ' + HT.esc(HT.t('rank', { n: place })) + '</p>' +
      '<ol class="podium">' + order.map(function (r) {
        return '<li' + (r.me ? ' class="me"' : '') + '><span>' + r.emoji + ' ' + HT.esc(r.name) + '</span><small>' + (r.me ? kpm : r.kpm) + ' ' + HT.esc(HT.t('speedUnit')) + '</small></li>';
      }).join('') + '</ol>' +
      '<div class="statbar"><div class="stat"><small>' + HT.esc(HT.t('yourSpeed')) + '</small><b>' + kpm + '</b></div>' +
      '<div class="stat"><small>' + HT.esc(HT.t('acc')) + '</small><b>' + acc + '%</b></div></div>' +
      '<p class="tipbox">' + HT.tipHTML(HT.randomTip()) + '</p>' +
      '<div class="actions"><button type="button" class="btn primary" id="rc-again">' + HT.esc(HT.t('retry')) + '</button>' +
      '<button type="button" class="btn" id="rc-setup-b">' + HT.esc(HT.t('content')) + '</button></div></div>';
    ov.hidden = false;
    HT.$('#rc-again').onclick = start;
    HT.$('#rc-setup-b').onclick = function () { ov.hidden = true; R = newRace(); renderTarget(); setup(); };
    HT.checkBadges();
  }

  HT._gameCtl = {
    levelUp: function () { /* 레이스에는 레벨 없음 */ },
    heart: function () {},
    god: function () { R.me.prog = Math.min(1, R.me.prog + 0.1); R.doneKeys = Math.round(R.course.total * R.me.prog); },
    end: function () { if (R.state === 'run') { R.doneKeys = R.course.total; ime.reset(); } }
  };

  view.onclick = function (e) {
    if (e.target.closest('[data-back]')) return HT.go('home');
    var hb = e.target.closest('#rc-hint');
    if (hb) { cfg.hint = !cfg.hint; hb.setAttribute('aria-pressed', String(cfg.hint)); hintCache = undefined; saveCfg(); }
  };
  addEventListener('resize', resize);
  resize(); setup(); renderTarget();
  HT.inputHandler = onKey;
  raf = requestAnimationFrame(loop);
  return function () { cancelAnimationFrame(raf); removeEventListener('resize', resize); view.onclick = null; HT._gameCtl = null; HT._raceDebug = null; };
};
