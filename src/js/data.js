// 학습 내용: 자모, 단계, 낱말, 문장, 공부 팁, 배지, 화면 문구(한국어/영어)
var HT = globalThis.HT = globalThis.HT || {};

// 자판 배치 (두벌식). [기본, Shift]
HT.CODE2JAMO = {
  KeyQ: ['ㅂ', 'ㅃ'], KeyW: ['ㅈ', 'ㅉ'], KeyE: ['ㄷ', 'ㄸ'], KeyR: ['ㄱ', 'ㄲ'], KeyT: ['ㅅ', 'ㅆ'],
  KeyY: ['ㅛ'], KeyU: ['ㅕ'], KeyI: ['ㅑ'], KeyO: ['ㅐ', 'ㅒ'], KeyP: ['ㅔ', 'ㅖ'],
  KeyA: ['ㅁ'], KeyS: ['ㄴ'], KeyD: ['ㅇ'], KeyF: ['ㄹ'], KeyG: ['ㅎ'],
  KeyH: ['ㅗ'], KeyJ: ['ㅓ'], KeyK: ['ㅏ'], KeyL: ['ㅣ'],
  KeyZ: ['ㅋ'], KeyX: ['ㅌ'], KeyC: ['ㅊ'], KeyV: ['ㅍ'], KeyB: ['ㅠ'], KeyN: ['ㅜ'], KeyM: ['ㅡ']
};
HT.KB_ROWS = [
  ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'],
  ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL'],
  ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM']
];
// 손가락 번호: 0 왼손 새끼 … 3 왼손 검지, 4 오른손 검지 … 7 오른손 새끼, 8 엄지
HT.FINGER = {
  KeyQ: 0, KeyA: 0, KeyZ: 0, KeyW: 1, KeyS: 1, KeyX: 1, KeyE: 2, KeyD: 2, KeyC: 2,
  KeyR: 3, KeyF: 3, KeyV: 3, KeyT: 3, KeyG: 3, KeyB: 3,
  KeyY: 4, KeyH: 4, KeyN: 4, KeyU: 4, KeyJ: 4, KeyM: 4,
  KeyI: 5, KeyK: 5, KeyO: 6, KeyL: 6, KeyP: 7, Space: 8
};
HT.JAMO2KEY = {};
Object.keys(HT.CODE2JAMO).forEach(function (code) {
  var m = HT.CODE2JAMO[code];
  HT.JAMO2KEY[m[0]] = { code: code, shift: false };
  if (m[1]) HT.JAMO2KEY[m[1]] = { code: code, shift: true };
});

// 자모 이름과 소리
HT.JINFO = {
  'ㄱ': ['기역', 'g/k'], 'ㄴ': ['니은', 'n'], 'ㄷ': ['디귿', 'd/t'], 'ㄹ': ['리을', 'r/l'], 'ㅁ': ['미음', 'm'],
  'ㅂ': ['비읍', 'b/p'], 'ㅅ': ['시옷', 's'], 'ㅇ': ['이응', 'silent · ng'], 'ㅈ': ['지읒', 'j'], 'ㅊ': ['치읓', 'ch'],
  'ㅋ': ['키읔', 'k'], 'ㅌ': ['티읕', 't'], 'ㅍ': ['피읖', 'p'], 'ㅎ': ['히읗', 'h'],
  'ㄲ': ['쌍기역', 'kk'], 'ㄸ': ['쌍디귿', 'tt'], 'ㅃ': ['쌍비읍', 'pp'], 'ㅆ': ['쌍시옷', 'ss'], 'ㅉ': ['쌍지읒', 'jj'],
  'ㅏ': ['아', 'a'], 'ㅑ': ['야', 'ya'], 'ㅓ': ['어', 'eo'], 'ㅕ': ['여', 'yeo'], 'ㅗ': ['오', 'o'], 'ㅛ': ['요', 'yo'],
  'ㅜ': ['우', 'u'], 'ㅠ': ['유', 'yu'], 'ㅡ': ['으', 'eu'], 'ㅣ': ['이', 'i'], 'ㅐ': ['애', 'ae'], 'ㅒ': ['얘', 'yae'],
  'ㅔ': ['에', 'e'], 'ㅖ': ['예', 'ye']
};

HT.STAGES = [
  { id: 'S1', ko: '왼손 기본자리', en: 'Left home keys', jamo: 'ㅁㄴㅇㄹ', tip: 'home' },
  { id: 'S2', ko: '오른손 기본자리', en: 'Right home keys', jamo: 'ㅓㅏㅣ', tip: 'hands' },
  { id: 'S3', ko: '가운데 자리', en: 'Middle keys', jamo: 'ㅎㅗ', tip: 'ieung' },
  { id: 'S4', ko: '윗줄 자음', en: 'Top row consonants', jamo: 'ㅂㅈㄷㄱㅅ', tip: 'shapeC' },
  { id: 'S5', ko: '윗줄 모음', en: 'Top row vowels', jamo: 'ㅛㅕㅑㅐㅔ', tip: 'aeE' },
  { id: 'S6', ko: '아랫줄 자음', en: 'Bottom row consonants', jamo: 'ㅋㅌㅊㅍ', tip: 'lookScreen' },
  { id: 'S7', ko: '아랫줄 모음', en: 'Bottom row vowels', jamo: 'ㅠㅜㅡ', tip: 'shapeV' },
  { id: 'S8', ko: '쌍자음 (Shift)', en: 'Shift letters', jamo: 'ㄲㄸㅃㅆㅉㅒㅖ', tip: 'shift' },
  { id: 'S9', ko: '글자 만들기', en: 'Build syllables', jamo: '', tip: 'block', syl: 'open' },
  { id: 'S10', ko: '받침 글자', en: 'Syllables with batchim', jamo: '', tip: 'batchim', syl: 'batchim' }
];

// 받침 없는 쉬운 글자
HT.SYLLABLES = (function () {
  var cs = 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ', vs = 'ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ', out = [];
  for (var i = 0; i < cs.length; i++) for (var j = 0; j < vs.length; j++) {
    out.push(HT.composeBlock({ c: cs[i], v: vs[j], f: '' }));
  }
  return out;
})();

// 낱말: [한글, 로마자, 영어, 그림]
HT.THEMES = [
  { id: 'animals', ko: '동물', en: 'Animals', emoji: '🐶', words: [
    ['강아지', 'gang-a-ji', 'puppy', '🐶'], ['고양이', 'go-yang-i', 'cat', '🐱'], ['토끼', 'to-kki', 'rabbit', '🐰'],
    ['사자', 'sa-ja', 'lion', '🦁'], ['호랑이', 'ho-rang-i', 'tiger', '🐯'], ['곰', 'gom', 'bear', '🐻'],
    ['원숭이', 'won-sung-i', 'monkey', '🐵'], ['코끼리', 'ko-kki-ri', 'elephant', '🐘'], ['기린', 'gi-rin', 'giraffe', '🦒'],
    ['오리', 'o-ri', 'duck', '🦆'], ['돼지', 'dwae-ji', 'pig', '🐷'], ['물고기', 'mul-go-gi', 'fish', '🐟'],
    ['개구리', 'gae-gu-ri', 'frog', '🐸'], ['나비', 'na-bi', 'butterfly', '🦋']
  ] },
  { id: 'food', ko: '음식', en: 'Food', emoji: '🍎', words: [
    ['사과', 'sa-gwa', 'apple', '🍎'], ['바나나', 'ba-na-na', 'banana', '🍌'], ['포도', 'po-do', 'grapes', '🍇'],
    ['딸기', 'ttal-gi', 'strawberry', '🍓'], ['수박', 'su-bak', 'watermelon', '🍉'], ['우유', 'u-yu', 'milk', '🥛'],
    ['빵', 'ppang', 'bread', '🍞'], ['밥', 'bap', 'rice', '🍚'], ['김치', 'gim-chi', 'kimchi', '🥬'],
    ['라면', 'ra-myeon', 'ramen', '🍜'], ['계란', 'gye-ran', 'egg', '🥚'], ['과자', 'gwa-ja', 'snack', '🍪'],
    ['물', 'mul', 'water', '💧'], ['피자', 'pi-ja', 'pizza', '🍕']
  ] },
  { id: 'family', ko: '가족', en: 'Family', emoji: '👨‍👩‍👧', words: [
    ['엄마', 'eom-ma', 'mom', '👩'], ['아빠', 'a-ppa', 'dad', '👨'], ['할머니', 'hal-meo-ni', 'grandma', '👵'],
    ['할아버지', 'ha-ra-beo-ji', 'grandpa', '👴'], ['형', 'hyeong', 'older brother (said by boys)', '👦'],
    ['누나', 'nu-na', 'older sister (said by boys)', '👧'], ['언니', 'eon-ni', 'older sister (said by girls)', '👧'],
    ['오빠', 'o-ppa', 'older brother (said by girls)', '👦'], ['동생', 'dong-saeng', 'younger sibling', '🧒'],
    ['아기', 'a-gi', 'baby', '👶'], ['친구', 'chin-gu', 'friend', '🤝']
  ] },
  { id: 'colors', ko: '색깔', en: 'Colors', emoji: '🎨', words: [
    ['빨강', 'ppal-gang', 'red', '🔴'], ['주황', 'ju-hwang', 'orange', '🟠'], ['노랑', 'no-rang', 'yellow', '🟡'],
    ['초록', 'cho-rok', 'green', '🟢'], ['파랑', 'pa-rang', 'blue', '🔵'], ['보라', 'bo-ra', 'purple', '🟣'],
    ['하양', 'ha-yang', 'white', '⚪'], ['검정', 'geom-jeong', 'black', '⚫'], ['분홍', 'bun-hong', 'pink', '🌸'],
    ['갈색', 'gal-saek', 'brown', '🟤']
  ] },
  { id: 'numbers', ko: '숫자', en: 'Numbers', emoji: '🔢', words: [
    ['하나', 'ha-na', 'one', '1️⃣'], ['둘', 'dul', 'two', '2️⃣'], ['셋', 'set', 'three', '3️⃣'], ['넷', 'net', 'four', '4️⃣'],
    ['다섯', 'da-seot', 'five', '5️⃣'], ['여섯', 'yeo-seot', 'six', '6️⃣'], ['일곱', 'il-gop', 'seven', '7️⃣'],
    ['여덟', 'yeo-deol', 'eight', '8️⃣'], ['아홉', 'a-hop', 'nine', '9️⃣'], ['열', 'yeol', 'ten', '🔟']
  ] },
  { id: 'body', ko: '몸', en: 'Body', emoji: '✋', words: [
    ['눈', 'nun', 'eye', '👁️'], ['코', 'ko', 'nose', '👃'], ['입', 'ip', 'mouth', '👄'], ['귀', 'gwi', 'ear', '👂'],
    ['손', 'son', 'hand', '✋'], ['발', 'bal', 'foot', '🦶'], ['머리', 'meo-ri', 'head', '🙂'], ['이빨', 'i-ppal', 'tooth', '🦷'],
    ['다리', 'da-ri', 'leg', '🦵'], ['팔', 'pal', 'arm', '💪']
  ] },
  { id: 'nature', ko: '자연', en: 'Nature', emoji: '🌈', words: [
    ['해', 'hae', 'sun', '☀️'], ['달', 'dal', 'moon', '🌙'], ['별', 'byeol', 'star', '⭐'], ['하늘', 'ha-neul', 'sky', '🌤️'],
    ['구름', 'gu-reum', 'cloud', '☁️'], ['비', 'bi', 'rain', '🌧️'], ['눈사람', 'nun-sa-ram', 'snowman', '⛄'],
    ['나무', 'na-mu', 'tree', '🌳'], ['꽃', 'kkot', 'flower', '🌷'], ['바다', 'ba-da', 'sea', '🌊'],
    ['산', 'san', 'mountain', '⛰️'], ['무지개', 'mu-ji-gae', 'rainbow', '🌈']
  ] },
  { id: 'school', ko: '학교', en: 'School', emoji: '🏫', words: [
    ['학교', 'hak-gyo', 'school', '🏫'], ['선생님', 'seon-saeng-nim', 'teacher', '🧑‍🏫'], ['책', 'chaek', 'book', '📕'],
    ['연필', 'yeon-pil', 'pencil', '✏️'], ['가방', 'ga-bang', 'bag', '🎒'], ['공', 'gong', 'ball', '⚽'],
    ['의자', 'ui-ja', 'chair', '🪑'], ['시계', 'si-gye', 'clock', '⏰'], ['그림', 'geu-rim', 'picture', '🖼️'],
    ['노래', 'no-rae', 'song', '🎵']
  ] },
  { id: 'greetings', ko: '인사', en: 'Greetings', emoji: '👋', words: [
    ['안녕', 'an-nyeong', 'hi / bye', '👋'], ['안녕하세요', 'an-nyeong-ha-se-yo', 'hello', '🙇'],
    ['감사합니다', 'gam-sa-ham-ni-da', 'thank you', '🙏'], ['고마워', 'go-ma-wo', 'thanks', '😊'],
    ['미안해', 'mi-an-hae', 'sorry', '😢'], ['사랑해', 'sa-rang-hae', 'I love you', '❤️'], ['잘 자', 'jal ja', 'good night', '😴'],
    ['괜찮아', 'gwaen-cha-na', "it's okay", '👌'], ['맛있어요', 'ma-si-sseo-yo', "it's yummy", '😋'],
    ['축하해', 'chu-ka-hae', 'congratulations', '🎉']
  ] }
];
// 낱말 어려움 점수: 누를 키 수 + 쌍자음·겹받침·겹모음 가산
HT.wordScore = function (text) {
  var keys = HT.keysOf(text), score = keys.length, n = text.replace(/ /g, '').length;
  for (var i = 0; i < text.length; i++) {
    var c = text.charCodeAt(i);
    if (c < 0xAC00 || c > 0xD7A3) continue;
    var k = c - 0xAC00, cho = Math.floor(k / 588), jung = Math.floor((k % 588) / 28), jong = k % 28;
    if ([1, 4, 8, 10, 13].indexOf(cho) >= 0) score += 2;          // ㄲㄸㅃㅆㅉ
    if ([9, 10, 11, 14, 15, 16, 19].indexOf(jung) >= 0) score += 2; // ㅘㅙㅚㅝㅞㅟㅢ
    if ([3, 5, 6, 9, 10, 11, 12, 13, 14, 15, 18].indexOf(jong) >= 0) score += 3; // 겹받침
  }
  return score + (n >= 4 ? 3 : 0);
};
HT.buildWordIndex = function () {
  HT.WORD_INDEX = {};
  HT.ALL_WORDS = [];
  HT.THEMES.forEach(function (th) {
    th.words.forEach(function (w) {
      var item = { text: w[0], rom: w[1], en: w[2], emoji: w[3], theme: th.id };
      HT.WORD_INDEX[w[0]] = item;
      HT.ALL_WORDS.push(item);
    });
  });
  // 점수 순으로 세 묶음: 쉬움 / 보통 / 어려움 (띄어쓰기 있는 말은 보통 이상)
  var sorted = HT.ALL_WORDS.slice().sort(function (a, b) { return HT.wordScore(a.text) - HT.wordScore(b.text); });
  var third = Math.ceil(sorted.length / 3);
  HT.WORD_LEVELS = { easy: [], normal: [], hard: [] };
  sorted.forEach(function (w, i) {
    var lv = i < third ? 'easy' : i < third * 2 ? 'normal' : 'hard';
    if (lv === 'easy' && w.text.indexOf(' ') >= 0) lv = 'normal';
    w.level = lv; HT.WORD_LEVELS[lv].push(w);
  });
};
HT.buildWordIndex();

HT.SENTENCES = [
  ['나는 사과를 좋아해요', 'I like apples.'], ['우리 집에 강아지가 있어요', 'There is a puppy at my house.'],
  ['오늘 날씨가 좋아요', 'The weather is nice today.'], ['엄마 사랑해요', 'I love you, Mom.'],
  ['학교에 가요', 'I go to school.'], ['물 주세요', 'Water, please.'], ['이거 얼마예요', 'How much is this?'],
  ['만나서 반가워요', 'Nice to meet you.'], ['제 이름은 민수예요', 'My name is Minsu.'],
  ['고양이가 잠을 자요', 'The cat is sleeping.'], ['하늘에 별이 많아요', 'There are many stars in the sky.'],
  ['친구랑 같이 놀아요', 'I play with my friend.'], ['배가 고파요', "I'm hungry."], ['김치는 매워요', 'Kimchi is spicy.'],
  ['책을 읽어요', 'I read a book.'], ['비가 와요', "It's raining."], ['생일 축하해요', 'Happy birthday.'],
  ['내일 또 만나요', 'See you tomorrow.'], ['손을 깨끗이 씻어요', 'I wash my hands clean.'],
  ['토끼는 당근을 먹어요', 'Rabbits eat carrots.']
].map(function (s) { return { text: s[0], en: s[1] }; });

// 공부 팁
HT.TIPS = {
  block: ['자음 + 모음 = 글자! ㄱ + ㅏ = 가', 'Consonant + vowel = one block! ㄱ + ㅏ = 가'],
  ieung: ['ㅇ이 맨 앞에 오면 소리가 없어요. 아 = [a]', 'ㅇ at the start is silent: 아 = [a]'],
  batchim: ['받침은 글자 아래에 붙어요. 가 + ㄱ = 각', 'A bottom consonant (batchim) sits under the block: 가 + ㄱ = 각'],
  shift: ['Shift를 누르고 치면 쌍자음! ㄱ → ㄲ', 'Hold Shift for double consonants: ㄱ → ㄲ'],
  hands: ['자판에서 왼손은 자음, 오른손은 모음을 쳐요', 'Left hand types consonants, right hand types vowels'],
  wa: ['ㅗ 다음에 ㅏ를 치면 ㅘ가 돼요. 사 + 과 = 사과', 'Type ㅗ then ㅏ to make ㅘ, like in 사과 (apple)'],
  yo: ["끝에 '요'를 붙이면 공손한 말: 고마워 → 고마워요", "Add 요 at the end to be polite: 고마워 → 고마워요"],
  sejong: ['한글은 세종대왕이 1443년에 만들었어요', 'King Sejong created Hangul in 1443'],
  shapeV: ['모음은 하늘(·), 땅(ㅡ), 사람(ㅣ) 모양에서 왔어요', 'Vowels come from three shapes: sky (·), earth (ㅡ), person (ㅣ)'],
  shapeC: ['ㄱ ㄴ ㅁ ㅅ ㅇ은 소리 낼 때 입과 혀 모양을 본떴어요', 'ㄱ ㄴ ㅁ ㅅ ㅇ copy the shape of the mouth and tongue'],
  eat: ["'밥 먹었어?'는 '안녕?'처럼 쓰는 다정한 인사예요", "'밥 먹었어?' (Did you eat?) is a friendly way to say hi"],
  sibling: ['오빠·언니는 여자아이가, 형·누나는 남자아이가 불러요', 'Girls say 오빠/언니, boys say 형/누나 for older siblings'],
  stop: ['받침 ㄱ, ㅂ은 짧게 끊어요: 책 [chaek], 밥 [bap]', 'Final ㄱ and ㅂ are cut short: 책 [chaek], 밥 [bap]'],
  oops: ['틀려도 괜찮아요! 맞는 키를 누르면 계속돼요', "Mistakes are okay! Press the right key to keep going"],
  lookScreen: ['손가락 말고 화면을 봐요. 자리를 외우면 빨라져요', 'Look at the screen, not your fingers. You get faster!'],
  aeE: ['ㅐ와 ㅔ는 요즘 소리가 거의 같아요', 'ㅐ and ㅔ sound almost the same today'],
  count: ['숫자를 셀 때: 하나, 둘, 셋, 넷, 다섯!', 'Counting: 하나, 둘, 셋, 넷, 다섯!'],
  home: ['왼손 검지는 ㄹ(F), 오른손 검지는 ㅓ(J)! 볼록한 돌기가 있어요', 'Left index on ㄹ (F), right index on ㅓ (J). Feel the bumps!'],
  verb: ['한국어는 움직이는 말이 맨 끝에 와요: 나는 사과를 먹어요', 'In Korean the verb comes last: 나는 사과를 먹어요'],
  nim: ["'님'을 붙이면 높이는 말: 선생님", "Add 님 to show respect: 선생님 (teacher)"]
};
HT.TIP_IDS = Object.keys(HT.TIPS);

HT.AVATARS = ['🐯', '🐰', '🐶', '🐱', '🐼', '🦊', '🐸', '🐧', '🐻', '🦄'];
HT.RIVALS = [
  { ko: '깡총이', en: 'Hoppy', emoji: '🐰' }, { ko: '느림보', en: 'Shelly', emoji: '🐢' },
  { ko: '멍멍이', en: 'Woofy', emoji: '🐶' }, { ko: '꼬꼬', en: 'Kokko', emoji: '🐔' },
  { ko: '판다', en: 'Panda', emoji: '🐼' }, { ko: '여우비', en: 'Foxy', emoji: '🦊' },
  { ko: '펭펭', en: 'Pengo', emoji: '🐧' }, { ko: '코코', en: 'Coco', emoji: '🐵' }
];

HT.BADGES = [
  { id: 'first', emoji: '🌱', ko: '첫 낱말', en: 'First word', test: function (d) { return d.wordsTyped >= 1; } },
  { id: 'w50', emoji: '📗', ko: '낱말 50개', en: '50 words', test: function (d) { return d.wordsTyped >= 50; } },
  { id: 'w200', emoji: '📚', ko: '낱말 200개', en: '200 words', test: function (d) { return d.wordsTyped >= 200; } },
  { id: 'streak3', emoji: '🔥', ko: '3일 연속', en: '3-day streak', test: function (d) { return d.maxStreak >= 3; } },
  { id: 'combo10', emoji: '⚡', ko: '10 콤보', en: '10 combo', test: function (d) { return d.maxCombo >= 10; } },
  { id: 'rain500', emoji: '☔', ko: '단어비 500점', en: '500 in Word Rain', test: function (d) { return (d.best.rain || 0) >= 500; } },
  { id: 'pop30', emoji: '🎈', ko: '풍선 30개', en: '30 balloons', test: function (d) { return d.maxPop >= 30; } },
  { id: 'race1', emoji: '🥇', ko: '레이스 1등', en: 'Won a race', test: function (d) { return d.raceWins >= 1; } },
  { id: 'keys', emoji: '⌨️', ko: '자리 박사', en: 'Key master', test: function (d) {
    return HT.STAGES.every(function (s) { return (d.stars['keys-' + s.id] || 0) >= 3; });
  } },
  { id: 'speed100', emoji: '🚀', ko: '100타', en: '100 keys/min', test: function (d) { return d.bestSpeed >= 100; } }
];

HT.FINGERS = [
  ['왼손 새끼', 'left pinky'], ['왼손 약지', 'left ring'], ['왼손 중지', 'left middle'], ['왼손 검지', 'left index'],
  ['오른손 검지', 'right index'], ['오른손 중지', 'right middle'], ['오른손 약지', 'right ring'], ['오른손 새끼', 'right pinky'],
  ['엄지', 'thumb']
];

HT.PRAISE = [['잘했어요!', 'Great!'], ['최고!', 'Awesome!'], ['멋져요!', 'Nice!'], ['완벽해요!', 'Perfect!'], ['대단해요!', 'Amazing!']];

// 화면 문구 [한국어, 영어]
HT.T = {
  appName: ['한글톡톡', 'Hangul TokTok'],
  hello: ['안녕, {name}! 오늘도 같이 한글 타자 놀이 하자!', "Hi {name}! Let's play with Hangul typing!"],
  practice: ['연습하기', 'Practice'], games: ['게임', 'Games'],
  keys: ['자리 익히기', 'Learn the keys'], keysDesc: ['자판 위치와 손가락 익히기', 'Find each letter on the keyboard'],
  words: ['낱말 연습', 'Word practice'], wordsDesc: ['그림 보고 낱말 치기', 'Type words with pictures'],
  sent: ['짧은 글', 'Short sentences'], sentDesc: ['쉬운 문장 따라 치기', 'Type easy sentences'],
  rain: ['단어비', 'Word Rain'], rainDesc: ['떨어지는 단어를 땅에 닿기 전에 쳐요', 'Type the words before they land'],
  balloon: ['풍선 팡팡', 'Balloon Pop'], balloonDesc: ['날아가는 풍선을 쳐서 터뜨려요', 'Type to pop balloons before they fly away'],
  race: ['타자 레이스', 'Typing Race'], raceDesc: ['컴퓨터 친구 3명과 달리기 시합', 'Race three computer friends'],
  moreGames: ['새 게임이 계속 추가돼요', 'More games are on the way'],
  streak: ['연속', 'Streak'], days: ['{n}일', '{n} days'], starsLbl: ['별', 'Stars'], wordsLbl: ['친 낱말', 'Words typed'],
  bestLbl: ['최고 점수', 'Best score'], badges: ['배지', 'Badges'],
  back: ['뒤로', 'Back'], next: ['다음 단계', 'Next'], retry: ['다시 하기', 'Play again'], menu: ['목록으로', 'Back to list'],
  home: ['처음으로', 'Home'], speed: ['타수', 'Speed'], speedUnit: ['타/분', 'keys/min'], acc: ['정확도', 'Accuracy'],
  time: ['걸린 시간', 'Time'], nextKey: ['다음 키', 'Next key'], spaceKey: ['띄어쓰기', 'Space'],
  review: ['복습', 'Review'], reviewDesc: ['틀렸던 낱말 다시 하기', 'Words you missed'],
  start: ['시작!', 'Start!'], content: ['무엇을 칠까요?', 'What to type?'],
  cJamo: ['자음·모음', 'Letters'], cSyl: ['글자', 'Syllables'], cWord: ['낱말', 'Words'], cSent: ['문장', 'Sentences'],
  speedSel: ['빠르기', 'Speed'], slow: ['느리게', 'Slow'], normal: ['보통', 'Normal'], fast: ['빠르게', 'Fast'],
  easyDesc: ['짧고 쉬운 낱말', 'Short, easy words'], normalDesc: ['두세 글자 낱말', 'Words with two or three blocks'],
  hardDesc: ['길거나 까다로운 낱말', 'Long or tricky words'],
  diffSel: ['난이도', 'Difficulty'], easy: ['쉬움', 'Easy'], hard: ['어려움', 'Hard'],
  lengthSel: ['거리', 'Distance'], short: ['짧게', 'Short'], long: ['길게', 'Long'],
  hint: ['힌트', 'Hints'], paused: ['잠깐 쉬어요', 'Paused'], resume: ['계속하기', 'Continue'],
  gameOver: ['게임 끝!', 'Game over!'], newBest: ['새 기록!', 'New record!'], score: ['점수', 'Score'],
  level: ['레벨', 'Level'], combo: ['콤보', 'Combo'], maxCombo: ['최고 콤보', 'Best combo'],
  caught: ['이번에 친 낱말 (누르면 소리가 나요)', 'Words you typed (tap to hear)'], tip: ['공부 팁', 'Tip'],
  typeHere: ['여기에 치는 글자가 나와요', 'Your typing shows here'], resultTitle: ['다 했어요!', 'All done!'],
  stage: ['단계', 'Stage'], soundFx: ['효과음', 'Sound'], readAloud: ['읽어주기', 'Read aloud'],
  pressKey: ['키보드로 치거나 아래 자판을 눌러요', 'Type on your keyboard or tap the keys below'],
  slowTime: ['느려져라!', 'Slow time!'], bonusHeart: ['하트 +1', 'Heart +1'], missed: ['놓쳤어요', 'Missed'],
  levelUp: ['레벨 {n}!', 'LEVEL {n}!'], newBadge: ['새 배지!', 'New badge!'],
  whoPlays: ['누가 놀까요?', "Who's playing?"], newProfile: ['새로 만들기', 'Add player'],
  yourName: ['이름', 'Name'], pickAvatar: ['캐릭터 고르기', 'Pick a character'], create: ['만들기', 'Create'],
  cancel: ['취소', 'Cancel'], del: ['지우기', 'Delete'], delConfirm: ['정말 지울까요? 기록도 지워져요', 'Delete this player and all records?'],
  yesDel: ['네, 지울게요', 'Yes, delete'], change: ['바꾸기', 'Switch'], nameNeeded: ['이름을 써 주세요', 'Please type a name'],
  rank: ['{n}등', '#{n}'], you: ['나', 'You'], ready: ['준비', 'Ready'], go: ['출발!', 'GO!'],
  raceDone: ['결승선 도착!', 'Finish!'], yourSpeed: ['내 속도', 'Your speed'], rivals: ['상대 선수', 'Rivals'],
  rivalNote: ['상대 속도는 내 평균 타수 {n}타에 맞춰져요', 'Rivals are matched to your average of {n} keys/min'],
  langToggle: ['English', '한국어'], debug: ['디버그', 'Debug'],
  story: ['동화 긴 글', 'Story typing'], storyDesc: ['동화 한 편을 5분 동안 쳐 봐요', 'Type a whole fairy tale in 5 minutes'],
  timeSel: ['시간', 'Time'], minutes: ['{n}분', '{n} min'], timeLeft: ['남은 시간', 'Time left'],
  timeUp: ['시간 끝!', "Time's up!"], storyDone: ['동화를 다 쳤어요!', 'You finished the story!'],
  linesDone: ['{m}줄 중 {n}줄 완성', '{n} of {m} lines done'],
  punctNote: ['문장부호( . , ! ? " )는 자동으로 채워져요', 'Punctuation ( . , ! ? " ) fills in by itself'],
  practiceNote: ['틀린 키는 안 들어가요. 맞는 키를 찾아봐요!', 'Wrong keys are ignored. Find the right one!']
};
