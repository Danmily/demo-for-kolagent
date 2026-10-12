const $ = s => document.querySelector(s);
const chat = $('#chat'), log = $('#log');
const AI = { name: '老张的群助手', av: '<div class="avatar ai">张</div>' };
const ME = { name: '小雷', av: '<div class="avatar me">雷</div>' };
const state = { signed: false, booked: false, sub: '未订阅', drawn: false, joined: false, intent: '问攻略', mem: [] };
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
function ai(html, raw = false) {
  const inner = raw ? html : `<div class="bubble">${html}</div>`;
  chat.insertAdjacentHTML('beforeend', `<div class="row">${AI.av}<div class="body"><div class="name">${AI.name}<span class="badge">AI助手</span></div>${inner}</div></div>`); scroll();
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
      remember('10.12 问深渊12层下半配队，卡在下半，在练火系主C');
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
  followup() {
    sys('— 三天后 · 10月15日 19:40 —');
    step('③粉丝记忆', '读取档案「深渊下半卡关」→ 助手<b>主动</b>私聊跟进，不等粉丝开口');
    ai('小雷，上次说深渊下半卡住了，现在过了吗？老张今晚 8 点刚好讲新一期深渊，要帮你预约吗？');
    setTimeout(() => { me('过了！照着那个火系队打的，谢谢！'); reply(() => { ai('太强了旅行者 🎉 已帮你记下「深渊已通关」，下次有新配队第一时间告诉你～'); remember('10.15 深渊已通关 ✓'); step('③粉丝记忆', '档案更新：<b>深渊已通关</b>，二次回访 +1'); }); }, 900);
  },
  gear() {
    me('用手机玩老是卡，有啥推荐吗？');
    step('⑤商业化', '粉丝<b>主动</b>询问设备 → 兴趣标签「移动端」命中商单「某手机品牌」；本周未推送过 → 允许展示');
    reply(() => {
      ai('先试试把画质调到「中」、帧率 45，能明显降温～老张自己用的设置在这期视频 03:20。如果考虑换设备，这款是老张近期合作的：');
      ai(`<div class="card-msg"><div class="cbody"><b><span class="adtag">合作</span>某品牌游戏手机</b><span class="meta">老张实测：深渊 60 帧 30 分钟不降频<br>群友专属：会员再减 100</span><button class="btn" onclick="toast('跳转品牌页（Demo）');step('⑤商业化','商单点击 +1，回写档案兴趣「移动端」')">查看详情</button><span class="meta" style="display:flex;gap:10px"><a href="javascript:toast('已减少此类推荐');step('⑤商业化','点踩 +1 → 计入护栏；点踩率 >10% 自动暂停该商单')">👎 不感兴趣</a></span></div></div>`, true);
      step('⑤商业化', '频控：该粉丝本周商业推送 1/1，本周不再推送');
    });
  },
  emo() {
    me('又歪了……攒了三个月的原石');
    step('②分层承接', '意图=<b>情绪表达</b> · 普通粉丝 → 群助手人设轻量回应，不推送任何商业内容');
    reply(() => ai('抱抱旅行者 🫂 歪了的那个其实很能打，老张那期《常驻角色也能用》里专门讲过怎么配，要看看吗？保底就在下一次了，冲！'));
  },
  ad() {
    other('路人甲', '#999', '低价代练代肝，深渊满星包过，加V：xxxxx');
    step('④群秩序', '识别广告：引流 + 联系方式，<b>高置信</b> → 自动撤回并提醒；低置信仅提示管理员');
    setTimeout(() => { const last = [...chat.querySelectorAll('.row .bubble')].pop(); last.classList.add('recall'); sys('群助手撤回了一条广告消息 · 已记录并通知管理员'); }, 700);
  },
  captain() {
    other('阿月', '#c27c00', '老张！上期视频那个配队我想到个改进，副C换成水系反应会更稳', '舰长');
    step('②分层承接', '层级=<b>舰长</b> × 意图=<b>提建议</b> → 命中升级规则，进入 UP 主<b>高优待回复队列</b>');
    reply(() => ai('好思路阿月！已经原话转给老张本人啦，他上线会亲自回你 🔺'));
  },
  profileOld() {
    me('我的档案');
    step('③粉丝记忆', '粉丝可查看助手记住了什么，并一键清除');
    reply(() => ai(`<div class="card-msg"><div class="cbody"><b>🗂 助手记住的关于你</b><span class="meta">层级：${$('#p-level').textContent}<br>来意：${state.intent}<br>群等级：${state.signed ? 'Lv.3 常驻观众' : 'Lv.2'}<br>${state.mem.length ? '摘要：' + state.mem.join('；') : '摘要：暂无'}</span><button class="btn ghost" style="background:#f53f3f" onclick="state.mem=[];$('#p-mem').textContent='（已清除）';toast('已清除互动摘要');step('③粉丝记忆','粉丝主动清除摘要 → 档案仅保留层级与来意')">一键清除记忆</button></div><div class="src">只记录与群互动相关的摘要 · UP 主看不到私聊原文</div></div>`, true));
  },
  care() {
    sys('— 一个月后 · 小雷已 10 天未发言 —');
    step('⑤KOL洞察', '活跃度下降 → 生成<b>流失预警</b>；助手发一次轻量关怀（不推商业内容）');
    ai('小雷，好久没见你啦～这周老张出了新深渊配队，还有你在练的火系主C新圣遗物思路，有空来看看？');
    step('⑤KOL洞察', 'KOL 后台「流失预警」名单 +1，可选择由老张本人互动');
  },
  profile() {
    me('我的档案');
    step('③粉丝记忆', '跳转<b>粉丝主页</b>：档案、成长、权益集中沉淀，聊天只负责问答');
    reply(() => { ai(`<div class="card-msg"><div class="cbody"><b>🗂 你的粉丝主页已更新</b><span class="meta">等级、记忆、签到、权益都在这里</span><button class="btn" onclick="openHome()">打开我的主页 ›</button></div></div>`, true); setTimeout(openHome, 500); });
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

const chips = [['🔴 今晚开播吗', 'live'], ['📖 深渊配队', 'guide'], ['▶ 最新视频', 'video'], ['✅ 签到', 'sign'], ['🎁 抽奖', 'draw'], ['🤝 组队', 'team'], ['📢 版本活动', 'game'], ['💬 对老张说', 'say'], ['😭 又歪了', 'emo'], ['📱 手机卡', 'gear'], ['⭐ 订阅会员', 'sub'], ['👤 我的主页', 'profile'], ['👑 舰长发言', 'captain'], ['🚫 有人发广告', 'ad']];
$('#chips').innerHTML = chips.map(([t, k]) => `<button data-k="${k}">${t}</button>`).join('');
$('#chips').onclick = e => { const k = e.target.dataset.k; if (!k) return; if (!state.joined) { toast('先完成入群申请'); return; } S[k](); };
$('#pinned').onclick = () => S.live();

const rules = [[/歪|保底/, 'emo'], [/手机|卡顿|卡吗|外设|手柄/, 'gear'], [/档案|忘记/, 'profile'], [/播|直播|预约/, 'live'], [/视频|更新|最新/, 'video'], [/深渊|配队|圣遗物|攻略|怎么/, 'guide'], [/签到/, 'sign'], [/抽奖/, 'draw'], [/会员|订阅|舰长/, 'sub'], [/组队|一起|周本/, 'team'], [/活动|版本|卡池|兑换码/, 'game'], [/记得/, 'memory'], [/老张|想看|希望/, 'say']];
function send() {
  if (!state.joined) { toast('先完成入群申请'); return; }
  const v = $('#msg').value.trim(); if (!v) return; $('#msg').value = '';
  const hit = rules.find(([r]) => r.test(v));
  if (hit) { override = v; S[hit[1]](); return; }
  me(v); step('②分层承接', '未命中已知意图 → 低置信，转入 UP 主待办'); reply(() => ai('这个我拿不准，已经帮你转给老张本人啦，他上线会看到～'));
}
$('#send').onclick = send; $('#msg').onkeydown = e => e.key === 'Enter' && send();

/* 开场：群内氛围 */
sys('10月12日 19:02');
other('北斗船员', '#7f9cf5', '今晚老张播不播啊', '粉丝牌14');
ai('播的！20:00 准时开，点群公告就能预约～');
other('甜甜花', '#f78fb3', '[图片] 我画的老张Q版，大家看看😆', '粉丝牌12');
ai('哇画得太可爱了！已帮你投到本周「二创精选」，老张上线会看到 ✨');

/* ① 入群申请 */
$('#opts').onclick = e => { const v = e.target.dataset.v; if (!v) return; state.intent = v; document.querySelectorAll('#opts span').forEach(s => s.classList.toggle('on', s === e.target)); recJoin(); };
$('#auth').onchange = () => { $('#authinfo').style.display = $('#auth').checked ? '' : 'none'; recJoin(); };
function recJoin() {
  const r = $('#jrec'); const low = !$('#auth').checked && state.intent === '随便看看';
  r.className = 'jrec' + (low ? ' alt' : ''); r.innerHTML = low ? '💡 推荐先加入<b>开放水友群</b>，熟悉后再来核心群（仍可直接申请）' : `✅ 匹配度高：推荐加入<b>核心粉丝群</b>`;
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
  step('①入群识别', `小雷入群：${auth ? '粉丝牌 6 级 · 关注 12 天 · 近期看《深渊配队》' : '未授权，仅按答题建档'} · 来意=<b>${state.intent}</b> → 建立粉丝档案初版`);
  step('①入群识别', 'KOL 后台：新增来源「深渊视频」+1');
  sys('小雷 加入了群聊');
  const tip = { '问攻略': '有卡关的地方直接 @我，老张的 128 期视频我都学过啦', '找队友': '想组队直接说「组队+玩法」，我帮你找同时段在线的群友', '追更UP主': '开播和更新我会私聊提醒你，不 @全体打扰', '随便看看': '先逛逛，底下快捷按钮随便点～' }[state.intent];
  setTimeout(() => { ai(`欢迎小雷～🎉 ${auth ? '看你最近在看<b>深渊配队</b>，' : ''}${tip}！`); ai(`<div class="card-msg"><div class="cbody"><b>👤 已为你建立粉丝主页</b><span class="meta">等级 · 签到 · 助手记住的事 · 会员权益，随时可查可删</span><button class="btn" onclick="openHome()">查看我的主页 ›</button></div></div>`, true); }, 400);
  markJ(0);
}
$('#jbtn').onclick = joinGroup;

/* 演示剧本 */
const J = [() => joinGroup(), () => S.guide(), () => S.followup(), () => { S.sign(); setTimeout(() => S.team(), 1500); }, () => S.gear(), () => S.care()];
function markJ(i) { document.querySelectorAll('#journey button').forEach((b, k) => { b.classList.toggle('on', k === i); if (k < i || (k === i)) b.classList.add('done'); }); }
$('#journey').onclick = e => { const b = e.target.closest('button'); if (!b) return; const i = +b.dataset.j; if (i > 0 && !state.joined) joinGroup(); setTimeout(() => { J[i](); markJ(i); }, i > 0 && !state.joined ? 900 : 0); };

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

/* ---------- 粉丝主页 ---------- */
function renderHome() {
  const auth = $('#auth').checked, sub = state.sub !== '未订阅';
  const days = ['一','二','三','四','五','六','日'].map((d, i) => `<span class="${i < 6 ? 'ok' : (state.signed ? 'ok' : 'today')}">${d}</span>`).join('');
  const ben = [['💬','群内问答',1],['🔔','开播提醒',1],['✅','签到抽奖',1],['🤝','组队撮合',1],['🩺','配队诊断',sub],['📚','会员攻略',sub],['🎯','抽奖双倍',sub],['🎙','老张亲回',0]];
  $('#hbody').innerHTML = `
    <div class="hero"><div class="avatar big">雷</div><div><b>小雷</b> ${sub ? '<span class="tag gold" style="font-size:10px">攻略会员</span>' : ''}
      <small>${auth ? 'B站粉丝牌 6 级 · 关注 12 天' : '未授权 B 站信息'} · 入群 ${state.joined ? '今天' : '—'}</small>
      <small>群等级 Lv.${state.signed ? 3 : 2}「${state.signed ? '常驻观众' : '新晋旅行者'}」</small><div class="lvbar"><i style="width:${state.signed ? 35 : 80}%"></i></div></div></div>
    <div class="hsec"><h5>📌 我的标签 <small>来自入群选择与提问</small></h5><div class="tags"><span>来意：${state.intent}</span>${auth ? '<span>来源：深渊配队视频</span>' : ''}${state.mem.some(m => m.includes('火系')) ? '<span>在练：火系主C</span>' : ''}${state.mem.some(m => m.includes('通关')) ? '<span>深渊12层 ✓</span>' : ''}<span>活跃：周末晚上</span></div></div>
    <div class="hsec"><h5>✅ 签到 <small>连续 ${state.signed ? 7 : 6} 天 · 满 7 天解锁抽奖</small></h5><div class="sign-days">${days}</div>
      <button class="hbtn" onclick="closeHome();S.${state.signed ? 'draw' : 'sign'}()">${state.signed ? '去抽奖' : '今日签到'}</button></div>
    <div class="hsec"><h5>🧠 助手记住的事 <small>用于下次接着聊</small></h5>
      <div class="tl">${state.mem.length ? state.mem.map(m => { const [d, ...r] = m.split(' '); return `<div><i>${d}</i>${r.join(' ')}</div>`; }).join('') : '<div>暂无记录</div>'}</div>
      <button class="hbtn ghost" onclick="state.mem=[];$('#p-mem').textContent='（已清除）';renderHome();toast('已清除互动记忆');step('③粉丝记忆','粉丝在主页清除记忆 → 仅保留层级与来意')">清除记忆</button>
      <p class="privacy">只记录与群互动相关的摘要；UP 主只看到标签和摘要，看不到私聊原文。</p></div>
    <div class="hsec"><h5>🔴 我的订阅 <small>${state.booked ? '已预约 1 场' : '暂无预约'}</small></h5>
      <div class="kv"><span>今晚 20:00 深渊满星配队</span><b>${state.booked ? '✓ 已预约' : `<a href="javascript:closeHome();S.live()">去预约</a>`}</b></div>
      <div class="kv"><span>版本更新提醒</span><b>已开启</b></div></div>
    <div class="hsec"><h5>⭐ 我的权益 <small>${sub ? state.sub : '旅行者（免费）'}</small></h5>
      <div class="grid-ben">${ben.map(([i, t, on]) => `<div class="${on ? '' : 'lock'}">${i}<br>${t}</div>`).join('')}</div>
      ${sub ? '' : '<button class="hbtn" onclick="closeHome();S.sub()">升级会员 · ¥12/月</button>'}</div>`;
}
window.openHome = () => { if (!state.joined) { toast('先完成入群申请'); return; } renderHome(); $('#home').classList.add('on'); step('③粉丝记忆', '打开粉丝主页 · 档案对粉丝<b>可见、可删</b>'); };
window.closeHome = () => $('#home').classList.remove('on');
window.state = state;
