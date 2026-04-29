import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase, ref, set, get, update, onValue, remove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

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

// ─── Стан клієнта ─────────────────────────────────────────────────────────────
let myName      = "";
let currentRoom = "";
let roomUnsub   = null;
let timerHandle = null;
let jsonWords   = [];   // слова завантажені з JSON

const $ = id => document.getElementById(id);
const showScreen = id => {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
};

// ══════════════════════════════════════════════════════════════════════════════
// ГОЛОВНА — список кімнат
// ══════════════════════════════════════════════════════════════════════════════
function renderRoomList(targetId) {
  onValue(ref(db, "lobby"), snap => {
    const rooms = snap.val();
    const el = $(targetId);
    if (!rooms) {
      el.innerHTML = `<span class="muted">Немає відкритих кімнат</span>`;
      return;
    }
    el.innerHTML = Object.entries(rooms).map(([id, info]) => `
      <div class="room-item" data-room="${id}">
        <div>
          <span class="room-name">${id}</span>
          <span class="room-meta">${modeLabel(info.mode)} · ${info.players || 0} гравців</span>
        </div>
        <span class="room-time">${info.roundTime || 60}с</span>
      </div>`
    ).join("");
    el.querySelectorAll(".room-item").forEach(item => {
      item.onclick = () => {
        const rid = item.dataset.room;
        if (targetId === "rooms-list") {
          $("join-room-id").value = rid;
          showScreen("screen-join");
        } else {
          $("join-room-id").value = rid;
        }
      };
    });
  });
}

function modeLabel(mode) {
  return mode === "team" ? "Командний" : "Особистий";
}

renderRoomList("rooms-list");

$("btn-create").onclick  = () => { initCreateUI(); showScreen("screen-create"); };
$("btn-join-go").onclick = () => { renderRoomList("join-rooms-list"); showScreen("screen-join"); };
$("back-create").onclick = () => showScreen("screen-home");
$("back-join").onclick   = () => showScreen("screen-home");

// ══════════════════════════════════════════════════════════════════════════════
// ЕКРАН СТВОРЕННЯ
// ══════════════════════════════════════════════════════════════════════════════
function initCreateUI() {
  // Таби словника
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

  // JSON файл
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
        $("json-preview").textContent = `✅ Завантажено ${jsonWords.length} слів`;
      } catch {
        $("json-preview").textContent = "❌ Невірний формат JSON";
      }
    };
    reader.readAsText(file);
  };

  // Режим → показуємо/ховаємо командні налаштування
  $("game-mode").onchange = () => {
    const isTeam = $("game-mode").value === "team";
    $("team-round-row").style.display = isTeam ? "flex" : "none";
    updateEndHint();
  };
  $("score-limit").oninput = updateEndHint;
  $("round-count").oninput = updateEndHint;
  updateEndHint();
}

function updateEndHint() {
  const mode  = $("game-mode").value;
  const score = $("score-limit").value;
  const rnds  = $("round-count").value;
  $("end-hint").textContent = mode === "solo"
    ? `Гра до ${score} балів (пари зациклюються нескінченно)`
    : `Гра до ${score} балів або ${rnds} раундів — що швидше`;
}

function buildWordPool() {
  const activeTab = document.querySelector(".dict-tab.active")?.dataset.tab || "categories";
  let pool = [];
  if (activeTab === "categories") {
    document.querySelectorAll("#categories-grid input:checked")
      .forEach(cb => { pool = pool.concat(BUILTIN[cb.value] || []); });
  } else if (activeTab === "custom") {
    pool = $("custom-words").value
      .split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
  } else {
    pool = jsonWords;
  }
  if (pool.length < 5) {
    alert("Замало слів у словнику! Оберіть категорії або додайте слова.");
    return null;
  }
  return pool.sort(() => Math.random() - 0.5);
}

$("btn-create-room").onclick = async () => {
  const nick = $("create-nick").value.trim();
  const room = $("create-room-id").value.trim();
  if (!nick) { alert("Введи свій нік"); return; }
  if (!room) { alert("Введи назву кімнати"); return; }

  // Перевірка чи кімната вже існує
  const existing = await get(ref(db, `rooms/${room}/config`));
  if (existing.exists()) { alert("Кімната з такою назвою вже існує!"); return; }

  const wordPool = buildWordPool();
  if (!wordPool) return;

  const mode        = $("game-mode").value;
  const roundTime   = parseInt($("round-time").value)  || 60;
  const scoreLimit  = parseInt($("score-limit").value) || 30;
  const totalRounds = parseInt($("round-count").value) || 10;

  // Створюємо кімнату — без гравців поки
  await set(ref(db, `rooms/${room}`), {
    config: {
      host:        "",          // хост — перший хто приєднається
      status:      "lobby",
      mode,
      roundTime,
      scoreLimit,
      totalRounds,
      teams:       {}
    },
    wordPool,
    players:     {}
  });

  // Публікуємо в лобі
  await set(ref(db, `lobby/${room}`), {
    mode, roundTime, scoreLimit, players: 0
  });

  // Автоматично входимо як перший гравець (хост)
  myName      = nick;
  currentRoom = room;
  await joinRoomAsPlayer(true);
};

// ══════════════════════════════════════════════════════════════════════════════
// ЕКРАН ПРИЄДНАННЯ
// ══════════════════════════════════════════════════════════════════════════════
renderRoomList("join-rooms-list");

$("btn-join").onclick = async () => {
  const nick = $("join-nick").value.trim();
  const room = $("join-room-id").value.trim();
  if (!nick) { alert("Введи свій нік"); return; }
  if (!room) { alert("Введи назву кімнати"); return; }

  const snap = await get(ref(db, `rooms/${room}/config`));
  if (!snap.exists()) { alert("Кімната не знайдена"); return; }

  const cfg = snap.val();
  if (cfg.status !== "lobby") { alert("Гра вже розпочата"); return; }

  myName      = nick;
  currentRoom = room;

  // Перевіряємо чи нік вже зайнятий
  const playersSnap = await get(ref(db, `rooms/${room}/players`));
  const players = Object.keys(playersSnap.val() || {});
  if (players.includes(myName)) {
    alert("Цей нік вже зайнятий у цій кімнаті");
    return;
  }

  await joinRoomAsPlayer(false);
};

// ─── Загальна логіка входу ────────────────────────────────────────────────────
async function joinRoomAsPlayer(isCreator) {
  // Додаємо гравця
  await update(ref(db, `rooms/${currentRoom}/players`), { [myName]: true });

  // Перший гравець стає хостом
  const cfgSnap = await get(ref(db, `rooms/${currentRoom}/config`));
  const cfg = cfgSnap.val();
  if (!cfg.host) {
    await update(ref(db, `rooms/${currentRoom}/config`), { host: myName });
  }

  // Оновлюємо лічильник
  const pSnap = await get(ref(db, `rooms/${currentRoom}/players`));
  const count = Object.keys(pSnap.val() || {}).length;
  await update(ref(db, `lobby/${currentRoom}`), { players: count });

  showScreen("screen-lobby");
  subscribeRoom();
}

// ══════════════════════════════════════════════════════════════════════════════
// ЄДИНИЙ ПІДПИСНИК
// ══════════════════════════════════════════════════════════════════════════════
function subscribeRoom() {
  if (roomUnsub) roomUnsub();
  roomUnsub = onValue(ref(db, `rooms/${currentRoom}`), snap => {
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

  // Превью конфігу
  $("lobby-config-preview").innerHTML = `
    <div class="config-row"><span>Режим</span><span>${modeLabel(cfg.mode)}</span></div>
    <div class="config-row"><span>Час раунду</span><span>${cfg.roundTime}с</span></div>
    <div class="config-row"><span>Ціль балів</span><span>${cfg.scoreLimit}</span></div>
    ${cfg.mode === "team" ? `<div class="config-row"><span>Макс. раундів</span><span>${cfg.totalRounds}</span></div>` : ""}
  `;

  // Список гравців
  $("lobby-players").innerHTML = players.map(p => `
    <div class="player-row">
      ${p === cfg.host
        ? `<span class="host-badge">👑</span>`
        : `<span class="host-badge" style="opacity:0">👑</span>`}
      <span class="player-name${p === myName ? " player-me" : ""}">${p}</span>
      ${p === myName ? `<span class="you-tag">(ти)</span>` : ""}
    </div>`
  ).join("");

  // Командний: розподіл
  if (cfg.mode === "team" && isHost) {
    $("team-assignment-wrap").style.display = "block";
    renderTeamAssignment(players, cfg.teams || {});
  } else {
    $("team-assignment-wrap").style.display = "none";
  }

  // Кнопки
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
      update(ref(db, `rooms/${currentRoom}/config/teams`),
             { [inp.dataset.player]: inp.value.trim() });
  });
}

// ─── Старт гри ───────────────────────────────────────────────────────────────
$("start-btn").onclick = async () => {
  const snap    = await get(ref(db, `rooms/${currentRoom}`));
  const data    = snap.val();
  const cfg     = data.config || {};
  const players = Object.keys(data.players || {});
  const mode    = cfg.mode;

  if (players.length < 3) { alert("Потрібно мінімум 3 гравці"); return; }

  let schedule, scores;

  if (mode === "solo") {
    schedule = buildSoloSchedule(players);
    scores   = Object.fromEntries(players.map(p => [p, 0]));
  } else {
    const teams = cfg.teams || {};
    const grouped = groupByTeam(players, teams);
    if (Object.keys(grouped).length < 2) { alert("Потрібно мінімум 2 команди"); return; }
    for (const [t, members] of Object.entries(grouped)) {
      if (members.length < 2) { alert(`Команда "${t}" має менше 2 гравців`); return; }
    }
    schedule = buildTeamSchedule(grouped, cfg.totalRounds);
    scores   = Object.fromEntries(Object.keys(grouped).map(t => [t, 0]));
  }

  const wordPool = data.wordPool;
  if (!wordPool || wordPool.length < 5) { alert("Немає слів у словнику!"); return; }

  await update(ref(db, `rooms/${currentRoom}/config`), { status: "briefing" });
  await set(ref(db, `rooms/${currentRoom}/game`), {
    schedule,
    cursor:       0,      // індекс поточного раунду (для обох режимів)
    wordIdx:      0,
    scores,
    roundCorrect: 0,
    roundSkip:    0,
    roundLog:     [],
    timer:        cfg.roundTime,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// ГЕНЕРАТОРИ РОЗКЛАДУ
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Соло: рівномірне чергування ролей.
 * Для N гравців будуємо цикл де кожен гравець рівномірно чергує:
 * пояснює → відгадує → суддя → пояснює → ...
 *
 * Алгоритм: round-robin турнір.
 * Для N гравців (N непарне — фіксуємо "суддю" по черзі):
 *   Раунд r: explainer = r % N, guesser = (r+1) % N, решта — судді/спостерігачі
 *
 * Але нам треба щоб КОЖНА пара зустрілась і ніхто не повторював роль підряд.
 * Генеруємо один повний цикл де кожен по одному разу пояснює кожному іншому
 * в порядку що чергує ролі:
 *
 * Pattern for [A,B,C]:
 *   A→B, B→C, C→A, A→C, C→B, B→A  (кожен 2 рази пояснює, 2 рази відгадує, 2 рази суддя)
 */
function buildSoloSchedule(players) {
  const n = players.length;
  const schedule = [];

  // Генеруємо так щоб жоден гравець не мав однакову роль 2 рази підряд.
  // Підхід: для кожного раунду r обираємо пару (exp, gss) методом зсуву.
  // Exp = players[r % n], Gss = players[(r + 1 + Math.floor(r/n)) % n] — але це складно.
  //
  // Простіший підхід що гарантує рівномірність:
  // Один цикл = n*(n-1) пар. Упорядковуємо їх так:
  // Беремо всі пари і сортуємо щоб exp[i] != exp[i-1] і exp[i] != gss[i-1]

  // Спочатку генеруємо всі пари
  const allPairs = [];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (i !== j) allPairs.push({ explainer: players[i], guesser: players[j] });

  // Перемішуємо з обмеженням: ніхто не може мати ту саму роль 2 рази підряд
  const ordered = [];
  const remaining = [...allPairs];
  let lastExplainer = "";
  let lastGuesser   = "";

  while (remaining.length > 0) {
    // Шукаємо пару де explainer != lastExplainer і guesser != lastGuesser
    const idx = remaining.findIndex(p =>
      p.explainer !== lastExplainer && p.guesser !== lastGuesser
    );
    if (idx === -1) {
      // Якщо не знайшли ідеальну — relaxed: просто не той самий explainer
      const idx2 = remaining.findIndex(p => p.explainer !== lastExplainer);
      const pick = idx2 === -1 ? 0 : idx2;
      const [p] = remaining.splice(pick, 1);
      ordered.push(p);
      lastExplainer = p.explainer;
      lastGuesser   = p.guesser;
    } else {
      const [p] = remaining.splice(idx, 1);
      ordered.push(p);
      lastExplainer = p.explainer;
      lastGuesser   = p.guesser;
    }
  }

  return ordered; // зациклюємо через cursor % length
}

/**
 * Командний: ведучий всередині команди щораунду наступний.
 * Команди чергуються по колу.
 */
function buildTeamSchedule(grouped, totalRounds) {
  const teamNames  = Object.keys(grouped);
  const expIdx     = Object.fromEntries(teamNames.map(t => [t, 0]));
  const rounds     = [];

  for (let r = 0; r < totalRounds; r++) {
    const team     = teamNames[r % teamNames.length];
    const members  = grouped[team];
    const explainer = members[expIdx[team] % members.length];
    expIdx[team]++;
    const guessers  = members.filter(m => m !== explainer);
    rounds.push({ team, explainer, guessers });
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
  const total  = game.schedule.length;
  const cursor = game.cursor || 0;

  if (cfg.mode === "solo") {
    const cycleLen = game.schedule.length;
    const cycle    = Math.floor(cursor / cycleLen) + 1;
    const pos      = (cursor % cycleLen) + 1;
    $("brief-round-label").textContent = `Цикл ${cycle}, пара ${pos}/${cycleLen}`;
    $("brief-explainer").textContent = round.explainer;
    $("brief-guesser").textContent   = round.guesser;
  } else {
    $("brief-round-label").textContent = `Раунд ${cursor + 1}/${total}`;
    $("brief-explainer").textContent   = `${round.explainer}`;
    $("brief-guesser").textContent     = round.guessers?.join(", ") || "—";
  }

  const role = getMyRole(round, cfg.mode);
  const roleLabel = { explainer: "Ти пояснюєш", guesser: "Ти відгадуєш", observer: "Ти суддя / відпочиваєш" };
  const roleChip  = { explainer: "chip-explain", guesser: "chip-guess",   observer: "chip-watch" };
  $("brief-my-role").innerHTML =
    `<span class="role-chip ${roleChip[role]}">${roleLabel[role]}</span>`;

  renderScores(game.scores, "brief-scores", cfg.scoreLimit);

  $("brief-host-btn-wrap").style.display = isHost ? "block" : "none";
  $("brief-guest-wait").style.display    = isHost ? "none"  : "block";
}

$("brief-start-btn").onclick = () =>
  update(ref(db, `rooms/${currentRoom}/config`), { status: "playing" });

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

  // Заголовок
  if (cfg.mode === "solo") {
    $("round-label").textContent = `${round.explainer} → ${round.guesser}`;
  } else {
    $("round-label").textContent =
      `Раунд ${cursor + 1}/${game.schedule.length} · ${round.team}`;
  }

  // Таймер
  const timeLeft = game.timer ?? cfg.roundTime;
  $("timer").textContent = timeLeft;
  const pct = timeLeft / cfg.roundTime * 100;
  $("timer-bar").style.width = pct + "%";
  $("timer-bar").className = "timer-bar" +
    (pct > 40 ? "" : pct > 20 ? " warn" : " danger");

  // Ролі
  $("view-explainer").style.display = role === "explainer" ? "block" : "none";
  $("view-guesser").style.display   = role === "guesser"   ? "block" : "none";
  $("view-observer").style.display  = role === "observer"  ? "block" : "none";

  if (role === "explainer") {
    $("word-display").textContent       = data.wordPool[game.wordIdx] || "—";
    $("controls-active").style.display  = "flex";
    $("last-word-zone").style.display   = "none";
  }
  if (role === "observer") {
    if (cfg.mode === "solo") {
      $("observer-chip").textContent = "Ти суддя";
      $("observer-msg").textContent  =
        `${round.explainer} пояснює → ${round.guesser} відгадує`;
    } else {
      $("observer-chip").textContent = "Ти відпочиваєш";
      $("observer-msg").textContent  = `Грає команда ${round.team}`;
    }
  }

  $("stat-correct").textContent = game.roundCorrect || 0;
  $("stat-skip").textContent    = game.roundSkip    || 0;
  renderLog(game.roundLog || []);
  renderScores(game.scores, "round-scores", cfg.scoreLimit);

  // Хост запускає таймер
  if (isHost && !timerHandle) startHostTimer(cfg.roundTime);
}

// ─── Таймер (тільки хост) ─────────────────────────────────────────────────────
function startHostTimer(roundTime) {
  stopTimer();
  timerHandle = setInterval(async () => {
    const cfgSnap = await get(ref(db, `rooms/${currentRoom}/config`));
    const cfg = cfgSnap.val();
    if (!cfg || cfg.status !== "playing") { stopTimer(); return; }

    const gSnap = await get(ref(db, `rooms/${currentRoom}/game`));
    const game  = gSnap.val();
    if (!game) { stopTimer(); return; }

    if (game.timer <= 1) {
      stopTimer();
      await update(ref(db, `rooms/${currentRoom}/game`),   { timer: 0 });
      await update(ref(db, `rooms/${currentRoom}/config`), { status: "lastword" });
    } else {
      await update(ref(db, `rooms/${currentRoom}/game`), { timer: game.timer - 1 });
    }
  }, 1000);
}

function stopTimer() {
  if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
}

// ─── Кнопки ведучого ─────────────────────────────────────────────────────────
$("correct-btn").onclick      = () => doScore(true);
$("skip-btn").onclick         = () => doScore(false);
$("last-correct-btn").onclick = () => doLastWord(true);
$("last-no-btn").onclick      = () => doLastWord(false);
$("lw-yes-btn").onclick       = () => doLastWord(true);
$("lw-no-btn").onclick        = () => doLastWord(false);

async function doScore(correct) {
  const snap = await get(ref(db, `rooms/${currentRoom}`));
  const data = snap.val();
  const cfg  = data.config;
  const game = data.game;
  const round = getRound(game, cfg.mode);
  const word  = data.wordPool[game.wordIdx];

  const scores = applyScore({ ...game.scores }, correct, round, cfg.mode);
  const log    = [...(game.roundLog || []), { word, result: correct ? "correct" : "skip" }];

  const roundCorrect = (game.roundCorrect || 0) + (correct ? 1 : 0);
  const roundSkip    = (game.roundSkip    || 0) + (correct ? 0 : 1);
  const nextWordIdx  = (game.wordIdx + 1) % data.wordPool.length;

  // Перевірка ліміту балів
  if (checkScoreLimit(scores, cfg.scoreLimit)) {
    await update(ref(db, `rooms/${currentRoom}/game`),
      { scores, roundLog: log, roundCorrect, roundSkip });
    await endGame();
    return;
  }

  await update(ref(db, `rooms/${currentRoom}/game`), {
    scores, roundLog: log, roundCorrect, roundSkip, wordIdx: nextWordIdx
  });
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

  $("lw-view-explainer").style.display = role === "explainer" ? "block" : "none";
  $("lw-view-other").style.display     = role !== "explainer" ? "block" : "none";

  if (role === "explainer") {
    $("lw-word").textContent = data.wordPool[game.wordIdx] || "—";
  } else {
    renderScores(game.scores, "lw-scores", cfg.scoreLimit);
  }
}

async function doLastWord(correct) {
  if (correct) {
    const snap = await get(ref(db, `rooms/${currentRoom}`));
    const data = snap.val();
    const cfg  = data.config;
    const game = data.game;
    const round = getRound(game, cfg.mode);
    const word  = data.wordPool[game.wordIdx];

    const scores = applyScore({ ...game.scores }, true, round, cfg.mode);
    const log    = [...(game.roundLog || []), { word, result: "correct" }];
    const roundCorrect = (game.roundCorrect || 0) + 1;

    await update(ref(db, `rooms/${currentRoom}/game`),
      { scores, roundLog: log, roundCorrect });

    if (checkScoreLimit(scores, cfg.scoreLimit)) {
      await endGame(); return;
    }
  }
  await finishRound();
}

// ══════════════════════════════════════════════════════════════════════════════
// ЗАВЕРШЕННЯ РАУНДУ / ГРИ
// ══════════════════════════════════════════════════════════════════════════════
async function finishRound() {
  const snap = await get(ref(db, `rooms/${currentRoom}`));
  const data = snap.val();
  const cfg  = data.config;
  const game = data.game;

  // Перевірка ліміту раундів (командний)
  if (cfg.mode === "team") {
    const isLastRound = (game.cursor || 0) >= game.schedule.length - 1;
    if (isLastRound) { await endGame(); return; }
  }

  // Скидаємо стан раунду
  await update(ref(db, `rooms/${currentRoom}/game`), {
    roundCorrect: 0,
    roundSkip:    0,
    roundLog:     [],
    timer:        cfg.roundTime,
  });
  await update(ref(db, `rooms/${currentRoom}/config`), { status: "result" });
}

async function endGame() {
  stopTimer();
  await update(ref(db, `rooms/${currentRoom}/config`), { status: "final" });
}

// ══════════════════════════════════════════════════════════════════════════════
// РЕЗУЛЬТАТ РАУНДУ
// ══════════════════════════════════════════════════════════════════════════════
function renderResult(data) {
  showScreen("screen-result");
  stopTimer();

  const cfg    = data.config;
  const game   = data.game;
  const isHost = cfg.host === myName;
  const round  = getRound(game, cfg.mode);

  let detail = `<div class="result-pair">`;
  if (cfg.mode === "solo") {
    detail += `<span>${round.explainer} пояснював</span><span>→</span><span>${round.guesser} відгадував</span>`;
  } else {
    detail += `<span>Команда <b>${round.team}</b></span><span></span><span></span>`;
  }
  detail += `</div>
    <div class="result-stats-row">
      <span class="res-correct">✅ ${game.roundCorrect || 0} вгадано</span>
      <span class="res-skip">❌ ${game.roundSkip || 0} пропуск</span>
    </div>`;

  $("result-detail").innerHTML = detail;
  renderScores(game.scores, "result-scores", cfg.scoreLimit);

  $("result-host-btn").style.display  = isHost ? "block" : "none";
  $("result-guest-wait").style.display = isHost ? "none"  : "block";
}

$("next-round-btn").onclick = async () => {
  const snap = await get(ref(db, `rooms/${currentRoom}/game`));
  const game = snap.val();
  await update(ref(db, `rooms/${currentRoom}/game`), {
    cursor: (game.cursor || 0) + 1
  });
  await update(ref(db, `rooms/${currentRoom}/config`), { status: "briefing" });
};

// ══════════════════════════════════════════════════════════════════════════════
// ФІНАЛ
// ══════════════════════════════════════════════════════════════════════════════
function renderFinal(data) {
  showScreen("screen-final");
  stopTimer();

  const game   = data.game;
  const scores = game.scores || {};
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const winner = sorted[0];

  $("final-winner").textContent       = winner ? winner[0] : "—";
  $("final-winner-score").textContent = winner ? `${winner[1]} балів` : "";
  renderScores(scores, "final-scores", data.config?.scoreLimit);
}

$("play-again-btn").onclick = async () => {
  await update(ref(db, `rooms/${currentRoom}/config`), { status: "lobby" });
  await remove(ref(db, `rooms/${currentRoom}/game`));
};

$("leave-final-btn").onclick = () => leaveRoom();

// ══════════════════════════════════════════════════════════════════════════════
// ВИХІД
// ══════════════════════════════════════════════════════════════════════════════
$("leave-lobby-btn").onclick = leaveRoom;
$("leave-game-btn").onclick  = leaveRoom;

async function leaveRoom() {
  stopTimer();
  if (roomUnsub) { roomUnsub(); roomUnsub = null; }
  if (!currentRoom || !myName) { goHome(); return; }

  await remove(ref(db, `rooms/${currentRoom}/players/${myName}`));

  const pSnap = await get(ref(db, `rooms/${currentRoom}/players`));
  const remaining = Object.keys(pSnap.val() || {});

  if (remaining.length === 0) {
    // Останній — видаляємо кімнату повністю
    await remove(ref(db, `rooms/${currentRoom}`));
    await remove(ref(db, `lobby/${currentRoom}`));
  } else {
    // Передаємо хост якщо потрібно
    const cfgSnap = await get(ref(db, `rooms/${currentRoom}/config`));
    const cfg = cfgSnap.val();
    if (cfg?.host === myName) {
      await update(ref(db, `rooms/${currentRoom}/config`), { host: remaining[0] });
    }
    await update(ref(db, `lobby/${currentRoom}`), { players: remaining.length });
  }

  goHome();
}

function goHome() {
  stopTimer();
  if (roomUnsub) { roomUnsub(); roomUnsub = null; }
  myName      = "";
  currentRoom = "";
  showScreen("screen-home");
}

// ══════════════════════════════════════════════════════════════════════════════
// УТИЛІТИ
// ══════════════════════════════════════════════════════════════════════════════
function getRound(game, mode) {
  const cursor = game.cursor || 0;
  if (mode === "solo") {
    return game.schedule[cursor % game.schedule.length];
  }
  return game.schedule[Math.min(cursor, game.schedule.length - 1)];
}

function getMyRole(round, mode) {
  if (round.explainer === myName) return "explainer";
  if (mode === "solo") {
    return round.guesser === myName ? "guesser" : "observer";
  }
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
    // Пропуск: -1 тільки ведучому/команді
    if (mode === "solo") {
      scores[round.explainer] = (scores[round.explainer] || 0) - 1;
    } else {
      scores[round.team] = (scores[round.team] || 0) - 1;
    }
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
    const pct     = scoreLimit ? Math.min(score / scoreLimit * 100, 100) : 0;
    const isLeader = i === 0 && score > 0;
    return `
      <div class="score-row${isLeader ? " score-leader" : ""}">
        <span class="score-name">
          ${name}${name === myName ? ` <em>(ти)</em>` : ""}
        </span>
        <div class="score-right">
          ${scoreLimit ? `
            <div class="score-bar-wrap">
              <div class="score-bar" style="width:${pct}%"></div>
            </div>` : ""}
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