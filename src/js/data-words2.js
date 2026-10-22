// 추가 낱말 주제와 문장. [한글, 로마자(국어의 로마자 표기법), 영어, 그림]
var HT = globalThis.HT = globalThis.HT || {};

HT.THEMES.push(
  { id: 'vehicles', ko: '탈것', en: 'Vehicles', emoji: '🚗', words: [
    ['자동차', 'ja-dong-cha', 'car', '🚗'], ['버스', 'beo-seu', 'bus', '🚌'], ['기차', 'gi-cha', 'train', '🚆'],
    ['비행기', 'bi-haeng-gi', 'airplane', '✈️'], ['배', 'bae', 'ship', '🚢'], ['자전거', 'ja-jeon-geo', 'bicycle', '🚲'],
    ['택시', 'taek-si', 'taxi', '🚕'], ['트럭', 'teu-reok', 'truck', '🚚'], ['지하철', 'ji-ha-cheol', 'subway', '🚇'],
    ['오토바이', 'o-to-ba-i', 'motorcycle', '🏍️'], ['헬리콥터', 'hel-li-kop-teo', 'helicopter', '🚁'], ['소방차', 'so-bang-cha', 'fire truck', '🚒'],
    ['구급차', 'gu-geup-cha', 'ambulance', '🚑'], ['경찰차', 'gyeong-chal-cha', 'police car', '🚓'], ['로켓', 'ro-ket', 'rocket', '🚀'],
    ['보트', 'bo-teu', 'boat', '🚤'], ['킥보드', 'kik-bo-deu', 'kick scooter', '🛴'], ['썰매', 'sseol-mae', 'sled', '🛷'],
    ['열기구', 'yeol-gi-gu', 'hot-air balloon', '🎈'], ['트랙터', 'teu-raek-teo', 'tractor', '🚜'], ['케이블카', 'ke-i-beul-ka', 'cable car', '🚡'],
    ['신호등', 'sin-ho-deung', 'traffic light', '🚦'], ['바퀴', 'ba-kwi', 'wheel', '🛞'], ['도로', 'do-ro', 'road', '🛣️'],
    ['주차장', 'ju-cha-jang', 'parking lot', '🅿️']
  ] },
  { id: 'weather', ko: '날씨·계절', en: 'Weather & seasons', emoji: '⛅', words: [
    ['날씨', 'nal-ssi', 'weather', '🌦️'], ['봄', 'bom', 'spring', '🌸'], ['여름', 'yeo-reum', 'summer', '🏖️'],
    ['가을', 'ga-eul', 'autumn', '🍂'], ['겨울', 'gyeo-ul', 'winter', '❄️'], ['바람', 'ba-ram', 'wind', '🌬️'],
    ['번개', 'beon-gae', 'lightning', '⚡'], ['천둥', 'cheon-dung', 'thunder', '🌩️'], ['안개', 'an-gae', 'fog', '🌫️'],
    ['태풍', 'tae-pung', 'typhoon', '🌀'], ['우산', 'u-san', 'umbrella', '☂️'], ['장화', 'jang-hwa', 'rain boots', '👢'],
    ['눈송이', 'nun-song-i', 'snowflake', '❄️'], ['햇빛', 'haet-bit', 'sunlight', '🌞'], ['무더위', 'mu-deo-wi', 'heat wave', '🥵'],
    ['소나기', 'so-na-gi', 'rain shower', '🌦️'], ['서리', 'seo-ri', 'frost', '🥶'], ['얼음', 'eo-reum', 'ice', '🧊'],
    ['고드름', 'go-deu-reum', 'icicle', '🧊'], ['단풍', 'dan-pung', 'autumn leaves', '🍁'], ['홍수', 'hong-su', 'flood', '🌊'],
    ['하늘색', 'ha-neul-saek', 'sky blue', '🩵'], ['일기 예보', 'il-gi ye-bo', 'weather forecast', '📺'], ['온도', 'on-do', 'temperature', '🌡️'],
    ['따뜻하다', 'tta-tteu-ta-da', 'warm', '☀️'], ['시원하다', 'si-won-ha-da', 'cool', '🍃'], ['춥다', 'chup-da', 'cold', '🥶'],
    ['덥다', 'deop-da', 'hot', '🥵']
  ] },
  { id: 'home', ko: '집·물건', en: 'Home & things', emoji: '🏠', words: [
    ['집', 'jip', 'house', '🏠'], ['문', 'mun', 'door', '🚪'], ['창문', 'chang-mun', 'window', '🪟'], ['침대', 'chim-dae', 'bed', '🛏️'],
    ['이불', 'i-bul', 'blanket', '🛌'], ['베개', 'be-gae', 'pillow', '🛏️'], ['소파', 'so-pa', 'sofa', '🛋️'], ['거울', 'geo-ul', 'mirror', '🪞'],
    ['텔레비전', 'tel-le-bi-jeon', 'television', '📺'], ['냉장고', 'naeng-jang-go', 'refrigerator', '🧊'], ['전화기', 'jeon-hwa-gi', 'telephone', '☎️'],
    ['휴대폰', 'hyu-dae-pon', 'cell phone', '📱'], ['컴퓨터', 'keom-pyu-teo', 'computer', '💻'], ['열쇠', 'yeol-soe', 'key', '🔑'],
    ['전등', 'jeon-deung', 'light', '💡'], ['화장실', 'hwa-jang-sil', 'bathroom', '🚽'], ['욕조', 'yok-jo', 'bathtub', '🛁'],
    ['칫솔', 'chit-sol', 'toothbrush', '🪥'], ['치약', 'chi-yak', 'toothpaste', '🦷'], ['비누', 'bi-nu', 'soap', '🧼'],
    ['수건', 'su-geon', 'towel', '🧺'], ['빗', 'bit', 'comb', '💇'], ['상자', 'sang-ja', 'box', '📦'], ['선물', 'seon-mul', 'present', '🎁'],
    ['사진', 'sa-jin', 'photo', '📷'], ['계단', 'gye-dan', 'stairs', '🪜'], ['지붕', 'ji-bung', 'roof', '🏡'], ['마당', 'ma-dang', 'yard', '🌳'],
    ['책상', 'chaek-sang', 'desk', '🪑'], ['장난감', 'jang-nan-gam', 'toy', '🧸'], ['인형', 'in-hyeong', 'doll', '🪆']
  ] },
  { id: 'clothes', ko: '옷', en: 'Clothes', emoji: '👕', words: [
    ['옷', 'ot', 'clothes', '👕'], ['바지', 'ba-ji', 'pants', '👖'], ['치마', 'chi-ma', 'skirt', '👗'], ['원피스', 'won-pi-seu', 'dress', '👗'],
    ['셔츠', 'syeo-cheu', 'shirt', '👔'], ['티셔츠', 'ti-syeo-cheu', 'T-shirt', '👕'], ['모자', 'mo-ja', 'hat', '🧢'], ['양말', 'yang-mal', 'socks', '🧦'],
    ['신발', 'sin-bal', 'shoes', '👟'], ['운동화', 'un-dong-hwa', 'sneakers', '👟'], ['구두', 'gu-du', 'dress shoes', '👞'], ['장갑', 'jang-gap', 'gloves', '🧤'],
    ['목도리', 'mok-do-ri', 'scarf', '🧣'], ['안경', 'an-gyeong', 'glasses', '👓'], ['잠옷', 'ja-mot', 'pajamas', '😴'], ['외투', 'oe-tu', 'coat', '🧥'],
    ['단추', 'dan-chu', 'button', '🔘'], ['주머니', 'ju-meo-ni', 'pocket', '👝'], ['반지', 'ban-ji', 'ring', '💍'], ['목걸이', 'mok-geo-ri', 'necklace', '📿'],
    ['수영복', 'su-yeong-bok', 'swimsuit', '🩱'], ['한복', 'han-bok', 'hanbok (Korean dress)', '👘'], ['우비', 'u-bi', 'raincoat', '🧥'],
    ['머리띠', 'meo-ri-tti', 'headband', '🎀'], ['리본', 'ri-bon', 'ribbon', '🎀'], ['허리띠', 'heo-ri-tti', 'belt', '🪢']
  ] },
  { id: 'jobs', ko: '직업', en: 'Jobs', emoji: '🧑‍🚒', words: [
    ['의사', 'ui-sa', 'doctor', '🧑‍⚕️'], ['간호사', 'gan-ho-sa', 'nurse', '👩‍⚕️'], ['경찰관', 'gyeong-chal-gwan', 'police officer', '👮'],
    ['소방관', 'so-bang-gwan', 'firefighter', '🧑‍🚒'], ['요리사', 'yo-ri-sa', 'cook', '🧑‍🍳'], ['농부', 'nong-bu', 'farmer', '🧑‍🌾'],
    ['가수', 'ga-su', 'singer', '🎤'], ['화가', 'hwa-ga', 'painter', '🎨'], ['과학자', 'gwa-hak-ja', 'scientist', '🧑‍🔬'],
    ['우주인', 'u-ju-in', 'astronaut', '🧑‍🚀'], ['조종사', 'jo-jong-sa', 'pilot', '🧑‍✈️'], ['운전사', 'un-jeon-sa', 'driver', '🚕'],
    ['우체부', 'u-che-bu', 'mail carrier', '📮'], ['미용사', 'mi-yong-sa', 'hairdresser', '💇'], ['수의사', 'su-ui-sa', 'vet', '🐾'],
    ['군인', 'gu-nin', 'soldier', '🪖'], ['작가', 'jak-ga', 'writer', '✍️'], ['배우', 'bae-u', 'actor', '🎭'], ['선수', 'seon-su', 'athlete', '🏅'],
    ['판사', 'pan-sa', 'judge', '⚖️'], ['기자', 'gi-ja', 'reporter', '📰'], ['사진가', 'sa-jin-ga', 'photographer', '📸'],
    ['목수', 'mok-su', 'carpenter', '🔨'], ['어부', 'eo-bu', 'fisher', '🎣'], ['제빵사', 'je-ppang-sa', 'baker', '🥐'],
    ['회사원', 'hoe-sa-won', 'office worker', '💼'], ['대통령', 'dae-tong-nyeong', 'president', '🏛️'], ['발명가', 'bal-myeong-ga', 'inventor', '💡']
  ] },
  { id: 'places', ko: '장소', en: 'Places', emoji: '🏪', words: [
    ['병원', 'byeong-won', 'hospital', '🏥'], ['약국', 'yak-guk', 'pharmacy', '💊'], ['시장', 'si-jang', 'market', '🧺'],
    ['마트', 'ma-teu', 'supermarket', '🛒'], ['은행', 'eun-haeng', 'bank', '🏦'], ['우체국', 'u-che-guk', 'post office', '🏤'],
    ['공원', 'gong-won', 'park', '🏞️'], ['놀이터', 'no-ri-teo', 'playground', '🛝'], ['도서관', 'do-seo-gwan', 'library', '📚'],
    ['동물원', 'dong-mu-rwon', 'zoo', '🦓'], ['박물관', 'bang-mul-gwan', 'museum', '🏛️'], ['수영장', 'su-yeong-jang', 'swimming pool', '🏊'],
    ['식당', 'sik-dang', 'restaurant', '🍽️'], ['빵집', 'ppang-jip', 'bakery', '🥖'], ['교회', 'gyo-hoe', 'church', '⛪'], ['절', 'jeol', 'temple', '🛕'],
    ['공항', 'gong-hang', 'airport', '🛫'], ['기차역', 'gi-cha-yeok', 'train station', '🚉'], ['경찰서', 'gyeong-chal-seo', 'police station', '🚔'],
    ['소방서', 'so-bang-seo', 'fire station', '🧯'], ['유치원', 'yu-chi-won', 'kindergarten', '🧸'], ['아파트', 'a-pa-teu', 'apartment', '🏢'],
    ['가게', 'ga-ge', 'shop', '🏪'], ['극장', 'geuk-jang', 'theater', '🎬'], ['시골', 'si-gol', 'countryside', '🌾'], ['도시', 'do-si', 'city', '🏙️'],
    ['마을', 'ma-eul', 'village', '🏘️'], ['호텔', 'ho-tel', 'hotel', '🏨']
  ] },
  { id: 'verbs', ko: '움직임', en: 'Action words', emoji: '🏃', words: [
    ['가다', 'ga-da', 'to go', '🚶'], ['오다', 'o-da', 'to come', '👋'], ['먹다', 'meok-da', 'to eat', '🍽️'], ['마시다', 'ma-si-da', 'to drink', '🥤'],
    ['자다', 'ja-da', 'to sleep', '😴'], ['일어나다', 'i-reo-na-da', 'to get up', '⏰'], ['앉다', 'an-da', 'to sit', '🪑'], ['서다', 'seo-da', 'to stand', '🧍'],
    ['걷다', 'geot-da', 'to walk', '🚶'], ['달리다', 'dal-li-da', 'to run', '🏃'], ['뛰다', 'ttwi-da', 'to jump', '🤸'], ['웃다', 'ut-da', 'to laugh', '😄'],
    ['울다', 'ul-da', 'to cry', '😭'], ['읽다', 'ik-da', 'to read', '📖'], ['쓰다', 'sseu-da', 'to write', '✍️'], ['그리다', 'geu-ri-da', 'to draw', '🖍️'],
    ['노래하다', 'no-rae-ha-da', 'to sing', '🎤'], ['춤추다', 'chum-chu-da', 'to dance', '💃'], ['놀다', 'nol-da', 'to play', '🪀'],
    ['씻다', 'ssit-da', 'to wash', '🧼'], ['보다', 'bo-da', 'to see', '👀'], ['듣다', 'deut-da', 'to listen', '👂'], ['말하다', 'mal-ha-da', 'to speak', '🗣️'],
    ['열다', 'yeol-da', 'to open', '📂'], ['닫다', 'dat-da', 'to close', '🚪'], ['주다', 'ju-da', 'to give', '🎁'], ['받다', 'bat-da', 'to receive', '📥'],
    ['만들다', 'man-deul-da', 'to make', '🛠️'], ['사다', 'sa-da', 'to buy', '🛍️'], ['기다리다', 'gi-da-ri-da', 'to wait', '⏳'],
    ['돕다', 'dop-da', 'to help', '🤝'], ['수영하다', 'su-yeong-ha-da', 'to swim', '🏊'], ['공부하다', 'gong-bu-ha-da', 'to study', '📚']
  ] },
  { id: 'feelings', ko: '마음', en: 'Feelings', emoji: '😊', words: [
    ['기쁘다', 'gi-ppeu-da', 'happy', '😊'], ['슬프다', 'seul-peu-da', 'sad', '😢'], ['화나다', 'hwa-na-da', 'angry', '😠'],
    ['무섭다', 'mu-seop-da', 'scared', '😱'], ['놀라다', 'nol-la-da', 'surprised', '😲'], ['졸리다', 'jol-li-da', 'sleepy', '😪'],
    ['배고프다', 'bae-go-peu-da', 'hungry', '🍽️'], ['심심하다', 'sim-sim-ha-da', 'bored', '🥱'], ['신나다', 'sin-na-da', 'excited', '🤩'],
    ['부끄럽다', 'bu-kkeu-reop-da', 'shy', '😳'], ['행복', 'haeng-bok', 'happiness', '🥰'], ['사랑', 'sa-rang', 'love', '💕'],
    ['걱정', 'geok-jeong', 'worry', '😟'], ['용기', 'yong-gi', 'courage', '🦁'], ['웃음', 'u-seum', 'laughter', '😆'], ['눈물', 'nun-mul', 'tears', '💧'],
    ['미소', 'mi-so', 'smile', '🙂'], ['피곤하다', 'pi-gon-ha-da', 'tired', '😩'], ['아프다', 'a-peu-da', 'sick / it hurts', '🤒'],
    ['좋다', 'jo-ta', 'good', '👍'], ['싫다', 'sil-ta', 'to dislike', '👎'], ['궁금하다', 'gung-geum-ha-da', 'curious', '🤔'],
    ['자랑스럽다', 'ja-rang-seu-reop-da', 'proud', '🏅'], ['고맙다', 'go-map-da', 'thankful', '🙏'], ['반갑다', 'ban-gap-da', 'glad to see you', '🤗']
  ] },
  { id: 'plants', ko: '채소·과일', en: 'Vegetables & fruit', emoji: '🥕', words: [
    ['당근', 'dang-geun', 'carrot', '🥕'], ['감자', 'gam-ja', 'potato', '🥔'], ['고구마', 'go-gu-ma', 'sweet potato', '🍠'], ['양파', 'yang-pa', 'onion', '🧅'],
    ['마늘', 'ma-neul', 'garlic', '🧄'], ['오이', 'o-i', 'cucumber', '🥒'], ['토마토', 'to-ma-to', 'tomato', '🍅'], ['옥수수', 'ok-su-su', 'corn', '🌽'],
    ['배추', 'bae-chu', 'napa cabbage', '🥬'], ['버섯', 'beo-seot', 'mushroom', '🍄'], ['고추', 'go-chu', 'chili pepper', '🌶️'], ['호박', 'ho-bak', 'pumpkin', '🎃'],
    ['가지', 'ga-ji', 'eggplant', '🍆'], ['콩', 'kong', 'bean', '🫘'], ['브로콜리', 'beu-ro-kol-li', 'broccoli', '🥦'], ['시금치', 'si-geum-chi', 'spinach', '🥬'],
    ['파', 'pa', 'green onion', '🌿'], ['귤', 'gyul', 'tangerine', '🍊'], ['복숭아', 'bok-sung-a', 'peach', '🍑'], ['참외', 'cha-moe', 'Korean melon', '🍈'],
    ['레몬', 're-mon', 'lemon', '🍋'], ['체리', 'che-ri', 'cherry', '🍒'], ['키위', 'ki-wi', 'kiwi', '🥝'], ['파인애플', 'pa-in-ae-peul', 'pineapple', '🍍'],
    ['감', 'gam', 'persimmon', '🟠'], ['코코넛', 'ko-ko-neot', 'coconut', '🥥'], ['블루베리', 'beul-lu-be-ri', 'blueberry', '🫐'], ['멜론', 'mel-lon', 'melon', '🍈']
  ] },
  { id: 'sea', ko: '바다 친구', en: 'Sea friends', emoji: '🐙', words: [
    ['문어', 'mu-neo', 'octopus', '🐙'], ['오징어', 'o-jing-eo', 'squid', '🦑'], ['고래', 'go-rae', 'whale', '🐳'], ['상어', 'sang-eo', 'shark', '🦈'],
    ['돌고래', 'dol-go-rae', 'dolphin', '🐬'], ['거북이', 'geo-bu-gi', 'turtle', '🐢'], ['게', 'ge', 'crab', '🦀'], ['새우', 'sae-u', 'shrimp', '🦐'],
    ['조개', 'jo-gae', 'clam', '🐚'], ['불가사리', 'bul-ga-sa-ri', 'starfish', '⭐'], ['해파리', 'hae-pa-ri', 'jellyfish', '🪼'], ['물개', 'mul-gae', 'seal', '🦭'],
    ['펭귄', 'peng-gwin', 'penguin', '🐧'], ['복어', 'bo-geo', 'pufferfish', '🐡'], ['열대어', 'yeol-dae-eo', 'tropical fish', '🐠'], ['미역', 'mi-yeok', 'seaweed', '🌿'],
    ['모래', 'mo-rae', 'sand', '🏖️'], ['파도', 'pa-do', 'wave', '🌊'], ['조개껍데기', 'jo-gae-kkeop-de-gi', 'seashell', '🐚'], ['수달', 'su-dal', 'otter', '🦦'],
    ['가오리', 'ga-o-ri', 'stingray', '🐟'], ['바닷가', 'ba-dat-ga', 'beach', '🏝️'], ['섬', 'seom', 'island', '🏝️'], ['산호', 'san-ho', 'coral', '🪸'],
    ['해마', 'hae-ma', 'seahorse', '🌊']
  ] },
  { id: 'critters', ko: '곤충과 새', en: 'Bugs & birds', emoji: '🐞', words: [
    ['개미', 'gae-mi', 'ant', '🐜'], ['벌', 'beol', 'bee', '🐝'], ['꿀벌', 'kkul-beol', 'honeybee', '🍯'], ['무당벌레', 'mu-dang-beol-le', 'ladybug', '🐞'],
    ['메뚜기', 'me-ttu-gi', 'grasshopper', '🦗'], ['귀뚜라미', 'gwi-ttu-ra-mi', 'cricket', '🦗'], ['거미', 'geo-mi', 'spider', '🕷️'], ['거미줄', 'geo-mi-jul', 'spider web', '🕸️'],
    ['모기', 'mo-gi', 'mosquito', '🦟'], ['파리', 'pa-ri', 'fly', '🪰'], ['애벌레', 'ae-beol-le', 'caterpillar', '🐛'], ['달팽이', 'dal-paeng-i', 'snail', '🐌'],
    ['지렁이', 'ji-reong-i', 'earthworm', '🪱'], ['바퀴벌레', 'ba-kwi-beol-le', 'cockroach', '🪳'], ['딱정벌레', 'ttak-jeong-beol-le', 'beetle', '🪲'], ['전갈', 'jeon-gal', 'scorpion', '🦂'],
    ['새', 'sae', 'bird', '🐦'], ['닭', 'dak', 'chicken', '🐔'], ['병아리', 'byeong-a-ri', 'chick', '🐤'], ['참새', 'cham-sae', 'sparrow', '🐦'],
    ['비둘기', 'bi-dul-gi', 'pigeon', '🕊️'], ['독수리', 'dok-su-ri', 'eagle', '🦅'], ['부엉이', 'bu-eong-i', 'owl', '🦉'], ['앵무새', 'aeng-mu-sae', 'parrot', '🦜'],
    ['까치', 'kka-chi', 'magpie', '🐦‍⬛'], ['공작', 'gong-jak', 'peacock', '🦚'], ['백조', 'baek-jo', 'swan', '🦢'], ['홍학', 'hong-hak', 'flamingo', '🦩'],
    ['칠면조', 'chil-myeon-jo', 'turkey', '🦃'], ['날개', 'nal-gae', 'wing', '🪽'], ['깃털', 'git-teol', 'feather', '🪶'], ['둥지', 'dung-ji', 'nest', '🪺']
  ] },
  { id: 'animals2', ko: '더 많은 동물', en: 'More animals', emoji: '🦓', words: [
    ['말', 'mal', 'horse', '🐴'], ['소', 'so', 'cow', '🐮'], ['양', 'yang', 'sheep', '🐑'], ['염소', 'yeom-so', 'goat', '🐐'], ['여우', 'yeo-u', 'fox', '🦊'],
    ['늑대', 'neuk-dae', 'wolf', '🐺'], ['다람쥐', 'da-ram-jwi', 'squirrel', '🐿️'], ['쥐', 'jwi', 'mouse', '🐭'], ['하마', 'ha-ma', 'hippo', '🦛'],
    ['코뿔소', 'ko-ppul-so', 'rhino', '🦏'], ['얼룩말', 'eol-lung-mal', 'zebra', '🦓'], ['판다', 'pan-da', 'panda', '🐼'], ['캥거루', 'kaeng-geo-ru', 'kangaroo', '🦘'],
    ['낙타', 'nak-ta', 'camel', '🐫'], ['사슴', 'sa-seum', 'deer', '🦌'], ['고슴도치', 'go-seum-do-chi', 'hedgehog', '🦔'], ['뱀', 'baem', 'snake', '🐍'],
    ['악어', 'a-geo', 'crocodile', '🐊'], ['공룡', 'gong-nyong', 'dinosaur', '🦕'], ['박쥐', 'bak-jwi', 'bat', '🦇'], ['너구리', 'neo-gu-ri', 'raccoon', '🦝'],
    ['코알라', 'ko-al-la', 'koala', '🐨'], ['북극곰', 'buk-geuk-gom', 'polar bear', '🐻‍❄️'], ['고릴라', 'go-ril-la', 'gorilla', '🦍'], ['햄스터', 'haem-seu-teo', 'hamster', '🐹']
  ] },
  { id: 'play', ko: '놀이·악기', en: 'Play & music', emoji: '🎸', words: [
    ['피아노', 'pi-a-no', 'piano', '🎹'], ['기타', 'gi-ta', 'guitar', '🎸'], ['북', 'buk', 'drum', '🥁'], ['바이올린', 'ba-i-ol-lin', 'violin', '🎻'],
    ['나팔', 'na-pal', 'trumpet', '🎺'], ['피리', 'pi-ri', 'pipe (flute)', '🪈'], ['풍선', 'pung-seon', 'balloon', '🎈'], ['연', 'yeon', 'kite', '🪁'],
    ['팽이', 'paeng-i', 'spinning top', '🌀'], ['블록', 'beul-lok', 'blocks', '🧱'], ['퍼즐', 'peo-jeul', 'puzzle', '🧩'], ['그네', 'geu-ne', 'swing', '🌳'],
    ['미끄럼틀', 'mi-kkeu-reom-teul', 'slide', '🛝'], ['숨바꼭질', 'sum-ba-kkok-jil', 'hide-and-seek', '🙈'], ['술래잡기', 'sul-lae-jap-gi', 'tag', '🏃'],
    ['줄넘기', 'jul-leom-gi', 'jump rope', '🪢'], ['비눗방울', 'bi-nut-bang-ul', 'soap bubbles', '🫧'], ['색종이', 'saek-jong-i', 'colored paper', '📄'],
    ['크레파스', 'keu-re-pa-seu', 'crayons', '🖍️'], ['물감', 'mul-gam', 'paints', '🎨'], ['게임', 'ge-im', 'game', '🎮'], ['주사위', 'ju-sa-wi', 'dice', '🎲'],
    ['카드', 'ka-deu', 'card', '🃏'], ['로봇', 'ro-bot', 'robot', '🤖'], ['모래성', 'mo-rae-seong', 'sandcastle', '🏰'], ['눈싸움', 'nun-ssa-um', 'snowball fight', '☃️']
  ] },
  { id: 'time', ko: '시간·요일', en: 'Time & days', emoji: '📅', words: [
    ['오늘', 'o-neul', 'today', '📅'], ['어제', 'eo-je', 'yesterday', '⏪'], ['내일', 'nae-il', 'tomorrow', '⏩'], ['아침', 'a-chim', 'morning', '🌅'],
    ['점심', 'jeom-sim', 'lunch / noon', '🍱'], ['저녁', 'jeo-nyeok', 'evening', '🌆'], ['밤', 'bam', 'night', '🌃'], ['새벽', 'sae-byeok', 'dawn', '🌄'],
    ['월요일', 'wo-ryo-il', 'Monday (moon day)', '🌙'], ['화요일', 'hwa-yo-il', 'Tuesday (fire day)', '🔥'], ['수요일', 'su-yo-il', 'Wednesday (water day)', '💧'],
    ['목요일', 'mo-gyo-il', 'Thursday (tree day)', '🌳'], ['금요일', 'geu-myo-il', 'Friday (gold day)', '🪙'], ['토요일', 'to-yo-il', 'Saturday (earth day)', '🪨'],
    ['일요일', 'i-ryo-il', 'Sunday (sun day)', '☀️'], ['주말', 'ju-mal', 'weekend', '🎉'], ['생일', 'saeng-il', 'birthday', '🎂'], ['시간', 'si-gan', 'time', '⌛'],
    ['달력', 'dal-lyeok', 'calendar', '📆'], ['올해', 'ol-hae', 'this year', '🗓️'], ['작년', 'jang-nyeon', 'last year', '🗓️'], ['방학', 'bang-hak', 'school vacation', '🏖️'],
    ['지금', 'ji-geum', 'now', '⏱️'], ['매일', 'mae-il', 'every day', '🔁'], ['새해', 'sae-hae', 'new year', '🎍']
  ] },
  { id: 'describe', ko: '모양·맛·크기', en: 'Describing words', emoji: '📏', words: [
    ['크다', 'keu-da', 'big', '🐘'], ['작다', 'jak-da', 'small', '🐭'], ['길다', 'gil-da', 'long', '📏'], ['짧다', 'jjal-da', 'short', '✂️'],
    ['많다', 'man-ta', 'many', '🔢'], ['적다', 'jeok-da', 'few', '🤏'], ['높다', 'nop-da', 'high', '⛰️'], ['낮다', 'nat-da', 'low', '⬇️'],
    ['빠르다', 'ppa-reu-da', 'fast', '🐆'], ['느리다', 'neu-ri-da', 'slow', '🐌'], ['무겁다', 'mu-geop-da', 'heavy', '🏋️'], ['가볍다', 'ga-byeop-da', 'light (not heavy)', '🪶'],
    ['뜨겁다', 'tteu-geop-da', 'hot (to touch)', '🔥'], ['차갑다', 'cha-gap-da', 'cold (to touch)', '🧊'], ['깨끗하다', 'kkae-kkeu-ta-da', 'clean', '✨'],
    ['더럽다', 'deo-reop-da', 'dirty', '🟫'], ['예쁘다', 'ye-ppeu-da', 'pretty', '🌺'], ['귀엽다', 'gwi-yeop-da', 'cute', '🐥'], ['달다', 'dal-da', 'sweet', '🍬'],
    ['짜다', 'jja-da', 'salty', '🧂'], ['맵다', 'maep-da', 'spicy', '🌶️'], ['시다', 'si-da', 'sour', '🍋'], ['동그라미', 'dong-geu-ra-mi', 'circle', '⚪'],
    ['세모', 'se-mo', 'triangle', '🔺'], ['네모', 'ne-mo', 'square', '🟥']
  ] },
  { id: 'kitchen', ko: '부엌·식사', en: 'Kitchen & meals', emoji: '🍳', words: [
    ['숟가락', 'sut-ga-rak', 'spoon', '🥄'], ['젓가락', 'jeot-ga-rak', 'chopsticks', '🥢'], ['포크', 'po-keu', 'fork', '🍴'], ['칼', 'kal', 'knife', '🔪'],
    ['접시', 'jeop-si', 'plate', '🍽️'], ['그릇', 'geu-reut', 'bowl', '🥣'], ['컵', 'keop', 'cup', '🥤'], ['냄비', 'naem-bi', 'pot', '🍲'], ['주전자', 'ju-jeon-ja', 'kettle', '🫖'],
    ['국', 'guk', 'soup', '🍲'], ['떡', 'tteok', 'rice cake', '🍡'], ['김밥', 'gim-bap', 'gimbap', '🍙'], ['만두', 'man-du', 'dumpling', '🥟'], ['국수', 'guk-su', 'noodles', '🍜'],
    ['떡볶이', 'tteok-bo-kki', 'tteokbokki', '🌶️'], ['불고기', 'bul-go-gi', 'bulgogi', '🥩'], ['비빔밥', 'bi-bim-bap', 'bibimbap', '🥗'], ['아이스크림', 'a-i-seu-keu-rim', 'ice cream', '🍦'],
    ['케이크', 'ke-i-keu', 'cake', '🍰'], ['사탕', 'sa-tang', 'candy', '🍬'], ['초콜릿', 'cho-kol-lit', 'chocolate', '🍫'], ['주스', 'ju-seu', 'juice', '🧃'],
    ['치즈', 'chi-jeu', 'cheese', '🧀'], ['햄버거', 'haem-beo-geo', 'hamburger', '🍔'], ['소금', 'so-geum', 'salt', '🧂'], ['설탕', 'seol-tang', 'sugar', '🧁'],
    ['꿀', 'kkul', 'honey', '🍯'], ['아침밥', 'a-chim-bap', 'breakfast', '🍳'], ['간식', 'gan-sik', 'snack time', '🥨']
  ] },
  { id: 'sports', ko: '운동', en: 'Sports', emoji: '⚽', words: [
    ['축구', 'chuk-gu', 'soccer', '⚽'], ['야구', 'ya-gu', 'baseball', '⚾'], ['농구', 'nong-gu', 'basketball', '🏀'], ['배구', 'bae-gu', 'volleyball', '🏐'],
    ['탁구', 'tak-gu', 'table tennis', '🏓'], ['테니스', 'te-ni-seu', 'tennis', '🎾'], ['수영', 'su-yeong', 'swimming', '🏊'], ['태권도', 'tae-gwon-do', 'taekwondo', '🥋'],
    ['달리기', 'dal-li-gi', 'running', '🏃'], ['스키', 'seu-ki', 'skiing', '⛷️'], ['스케이트', 'seu-ke-i-teu', 'skating', '⛸️'], ['골프', 'gol-peu', 'golf', '⛳'],
    ['등산', 'deung-san', 'hiking', '🥾'], ['체조', 'che-jo', 'gymnastics', '🤸'], ['줄다리기', 'jul-da-ri-gi', 'tug of war', '🪢'], ['배드민턴', 'bae-deu-min-teon', 'badminton', '🏸'],
    ['볼링', 'bol-ling', 'bowling', '🎳'], ['씨름', 'ssi-reum', 'Korean wrestling', '🤼'], ['응원', 'eung-won', 'cheering', '📣'], ['금메달', 'geum-me-dal', 'gold medal', '🥇'],
    ['경기', 'gyeong-gi', 'match', '🏟️'], ['운동장', 'un-dong-jang', 'sports field', '🏃'], ['호루라기', 'ho-ru-ra-gi', 'whistle', '📢'], ['이기다', 'i-gi-da', 'to win', '🏆'],
    ['지다', 'ji-da', 'to lose', '😞']
  ] },
  { id: 'korea', ko: '한국 문화', en: 'Korean culture', emoji: '🇰🇷', words: [
    ['한국', 'han-guk', 'Korea', '🇰🇷'], ['한글', 'han-geul', 'Hangul', '🔤'], ['태극기', 'tae-geuk-gi', 'Korean flag', '🇰🇷'], ['서울', 'seo-ul', 'Seoul', '🏙️'],
    ['설날', 'seol-lal', 'Lunar New Year', '🧧'], ['추석', 'chu-seok', 'Chuseok (harvest festival)', '🌕'], ['송편', 'song-pyeon', 'songpyeon (rice cake)', '🍡'],
    ['떡국', 'tteok-guk', 'rice cake soup', '🥣'], ['세배', 'se-bae', "New Year's bow", '🙇'], ['윷놀이', 'yun-no-ri', 'yut game', '🎲'],
    ['제기차기', 'je-gi-cha-gi', 'jegi kicking', '🪶'], ['연날리기', 'yeon-nal-li-gi', 'kite flying', '🪁'], ['무궁화', 'mu-gung-hwa', 'rose of Sharon', '🌺'],
    ['김', 'gim', 'dried seaweed', '🍘'], ['한옥', 'ha-nok', 'traditional house', '🏯'], ['부채', 'bu-chae', 'hand fan', '🪭'], ['탈', 'tal', 'mask', '🎭'],
    ['장구', 'jang-gu', 'janggu drum', '🥁'], ['가야금', 'ga-ya-geum', 'gayageum (zither)', '🎶'], ['세종대왕', 'se-jong-dae-wang', 'King Sejong', '👑'],
    ['독도', 'dok-do', 'Dokdo island', '🏝️'], ['제주도', 'je-ju-do', 'Jeju Island', '🍊'], ['경복궁', 'gyeong-bok-gung', 'Gyeongbokgung Palace', '🏯'],
    ['호떡', 'ho-tteok', 'sweet pancake', '🥞'], ['붕어빵', 'bung-eo-ppang', 'fish-shaped bread', '🐟']
  ] }
);

HT.SENTENCES.push.apply(HT.SENTENCES, [
  ['저는 여덟 살이에요', 'I am eight years old.'], ['우리 가족은 네 명이에요', 'There are four people in my family.'],
  ['아빠는 요리를 잘해요', 'Dad is good at cooking.'], ['동생이 노래를 불러요', 'My little sibling sings a song.'],
  ['할머니 댁에 놀러 가요', "I'm going to visit Grandma's house."], ['저는 초록색을 좋아해요', 'I like green.'],
  ['사과는 빨간색이에요', 'Apples are red.'], ['바나나는 노란색이에요', 'Bananas are yellow.'], ['하늘이 정말 파래요', 'The sky is really blue.'],
  ['오늘은 월요일이에요', 'Today is Monday.'], ['내일은 토요일이에요', 'Tomorrow is Saturday.'], ['주말에 공원에 가요', 'I go to the park on the weekend.'],
  ['지금 몇 시예요', 'What time is it now?'], ['아침에 일찍 일어나요', 'I get up early in the morning.'], ['밥을 맛있게 먹어요', 'I enjoy my meal.'],
  ['우유를 한 컵 마셔요', 'I drink a cup of milk.'], ['이를 닦아요', 'I brush my teeth.'], ['일찍 자야 키가 커요', 'Go to bed early to grow tall.'],
  ['비가 오면 우산을 써요', 'When it rains, I use an umbrella.'], ['눈이 오면 눈사람을 만들어요', 'When it snows, I make a snowman.'],
  ['여름에는 바다에 가요', 'In summer we go to the sea.'], ['겨울에는 정말 추워요', 'It is really cold in winter.'],
  ['가을에는 단풍이 예뻐요', 'The autumn leaves are pretty in fall.'], ['봄에는 꽃이 피어요', 'Flowers bloom in spring.'],
  ['강아지가 꼬리를 흔들어요', 'The puppy wags its tail.'], ['고양이가 야옹 하고 울어요', 'The cat says meow.'],
  ['새가 하늘을 날아요', 'A bird flies in the sky.'], ['물고기가 물속에서 헤엄쳐요', 'Fish swim in the water.'],
  ['코끼리는 코가 길어요', 'Elephants have long noses.'], ['기린은 목이 길어요', 'Giraffes have long necks.'], ['토끼는 귀가 커요', 'Rabbits have big ears.'],
  ['저는 축구를 좋아해요', 'I like soccer.'], ['친구와 함께 공을 차요', 'I kick a ball with my friend.'], ['우리는 같은 반이에요', 'We are in the same class.'],
  ['선생님께 인사해요', 'I say hello to my teacher.'], ['도서관에서 책을 빌려요', 'I borrow books from the library.'],
  ['그림을 그리는 것이 재미있어요', 'Drawing pictures is fun.'], ['피아노를 배우고 있어요', 'I am learning the piano.'],
  ['숙제를 다 했어요', 'I finished my homework.'], ['오늘 학교에서 칭찬을 받았어요', 'I was praised at school today.'],
  ['버스를 타고 학교에 가요', 'I take the bus to school.'], ['비행기를 타고 여행을 가요', 'We travel by airplane.'],
  ['기차 창밖으로 산이 보여요', 'I can see mountains outside the train window.'], ['신호등이 초록불이면 건너요', 'Cross when the light is green.'],
  ['길을 건널 때 손을 들어요', 'I raise my hand when I cross the street.'], ['배가 아파서 병원에 갔어요', 'My tummy hurt, so I went to the hospital.'],
  ['감기에 걸려서 콧물이 나요', 'I caught a cold and my nose is running.'], ['약을 먹고 푹 쉬어요', 'I take medicine and get some rest.'],
  ['오늘은 기분이 좋아요', 'I feel good today.'], ['조금 슬퍼요', "I'm a little sad."], ['깜짝 놀랐어요', 'I was surprised.'], ['너무 졸려요', "I'm so sleepy."],
  ['정말 재미있었어요', 'It was really fun.'], ['다음에 또 하고 싶어요', 'I want to do it again next time.'], ['같이 놀자', "Let's play together."],
  ['도와줘서 고마워요', 'Thank you for helping me.'], ['늦어서 미안해요', "I'm sorry I'm late."], ['걱정하지 마세요', "Don't worry."],
  ['우리 같이 사진 찍어요', "Let's take a picture together."], ['생일 선물로 인형을 받았어요', 'I got a doll as a birthday present.'],
  ['케이크에 초를 꽂아요', 'I put candles on the cake.'], ['엄마가 김밥을 싸 주셨어요', 'Mom packed gimbap for me.'],
  ['떡볶이는 조금 매워요', 'Tteokbokki is a little spicy.'], ['아이스크림이 녹고 있어요', 'The ice cream is melting.'],
  ['물을 많이 마셔요', 'I drink a lot of water.'], ['채소도 골고루 먹어요', 'I eat all kinds of vegetables too.'],
  ['방을 깨끗하게 치워요', 'I tidy up my room.'], ['장난감을 제자리에 놓아요', 'I put my toys back where they belong.'],
  ['창문을 열어 주세요', 'Please open the window.'], ['문을 닫아 주세요', 'Please close the door.'], ['조용히 해 주세요', 'Please be quiet.'],
  ['천천히 말해 주세요', 'Please speak slowly.'], ['한 번 더 말해 주세요', 'Please say it one more time.'], ['화장실이 어디예요', 'Where is the bathroom?'],
  ['이것은 무엇이에요', 'What is this?'], ['저는 한국어를 배워요', 'I am learning Korean.'], ['한글은 참 쉬워요', 'Hangul is really easy.'],
  ['매일 조금씩 연습해요', 'I practice a little every day.'], ['오늘도 열심히 했어요', 'I worked hard today too.'],
  ['추석에는 송편을 먹어요', 'We eat songpyeon on Chuseok.'], ['설날에는 세배를 해요', 'We bow to our elders on Lunar New Year.']
].map(function (s) { return { text: s[0], en: s[1] }; }));

// 받침 있는 글자 (자리 익히기 10단계, 글자 게임 레벨 3부터)
HT.SYLLABLES_B = (function () {
  var cs = 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅎ', vs = 'ㅏㅓㅗㅜ', fs = 'ㄱㄴㄹㅁ', out = [];
  for (var i = 0; i < cs.length; i++) for (var j = 0; j < vs.length; j++) for (var k = 0; k < fs.length; k++) {
    out.push(HT.composeBlock({ c: cs[i], v: vs[j], f: fs[k] }));
  }
  return out;
})();

HT.buildWordIndex();
