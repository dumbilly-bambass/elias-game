import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, update, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
const db = getDatabase(app);
let currentRoom = "";
let myName = "";
let isLeader = false;

const words = ["Алгоритм", "Масив", "Цикл", "Синтаксис", "Баг", "Деплой", "Об'єкт", "Стек", "Процесор", "Відладка", "Компілятор", "Інтерфейс", "База даних", "Фреймворк"];

// 1. ЛОБІ: Список кімнат
onValue(ref(db, 'lobby'), (snapshot) => {
    const rooms = snapshot.val();
    const listEl = document.getElementById('rooms-list');
    if (!rooms) { listEl.innerHTML = "Немає активних кімнат"; return; }
    
    listEl.innerHTML = Object.keys(rooms).map(id => `
        <div class="room-item" onclick="document.getElementById('room-id').value='${id}'">
            <span>🏠 ${id}</span>
            <span style="color:#43b581">online</span>
        </div>
    `).join('');
});

// 2. ВХІД
document.getElementById('join-btn').onclick = () => {
    myName = document.getElementById('username').value.trim();
    currentRoom = document.getElementById('room-id').value.trim();
    const setTime = parseInt(document.getElementById('round-time').value) || 60;

    if (myName && currentRoom) {
        update(ref(db, 'lobby/' + currentRoom), { status: 'active' });
        update(ref(db, `rooms/${currentRoom}/players`), { [myName]: true });
        
        const roomRef = ref(db, 'rooms/' + currentRoom);
        onValue(roomRef, (snap) => {
            if (!snap.exists()) {
                set(roomRef, { maxTime: setTime, timer: setTime, status: 'waiting' });
            }
        }, { onlyOnce: true });

        document.getElementById('setup').style.display = 'none';
        document.getElementById('game').style.display = 'block';
        listenToRoom();
    }
};

// 3. ІГРОВА ЛОГІКА
function listenToRoom() {
    onValue(ref(db, 'rooms/' + currentRoom), (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        const players = Object.keys(data.players || {});
        isLeader = players[0] === myName;

        const display = document.getElementById('word-display');
        const challengeZone = document.getElementById('challenge-zone');

        if (data.status === 'challenge') {
            display.innerText = "ОСКАРЖЕННЯ...";
            challengeZone.style.display = 'block';
            document.getElementById('controls').style.display = 'none';
        } else if (data.status === 'playing') {
            challengeZone.style.display = 'none';
            display.innerText = isLeader ? data.currentWord : "Вгадуйте слово!";
            document.getElementById('controls').style.display = isLeader ? 'block' : 'none';
        } else {
            display.innerText = isLeader ? "Натисніть ✅ для старту" : "Чекаємо ведучого...";
            document.getElementById('controls').style.display = isLeader ? 'block' : 'none';
        }

        document.getElementById('timer').innerText = (data.timer || 0) + "s";
        document.getElementById('scoreboard').innerHTML = "<h3>Рахунок:</h3>" + 
            Object.entries(data.scores || {}).map(([n, s]) => `<div>${n}: ${s}</div>`).join('');
    });
}

document.getElementById('correct-btn').onclick = () => {
    if (!isLeader) return;
    const roomRef = ref(db, 'rooms/' + currentRoom);
    update(roomRef, { status: 'challenge' });

    setTimeout(() => {
        runTransaction(ref(db, `rooms/${currentRoom}/scores/${myName}`), s => (s || 0) + 1);
        update(roomRef, { 
            status: 'playing', 
            currentWord: words[Math.floor(Math.random() * words.length)] 
        });
    }, 5000);
};

document.getElementById('skip-btn').onclick = () => {
    if (!isLeader) return;
    update(ref(db, 'rooms/' + currentRoom), { 
        status: 'playing',
        currentWord: words[Math.floor(Math.random() * words.length)] 
    });
};

// ТАЙМЕР
setInterval(() => {
    if (isLeader && currentRoom) {
        runTransaction(ref(db, `rooms/${currentRoom}`), (room) => {
            if (room && room.status === 'playing' && room.timer > 0) room.timer -= 1;
            return room;
        });
    }
}, 1000);