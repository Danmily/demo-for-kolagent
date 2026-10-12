const $ = s => document.querySelector(s);
const chat = $('#chat'), log = $('#log');
const AI = { name: '老张的AI分身', av: '<div class="avatar ai">张</div>' };
const ME = { name: '小雷', av: '<div class="avatar me">雷</div>' };
const state = { signed: false, booked: false, sub: '未订阅', drawn: false };

function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 2200); }
function scroll() { chat.scrollTop = chat.scrollHeight; }
function sys(t) { chat.insertAdjacentHTML('beforeend', `<div class="sys">${t}</div>`); scroll(); }
function other(name, av, html, lv = '') {
  chat.insertAdjacentHTML('beforeend', `<div class="row"><div class="avatar" style="background:${av}">${name[0]}</div><div class="body"><div class="name">${name}${lv ? `<span class="lv">${lv}</span>` : ''}</div><div class="bubble">${html}</div></div></div>`); scroll();
}
let override = null;
function me(text) {
  if (override) { text = override; override = null; }
  chat.insertAdjacentHTML('beforeend', `<div class="row me">${ME.av}<div class="body"><div class="name">${ME.name}<span class="lv">粉丝牌6</span></div><div class="bubble">${text}</div></div></div>`); scroll();
}
function ai(html, raw = false) {
  const inner = raw ? html : `<div class="bubble">${html}</div>`;
  chat.insertAdjacentHTML('beforeend', `<div class="row">${AI.av}<div class="body"><div class="name">${AI.name}<span class="badge">AI分身</span></div>${inner}</div></div>`); scroll();
}
function step(cap, text) { log.insertAdjacentHTML('afterbegin', `<div class="step"><span class="cap">${cap}</span>${text}</div>`); }
function reply(fn, delay = 650) {
  chat.insertAdjacentHTML('beforeend', `<div class="row" id="typing">${AI.av}<div class="body"><div class="bubble typing">正在输入…</div></div></div>`); scroll();
  setTimeout(() => { $('#typing')?.remove(); fn(); }, delay);
}

/* ---------- 场景 ---------- */
const S = {
  live() {
    me('@老张AI分身 今晚播吗？');
    step('②分层承接', '意图=<b>问UP主动态</b>，粉丝层级=普通 → 分身直接回答，不打扰本人');
    reply(() => {
      ai('播的旅行者！今晚 <b>20:00</b> 老张会讲新版本深渊满星配队，你上次卡的深渊下半正好会讲到～', false);
      ai(`<div class="card-msg"><div class="cover live">🔴 今晚 20:00 直播预告</div><div class="cbody"><b>新版本深渊满星配队 · 零氪也能抄</b><span class="meta">已有 1,203 人预约</span><button class="btn ${state.booked ? 'done' : ''}" onclick="book(this)">${state.booked ? '✓ 已预约，开播提醒你' : '一键预约直播'}</button></div><div class="src">来自 B站直播间 · 提瓦特老张</div></div>`, true);
      step('③粉丝记忆', '读取档案「10.09 问过深渊下半」→ 回复中主动关联');
    });
  },
  video() {
    me('老张最近更新了啥？');
    step('②分层承接', '意图=<b>追更</b> → 返回 UP 主最新内容卡片，可跳转 B 站');
    reply(() => {
      ai('这周老张更新了 2 期，第一期和你在练的火系主C有关，推荐先看👇');
      ai(`<div class="card-msg"><div class="cover">▶ 零氪也能用的火系队 · 12:30</div><div class="cbody"><b>零氪也能用的火系队！四星配队全解析</b><span class="meta">61.5万播放 · 2天前</span><button class="btn" onclick="toast('跳转 B 站视频页')">去 B 站观看</button></div><div class="src">B站视频 · 提瓦特老张</div></div>`, true);
      ai(`<div class="card-msg"><div class="cbody list"><b>📚 更多内容</b><a href="javascript:toast('跳转 B 站')">· 新版本深渊满星配队（86.2万）</a><a href="javascript:toast('跳转 B 站')">· 版本前瞻 3 分钟速看（48万）</a><a href="javascript:toast('跳转 B 站合集')">· 全部攻略合集 ›</a></div></div>`, true);
    });
  },
  guide() {
    me('深渊12层下半用什么队？');
    step('②分层承接', '意图=<b>攻略问答</b> → RAG 检索老张视频文稿，优先引用 UP 主原内容');
    reply(() => {
      ai('按老张上期视频的思路，下半推荐这样配（结合你在练的火系主C）：<br>① 火系主C + 增伤辅助 + 治疗 + 挂元素副C<br>② 圣遗物主C 优先暴击头、火伤杯<br>③ 手法：开场先挂元素再进主C<br><span style="color:#8a8f99;font-size:12px">出处：《深渊满星配队》06:12</span>');
      ai(`<div class="card-msg"><div class="cbody"><b>🎬 跳到视频讲解片段</b><span class="meta">《深渊满星配队》06:12 – 09:40</span><button class="btn" onclick="toast('跳转 B 站视频 06:12')">从 06:12 开始看</button><button class="btn" style="background:#f5a623" onclick="S.diag()">配队诊断（会员）</button></div></div>`, true);
      $('#p-mem').textContent = '10.12 再问深渊下半，已推荐火系队 + 视频片段';
      step('③粉丝记忆', '更新档案摘要：<b>深渊下半仍未通关</b>，下次主动跟进');
    });
  },
  diag() {
    me('想要配队诊断');
    if (state.sub === '未订阅') { step('⑤商业化', '会员权益 → 粉丝主动触发才展示订阅，不强推'); reply(() => { ai('配队诊断是<b>攻略会员</b>的权益，老张会基于你的账号练度给出专属方案～看看会员档位？'); S.subCard(); }); }
    else reply(() => ai('收到！把你的角色练度截图发我，10 分钟内给你专属配队方案 ✅'));
  },
  sign() {
    me('签到');
    step('④群活跃', '每日签到 → 积分累计群等级，连续 7 天解锁抽奖');
    reply(() => {
      const ok = !state.signed; state.signed = true;
      $('#p-sign').textContent = '连续 7 天 🎉';
      ai(`<div class="card-msg"><div class="cbody"><b>${ok ? '✅ 签到成功 +10 积分' : '今天已经签过啦'}</b><div class="sign-days"><span class="ok">一</span><span class="ok">二</span><span class="ok">三</span><span class="ok">四</span><span class="ok">五</span><span class="ok">六</span><span class="today">日</span></div><span class="meta">连续 7 天！解锁本周抽奖资格 · 群等级 Lv.3「常驻观众」</span><button class="btn" onclick="S.draw()">去抽奖</button></div></div>`, true);
    });
  },
  draw() {
    me('抽奖！');
    if (!state.signed) { reply(() => ai('需要连续签到 7 天才能抽哦，今天先签个到？')); return; }
    step('④群活跃', '抽奖托管：资格校验 → 开奖 → 结果公示，UP 主零操作');
    reply(() => {
      const prizes = ['老张签名卡', '月卡×1', '谢谢参与', '周边亚克力', '原石兑换码', '会员 7 天'];
      ai(`<div class="card-msg"><div class="cbody"><b>🎁 本周粉丝抽奖</b><div class="wheel" id="wheel">${prizes.map(p => `<span>${p}</span>`).join('')}</div><span class="meta" id="wres">抽奖中…</span></div></div>`, true);
      const cells = [...document.querySelectorAll('#wheel span')]; let i = 0, n = 0;
      const t = setInterval(() => { cells.forEach(c => c.classList.remove('hit')); cells[i % 6].classList.add('hit'); i++; if (++n > 14) { clearInterval(t); cells.forEach(c => c.classList.remove('hit')); cells[5].classList.add('hit'); document.getElementById('wres').innerHTML = '🎉 抽中 <b>攻略会员 7 天体验</b>，已自动发放'; state.drawn = true; } }, 110);
    }, 400);
  },
  subCard() {
    ai(`<div class="card-msg"><div class="cbody"><b>⭐ 老张的粉丝订阅</b>
      <div class="tier"><b>旅行者</b><span class="price">免费</span><br>群内问答 · 签到抽奖 · 开播提醒</div>
      <div class="tier hot"><b>攻略会员</b><span class="price">¥12/月</span><br>配队诊断 · 会员专属攻略 · 抽奖双倍</div>
      <div class="tier"><b>冒险家舰长</b><span class="price">¥68/月</span><br>分身 1v1 · 老张亲自回复 · 直播连麦 · 周边折扣</div>
      <button class="btn" onclick="subscribe()">开通攻略会员</button></div><div class="src">创作者 70% · 平台 30%</div></div>`, true);
  },
  sub() { me('会员有什么权益？'); step('⑤商业化', '粉丝主动询问 → 展示订阅档位'); reply(() => S.subCard()); },
  team() {
    me('有人一起打周本吗？60级');
    step('④群活跃', '识别<b>组队</b>意图 → 按世界等级 / 在线时段匹配');
    reply(() => {
      ai('帮你找到 2 位同时段在线、世界等级相近的群友：');
      ai(`<div class="card-msg"><div class="cbody"><b>🤝 组队匹配</b><span class="meta">· 北斗船员（WL8，常晚上在线）<br>· 甜甜花（WL8，缺一位打周本）</span><button class="btn" onclick="toast('已拉起临时小群「周本三缺一」');step('④群活跃','组队成功 → 临时小群已创建')">一键拉小群</button></div></div>`, true);
    });
  },
  game() {
    me('最近有什么活动？');
    step('②分层承接', '意图=<b>游戏资讯</b> → 推送版本更新卡片，并关联 UP 主相关内容');
    reply(() => {
      ai(`<div class="card-msg"><div class="cover game">📢 版本更新速递</div><div class="cbody list">
        <a href="javascript:toast('打开活动详情')">· 10.18 20:00 新版本前瞻直播</a>
        <a href="javascript:toast('打开卡池详情')">· 10.22 限定角色复刻卡池</a>
        <a href="javascript:toast('打开活动详情')">· 限时活动「秋日庆典」· 含 420 原石</a>
        <span class="meta">💡 老张将在前瞻后 1 小时发速看视频，兑换码会员优先推送</span>
        <button class="btn" onclick="toast('已订阅版本提醒')">订阅版本提醒</button></div></div>`, true);
    });
  },
  say() {
    me('老张！能出一期剧情解析吗？想看～');
    step('②分层承接', '意图=<b>向 UP 主表达</b> · 普通粉丝 → 分身接话 + 汇总进「粉丝想对你说」');
    reply(() => {
      ai(`<div class="bubble voice">▶︎ ▂▃▅▆▅▃ <i>0:06</i></div>`, true);
      ai('（语音转文字）“好嘞旅行者！剧情解析已经有 32 个人催了，排进选题池了，出了第一时间告诉你～”');
      step('⑤KOL洞察', '「剧情解析」诉求 +1 → 已累计 32 次，进入 KOL 选题建议');
    }, 900);
  },
  memory() {
    me('你还记得我吗');
    step('③粉丝记忆', '读取档案：来源、来意、历史提问、签到');
    reply(() => ai(`当然！你是从<b>《深渊配队》</b>那期来的旅行者，在练火系主C，深渊下半卡了好几天${state.signed ? '，而且已经连续签到 7 天啦' : ''}。<br><span style="color:#8a8f99;font-size:12px">想让我忘记这些？在「我的档案」里可一键清除</span>`));
  }
};

window.book = btn => { state.booked = true; btn.classList.add('done'); btn.textContent = '✓ 已预约，开播提醒你'; step('②分层承接', '直播预约成功 → 开播前 10 分钟私聊提醒（不 @全体）'); toast('预约成功'); };
window.subscribe = () => { state.sub = '攻略会员 ¥12/月'; $('#p-sub').textContent = state.sub; $('#p-level').textContent = '攻略会员 · 粉丝牌 6 级'; step('⑤商业化', '订阅成功 → 层级升级，解锁配队诊断'); toast('已开通攻略会员（Demo）'); reply(() => ai('欢迎成为攻略会员！🎉 现在就可以用配队诊断啦～')); };
window.S = S; window.toast = toast; window.step = step;

const chips = [['🔴 今晚开播吗', 'live'], ['▶ 最新视频', 'video'], ['📖 深渊配队', 'guide'], ['✅ 签到', 'sign'], ['🎁 抽奖', 'draw'], ['⭐ 订阅会员', 'sub'], ['🤝 组队', 'team'], ['📢 版本活动', 'game'], ['💬 对老张说', 'say'], ['🧠 还记得我吗', 'memory']];
$('#chips').innerHTML = chips.map(([t, k]) => `<button data-k="${k}">${t}</button>`).join('');
$('#chips').onclick = e => { const k = e.target.dataset.k; if (k) S[k](); };
$('#pinned').onclick = () => S.live();

const rules = [[/播|直播|预约/, 'live'], [/视频|更新|最新/, 'video'], [/深渊|配队|圣遗物|攻略|怎么/, 'guide'], [/签到/, 'sign'], [/抽奖/, 'draw'], [/会员|订阅|舰长/, 'sub'], [/组队|一起|周本/, 'team'], [/活动|版本|卡池|兑换码/, 'game'], [/记得/, 'memory'], [/老张|想看|希望/, 'say']];
function send() {
  const v = $('#msg').value.trim(); if (!v) return; $('#msg').value = '';
  const hit = rules.find(([r]) => r.test(v));
  if (hit) { override = v; S[hit[1]](); return; }
  me(v); step('②分层承接', '未命中已知意图 → 低置信，转入 UP 主待办'); reply(() => ai('这个我拿不准，已经帮你转给老张本人啦，他上线会看到～'));
}
$('#send').onclick = send; $('#msg').onkeydown = e => e.key === 'Enter' && send();

/* 开场 */
sys('10月12日 19:02');
other('北斗船员', '#7f9cf5', '今晚老张播不播啊', '粉丝牌14');
ai('播的！20:00 准时开，已经帮大家整理了开播提醒，点群公告就能预约～');
other('甜甜花', '#f78fb3', '[图片] 我画的老张Q版，大家看看😆', '粉丝牌12');
ai('哇画得太可爱了！已经帮你投到本周「二创精选」，老张上线会看到的 ✨');
sys('小雷 加入了群聊');
ai('欢迎小雷～🎉 看到你是从<b>《深渊配队》</b>那期视频来的，入群时说想问攻略。有卡关的地方直接 @我，老张的 128 期视频我都学过啦！<br>点下面的快捷按钮就能开始 👇');
step('①入群识别', '小雷入群：粉丝牌 6 级 · 来意=攻略需求 · 来源=《深渊配队》视频 → 建立粉丝档案');

/* ---------- 视图切换 ---------- */
document.querySelectorAll('.switch button').forEach(b => b.onclick = () => {
  document.querySelectorAll('.switch button').forEach(x => x.classList.toggle('on', x === b));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('on', v.id === b.dataset.view));
  if (b.dataset.view === 'kol') drawCharts();
});
function go(tab) {
  document.querySelectorAll('.side a').forEach(a => a.classList.toggle('on', a.dataset.tab === tab));
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('on', t.id === 't-' + tab));
  drawCharts();
}
window.go = go;
document.querySelectorAll('.side a').forEach(a => a.onclick = () => go(a.dataset.tab));

/* ---------- 档期日历 ---------- */
const busy = { 3: '手机品牌 视频', 8: '周边店 会员折扣', 15: '外设 直播(待确认)', 22: '版本攻略 自制' };
$('#cal').innerHTML = Array.from({ length: 30 }, (_, i) => { const d = i + 1, b = busy[d]; return `<div class="${b ? 'busy' : ''}" onclick="${b ? `toast('${b}')` : 'this.className=\'open\';this.innerHTML=\'<b>' + d + '</b>已开放预定\';toast(\'11月' + d + '日已开放给品牌预定\')'}"><b>${d}</b>${b || ''}</div>`; }).join('');

/* ---------- 图表 ---------- */
const drawn = new Set();
const C = ['#0099ff', '#ff7a45', '#21b36b', '#f5a623', '#9b59b6', '#8a8f99'];
const days = Array.from({ length: 30 }, (_, i) => `9/${13 + i > 30 ? '' : ''}${i + 1}`).map((_, i) => { const d = new Date(2026, 8, 13 + i); return `${d.getMonth() + 1}/${d.getDate()}`; });
function mk(id, cfg) { if (drawn.has(id) || !document.getElementById(id)?.offsetParent) return; drawn.add(id); new Chart(document.getElementById(id), cfg); }
const opt = { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10 } } } };
function drawCharts() {
  if (!window.Chart) return;
  mk('c-trend', { type: 'line', data: { labels: days, datasets: [
    { label: 'B站粉丝(万)', data: days.map((_, i) => +(50.5 + i * 0.06 + (i > 20 ? 0.3 : 0)).toFixed(1)), borderColor: C[0], yAxisID: 'y', tension: .3, pointRadius: 0 },
    { label: '群人数', data: days.map((_, i) => 1269 + Math.round(i * 6 + (i > 20 ? 40 : 0))), borderColor: C[1], yAxisID: 'y1', tension: .3, pointRadius: 0 }] },
    options: { ...opt, scales: { y: { position: 'left' }, y1: { position: 'right', grid: { display: false } } } } });
  mk('c-route', { type: 'doughnut', data: { labels: ['分身自动回答', '活动/签到托管', '风控拦截', '升级给本人', '商务转交'], datasets: [{ data: [968, 186, 27, 41, 18], backgroundColor: C }] }, options: opt });
  mk('c-tier', { type: 'doughnut', data: { labels: ['舰长', '核心粉', '普通粉', '新粉(<7天)'], datasets: [{ data: [62, 318, 889, 213], backgroundColor: C }] }, options: opt });
  mk('c-intent', { type: 'pie', data: { labels: ['问攻略', '追更', '找队友', '随便看看'], datasets: [{ data: [46, 27, 15, 12], backgroundColor: C }] }, options: opt });
  mk('c-src', { type: 'bar', data: { labels: ['深渊满星', '火系队', '圣遗物', '前瞻速看', '剧情杂谈'], datasets: [{ label: '入群人数', data: [89, 54, 33, 21, 16], backgroundColor: C[0] }] }, options: { ...opt, indexAxis: 'y', plugins: { legend: { display: false } } } });
  mk('c-video', { type: 'bar', data: { labels: ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8'], datasets: [
    { label: '播放(万)', data: [32, 41, 28, 39.7, 48, 35, 61.5, 86.2], backgroundColor: C[0], yAxisID: 'y' },
    { type: 'line', label: '带来入群', data: [12, 18, 9, 33, 21, 14, 54, 89], borderColor: C[1], yAxisID: 'y1' }] },
    options: { ...opt, scales: { y: {}, y1: { position: 'right', grid: { display: false } } } } });
  mk('c-dau', { type: 'line', data: { labels: days, datasets: [
    { label: '群日活', data: days.map((_, i) => 180 + Math.round(Math.sin(i / 2) * 30 + i * 6)), borderColor: C[0], tension: .3, pointRadius: 0 },
    { label: '发言数', data: days.map((_, i) => 600 + Math.round(Math.cos(i / 3) * 120 + i * 18)), borderColor: C[2], tension: .3, pointRadius: 0 }] }, options: opt });
  mk('c-senti', { type: 'doughnut', data: { labels: ['积极', '中性', '吐槽/负面'], datasets: [{ data: [58, 34, 8], backgroundColor: [C[2], C[5], '#f54a45'] }] }, options: opt });
  mk('c-sub', { type: 'bar', data: { labels: ['7月', '8月', '9月', '10月'], datasets: [
    { label: '攻略会员', data: [210, 290, 410, 488], backgroundColor: C[0] },
    { label: '冒险家舰长', data: [52, 70, 94, 124], backgroundColor: C[3] }] }, options: { ...opt, scales: { x: { stacked: true }, y: { stacked: true } } } });
}
