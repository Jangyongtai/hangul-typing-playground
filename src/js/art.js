// 게임 화면 그림 도구: 몽글몽글한 구름, 언덕, 말풍선, 풍선, 반짝이 (모두 캔버스로 그려 고화질)
var HT = globalThis.HT = globalThis.HT || {};

HT.Art = {
  roundRect: function (ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  },
  cloud: function (ctx, x, y, s, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.fillStyle = 'rgba(90, 150, 200, 0.35)';
    HT.Art._puffs(ctx, x, y + 6 * s, s);
    ctx.fillStyle = '#FFFFFF';
    HT.Art._puffs(ctx, x, y, s);
    ctx.restore();
  },
  _puffs: function (ctx, x, y, s) {
    HT.Art.circles(ctx, [[x, y, 22 * s], [x + 26 * s, y - 12 * s, 28 * s], [x + 56 * s, y, 22 * s], [x + 28 * s, y + 8 * s, 24 * s]]);
  },
  // 겹친 동그라미를 한 번에 채움 (각 원을 따로 시작해야 선이 이어지지 않음)
  circles: function (ctx, list) {
    ctx.beginPath();
    list.forEach(function (c) { ctx.moveTo(c[0] + c[2], c[1]); ctx.arc(c[0], c[1], c[2], 0, Math.PI * 2); });
    ctx.fill();
  },
  // 이모지는 채우기 색의 투명도를 따라가므로 항상 불투명 색으로 그림
  emoji: function (ctx, ch, x, y, size) {
    ctx.fillStyle = '#000'; ctx.font = size + 'px ' + HT.FONT_EMOJI; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(ch, x, y);
  },
  sky: function (ctx, W, H, top, bottom) {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, top); g.addColorStop(1, bottom);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  },
  // 둥근 언덕 두 겹 + 작은 나무와 꽃
  hills: function (ctx, W, H, groundY, t) {
    ctx.fillStyle = '#86CF66';
    ctx.beginPath(); ctx.moveTo(0, H);
    for (var x = 0; x <= W; x += 20) ctx.lineTo(x, groundY - 18 - Math.sin(x / 90 + 1) * 14);
    ctx.lineTo(W, H); ctx.fill();
    ctx.fillStyle = '#4FB443';
    ctx.beginPath(); ctx.moveTo(0, H);
    for (var x2 = 0; x2 <= W; x2 += 20) ctx.lineTo(x2, groundY - Math.sin(x2 / 60) * 6);
    ctx.lineTo(W, H); ctx.fill();
    // 나무
    for (var i = 0; i < 4; i++) {
      var tx = (W / 4) * i + W / 8, ty = groundY - 26 - Math.sin(tx / 90 + 1) * 14;
      ctx.fillStyle = '#A9784F'; HT.Art.roundRect(ctx, tx - 4, ty, 8, 22, 3); ctx.fill();
      ctx.fillStyle = i % 2 ? '#2FA23F' : '#249235';
      HT.Art.circles(ctx, [[tx, ty - 4, 16], [tx - 10, ty + 4, 11], [tx + 10, ty + 4, 11]]);
    }
    // 꽃
    var cols = ['#FFFFFF', '#FFC928', '#FF6B5E', '#9B7BF0'];
    for (var f = 0; f < W; f += 37) {
      var fy = groundY + 8 + ((f * 7) % 13);
      var sway = Math.sin((t || 0) * 2 + f) * 1.5;
      ctx.fillStyle = cols[(f / 37 | 0) % 4];
      ctx.beginPath(); ctx.arc(f + 10 + sway, fy, 3.2, 0, Math.PI * 2); ctx.fill();
    }
  },
  // 단어가 들어가는 둥근 말풍선
  bubble: function (ctx, x, y, w, h, fill, edge) {
    var depth = Math.max(4, h * 0.12);
    ctx.save();
    ctx.shadowColor = 'rgba(60, 40, 20, 0.28)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 6;
    ctx.fillStyle = HT.Art.tint(HT.Art.hex(fill), -0.22); HT.Art.roundRect(ctx, x - w / 2, y - h / 2 + depth, w, h, h / 2); ctx.fill();
    ctx.restore();
    var g = ctx.createLinearGradient(0, y - h / 2, 0, y + h / 2);
    g.addColorStop(0, HT.Art.tint(HT.Art.hex(fill), 0.5)); g.addColorStop(0.5, fill); g.addColorStop(1, HT.Art.tint(HT.Art.hex(fill), -0.06));
    ctx.fillStyle = g; HT.Art.roundRect(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; HT.Art.roundRect(ctx, x - w / 2 + h * 0.3, y - h / 2 + h * 0.1, w - h * 0.6, h * 0.16, h * 0.08); ctx.fill();
    if (edge) { ctx.lineWidth = 4; ctx.strokeStyle = edge; HT.Art.roundRect(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.stroke(); }
  },
  balloon: function (ctx, x, y, r, color, glow) {
    var ry = r * 1.18;
    // 끈
    ctx.strokeStyle = 'rgba(107, 78, 53, 0.55)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y + ry + 8); ctx.bezierCurveTo(x + 12, y + ry + r * 0.5, x - 12, y + ry + r * 0.9, x + 2, y + ry + r * 1.3); ctx.stroke();
    if (glow) {
      ctx.save(); ctx.shadowColor = '#FFE27A'; ctx.shadowBlur = 24;
      ctx.fillStyle = 'rgba(255, 226, 122, 0.9)'; ctx.beginPath(); ctx.ellipse(x, y, r + 6, ry + 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    var g = ctx.createRadialGradient(x - r * 0.35, y - ry * 0.4, r * 0.1, x, y, r * 1.2);
    g.addColorStop(0, HT.Art.tint(color, 0.55)); g.addColorStop(0.55, color); g.addColorStop(1, HT.Art.tint(color, -0.38));
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, r, ry, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = HT.Art.tint(color, -0.2);
    ctx.beginPath(); ctx.moveTo(x - 7, y + ry + 9); ctx.lineTo(x + 7, y + ry + 9); ctx.lineTo(x, y + ry - 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath(); ctx.ellipse(x - r * 0.42, y - ry * 0.45, r * 0.14, ry * 0.24, -0.5, 0, Math.PI * 2); ctx.fill();
  },
  star: function (ctx, x, y, r, color) {
    ctx.fillStyle = color; ctx.beginPath();
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath(); ctx.fill();
  },
  hex: function (c) {
    if (c[0] === '#') return c;
    var m = c.match(/\d+/g); if (!m) return '#FFFFFF';
    return '#' + m.slice(0, 3).map(function (v) { return (+v).toString(16).padStart(2, '0'); }).join('');
  },
  // #RRGGBB 밝게(+)/어둡게(-)
  tint: function (hex, amt) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function f(c) { return Math.round(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt)); }
    return 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')';
  },
  // 글자 그리기: 흰 테두리 + 갈색 글씨 (동글동글한 느낌)
  label: function (ctx, text, x, y, size, color, outline) {
    ctx.font = '700 ' + size + 'px ' + HT.FONT_KO; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (outline) { ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(4, size * 0.2); ctx.strokeStyle = outline; ctx.strokeText(text, x, y); }
    ctx.fillStyle = color; ctx.fillText(text, x, y);
  }
};
