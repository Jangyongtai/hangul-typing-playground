// 화면들: 사용자 고르기, 처음 화면, 연습 목록, 연습, 결과
var HT = globalThis.HT = globalThis.HT || {};
HT.Views = HT.Views || {};

// ---- 사용자 고르기/만들기 ----
HT.Views.profiles = function () {
  var view = HT.$('#view'), db = HT.Store.db, avatar = HT.AVATARS[0], confirmId = null;
  function render() {
    view.innerHTML = '<section class="panel profiles">' +
      '<h2>' + HT.esc(HT.t('whoPlays')) + '</h2>' +
      '<div class="profile-grid">' + db.profiles.map(function (p) {
        return '<div class="profile-card"><button type="button" class="pf-use" data-id="' + p.id + '"><span class="pf-av">' + p.avatar +
          '</span><span class="pf-name">' + HT.esc(p.name) + '</span></button>' +
          (confirmId === p.id
            ? '<div class="pf-confirm"><small>' + HT.esc(HT.t('delConfirm')) + '</small><button type="button" class="btn small danger pf-yes" data-id="' + p.id + '">' + HT.esc(HT.t('yesDel')) + '</button><button type="button" class="btn small pf-no">' + HT.esc(HT.t('cancel')) + '</button></div>'
            : '<button type="button" class="pf-del" data-id="' + p.id + '" aria-label="' + HT.esc(HT.t('del')) + '">✕</button>') +
          '</div>';
      }).join('') + '</div>' +
      '<form class="new-profile" id="pf-form" autocomplete="off">' +
      '<h3>' + HT.esc(HT.t('newProfile')) + '</h3>' +
      '<label for="pf-name">' + HT.esc(HT.t('yourName')) + '</label>' +
      '<input id="pf-name" maxlength="10" placeholder="' + HT.esc(HT.L('예: 하늘', 'e.g. Sky')) + '">' +
      '<p class="lbl">' + HT.esc(HT.t('pickAvatar')) + '</p>' +
      '<div class="avatar-pick">' + HT.AVATARS.map(function (a) {
        return '<button type="button" class="av-b" data-a="' + a + '" aria-pressed="' + (a === avatar) + '">' + a + '</button>';
      }).join('') + '</div>' +
      '<p class="form-err" id="pf-err" hidden></p>' +
      '<button type="submit" class="btn primary">' + HT.esc(HT.t('create')) + '</button>' +
      '</form></section>';
  }
  render();
  view.onclick = function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.classList.contains('pf-use')) { HT.Sfx.click(); HT.Store.use(b.dataset.id); HT.go('home'); }
    else if (b.classList.contains('pf-del')) { confirmId = b.dataset.id; render(); }
    else if (b.classList.contains('pf-no')) { confirmId = null; render(); }
    else if (b.classList.contains('pf-yes')) { HT.Store.removeProfile(b.dataset.id); confirmId = null; render(); HT.renderHeader(); }
    else if (b.classList.contains('av-b')) {
      avatar = b.dataset.a; HT.Sfx.click();
      view.querySelectorAll('.av-b').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    }
  };
  view.onsubmit = function (e) {
    e.preventDefault();
    var name = HT.$('#pf-name').value.trim();
    if (!name) { var er = HT.$('#pf-err'); er.textContent = HT.t('nameNeeded'); er.hidden = false; return; }
    HT.Store.addProfile(name.slice(0, 10), avatar);
    HT.Sfx.star();
    HT.go('home');
  };
  return function () { view.onclick = null; view.onsubmit = null; };
};

// ---- 처음 화면 ----
HT.Views.home = function () {
  var view = HT.$('#view'), p = HT.Store.profile(), d = HT.Store.data();
  var best = Math.max(d.best.rain || 0, d.best.balloon || 0);
  function card(route, glyph, title, desc, extra) {
    return '<button type="button" class="mode-card" data-go="' + route + '"><span class="glyph">' + glyph + '</span>' +
      '<span class="mc-t">' + HT.esc(title) + '</span><span class="mc-d">' + HT.esc(desc) + '</span>' + (extra || '') + '</button>';
  }
  view.innerHTML =
    '<section class="hero"><div class="mascot" aria-hidden="true">' + p.avatar + '</div>' +
    '<p class="bubble">' + HT.esc(HT.t('hello', { name: p.name })) + '</p></section>' +
    '<section class="statbar">' +
    '<div class="stat"><small>' + HT.esc(HT.t('streak')) + '</small><b>🔥 ' + HT.esc(HT.t('days', { n: d.streak })) + '</b></div>' +
    '<div class="stat"><small>' + HT.esc(HT.t('starsLbl')) + '</small><b>⭐ ' + HT.Store.totalStars() + '</b></div>' +
    '<div class="stat"><small>' + HT.esc(HT.t('wordsLbl')) + '</small><b>📚 ' + d.wordsTyped + '</b></div>' +
    '<div class="stat"><small>' + HT.esc(HT.t('bestLbl')) + '</small><b>🏆 ' + best + '</b></div></section>' +
    '<h2 class="sec">' + HT.esc(HT.t('practice')) + '</h2><div class="cards">' +
    card('keysMenu', 'ㄱ', HT.t('keys'), HT.t('keysDesc')) +
    card('wordsMenu', '가', HT.t('words'), HT.t('wordsDesc')) +
    card('sentence', '글', HT.t('sent'), HT.t('sentDesc')) +
    card('storyMenu', '📖', HT.t('story'), HT.t('storyDesc')) + '</div>' +
    '<h2 class="sec">' + HT.esc(HT.t('games')) + '</h2><div class="cards games">' +
    card('rain', '☔', HT.t('rain'), HT.t('rainDesc'), '<span class="mc-best">🏆 ' + (d.best.rain || 0) + '</span>') +
    card('balloon', '🎈', HT.t('balloon'), HT.t('balloonDesc'), '<span class="mc-best">🏆 ' + (d.best.balloon || 0) + '</span>') +
    card('race', '🏁', HT.t('race'), HT.t('raceDesc'), '<span class="mc-best">🥇 ' + d.raceWins + '</span>') + '</div>' +
    '<p class="more">' + HT.esc(HT.t('moreGames')) + '</p>' +
    '<h2 class="sec">' + HT.esc(HT.t('badges')) + '</h2><div class="badges">' + HT.BADGES.map(function (b) {
      var on = d.badges.indexOf(b.id) >= 0;
      return '<div class="badge' + (on ? ' on' : '') + '"><span>' + (on ? b.emoji : '🔒') + '</span><small>' + HT.esc(HT.L(b.ko, b.en)) + '</small></div>';
    }).join('') + '</div>';
  view.onclick = function (e) {
    var b = e.target.closest('[data-go]'); if (!b) return;
    HT.Sfx.click();
    var r = b.dataset.go;
    if (r === 'sentence') HT.startSentences(); else HT.go(r);
  };
  return function () { view.onclick = null; };
};

// ---- 자리 익히기 단계 목록 ----
HT.Views.keysMenu = function () {
  var view = HT.$('#view'), d = HT.Store.data();
  view.innerHTML = '<div class="bar"><button type="button" class="btn small" data-back>← ' + HT.esc(HT.t('back')) + '</button><h2>' + HT.esc(HT.t('keys')) + '</h2></div>' +
    '<div class="cards stages">' + HT.STAGES.map(function (s, i) {
      return '<button type="button" class="mode-card stage" data-stage="' + i + '"><span class="st-no">' + HT.esc(HT.t('stage')) + ' ' + (i + 1) + '</span>' +
        '<span class="glyph small">' + (s.jamo ? s.jamo.split('').join(' ') : s.syl === 'batchim' ? '각 난 달' : '가 나 다') + '</span>' +
        '<span class="mc-t">' + HT.esc(HT.L(s.ko, s.en)) + '</span>' + HT.starsHTML(d.stars['keys-' + s.id] || 0) + '</button>';
    }).join('') + '</div>';
  view.onclick = function (e) {
    if (e.target.closest('[data-back]')) return HT.go('home');
    var b = e.target.closest('[data-stage]'); if (!b) return;
    HT.Sfx.click();
    HT.startKeysStage(+b.dataset.stage);
  };
  return function () { view.onclick = null; };
};

// ---- 낱말 주제 목록 ----
HT.Views.wordsMenu = function () {
  var view = HT.$('#view'), d = HT.Store.data(), missedN = Object.keys(d.missed).filter(function (w) { return HT.WORD_INDEX[w]; }).length;
  view.innerHTML = '<div class="bar"><button type="button" class="btn small" data-back>← ' + HT.esc(HT.t('back')) + '</button><h2>' + HT.esc(HT.t('words')) + '</h2></div>' +
    '<div class="cards themes">' +
    (missedN ? '<button type="button" class="mode-card review" data-theme="review"><span class="glyph">🔁</span><span class="mc-t">' + HT.esc(HT.t('review')) + ' (' + missedN + ')</span><span class="mc-d">' + HT.esc(HT.t('reviewDesc')) + '</span></button>' : '') +
    HT.THEMES.map(function (th) {
      return '<button type="button" class="mode-card" data-theme="' + th.id + '"><span class="glyph">' + th.emoji + '</span><span class="mc-t">' +
        HT.esc(HT.L(th.ko, th.en)) + '</span><span class="mc-d">' + HT.esc(HT.lang === 'ko' ? th.en : th.ko) + '</span>' + HT.starsHTML(d.stars['words-' + th.id] || 0) + '</button>';
    }).join('') + '</div>';
  view.onclick = function (e) {
    if (e.target.closest('[data-back]')) return HT.go('home');
    var b = e.target.closest('[data-theme]'); if (!b) return;
    HT.Sfx.click();
    HT.startWords(b.dataset.theme);
  };
  return function () { view.onclick = null; };
};

// ---- 문제 만들기 ----
HT.noRepeatNeighbors = function (list) {
  for (var i = 1; i < list.length; i++) {
    if (list[i].text === list[i - 1].text) {
      for (var j = i + 1; j < list.length; j++) {
        if (list[j].text !== list[i - 1].text) { var t = list[i]; list[i] = list[j]; list[j] = t; break; }
      }
    }
  }
  return list;
};

HT.startKeysStage = function (idx) {
  var C = HT.CONFIG.practice, st = HT.STAGES[idx], items;
  if (!st.jamo) {
    items = HT.shuffle(st.syl === 'batchim' ? HT.SYLLABLES_B : HT.SYLLABLES).slice(0, 12).map(function (s) { return { text: s }; });
  } else {
    var pool = st.jamo.split(''), prev = HT.STAGES.slice(0, idx).map(function (s) { return s.jamo; }).join('').split('').filter(Boolean);
    var nReview = prev.length ? Math.round(C.keysPerStage * C.reviewRatio) : 0, list = [];
    while (list.length < C.keysPerStage - nReview) list = list.concat(HT.shuffle(pool));
    list = list.slice(0, C.keysPerStage - nReview);
    for (var i = 0; i < nReview; i++) list.push(HT.pick(prev));
    items = HT.noRepeatNeighbors(HT.shuffle(list).map(function (j) { return { text: j, jamo: true }; }));
  }
  HT.go('practice', {
    kind: 'keys', title: HT.L(st.ko, st.en), starKey: 'keys-' + st.id, items: items, tip: HT.TIPS[st.tip],
    again: function () { HT.startKeysStage(idx); },
    next: idx + 1 < HT.STAGES.length ? function () { HT.startKeysStage(idx + 1); } : null,
    menu: 'keysMenu'
  });
};

HT.startWords = function (themeId) {
  var C = HT.CONFIG.practice, d = HT.Store.data(), items;
  var missed = Object.keys(d.missed).filter(function (w) { return HT.WORD_INDEX[w]; })
    .sort(function (a, b) { return d.missed[b] - d.missed[a]; });
  var title;
  if (themeId === 'review') {
    items = missed.slice(0, C.wordsPerRound).map(function (w) { return HT.WORD_INDEX[w]; });
    title = HT.t('review');
  } else {
    var th = HT.THEMES.filter(function (x) { return x.id === themeId; })[0];
    title = HT.L(th.ko, th.en);
    items = HT.shuffle(HT.ALL_WORDS.filter(function (w) { return w.theme === themeId; })).slice(0, C.wordsPerRound);
    var extra = missed.filter(function (w) { return HT.WORD_INDEX[w].theme !== themeId; }).slice(0, C.reviewInRound);
    extra.forEach(function (w, i) { var at = items.length - 1 - i; if (at >= 0) items[at] = Object.assign({ review: true }, HT.WORD_INDEX[w]); });
    items = HT.shuffle(items);
  }
  HT.go('practice', {
    kind: 'words', title: title, starKey: themeId === 'review' ? null : 'words-' + themeId, items: items,
    again: function () { HT.startWords(themeId); }, next: null, menu: 'wordsMenu'
  });
};

HT.startSentences = function () {
  HT.go('practice', {
    kind: 'sent', title: HT.t('sent'), starKey: 'sent', items: HT.shuffle(HT.SENTENCES).slice(0, HT.CONFIG.practice.sentencesPerRound),
    again: HT.startSentences, next: null, menu: 'home'
  });
};

// ---- 연습 화면 (자리/낱말/문장 공통) ----
// 틀린 키는 받아들이지 않고 소리만 냅니다. 그래서 칸에는 늘 맞게 친 글자만 남습니다.
HT.Views.practice = function (cfg) {
  var view = HT.$('#view'), C = HT.CONFIG.practice, ime = new HT.Hangul();
  var idx = 0, correct = 0, errors = 0, t0 = 0, busy = false, itemErr = false, timer = null;
  var items = cfg.items.map(function (it) { return Object.assign({ keys: HT.keysOf(it.text) }, it); });

  view.innerHTML = '<section class="pv pv-' + cfg.kind + '">' +
    '<div class="bar"><button type="button" class="btn small" data-back>← ' + HT.esc(HT.t('back')) + '</button><h2>' + HT.esc(cfg.title) + '</h2>' +
    '<div class="meters"><span class="meter"><small>' + HT.esc(HT.t('speed')) + '</small><b id="pv-speed">0</b></span>' +
    '<span class="meter"><small>' + HT.esc(HT.t('acc')) + '</small><b id="pv-acc">100%</b></span></div></div>' +
    '<div class="progress" aria-hidden="true"><div id="pv-prog"></div></div>' +
    '<div class="card target-card" id="pv-card"></div>' +
    '<div class="typed" id="pv-typed"></div>' +
    '<p class="hintline" id="pv-hint">&nbsp;</p>' +
    '<p class="tipbox" id="pv-tip"' + (cfg.tip ? '' : ' hidden') + '>' + (cfg.tip ? HT.tipHTML(cfg.tip) : '') + '</p>' +
    '<div id="pv-kb"></div>' +
    '<p class="note">' + HT.esc(HT.t('pressKey')) + ' · ' + HT.esc(HT.t('practiceNote')) + '</p></section>';
  var kb = HT.Keyboard(HT.$('#pv-kb'), onKey), card = HT.$('#pv-card');

  function sayItem(it) {
    if (it.jamo) HT.Speech.say(HT.JINFO[it.text][0]);
    else HT.Speech.say(it.text);
  }
  function showItem() {
    ime.reset(); itemErr = false;
    var it = items[idx], html = '';
    if (it.jamo) {
      var inf = HT.JINFO[it.text];
      html = '<div class="big-jamo">' + it.text + '</div><div class="sub">' + HT.esc(inf[0]) + ' · [' + HT.esc(inf[1]) + ']</div>';
    } else {
      if (it.emoji) html += '<div class="emoji" aria-hidden="true">' + it.emoji + '</div>';
      html += '<div class="target" id="pv-target"></div>';
      if (it.rom || it.en) html += '<div class="sub">' + (it.rom ? '<span class="rom">' + HT.esc(it.rom) + '</span>' : '') + (it.en ? '<span class="en">' + HT.esc(it.en) + '</span>' : '') + '</div>';
      if (it.review) html += '<span class="tag">🔁 ' + HT.esc(HT.t('review')) + '</span>';
    }
    html += '<button type="button" class="say" data-say aria-label="listen">🔊</button><div class="praise" id="pv-praise" hidden></div>';
    card.innerHTML = html;
    card.classList.remove('win');
    sayItem(it);
    renderState();
  }
  function renderState() {
    var it = items[idx];
    var tEl = HT.$('#pv-target');
    if (tEl) {
      var done = ime.text.length, full = HT.keysOf(ime.value).length === it.keys.length;
      tEl.innerHTML = it.text.split('').map(function (ch, i) {
        var cls = full || i < done ? 'done' : i === done ? 'cur' : '';
        return '<span class="ch ' + cls + (ch === ' ' ? ' sp' : '') + '">' + (ch === ' ' ? '·' : HT.esc(ch)) + '</span>';
      }).join('');
    }
    var comp = ime.compChar();
    HT.$('#pv-typed').innerHTML = ime.value ? HT.esc(ime.text).replace(/ /g, '&nbsp;') + (comp ? '<span class="comp">' + HT.esc(comp) + '</span>' : '') :
      '<span class="ph">' + HT.esc(HT.t('typeHere')) + '</span>';
    HT.showNextKey(kb, HT.$('#pv-hint'), busy ? null : it.keys[HT.keysOf(ime.value).length]);
    HT.$('#pv-prog').style.width = (idx / items.length * 100) + '%';
    var mins = t0 ? (performance.now() - t0) / 60000 : 0;
    HT.$('#pv-speed').textContent = mins > 0.02 ? Math.round(correct / mins) : 0;
    HT.$('#pv-acc').textContent = (correct + errors ? Math.round(correct / (correct + errors) * 100) : 100) + '%';
  }
  function onKey(k) {
    if (busy || k.type === 'esc' || k.type === 'enter') return;
    var it = items[idx];
    if (!t0) t0 = performance.now();
    if (k.type === 'bs') { ime.backspace(); HT.Sfx.tick(); renderState(); return; }
    var snap = ime.snapshot();
    if (k.type === 'jamo') ime.input(k.j);
    else if (k.type === 'space') ime.space();
    else if (k.type === 'char') ime.char(k.ch);
    var tk = HT.keysOf(ime.value);
    if (!HT.isPrefix(tk, it.keys)) {
      ime.restore(snap); errors++; itemErr = true; HT.Sfx.wrong();
      card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
      renderState(); return;
    }
    correct++; HT.Sfx.tick();
    if (tk.length === it.keys.length) complete();
    renderState();
  }
  function complete() {
    busy = true;
    var it = items[idx];
    HT.Sfx.ok();
    card.classList.add('win');
    var pr = HT.$('#pv-praise'); var p = HT.pick(HT.PRAISE); pr.textContent = HT.L(p[0], p[1]); pr.hidden = false;
    var d = HT.Store.data();
    d.keysTyped += it.keys.length;
    if (cfg.kind === 'words') { d.wordsTyped += 1; HT.Store.markMiss(it.text, itemErr); }
    if (cfg.kind === 'sent') d.wordsTyped += it.text.split(' ').length;
    var n = idx + 1;
    if (cfg.kind !== 'keys' && n % C.tipEvery === 0 && n < items.length) {
      var tb = HT.$('#pv-tip'); tb.innerHTML = HT.tipHTML(HT.randomTip()); tb.hidden = false;
    }
    timer = setTimeout(function () {
      busy = false; idx++;
      if (idx >= items.length) finish(); else showItem();
    }, C.nextDelayMs[cfg.kind]);
  }
  function finish() {
    var secs = (performance.now() - t0) / 1000, speed = Math.round(correct / Math.max(secs / 60, 0.01));
    var acc = correct + errors ? Math.round(correct / (correct + errors) * 100) : 100;
    var stars = acc >= C.stars.three ? 3 : acc >= C.stars.two ? 2 : 1;
    var d = HT.Store.data();
    if (cfg.starKey) d.stars[cfg.starKey] = Math.max(d.stars[cfg.starKey] || 0, stars);
    if (cfg.kind !== 'keys') d.bestSpeed = Math.max(d.bestSpeed, speed);
    HT.Store.touchDay(); HT.Store.save(); HT.checkBadges();
    HT.go('result', { cfg: cfg, stars: stars, speed: speed, acc: acc, secs: secs });
  }
  view.onclick = function (e) {
    if (e.target.closest('[data-back]')) return HT.go(cfg.menu);
    if (e.target.closest('[data-say]')) sayItem(items[idx]);
  };
  HT.inputHandler = onKey;
  showItem();
  return function () { clearTimeout(timer); view.onclick = null; };
};

// ---- 결과 화면 ----
HT.Views.result = function (r) {
  var view = HT.$('#view');
  var mm = Math.floor(r.secs / 60), ss = Math.round(r.secs % 60);
  view.innerHTML = '<section class="panel result"><h2>' + HT.esc(r.title || HT.t('resultTitle')) + '</h2>' +
    '<div class="big-stars">' + HT.starsHTML(r.stars) + '</div>' + (r.extra ? '<p class="extra">' + HT.esc(r.extra) + '</p>' : '') +
    '<div class="statbar"><div class="stat"><small>' + HT.esc(HT.t('speed')) + '</small><b>' + r.speed + ' <small>' + HT.esc(HT.t('speedUnit')) + '</small></b></div>' +
    '<div class="stat"><small>' + HT.esc(HT.t('acc')) + '</small><b>' + r.acc + '%</b></div>' +
    '<div class="stat"><small>' + HT.esc(HT.t('time')) + '</small><b>' + (mm ? mm + "'" : '') + ss + '"</b></div></div>' +
    '<p class="tipbox">' + HT.tipHTML(HT.randomTip()) + '</p>' +
    '<div class="actions"><button type="button" class="btn primary" data-a="again">' + HT.esc(HT.t('retry')) + '</button>' +
    (r.cfg.next ? '<button type="button" class="btn" data-a="next">' + HT.esc(HT.t('next')) + ' →</button>' : '') +
    '<button type="button" class="btn" data-a="menu">' + HT.esc(HT.t('menu')) + '</button></div></section>';
  HT.Sfx.fanfare();
  view.onclick = function (e) {
    var b = e.target.closest('[data-a]'); if (!b) return;
    HT.Sfx.click();
    if (b.dataset.a === 'again') r.cfg.again();
    else if (b.dataset.a === 'next') r.cfg.next();
    else HT.go(r.cfg.menu);
  };
  HT.inputHandler = function (k) { if (k.type === 'enter') r.cfg.again(); };
  return function () { view.onclick = null; };
};
