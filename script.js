import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase, ref, set, get, update, onValue, runTransaction, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ══════════════════════════════════════════════
// КОНФІГ FIREBASE (твій існуючий)
// ══════════════════════════════════════════════
const firebaseConfig = {
  apiKey: "AIzaSyBJxZvcpgKbPGbEtT4c181n2pMGIIZTS-c",
  authDomain: "alias-d54a8.firebaseapp.com",
  databaseURL: "https://alias-d54a8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "alias-d54a8",
  storageBucket: "alias-d54a8.firebasestorage.app",
  messagingSenderId: "321422256553",
  appId: "1:321422256753:web:791ceb19b423e5584dbcb8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ══════════════════════════════════════════════
// СЛОВА
// ══════════════════════════════════════════════
const WORDS = [
  "Алгоритм","Масив","Цикл","Синтаксис","Баг","Деплой","Об'єкт","Стек","Процесор",
  "Відладка","Компілятор","Інтерфейс","База даних","Фреймворк","Слон","Хмара",
  "Парасолька","Бібліотека","Піраміда","Авокадо","Телескоп","Маяк","Вулкан",
  "Жирафа","Компас","Термометр","Акваріум","Балкон","Вітряк","Кактус","Дельфін",
  "Єнот","Крокодил","Лимон","Молоток","Ракета","Фламінго","Якір","Бурштин",
  "Ескалатор","Підводний човен","Самовар","Тюлень","Хокей","Цунамі"
];

function shuffleWords() {
  return [...WORDS].sort(() => Math.random() - 0.5);
}

// ══════════════════════════════════════════════
// СТАН КЛІЄНТА
// ══════════════════════════════════════════════
let myName = "";
let currentRoom = "";
let unsubRoom = null;
let timerInterval = null;
let challengeInterval = null;

// ══════════════════════════════════════════════
// УТИЛІТИ: ЕКРАНИ
// ══════════════════════════════════════════════
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function el(id) { return document.getElementById(id); }

// ══════════════════════════════════════════════
// ГЕНЕРАЦІЯ РОЗКЛАДУ
// ══════════════════════════════════════════════

// Режим ОСОБИСТИЙ: всі пари (A→B, A→C, B→A, ...)
function buildSoloSchedule(players) {
  const schedule = [];
  for (let i = 0; i < players.length; i++) {
    for (let j = 0; j < players.length; j++) {
      if (i !== j) schedule.push({ explainer: players[i], guesser: players[j], type: "solo" });
    }
  }
  return schedule;
}

// Режим КОМАНДНИЙ: команди по черзі, ведучий в команді змінюється
function buildTeamSchedule(teams, totalRounds) {
  // teams = { "Команда А": ["Оля","Льоша"], "Команда Б": ["Марко","Настя"] }
  const teamNames = Object.keys(teams);
  const schedule = [];
  const explainerIdx = {}; // поточний індекс ведучого для кожної команди
  teamNames.forEach(t => explainerIdx[t] = 0);

  for (let r = 0; r < totalRounds; r++) {
    const teamIdx = r % teamNames.length;
    const team = teamNames[teamIdx];
    const members = teams[team];
    const explainer = members[explainerIdx[team] % members.length];
    explainerIdx[team]++;
    schedule.push({ team, explainer, type: "team" });
  }
  return schedule;
}

// ══════════════════════════════════════════════
// ЕКРАН ВХОДУ
// ══════════════════════════════════════════════

// Список кімнат у лобі
onValue(ref(db, "lobby"), snap => {
  const rooms = snap.val();
  const listEl = el("rooms-list");
  if (!rooms) { listEl.innerHTML = `<span class="muted">Немає активних кімнат</span>`; return; }
  listEl.innerHTML = Object.keys(rooms).map(id =>
    `<div class="room-item" onclick="document.getElementById('room-id').value='${id}'">
      <span>🏠 ${id}</span>
      <span class="online-dot">online</span>
    </div>`
  ).join("");
});

el("join-btn").onclick = async () => {
  const nick = el("username").value.trim();
  const room = el("room-id").value.trim();
  if (!nick || !room) { alert("Введи нік і назву кімнати"); return; }

  myName = nick;
  currentRoom = room;

  // Додаємо гравця і кімнату до lobby
  await update(ref(db, `lobby/${room}`), { status: "waiting" });
  await update(ref(db, `rooms/${room}/players`), { [myName]: true });

  // Якщо кімната не існує — хост
  const snap = await get(ref(db, `rooms/${room}/config`));
  if (!snap.exists()) {
    await set(ref(db, `rooms/${room}/config`), {
      host: myName,
      mode: "solo",
      roundTime: 60,
      totalRounds: 6,
      status: "lobby",
      teams: {}
    });
  }

  showScreen("screen-lobby");
  listenLobby();
};

// ══════════════════════════════════════════════
// ЛОБІ
// ══════════════════════════════════════════════
function listenLobby() {
  if (unsubRoom) unsubRoom();
  unsubRoom = onValue(ref(db, `rooms/${currentRoom}`), snap => {
    const data = snap.val();
    if (!data) return;
    const cfg = data.config || {};
    const players = Object.keys(data.players || {});
    const isHost = cfg.host === myName;

    // Якщо гра вже стартувала — перейти на потрібний екран
    if (cfg.status === "briefing") { renderBriefing(data); return; }
    if (cfg.status === "playing")  { renderRound(data); return; }
    if (cfg.status === "result")   { renderResult(data); return; }
    if (cfg.status === "final")    { renderFinal(data); return; }

    // Рендер лобі
    showScreen("screen-lobby");
    el("lobby-room-name").textContent = `Кімната: ${currentRoom}`;

    el("lobby-players").innerHTML = players.map(p =>
      `<div class="player-row">
        <span>${p}${p === cfg.host ? " 👑" : ""}${p === myName ? " (ти)" : ""}</span>
       </div>`
    ).join("");

    if (isHost) {
      el("host-settings").style.display = "block";
      el("guest-waiting").style.display = "none";

      const mode = cfg.mode || "solo";
      el("game-mode").value = mode;
      el("round-time").value = cfg.roundTime || 60;
      el("round-count").value = cfg.totalRounds || 6;

      // Командний режим — розподіл по командах
      if (mode === "team") {
        el("team-settings").style.display = "block";
        renderTeamAssignment(players, cfg.teams || {});
      } else {
        el("team-settings").style.display = "none";
      }
    } else {
      el("host-settings").style.display = "none";
      el("guest-waiting").style.display = "block";
    }
  });
}

// Зміна режиму хостом
el("game-mode").onchange = () => {
  const mode = el("game-mode").value;
  update(ref(db, `rooms/${currentRoom}/config`), { mode });
};

function renderTeamAssignment(players, currentTeams) {
  // currentTeams = { playerName: "Команда А" }
  const wrap = el("team-assignment");
  wrap.innerHTML = players.map(p => `
    <div class="team-row-assign">
      <span>${p}</span>
      <input type="text" class="team-input" data-player="${p}"
        placeholder="Команда" value="${currentTeams[p] || ""}"
        style="width:120px;padding:6px">
    </div>
  `).join("");

  wrap.querySelectorAll(".team-input").forEach(inp => {
    inp.onchange = () => {
      update(ref(db, `rooms/${currentRoom}/config/teams`), { [inp.dataset.player]: inp.value.trim() });
    };
  });
}

el("start-btn").onclick = async () => {
  const snap = await get(ref(db, `rooms/${currentRoom}`));
  const data = snap.val();
  const cfg = data.config;
  const players = Object.keys(data.players || {});

  if (players.length < 3) { alert("Потрібно мінімум 3 гравці"); return; }

  const mode = el("game-mode").value;
  const roundTime = parseInt(el("round-time").value) || 60;
  const totalRounds = parseInt(el("round-count").value) || 6;

  let schedule;
  if (mode === "solo") {
    schedule = buildSoloSchedule(players);
  } else {
    // Групуємо гравців по командах
    const teams = cfg.teams || {};
    const grouped = {};
    players.forEach(p => {
      const team = teams[p] || "Команда А";
      if (!grouped[team]) grouped[team] = [];
      grouped[team].push(p);
    });
    if (Object.keys(grouped).length < 2) { alert("Потрібно мінімум 2 команди"); return; }
    schedule = buildTeamSchedule(grouped, totalRounds);
  }

  // Ініціальний рахунок
  const scores = {};
  if (mode === "solo") {
    players.forEach(p => scores[p] = 0);
  } else {
    const teams = cfg.teams || {};
    players.forEach(p => {
      const team = teams[p] || "Команда А";
      if (scores[team] === undefined) scores[team] = 0;
    });
  }

  await update(ref(db, `rooms/${currentRoom}/config`), { mode, roundTime, totalRounds, status: "briefing" });
  await set(ref(db, `rooms/${currentRoom}/game`), {
    schedule,
    currentRoundIdx: 0,
    scores,
    wordPool: shuffleWords(),
    wordIdx: 0,
    roundCorrect: 0,
    roundSkip: 0,
    roundLog: [],
    timer: roundTime,
  });
};

// ══════════════════════════════════════════════
// БРИФІНГ
// ══════════════════════════════════════════════
function listenGame() {
  if (unsubRoom) unsubRoom();
  unsubRoom = onValue(ref(db, `rooms/${currentRoom}`), snap => {
    const data = snap.val();
    if (!data) return;
    const status = data.config?.status;
    if (status === "briefing") renderBriefing(data);
    else if (status === "playing") renderRound(data);
    else if (status === "result") renderResult(data);
    else if (status === "final") renderFinal(data);
    else if (status === "lobby") { listenLobby(); }
  });
}

function renderBriefing(data) {
  showScreen("screen-briefing");
  stopTimers();

  const cfg = data.config;
  const game = data.game;
  const round = game.schedule[game.currentRoundIdx];
  const totalRounds = game.schedule.length;
  const roundNum = game.currentRoundIdx + 1;

  el("brief-round-label").textContent = `Раунд ${roundNum} / ${totalRounds}`;

  if (round.type === "solo") {
    el("brief-explainer").textContent = round.explainer;
    el("brief-guesser").textContent = round.guesser;
  } else {
    el("brief-explainer").textContent = `${round.explainer} (${round.team})`;
    el("brief-guesser").textContent = `Команда ${round.team}`;
  }

  // Моя роль
  let myRole = "observer";
  if (round.type === "solo") {
    if (round.explainer === myName) myRole = "explainer";
    else if (round.guesser === myName) myRole = "guesser";
  } else {
    if (round.explainer === myName) myRole = "explainer";
    else if (Object.keys(data.players || {}).includes(myName)) myRole = "guesser";
  }

  const roleText = { explainer: "Ти пояснюєш цей раунд", guesser: "Ти відгадуєш", observer: "Ти спостерігаєш" };
  const roleClass = { explainer: "chip-explain", guesser: "chip-guess", observer: "chip-watch" };
  el("brief-my-role").innerHTML = `<span class="role-chip ${roleClass[myRole]}">${roleText[myRole]}</span>`;

  renderScores(game.scores, cfg.mode, "brief-scores");

  const isHost = cfg.host === myName;
  el("brief-host-btn-wrap").style.display = isHost ? "block" : "none";
  el("brief-guest-wait").style.display = isHost ? "none" : "block";
}

el("brief-start-btn").onclick = () => {
  update(ref(db, `rooms/${currentRoom}/config`), { status: "playing" });
  // Стартуємо таймер (тільки хост декрементує)
  startHostTimer();
};

// ══════════════════════════════════════════════
// РАУНД
// ══════════════════════════════════════════════
function renderRound(data) {
  showScreen("screen-round");

  const cfg = data.config;
  const game = data.game;
  const round = game.schedule[game.currentRoundIdx];
  const totalRounds = game.schedule.length;

  el("round-label").textContent = `Раунд ${game.currentRoundIdx + 1}/${totalRounds}`;
  el("stat-correct").textContent = game.roundCorrect || 0;
  el("stat-skip").textContent = game.roundSkip || 0;

  // Таймер
  const timeLeft = game.timer ?? cfg.roundTime;
  el("timer").textContent = timeLeft;
  const pct = (timeLeft / cfg.roundTime) * 100;
  el("timer-bar").style.width = pct + "%";
  el("timer-bar").className = "timer-bar" + (pct > 40 ? "" : pct > 20 ? " warn" : " danger");

  // Ролі
  const isExplainer = round.explainer === myName;
  const isGuesser = round.type === "solo"
    ? round.guesser === myName
    : !isExplainer && Object.keys(data.players || {}).includes(myName);

  el("view-explainer").style.display = isExplainer ? "block" : "none";
  el("view-guesser").style.display  = (!isExplainer && isGuesser) ? "block" : "none";
  el("view-observer").style.display = (!isExplainer && !isGuesser) ? "block" : "none";

  if (isExplainer) {
    el("word-display").textContent = game.wordPool[game.wordIdx] || "—";
  }

  // Оскарження
  if (game.challengeActive) {
    el("challenge-zone").style.display = "block";
    el("controls").style.display = "none";
    // Суперники можуть вето (не ведучий і не його команда)
    const canVeto = !isExplainer && round.type === "team"
      ? (cfg.teams?.[myName] !== round.team)
      : !isExplainer;
    el("veto-btn").style.display = canVeto ? "block" : "none";
  } else {
    el("challenge-zone").style.display = "none";
    el("controls").style.display = isExplainer ? "block" : "none";
  }

  // Лог
  renderRoundLog(game.roundLog || []);

  // Хост запускає таймер
  if (cfg.host === myName && !timerInterval) {
    startHostTimer();
  }
}

function startHostTimer() {
  stopTimers();
  timerInterval = setInterval(async () => {
    const snap = await get(ref(db, `rooms/${currentRoom}/game`));
    const game = snap.val();
    if (!game) return;

    const cfgSnap = await get(ref(db, `rooms/${currentRoom}/config`));
    const cfg = cfgSnap.val();
    if (cfg?.status !== "playing") { stopTimers(); return; }

    if (game.timer <= 1) {
      stopTimers();
      endRound();
    } else {
      update(ref(db, `rooms/${currentRoom}/game`), { timer: game.timer - 1 });
    }
  }, 1000);
}

function stopTimers() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  if (challengeInterval) { clearInterval(challengeInterval); challengeInterval = null; }
}

// Кнопка "Вгадали"
el("correct-btn").onclick = async () => {
  const snap = await get(ref(db, `rooms/${currentRoom}/game`));
  const game = snap.val();
  const cfgSnap = await get(ref(db, `rooms/${currentRoom}/config`));
  const cfg = cfgSnap.val();
  const round = game.schedule[game.currentRoundIdx];
  const word = game.wordPool[game.wordIdx];

  // Ставимо challenge — 5 сек вікно для оскарження
  const challengeLog = [...(game.roundLog || []), { word, result: "correct" }];

  await update(ref(db, `rooms/${currentRoom}/game`), {
    challengeActive: true,
    challengeWord: word,
    challengeCountdown: 5,
    roundLog: challengeLog,
  });
  await update(ref(db, `rooms/${currentRoom}/config`), { status: "playing" }); // тригер re-render

  // Відлік оскарження (тільки на клієнті ведучого)
  let countdown = 5;
  challengeInterval = setInterval(async () => {
    countdown--;
    el("challenge-countdown") && (el("challenge-countdown").textContent = countdown);
    if (countdown <= 0) {
      clearInterval(challengeInterval);
      challengeInterval = null;
      await confirmCorrect(game, cfg, round, word);
    }
  }, 1000);
};

async function confirmCorrect(game, cfg, round, word) {
  // Перевіряємо чи не було вето
  const snap = await get(ref(db, `rooms/${currentRoom}/game`));
  const g = snap.val();
  if (g.vetoed) {
    // Бал не зараховується
    await update(ref(db, `rooms/${currentRoom}/game`), {
      challengeActive: false,
      vetoed: false,
      wordIdx: (game.wordIdx + 1) % game.wordPool.length,
    });
    return;
  }

  // Зараховуємо бал
  const newScores = { ...g.scores };
  if (round.type === "solo") {
    newScores[round.explainer] = (newScores[round.explainer] || 0) + 1;
    newScores[round.guesser]   = (newScores[round.guesser]   || 0) + 1;
  } else {
    newScores[round.team] = (newScores[round.team] || 0) + 1;
  }

  await update(ref(db, `rooms/${currentRoom}/game`), {
    scores: newScores,
    roundCorrect: (g.roundCorrect || 0) + 1,
    challengeActive: false,
    wordIdx: (g.wordIdx + 1) % g.wordPool.length,
  });
}

// Кнопка "Пропустити"
el("skip-btn").onclick = async () => {
  const snap = await get(ref(db, `rooms/${currentRoom}/game`));
  const g = snap.val();
  const cfgSnap = await get(ref(db, `rooms/${currentRoom}/config`));
  const cfg = cfgSnap.val();
  const round = g.schedule[g.currentRoundIdx];
  const word = g.wordPool[g.wordIdx];

  const newScores = { ...g.scores };
  if (round.type === "solo") {
    newScores[round.explainer] = (newScores[round.explainer] || 0) - 1;
  } else {
    newScores[round.team] = (newScores[round.team] || 0) - 1;
  }

  const skipLog = [...(g.roundLog || []), { word, result: "skip" }];

  await update(ref(db, `rooms/${currentRoom}/game`), {
    scores: newScores,
    roundSkip: (g.roundSkip || 0) + 1,
    roundLog: skipLog,
    wordIdx: (g.wordIdx + 1) % g.wordPool.length,
  });
};

// Кнопка "Вето"
el("veto-btn").onclick = async () => {
  await update(ref(db, `rooms/${currentRoom}/game`), { vetoed: true, challengeActive: false });
  if (challengeInterval) { clearInterval(challengeInterval); challengeInterval = null; }
};

function renderRoundLog(log) {
  const logEl = el("round-log");
  if (!log || log.length === 0) { logEl.innerHTML = ""; return; }
  logEl.innerHTML = [...log].reverse().slice(0, 8).map(entry =>
    `<div class="log-item ${entry.result === "correct" ? "log-plus" : "log-minus"}">
      ${entry.result === "correct" ? "+1" : "−1"} ${entry.word}
    </div>`
  ).join("");
}

// ══════════════════════════════════════════════
// КІНЕЦЬ РАУНДУ
// ══════════════════════════════════════════════
async function endRound() {
  const snap = await get(ref(db, `rooms/${currentRoom}/game`));
  const game = snap.val();
  const cfgSnap = await get(ref(db, `rooms/${currentRoom}/config`));
  const cfg = cfgSnap.val();

  const isLastRound = game.currentRoundIdx >= game.schedule.length - 1;

  await update(ref(db, `rooms/${currentRoom}/config`), {
    status: isLastRound ? "final" : "result"
  });

  if (!isLastRound) {
    // Скидаємо стан раунду, але зберігаємо рахунок
    await update(ref(db, `rooms/${currentRoom}/game`), {
      roundCorrect: 0,
      roundSkip: 0,
      roundLog: [],
      timer: cfg.roundTime,
      challengeActive: false,
      vetoed: false,
    });
  }
}

// ══════════════════════════════════════════════
// РЕЗУЛЬТАТ РАУНДУ
// ══════════════════════════════════════════════
function renderResult(data) {
  showScreen("screen-result");
  stopTimers();

  const cfg = data.config;
  const game = data.game;
  const round = game.schedule[game.currentRoundIdx];
  const isLast = game.currentRoundIdx >= game.schedule.length - 1;

  let detail = "";
  if (round.type === "solo") {
    detail = `<div class="result-row"><span>${round.explainer} пояснював</span><span>${round.roundCorrect || 0} вгадано</span></div>`;
    detail += `<div class="result-row"><span>${round.guesser} відгадував</span><span></span></div>`;
  } else {
    detail = `<div class="result-row"><span>${round.team}</span><span>${game.roundCorrect || 0} вгадано / ${game.roundSkip || 0} пропуск</span></div>`;
  }
  el("result-detail").innerHTML = detail;
  renderScores(game.scores, cfg.mode, "result-scores");

  const isHost = cfg.host === myName;
  el("result-host-btn").style.display = isHost ? "block" : "none";
  el("result-guest-wait").style.display = isHost ? "none" : "block";

  el("next-round-btn").textContent = isLast ? "Завершити гру" : "Наступний раунд";
}

el("next-round-btn").onclick = async () => {
  const snap = await get(ref(db, `rooms/${currentRoom}/game`));
  const game = snap.val();
  const isLast = game.currentRoundIdx >= game.schedule.length - 1;

  if (isLast) {
    await update(ref(db, `rooms/${currentRoom}/config`), { status: "final" });
  } else {
    await update(ref(db, `rooms/${currentRoom}/game`), {
      currentRoundIdx: game.currentRoundIdx + 1,
    });
    await update(ref(db, `rooms/${currentRoom}/config`), { status: "briefing" });
  }
};

// ══════════════════════════════════════════════
// ФІНАЛ
// ══════════════════════════════════════════════
function renderFinal(data) {
  showScreen("screen-final");
  stopTimers();

  const game = data.game;
  const cfg = data.config;
  const scores = game.scores || {};

  const winner = Object.entries(scores).reduce((a, b) => b[1] > a[1] ? b : a, ["—", -Infinity]);
  el("final-winner").textContent = winner[0];
  el("final-winner-score").textContent = winner[1] + " балів";
  renderScores(scores, cfg.mode, "final-scores");
}

el("play-again-btn").onclick = async () => {
  await update(ref(db, `rooms/${currentRoom}/config`), { status: "lobby" });
  await set(ref(db, `rooms/${currentRoom}/game`), null);
  showScreen("screen-lobby");
  listenLobby();
};

// ══════════════════════════════════════════════
// УТИЛІТА: РАХУНОК
// ══════════════════════════════════════════════
function renderScores(scores, mode, targetId) {
  const el2 = el(targetId);
  if (!scores) { el2.innerHTML = ""; return; }
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  el2.innerHTML = sorted.map(([name, score]) =>
    `<div class="score-row">
      <span>${name}${name === myName && mode === "solo" ? " (ти)" : ""}</span>
      <span class="score-val">${score}</span>
    </div>`
  ).join("");
}

// ══════════════════════════════════════════════
// СТАРТ СЛУХАЧА ПІСЛЯ ВХОДУ
// ══════════════════════════════════════════════
// Після login слухач стартується через listenLobby()
// Після старту гри — через listenGame()
// Підключаємо listenGame після натискання start
const origStartBtn = el("start-btn");
origStartBtn.addEventListener("click", () => {
  setTimeout(() => listenGame(), 500);
}, { once: false });

// Якщо хтось входить у вже активну кімнату — одразу слухати гру
el("join-btn").addEventListener("click", () => {
  setTimeout(async () => {
    const snap = await get(ref(db, `rooms/${currentRoom}/config`));
    const cfg = snap.val();
    if (cfg && cfg.status !== "lobby") listenGame();
  }, 600);
});