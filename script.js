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
    "Слон", "Хмара", "Парасолька", "Бібліотека", "Піраміда", "Авокадо", "Телескоп", "Маяк", "Вулкан", "Жирафа",
    "Компас", "Термометр", "Акваріум", "Балкон", "Вітряк", "Кактус", "Дельфін", "Єнот", "Крокодил", "Лимон",
    "Молоток", "Ракета", "Фламінго", "Якір", "Бурштин", "Ескалатор", "Підводний човен", "Самовар", "Тюлень", "Хокей",
    "Цунамі", "Гіпноз", "Джерело", "Шахта", "Обрій", "Павук", "Насос", "Іриска", "Карнавал", "Глобус",
    "Наплічник", "Мандарин", "Шоколад", "Гітара", "Дзеркало", "Зорепад", "Кришталь", "Ліхтар", "Мольберт", "Палітра",
    "Скрипка", "Шахи", "Ковдра", "Подушка", "Газета", "Ліфт", "Окуляри", "Рюкзак", "Свічка", "Комбайн",
    "Колесо", "Прапор", "Магніт", "Годинник", "Ключ", "Замок", "Карта", "Герб", "Корона", "Сцена",
    "Фонтан", "Острів", "Пустеля", "Джунглі", "Печера", "Айсберг", "Мотузка", "Літак", "Гелікоптер", "Потяг",
    "Корабель", "Велосипед", "Скутер", "Трамвай", "Автобус", "Метро", "Радіо", "Телефон", "Лист", "Пошта",
    "Музей", "Театр", "Цирк", "Зоопарк", "Стадіон", "Ринок", "Аптека", "Готель", "Завод", "Школа"
  ],
  "💻 IT": [
    "Алгоритм", "Масив", "Цикл", "Синтаксис", "Баг", "Деплой", "Об'єкт", "Стек", "Процесор", "Відладка",
    "Компілятор", "Інтерфейс", "База даних", "Фреймворк", "Рекурсія", "Токен", "Сервер", "Хмарне сховище", "Брандмауер", "Репозиторій",
    "Біткоїн", "Піксель", "Протокол", "Скрипт", "Хеш", "Шифрування", "Провайдер", "Віртуалізація", "Домен", "Браузер",
    "API", "Контейнер", "Лог", "Патч", "Гіт", "Пул", "Мердж", "Фронтенд", "Бекенд", "Хостинг",
    "Сайт", "Додаток", "Віджет", "Плагін", "Парсер", "Степінг", "Кеш", "Кукі", "Сесія", "Драйвер",
    "Залізо", "Монітор", "Клавіатура", "Мишка", "Принтер", "Сканер", "Модем", "Роутер", "Кабель", "Порт",
    "Софт", "Антивірус", "Архіватор", "Блокнот", "Термінал", "Консоль", "Шрифт", "Код", "Рядок", "Змінна",
    "Константа", "Функція", "Метод", "Клас", "Бібліотека", "Модуль", "Пакет", "Запит", "Відповідь", "Помилка",
    "Вразливість", "Хакер", "Фішинг", "Спам", "Бот", "Нейромережа", "Інтелект", "Дані", "Аналітика", "Таблиця",
    "Запит", "Сортування", "Пошук", "Фільтр", "Індекс", "Трафік", "Пинг", "Шлюз", "Маска", "Адреса"
  ],
  "🎬 Кіно": [
    "Режисер", "Монтаж", "Каскадер", "Сценарій", "Трейлер", "Бюджет", "Прем'єра", "Актор", "Декорації", "Грим",
    "Озвучка", "Субтитри", "Спецефекти", "Оскар", "Серіал", "Дубляж", "Антракт", "Трюк", "Кінотеатр", "Попкорн",
    "Вестерн", "Комедія", "Драма", "Мультфільм", "Знімальний майданчик", "Оператор", "Хлопавка", "Сюжет", "Герой", "Лиходій",
    "Фінал", "Титри", "Кадр", "Дубль", "Сцена", "Реквізит", "Костюм", "Гримерка", "Освітлення", "Мікрофон",
    "Екран", "Проектор", "Квиток", "Афіша", "Рейтинг", "Критик", "Продюсер", "Кіностудія", "Голлівуд", "Фестиваль",
    "Кінофестиваль", "Статуетка", "Червона доріжка", "Зірка", "Фанат", "Автограф", "Кастинг", "Роль", "Епізод", "Масовка",
    "Камео", "Ремейк", "Сиквел", "Приквел", "Трилогія", "Сага", "Екранізація", "Блокбастер", "Бойовик", "Трилер",
    "Жахи", "Фентезі", "Детектив", "Мелодрама", "Мюзикл", "Вестерн", "Байопік", "Документалка", "Артхаус", "Короткометражка",
    "Анімація", "Спецефекти", "Графіка", "Хромакей", "Об'єктив", "Штатив", "Фокус", "Звук", "Музика", "Композитор",
    "Монтажер", "Сценарист", "Гример", "Художник", "Каскадер", "Постановник", "Директор", "Агент", "Премія", "Номінація"
  ],
  "🍕 Їжа": [
    "Піца", "Суші", "Борщ", "Пельмені", "Лазанья", "Круасан", "Такос", "Карі", "Фондю", "Паелья",
    "Стейк", "Капучино", "Макарон", "Вафлі", "Хумус", "Тірамісу", "Еклер", "Бургер", "Пломбір", "Глінтвейн",
    "Омлет", "Плов", "Сирник", "Зефір", "Йогурт", "Кіш", "Лимонад", "Панкейк", "Рататуй", "Сендвіч",
    "Тартар", "Шніцель", "Котлета", "Тефтелі", "Голубці", "Млинець", "Вареник", "Батон", "Пончик", "Кекс",
    "Медовик", "Наполеон", "Чізкейк", "Желе", "Мус", "Пастила", "Грильяж", "Трюфель", "Карамель", "Льодяник",
    "Горіх", "Мигдаль", "Фундук", "Арахіс", "Фісташки", "Кеш'ю", "Кунжут", "Мак", "Мед", "Джем",
    "Варення", "Сироп", "Гірчиця", "Кетчуп", "Майонез", "Соус", "Оцет", "Олія", "Сіль", "Цукор",
    "Перець", "Чай", "Кава", "Какао", "Сік", "Компот", "Кисіль", "Квас", "Молоко", "Кефір",
    "Сметана", "Вершки", "Творог", "Бринза", "Масло", "Сало", "Бекон", "Ковбаса", "Шинка", "Паштет",
    "Гриби", "Огірок", "Томат", "Капуста", "Морква", "Буряк", "Цибуля", "Часник", "Гарбуз", "Кабачок"
  ],
  "🏅 Спорт": [
    "Штанга", "Пенальті", "Аутсайдер", "Тайм-аут", "Офсайд", "Спринт", "Манеж", "Суддя", "Трибуна", "Допінг",
    "Фехтування", "Регбі", "Крикет", "Більярд", "Гольф", "Марафон", "Трамплін", "Ракетка", "Шайба", "Волан",
    "Карате", "Бокс", "Теніс", "Баскетбол", "Волейбол", "Фігурне катання", "Альпінізм", "Велоспорт", "Плавання", "Дзюдо",
    "Гімнастика", "Атлетика", "Стрільба", "Лук", "Спис", "Ядро", "Гантелі", "Турнік", "Бруси", "Кільця",
    "Батут", "Скейтборд", "Серфінг", "Сноуборд", "Лижі", "Ковзани", "Ролики", "Шлем", "Маска", "Ласти",
    "Жилет", "Весло", "Човен", "Вітрило", "Парашут", "Планер", "Байдарка", "Каное", "Кінь", "Сідло",
    "Жокей", "Іподром", "Трек", "Корт", "Ринг", "Татамі", "Сітка", "Ворота", "Кошик", "Кільце",
    "М'яч", "Бита", "Ключка", "Перчатки", "Бутси", "Кеди", "Майка", "Шорти", "Кубок", "Медаль",
    "Диплом", "Рекорд", "Тренер", "Команда", "Гравець", "Капітан", "Гол", "Пас", "Старт", "Фініш",
    "Перемога", "Нічия", "Поразка", "Турнір", "Чемпіонат", "Олімпіада", "Спортзал", "Басейн", "Ковзанка", "Йога"
  ],
  "🎓 Школа": [
    "Журнал", "Директор", "Канікули", "Перерва", "Щоденник", "Лінійка", "Циркуль", "Глобус", "Атлас", "Формула",
    "Теорема", "Твір", "Диктант", "Лабораторна", "Крейда", "Дошка", "Парта", "Дзвінок", "Олімпіада", "Атестат",
    "Ректор", "Конспект", "Шпаргалка", "Факультатив", "Екзамен", "Аудиторія", "Підручник", "Олівець", "Ручка", "Маркер",
    "Гумка", "Точилка", "Зошит", "Альбом", "Фарби", "Пензлик", "Клей", "Ножиці", "Картон", "Папір",
    "Степлер", "Дірокол", "Папка", "Файл", "Портфель", "Стипендія", "Лекція", "Семінар", "Курсова", "Дипломна",
    "Аспірант", "Професор", "Доцент", "Декан", "Кафедра", "Факультет", "Університет", "Коледж", "Ліцей", "Гімназія",
    "Учень", "Школяр", "Студент", "Випускник", "Вчитель", "Викладач", "Куратор", "Клас", "Група", "Потік",
    "Урок", "Пара", "Розклад", "Оцінка", "Бал", "Залік", "Сесія", "Практика", "Чернетка", "Бібліотека",
    "Читалка", "Абонемент", "Словник", "Довідник", "Енциклопедія", "Правило", "Аксіома", "Гіпотеза", "Доказ", "Задача",
    "Приклад", "Вправа", "Питання", "Відповідь", "Доповідь", "Реферат", "Проєкт", "Презентація", "Музей", "Екскурсія"
  ],
  "🕺 Хобі": [
    "Дайвінг", "Орігамі", "Скрапбукінг", "Покер", "Косплей", "Вініл", "Сноуборд", "Фотополювання", "Нумізматика", "Квест",
    "Йога", "Стрільба з лука", "Графіті", "Моделювання", "В'язання", "Вишивання", "Кераміка", "Садівництво", "Блогерство", "Подкаст",
    "Скелелазіння", "Риболовля", "Полювання", "Кулінарія", "Дегустація", "Більярд", "Боулінг", "Дартс", "Настільні ігри", "Пазли",
    "Філателія", "Бонсай", "Астрономія", "Металошукач", "Реставрація", "Картинг", "Пейнтбол", "Страйкбол", "Фрізбі", "Покер",
    "Фокуси", "Жонглювання", "Миловаріння", "Плетіння", "Гончарство", "Петриківка", "Малювання", "Квілінг", "Скрапбукінг", "Печворк",
    "Флористика", "Гербарій", "Каліграфія", "Різьблення", "Чеканка", "Випалювання", "Авіамоделювання", "Судомоделювання", "Робототехніка", "Радіоаматор",
    "Дизайн", "Шиття", "Макіяж", "Манікюр", "Татуювання", "Пірсинг", "Етнографія", "Краєзнавство", "Генеалогія", "Волонтерство",
    "Благодійність", "Подорожі", "Хайкінг", "Трекінг", "Кемпінг", "Спелеологія", "Сплав", "Рафтинг", "Віндсерфінг", "Кайтсерфінг",
    "Парапланеризм", "Роупджампінг", "Паркур", "Трюки", "Йо-йо", "Спіннер", "Кубик Рубіка", "Колекціонування", "Антикваріат", "Вітраж",
    "Мозаїка", "Гра на гітарі", "Танці", "Балет", "Стретчинг", "Медитація", "Скрайбінг", "Комікси", "Манга", "Аніме"
  ],
  "🎸 Музика": [
    "Ритм", "Соло", "Синтезатор", "Кавер", "Плейлист", "Репетиція", "Фестиваль", "Мікрофон", "Саундтрек", "Метроном",
    "Акорд", "Джаз", "Диригент", "Барабан", "Тромбон", "Саксофон", "Флейта", "Арфа", "Гобой", "Кларнет",
    "Віолончель", "Контрабас", "Альт", "Орган", "Баян", "Акордеон", "Гармошка", "Бандура", "Сопілка", "Бубон",
    "Рояль", "Піаніно", "Клавесин", "Бек-вокал", "Опера", "Оперета", "Мюзикл", "Рок", "Поп", "Реп",
    "Метал", "Блюз", "Кантрі", "Фолк", "Техно", "Дабстеп", "Ембієнт", "Шансон", "Реггі", "Панк",
    "Ноти", "Скрипковий ключ", "Гама", "Мажор", "Мінор", "Темп", "Гучність", "Еквалайзер", "Колонки", "Навушники",
    "Плеєр", "Магнітофон", "Підсилювач", "Студія", "Лейбл", "Продюсер", "Кліп", "Текст", "Мелодія", "Гармонія",
    "Аранжування", "Оркестр", "Хор", "Ансамбль", "Квартет", "Дует", "Тріо", "Тур", "Концерт", "Гастролі",
    "Райдер", "Сцена", "Куліси", "Партер", "Ложа", "Амфітеатр", "Галерка", "Антракт", "Біс", "Овація",
    "Фанат", "Групі", "Вінілова платівка", "Касета", "Диск", "Стрімінг", "Радіо", "Хіт", "Шлягер", "Альбом"
  ],
  "🏛️ Культура": [
    "Колізей", "Сакура", "Сомбреро", "Фіорд", "Стоунхендж", "Карнавал", "Ейфелева вежа", "Черепиця", "Гейша", "Кілт",
    "Гондола", "Пагода", "Сафарі", "Вігвам", "Юрта", "Ранчо", "Фазенда", "Шале", "Хмарочос", "Площа",
    "Ратуша", "Фонтан", "Пам'ятник", "Мозаїка", "Фреска", "Статуя", "Скульптура", "Галерея", "Виставка", "Експонат",
    "Артефакт", "Руїни", "Амфітеатр", "Піраміда", "Сфінкс", "Храм", "Собор", "Мечеть", "Костел", "Синагога",
    "Традиція", "Обряд", "Свято", "Фестиваль", "Ярмарок", "Кухня", "Делікатес", "Прянощі", "Костюм", "Вишиванка",
    "Кімоно", "Сарі", "Пончо", "Тюрбан", "Маска", "Тотем", "Легенда", "Міф", "Казка", "Епос",
    "Мова", "Діалект", "Акцент", "Етикет", "Церемонія", "Чай", "Калліграфія", "Орнамент", "Візерунок", "Ремесло",
    "Ткацтво", "Ковальство", "Різьблення", "Кераміка", "Гончарство", "Народ", "Плем'я", "Нація", "Держава", "Столиця",
    "Герб", "Прапор", "Гімн", "Валюта", "Кордон", "Митниця", "Віза", "Паспорт", "Турист", "Подорож",
    "Екскурсія", "Гід", "Сувенір", "Листівка", "Магнітик", "Готель", "Хостел", "Круїз", "Політ", "Трансфер"
  ],
  "🛋️ Побут": [
    "Шарнір", "Дуршлаг", "Пуф", "Жалюзі", "Подовжувач", "Скарбничка", "Штопор", "Серветка", "Торшер", "Ополоник",
    "Гамак", "Праска", "Пилосос", "Вішалка", "Дзеркало", "Комод", "Карниз", "Люстра", "Бра", "Торшер",
    "Скатертина", "Рушник", "Фіранка", "Прищіпка", "Кошик", "Губка", "Мильниця", "Гребінець", "Фен", "Бритва",
    "Таз", "Відро", "Швабра", "Віник", "Совок", "Терка", "Деко", "Друшляк", "Ситечко", "Чайник",
    "Каструля", "Сковорідка", "Черпак", "Лопатка", "Віничок", "Дошка", "Ніж", "Виделка", "Ложка", "Тарілка",
    "Чашка", "Стакан", "Келих", "Глечик", "Термос", "Контейнер", "Фольга", "Пергамент", "Плівка", "Папір",
    "Пральний порошок", "Кондиціонер", "Мило", "Шампунь", "Зубна паста", "Щітка", "Вата", "Пластир", "Бинт", "Перекис",
    "Голка", "Нитка", "Гудзик", "Булавка", "Наперсток", "П'яльця", "Вимірювальна стрічка", "Рівень", "Рулетка", "Викрутка",
    "Плоскогубці", "Ключ", "Наждачка", "Дриль", "Шуруп", "Цвях", "Дюбель", "Молоток", "Сокира", "Пила",
    "Драбина", "Ліхтарик", "Батарейка", "Зарядка", "Перехідник", "Розетка", "Вимикач", "Дзвінок", "Домофон", "Килимок"
  ],
  "🚗 Транспорт": [
    "Гіроскутер", "Квадрокоптер", "Катер", "Моноколесо", "Кабріолет", "Самокат", "Пароплав", "Електрокар", "Фунікулер", "Яхта",
    "Субмарина", "Дрон", "Тролейбус", "Трактор", "Екскаватор", "Бульдозер", "Кран", "Самоскид", "Бетономішалка", "Причіп",
    "Фура", "Пікап", "Позашляховик", "Лімузин", "Мікроавтобус", "Карета", "Сани", "Віз", "Човен", "Катамаран",
    "Пліт", "Баржа", "Танкер", "Криголам", "Гідроцикл", "Мотор", "Вітрило", "Весло", "Якір", "Штурвал",
    "Пропелер", "Шасі", "Крило", "Кабіна", "Салон", "Багажник", "Капот", "Фара", "Бампер", "Кермо",
    "Педаль", "Гальма", "Шина", "Диск", "Акумулятор", "Радіатор", "Глушник", "Бензобак", "Двигун", "Коробка передач",
    "Спідометр", "Навігатор", "Відеореєстратор", "Парктронік", "Автокрісло", "Багажник", "Причіп", "Гараж", "Парковка", "Заправка",
    "Шосе", "Траса", "Естакада", "Тунель", "Міст", "Переїзд", "Світлофор", "Зебра", "Тротуар", "Узбіччя",
    "Водій", "Пілот", "Капітан", "Машиніст", "Кондуктор", "Контролер", "Пасажир", "Квиток", "Жетон", "Проїзний",
    "Рейс", "Маршрут", "Графік", "Зупинка", "Вокзал", "Перон", "Аеропорт", "Порт", "Причал", "Депо"
  ],
  "🐾 Дика природа": [
    "Хамелеон", "Панда", "Секвоя", "Баобаб", "Качкодзьоб", "Колібрі", "Мухоловка", "Коала", "Опосум", "Скат",
    "Терміт", "Лотос", "Корал", "Бархан", "Тайга", "Тундра", "Савана", "Прерія", "Оазис", "Риф",
    "Дюна", "Скеля", "Ущелина", "Водоспад", "Гейзер", "Льодовик", "Полярне сяйво", "Метеорит", "Комета", "Сузір'я",
    "Мурахоїд", "Броненосець", "Лінивець", "Пума", "Ягуар", "Леопард", "Гієна", "Шакал", "Варан", "Ігуана",
    "Кобра", "Удав", "Пітон", "Анаконда", "Черепаха", "Тритон", "Саламандра", "Медуза", "Осьминіг", "Кальмар",
    "Краб", "Омар", "Креветка", "Морська зірка", "Морський коник", "Скат", "Акула", "Скат", "Кит", "Кашалот",
    "Морж", "Нерпа", "Пінгвін", "Альбатрос", "Пелікан", "Чапля", "Лелека", "Журавель", "Орел", "Яструб",
    "Сокіл", "Сова", "Пугач", "Дятел", "Зозуля", "Соловей", "Шишка", "Хвоя", "Мох", "Лишайник",
    "Папороть", "Очерет", "Ліана", "Орхідея", "Едельвейс", "Магнолія", "Кипарис", "Кедр", "Ялина", "Смерека",
    "Мурашник", "Вулик", "Нора", "Барліг", "Гніздо", "Дупло", "Слід", "Кігті", "Ікла", "Хвіст"
  ],
  "💡 Дії та емоції": [
    "Заздрість", "Ностальгія", "Сарказм", "Малювати", "Шепотіти", "Танцювати", "Дивуватися", "Мріяти", "Апатія", "Натхнення",
    "Обурення", "Ігнорувати", "Вагатися", "Співчуття", "Ревнощі", "Паніка", "Захоплення", "Нудьга", "Гордість", "Провина",
    "Каяття", "Тривога", "Надія", "Вдячність", "Відчай", "Люв", "Турбота", "Зневага", "Азарт", "Тріумф",
    "Вагання", "Рішучість", "Смирення", "Розпач", "Спокій", "Втома", "Роздратування", "Ніжність", "Пристрасть", "Обожнювання",
    "Бігти", "Стрибати", "Сміятися", "Плакати", "Кричати", "Мовчати", "Думати", "Шукати", "Знаходити", "Втрачати",
    "Будувати", "Руйнувати", "Літати", "Плавати", "Посміхатися", "Сумувати", "Боятися", "Вірити", "Чекати", "Обіцяти",
    "Прощати", "Дякувати", "Сваритися", "Миритися", "Обіймати", "Цілувати", "Радіти", "Дивувати", "Лякати", "Захищати",
    "Нападати", "Перемагати", "Програвати", "Хворіти", "Одужувати", "Співати", "Слухати", "Дивитися", "Бачити", "Відчувати",
    "Смакувати", "Нюхати", "Торкатися", "Варити", "Мити", "Прати", "Працювати", "Відпочивати", "Подорожувати", "Мріяти",
    "Вигадувати", "Планувати", "Виконувати", "Керувати", "Підкорятися", "Вчити", "Вчитися", "Пояснювати", "Розуміти", "Забувати"
  ],
  "🎮 Ігри та меми": [
    "Стрім", "Скін", "Гільдія", "Лутбокс", "Спідран", "Фейспалм", "Чіт-код", "Нуб", "Пасхалка", "Кріпер",
    "Хедшот", "Скріншот", "Донат", "Квест", "Бос", "Левел", "Мана", "Хілер", "Танк", "Рейд",
    "Крафт", "Інвентар", "Маунт", "Ніп", "Локація", "Сейв", "Фраг", "Лаг", "Пінг", "Бан",
    "Мультиплеєр", "Кооператив", "Консоль", "Джойстик", "Геймпад", "Віртуальна реальність", "Стрімер", "Чат", "Емодзі", "Смайл",
    "Хайп", "Крінж", "Троль", "Хейтер", "Фолловер", "Саб", "Лайк", "Репост", "Тег", "Стрім",
    "Влог", "Челендж", "Мем", "Стікер", "Гіфка", "Аватар", "Нікнейм", "Профіль", "Аккаунт", "Пароль",
    "Логін", "Підписка", "Сповіщення", "Віджет", "Топ", "Нуб", "Про", "Твінк", "Агро", "Бафф",
    "Дебафф", "Гір", "Тіма", "Рандом", "Кікнути", "Забанити", "Замутити", "Лівер", "Фідити", "Ганк",
    "Скіл", "Ульта", "Кулдаун", "Респаун", "Вайп", "Чекпоінт", "Ачівка", "Платина", "Геймер", "Задрот",
    "Комп'ютерний клуб", "Кіберспорт", "Турнір", "Приз", "Коментатор", "Аналітик", "Косплей", "Конвент", "Комікс", "Манга"
  ],
  "💼 Робота": [
    "Дедлайн", "Оффер", "Кава-брейк", "Аванс", "Стартап", "Податок", "Презентація", "Фріланс", "Коворкінг", "Інвестиція",
    "Вакансія", "Корпоратив", "Звіт", "Нарада", "Бюджет", "Прибуток", "Збиток", "Маркетинг", "Реклама", "Бренд",
    "Логотип", "Клієнт", "Замовник", "Партнер", "Конкурент", "Ринок", "Продажі", "Логістика", "Склад", "Офіс",
    "Кабінет", "Стіл", "Стілець", "Ксерокс", "Сканер", "Папір", "Печатка", "Підпис", "Договір", "Контракт",
    "Угода", "Акція", "Облігація", "Банк", "Рахунок", "Картка", "Кредит", "Депозит", "Відсотки", "Валюта",
    "Біржа", "Брокер", "Директор", "Менеджер", "Секретар", "Бухгалтер", "Юрист", "Економіст", "Аудит", "Податки",
    "Штраф", "Премія", "Зарплата", "Відпустка", "Лікарняний", "Відрядження", "Кар'єра", "Підвищення", "Звільнення", "Резюме",
    "Співбесіда", "Стажування", "Досвід", "Навички", "Команда", "Лідер", "Делегація", "Планування", "Стратегія", "Тактика",
    "Результат", "Якість", "Термін", "Проєкт", "Завдання", "Пріоритет", "Ефективність", "Продуктивність", "Тайм-менеджмент", "Стрес",
    "Нетворкінг", "Переговори", "Ділова зустріч", "Візитка", "Портфоліо", "Кейс", "Фідбек", "Коучинг", "Тренінг", "Вебінар"
  ],
  "🧘 Психологія": [
    "Інтуїція", "Пульс", "Темперамент", "М'яз", "Рефлекс", "Татуювання", "Фобія", "Осанка", "Імунітет", "Харизма",
    "Совість", "Комплекс", "Стрес", "Ейфорія", "Інстинкт", "Гіпноз", "Свідомість", "Підсвідомість", "Емпатія", "Агресія",
    "Меланхолія", "Флегматик", "Сангвінік", "Холерик", "Екстраверт", "Інтроверт", "Скелет", "Суглоб", "Хребет", "Серце",
    "Легені", "Печінка", "Нирки", "Шлунок", "Мозок", "Нерв", "Кров", "Судина", "Гормон", "Адреналін",
    "Дофамін", "Серотонін", "Сон", "Безсоння", "Галюцинація", "Пам'ять", "Увага", "Інтелект", "Талант", "Геній",
    "Фантазія", "Логіка", "Аналіз", "Синтез", "Сприйняття", "Відчуття", "Екстаз", "Депресія", "Апатія", "Шок",
    "Травма", "Фрустрація", "Катарсис", "Інсайт", "Мотивація", "Воля", "Звичка", "Залежність", "Его", "Нарцисизм",
    "Альтруїзм", "Гумор", "Посмішка", "Сльоза", "Поцілунок", "Обійми", "Погляд", "Голос", "Жест", "Міміка",
    "Зріст", "Вага", "Фігура", "Мускулатура", "Гнучкість", "Дихання", "Температура", "Тиск", "Генетика", "ДНК",
    "Шкіра", "Волосся", "Нігті", "Очі", "Вуха", "Ніс", "Язик", "Зуби", "Підборіддя", "Потилиця"
  ],
  "🎞️ Ностальгія": [
    "Тамагочі", "Касета", "Пейджер", "Тетріс", "Йо-йо", "Жуйка", "Денді", "Дискотека", "Полароїд", "Плеєр",
    "Диск", "Діафільм", "Відеомагнітофон", "Прокат", "Фішки", "Кепси", "Пружинка", "Радуга", "Антена", "Телескоп",
    "Слайди", "Негатив", "Фотолабораторія", "Афіша", "Анкета", "Друзі", "Приставка", "Картридж", "Джойстик", "Дроти",
    "Телефонна будка", "Автомат", "Сифон", "Морозиво", "Лимонад", "Юпі", "Зуко", "Жуйка", "Турбо", "Лав із",
    "Альбом", "Наклейки", "Плакат", "Постер", "Журнал", "Газета", "Радіо", "Хіт", "Парабелум", "Кіндер",
    "Колекція", "Обмін", "Рінгтон", "Ік-порт", "Блютуз", "Айсік'ю", "Чат", "Форум", "Диск", "Флешка",
    "Дискета", "Монітор", "Мишка", "Килимок", "Модем", "Зв'язок", "Картка", "Поповнення", "Скретч-карта", "Ваучер",
    "Плеєр", "Навушники", "Радіо", "Касета", "Олівець", "Перемотка", "Батарейки", "Пружина", "Тетріс", "Змійка",
    "Маріо", "Танчики", "Контра", "Мортал Комбат", "Покемони", "Сейлор Мун", "Телепузики", "Барбі", "Лего", "Пазл",
    "Скакалка", "Резинка", "Класики", "Хованки", "Квач", "Козаки-розбійники", "Турнік", "Футбол", "Двір", "Дружба"
  ],
  "🔞 Пікантне": [
    "Стриптиз", "Похмілля", "Флірт", "Побачення", "Декольте", "Купідон", "Масаж", "Азарт", "Текіла", "Коктейль",
    "Бармен", "Вечірка", "Клуб", "Караоке", "Кальян", "Шампанське", "Вино", "Коньяк", "Горілка", "Пиво",
    "Закуска", "Тост", "Танці", "Музика", "Драйв", "Ейфорія", "Знайомство", "Номер", "Дзвінок", "Повідомлення",
    "Селфі", "Інстаграм", "Лайк", "Коментар", "Смайл", "Емодзі", "Стікер", "Фільтр", "Маска", "Ефект",
    "Подарунок", "Квіти", "Троянди", "Шоколад", "Вечеря", "Ресторан", "Вид", "Дах", "Захід", "Світанок",
    "Прогулянка", "Таксі", "Ліфт", "Квартира", "Замок", "Ключ", "Світло", "Тінь", "Музика", "Тиша",
    "Ліжко", "Ковдра", "Подушка", "Сон", "Мрія", "Бажання", "Пристрасть", "Ніжність", "Турбота", "Кохання",
    "Дотик", "Поцілунок", "Обійми", "Погляд", "Шепіт", "Голос", "Запах", "Парфуми", "Смак", "Відчуття",
    "Секрет", "Таємниця", "Інтим", "Довіра", "Щирість", "Вірність", "Ревнощі", "Зрада", "Драма", "Фінал",
    "Ранок", "Кава", "Сніданок", "Усмішка", "Щастя", "Доля", "Шанс", "Ризик", "Гра", "Перемога"
  ],
  "🇬🇧 English Light": [
    "Apple", "House", "Water", "Friend", "Family", "Bread", "Table", "Chair", "School", "Book",
    "Street", "City", "Country", "Animal", "Bird", "Fish", "Flower", "Tree", "Sun", "Moon",
    "Sky", "Cloud", "Rain", "Snow", "Wind", "Summer", "Winter", "Morning", "Night", "Day",
    "Time", "Money", "Work", "Play", "Game", "Sport", "Music", "Movie", "Phone", "Computer",
    "Hand", "Foot", "Head", "Eye", "Ear", "Nose", "Mouth", "Body", "Heart", "Face",
    "Boy", "Girl", "Man", "Woman", "Child", "Teacher", "Doctor", "Student", "Happy", "Sad",
    "Big", "Small", "Good", "Bad", "Hot", "Cold", "Old", "New", "Fast", "Slow",
    "Eat", "Drink", "Sleep", "Walk", "Run", "Jump", "Swim", "Talk", "Sing", "Read",
    "Write", "Learn", "Open", "Close", "Give", "Take", "Help", "Love", "Like", "Smile",
    "Green", "Blue", "Red", "Yellow", "White", "Black", "Orange", "Pink", "Color", "Number",
    // ... попередні 100 слів ...
    "Bread", "Butter", "Cheese", "Sugar", "Salt", "Tea", "Coffee", "Milk", "Juice", "Water",
    "Chicken", "Fish", "Meat", "Egg", "Potato", "Tomato", "Onion", "Soup", "Cake", "Sweet",
    "Plate", "Cup", "Spoon", "Fork", "Knife", "Bottle", "Glass", "Kitchen", "Bathroom", "Bedroom",
    "Door", "Window", "Wall", "Floor", "Roof", "Garden", "Park", "Forest", "Mountain", "River",
    "Sea", "Beach", "Lake", "Star", "Earth", "World", "Map", "Way", "Road", "Bridge",
    "Bus", "Car", "Bike", "Train", "Plane", "Ship", "Boat", "Ticket", "Bag", "Pocket",
    "Shirt", "Pants", "Dress", "Skirt", "Hat", "Shoe", "Sock", "Coat", "Gloves", "Watch",
    "Pen", "Pencil", "Paper", "Notebook", "Letter", "Picture", "Camera", "Radio", "Clock", "Lamp",
    "Bed", "Box", "Gift", "Toy", "Ball", "Doll", "Card", "Key", "Coin", "Flag",
    "King", "Queen", "Hero", "Police", "Worker", "Farmer", "Driver", "Pilot", "Captain", "Player",
    "Small", "Large", "Long", "Short", "Tall", "Thin", "Fat", "Rich", "Poor", "Young",
    "Beautiful", "Ugly", "Clean", "Dirty", "Easy", "Hard", "Right", "Wrong", "True", "False",
    "Wait", "Stop", "Go", "Come", "Sit", "Stand", "Jump", "Fly", "Fall", "Break",
    "Fix", "Find", "Lose", "Buy", "Sell", "Pay", "Cost", "Win", "Lose", "Try",
    "Ask", "Answer", "Call", "Tell", "Say", "Write", "Draw", "Paint", "Build", "Clean",
    "Wash", "Cook", "Bake", "Watch", "Listen", "Hear", "Feel", "Think", "Know", "Mean",
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Week", "Month", "Year",
    "Spring", "Summer", "Autumn", "Winter", "Weather", "Storm", "Ice", "Fire", "Smoke", "Dust",
    "Left", "Right", "Top", "Bottom", "Front", "Back", "Side", "Middle", "Corner", "Center",
    "Airport", "Actor", "Address", "Adult", "Afternoon", "Airplane", "Area", "Arm", "Aunt", "Autumn",
    "Baby", "Ball", "Bank", "Basketball", "Bath", "Bathroom", "Beard", "Bedroom", "Beer", "Bell",
    "Big", "Bike", "Bill", "Bird", "Birthday", "Biscuit", "Boat", "Body", "Box", "Boy",
    "Bridge", "Brother", "Bus", "Butter", "Cafe", "Cake", "Camera", "Camping", "Car", "Carrot",
    "Cartoon", "Cat", "Chair", "Cheese", "Chess", "Chicken", "Child", "Chocolate", "City", "Class",
    "Clock", "Clothes", "Cloud", "Coat", "Coffee", "Cold", "Computer", "Cook", "Cookie", "Country",
    "Cousin", "Cow", "Credit card", "Cup", "Dad", "Dance", "Date", "Daughter", "Day", "Desk",
    "Diary", "Dictionary", "Dinner", "Dinosaur", "Dish", "Dog", "Doll", "Dollar", "Door", "Double",
    "Dress", "Drink", "Driver", "Ear", "Early", "East", "Egg", "Elephant", "Email", "End",
    "Engine", "Evening", "Everywhere", "Example", "Eye", "Face", "Factory", "Fall", "Family", "Farm",
    "Fast", "Fat", "Father", "Favorite", "Field", "Film", "Finger", "Fire", "Fish", "Floor",
    "Flower", "Fly", "Food", "Foot", "Football", "Forest", "Fork", "Friday", "Friend", "Fruit",
    "Funny", "Game", "Garden", "Gas", "Gift", "Girl", "Glass", "Glove", "Goal", "Gold",
    "Grass", "Green", "Group", "Guitar", "Hair", "Half", "Hall", "Hand", "Happy", "Hat",
    "Head", "Health", "Heart", "Heavy", "Hello", "Help", "Hobby", "Holiday", "Home", "Horse",
    "Hospital", "Hot", "Hotel", "Hour", "House", "Hungry", "Husband", "Ice", "Idea", "Island",
    "Jacket", "Jam", "Jeans", "Job", "Juice", "Key", "King", "Kitchen", "Kite", "Knife",
    "Lake", "Lamp", "Language", "Laptop", "Last", "Laugh", "Leaf", "Left", "Leg", "Lesson",
    "Letter", "Library", "Light", "Line", "Lion", "Lip", "List", "Lunch", "Machine", "Magazine"
  ],
  "🇬🇧 English": [
    "Ability", "Absence", "Abundant", "Acceptance", "Accident", "Accurate", "Achieve", "Acquire", "Addition", "Adjust",
    "Admire", "Admit", "Advance", "Adventure", "Advice", "Afford", "Agency", "Agenda", "Agreement", "Alcohol",
    "Ambition", "Amount", "Amuse", "Analysis", "Ancient", "Anger", "Anxiety", "Apartment", "Apology", "Appearance",
    "Application", "Appointment", "Appreciate", "Approach", "Approval", "Argue", "Article", "Aspect", "Assessment", "Assist",
    "Assume", "Atmosphere", "Attach", "Attempt", "Attitude", "Attract", "Audience", "Average", "Avoid", "Aware",
    "Balance", "Bargain", "Barrier", "Behavior", "Benefit", "Beyond", "Blame", "Blanket", "Borrow", "Bother",
    "Boundary", "Branch", "Brave", "Breathe", "Brief", "Broad", "Budget", "Burden", "Business", "Cabinet",
    "Calculate", "Campaign", "Cancel", "Candidate", "Capacity", "Capture", "Career", "Careful", "Category", "Celebrate",
    "Century", "Certain", "Challenge", "Champion", "Channel", "Chapter", "Character", "Charity", "Chemical", "Choice",
    "Circumstance", "Citizen", "Claim", "Classic", "Climate", "Collapse", "Collection", "Combine", "Comfort", "Command",
    "Comment", "Commercial", "Commit", "Committee", "Common", "Community", "Compare", "Complain", "Complex", "Component",
    "Compose", "Compound", "Concentrate", "Concept", "Concern", "Condition", "Conduct", "Conference", "Confidence", "Confirm",
    "Conflict", "Confusion", "Connect", "Consequence", "Consider", "Consist", "Constant", "Construct", "Consume", "Contact",
    "Contain", "Content", "Context", "Continue", "Contract", "Contrast", "Contribute", "Control", "Convert", "Convince",
    "Corporate", "Correct", "Council", "Counter", "Courage", "Create", "Creative", "Credit", "Crime", "Crisis",
    "Critical", "Culture", "Currency", "Current", "Curve", "Custom", "Cycle", "Damage", "Danger", "Deadline",
    "Debate", "Debt", "Decade", "Decline", "Decorate", "Decrease", "Deep", "Defeat", "Defence", "Define",
    "Degree", "Delay", "Delicate", "Deliver", "Demand", "Democracy", "Demonstrate", "Deny", "Depend", "Deposit",
    "Depression", "Deserve", "Design", "Desire", "Destroy", "Detail", "Detect", "Determine", "Develop", "Device",
    "Diagram", "Diamond", "Difference", "Difficulty", "Digital", "Dimension", "Direction", "Director", "Disagree", "Disappear",
    "Disappoint", "Disaster", "Discourage", "Discover", "Disease", "Dismiss", "Display", "Distance", "Distinct", "Distinguish",
    "Distribute", "District", "Divide", "Division", "Document", "Domestic", "Dominant", "Dominate", "Donate", "Doubt",
    "Dramatic", "Dreadful", "Dream", "Drought", "Durable", "Dynamic", "Eager", "Economic", "Edition", "Educate",
    "Effective", "Efficient", "Effort", "Election", "Electric", "Elegant", "Element", "Eliminate", "Embarrass", "Emergency",
    "Emotion", "Emphasis", "Employ", "Empty", "Enable", "Encounter", "Encourage", "Endure", "Energy", "Enforce",
    "Engage", "Engine", "Enhance", "Enjoyment", "Enormous", "Ensure", "Entertain", "Enthusiasm", "Entire", "Entrance",
    "Environment", "Episode", "Equal", "Equip", "Equipment", "Error", "Escape", "Essential", "Establish", "Estimate",
    "Ethical", "Evaluate", "Event", "Evidence", "Evolution", "Exaggerate", "Examine", "Example", "Exceed", "Excellent",
    "Exception", "Exchange", "Excite", "Exclude", "Excuse", "Execute", "Exercise", "Exhaust", "Exhibit", "Exist",
    "Expand", "Expect", "Expense", "Experience", "Experiment", "Expert", "Explain", "Explore", "Export", "Expose",
    "Express", "Extend", "External", "Extra", "Extract", "Extreme", "Facility", "Factor", "Factory", "Failure",
    "Faith", "False", "Familiar", "Famous", "Fancy", "Fantastic", "Fashion", "Fatal", "Fault", "Favor",
    "Fear", "Feature", "Federal", "Fee", "Feedback", "Fellow", "Female", "Fence", "Festival", "Fetch",
    "Fiber", "Fiction", "Field", "Fierce", "Fight", "Figure", "File", "Filter", "Final", "Finance",
    "Finding", "Finger", "Finish", "Firm", "First", "Fiscal", "Fisher", "Fitness", "Fix", "Flame",
    "Flash", "Flat", "Flavor", "Flee", "Fleet", "Flesh", "Flexible", "Flight", "Float", "Flood",
    "Floor", "Flow", "Flower", "Fluid", "Focus", "Fold", "Follow", "Fond", "Food", "Fool",
    "Footage", "Forbid", "Force", "Forecast", "Foreign", "Forever", "Forget", "Forgive", "Formal", "Format",
    "Formation", "Fortune", "Forward", "Foundation", "Framework", "Freedom", "Frequency", "Frequent", "Frustrated", "Function",
    "Fundamental", "Furniture", "Further", "Future", "Gallery", "Gather", "General", "Generate", "Generation", "Generous",
    "Gentle", "Genuine", "Gesture", "Global", "Glory", "Goal", "Gossip", "Govern", "Grace", "Grade",
    "Gradual", "Graduate", "Grain", "Grammar", "Grand", "Grant", "Graphic", "Grateful", "Gravity", "Great",
    "Greed", "Grief", "Grocery", "Ground", "Growth", "Guarantee", "Guard", "Guess", "Guidance", "Guide",
    "Guilty", "Habit", "Handle", "Happen", "Harbor", "Hardly", "Harmful", "Harmony", "Harvest", "Hatred",
    "Hazard", "Health", "Hearing", "Heaven", "Height", "Heritage", "Hesitate", "Hidden", "Highlight", "Highly",
    "Highway", "History", "Holiday", "Hollow", "Honest", "Honor", "Horizon", "Horror", "Hospital", "Host",
    "Hostile", "Household", "Housing", "Huge", "Human", "Humble", "Humor", "Hunger", "Hunter", "Hurry",
    "Identify", "Ignore", "Illegal", "Illness", "Image", "Imagine", "Immediate", "Impact", "Imply", "Import"
  ],
  "🇬🇧 English Hardcore": [
    "Aberration", "Abnegation", "Acquiesce", "Alacrity", "Anachronistic", "Archetypal", "Ascetic", "Assiduous", "Beguile", "Blandishment",
    "Cajole", "Callous", "Camaraderie", "Candor", "Capitulate", "Carouse", "Caucus", "Circumlocution", "Clamor", "Cognizant",
    "Complacency", "Concomitant", "Conflagration", "Connive", "Consanguinity", "Contrite", "Convivial", "Cupidity", "Dearth", "Debauchery",
    "Demagogue", "Denigrate", "Despot", "Diaphanous", "Didactic", "Disparate", "Dissemble", "Ebullient", "Eclectic", "Effrontery",
    "Effulgent", "Egregious", "Enervate", "Ephemeral", "Equanimity", "Equivocal", "Exacerbate", "Exculpate", "Execrable", "Exigent",
    "Expedient", "Expunge", "Extant", "Extol", "Fallacious", "Fastidious", "Fatuous", "Fecund", "Feral", "Fetid",
    "Florid", "Fractious", "Garrulous", "Grandiloquent", "Gratuitous", "Hapless", "Hegemony", "Iconoclast", "Idiosyncratic", "Impecunious",
    "Impetuous", "Inchoate", "Incorrigible", "Inexorable", "Inimical", "Inscrutable", "Insidious", "Insolent", "Intransigent", "Inure",
    "Invective", "Inveterate", "Jubilant", "Juxtaposition", "Laconic", "Languid", "Largess", "Latent", "Legerdemain", "Licentious",
    "Lithe", "Maverick", "Mendacious", "Modicum", "Multifarious", "Munificent", "Nadir", "Neophyte", "Noisome", "Obdurate",
    "Obfuscate", "Obsequious", "Obstinate", "Obstreperous", "Palliate", "Panacea", "Paradigm", "Parsimony", "Paucity", "Pejorative",
    "Pellucid", "Penchant", "Penurious", "Perfidious", "Perfunctory", "Pernicious", "Perspicacity", "Pertinacious", "Petulant", "Platitude",
    "Plethora", "Portent", "Preclivity", "Preclude", "Precocious", "Predilection", "Prescient", "Probity", "Proclivity", "Promulgate",
    "Propensity", "Propitiate", "Propriety", "Prosaic", "Proscribe", "Protean", "Prurient", "Puerile", "Pugnacious", "Pulchritude",
    "Punctilious", "Quagmire", "Querulous", "Quiescent", "Quixotic", "Quotidian", "Rancor", "Recalcitrant", "Rectitude", "Redoubtable",
    "Refractory", "Refurbish", "Renounce", "Repentant", "Reprehensible", "Reprobate", "Repudiate", "Rescind", "Restive", "Reticent",
    "Revere", "Sagacity", "Salient", "Sanctimonious", "Sanguine", "Scurrilous", "Serendipity", "Servile", "Solicitous", "Solipsism",
    "Spurious", "Staid", "Stolid", "Stupefy", "Surfeit", "Surreptitious", "Sycophant", "Tacit", "Taciturn", "Tantamount",
    "Temerity", "Tenuous", "Timorous", "Torpid", "Tractable", "Transient", "Transmute", "Trenchant", "Truculent", "Turpitude",
    "Ubiquitous", "Umbrage", "Upbraid", "Utilitarian", "Vacillate", "Vacuous", "Vapid", "Variegated", "Venerable", "Veracity",
    "Vicarious", "Vicissitude", "Vilify", "Vituperate", "Vociferous", "Wanton", "Winsome", "Yoke", "Zealot", "Zenith",
    "Abjure", "Abrogate", "Abstemious", "Acumen", "Antebellum", "Auspicuous", "Belie", "Bellicose", "Bowdlerize", "Chicanery",
    "Churlish", "Circumnavigate", "Diffident", "Enfranchise", "Epiphany", "Equinox", "Euro", "Evanescent", "Expurgate", "Facetious",
    "Fatuous", "Feckless", "Fiduciary", "Filibuster", "Gauche", "Gerrymander", "Hegemony", "Hubris", "Hypotenuse", "Impeach",
    "Incognito", "Incontrovertible", "Inculcate", "Infrastructure", "Interpolate", "Irony", "Jejune", "Kowtow", "Laissez-faire", "Lexicon",
    "Loquacious", "Lugging", "Metamorphosis", "Moiety", "Nanotechnology", "Nihilism", "Nomenclature", "Nonsectarian", "Notarize", "Obsequious",
    "Omnipotent", "Oxidize", "Paleontology", "Paradigm", "Parameter", "Pecuniary", "Photosynthesis", "Plagiarize", "Plasma", "Polymer",
    "Precipice", "Quasar", "Quotidian", "Recapitulate", "Reciprocal", "Reparation", "Respiration", "Sanguine", "Soliloquy", "Subjugate",
    "Suffragist", "Supercilious", "Tautology", "Taxonomy", "Tectonic", "Tempestuous", "Thermodynamics", "Totalitarian", "Unctuous", "Usurp",
    "Vacuous", "Vehement", "Vortex", "Winnow", "Wrought", "Xenophobe", "Ziggurat", "Abstain", "Adversary", "Altruism", "Amicable", "Anachronistic",
    "Anecdote", "Animosity", "Antagonism", "Antiseptic", "Apathy", "Apocryphal", "Apparition", "Arbitrary", "Archaic", "Ardor",
    "Arrogance", "Articulate", "Artifice", "Asperity", "Aspiration", "Assail", "Assertion", "Astute", "Atrocity", "Atrophy",
    "Attenuate", "Audacious", "Augment", "Auspicious", "Austere", "Authentic", "Authoritarian", "Autonomy", "Aversion", "Baffle",
    "Banal", "Banality", "Benevolent", "Benign", "Berate", "Bereft", "Bewilder", "Blatant", "Blight", "Boisterous",
    "Bombastic", "Boorish", "Braggart", "Brevity", "Brusque", "Buffoon", "Bulwark", "Burgeon", "Cacophony", "Candid",
    "Capricious", "Carnage", "Castigate", "Catalyst", "Catharsis", "Caustic", "Censure", "Chastise", "Cherish", "Chivalry",
    "Choleric", "Chronicle", "Cipher", "Clairvoyant", "Clandestine", "Clemency", "Coalesce", "Coerce", "Coherent", "Cohesive",
    "Collaborate", "Colloquial", "Collusion", "Commemorate", "Commendable", "Commensurate", "Compassion", "Compatible", "Compelling", "Compendium",
    "Complacent", "Complement", "Compliance", "Composure", "Compromise", "Compulsion", "Compunction", "Concede", "Conceit", "Concentrate",
    "Conception", "Conciliatory", "Concise", "Conclusive", "Condone", "Conducive", "Confluence", "Conformity", "Confound", "Congenial",
    "Congregation", "Conjecture", "Conjure", "Connoisseur", "Conscientious", "Consecrate", "Consensus", "Consolation", "Consolidate", "Conspicuous",
    "Constituent", "Constraint", "Consummate", "Contemplation", "Contemporary", "Contempt", "Contentious", "Context", "Contingent", "Contortion",
    "Contraband", "Contradict", "Contravention", "Contrition", "Contrived", "Controversial", "Conundrum", "Convergence", "Conviction", "Convivial",
    "Copious", "Cordial", "Corollary", "Corroborate", "Corrosive", "Cosmopolitan", "Counsel", "Counterfeit", "Counterpart", "Covenant",
    "Covert", "Cower", "Crafty", "Craven", "Credence", "Credible", "Credulity", "Criterion", "Crucial", "Cryptic",
    "Culpable", "Culminate", "Cultivate", "Cumbersome", "Cunning", "Cursory", "Curtail", "Cynic", "Dally", "Daunt",
    "Dauntless", "Dearth", "Debase", "Debilitate", "Debunk", "Decorum", "Decry", "Deference", "Defiant", "Deficit",
    "Definitive", "Deflect", "Deft", "Defunct", "Degenerate", "Degradation", "Deity", "Delectable", "Delegate", "Deliberate",
    "Delineate", "Delude", "Deluge", "Demeanor", "Demise", "Demolish", "Demure", "Denounce", "Depict", "Deplete",
    "Deplorable", "Deportment", "Depravity", "Deprecate", "Depreciate", "Deride", "Derivative", "Derogatory", "Descry", "Desecrate",
    "Desolate", "Despondent", "Despotism", "Destitute", "Desultory", "Detached", "Deterrent", "Detrimental", "Deviate", "Devious"
  ],
  "🇺🇦 Відомі Українці": [
    "Тарас Шевченко", "Леся Українка", "Іван Франко", "Степан Бандера", "Валерій Залужний", "Григорій Сковорода", "Богдан Хмельницький", "Княгиня Ольга", "Костянтин Острозький", "Михайло Грушевський",
    "Ліна Костенко", "Василь Стус", "В'ячеслав Чорновіл", "Сергій Корольов", "Ігор Сікорський", "Микола Амосов", "Євген Коновалець", "Роман Шухевич", "Іван Мазепа", "Пилип Орлик",
    "Данило Галицький", "Володимир Великий", "Ярослав Мудрий", "Петро Сагайдачний", "Симон Петлюра", "Катерина Білокур", "Марія Примаченко", "Соломія Крушельницька", "Володимир Івасюк", "Квітка Цісик",
    "Андрій Шевченко", "Олександр Усик", "Василь Ломаченко", "Яна Клочкова", "Сергій Бубка", "Андрій Ярмоленко", "Михайло Мудрик", "Еліна Світоліна", "Ольга Харлан", "Лілія Подкопаєва",
    "Святослав Вакарчук", "Андрій Данилко", "Джамала", "Jerry Heil", "Артем Пивоваров", "Олег Скрипка", "Кузьма Скрябін", "Руслана Лижичко", "Сергій Жадан", "Юрій Андрухович",
    "Оксана Забужко", "Лесь Подерв'янський", "Майкл Щур", "Олексій Дурнєв", "Володимир Дантес", "Дмитро Монатік", "Надя Дорофєєва", "Макс Барських", "Тіна Кароль", "Оля Полякова",
    "Віталій Кличко", "Володимир Кличко", "Сергій Притула", "Ігор Лаченков", "Сергій Стерненко", "Михайло Федоров", "Дмитро Кулеба", "Кирило Буданов", "Олександр Сирський", "Василь Малюк",
    "Микола Леонтович", "Борис Патон", "Віктор Ющенко", "Павло Скоропадський", "Нестор Махно", "Дмитро Яворницький", "Микола Лисенко", "Олена Теліга", "Олег Ольжич", "Дмитро Донцов",
    "Пантелеймон Куліш", "Микола Гоголь", "Марко Вовчок", "Іван Нечуй-Левицький", "Панас Мирний", "Микола Костомаров", "Володимир Винниченко", "Алла Горська", "Павло Тичина", "Максим Рильський",
    "Олександр Довженко", "Іван Миколайчук", "Богдан Ступка", "Ада Роговцева", "Леонід Биков", "Назарій Яремчук", "Степан Гіга", "Іво Бобул", "Павло Зібров", "Віталій Білоножко",
    "Антон Тимошенко", "Василь Байдак", "Фелікс Редька", "Тарас Стадницький", "Віктор Розовий", "Марк Куцевалов", "Ігор Ласточкін", "Володимир Жогло", "Валентин Міхієнко", "Роман Щербан",
    "Михайло Коцюбинський", "Павло Чубинський", "Михайло Вербицький", "Іван Сірко", "Петро Калнишевський", "Максим Залізняк", "Іван Гонта", "Устим Кармелюк", "Олекса Довбуш", "Дмитро Вітовський",
    "Олена Пчілка", "Микола Хвильовий", "Михайль Семенко", "Валер'ян Підмогильний", "Микола Зеров", "Лесь Курбас", "Борис Грінченко", "Дмитро Чижевський", "Василь Симоненко", "Дмитро Павличко",
    "Олесь Гончар", "Григір Тютюнник", "Василь Земляк", "Михайло Стельмах", "Остап Вишня", "Володимир Сосюра", "Євген Маланюк", "Юрій Липа", "Олена Вітер", "Леонід Каденюк",
    "Слава Комісаренко", "Костянтин Трембовецький", "Євгеній Янович", "Андрій Лузан", "Микола Зирянов", "Петро Заставний", "Лос Подольськас", "Влад Куран", "Данило Повар", "Олександр Степаненко",
    "Бампер і Сус", "Володимир Черняк", "Артем Небіліцин", "Настя Зухвала", "Лєра Мандзюк", "Ганна Кочегура", "Аліна Блажкевич", "Вадим Дзюнько", "Андрій Щегель", "Сергій Чирков",
    "Раїса Кириченко", "Оксана Петрусенко", "Кіндрат Квітка", "Микола Стражеско", "Федір Яновський", "Микола Пирогов", "Данило Заболотний", "Ілля Мечников", "Микола Кащенко", "Климент Квітка",
    "Філарет Колесса", "Станіслав Людкевич", "Яків Степовий", "Кирило Стеценко", "Левко Ревуцький", "Борис Лятошинський", "Мирослав Скорик", "Євген Станкович", "Леся Дичко", "Іван Марчук",
    "Олександр Ройтбурд", "Тіберію Сільваші", "Анатолій Криволап", "Віктор Сидоренко", "Арсен Савадов", "Олег Тістол", "Марина Скугарєва", "Влада Ралко", "Ілля Чичкан", "Євген Коноплянка",
    "Олександр Зінченко", "Віталій Миколенко", "Ілля Забарний", "Віктор Циганков", "Роман Яремчук", "Сергій Ребров", "Валерій Лобановський", "Олег Блохін", "Ігор Бєланов", "Леонід Буряк",
    "Олександр Заваров", "Олексій Михайличенко", "Артем Мілевський", "Євген Селезньов", "Денис Берінчик", "Ярослава Магучіх", "Марина Бех-Романчук", "Жан Беленюк", "Парвіз Насібов", "Ірина Коляденко",
    "Олександр Абраменко", "Олена Білосюк", "Дмитро Підручний", "Андрій Дериземля", "Валентина Семеренко", "Віта Семеренко", "Юлія Джима", "Сергій Куліш", "Дар'я Білодід", "Георгій Зантарая",
    "Яків Хаммо", "Михайло Романчук", "Денис Силантьєв", "Олег Лісогор", "Анна Різатдінова", "Вікторія Мазур", "Влада Нікольченко", "Олена Кравець", "Олександр Пікалов", "Юрій Ткач",
    "Євген Кошовий", "Степан Казанін", "Олексій Потапенко", "Тарас Тополя", "Валерій Харчишин", "Дмитро Шуров", "Євген Філатов", "Ната Жижченко", "Альона Альона", "Клавдія Петрівна",
    "Сергій Лиховида", "Олександр Терен", "Маша Єфросиніна", "Леся Нікітюк", "Андрій Бєдняков", "Володимир Остапчук", "Олександр Скічко", "Тімур Мірошниченко", "Григорій Решетнік", "Дмитро Комаров",
    "Костянтин Грубич", "Ігор Кондратюк", "Тетяна Висоцька", "Наталія Мосейчук", "Марічка Падалко", "Алла Мазур", "Святослав Гринчук", "Євген Плінський", "Денис Бігус", "Юрій Бутусов",
    "Яніна Соколова", "Віталій Портников", "Олексій Гончаренко", "Антон Геращенко", "Давид Арахамія", "Руслан Стефанчук", "Денис Шмигаль", "Михайло Подоляк", "Олексій Резніков", "Рустем Умєров",
    "Юлія Свириденко", "Олександр Камишін", "Віктор Ляшко", "Оксен Лісовий", "Ігор Клименко", "Богдан Кротевич", "Святослав Паламар", "Денис Прокопенко", "Сергій Волинський", "Олег Сенцов",
    "Михайло Діанов", "Катерина Поліщук", "Дмитро Коцюбайло", "Тарас Чмут", "Меланія Подобєдова", "Михайло Поплавський", "Віталій Кім", "Микола Гоголь-Яновський", "Олександра Матвійчук", "Оксана Караванська",
    "Андре Тан", "Оксана Муха", "Андрій Хливнюк", "Тарас Компаніченко", "Ектор Хіменес-Браво", "Володимир Ярославський", "Ольга Мартиновська", "Євген Клопотенко", "Савва Лібкін", "Гарік Корогодський",
    "Олександр Слобоженко", "Дмитро Гордон", "Раміна Есхакзай", "Антон Птушкін", "Ян Гордієнко", "Олексій Шевцов", "Михайло Лебіга", "Володимир Носов", "Юрій Марченко", "Денис Казанський",
    "Роман Безус", "Артем Довбик", "Георгій Судаков", "Микола Шапаренко", "Олександр Караваєв", "Георгій Бущан", "Анатолій Трубін", "Олександр Шовковський", "Руслан Ротань", "Мирон Маркевич",
    "Віктор Поворознюк", "Чоткий Паца", "Дядя Жора", "Віктор Павлік", "Володимир Ткаченко", "Меловін", "Костянтин Бочаров", "Паліндром", "Іван Дорн", "Степан Пантера",
    "Пес Патрон", "Кіт Степан", "Вєрка Сердючка", "Володимир Зеленський", "Олена Зеленська", "Дмитро Разумков", "Петро Порошенко", "Марина Порошенко", "Віктор Пінчук", "Рінат Ахметов",
    "Андрій Веревський", "Валентин Резніченко", "Сергій Гайдай", "Олександр Прокудін", "Дмитро Живицький", "Олександр Старух", "Павло Кириленко", "Вадим Філашкін", "Іван Федоров", "Артем Лисогор",
    "Олександр Сирський", "Анатолій Трубін", "Артем Довбик", "Ілля Забарний", "Віталій Миколенко", "Михайло Мудрик", "Георгій Судаков", "Микола Шапаренко", "Віктор Циганков", "Роман Яремчук",
    "Дмитро Носов", "Богдан Буше", "Женя Галич", "Саша Бо", "Тетяна Песик", "Тарас Стадницький", "Руслан Ханумак", "Юрій Ткач", "Віталій Сап'янич", "Олександр Венгеренко",
    "Юлія Паєвська", "Василь Сліпак", "Петро Григоренко", "Мустафа Джемілєв", "Рефат Чубаров", "Ахтем Сеітаблаєв", "Наріман Джелял", "Емір-Усеїн Куку", "Олександр Кольченко", "Роман Ратушний"
  ],
  "🌟 Світові Зірки": [
    "Альберт Ейнштейн", "Ілон Маск", "Стів Джобс", "Білл Гейтс", "Марк Цукерберг", "Джефф Безос", "Нікола Тесла", "Леонардо да Вінчі", "Ісаак Ньютон", "Чарльз Дарвін",
    "Галілео Галілей", "Марі Кюрі", "Томас Едісон", "Стівен Гокінг", "Арістотель", "Платон", "Сократ", "Наполеон Бонапарт", "Юлій Цезар", "Александр Македонський",
    "Вінстон Черчилль", "Джордж Вашингтон", "Авраам Лінкольн", "Джон Кеннеді", "Барак Обама", "Дональд Трамп", "Джо Байден", "Борис Джонсон", "Еммануель Макрон", "Ангела Меркель",
    "Королева Єлизавета", "Принцеса Діана", "Махатма Ганді", "Мартін Лютер Кінг", "Нельсон Мандела", "Че Гевара", "Фідель Кастро", "Далай-лама", "Папа Франциск", "Мати Тереза",
    "Вільям Шекспір", "Йоганн Гете", "Данте Аліг'єрі", "Віктор Гюго", "Ернест Гемінґвей", "Джордж Орвелл", "Джон Толкін", "Стівен Кінг", "Джоан Роулінг", "Марк Твен",
    "Леонардо Ді Капріо", "Бред Пітт", "Том Круз", "Джонні Депп", "Кіану Рівз", "Роберт Дауні молодший", "Бенедикт Камбербетч", "Крістіан Бейл", "Райан Гослінг", "Хоакін Фенікс",
    "Мерил Стріп", "Анджеліна Джолі", "Скарлетт Йоганссон", "Дженніфер Еністон", "Наталі Портман", "Емма Вотсон", "Марго Роббі", "Зендея", "Енн Гетевей", "Ніколь Кідман",
    "Стівен Спілберг", "Крістофер Нолан", "Квентін Тарантіно", "Мартін Скорсезе", "Джеймс Кемерон", "Рідлі Скотт", "Альфред Гічкок", "Стенлі Кубрик", "Девід Фінчер", "Вес Андерсон",
    "Фредді Мерк'юрі", "Майкл Джексон", "Елвіс Преслі", "Девід Бові", "Джон Леннон", "Пол Маккартні", "Мік Джаггер", "Курт Кобейн", "Боб Ділан", "Джимі Гендрікс",
    "Мадонна", "Бейонсе", "Тейлор Свіфт", "Леді Гага", "Ріанна", "Адель", "Білі Айліш", "Дуа Ліпа", "Шакіра", "Брітні Спірс",
    "Кріштіану Роналду", "Ліонель Мессі", "Дієго Марадона", "Пеле", "Девід Бекхем", "Зінедін Зідан", "Майкл Джордан", "Кобі Браянт", "Леброн Джеймс", "Тайгер Вудс",
    "Мухаммед Алі", "Майк Тайсон", "Конор Макгрегор", "Роджер Федерер", "Рафаель Надаль", "Новак Джокович", "Льюїс Гемілтон", "Міхаель Шумахер", "Макс Ферстаппен", "Юсейн Болт",
    "Арнольд Шварценеггер", "Сільвестр Сталлоне", "Джекі Чан", "Брюс Лі", "Чак Норріс", "Жан-Клод Ван Дамм", "Джейсон Стетхем", "Двейн Джонсон", "Він Дізель", "Том Гарді",
    "Кілліан Мерфі", "Гері Олдмен", "Ентоні Гопкінс", "Морган Фрімен", "Аль Пачіно", "Роберт Де Ніро", "Джек Ніколсон", "Том Генкс", "Харрісон Форд", "Семюел Джексон",
    "Лана Дель Рей", "The Weeknd", "Бруно Марс", "Ед Шіран", "Джастін Бібер", "Каньє Вест", "Емінем", "Дрейк", "Снуп Догг", "Доктор Дре",
    "Пабло Пікассо", "Вінсент Ван Гог", "Сальвадор Далі", "Клод Моне", "Енді Воргол", "Мікеланджело", "Рафаель Санті", "Фріда Кало", "Бенксі", "Огюст Роден",
    "Вольфганг Моцарт", "Людвіг Бетховен", "Йоганн Бах", "Фредерік Шопен", "Антоніо Вівальді", "Ганс Циммер", "Джон Вільямс", "Еніо Морріконе", "Лучано Паваротті", "Андреа Бочеллі",
    "Опра Вінфрі", "Еллен Дедженерес", "Джиммі Феллон", "Гордон Рамзі", "Джеймі Олівер", "Беар Гріллс", "Стів Ірвін", "Девід Аттенборо", "Містер Біст", "П'юдіпай",
    "Мерілін Монро", "Одрі Гепберн", "Грейс Келлі", "Елізабет Тейлор", "Софі Лорен", "Бріжит Бардо", "Коко Шанель", "Крістіан Діор", "Джанні Версаче", "Карл Лагерфельд",
    "Зигмунд Фрейд", "Карл Юнг", "Фрідріх Ніцше", "Артур Шопенгауер", "Жан-Поль Сартр", "Альбер Камю", "Іммануїл Кант", "Рене Декарт", "Френсіс Бекон", "Томас Гоббс",
    "Христофор Колумб", "Васко да Гама", "Фернан Магеллан", "Марко Поло", "Джеймс Кук", "Руаль Амундсен", "Ніл Армстронг", "Юрій Гагарін", "Базз Олдрін", "Річард Бренсон",
    "Волт Дісней", "Стен Лі", "Джордж Лукас", "Хаяо Міядзакі", "Тім Бертон", "Гільєрмо дель Торо", "Пітер Джексон", "Клайв Льюїс", "Пауло Коельйо", "Харукі Муракамі",
    "Умберто Еко", "Габріель Маркес", "Франц Кафка", "Салман Рушді", "Орхан Памук", "Кадзуо Ісіґуро", "Мілан Кундера", "Маргарет Етвуд", "Вірджинія Вульф", "Джеймс Джойс",
    "Марсель Пруст", "Сімона де Бовуар", "Хорхе Луїс Борхес", "Хуліо Кортасар", "Чарльз Буковскі", "Джек Керуак", "Аллен Гінзберг", "Вільям Берроуз", "Хантер Томпсон", "Трумен Капоте",
    "Харпер Лі", "Джон Стейнбек", "Вільям Фолкнер", "Скотт Фіцджеральд", "Олдос Хакслі", "Рей Бредбері", "Айзек Азімов", "Артур Кларк", "Філіп Дік", "Френк Герберт",
    "Урсула Ле Гуїн", "Террі Пратчетт", "Ніл Гейман", "Патрік Зюскінд", "Ден Браун", "Стіг Ларссон", "Ю Несбьо", "Клайв Баркер", "Говард Лавкрафт", "Едгар Аллан По",
    "Роберт Оппенгеймер", "Алан Тюрінг", "Річард Фейнман", "Ервін Шредінгер", "Вернер Гейзенберг", "Макс Планк", "Нільс Бор", "Енріко Фермі", "Майкл Фарадей", "Джеймс Максвелл",
    "Грегор Мендель", "Луї Пастер", "Роберт Кох", "Александр Флемінг", "Річард Докінз", "Ніл Деграсс Тайсон", "Карл Саган", "Мічіо Кайку", "Юваль Ной Харарі", "Джордан Пітерсон",
    "Славой Жижек", "Ноам Чомскі", "Френсіс Фукуяма", "Сем Гарріс", "Крістофер Гітченс", "Джек Ма", "Мукеш Амбані", "Віталік Бутерін", "Сатоші Накамото", "Павло Дуров",
    "Джуліан Ассанж", "Едвард Сноуден", "Шеріл Сендберг", "Рід Хастінгс", "Тім Кук", "Джоні Айв", "Ренцо П'яно", "Заха Хадід", "Норман Фостер", "Френк Герри",
    "Бука Сука Дімка", "Нана Акуффо-Аддо", "Джонні Нгуєн", "Джет Лі", "Чоу Юньфат", "Кен Ватанабе", "Хідетака Міядзакі", "Хідео Кодзіма", "Шигеру Міямото", "Такеші Кітано",
    "Акіра Куросава", "Бон Джун Хо", "Пак Чхан Ук", "Ден Сяопін", "Мао Цзедун", "Хо Ші Мін", "Кім Чен Ин", "Кім Чен Ір", "Пак Кин Хе", "Сінзо Абе",
    "Нарендра Моді", "Джавахарлал Неру", "Індіра Ганді", "Акшай Кумар", "Амітабх Баччан", "Шахрух Хан", "Пріянка Чопра", "Айшварія Рай", "Стівен Сігал", "Дольф Лундгрен",
    "Денні Трехо", "Бенісіо дель Торо", "Антоніо Бандерас", "Сальма Гаєк", "Пенелопа Крус", "Хав'єр Бардем", "Гаель Гарсія Берналь", "Пабло Ескобар", "Хоакін Гусман", "Евіта Перон",
    "Кофі Аннан", "Десмонд Туту", "Муаммар Каддафі", "Ясір Арафат", "Саддам Хусейн", "Усама бен Ладен", "Аятолла Хомейні", "Мохаммед бін Салман", "Реджеп Ердоган", "Олаф Шольц",
    "Анджей Дуда", "Дональд Туск", "Віктор Орбан", "Роберт Фіцо", "Зузана Чапутова", "Джорджа Мелоні", "Урсула фон дер Ляєн", "Грета Тунберг", "Малала Юсуфзай", "Нік Вуйчіч",
    "Тоні Роббінс", "Роберт Кіосакі", "Джордан Белфорт", "Саймон Сінек", "Гарі Вайнерчук", "Логан Пол", "Джейк Пол", "Кейсі Найстат", "Маркес Браунлі", "Джо Роган",
    "Лекс Фрідман", "Ендрю Хаберман", "Девід Гоггінс", "Натаніель Ротшильд", "Джон Рокфеллер", "Генрі Форд", "Ендрю Карнегі", "Джон Морган", "Конрад Аденауер", "Шарль де Голль",
    "Маргарет Тетчер", "Рональд Рейган", "Михайло Горбачов", "Лех Валенса", "Вацлав Гавел", "Мустафа Кемаль Ататюрк", "Голда Меїр", "Сі Цзіньпін", "Джастін Трюдо", "Майя Санду",
    "Тімоті Шаламе", "Том Голланд", "Роберт Паттінсон", "Крістен Стюарт", "Дакота Джонсон", "Джеймі Дорнан", "Генрі Кавілл", "Джейсон Момоа", "Езра Міллер", "Амбер Герд"
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