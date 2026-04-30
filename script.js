// ─── Firebase ─────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBJxZvcpgKbPGbEtT4c181n2pMGIIZTS-c",
  authDomain: "alias-d54a8.firebaseapp.com",
  databaseURL: "https://alias-d54a8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "alias-d54a8",
  storageBucket: "alias-d54a8.firebasestorage.app",
  messagingSenderId: "321422256553",
  appId: "1:321422256553:web:791ceb19b423e5584dbcb8"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ─── Словники ─────────────────────────────────────────────────────────────────
const BUILTIN = {
  "🌍 Загальні": [
    "Слон","Хмара","Парасолька","Бібліотека","Піраміда","Авокадо","Телескоп",
    "Маяк","Вулкан","Жирафа","Компас","Термометр","Акваріум","Балкон","Вітряк",
    "Кактус","Дельфін","Єнот","Крокодил","Лимон","Молоток","Ракета","Фламінго",
    "Якір","Бурштин","Ескалатор","Підводний човен","Самовар","Тюлень","Хокей",
    "Цунамі","Гіпноз","Джерело","Шахта","Обрій","Павук","Насос","Іриска"
  ],
  "💻 IT": [
    "Алгоритм","Масив","Цикл","Синтаксис","Баг","Деплой","Об'єкт","Стек",
    "Процесор","Відладка","Компілятор","Інтерфейс","База даних","Фреймворк",
    "Рекурсія","Токен","Сервер","Хмарне сховище","Брандмауер","Репозиторій"
  ],
  "🎬 Кіно": [
    "Режисер","Монтаж","Каскадер","Сценарій","Трейлер","Бюджет","Прем'єра",
    "Актор","Декорації","Грим","Озвучка","Субтитри","Спецефекти","Оскар","Серіал"
  ],
  "🍕 Їжа": [
    "Піца","Суші","Борщ","Пельмені","Лазанья","Круасан","Такос","Карі",
    "Фондю","Паелья","Стейк","Капучино","Макарон","Вафлі","Хумус","Тірамісу"
  ],
  "🏅 Спорт": [
    "Штанга","Пенальті","Аутсайдер","Тайм-аут","Офсайд","Спринт","Манеж",
    "Суддя","Трибуна","Допінг","Фехтування","Регбі","Крикет","Більярд","Гольф"
  ]
};

// ─── Стан ─────────────────────────────────────────────────────────────────────
let myName      = "";
let currentRoom = "";
let roomUnsub   = null;
let timerHandle = null;
let jsonWords   = [];

// ─── Утиліти ──────────────────────────────────────────────────────────────────
function $(id) { return document.getElementById(id); }

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
}

function modeLabel(mode) {
  return mode === "team" ? "Командний" : "Особистий";
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ══════════════════════════════════════════════════════════════════════════════
// ГОЛОВНА
// ══════════════════════════════════════════════════════════════════════════════
async function loadRoomList() {
  const el = $("rooms-list");
  el.innerHTML = `<span class="muted">Завантаження...</span>`;
  const snap = await db.ref("lobby").get();
  const rooms = snap.val();
  if (!rooms) {
    el.innerHTML = `<span class="muted">Немає відкритих кімнат</span>`;
    return;
  }
  el.innerHTML = Object.entries(rooms).map(([id, info]) => `
    <div class="room-item" data-room="${id}">
      <div>
        <span class="room-name">${id}</span>
        <span class="room-meta">${modeLabel(info.mode)} · ${info.roundTime || 60}с · ціль ${info.scoreLimit || 30}</span>
      </div>
      <span class="room-players">${info.players || 0} 👤</span>
    </div>`
  ).join("");
}

// Клік по кімнаті — одразу входимо
$("rooms-list").addEventListener("click", e => {
  const item = e.target.closest(".room-item");
  if (!item) return;
  const nick = $("home-nick").value.trim();
  if (!nick) { alert("Спочатку введи свій нік"); $("home-nick").focus(); return; }
  joinExistingRoom(item.dataset.room, nick);
});

$("btn-refresh").onclick = loadRoomList;

$("btn-create").onclick = () => {
  const nick = $("home-nick").value.trim();
  const room = $("home-room").value.trim();
  if (!nick) { alert("Введи свій нік"); $("home-nick").focus(); return; }
  if (!room) { alert("Введи назву кімнати"); $("home-room").focus(); return; }
  myName      = nick;
  currentRoom = room;
  initCreateUI();
  $("create-title").textContent = `Налаштування: ${room}`;
  showScreen("screen-create");
};

// ══════════════════════════════════════════════════════════════════════════════
// ЕКРАН СТВОРЕННЯ
// ══════════════════════════════════════════════════════════════════════════════
function initCreateUI() {
  // Таби
  document.querySelectorAll(".dict-tab").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".dict-tab").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".dict-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      $("dict-" + btn.dataset.tab).classList.add("active");
    };
  });

  // Категорії
  const grid = $("categories-grid");
  grid.innerHTML = "";
  Object.keys(BUILTIN).forEach(cat => {
    const lbl = document.createElement("label");
    lbl.className = "cat-checkbox";
    lbl.innerHTML = `<input type="checkbox" value="${cat}" checked> ${cat}`;
    grid.appendChild(lbl);
  });

  // JSON
  $("json-file").onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    $("json-file-label").textContent = file.name;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target.result);
        jsonWords = Array.isArray(parsed)
          ? parsed.filter(w => typeof w === "string")
          : Object.values(parsed).flat().filter(w => typeof w === "string");
        $("json-preview").textContent = `✅ ${jsonWords.length} слів`;
      } catch { $("json-preview").textContent = "❌ Невірний JSON"; }
    };
    reader.readAsText(file);
  };

  $("game-mode").onchange = updateEndHint;
  $("score-limit").oninput = updateEndHint;
  $("round-count").oninput = updateEndHint;
  updateEndHint();
}

function updateEndHint() {
  const mode  = $("game-mode").value;
  const score = $("score-limit").value;
  const rnds  = $("round-count").value;
  $("team-round-row").style.display = mode === "team" ? "flex" : "none";
  $("end-hint").textContent = mode === "solo"
    ? `Гра до ${score} балів (пари зациклюються)`
    : `До ${score} балів або ${rnds} раундів — що швидше`;
}

function buildWordPool() {
  const tab = document.querySelector(".dict-tab.active")?.dataset.tab || "categories";
  let pool = [];
  if (tab === "categories") {
    document.querySelectorAll("#categories-grid input:checked")
      .forEach(cb => { pool = pool.concat(BUILTIN[cb.value] || []); });
  } else if (tab === "custom") {
    pool = $("custom-words").value.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
  } else {
    pool = jsonWords;
  }
  if (pool.length < 5) { alert("Замало слів! Оберіть категорії або додайте слова."); return null; }
  return shuffle(pool);
}

$("back-create").onclick = () => showScreen("screen-home");

$("btn-create-confirm").onclick = async () => {
  const snap = await db.ref(`rooms/${currentRoom}/config`).get();
  if (snap.exists()) { alert("Кімната вже існує!"); return; }

  const wordPool = buildWordPool();
  if (!wordPool) return;

  const mode        = $("game-mode").value;
  const roundTime   = parseInt($("round-time").value)  || 60;
  const scoreLimit  = parseInt($("score-limit").value) || 30;
  const totalRounds = parseInt($("round-count").value) || 10;

  await db.ref(`rooms/${currentRoom}`).set({
    config: { host: myName, status: "lobby", mode, roundTime, scoreLimit, totalRounds, teams: {} },
    wordPool,
    players: { [myName]: true }
  });
  await db.ref(`lobby/${currentRoom}`).set({ mode, roundTime, scoreLimit, players: 1 });

  showScreen("screen-lobby");
  subscribeRoom();
};

// ══════════════════════════════════════════════════════════════════════════════
// ПРИЄДНАННЯ ДО ІСНУЮЧОЇ КІМНАТИ
// ══════════════════════════════════════════════════════════════════════════════
async function joinExistingRoom(room, nick) {
  const snap = await db.ref(`rooms/${room}/config`).get();
  if (!snap.exists()) { alert("Кімната не знайдена"); return; }

  const cfg = snap.val();
  if (cfg.status !== "lobby") { alert("Гра вже розпочата"); return; }

  const pSnap = await db.ref(`rooms/${room}/players`).get();
  const players = Object.keys(pSnap.val() || {});
  if (players.includes(nick)) { alert("Цей нік вже зайнятий"); return; }

  myName      = nick;
  currentRoom = room;

  await db.ref(`rooms/${room}/players/${nick}`).set(true);
  const newCount = players.length + 1;
  await db.ref(`lobby/${room}/players`).set(newCount);

  showScreen("screen-lobby");
  subscribeRoom();
}

// ══════════════════════════════════════════════════════════════════════════════
// ЄДИНИЙ ПІДПИСНИК
// ══════════════════════════════════════════════════════════════════════════════
function subscribeRoom() {
  if (roomUnsub) roomUnsub();
  const unsub = db.ref(`rooms/${currentRoom}`).on("value", snap => {
    const data = snap.val();
    if (!data) { goHome(); return; }
    const status = data.config?.status;
    if      (status === "lobby")    renderLobby(data);
    else if (status === "briefing") renderBriefing(data);
    else if (status === "playing")  renderRound(data);
    else if (status === "lastword") renderLastWord(data);
    else if (status === "result")   renderResult(data);
    else if (status === "final")    renderFinal(data);
  });
  roomUnsub = () => db.ref(`rooms/${currentRoom}`).off("value", unsub);
}

// ══════════════════════════════════════════════════════════════════════════════
// ЛОБІ
// ══════════════════════════════════════════════════════════════════════════════
function renderLobby(data) {
  showScreen("screen-lobby");
  stopTimer();

  const cfg     = data.config || {};
  const players = Object.keys(data.players || {});
  const isHost  = cfg.host === myName;

  $("lobby-title").textContent = `Кімната: ${currentRoom}`;
  $("lobby-code").textContent  = `Код: ${currentRoom}`;

  $("lobby-config-preview").innerHTML = `
    <div class="config-row"><span>Режим</span><span>${modeLabel(cfg.mode)}</span></div>
    <div class="config-row"><span>Час раунду</span><span>${cfg.roundTime}с</span></div>
    <div class="config-row"><span>Ціль балів</span><span>${cfg.scoreLimit}</span></div>
    ${cfg.mode === "team" ? `<div class="config-row"><span>Макс. раундів</span><span>${cfg.totalRounds}</span></div>` : ""}
  `;

  $("lobby-players").innerHTML = players.map(p => `
    <div class="player-row">
      <span class="host-badge">${p === cfg.host ? "👑" : "&nbsp;&nbsp;&nbsp;"}</span>
      <span class="player-name ${p === myName ? "player-me" : ""}">${p}</span>
      ${p === myName ? `<span class="you-tag">(ти)</span>` : ""}
    </div>`
  ).join("");

  if (cfg.mode === "team" && isHost) {
    $("team-assignment-wrap").style.display = "block";
    renderTeamAssignment(players, cfg.teams || {});
  } else {
    $("team-assignment-wrap").style.display = "none";
  }

  $("host-zone").style.display  = isHost ? "block" : "none";
  $("guest-zone").style.display = isHost ? "none"  : "block";
}

function renderTeamAssignment(players, currentTeams) {
  $("team-assignment").innerHTML = players.map(p => `
    <div class="team-row-assign">
      <span class="${p === myName ? "player-me" : ""}">${p}</span>
      <input class="team-input team-inp-small" type="text" data-player="${p}"
        placeholder="Команда" value="${currentTeams[p] || ""}" maxlength="20">
    </div>`
  ).join("");
  $("team-assignment").querySelectorAll(".team-input").forEach(inp => {
    inp.onchange = () =>
      db.ref(`rooms/${currentRoom}/config/teams/${inp.dataset.player}`).set(inp.value.trim());
  });
}

$("start-btn").onclick = async () => {
  const snap    = await db.ref(`rooms/${currentRoom}`).get();
  const data    = snap.val();
  const cfg     = data.config || {};
  const players = Object.keys(data.players || {});

  if (players.length < 3) { alert("Потрібно мінімум 3 гравці"); return; }

  let schedule, scores;

  if (cfg.mode === "solo") {
    schedule = buildSoloSchedule(players);
    scores   = Object.fromEntries(players.map(p => [p, 0]));
  } else {
    const grouped = groupByTeam(players, cfg.teams || {});
    if (Object.keys(grouped).length < 2) { alert("Потрібно мінімум 2 команди"); return; }
    for (const [t, members] of Object.entries(grouped)) {
      if (members.length < 2) { alert(`Команда "${t}" має менше 2 гравців`); return; }
    }
    schedule = buildTeamSchedule(grouped, cfg.totalRounds);
    scores   = Object.fromEntries(Object.keys(grouped).map(t => [t, 0]));
  }

  await db.ref(`rooms/${currentRoom}/config`).update({ status: "briefing" });
  await db.ref(`rooms/${currentRoom}/game`).set({
    schedule, cursor: 0, wordIdx: 0, scores,
    roundCorrect: 0, roundSkip: 0, roundLog: [], timer: cfg.roundTime,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// ГЕНЕРАТОРИ РОЗКЛАДУ
// ══════════════════════════════════════════════════════════════════════════════
function buildSoloSchedule(players) {
  const n = players.length;
  const allPairs = [];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (i !== j) allPairs.push({ explainer: players[i], guesser: players[j] });

  // Впорядковуємо щоб ніхто не повторював роль підряд
  const ordered = [];
  const remaining = [...allPairs];
  let lastExp = "", lastGss = "";

  while (remaining.length > 0) {
    let idx = remaining.findIndex(p => p.explainer !== lastExp && p.guesser !== lastGss);
    if (idx === -1) idx = remaining.findIndex(p => p.explainer !== lastExp);
    if (idx === -1) idx = 0;
    const [p] = remaining.splice(idx, 1);
    ordered.push(p);
    lastExp = p.explainer;
    lastGss = p.guesser;
  }
  return ordered;
}

function buildTeamSchedule(grouped, totalRounds) {
  const teamNames = Object.keys(grouped);
  const expIdx    = Object.fromEntries(teamNames.map(t => [t, 0]));
  const rounds    = [];
  for (let r = 0; r < totalRounds; r++) {
    const team      = teamNames[r % teamNames.length];
    const members   = grouped[team];
    const explainer = members[expIdx[team] % members.length];
    expIdx[team]++;
    rounds.push({ team, explainer, guessers: members.filter(m => m !== explainer) });
  }
  return rounds;
}

function groupByTeam(players, teams) {
  const grouped = {};
  players.forEach(p => {
    const t = teams[p] || "Без команди";
    if (!grouped[t]) grouped[t] = [];
    grouped[t].push(p);
  });
  return grouped;
}

// ══════════════════════════════════════════════════════════════════════════════
// БРИФІНГ
// ══════════════════════════════════════════════════════════════════════════════
function renderBriefing(data) {
  showScreen("screen-briefing");
  stopTimer();

  const cfg    = data.config;
  const game   = data.game;
  const isHost = cfg.host === myName;
  const round  = getRound(game, cfg.mode);
  const cursor = game.cursor || 0;

  if (cfg.mode === "solo") {
    const cycleLen = game.schedule.length;
    const cycle    = Math.floor(cursor / cycleLen) + 1;
    const pos      = (cursor % cycleLen) + 1;
    $("brief-round-label").textContent = `Цикл ${cycle}, пара ${pos}/${cycleLen}`;
    $("brief-explainer").textContent   = round.explainer;
    $("brief-guesser").textContent     = round.guesser;
  } else {
    $("brief-round-label").textContent = `Раунд ${cursor + 1}/${game.schedule.length}`;
    $("brief-explainer").textContent   = round.explainer;
    $("brief-guesser").textContent     = (round.guessers || []).join(", ") || "—";
  }

  const role = getMyRole(round, cfg.mode);
  const labels = { explainer: "Ти пояснюєш", guesser: "Ти відгадуєш", observer: "Ти суддя / відпочиваєш" };
  const chips  = { explainer: "chip-explain", guesser: "chip-guess",   observer: "chip-watch" };
  $("brief-my-role").innerHTML =
    `<span class="role-chip ${chips[role]}">${labels[role]}</span>`;

  renderScores(game.scores, "brief-scores", cfg.scoreLimit);

  $("brief-host-btn-wrap").style.display = isHost ? "block" : "none";
  $("brief-guest-wait").style.display    = isHost ? "none"  : "block";
}

$("brief-start-btn").onclick = () =>
  db.ref(`rooms/${currentRoom}/config`).update({ status: "playing" });

// ══════════════════════════════════════════════════════════════════════════════
// РАУНД
// ══════════════════════════════════════════════════════════════════════════════
function renderRound(data) {
  showScreen("screen-round");

  const cfg    = data.config;
  const game   = data.game;
  const isHost = cfg.host === myName;
  const round  = getRound(game, cfg.mode);
  const role   = getMyRole(round, cfg.mode);
  const cursor = game.cursor || 0;

  $("round-label").textContent = cfg.mode === "solo"
    ? `${round.explainer} → ${round.guesser}`
    : `Раунд ${cursor + 1}/${game.schedule.length} · ${round.team}`;

  const timeLeft = (game.timer !== undefined) ? game.timer : cfg.roundTime;
  $("timer").textContent = timeLeft;
  const pct = timeLeft / cfg.roundTime * 100;
  $("timer-bar").style.width = pct + "%";
  $("timer-bar").className = "timer-bar" + (pct > 40 ? "" : pct > 20 ? " warn" : " danger");

  $("view-explainer").style.display = role === "explainer" ? "block" : "none";
  $("view-guesser").style.display   = role === "guesser"   ? "block" : "none";
  $("view-observer").style.display  = role === "observer"  ? "block" : "none";

  if (role === "explainer") {
    $("word-display").textContent = data.wordPool[game.wordIdx] || "—";
  }
  if (role === "observer") {
    $("observer-chip").textContent = cfg.mode === "solo" ? "Ти суддя" : "Ти відпочиваєш";
    $("observer-msg").textContent  = cfg.mode === "solo"
      ? `${round.explainer} → ${round.guesser}`
      : `Грає команда ${round.team}`;
  }

  $("stat-correct").textContent = game.roundCorrect || 0;
  $("stat-skip").textContent    = game.roundSkip    || 0;
  renderLog(game.roundLog || []);
  renderScores(game.scores, "round-scores", cfg.scoreLimit);

  if (isHost && !timerHandle) startHostTimer(cfg.roundTime);
}

function startHostTimer(roundTime) {
  stopTimer();
  timerHandle = setInterval(async () => {
    const cfgSnap = await db.ref(`rooms/${currentRoom}/config`).get();
    const cfg = cfgSnap.val();
    if (!cfg || cfg.status !== "playing") { stopTimer(); return; }

    const gSnap = await db.ref(`rooms/${currentRoom}/game`).get();
    const game  = gSnap.val();
    if (!game) { stopTimer(); return; }

    if (game.timer <= 1) {
      stopTimer();
      await db.ref(`rooms/${currentRoom}/game`).update({ timer: 0 });
      await db.ref(`rooms/${currentRoom}/config`).update({ status: "lastword" });
    } else {
      await db.ref(`rooms/${currentRoom}/game`).update({ timer: game.timer - 1 });
    }
  }, 1000);
}

function stopTimer() {
  if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
}

$("correct-btn").onclick = () => doScore(true);
$("skip-btn").onclick    = () => doScore(false);

async function doScore(correct) {
  const snap  = await db.ref(`rooms/${currentRoom}`).get();
  const data  = snap.val();
  const cfg   = data.config;
  const game  = data.game;
  const round = getRound(game, cfg.mode);
  const word  = data.wordPool[game.wordIdx];

  const scores      = applyScore({ ...game.scores }, correct, round, cfg.mode);
  const log         = [...(game.roundLog || []), { word, result: correct ? "correct" : "skip" }];
  const roundCorrect = (game.roundCorrect || 0) + (correct ? 1 : 0);
  const roundSkip    = (game.roundSkip    || 0) + (correct ? 0 : 1);
  const nextWordIdx  = (game.wordIdx + 1) % data.wordPool.length;

  await db.ref(`rooms/${currentRoom}/game`).update({
    scores, roundLog: log, roundCorrect, roundSkip, wordIdx: nextWordIdx
  });

  if (checkScoreLimit(scores, cfg.scoreLimit)) {
    await endGame();
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// ОСТАННЄ СЛОВО
// ══════════════════════════════════════════════════════════════════════════════
function renderLastWord(data) {
  showScreen("screen-lastword");
  stopTimer();

  const cfg   = data.config;
  const game  = data.game;
  const round = getRound(game, cfg.mode);
  const role  = getMyRole(round, cfg.mode);
  const isExp = role === "explainer";

  $("lw-view-explainer").style.display = isExp ? "block" : "none";
  $("lw-view-other").style.display     = isExp ? "none"  : "block";

  if (isExp) {
    $("lw-word").textContent = data.wordPool[game.wordIdx] || "—";
  } else {
    renderScores(game.scores, "lw-scores", cfg.scoreLimit);
  }
}

$("lw-yes-btn").onclick = () => doLastWord(true);
$("lw-no-btn").onclick  = () => doLastWord(false);

async function doLastWord(correct) {
  if (correct) {
    const snap  = await db.ref(`rooms/${currentRoom}`).get();
    const data  = snap.val();
    const cfg   = data.config;
    const game  = data.game;
    const round = getRound(game, cfg.mode);
    const word  = data.wordPool[game.wordIdx];

    const scores = applyScore({ ...game.scores }, true, round, cfg.mode);
    const log    = [...(game.roundLog || []), { word, result: "correct" }];

    await db.ref(`rooms/${currentRoom}/game`).update({
      scores, roundLog: log, roundCorrect: (game.roundCorrect || 0) + 1
    });

    if (checkScoreLimit(scores, cfg.scoreLimit)) { await endGame(); return; }
  }
  await finishRound();
}

// ══════════════════════════════════════════════════════════════════════════════
// ЗАВЕРШЕННЯ РАУНДУ / ГРИ
// ══════════════════════════════════════════════════════════════════════════════
async function finishRound() {
  const snap = await db.ref(`rooms/${currentRoom}`).get();
  const data = snap.val();
  const cfg  = data.config;
  const game = data.game;

  if (cfg.mode === "team" && (game.cursor || 0) >= game.schedule.length - 1) {
    await endGame(); return;
  }

  await db.ref(`rooms/${currentRoom}/game`).update({
    roundCorrect: 0, roundSkip: 0, roundLog: [], timer: cfg.roundTime
  });
  await db.ref(`rooms/${currentRoom}/config`).update({ status: "result" });
}

async function endGame() {
  stopTimer();
  await db.ref(`rooms/${currentRoom}/config`).update({ status: "final" });
}

// ══════════════════════════════════════════════════════════════════════════════
// РЕЗУЛЬТАТ
// ══════════════════════════════════════════════════════════════════════════════
function renderResult(data) {
  showScreen("screen-result");
  stopTimer();

  const cfg    = data.config;
  const game   = data.game;
  const isHost = cfg.host === myName;
  const round  = getRound(game, cfg.mode);

  $("result-detail").innerHTML = `
    <div class="result-pair">
      ${cfg.mode === "solo"
        ? `<span>${round.explainer}</span><span>→</span><span>${round.guesser}</span>`
        : `<span>Команда <b>${round.team}</b></span><span></span><span></span>`}
    </div>
    <div class="result-stats-row">
      <span class="res-correct">✅ ${game.roundCorrect || 0} вгадано</span>
      <span class="res-skip">❌ ${game.roundSkip || 0} пропуск</span>
    </div>`;

  renderScores(game.scores, "result-scores", cfg.scoreLimit);
  $("result-host-btn").style.display  = isHost ? "block" : "none";
  $("result-guest-wait").style.display = isHost ? "none"  : "block";
}

$("next-round-btn").onclick = async () => {
  const snap = await db.ref(`rooms/${currentRoom}/game`).get();
  await db.ref(`rooms/${currentRoom}/game`).update({ cursor: (snap.val().cursor || 0) + 1 });
  await db.ref(`rooms/${currentRoom}/config`).update({ status: "briefing" });
};

// ══════════════════════════════════════════════════════════════════════════════
// ФІНАЛ
// ══════════════════════════════════════════════════════════════════════════════
function renderFinal(data) {
  showScreen("screen-final");
  stopTimer();

  const scores = data.game.scores || {};
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const winner = sorted[0];
  $("final-winner").textContent       = winner ? winner[0] : "—";
  $("final-winner-score").textContent = winner ? `${winner[1]} балів` : "";
  renderScores(scores, "final-scores", data.config?.scoreLimit);
}

$("play-again-btn").onclick = async () => {
  await db.ref(`rooms/${currentRoom}/config`).update({ status: "lobby" });
  await db.ref(`rooms/${currentRoom}/game`).remove();
};
$("leave-final-btn").onclick = leaveRoom;

// ══════════════════════════════════════════════════════════════════════════════
// ВИХІД
// ══════════════════════════════════════════════════════════════════════════════
$("leave-lobby-btn").onclick = leaveRoom;
$("leave-game-btn").onclick  = leaveRoom;

async function leaveRoom() {
  stopTimer();
  if (roomUnsub) { roomUnsub(); roomUnsub = null; }
  if (!currentRoom || !myName) { goHome(); return; }

  await db.ref(`rooms/${currentRoom}/players/${myName}`).remove();

  const pSnap    = await db.ref(`rooms/${currentRoom}/players`).get();
  const remaining = Object.keys(pSnap.val() || {});

  if (remaining.length === 0) {
    await db.ref(`rooms/${currentRoom}`).remove();
    await db.ref(`lobby/${currentRoom}`).remove();
  } else {
    const cfgSnap = await db.ref(`rooms/${currentRoom}/config`).get();
    const cfg = cfgSnap.val();
    if (cfg?.host === myName) {
      await db.ref(`rooms/${currentRoom}/config/host`).set(remaining[0]);
    }
    await db.ref(`lobby/${currentRoom}/players`).set(remaining.length);
  }
  goHome();
}

function goHome() {
  stopTimer();
  if (roomUnsub) { roomUnsub(); roomUnsub = null; }
  myName = ""; currentRoom = "";
  loadRoomList();
  showScreen("screen-home");
}

// ══════════════════════════════════════════════════════════════════════════════
// УТИЛІТИ
// ══════════════════════════════════════════════════════════════════════════════
function getRound(game, mode) {
  const cursor = game.cursor || 0;
  const len    = game.schedule.length;
  return mode === "solo"
    ? game.schedule[cursor % len]
    : game.schedule[Math.min(cursor, len - 1)];
}

function getMyRole(round, mode) {
  if (round.explainer === myName) return "explainer";
  if (mode === "solo") return round.guesser === myName ? "guesser" : "observer";
  return (round.guessers || []).includes(myName) ? "guesser" : "observer";
}

function applyScore(scores, correct, round, mode) {
  if (correct) {
    if (mode === "solo") {
      scores[round.explainer] = (scores[round.explainer] || 0) + 1;
      scores[round.guesser]   = (scores[round.guesser]   || 0) + 1;
    } else {
      scores[round.team] = (scores[round.team] || 0) + 1;
    }
  } else {
    if (mode === "solo") scores[round.explainer] = (scores[round.explainer] || 0) - 1;
    else                 scores[round.team]       = (scores[round.team]      || 0) - 1;
  }
  return scores;
}

function checkScoreLimit(scores, limit) {
  return Object.values(scores).some(s => s >= limit);
}

function renderScores(scores, targetId, scoreLimit) {
  const el = $(targetId);
  if (!scores || !el) return;
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  el.innerHTML = sorted.map(([name, score], i) => {
    const pct      = scoreLimit ? Math.max(0, Math.min(score / scoreLimit * 100, 100)) : 0;
    const isLeader = i === 0 && score > 0;
    return `
      <div class="score-row${isLeader ? " score-leader" : ""}">
        <span class="score-name">${name}${name === myName ? ` <em>(ти)</em>` : ""}</span>
        <div class="score-right">
          ${scoreLimit ? `<div class="score-bar-wrap"><div class="score-bar" style="width:${pct}%"></div></div>` : ""}
          <span class="score-val">${score}</span>
          ${scoreLimit ? `<span class="score-limit-lbl">/${scoreLimit}</span>` : ""}
        </div>
      </div>`;
  }).join("");
}

function renderLog(log) {
  const el = $("round-log");
  if (!el) return;
  el.innerHTML = [...log].reverse().slice(0, 8).map(e =>
    `<div class="log-item ${e.result === "correct" ? "log-plus" : "log-minus"}">
      ${e.result === "correct" ? "+1" : "−1"} ${e.word}
    </div>`
  ).join("");
}

// Завантажуємо кімнати при старті
loadRoomList();