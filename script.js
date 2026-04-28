import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase, ref, set, get, update, onValue, remove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ─── Firebase ────────────────────────────────────────────────────────────────
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

// ─── Вбудовані словники ───────────────────────────────────────────────────────
const BUILTIN = {
  "🌍 Загальні": [
    "Слон","Хмара","Парасолька","Бібліотека","Піраміда","Авокадо","Телескоп",
    "Маяк","Вулкан","Жирафа","Компас","Термометр","Акваріум","Балкон","Вітряк",
    "Кактус","Дельфін","Єнот","Крокодил","Лимон","Молоток","Ракета","Фламінго",
    "Якір","Бурштин","Ескалатор","Підводний човен","Самовар","Тюлень","Хокей"
  ],
  "💻 IT": [
    "Алгоритм","Масив","Цикл","Синтаксис","Баг","Деплой","Об'єкт","Стек",
    "Процесор","Відладка","Компілятор","Інтерфейс","База даних","Фреймворк",
    "Рекурсія","Токен","Сервер","Хмарне сховище","Пул потоків","Брандмауер"
  ],
  "🎬 Кіно та серіали": [
    "Режисер","Монтаж","Каскадер","Сценарій","Трейлер","Бюджет","Прем'єра",
    "Актор","Декорації","Грим","Озвучка","Субтитри","Серіал","Спецефекти","Оскар"
  ],
  "🍕 Їжа": [
    "Піца","Суші","Борщ","Пельмені","Лазанья","Круасан","Такос","Карі",
    "Фондю","Паелья","Стейк","Капучино","Макарон","Вафлі","Хумус"
  ],
  "🏅 Спорт": [
    "Штанга","Пенальті","Аутсайдер","Тайм-аут","Офсайд","Спринт","Манеж",
    "Суддя","Трибуна","Допінг","Фехтування","Регбі","Крикет","Більярд","Гольф"
  ]
};

// ─── Стан клієнта ─────────────────────────────────────────────────────────────
let myName       = "";
let currentRoom  = "";
let roomUnsub    = null;   // єдиний Firebase-слухач
let timerHandle  = null;   // setInterval на хості
let customWords  = [];     // слова з JSON/textarea

// ─── DOM shortcuts ────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ─── Екрани ───────────────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
}

// ══════════════════════════════════════════════════════════════════════════════
// СЛОВНИК UI
// ══════════════════════════════════════════════════════════════════════════════
function initDictUI() {
  // Таби
  document.querySelectorAll(".dict-tab").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".dict-tab").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".dict-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      $("dict-" + btn.dataset.tab).classList.add("active");
    };
  });

  // Категорії — чекбокси
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
        if (Array.isArray(parsed)) {
          customWords = parsed.filter(w => typeof w === "string");
        } else if (typeof parsed === "object") {
          customWords = Object.values(parsed).flat().filter(w => typeof w === "string");
        }
        $("json-preview").textContent = `Завантажено ${customWords.length} слів`;
      } catch {
        $("json-preview").textContent = "Помилка: невірний формат JSON";
      }
    };
    reader.readAsText(file);
  };

  // Підказка про умову завершення
  updateEndHint();
  $("game-mode").onchange = () => {
    const isTeam = $("game-mode").value === "team";
    $("team-settings").style.display = isTeam ? "block" : "none";
    $("team-round-row").style.display = isTeam ? "flex" : "none";
    updateEndHint();
  };
  $("score-limit").oninput = updateEndHint;
  $("round-count").oninput = updateEndHint;
}

function updateEndHint() {
  const mode  = $("game-mode").value;
  const score = $("score-limit").value;
  const rnds  = $("round-count").value;
  if (mode === "solo") {
    $("end-hint").textContent = `Особистий: гра до ${score} балів (пари зациклюються)`;
  } else {
    $("end-hint").textContent = `Командний: до ${score} балів або ${rnds} раундів (що швидше)`;
  }
}

function buildWordPool() {
  const activeTab = document.querySelector(".dict-tab.active")?.dataset.tab || "categories";
  let pool = [];

  if (activeTab === "categories") {
    document.querySelectorAll("#categories-grid input:checked").forEach(cb => {
      pool = pool.concat(BUILTIN[cb.value] || []);
    });
  } else if (activeTab === "custom") {
    const raw = $("custom-words").value;
    pool = raw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
  } else if (activeTab === "json") {
    pool = customWords;
  }

  if (pool.length < 5) {
    alert("Замало слів у словнику! Оберіть категорії або додайте слова.");
    return null;
  }
  // Перемішати
  return pool.sort(() => Math.random() - 0.5);
}

// ══════════════════════════════════════════════════════════════════════════════
// ЕКРАН ВХОДУ
// ══════════════════════════════════════════════════════════════════════════════
onValue(ref(db, "lobby"), snap => {
  const rooms = snap.val();
  const el    = $("rooms-list");
  if (!rooms) { el.innerHTML = `<span class="muted">Немає активних кімнат</span>`; return; }
  el.innerHTML = Object.entries(rooms)
    .map(([id, info]) => `
      <div class="room-item" onclick="document.getElementById('room-id').value='${id}'">
        <span>🏠 ${id}</span>
        <span class="online-dot">${info.players || 0} гравців</span>
      </div>`)
    .join("");
});

$("join-btn").onclick = async () => {
  const nick = $("username").value.trim();
  const room = $("room-id").value.trim();
  if (!nick) { alert("Введи нік"); return; }
  if (!room) { alert("Введи назву кімнати"); return; }

  myName      = nick;
  currentRoom = room;

  // Додаємо гравця
  await update(ref(db, `rooms/${room}/players`), { [myName]: true });

  // Якщо кімната нова — ми хост
  const cfgSnap = await get(ref(db, `rooms/${room}/config`));
  if (!cfgSnap.exists()) {
    await set(ref(db, `rooms/${room}/config`), {
      host:       myName,
      status:     "lobby",
      mode:       "solo",
      roundTime:  60,
      scoreLimit: 30,
      totalRounds: 10,
      teams:      {}
    });
  }

  // Оновлюємо лічильник у лобі
  const pSnap = await get(ref(db, `rooms/${room}/players`));
  await update(ref(db, `lobby/${room}`), { players: Object.keys(pSnap.val() || {}).length });

  showScreen("screen-lobby");
  subscribeRoom();
};

// ══════════════════════════════════════════════════════════════════════════════
// ЄДИНИЙ ПІДПИСНИК (центр управління)
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

  $("lobby-room-name").textContent = `Кімната: ${currentRoom}`;

  $("lobby-players").innerHTML = players.map(p =>
    `<div class="player-row">
       <span>${p}${p === cfg.host ? " 👑" : ""}${p === myName ? " <em>(ти)</em>" : ""}</span>
     </div>`
  ).join("");

  if (isHost) {
    $("host-settings").style.display = "block";
    $("guest-waiting").style.display = "none";
    initDictUI();

    const mode = cfg.mode || "solo";
    $("game-mode").value    = mode;
    $("round-time").value   = cfg.roundTime  || 60;
    $("score-limit").value  = cfg.scoreLimit || 30;
    $("round-count").value  = cfg.totalRounds || 10;

    $("team-settings").style.display  = mode === "team" ? "block" : "none";
    $("team-round-row").style.display = mode === "team" ? "flex"  : "none";
    if (mode === "team") renderTeamAssignment(players, cfg.teams || {});
    updateEndHint();
  } else {
    $("host-settings").style.display = "none";
    $("guest-waiting").style.display = "block";
    const mode = cfg.mode === "team" ? "Командний" : "Особистий";
    $("guest-config-preview").textContent =
      `${mode} · ${cfg.roundTime || 60}с · ліміт ${cfg.scoreLimit || 30} балів`;
  }
}

function renderTeamAssignment(players, currentTeams) {
  $("team-assignment").innerHTML = players.map(p => `
    <div class="team-row-assign">
      <span>${p}${p === myName ? " (ти)" : ""}</span>
      <input class="team-input" type="text" data-player="${p}"
        placeholder="Команда" value="${currentTeams[p] || ""}" maxlength="20">
    </div>`
  ).join("");

  $("team-assignment").querySelectorAll(".team-input").forEach(inp => {
    inp.onchange = () =>
      update(ref(db, `rooms/${currentRoom}/config/teams`),
             { [inp.dataset.player]: inp.value.trim() });
  });
}

// Старт гри
$("start-btn").onclick = async () => {
  const snapAll = await get(ref(db, `rooms/${currentRoom}`));
  const data    = snapAll.val();
  const players = Object.keys(data.players || {});
  const cfg     = data.config || {};
  const mode    = $("game-mode").value;

  if (players.length < 3) { alert("Потрібно мінімум 3 гравці"); return; }

  const wordPool = buildWordPool();
  if (!wordPool) return;

  const roundTime   = parseInt($("round-time").value)  || 60;
  const scoreLimit  = parseInt($("score-limit").value) || 30;
  const totalRounds = parseInt($("round-count").value) || 10;

  // Формуємо розклад
  let schedule, scores;

  if (mode === "solo") {
    schedule = buildSoloPairs(players);  // нескінченно зациклюємо — зберігаємо лише перший цикл, потом крутимо за модулем
    scores   = Object.fromEntries(players.map(p => [p, 0]));
  } else {
    const teams = cfg.teams || {};
    // Групуємо: { "Команда А": ["Оля","Льоша"], ... }
    const grouped = {};
    players.forEach(p => {
      const t = teams[p] || "Команда А";
      if (!grouped[t]) grouped[t] = [];
      grouped[t].push(p);
    });
    if (Object.keys(grouped).length < 2) { alert("Потрібно мінімум 2 команди"); return; }
    schedule = buildTeamRounds(grouped, totalRounds);
    scores   = Object.fromEntries(Object.keys(grouped).map(t => [t, 0]));
  }

  // Зберігаємо конфіг і стан гри
  await update(ref(db, `rooms/${currentRoom}/config`), {
    mode, roundTime, scoreLimit, totalRounds, status: "briefing"
  });
  await set(ref(db, `rooms/${currentRoom}/game`), {
    schedule,
    pairCursor:   0,   // для solo: індекс у schedule (циклічно)
    roundCursor:  0,   // для team: номер раунду
    wordPool,
    wordIdx:      0,
    scores,
    roundCorrect: 0,
    roundSkip:    0,
    roundLog:     [],
    timer:        roundTime,
  });
};

// ─── Генератори розкладу ──────────────────────────────────────────────────────

// Solo: всі впорядковані пари (A→B, A→C, B→A, ...) — один цикл, далі крутимо % length
function buildSoloPairs(players) {
  const pairs = [];
  for (let i = 0; i < players.length; i++)
    for (let j = 0; j < players.length; j++)
      if (i !== j) pairs.push({ explainer: players[i], guesser: players[j] });
  return pairs;
}

// Team: фіксована кількість раундів, команди по черзі, ведучий всередині команди змінюється
function buildTeamRounds(grouped, total) {
  const teamNames  = Object.keys(grouped);
  const explainerI = Object.fromEntries(teamNames.map(t => [t, 0]));
  const rounds     = [];
  for (let r = 0; r < total; r++) {
    const team     = teamNames[r % teamNames.length];
    const members  = grouped[team];
    const explainer = members[explainerI[team] % members.length];
    explainerI[team]++;
    // Відгадувачі — всі інші члени команди
    const guessers  = members.filter(m => m !== explainer);
    rounds.push({ team, explainer, guessers });
  }
  return rounds;
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
  const round  = currentRound(game, cfg.mode);

  // Заголовок
  if (cfg.mode === "solo") {
    const total = game.schedule.length;
    const cycle = Math.floor(game.pairCursor / total) + 1;
    const pos   = (game.pairCursor % total) + 1;
    $("brief-round-label").textContent = `Цикл ${cycle}, пара ${pos}/${total}`;
    $("brief-explainer").textContent = round.explainer;
    $("brief-guesser").textContent   = round.guesser;
  } else {
    const total = game.schedule.length;
    $("brief-round-label").textContent = `Раунд ${game.roundCursor + 1}/${total}`;
    $("brief-explainer").textContent = `${round.explainer} (${round.team})`;
    $("brief-guesser").textContent   = round.guessers.length > 0
      ? round.guessers.join(", ") : "команда";
  }

  // Моя роль
  const role = myRole(round, cfg.mode);
  const roleLabel = { explainer: "Ти пояснюєш", guesser: "Ти відгадуєш", observer: "Ти відпочиваєш" };
  const roleChip  = { explainer: "chip-explain",  guesser: "chip-guess",   observer: "chip-watch" };
  $("brief-my-role").innerHTML =
    `<span class="role-chip ${roleChip[role]}">${roleLabel[role]}</span>`;

  renderScores(game.scores, "brief-scores");

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
  const round  = currentRound(game, cfg.mode);
  const role   = myRole(round, cfg.mode);

  // Заголовок та таймер
  if (cfg.mode === "solo") {
    $("round-label").textContent = `${round.explainer} → ${round.guesser}`;
  } else {
    $("round-label").textContent = `${round.team} · ${round.explainer} пояснює`;
  }

  const timeLeft = game.timer ?? cfg.roundTime;
  $("timer").textContent = timeLeft;
  const pct = timeLeft / cfg.roundTime * 100;
  const bar = $("timer-bar");
  bar.style.width = pct + "%";
  bar.className   = "timer-bar" + (pct > 40 ? "" : pct > 20 ? " warn" : " danger");

  // Ролі
  $("view-explainer").style.display = role === "explainer" ? "block" : "none";
  $("view-guesser").style.display   = role === "guesser"   ? "block" : "none";
  $("view-observer").style.display  = role === "observer"  ? "block" : "none";

  if (role === "explainer") {
    $("word-display").textContent     = game.wordPool[game.wordIdx] || "—";
    $("controls-active").style.display = "block";
    $("last-word-zone").style.display  = "none";
  }
  if (role === "observer") {
    $("observer-msg").textContent =
      cfg.mode === "team" ? `Грає ${round.team}` : `${round.explainer} → ${round.guesser}`;
  }

  // Статистика раунду
  $("stat-correct").textContent = game.roundCorrect || 0;
  $("stat-skip").textContent    = game.roundSkip    || 0;
  renderLog(game.roundLog || []);
  renderScores(game.scores, "round-scores");

  // Хост запускає таймер
  if (isHost && !timerHandle) startHostTimer(cfg.roundTime);
}

function renderLastWord(data) {
  showScreen("screen-round");
  stopTimer();

  const cfg   = data.config;
  const game  = data.game;
  const round = currentRound(game, cfg.mode);
  const role  = myRole(round, cfg.mode);

  $("timer").textContent  = "0";
  $("timer-bar").style.width = "0%";

  $("view-explainer").style.display = role === "explainer" ? "block" : "none";
  $("view-guesser").style.display   = role === "guesser"   ? "block" : "none";
  $("view-observer").style.display  = role === "observer"  ? "block" : "none";

  if (role === "explainer") {
    $("word-display").textContent      = game.wordPool[game.wordIdx] || "—";
    $("controls-active").style.display = "none";
    $("last-word-zone").style.display  = "block";
  }
  if (role === "guesser") {
    $("guesser-last-zone").style.display = "block";
  }

  $("stat-correct").textContent = game.roundCorrect || 0;
  $("stat-skip").textContent    = game.roundSkip    || 0;
  renderLog(game.roundLog || []);
  renderScores(game.scores, "round-scores");
}

// ─── Таймер (тільки хост) ─────────────────────────────────────────────────────
function startHostTimer(roundTime) {
  stopTimer();
  timerHandle = setInterval(async () => {
    const snap = await get(ref(db, `rooms/${currentRoom}/game`));
    const game = snap.val();
    if (!game) { stopTimer(); return; }

    const cfgSnap = await get(ref(db, `rooms/${currentRoom}/config`));
    if (cfgSnap.val()?.status !== "playing") { stopTimer(); return; }

    if (game.timer <= 1) {
      stopTimer();
      // Переходимо в "lastword" — дати змогу підтвердити останнє слово
      await update(ref(db, `rooms/${currentRoom}/config`), { status: "lastword" });
      await update(ref(db, `rooms/${currentRoom}/game`),   { timer: 0 });
    } else {
      await update(ref(db, `rooms/${currentRoom}/game`), { timer: game.timer - 1 });
    }
  }, 1000);
}

function stopTimer() {
  if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
}

// ─── Кнопки ведучого ─────────────────────────────────────────────────────────
$("correct-btn").onclick = () => scoreWord(true, false);
$("skip-btn").onclick    = () => scoreWord(false, false);
$("last-correct-btn").onclick = () => scoreWord(true, true);
$("last-no-btn").onclick      = () => finishRound();

async function scoreWord(correct, isLast) {
  const snap = await get(ref(db, `rooms/${currentRoom}`));
  const data = snap.val();
  const cfg  = data.config;
  const game = data.game;
  const round = currentRound(game, cfg.mode);
  const word  = game.wordPool[game.wordIdx];

  // Оновлюємо рахунок
  const scores = { ...game.scores };
  if (correct) {
    if (cfg.mode === "solo") {
      scores[round.explainer] = (scores[round.explainer] || 0) + 1;
      scores[round.guesser]   = (scores[round.guesser]   || 0) + 1;
    } else {
      scores[round.team] = (scores[round.team] || 0) + 1;
    }
  } else {
    // Пропуск: −1 тільки ведучому (або команді)
    if (cfg.mode === "solo") {
      scores[round.explainer] = (scores[round.explainer] || 0) - 1;
    } else {
      scores[round.team] = (scores[round.team] || 0) - 1;
    }
  }

  const roundLog = [...(game.roundLog || []),
    { word, result: correct ? "correct" : "skip" }];

  const nextWordIdx = (game.wordIdx + 1) % game.wordPool.length;
  const roundCorrect = (game.roundCorrect || 0) + (correct ? 1 : 0);
  const roundSkip    = (game.roundSkip    || 0) + (correct ? 0 : 1);

  // Перевіряємо ліміт балів після кожного ходу
  const maxScore = Math.max(...Object.values(scores));
  const gameOver = maxScore >= cfg.scoreLimit;

  if (isLast || gameOver) {
    await update(ref(db, `rooms/${currentRoom}/game`), {
      scores, roundLog, roundCorrect, roundSkip
    });
    await finishRound(gameOver);
  } else {
    await update(ref(db, `rooms/${currentRoom}/game`), {
      scores, roundLog, roundCorrect, roundSkip,
      wordIdx: nextWordIdx
    });
  }
}

async function finishRound(gameOver = false) {
  if (gameOver) {
    await update(ref(db, `rooms/${currentRoom}/config`), { status: "final" });
    return;
  }

  const snap = await get(ref(db, `rooms/${currentRoom}`));
  const data = snap.val();
  const cfg  = data.config;
  const game = data.game;

  // Перевіряємо чи досягнуто ліміту балів
  const maxScore = Math.max(...Object.values(game.scores || {}));
  if (maxScore >= cfg.scoreLimit) {
    await update(ref(db, `rooms/${currentRoom}/config`), { status: "final" });
    return;
  }

  // Командний: перевіряємо ліміт раундів
  if (cfg.mode === "team") {
    const isLastRound = game.roundCursor >= game.schedule.length - 1;
    if (isLastRound) {
      await update(ref(db, `rooms/${currentRoom}/config`), { status: "final" });
      return;
    }
  }

  await update(ref(db, `rooms/${currentRoom}/config`), { status: "result" });
  // Скидаємо стан раунду
  await update(ref(db, `rooms/${currentRoom}/game`), {
    roundCorrect: 0,
    roundSkip:    0,
    roundLog:     [],
    timer:        cfg.roundTime,
  });
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
  const round  = currentRound(game, cfg.mode);

  let detail = "";
  if (cfg.mode === "solo") {
    detail = `
      <div class="result-row"><span>${round.explainer} пояснював</span></div>
      <div class="result-row"><span>${round.guesser} відгадував</span></div>`;
  } else {
    detail = `<div class="result-row"><span>Грала команда ${round.team}</span></div>`;
  }
  detail += `
    <div class="result-row result-stats">
      <span>✅ ${game.roundCorrect || 0} вгадано</span>
      <span>❌ ${game.roundSkip || 0} пропуск</span>
    </div>`;

  $("result-detail").innerHTML = detail;
  renderScores(game.scores, "result-scores");

  $("result-host-btn").style.display  = isHost ? "block" : "none";
  $("result-guest-wait").style.display = isHost ? "none"  : "block";
}

$("next-round-btn").onclick = async () => {
  const snap = await get(ref(db, `rooms/${currentRoom}/game`));
  const game = snap.val();
  const cfgSnap = await get(ref(db, `rooms/${currentRoom}/config`));
  const cfg = cfgSnap.val();

  // Рухаємо курсор
  if (cfg.mode === "solo") {
    const nextCursor = (game.pairCursor || 0) + 1;
    await update(ref(db, `rooms/${currentRoom}/game`), { pairCursor: nextCursor });
  } else {
    const nextCursor = (game.roundCursor || 0) + 1;
    await update(ref(db, `rooms/${currentRoom}/game`), { roundCursor: nextCursor });
  }

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

  $("final-winner").textContent      = winner ? winner[0] : "—";
  $("final-winner-score").textContent = winner ? `${winner[1]} балів` : "";
  renderScores(scores, "final-scores");
}

$("play-again-btn").onclick = async () => {
  await update(ref(db, `rooms/${currentRoom}/config`), { status: "lobby" });
  await set(ref(db, `rooms/${currentRoom}/game`), null);
};

$("leave-final-btn").onclick = () => goHome();

// ══════════════════════════════════════════════════════════════════════════════
// ВИХІД З ГРИ
// ══════════════════════════════════════════════════════════════════════════════
async function leaveRoom() {
  stopTimer();
  if (roomUnsub) { roomUnsub(); roomUnsub = null; }

  if (!currentRoom || !myName) { goHome(); return; }

  // Видаляємо гравця з кімнати
  await remove(ref(db, `rooms/${currentRoom}/players/${myName}`));

  const snap = await get(ref(db, `rooms/${currentRoom}/players`));
  const remaining = Object.keys(snap.val() || {});

  if (remaining.length === 0) {
    // Остання людина — прибираємо кімнату
    await remove(ref(db, `rooms/${currentRoom}`));
    await remove(ref(db, `lobby/${currentRoom}`));
  } else {
    // Передаємо хост наступному якщо потрібно
    const cfgSnap = await get(ref(db, `rooms/${currentRoom}/config`));
    const cfg = cfgSnap.val();
    if (cfg?.host === myName) {
      await update(ref(db, `rooms/${currentRoom}/config`), { host: remaining[0] });
    }
    // Оновлюємо лічильник
    await update(ref(db, `lobby/${currentRoom}`), { players: remaining.length });
  }

  goHome();
}

function goHome() {
  stopTimer();
  if (roomUnsub) { roomUnsub(); roomUnsub = null; }
  myName = "";
  currentRoom = "";
  showScreen("screen-login");
}

$("leave-lobby-btn").onclick  = leaveRoom;
$("leave-game-btn").onclick   = leaveRoom;

// ══════════════════════════════════════════════════════════════════════════════
// УТИЛІТИ
// ══════════════════════════════════════════════════════════════════════════════

// Повертає поточний раунд/пару залежно від режиму
function currentRound(game, mode) {
  if (mode === "solo") {
    const idx = (game.pairCursor || 0) % game.schedule.length;
    return game.schedule[idx];
  } else {
    const idx = game.roundCursor || 0;
    return game.schedule[idx] || game.schedule[0];
  }
}

// Визначає роль поточного гравця
function myRole(round, mode) {
  if (round.explainer === myName) return "explainer";
  if (mode === "solo") {
    return round.guesser === myName ? "guesser" : "observer";
  } else {
    // Командний: відгадують всі з команди крім ведучого
    return (round.guessers || []).includes(myName) ? "guesser" : "observer";
  }
}

// Рендер рахунку
function renderScores(scores, targetId) {
  const el = $(targetId);
  if (!scores || !el) return;
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const maxScore = sorted[0]?.[1] ?? 0;
  el.innerHTML = sorted.map(([name, score], i) => `
    <div class="score-row${i === 0 && score > 0 ? " score-leader" : ""}">
      <span class="score-name">${name}${name === myName ? " <em>(ти)</em>" : ""}</span>
      <span class="score-val">${score}</span>
    </div>`
  ).join("");
}

// Рендер логу раунду
function renderLog(log) {
  const el = $("round-log");
  if (!el) return;
  el.innerHTML = [...log].reverse().slice(0, 8).map(e =>
    `<div class="log-item ${e.result === "correct" ? "log-plus" : "log-minus"}">
      ${e.result === "correct" ? "+1" : "−1"} ${e.word}
    </div>`
  ).join("");
}