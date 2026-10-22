// 공통 화면 도구: 문구 번역, 알림, 화면 자판, 키 입력 연결
var HT = globalThis.HT = globalThis.HT || {};

HT.$ = function (s, r) { return (r || document).querySelector(s); };
HT.esc = function (s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
};
HT.lang = 'ko';
HT.t = function (k, params) {
  var e = HT.T[k];
  var s = e ? e[HT.lang === 'ko' ? 0 : 1] : k;
  if (params) Object.keys(params).forEach(function (p) { s = s.split('{' + p + '}').join(params[p]); });
  return s;
};
HT.L = function (ko, en) { return HT.lang === 'ko' ? ko : en; };
HT.shuffle = function (a) {
  a = a.slice();
  for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
};
HT.pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
HT.rand = function (a, b) { return a + Math.random() * (b - a); };
HT.clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
HT.randomTip = function () { return HT.TIPS[HT.pick(HT.TIP_IDS)]; };
HT.tipHTML = function (tip) {
  return '<b>💡 ' + HT.esc(HT.t('tip')) + '</b> ' + HT.esc(tip[HT.lang === 'ko' ? 0 : 1]) +
    (HT.lang === 'ko' ? '' : ' <span class="tip-ko">' + HT.esc(tip[0]) + '</span>');
};

HT.toast = function (html, ms) {
  var el = HT.$('#toast');
  if (!el) return;
  el.innerHTML = html;
  el.hidden = false;
  el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  clearTimeout(HT._toastT);
  HT._toastT = setTimeout(function () { el.hidden = true; }, ms || 2600);
};

// 배지 확인: 새로 얻은 배지가 있으면 알림
HT.checkBadges = function () {
  var d = HT.Store.data(), got = [];
  HT.BADGES.forEach(function (b) {
    if (d.badges.indexOf(b.id) < 0 && b.test(d)) { d.badges.push(b.id); got.push(b); }
  });
  HT.Store.save();
  if (got.length) {
    HT.Sfx.star();
    HT.toast('<span class="toast-badge">' + got.map(function (b) { return b.emoji; }).join(' ') + '</span> ' +
      HT.esc(HT.t('newBadge')) + ' ' + HT.esc(got.map(function (b) { return HT.L(b.ko, b.en); }).join(', ')), 3500);
  }
};

// ---- 키 입력 ----
// 현재 화면이 HT.inputHandler 를 등록하면 실제 키보드와 화면 자판 입력이 모두 여기로 옵니다.
// 입력 형식: {type:'jamo', j:'ㄱ', code:'KeyR'} | {type:'space'} | {type:'bs'} | {type:'enter'} | {type:'esc'} | {type:'char', ch}
HT.inputHandler = null;
HT.activeKeyboard = null;

HT.keyFromEvent = function (e) {
  if (e.key === 'Backspace') return { type: 'bs' };
  if (e.key === 'Enter') return { type: 'enter' };
  if (e.key === 'Escape') return { type: 'esc' };
  if (e.key === ' ' || e.code === 'Space') return { type: 'space', code: 'Space' };
  var m = HT.CODE2JAMO[e.code];
  if (m) return { type: 'jamo', j: e.shiftKey && m[1] ? m[1] : m[0], code: e.code };
  if (e.key && e.key.length === 1) {
    var jk = HT.JAMO2KEY[e.key];
    if (jk) return { type: 'jamo', j: e.key, code: jk.code };
    var letter = e.key.toUpperCase();
    if (/^[A-Z]$/.test(letter) && HT.CODE2JAMO['Key' + letter]) {
      var mm = HT.CODE2JAMO['Key' + letter];
      return { type: 'jamo', j: e.shiftKey && mm[1] ? mm[1] : mm[0], code: 'Key' + letter };
    }
    return { type: 'char', ch: e.key };
  }
  return null;
};

document.addEventListener('keydown', function (e) {
  if (!HT.inputHandler) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  var tag = e.target && e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
  var k = HT.keyFromEvent(e);
  if (!k) return;
  e.preventDefault();
  if (e.repeat && k.type !== 'bs') return;
  if (HT.activeKeyboard && k.code) HT.activeKeyboard.press(k.code);
  HT.inputHandler(k);
});

// ---- 화면 자판 ----
HT.Keyboard = function (host, onKey, opts) {
  opts = opts || {};
  var shift = false;
  function keyHTML(code) {
    var m = HT.CODE2JAMO[code];
    return '<button type="button" tabindex="-1" class="key f' + HT.FINGER[code] + (code === 'KeyF' || code === 'KeyJ' ? ' bump' : '') +
      '" data-code="' + code + '"><b>' + m[0] + '</b><i>' + code.slice(3) + '</i></button>';
  }
  var html = HT.KB_ROWS.map(function (row, i) {
    var extra = '';
    if (i === 2) extra = '<button type="button" tabindex="-1" class="key wide" data-code="Backspace" aria-label="Backspace">⌫</button>';
    return '<div class="kb-row r' + i + '">' + (i === 2 ? '<button type="button" tabindex="-1" class="key wide" data-code="Shift">⇧</button>' : '') +
      row.map(keyHTML).join('') + extra + '</div>';
  }).join('');
  html += '<div class="kb-row r3"><button type="button" tabindex="-1" class="key space f8" data-code="Space">' + HT.esc(HT.t('spaceKey')) + '</button>' +
    (opts.enter ? '<button type="button" tabindex="-1" class="key wide" data-code="Enter">⏎</button>' : '') + '</div>';
  host.innerHTML = html;
  host.classList.add('kb');

  function refresh() {
    host.querySelectorAll('.key[data-code^="Key"]').forEach(function (b) {
      var m = HT.CODE2JAMO[b.dataset.code];
      b.querySelector('b').textContent = shift && m[1] ? m[1] : m[0];
    });
    var s = host.querySelector('[data-code="Shift"]');
    if (s) s.classList.toggle('on', shift);
  }
  function press(code) {
    var b = host.querySelector('[data-code="' + code + '"]');
    if (!b) return;
    b.classList.remove('press'); void b.offsetWidth; b.classList.add('press');
  }
  function hint(code, needShift) {
    host.querySelectorAll('.hint').forEach(function (b) { b.classList.remove('hint'); });
    if (code) { var b = host.querySelector('[data-code="' + code + '"]'); if (b) b.classList.add('hint'); }
    if (needShift) { var s = host.querySelector('[data-code="Shift"]'); if (s) s.classList.add('hint'); }
  }
  host.addEventListener('pointerdown', function (e) {
    var b = e.target.closest('button.key');
    if (!b) return;
    e.preventDefault();
    var code = b.dataset.code;
    press(code);
    if (code === 'Shift') { shift = !shift; refresh(); HT.Sfx.click(); return; }
    if (code === 'Backspace') return onKey({ type: 'bs' });
    if (code === 'Space') return onKey({ type: 'space', code: 'Space' });
    if (code === 'Enter') return onKey({ type: 'enter' });
    var m = HT.CODE2JAMO[code];
    var j = shift && m[1] ? m[1] : m[0];
    if (shift) { shift = false; refresh(); }
    onKey({ type: 'jamo', j: j, code: code });
  });
  var api = { press: press, hint: hint };
  HT.activeKeyboard = api;
  return api;
};

// 다음에 눌러야 할 키 안내 문구와 자판 표시
HT.showNextKey = function (kb, hintEl, key) {
  if (!key) { kb.hint(null); if (hintEl) hintEl.innerHTML = '&nbsp;'; return; }
  var info = key === ' ' ? { code: 'Space', shift: false } : HT.JAMO2KEY[key];
  if (!info) { kb.hint(null); if (hintEl) hintEl.innerHTML = '&nbsp;'; return; }
  kb.hint(info.code, info.shift);
  if (!hintEl) return;
  var finger = HT.FINGERS[HT.FINGER[info.code]];
  var label = key === ' ' ? HT.t('spaceKey') : key;
  var letter = info.code === 'Space' ? 'Space' : (info.shift ? 'Shift + ' : '') + info.code.slice(3);
  hintEl.innerHTML = HT.esc(HT.t('nextKey')) + ' <kbd>' + HT.esc(label) + '</kbd> <span class="letter">' + HT.esc(letter) + '</span> · ' + HT.esc(HT.L(finger[0], finger[1]));
};

HT.starsHTML = function (n, max) {
  var s = '';
  for (var i = 0; i < (max || 3); i++) s += '<span class="st' + (i < n ? ' on' : '') + '">★</span>';
  return '<span class="stars" aria-label="' + n + ' / 3">' + s + '</span>';
};

// 고르기 버튼 묶음 (게임 설정 화면에서 사용)
HT.segmented = function (id, options, value) {
  return '<div class="seg" role="group" id="' + id + '">' + options.map(function (o) {
    return '<button type="button" class="seg-b" data-v="' + o[0] + '" aria-pressed="' + (o[0] === value) + '">' + HT.esc(o[1]) + '</button>';
  }).join('') + '</div>';
};
HT.bindSegmented = function (root, id, onChange) {
  var el = HT.$('#' + id, root);
  el.addEventListener('click', function (e) {
    var b = e.target.closest('.seg-b'); if (!b) return;
    el.querySelectorAll('.seg-b').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    HT.Sfx.click();
    onChange(b.dataset.v);
  });
};
