// 기기 안 저장소: 사용자(프로필)별 기록. 나중에 로그인/서버 저장으로 바꿀 때 이 파일만 고치면 됩니다.
var HT = globalThis.HT = globalThis.HT || {};

HT.Store = {
  KEY: 'hangul-typing-v1',
  db: null,

  blankProfileData: function () {
    return {
      stars: {}, best: { rain: 0, balloon: 0 }, wordsTyped: 0, keysTyped: 0, bestSpeed: 0,
      streak: 0, maxStreak: 0, lastDay: '', missed: {}, badges: [], maxCombo: 0, maxPop: 0,
      raceKpms: [], raceWins: 0, gameCfg: {}, storyBest: {}
    };
  },

  load: function () {
    var db = null;
    try { db = JSON.parse(localStorage.getItem(this.KEY)); } catch (e) { db = null; }
    if (!db || typeof db !== 'object') db = {};
    db.settings = db.settings || {};
    db.profiles = Array.isArray(db.profiles) ? db.profiles : [];
    db.data = db.data || {};
    var self = this;
    db.profiles.forEach(function (p) {
      db.data[p.id] = HT.deepMerge(self.blankProfileData(), db.data[p.id] || {});
      // deepMerge는 기본값에 없는 키를 버리므로 가변 키 객체는 따로 복사
      ['stars', 'missed', 'gameCfg', 'storyBest'].forEach(function (k) {
        var saved = (db.data[p.id] && db.data[p.id][k]);
        if (saved && typeof saved === 'object') db.data[p.id][k] = saved;
      });
    });
    if (db.current && !db.data[db.current]) db.current = null;
    this.db = db;
    return db;
  },

  save: function () {
    try { localStorage.setItem(this.KEY, JSON.stringify(this.db)); } catch (e) { /* 저장 불가 환경 */ }
  },

  settings: function () { return this.db.settings; },
  profile: function () {
    var id = this.db.current;
    return this.db.profiles.filter(function (p) { return p.id === id; })[0] || null;
  },
  data: function () { return this.db.data[this.db.current] || this.blankProfileData(); },

  addProfile: function (name, avatar) {
    var id = 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
    this.db.profiles.push({ id: id, name: name, avatar: avatar, created: Date.now() });
    this.db.data[id] = this.blankProfileData();
    this.db.current = id;
    this.save();
    return id;
  },
  removeProfile: function (id) {
    this.db.profiles = this.db.profiles.filter(function (p) { return p.id !== id; });
    delete this.db.data[id];
    if (this.db.current === id) this.db.current = null;
    this.save();
  },
  use: function (id) { this.db.current = id; this.save(); },

  // 하루 한 번 이상 연습하면 연속 일수 증가
  touchDay: function () {
    var d = this.data(), today = HT.dayKey(new Date());
    if (d.lastDay === today) return;
    var y = new Date(); y.setDate(y.getDate() - 1);
    d.streak = d.lastDay === HT.dayKey(y) ? d.streak + 1 : 1;
    d.maxStreak = Math.max(d.maxStreak, d.streak);
    d.lastDay = today;
  },

  markMiss: function (word, missedIt) {
    var m = this.data().missed;
    if (missedIt) m[word] = (m[word] || 0) + 1;
    else if (m[word]) { m[word] -= 1; if (m[word] <= 0) delete m[word]; }
  },

  // 레이스용: 최근 판들의 평균 타수 = 아이 실력
  playerKpm: function () {
    var c = HT.CONFIG.race, list = this.data().raceKpms.slice(-c.avgOfLastRaces);
    if (!list.length) {
      var bs = this.data().bestSpeed;
      return bs ? Math.round(bs * 0.85) : c.defaultPlayerKpm;
    }
    return Math.round(list.reduce(function (a, b) { return a + b; }, 0) / list.length);
  },

  totalStars: function () {
    var s = this.data().stars;
    return Object.keys(s).reduce(function (a, k) { return a + (s[k] || 0); }, 0);
  }
};

HT.dayKey = function (dt) {
  return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
};
