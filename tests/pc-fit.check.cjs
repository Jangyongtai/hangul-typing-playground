// PC 무대(1600x900)에서 모든 화면과 게임 안 창이 넘치지 않는지 검사: node build.mjs && NODE_PATH=$(npm root -g) node tests/pc-fit.check.cjs
// PC 무대 안에서 화면마다 넘치는 곳이 없는지 검사
const { chromium } = require('playwright');
const OUT = require('os').tmpdir() + '/';
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  for (const vp of [{ width: 1600, height: 900 }, { width: 1366, height: 768 }, { width: 1920, height: 1080 }, { width: 1280, height: 1024 }]) {
    const p = await b.newPage({ viewport: vp }); p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + require('path').resolve(__dirname, '../dist/index.html'));
    await p.evaluate(() => { for (let i = 0; i < 4; i++) HT.Store.addProfile('친구' + i, HT.AVATARS[i]); HT.Store.data().missed = { '사과': 2 }; });
    const routes = [
      ['profiles'], ['home'], ['keysMenu'], ['wordsMenu'], ['storyMenu'],
      ['words', 'HT.startWords("animals")'], ['sent', 'HT.startSentences()'], ['keys', 'HT.startKeysStage(0)'],
      ['story', 'HT.go("story",{id:"porridge",minutes:5})'], ['rain'], ['balloon'], ['race'],
      ['result', 'HT.go("result",{cfg:{again(){},next(){},menu:"home"},stars:3,speed:120,acc:97,secs:65,extra:"8줄 중 8줄 완성"})']
    ];
    for (const [name, code] of routes) {
      await p.evaluate(c => { c ? eval(c) : HT.go(arguments[0]); }, code || null).catch(() => {});
      if (!code) await p.evaluate(n => HT.go(n), name);
      await p.waitForTimeout(250);
      const r = await p.evaluate(() => {
        const v = document.getElementById('view'), s = document.querySelector('.side'), se = document.scrollingElement;
        return { view: v.scrollHeight - v.clientHeight, side: s.scrollHeight - s.clientHeight, page: se.scrollHeight - innerHeight, pageX: se.scrollWidth - innerWidth };
      });
      const over = Math.max(r.view, r.side, r.page, r.pageX);
      if (over > 1) { bad++; console.log(`${vp.width}x${vp.height} ${name} OVERFLOW`, JSON.stringify(r)); }
      if (vp.width === 1600 && ['home', 'wordsMenu', 'words', 'race', 'story'].includes(name)) await p.screenshot({ path: OUT + 'fit-' + name + '.png' });
    }
    // 게임 안 창 검사
    const ovChecks = [
      ['rain-start', 'HT.go("rain")', '#ov-start'], ['rain-pause', 'HT.go("rain"); document.getElementById("gv-start").click(); HT._gameCtl && HT.inputHandler({type:"esc"})', '#ov-pause'],
      ['rain-over', 'HT.go("rain"); document.getElementById("gv-start").click(); HT._gameCtl.end()', '#ov-over'],
      ['balloon-over', 'HT.go("balloon"); document.getElementById("gv-start").click(); HT._gameCtl.end()', '#ov-over'],
      ['race-setup', 'HT.go("race")', '#rc-setup'], ['race-over', 'HT.go("race"); document.getElementById("rc-start").click()', '#rc-over']
    ];
    for (const [name, code, sel] of ovChecks) {
      await p.evaluate(c => eval(c), code); await p.waitForTimeout(300);
      if (name === 'race-over') { await p.waitForTimeout(3600); await p.evaluate(() => HT._gameCtl.end()); await p.waitForTimeout(400); }
      const r = await p.evaluate(s => { const o = document.querySelector(s); const box = o.querySelector('.ov-box'); return { hidden: o.hidden, over: box.offsetHeight - o.clientHeight + 28 }; }, sel);
      if (r.hidden || r.over > 1) { bad++; console.log(`${vp.width}x${vp.height} ${name} OVERLAY`, JSON.stringify(r)); }
      if (vp.width === 1600) await p.screenshot({ path: OUT + 'ov-' + name + '.png' });
    }
    await p.close();
  }
  console.log(bad ? `FAIL ${bad}` : 'ALL FIT', 'ERRORS', errs.length ? errs : 'none'); await b.close();
})();
