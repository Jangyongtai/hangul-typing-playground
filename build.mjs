// 소스 파일들을 한 장짜리 HTML로 묶습니다.
//   dist/artifact.html : claude.ai 아티팩트용 (html/head/body 태그 없음)
//   dist/index.html    : 브라우저에서 바로 열거나 GitHub Pages용 (완전한 문서)
// 사용법: node build.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const JS_ORDER = ['config', 'hangul', 'data', 'data-stories', 'data-words2', 'audio', 'store', 'ui', 'art', 'views', 'views-story', 'game-falling', 'game-race', 'app'];
const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');

const css = read('./src/styles.css');
const js = JS_ORDER.map((n) => `// ==== ${n}.js ====\n` + read(`./src/js/${n}.js`)).join('\n');
const fragment = read('./src/index.html')
  .replace('/*@@CSS@@*/', () => css)
  .replace('/*@@JS@@*/', () => js.replace(/<\/script/gi, '<\\/script'));

const full = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src data: blob:; media-src 'none'; connect-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'">
<meta name="referrer" content="no-referrer">
</head>
<body>
${fragment}
</body>
</html>
`;

mkdirSync(new URL('./dist/', import.meta.url), { recursive: true });
writeFileSync(new URL('./dist/artifact.html', import.meta.url), fragment);
writeFileSync(new URL('./dist/index.html', import.meta.url), full);
console.log(`built: ${(fragment.length / 1024).toFixed(1)} KB`);
