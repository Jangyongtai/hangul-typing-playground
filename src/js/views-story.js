// 동화 긴 글 (타자 검정): 정해진 시간 동안 동화를 한 줄씩 칩니다.
// 문장부호와 따옴표는 자동으로 채워집니다(화면 자판에 없기 때문).
var HT = globalThis.HT = globalThis.HT || {};
HT.Views = HT.Views || {};

HT.isTypable = function (ch) {
  var c = ch.charCodeAt(0);
  return ch === ' ' || (c >= 0xAC00 && c <= 0xD7A3) || (c >= 0x3131 && c <= 0x318E);
};

HT.Views.storyMenu = function () {
  var view = HT.$('#view'), d = HT.Store.data(), C = HT.CONFIG.story;
  var minutes = d.gameCfg.storyMin || C.defaultMinutes;
  view.innerHTML = '<div class="bar"><button type="button" class="btn small" data-back>← ' + HT.esc(HT.t('back')) + '</button><h2>' + HT.esc(HT.t('story')) + '</h2></div>' +
    '<div class="panel story-opts"><span class="lbl">' + HT.esc(HT.t('timeSel')) + '</span>' +
    HT.segmented('st-min', C.minuteChoices.map(function (m) { return [String(m), HT.t('minutes', { n: m })]; }), String(minutes)) + '</div>' +
    '<div class="cards stories">' + HT.STORIES.map(function (s) {
      var best = d.storyBest[s.id];
      return '<button type="button" class="mode-card" data-story="' + s.id + '"><span class="glyph">' + s.emoji + '</span><span class="mc-t">' +
        HT.esc(HT.L(s.ko, s.en)) + '</span><span class="mc-d">' + HT.esc(HT.lang === 'ko' ? s.en : s.ko) + '</span>' +
        (best ? '<span class="mc-best">🏅 ' + best + '</span>' : '') + '</button>';
    }).join('') + '</div>';
  HT.bindSegmented(view, 'st-min', function (v) { d.gameCfg.storyMin = +v; minutes = +v; HT.Store.save(); });
  view.onclick = function (e) {
    if (e.target.closest('[data-back]')) return HT.go('home');
    var b = e.target.closest('[data-story]'); if (!b) return;
    HT.Sfx.click();
    HT.go('story', { id: b.dataset.story, minutes: minutes });
  };
  return function () { view.onclick = null; };
};

HT.Views.story = function (arg) {
  var view = HT.$('#view'), story = HT.STORIES.filter(function (s) { return s.id === arg.id; })[0];
  var ime = new HT.Hangul(), lineIdx = 0, ok = 0, bad = 0, t0 = 0, limit = arg.minutes * 60, timer = 0, ended = false, doneKeys = 0;
  var lines = story.lines.map(function (t) { return { text: t, keys: HT.keysOf(t) }; });
  var totalKeys = lines.reduce(function (a, l) { return a + l.keys.filter(function (k) { return HT.isTypable(k); }).length; }, 0);

  view.innerHTML = '<section class="pv pv-story">' +
    '<div class="bar"><button type="button" class="btn small" data-back>← ' + HT.esc(HT.t('back')) + '</button><h2>' + story.emoji + ' ' + HT.esc(HT.L(story.ko, story.en)) + '</h2>' +
    '<div class="meters"><span class="meter"><small>' + HT.esc(HT.t('timeLeft')) + '</small><b id="sv-time"></b></span>' +
    '<span class="meter"><small>' + HT.esc(HT.t('speed')) + '</small><b id="sv-speed">0</b></span>' +
    '<span class="meter"><small>' + HT.esc(HT.t('acc')) + '</small><b id="sv-acc">100%</b></span></div></div>' +
    '<div class="progress" aria-hidden="true"><div id="sv-prog"></div></div>' +
    '<div class="card story-card"><p class="sv-prev" id="sv-prev"></p><div class="target" id="sv-line"></div><p class="sv-next" id="sv-next"></p></div>' +
    '<div class="typed" id="sv-typed"></div><p class="hintline" id="sv-hint">&nbsp;</p><div id="sv-kb"></div>' +
    '<p class="note">' + HT.esc(HT.t('punctNote')) + '</p></section>';
  var kb = HT.Keyboard(HT.$('#sv-kb'), onKey);

  // 다음 글자가 문장부호면 자동으로 채움
  function autoFill() {
    var l = lines[lineIdx], tk = HT.keysOf(ime.value);
    while (tk.length < l.keys.length && !HT.isTypable(l.keys[tk.length])) {
      ime.char(l.keys[tk.length]);
      tk = HT.keysOf(ime.value);
    }
  }
  function lineDone() { return HT.keysOf(ime.value).length === lines[lineIdx].keys.length; }
  function showLine() {
    ime.reset(); autoFill();
    HT.$('#sv-prev').textContent = lineIdx > 0 ? lines[lineIdx - 1].text : '';
    HT.$('#sv-next').textContent = lineIdx + 1 < lines.length ? lines[lineIdx + 1].text : '';
    render();
  }
  function elapsed() { return t0 ? (performance.now() - t0) / 1000 : 0; }
  function typedKeysNow() { return doneKeys + HT.keysOf(ime.value).filter(function (k) { return HT.isTypable(k); }).length; }
  function render() {
    var l = lines[lineIdx], done = ime.text.length, full = lineDone();
    HT.$('#sv-line').innerHTML = l.text.split('').map(function (ch, i) {
      var cls = full || i < done ? 'done' : i === done ? 'cur' : '';
      if (!HT.isTypable(ch)) cls += ' punct';
      return '<span class="ch ' + cls + (ch === ' ' ? ' sp' : '') + '">' + (ch === ' ' ? '·' : HT.esc(ch)) + '</span>';
    }).join('');
    var comp = ime.compChar();
    HT.$('#sv-typed').innerHTML = ime.value ? HT.esc(ime.text).replace(/ /g, '&nbsp;') + (comp ? '<span class="comp">' + HT.esc(comp) + '</span>' : '') :
      '<span class="ph">' + HT.esc(HT.t('typeHere')) + '</span>';
    HT.showNextKey(kb, HT.$('#sv-hint'), ended ? null : l.keys[HT.keysOf(ime.value).length]);
    HT.$('#sv-prog').style.width = Math.round(typedKeysNow() / totalKeys * 100) + '%';
    tick();
  }
  function tick() {
    var left = Math.max(0, limit - elapsed());
    HT.$('#sv-time').textContent = Math.floor(left / 60) + ':' + String(Math.floor(left % 60)).padStart(2, '0');
    var mins = elapsed() / 60;
    HT.$('#sv-speed').textContent = mins > 0.05 ? Math.round(typedKeysNow() / mins) : 0;
    HT.$('#sv-acc').textContent = (ok + bad ? Math.round(ok / (ok + bad) * 100) : 100) + '%';
    if (t0 && left <= 0 && !ended) finish(false);
  }
  function onKey(k) {
    if (ended || k.type === 'esc' || k.type === 'enter' || k.type === 'char') return;
    if (!t0) { t0 = performance.now(); timer = setInterval(tick, 250); }
    var l = lines[lineIdx];
    if (k.type === 'bs') {
      ime.backspace();
      // 지운 뒤 끝이 문장부호만 남으면 그것도 지워서 자모를 다시 칠 수 있게 함
      while (ime.value && !HT.isTypable(ime.value.slice(-1)) && ime.text.length) { ime.text = ime.text.slice(0, -1); }
      HT.Sfx.tick(); render(); return;
    }
    var snap = ime.snapshot();
    if (k.type === 'jamo') ime.input(k.j); else if (k.type === 'space') ime.space();
    var tk = HT.keysOf(ime.value);
    if (!HT.isPrefix(tk, l.keys)) { ime.restore(snap); bad++; HT.Sfx.wrong(); var el = HT.$('#sv-typed'); el.classList.remove('bad'); void el.offsetWidth; el.classList.add('bad'); render(); return; }
    ok++; HT.Sfx.tick();
    autoFill();
    if (lineDone()) {
      doneKeys += l.keys.filter(function (x) { return HT.isTypable(x); }).length;
      HT.Sfx.ok();
      if (lineIdx + 1 >= lines.length) { render(); finish(true); return; }
      lineIdx++; showLine(); return;
    }
    render();
  }
  function finish(complete) {
    ended = true; clearInterval(timer);
    var secs = Math.min(elapsed(), limit), kpm = Math.round(typedKeysNow() / Math.max(secs / 60, 0.01));
    var acc = ok + bad ? Math.round(ok / (ok + bad) * 100) : 100, d = HT.Store.data();
    kpm = Math.min(kpm, HT.CONFIG.race.cpuKpmMax);
    d.storyBest[story.id] = Math.max(d.storyBest[story.id] || 0, kpm);
    d.bestSpeed = Math.max(d.bestSpeed, kpm);
    d.keysTyped += ok;
    HT.Store.touchDay(); HT.Store.save(); HT.checkBadges();
    var stars = acc >= HT.CONFIG.practice.stars.three ? 3 : acc >= HT.CONFIG.practice.stars.two ? 2 : 1;
    HT.go('result', {
      title: complete ? HT.t('storyDone') : HT.t('timeUp'), stars: stars, speed: kpm, acc: acc, secs: secs,
      extra: HT.t('linesDone', { n: complete ? lines.length : lineIdx, m: lines.length }),
      cfg: { again: function () { HT.go('story', arg); }, next: null, menu: 'storyMenu' }
    });
  }
  view.onclick = function (e) { if (e.target.closest('[data-back]')) HT.go('storyMenu'); };
  HT.inputHandler = onKey;
  showLine();
  return function () { clearInterval(timer); view.onclick = null; };
};
