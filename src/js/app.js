// 화면 이동, 위쪽 막대(언어/소리), 디버그 패널, 시작
var HT = globalThis.HT = globalThis.HT || {};

HT.route = null;
HT._cleanup = null;
HT.go = function (name, arg) {
  if (HT._cleanup) { try { HT._cleanup(); } catch (e) { console.error(e); } }
  HT._cleanup = null; HT.inputHandler = null; HT.activeKeyboard = null;
  if (!HT.Store.profile() && name !== 'profiles') name = 'profiles';
  HT.route = { name: name, arg: arg };
  var view = HT.$('#view');
  view.className = 'view v-' + name;
  window.scrollTo(0, 0);
  HT._cleanup = HT.Views[name](arg) || null;
  HT.renderHeader();
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
};

HT.renderHeader = function () {
  var s = HT.Store.settings(), p = HT.Store.profile();
  HT.$('#top-actions').innerHTML =
    (p ? '<button type="button" class="btn small who" id="hd-who" title="' + HT.esc(HT.t('change')) + '">' + HT.esc(p.avatar) + ' ' + HT.esc(p.name) + '</button>' : '') +
    '<button type="button" class="btn small" id="hd-lang">' + HT.esc(HT.t('langToggle')) + '</button>' +
    '<button type="button" class="btn small toggle" id="hd-sfx" aria-pressed="' + (s.sound !== false) + '" title="' + HT.esc(HT.t('soundFx')) + '">' + (s.sound !== false ? '🔊' : '🔇') + '</button>' +
    '<button type="button" class="btn small toggle" id="hd-say" aria-pressed="' + (s.speech !== false) + '" title="' + HT.esc(HT.t('readAloud')) + '">🗣️</button>';
  HT.$('#app-title').textContent = HT.t('appName');
  document.documentElement.lang = HT.lang;
  HT.renderSide();
};

// PC는 반응형이 아니라 따로 짠 가로 구성(옆판 + 넓은 본문). 모바일 전용 구성은 다음 단계에서 따로 만듭니다.
HT.layout = (globalThis.innerWidth || 1280) >= 1024 ? 'pc' : 'mobile';
// PC 무대: 1600×900 한 장으로 설계하고 창 크기에 맞춰 통째로 확대·축소 (스크롤 없음)
HT.STAGE = { w: 1600, h: 900 };
HT.stageScale = 1;
HT.fitStage = function () {
  if (HT.layout !== 'pc') return;
  HT.stageScale = Math.min(innerWidth / HT.STAGE.w, innerHeight / HT.STAGE.h);
  document.documentElement.style.setProperty('--stage-scale', HT.stageScale.toFixed(4));
};
HT.NAV = [
  ['home', '🏝️', 'home'], ['keysMenu', 'ㄱ', 'keys'], ['wordsMenu', '가', 'words'], ['sentence', '글', 'sent'], ['storyMenu', '📖', 'story'],
  ['rain', '☔', 'rain'], ['balloon', '🎈', 'balloon'], ['race', '🏁', 'race']
];
HT.renderSide = function () {
  var el = HT.$('#side-body');
  if (!el) return;
  var p = HT.Store.profile();
  if (HT.layout !== 'pc' || !p) { el.innerHTML = ''; return; }
  var d = HT.Store.data(), cur = HT.route && HT.route.name;
  var group = { practice: 'keysMenu wordsMenu practice result storyMenu story', home: 'home' };
  el.innerHTML = '<div class="side-me"><div class="side-av" aria-hidden="true">' + HT.esc(p.avatar) + '</div>' +
    '<div class="side-name">' + HT.esc(p.name) + '</div>' +
    '<div class="side-stats"><span>🔥 ' + HT.esc(HT.t('days', { n: d.streak })) + '</span><span>⭐ ' + HT.Store.totalStars() + '</span><span>📚 ' + d.wordsTyped + '</span></div></div>' +
    '<nav class="side-nav">' + HT.NAV.map(function (n) {
      var on = cur === n[0] || (n[0] === 'sentence' && cur === 'practice' && HT.route.arg && HT.route.arg.kind === 'sent') ||
        (n[0] === 'storyMenu' && cur === 'story') ||
        (n[0] === 'keysMenu' && cur === 'practice' && HT.route.arg && HT.route.arg.kind === 'keys') ||
        (n[0] === 'wordsMenu' && cur === 'practice' && HT.route.arg && HT.route.arg.kind === 'words');
      return '<button type="button" class="nav-b' + (on ? ' on' : '') + '" data-nav="' + n[0] + '"><span class="nav-i">' + n[1] + '</span>' + HT.esc(HT.t(n[2])) + '</button>';
    }).join('') + '</nav>';
};

HT.applySettings = function () {
  var s = HT.Store.settings();
  HT.lang = s.lang || ((navigator.language || 'ko').toLowerCase().indexOf('ko') === 0 ? 'ko' : 'en');
  HT.Sfx.on = s.sound !== false;
  HT.Speech.on = s.speech !== false;
};

// ---- 디버그 패널: 주소 끝 #debug 또는 로고 5번 누르기 ----
HT.debugOn = false;
HT.openDebug = function () {
  HT.debugOn = true;
  var el = HT.$('#debug-panel');
  el.hidden = false;
  el.innerHTML = '<div class="dbg-head"><b>🛠 ' + HT.esc(HT.t('debug')) + '</b><button type="button" class="btn small" id="dbg-close">✕</button></div>' +
    '<div class="dbg-row"><button type="button" class="btn small" data-dbg="levelUp">LV +1</button><button type="button" class="btn small" data-dbg="heart">♥ +1</button>' +
    '<button type="button" class="btn small" data-dbg="god">GOD / +10%</button><button type="button" class="btn small" data-dbg="end">END</button></div>' +
    '<label for="dbg-cfg">CONFIG (JSON) — 바꾼 값만 저장돼요 / only changed values are saved</label>' +
    '<textarea id="dbg-cfg" spellcheck="false"></textarea>' +
    '<div class="dbg-row"><button type="button" class="btn small primary" id="dbg-save">저장 Save</button><button type="button" class="btn small" id="dbg-reset">기본값 Reset</button>' +
    '<button type="button" class="btn small danger" id="dbg-wipe">기록 전체 삭제 Wipe data</button></div><p class="dbg-msg" id="dbg-msg"></p>';
  HT.$('#dbg-cfg').value = JSON.stringify(HT.CONFIG, null, 2);
  el.onclick = function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var msg = HT.$('#dbg-msg');
    if (b.id === 'dbg-close') { el.hidden = true; HT.debugOn = false; document.querySelectorAll('.debug-hud').forEach(function (d) { d.hidden = true; }); return; }
    if (b.dataset.dbg) { if (HT._gameCtl) HT._gameCtl[b.dataset.dbg](); else msg.textContent = '게임 화면에서 쓰세요 / open a game first'; return; }
    if (b.id === 'dbg-save') {
      try {
        var next = JSON.parse(HT.$('#dbg-cfg').value);
        var diff = HT.configDiff(HT.DEFAULT_CONFIG, next);
        localStorage.setItem(HT.CONFIG_KEY, JSON.stringify(diff));
        HT.loadConfig();
        msg.textContent = '저장됨. 다음 판부터 적용 / Saved. Applies from the next round.';
      } catch (err) { msg.textContent = 'JSON 오류 / JSON error: ' + err.message; }
    }
    if (b.id === 'dbg-reset') {
      try { localStorage.removeItem(HT.CONFIG_KEY); } catch (e2) { /* 무시 */ }
      HT.loadConfig(); HT.$('#dbg-cfg').value = JSON.stringify(HT.CONFIG, null, 2); msg.textContent = '기본값으로 되돌림 / Reset to defaults';
    }
    if (b.id === 'dbg-wipe') {
      if (b.dataset.armed) { try { localStorage.removeItem(HT.Store.KEY); } catch (e3) { /* 무시 */ } HT.Store.load(); HT.go('profiles'); msg.textContent = 'wiped'; }
      else { b.dataset.armed = '1'; b.textContent = '한 번 더 누르면 삭제 / Tap again'; }
    }
  };
};
HT.configDiff = function (base, next) {
  var out = {};
  Object.keys(next).forEach(function (k) {
    if (!(k in base)) return;
    var b = base[k], n = next[k];
    if (b && typeof b === 'object' && !Array.isArray(b) && n && typeof n === 'object') {
      var sub = HT.configDiff(b, n);
      if (Object.keys(sub).length) out[k] = sub;
    } else if (JSON.stringify(b) !== JSON.stringify(n)) out[k] = n;
  });
  return out;
};

HT.boot = function () {
  document.documentElement.classList.add(HT.layout);
  HT.fitStage();
  addEventListener('resize', HT.fitStage);
  HT.Store.load();
  HT.$('#side-body').addEventListener('click', function (e) {
    var b = e.target.closest('[data-nav]'); if (!b) return;
    HT.Sfx.click();
    if (b.dataset.nav === 'sentence') HT.startSentences(); else HT.go(b.dataset.nav);
  });
  HT.applySettings();
  HT.Speech.init();
  var logoTaps = 0, logoT = 0;
  HT.$('#app-title').addEventListener('click', function () {
    var now = Date.now();
    logoTaps = now - logoT < 600 ? logoTaps + 1 : 1; logoT = now;
    if (logoTaps >= 5) { logoTaps = 0; HT.openDebug(); return; }
    if (HT.route && HT.route.name !== 'home' && HT.Store.profile()) HT.go('home');
  });
  HT.$('#top-actions').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var s = HT.Store.settings();
    if (b.id === 'hd-who') { HT.Sfx.click(); HT.go('profiles'); return; }
    if (b.id === 'hd-lang') {
      s.lang = HT.lang === 'ko' ? 'en' : 'ko'; HT.Store.save(); HT.applySettings();
      // 게임/연습 도중이면 진행을 지키기 위해 막대만 바꾸고, 목록 화면은 다시 그림
      var live = ['practice', 'rain', 'balloon', 'race', 'story'].indexOf(HT.route.name) >= 0;
      if (live) HT.renderHeader(); else HT.go(HT.route.name, HT.route.arg);
    }
    if (b.id === 'hd-sfx') { s.sound = s.sound === false; HT.Store.save(); HT.applySettings(); HT.renderHeader(); HT.Sfx.click(); }
    if (b.id === 'hd-say') { s.speech = s.speech === false; HT.Store.save(); HT.applySettings(); HT.renderHeader(); }
  });
  if (location.hash === '#debug') HT.openDebug();
  HT.go(HT.Store.profile() ? 'home' : 'profiles');
};

if (typeof document !== 'undefined' && document.getElementById('view')) HT.boot();
