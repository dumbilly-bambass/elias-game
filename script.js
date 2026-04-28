import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

const sfx = {
    ok: new Audio('https://actions.google.com/sounds/v1/cartoon/clime_up.ogg'),
    warn: new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg')
};

document.getElementById('join-btn').onclick = () => {
    myName = document.getElementById('username').value;
    currentRoom = document.getElementById('room-id').value;
    const mode = document.getElementById('game-mode').value;

    if (myName && currentRoom) {
        const roomRef = ref(db, 'rooms/' + currentRoom);
        // Ініціалізуємо кімнату, якщо її нема
        update(roomRef, { mode: mode, lastAction: Date.now() });
        
        document.getElementById('setup').style.display = 'none';
        document.getElementById('game').style.display = 'block';
        listenToRoom();
    }
};

function listenToRoom() {
    const roomRef = ref(db, 'rooms/' + currentRoom);
    onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        document.getElementById('word-display').innerText = data.currentWord || "Почніть гру!";
        
        // Візуалізація оскарження
        const challengeZone = document.getElementById('challenge-zone');
        challengeZone.style.display = data.status === 'challenge' ? 'block' : 'none';
        
        // Оновлення рахунку
        const scoreBoard = document.getElementById('scoreboard');
        scoreBoard.innerHTML = "<h3>Рахунок:</h3>" + 
            Object.entries(data.scores || {}).map(([name, score]) => `<div>${name}: ${score}</div>`).join('');
    });
}

// Функція кнопки "Вгадали"
document.getElementById('correct-btn').onclick = () => {
    const roomRef = ref(db, 'rooms/' + currentRoom);
    const words = ["Алгоритм", "Синтаксис", "Масив", "Цикл", "Об'єкт"];
    const nextWord = words[Math.floor(Math.random() * words.length)];
    
    // Якщо режим командний — запускаємо "вікно оскарження"
    // Якщо особистий — просто міняємо слово (логіку балів допишемо наступним кроком)
    update(roomRef, { 
        currentWord: nextWord,
        status: 'playing', // Тут можна додати логіку затримки для 'challenge'
        lastUpdate: Date.now() 
    });
    sfx.ok.play();
};