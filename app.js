const $ = s => document.querySelector(s);
const chat = $('#chat'), log = $('#log');
/* 三个角色：群助手（工具）· 老张数字分身（关系）· 老张本人（关键时刻） */
const BOT = { name: '群助手', av: '<div class="avatar bot">🤖</div>', badge: '<span class="badge bot">机器人</span>' };
const CLONE = { name: '老张', av: '<div class="avatar ai">张</div>', badge: '<span class="badge">数字分身·AI</span>' };
const REAL = { name: '提瓦特老张', av: '<div class="avatar real">张</div>', badge: '<span class="badge real">UP主本人</span>' };
const ME = { name: '小雷', av: '<div class="avatar me">雷</div>' };
const state = { signed: false, booked: false, sub: '未订阅', joined: false, intent: '问攻略', mem: [], real: [], cloneChats: 0 };
function remember(t) { state.mem.push(t); $('#p-mem').innerHTML = state.mem.slice(-3).join('<br>'); }

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
function say(who, html, raw = false) {
  const inner = raw ? html : `<div class="bubble ${who === REAL ? 'realb' : ''}">${html}</div>`;
  chat.insertAdjacentHTML('beforeend', `<div class="row">${who.av}<div class="body"><div class="name">${who.name}${who.badge}</div>${inner}</div></div>`); scroll();
}
const bot = (h, r) => say(BOT, h, r);
const clone = (h, r) => { state.cloneChats++; say(CLONE, h, r); };
const real = h => { say(REAL, h); state.real.push(h); };
function step(cap, text) { log.insertAdjacentHTML('afterbegin', `<div class="step"><span class="cap">${cap}</span>${text}</div>`); }
function reply(fn, delay = 650, who = CLONE) {
  chat.insertAdjacentHTML('beforeend', `<div class="row" id="typing">${who.av}<div class="body"><div class="bubble typing">${who === CLONE ? '老张分身正在输入…' : '正在输入…'}</div></div></div>`); scroll();
  setTimeout(() => { $('#typing')?.remove(); fn(); }, delay);
}
const R = { clone: '<b style="color:#ff7a45">老张分身</b>', bot: '<b style="color:#4e5969">群助手</b>', real: '<b style="color:#c27c00">老张本人</b>' };

/* ---------- 场景 ---------- */
const S = {
  live() {
    me('@老张 今晚播吗？');
    step('②分层承接', `问UP主动态 → ${R.clone} 用老张口吻回答 + 关联记忆；预约由 ${R.bot} 发卡片`);
    reply(() => {
      clone(`播！今晚 <b>8 点</b>讲新版本深渊满星配队${state.mem.some(m => m.includes('深渊')) ? '，你上次卡的下半我会重点讲，记得来' : '，来不来旅行者'} 😎`);
      setTimeout(() => bot(`<div class="card-msg"><div class="cover live">🔴 今晚 20:00 · 老张直播</div><div class="cbody"><b>新版本深渊满星配队 · 零氪也能抄</b><span class="meta">已有 1,203 人预约</span><button class="btn ${state.booked ? 'done' : ''}" onclick="book(this)">${state.booked ? '✓ 已预约，开播私聊提醒' : '一键预约直播'}</button></div><div class="src">B站直播间 · 开播前 10 分钟私聊提醒，不 @全体</div></div>`, true), 400);
    });
  },
  video() {
    me('@老张 最近更新了啥？');
    step('②分层承接', `追更 → ${R.clone} 按粉丝兴趣挑视频推荐，而不是甩列表`);
    reply(() => {
      clone('这周更了两期～第一期《零氪也能用的火系队》你一定要看，你在练的火C就是主角 🔥');
      clone(`<div class="card-msg"><div class="cover">▶ 零氪也能用的火系队 · 12:30</div><div class="cbody"><b>零氪也能用的火系队！四星配队全解析</b><span class="meta">61.5万播放 · 2天前</span><button class="btn" onclick="toast('跳转 B 站视频页')">去 B 站看</button></div></div>`, true);
    });
  },
  guide() {
    me('@老张 深渊12层下半用什么队？');
    step('②分层承接', `攻略问答 → ${R.clone} 检索老张视频文稿，用第一人称讲"我视频里怎么打"`);
    reply(() => {
      clone('这个我上期视频专门讲过！你在练火C的话这么配：<br>① 火C + 增伤辅助 + 奶 + 挂元素副C<br>② 圣遗物暴击头、火伤杯<br>③ 开场先挂元素再进火C<br><span style="color:#8a8f99;font-size:12px">出处：我的《深渊满星配队》06:12</span>');
      clone(`<div class="card-msg"><div class="cbody"><b>🎬 直接看我讲这段</b><span class="meta">《深渊满星配队》06:12 – 09:40</span><button class="btn" onclick="toast('跳转 B 站视频 06:12')">从 06:12 开始看</button></div></div>`, true);
      clone('打完回来告诉我过没过哈，我记着呢 ✍️');
      remember('10.12 问深渊12层下半配队，在练火系主C');
      step('③粉丝记忆', '分身写入记忆：<b>深渊下半未通关、在练火C</b> → 之后主动跟进');
    });
  },
  followup() {
    sys('— 三天后 · 10月15日 19:40 —');
    step('③粉丝记忆', `${R.clone} <b>主动</b>私聊跟进上次的问题——"老张记得我"`);
    clone('小雷！上次说深渊下半卡住了，现在过了没？今晚 8 点我刚好讲新一期深渊～');
    setTimeout(() => { me('过了！照你那个火系队打的，谢谢老张！'); reply(() => {
      clone('哈哈太强了 🎉 这必须让本人知道，我转给他了！');
      remember('10.15 深渊已通关 ✓');
      step('②分层承接', `"用老张攻略通关" 是高情感时刻 → 升级给 ${R.real}`);
      setTimeout(() => { sys('提瓦特老张 上线了'); real('@小雷 恭喜通关！看到你照着视频打过了真的很开心，今晚直播给你点个名 🙌'); step('⑤KOL洞察', `${R.real} 在待办队列一键回复 · 记入「我和老张」`); }, 1400);
    }); }, 900);
  },
  sign() {
    me('签到');
    step('④群活跃', `工具类请求 → ${R.bot} 处理，不占用老张分身`);
    reply(() => {
      const ok = !state.signed; state.signed = true; $('#p-sign').textContent = '连续 7 天 🎉';
      bot(`<div class="card-msg"><div class="cbody"><b>${ok ? '✅ 签到成功 +10 积分' : '今天已经签过啦'}</b><div class="sign-days"><span class="ok">一</span><span class="ok">二</span><span class="ok">三</span><span class="ok">四</span><span class="ok">五</span><span class="ok">六</span><span class="today">日</span></div><span class="meta">连续 7 天！解锁本周抽奖 · 群等级 Lv.3「常驻观众」</span><button class="btn" onclick="S.draw()">去抽奖</button></div></div>`, true);
    }, 500, BOT);
  },
  draw() {
    me('抽奖');
    if (!state.signed) { reply(() => bot('连续签到 7 天才能抽哦，先签个到？'), 400, BOT); return; }
    step('④群活跃', `${R.bot} 托管抽奖：资格校验 → 开奖 → 公示`);
    reply(() => {
      const prizes = ['老张签名卡', '月卡×1', '谢谢参与', '周边亚克力', '原石兑换码', '会员 7 天'];
      bot(`<div class="card-msg"><div class="cbody"><b>🎁 本周粉丝抽奖</b><div class="wheel" id="wheel">${prizes.map(p => `<span>${p}</span>`).join('')}</div><span class="meta" id="wres">抽奖中…</span></div></div>`, true);
      const cells = [...document.querySelectorAll('#wheel span')]; let i = 0, n = 0;
      const t = setInterval(() => { cells.forEach(c => c.classList.remove('hit')); cells[i++ % 6].classList.add('hit'); if (++n > 14) { clearInterval(t); cells.forEach(c => c.classList.remove('hit')); cells[0].classList.add('hit'); $('#wres').innerHTML = '🎉 抽中 <b>老张签名卡</b>！'; setTimeout(() => clone('恭喜小雷！签名卡我这周就签，写啥 to 签你来定 ✍️'), 700); } }, 110);
    }, 400, BOT);
  },
  subCard() {
    bot(`<div class="card-msg"><div class="cbody"><b>⭐ 老张的粉丝订阅</b>
      <div class="tier"><b>旅行者</b><span class="price">免费</span><br>和老张分身聊天 · 签到抽奖 · 开播提醒</div>
      <div class="tier hot"><b>攻略会员</b><span class="price">¥12/月</span><br>分身配队诊断 · 会员专属攻略 · 抽奖双倍</div>
      <div class="tier"><b>冒险家舰长</b><span class="price">¥68/月</span><br>每月老张本人亲回 · 直播连麦 · 周边折扣</div>
      <button class="btn" onclick="subscribe()">开通攻略会员</button></div><div class="src">创作者 70% · 平台 30%</div></div>`, true);
  },
  sub() { me('会员有什么权益？'); step('⑤商业化', `粉丝主动问 → ${R.bot} 展示档位；核心卖点是"离老张更近"`); reply(() => S.subCard(), 500, BOT); },
  diag() { S.sub(); },
  team() {
    me('有人一起打周本吗？WL8');
    step('④群活跃', `组队撮合 → ${R.bot}`);
    reply(() => bot(`<div class="card-msg"><div class="cbody"><b>🤝 找到 2 位同时段在线的群友</b><span class="meta">· 北斗船员（WL8，常晚上在线）<br>· 甜甜花（WL8，缺一位打周本）</span><button class="btn" onclick="toast('已拉起临时小群「周本三缺一」');step('④群活跃','组队成功 → 临时小群已创建')">一键拉小群</button></div></div>`, true), 500, BOT);
  },
  game() {
    me('最近有什么活动？');
    step('②分层承接', `资讯类 → ${R.bot} 发卡片；${R.clone} 补一句老张自己的建议`);
    reply(() => {
      bot(`<div class="card-msg"><div class="cover game">📢 版本更新速递</div><div class="cbody list"><a href="javascript:toast('打开详情')">· 10.18 20:00 新版本前瞻直播</a><a href="javascript:toast('打开详情')">· 10.22 限定角色复刻卡池</a><a href="javascript:toast('打开详情')">· 限时活动「秋日庆典」· 含 420 原石</a><button class="btn" onclick="toast('已订阅版本提醒')">订阅版本提醒</button></div></div>`, true);
      setTimeout(() => clone('复刻那个角色我建议抽！前瞻后 1 小时我出速看视频，到时候私聊你 👀'), 600);
    }, 500, BOT);
  },
  say() {
    me('@老张 能出一期剧情解析吗？想看～');
    step('②分层承接', `向UP主表达 → ${R.clone} 语音回应 + 汇总进「粉丝想对你说」`);
    reply(() => {
      clone(`<div class="bubble voice">▶︎ ▂▃▅▆▅▃ <i>0:06 · AI合成语音（老张授权）</i></div>`, true);
      clone('（转文字）"安排！剧情解析已经 32 个人催了，排进选题池了，出了第一个告诉你～"');
      step('⑤KOL洞察', '「剧情解析」诉求累计 32 次 → KOL 选题建议');
    }, 900);
  },
  emo() {
    me('又歪了……攒了三个月的原石');
    step('②分层承接', `情绪表达 → ${R.clone} 以老张口吻安慰，不推任何商业内容`);
    reply(() => clone('啊这……抱抱 🫂 我上个版本也连歪两次。歪的那个其实很能打，我《常驻也能用》那期讲过怎么配，下次必出！'));
  },
  gear() {
    me('@老张 用手机玩老是卡，你用的啥？');
    step('⑤商业化', `粉丝<b>主动</b>问设备 → ${R.clone} 先给免费解法，再提合作款（标注合作）；本周推送 1/1`);
    reply(() => {
      clone('先把画质调「中」、帧率 45，能降不少温，我的设置在这期 03:20。我自己直播用的是这台，最近也在合作，介意的话忽略就好：');
      clone(`<div class="card-msg"><div class="cbody"><b><span class="adtag">合作</span>某品牌游戏手机</b><span class="meta">我实测：深渊 60 帧 30 分钟不降频<br>群友专属：会员再减 100</span><button class="btn" onclick="toast('跳转品牌页（Demo）')">看看</button><a class="meta" href="javascript:toast('已减少此类推荐');step('⑤商业化','点踩 +1 → 点踩率 >10% 自动暂停该商单')">👎 不感兴趣</a></div></div>`, true);
    });
  },
  ad() {
    other('路人甲', '#999', '低价代练代肝，深渊满星包过，加V：xxxxx');
    step('④群秩序', `${R.bot} 识别广告 → 高置信自动撤回；低置信仅提醒管理员`);
    setTimeout(() => { [...chat.querySelectorAll('.row .bubble')].pop().classList.add('recall'); bot('已撤回一条广告消息，请大家注意甄别 🙏'); }, 700);
  },
  captain() {
    other('阿月', '#c27c00', '@老张 上期配队我想到个改进，副C换成水系反应会更稳', '舰长');
    step('②分层承接', `舰长 × 提建议 → ${R.clone} 先接住，再升级到 ${R.real} 高优队列`);
    reply(() => {
      clone('好思路！这个得本人亲自回你，已经转给他了 🔺');
      setTimeout(() => { sys('提瓦特老张 上线了'); real('@阿月 试了，确实更稳！下期视频给你署名感谢 🙏'); }, 1500);
    });
  },
  care() {
    sys('— 一个月后 · 小雷已 10 天未发言 —');
    step('⑤KOL洞察', `活跃下降 → 流失预警；${R.clone} 发一次轻量问候（不带商业内容）`);
    clone('小雷好久不见～最近新深渊出了，你的火C我想到个新圣遗物思路，回来看看？');
  },
  memory() {
    me('@老张 你还记得我吗');
    step('③粉丝记忆', `${R.clone} 读取记忆，像老朋友一样接上`);
    reply(() => clone(`当然！你是看《深渊配队》那期来的，在练火C${state.mem.some(m => m.includes('通关')) ? '，还靠我的队过了深渊下半 😎' : '，深渊下半还卡着对吧'}${state.signed ? '，而且连签 7 天了' : ''}。想看我记了啥？点上面「我和老张」`));
  },
  profile() { openHome(); }
};

window.book = btn => { state.booked = true; btn.classList.add('done'); btn.textContent = '✓ 已预约，开播私聊提醒'; step('②分层承接', '预约成功 → 开播前 10 分钟私聊提醒'); toast('预约成功'); };
window.subscribe = () => { state.sub = '攻略会员 ¥12/月'; $('#p-sub').textContent = state.sub; $('#p-level').textContent = '攻略会员 · 粉丝牌 6 级'; step('⑤商业化', '订阅成功 → 解锁分身配队诊断'); toast('已开通攻略会员（Demo）'); reply(() => clone('欢迎加入会员！以后配队直接丢截图给我 💪')); };
window.S = S; window.toast = toast; window.step = step;

/* 输入区：@对象 + 功能面板（替代原来的一排快捷问题） */
let target = '老张';
document.querySelectorAll('.at').forEach(b => b.onclick = () => { target = b.dataset.t; document.querySelectorAll('.at').forEach(x => x.classList.toggle('on', x === b)); $('#msg').placeholder = target === '老张' ? '和老张分身聊聊…' : '@群助手 签到/组队/活动…'; $('#msg').focus(); });
$('#plus').onclick = () => $('#panel').classList.toggle('on');
$('#panel').onclick = e => { const k = e.target.closest('[data-k]')?.dataset.k; if (!k) return; $('#panel').classList.remove('on'); if (!state.joined) { toast('先完成入群申请'); return; } S[k](); };
document.querySelectorAll('[data-demo]').forEach(b => b.onclick = () => { if (!state.joined) { toast('先完成入群申请'); return; } S[b.dataset.demo](); });
$('#pinned').onclick = () => state.joined ? S.live() : toast('先完成入群申请');

const rules = [[/歪|保底/, 'emo'], [/手机|卡顿|外设|手柄|用的啥/, 'gear'], [/记得/, 'memory'], [/播|直播|预约/, 'live'], [/视频|更新|最新/, 'video'], [/深渊|配队|圣遗物|攻略|怎么/, 'guide'], [/签到/, 'sign'], [/抽奖/, 'draw'], [/会员|订阅|舰长/, 'sub'], [/组队|一起|周本/, 'team'], [/活动|版本|卡池|兑换码/, 'game'], [/老张|想看|希望|剧情/, 'say']];
function send() {
  if (!state.joined) { toast('先完成入群申请'); return; }
  const v = $('#msg').value.trim(); if (!v) return; $('#msg').value = '';
  const text = (target === '老张' ? '@老张 ' : '@群助手 ') + v.replace(/^@\S+\s*/, '');
  const hit = rules.find(([r]) => r.test(v));
  if (hit) { override = text; S[hit[1]](); return; }
  me(text);
  if (target === '老张') { step('②分层承接', `${R.clone} 低置信 → 不编造，转入老张本人待办`); reply(() => clone('这个我不太确定，不想瞎说，帮你转给本人了，他上线回你 🙏')); }
  else reply(() => bot('我只会签到、抽奖、组队、查活动～聊天找 @老张 哦'), 400, BOT);
}
$('#send').onclick = send; $('#msg').onkeydown = e => e.key === 'Enter' && send();

/* 开场：群内氛围 */
sys('10月12日 19:02');
other('北斗船员', '#7f9cf5', '@老张 今晚播不播啊', '粉丝牌14');
say(CLONE, '播播播！8 点准时，迟到罚我抽卡必歪 😂');
other('甜甜花', '#f78fb3', '[图片] 我画的老张Q版，大家看看😆', '粉丝牌12');
say(CLONE, '哇这也太可爱了吧！我先存了，本人上线一定看 ✨');

/* ① 入群申请 */
$('#opts').onclick = e => { const v = e.target.dataset.v; if (!v) return; state.intent = v; document.querySelectorAll('#opts span').forEach(s => s.classList.toggle('on', s === e.target)); recJoin(); };
$('#auth').onchange = () => { $('#authinfo').style.display = $('#auth').checked ? '' : 'none'; recJoin(); };
function recJoin() {
  const r = $('#jrec'); const low = !$('#auth').checked && state.intent === '随便看看';
  r.className = 'jrec' + (low ? ' alt' : ''); r.innerHTML = low ? '💡 推荐先加入<b>开放水友群</b>，熟悉后再来核心群（仍可直接申请）' : '✅ 匹配度高：推荐加入<b>核心粉丝群</b>';
}
function joinGroup() {
  if (state.joined) return; state.joined = true;
  const auth = $('#auth').checked;
  $('#join').classList.add('gone');
  $('#p-level').textContent = auth ? '普通粉丝 · 粉丝牌 6 级' : '普通粉丝（未授权）';
  $('#p-intent').textContent = state.intent + '（入群选择）';
  $('#p-src').textContent = auth ? '《深渊配队》视频' : '未知（未授权）';
  $('#p-sign').textContent = '连续 6 天';
  remember('10.12 入群');
  step('①入群识别', `${auth ? '粉丝牌 6 级 · 关注 12 天 · 近期看《深渊配队》' : '未授权，仅按答题建档'} · 来意=<b>${state.intent}</b> → 建立粉丝档案`);
  sys('小雷 加入了群聊');
  setTimeout(() => bot('欢迎新人～群规：禁广告、禁引战。签到/抽奖/组队找我，想和老张聊直接 @老张 👇'), 300);
  const hook = { '问攻略': '有卡关直接问我，我视频里讲过的都能答', '找队友': '想组队喊群助手就行，我也常在群里冒泡', '追更UP主': '开播我私聊叫你，不 @全体吵你', '随便看看': '随便逛，想聊天随时 @我' }[state.intent];
  setTimeout(() => { clone(`小雷你好呀～我是老张的数字分身 👋 ${auth ? '看你最近在刷我的<b>深渊配队</b>，' : ''}${hook}！`); step('③粉丝记忆', `${R.clone} 第一次打招呼：引用入群来源与来意，建立"老张认识我"的第一印象`); }, 1100);
  markJ(0);
}
$('#jbtn').onclick = joinGroup;

/* 演示剧本 */
const J = [() => joinGroup(), () => S.guide(), () => S.followup(), () => { S.sign(); setTimeout(() => S.team(), 1500); }, () => S.gear(), () => S.care()];
function markJ(i) { document.querySelectorAll('#journey button').forEach((b, k) => { b.classList.toggle('on', k === i); if (k <= i) b.classList.add('done'); }); }
$('#journey').onclick = e => { const b = e.target.closest('button'); if (!b) return; const i = +b.dataset.j; const wait = i > 0 && !state.joined; if (wait) joinGroup(); setTimeout(() => { J[i](); markJ(i); }, wait ? 1600 : 0); };

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
const C = ['#165dff', '#ff7d00', '#00b42a', '#14c9c9', '#722ed1', '#86909c'];
const days = Array.from({ length: 30 }, (_, i) => `9/${13 + i > 30 ? '' : ''}${i + 1}`).map((_, i) => { const d = new Date(2026, 8, 13 + i); return `${d.getMonth() + 1}/${d.getDate()}`; });
function mk(id, cfg) { if (drawn.has(id) || !document.getElementById(id)?.offsetParent) return; drawn.add(id); new Chart(document.getElementById(id), cfg); }
const opt = { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10 } } } };
var drawCharts = function () {
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

/* ---------- 粉丝详情卡 ---------- */
const FANS = {
  '阿月': ['舰长 · 粉丝牌 23 级', '支持 UP 主 / 剧情向', '常提选题建议，3 次被采纳；偏好剧情解析', '11 天前', '冒险家舰长 ¥68/月'],
  '北斗船员': ['核心粉 · 粉丝牌 14 级', '找队友', '水友赛常客；近期组队失败 2 次', '10 天前', '未订阅'],
  '甜甜花': ['核心粉 · 粉丝牌 12 级', '二创', '画手，投稿 3 次，1 次入选精选', '14 天前', '攻略会员'],
  '小雷': ['普通粉 · 粉丝牌 6 级', '问攻略', '深渊 12 层下半卡关→已通关；在练火系主C；周末晚上活跃', '今天', '未订阅']
};
document.addEventListener('click', e => {
  const f = e.target.closest('a.fan'); if (!f) return;
  const [lv, intent, mem, last, sub] = FANS[f.dataset.f];
  $('#mcard').innerHTML = `<div class="mh"><div class="avatar big">${f.dataset.f[0]}</div><div><b>${f.dataset.f}</b><small>${lv}</small></div></div>
    <div class="kv"><span>来意</span><b>${intent}</b></div><div class="kv"><span>互动摘要</span><b>${mem}</b></div>
    <div class="kv"><span>上次互动</span><b>${last}</b></div><div class="kv"><span>订阅</span><b>${sub}</b></div>
    <p class="hint">仅展示摘要与标签，不展示私聊原文</p>
    <div class="ops"><button class="mini" onclick="toast('已打开与${f.dataset.f}的私聊');$('#modal').classList.remove('on')">本人私聊</button><button class="mini ghost" onclick="toast('已让助手发送问候');$('#modal').classList.remove('on')">让助手问候</button></div>`;
  $('#modal').classList.add('on');
});

/* ---------- 分层承接矩阵 ---------- */
const MODES = ['🤖 助手答', '📌 汇总', '🔺 升级本人', '💼 商务'];
const MX = [['问开播/更新', 0, 0, 0], ['问攻略', 0, 0, 2], ['表达/提建议', 1, 1, 2], ['商务合作', 3, 3, 3], ['情绪表达', 0, 0, 1]];
function drawMatrix() {
  $('#matrix').innerHTML = '<tr><th>消息意图</th><th>普通 / 需求型</th><th>核心粉丝</th><th>舰长 / 铁粉</th></tr>' +
    MX.map((r, i) => `<tr><td>${r[0]}</td>${[1, 2, 3].map(j => `<td data-i="${i}" data-j="${j}">${MODES[r[j]]}</td>`).join('')}</tr>`).join('');
}
drawMatrix();
$('#matrix').onclick = e => { const td = e.target.closest('td[data-i]'); if (!td) return; const r = MX[td.dataset.i]; r[td.dataset.j] = (r[td.dataset.j] + 1) % 4; drawMatrix(); toast('规则已更新，实时生效'); };

const _draw = drawCharts;
drawCharts = function () {
  _draw();
  if (window.Chart) mk('c-north', { type: 'line', data: { labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'], datasets: [
    { label: '有效互动占比 %', data: [22, 24, 23, 29, 33, 36, 39, 41], borderColor: C[0], backgroundColor: 'rgba(22,93,255,.08)', fill: true, tension: .3 },
    { label: 'Agent 上线', data: [null, null, null, 29, null, null, null, null], borderColor: C[1], pointRadius: 6, showLine: false }] }, options: opt });
};

/* ---------- 我和老张（关系主页） ---------- */
function renderHome() {
  const auth = $('#auth').checked, sub = state.sub !== '未订阅';
  const close = Math.min(100, 20 + state.cloneChats * 6 + state.real.length * 20 + (state.signed ? 10 : 0));
  const days = ['一','二','三','四','五','六','日'].map((d, i) => `<span class="${i < 6 || state.signed ? 'ok' : 'today'}">${d}</span>`).join('');
  $('#hbody').innerHTML = `
    <div class="hero duo"><div class="pair"><div class="avatar big me">雷</div><span>💞</span><div class="avatar big ai">张</div></div>
      <b>小雷 × 老张</b><small>认识第 ${state.mem.some(m => m.startsWith('10.15')) ? 4 : 1} 天 · ${auth ? '粉丝牌 6 级' : '未授权'} · 群等级 Lv.${state.signed ? 3 : 2}</small>
      <div class="close"><span>亲密度</span><div class="lvbar"><i style="width:${close}%"></i></div><b>${close}</b></div>
      <div class="stat3"><div><b>${state.cloneChats}</b>和分身聊天</div><div><b>${state.real.length}</b>老张亲自回复</div><div><b>${state.booked ? 1 : 0}</b>预约直播</div></div></div>
    <div class="hsec gold"><h5>🎙 老张亲自回复你 <small>分身转达后本人回的消息</small></h5>
      ${state.real.length ? state.real.map(r => `<div class="realq">${r}</div>`).join('') : '<p class="privacy">还没有～和分身多聊聊，重要的事它会转给老张本人</p>'}</div>
    <div class="hsec"><h5>🧠 分身记得关于你的事 <small>用于下次接着聊</small></h5>
      <div class="tags"><span>来意：${state.intent}</span>${auth ? '<span>来自：深渊配队视频</span>' : ''}${state.mem.some(m => m.includes('火系')) ? '<span>在练：火系主C</span>' : ''}${state.mem.some(m => m.includes('通关')) ? '<span>深渊12层 ✓</span>' : ''}</div>
      <div class="tl">${state.mem.map(m => { const [d, ...r] = m.split(' '); return `<div><i>${d}</i>${r.join(' ')}</div>`; }).join('') || '<div>暂无</div>'}</div>
      <button class="hbtn ghost" onclick="state.mem=[];$('#p-mem').textContent='（已清除）';renderHome();toast('已清除');step('③粉丝记忆','粉丝清除记忆 → 分身仅保留层级与来意')">让分身忘掉这些</button>
      <p class="privacy">只记录与互动相关的摘要；老张本人只看到标签和摘要，看不到私聊原文。</p></div>
    <div class="hsec"><h5>✅ 签到 · 抽老张签名卡 <small>连续 ${state.signed ? 7 : 6} 天</small></h5><div class="sign-days">${days}</div>
      <button class="hbtn" onclick="closeHome();S.${state.signed ? 'draw' : 'sign'}()">${state.signed ? '去抽奖' : '今日签到'}</button></div>
    <div class="hsec"><h5>⭐ 离老张更近一步 <small>${sub ? state.sub : '旅行者（免费）'}</small></h5>
      <div class="kv"><span>攻略会员 ¥12/月</span><b>分身配队诊断</b></div>
      <div class="kv"><span>冒险家舰长 ¥68/月</span><b>每月本人亲回 · 直播连麦</b></div>
      ${sub ? '' : '<button class="hbtn" onclick="closeHome();S.sub()">了解会员</button>'}</div>`;
}
window.openHome = () => { if (!state.joined) { toast('先完成入群申请'); return; } renderHome(); $('#home').classList.add('on'); step('③粉丝记忆', '打开「我和老张」：关系沉淀对粉丝<b>可见、可删</b>'); };
window.closeHome = () => $('#home').classList.remove('on');
window.state = state;

/* ---------- 群聊简报 ---------- */
const GROUPS = [
  ['核心粉丝 1 群', '核心', 'ok', 486, 1820, '讨论复刻抽不抽，分身已统一回复', 0],
  ['核心粉丝 2 群', '核心', 'warn', 498, 210, '活跃骤降 38%，近 3 天无活动', 1],
  ['舰长群', '付费', 'warn', 62, 340, '2 条建议等你亲自回复', 2],
  ['攻略交流 1 群', '攻略', 'ok', 500, 1630, '深渊配队提问为主，自动解答 86%', 0],
  ['攻略交流 2 群', '攻略', 'ok', 500, 1210, '秋日庆典活动攻略讨论', 0],
  ['攻略交流 3 群', '攻略', 'warn', 500, 980, '有人抱怨"问题没人回"，3 条低置信待你确认', 3],
  ['水友 7 群', '水友', 'bad', 500, 2240, '角色强度引战 40 分钟，3 人退群，已禁言 1 人', 0],
  ['水友 1 群', '水友', 'ok', 500, 760, '日常水群 + 组队，撮合成功 12 次', 0],
  ['二创投稿群', '二创', 'ok', 312, 420, '本周收稿 9 份，甜甜花新作获赞最多', 0],
  ['开黑组队群', '组队', 'ok', 488, 1100, '周本组队高峰 21:00', 0]
];
for (let i = 2; i <= 6; i++) GROUPS.push([`水友 ${i} 群`, '水友', 'ok', 500, 300 + i * 40, '日常闲聊，无异常', 0]);
for (let i = 1; i <= 8; i++) GROUPS.push([`新粉 ${i} 群`, '新粉', 'ok', 200 + i * 30, 90 + i * 15, '新人破冰 + 入门问答', 0]);
GROUPS.length = 23;
const ST = { ok: '正常', warn: '需关注', bad: '异常' };
function drawGroups(f = 'all') {
  $('#gtable').innerHTML = '<tr><th>群聊</th><th>类型</th><th>状态</th><th>人数</th><th>今日消息</th><th>分身摘要</th><th>待你处理</th></tr>' +
    GROUPS.map((g, i) => [g, i]).filter(([g]) => f === 'all' || g[2] === f).sort((a, b) => 'bwo'.indexOf(a[0][2][0]) - 'bwo'.indexOf(b[0][2][0]))
      .map(([g, i]) => `<tr data-i="${i}"><td><b>${g[0]}</b></td><td><span class="tag">${g[1]}</span></td><td><span class="dot ${g[2]}"></span>${ST[g[2]]}</td><td>${g[3]}</td><td>${g[4]}</td><td>${g[5]}</td><td>${g[6] ? `<b class="bad">${g[6]}</b>` : '—'}</td></tr>`).join('');
}
drawGroups();
document.querySelectorAll('.gfilter button').forEach(b => b.onclick = () => { document.querySelectorAll('.gfilter button').forEach(x => x.classList.toggle('on', x === b)); drawGroups(b.dataset.g); });
window.openGroup = i => {
  const g = GROUPS[i];
  $('#mcard').innerHTML = `<div class="mh"><div class="avatar big">${g[0][0]}</div><div><b>${g[0]}</b><small>${g[3]} 人 · 今日 ${g[4]} 条消息</small></div></div>
    <div class="kv"><span>状态</span><b class="${g[2]}">${ST[g[2]]}</b></div>
    <div class="kv"><span>分身摘要</span><b>${g[5]}</b></div>
    <div class="kv"><span>热门话题</span><b>${g[2] === 'bad' ? '角色强度争论、退群' : '复刻抽不抽、深渊配队'}</b></div>
    <div class="kv"><span>分身/助手已处理</span><b>${Math.round(g[4] * 0.96)} 条</b></div>
    <div class="ops"><button class="mini" onclick="toast('已打开 ${g[0]}');$('#modal').classList.remove('on')">进入群聊</button><button class="mini ghost" onclick="toast('已让分身在 ${g[0]} 发一条问候');$('#modal').classList.remove('on')">让分身发言</button></div>`;
  $('#modal').classList.add('on');
};
$('#gtable').onclick = e => { const tr = e.target.closest('tr[data-i]'); if (tr) openGroup(+tr.dataset.i); };

const _draw2 = drawCharts;
drawCharts = function () {
  _draw2();
  if (!window.Chart) return;
  mk('c-income', { type: 'bar', data: { labels: ['7月', '8月', '9月', '10月'], datasets: [
    { label: '商单', data: [28000, 31000, 36000, 42000], backgroundColor: C[0] },
    { label: '订阅', data: [9800, 12600, 15000, 18640], backgroundColor: C[1] },
    { label: '周边/二创', data: [2100, 2900, 3600, 4980], backgroundColor: C[2] },
    { label: '直播打赏', data: [1800, 2100, 2400, 2800], backgroundColor: C[3] }] }, options: { ...opt, scales: { x: { stacked: true }, y: { stacked: true } } } });
  mk('c-income-pie', { type: 'doughnut', data: { labels: ['商单', '订阅', '周边/二创', '直播打赏'], datasets: [{ data: [42000, 18640, 4980, 2800], backgroundColor: C }] }, options: opt });
};
