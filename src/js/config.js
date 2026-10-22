// 조정값은 모두 여기에 모아 둡니다. 숫자만 바꾸면 게임 난이도가 바뀝니다.
// 화면 주소 끝에 #debug 를 붙이면(또는 로고를 5번 누르면) 디버그 패널에서 실시간으로 바꿔 볼 수 있습니다.
var HT = globalThis.HT = globalThis.HT || {};

HT.DEFAULT_CONFIG = {
  practice: {
    keysPerStage: 15,        // 자리 익히기 한 단계 문제 수
    reviewRatio: 0.3,        // 이전 단계 복습 비율
    wordsPerRound: 8,        // 낱말 연습 한 판 낱말 수
    reviewInRound: 2,        // 낱말 연습에 섞어 넣을 틀렸던 낱말 수
    sentencesPerRound: 5,    // 짧은 글 한 판 문장 수
    tipEvery: 4,             // 몇 문제마다 공부 팁을 보여줄지
    nextDelayMs: { keys: 250, words: 750, sent: 950 },
    stars: { three: 95, two: 80 } // 정확도(%) 기준 별 개수
  },
  score: { perKey: 10, comboStep: 0.1, comboMaxMul: 3 },
  rain: {
    lives: 5,
    fallSeconds: { slow: 14, normal: 10, fast: 7 },   // 화면 위에서 바닥까지 걸리는 시간(1레벨)
    spawnSeconds: { slow: 3.0, normal: 2.3, fast: 1.7 },
    minSpawnSeconds: 0.9,
    levelEvery: 10,          // 몇 개 맞히면 레벨업
    speedUpPerLevel: 0.07,   // 레벨마다 빨라지는 비율
    maxSpeedMul: 1.9,        // 아무리 레벨이 올라도 이 배수 이상 빨라지지 않음
    onScreen: { base: 3, perLevel: 1, max: 7 },
    goldChance: 0.08,        // 황금 단어: 잡으면 잠시 느려짐
    slowFactor: 0.45,
    slowSeconds: 5
  },
  balloon: {
    lives: 5,
    riseSeconds: { slow: 12, normal: 9, fast: 6.5 },
    spawnSeconds: { slow: 3.0, normal: 2.3, fast: 1.7 },
    minSpawnSeconds: 0.9,
    levelEvery: 10,
    speedUpPerLevel: 0.07,
    maxSpeedMul: 1.9,
    onScreen: { base: 3, perLevel: 1, max: 7 },
    goldChance: 0.08,        // 황금 풍선: 잡으면 하트 +1
    maxLives: 5
  },
  race: {
    cpuCount: 3,
    defaultPlayerKpm: 35,    // 기록이 없을 때 가정하는 아이 타수(타/분)
    avgOfLastRaces: 5,       // 최근 몇 판 평균으로 실력을 잡을지
    cpuRatios: {             // 내 평균 타수 대비 컴퓨터 선수 속도
      easy: [0.6, 0.75, 0.9],
      normal: [0.8, 0.95, 1.1],
      hard: [0.95, 1.1, 1.25]
    },
    cpuKpmMin: 15,
    cpuKpmMax: 400,
    cpuJitter: 0.15,         // 컴퓨터 속도 흔들림(±비율)
    stumblePerSecond: 0.03,  // 컴퓨터가 넘어질 확률(초당)
    stumbleSeconds: 0.9,
    raceKeys: { short: 40, normal: 70, long: 110 }, // 경주 길이(타 수)
    minAccuracyToCount: 60   // 이 정확도 미만 판은 실력 평균에 넣지 않음
  }
};

HT.CONFIG_KEY = 'hangul-typing-config-override';

// 디버그 패널에서 저장한 값이 있으면 기본값 위에 덮어씁니다.
HT.loadConfig = function () {
  var base = JSON.parse(JSON.stringify(HT.DEFAULT_CONFIG));
  try {
    var raw = globalThis.localStorage && localStorage.getItem(HT.CONFIG_KEY);
    if (raw) HT.deepMerge(base, JSON.parse(raw));
  } catch (e) { /* 저장소를 못 쓰면 기본값 사용 */ }
  HT.CONFIG = base;
  return base;
};

HT.deepMerge = function (target, src) {
  if (!src || typeof src !== 'object') return target;
  Object.keys(src).forEach(function (k) {
    var v = src[k];
    if (v && typeof v === 'object' && !Array.isArray(v) && target[k] && typeof target[k] === 'object' && !Array.isArray(target[k])) {
      HT.deepMerge(target[k], v);
    } else if (k in target) {
      target[k] = v;
    }
  });
  return target;
};

HT.loadConfig();
