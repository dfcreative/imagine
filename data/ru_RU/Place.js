/*
	Place-related properties;
	TODO: make list of countries loaded via gmaps etc
*/
var place = {
	"cityPrefix": ["город", "село", "аул", "деревня", "поселение"],

	"regionSuffix": ["область"],

	"streetPrefix": ["пер.", "ул.", "пр.", "шоссе", "пл.", "бульвар","въезд", "спуск", "проезд", "наб."],

	"country": ["Украина", "Российская Федерация", "США", "Канада", "Австралия", "Австрия", "Азербайджан", "Аландские острова", "Албания", "Алжир", "Американские острова Самоа", "Ангилья","Ангола", "Андорра", "Антарктика", "Антигуа и Барбуда", "Аргентина", "Армения","Аруба", "Афганистан, Исламская Республика", "Багамы", "Бангладеш", "Барбадос", "Бахрейн",        "Белиз", "Белоруссия", "Бельгия", "Бермудские Острова", "Болгария", "Боливия","Босния и Герцеговина", "Ботсвана", "Бразилия", "Британская территория Индийского океана","Бруней Даруссалам", "Буркина Фасо", "Бурунди", "Бутан", "Вануату","Великобритания", "Венгрия", "Венесуэла", "Виргинские о-ва, Великобритания", "Виргинские о-ва, США","Восточный Тимор", "Вьетнам", "Габон", "Гаити", "Гайана","Гамбия", "Гана", "Гваделупа", "Гватемала", "Гвинея","Гвинея-Биссау", "Германия", "Гибралтар", "Гонгконг", "Гондурас","Государство-город Ватикан", "Гренада", "Гренландия", "Греция", "Грузия","Гуам", "Дания", "Джерси", "Джибути", "Доминиканская Республика","Египет", "Замбия", "Западная Сахара", "Зимбабве", "Израиль","Индия", "Индонезия", "Иордания", "Ирак", "Иран","Ирландия", "Исландия", "Испания", "Италия", "Йемен","Казахстан, Республика", "Каймановы Острова", "Камбоджа", "Камерун", "Катар","Кения", "Кипр", "Кирибати", "Китай", "Кокосовые острова","Колумбия", "Коморские Острова", "Конго, Демократическая Республика", "Конго, Республика", "Коста-Рика","Кот-д’Ивуар", "Куба", "Кувейт", "Кыргызстан", "Лаос","Латвия", "Лесото", "Либерия", "Ливан", "Ливия","Литва", "Лихтенштейн", "Люксембург", "Маврикий", "Мавритания","Мадагаскар, Республика", "Майотта", "Макао", "Македония, Республика", "Малави","Малайзия", "Мали", "Мальдивы", "Мальта", "Марокко","Мартиник", "Маршалловы Острова", "Мексика", "Мелкие отдаленные острова США", "Мозамбик","Молдова", "Монако", "Монголия", "Монтсеррат", "Мьянма","Намибия", "Науру", "Непал", "Нигерия", "Нигерия","Нидерландские Антильские острова", "Нидерланды", "Никарагуа", "Ниуэ", "Новая Зеландия","Новая Каледония", "Норвегия", "Объединённые Арабские Эмираты", "О. Гернси", "Оман","Острова Зеленого Мыса", "Острова Кука", "Острова Теркс И Кайкос", "Острова Уоллис и Футуна", "Острова Херд и Макдональд","Остров Буве", "Остров Доминика", "Остров Мэн", "Остров Норфолк", "Остров Святого Мартина","Остров Святой Елены", "О. Южная Георгия И Южные Сандвичевы Острова", "Пакистан", "Палау", "Палестина","Панама", "Папуа-Новая Гвинея", "Парагвай", "Перу", "Питкерн", "Польша", "Португалия", "Пуэрто-Рико", "Реюньон", "Рождественские острова","Руанда", "Румыния", "Сальвадор", "Самоа", "Сан-Марино","Сан-Томе и Принсипи", "Саудовская Аравия", "Свазиленд", "Северная Корея", "Северные Марианские Острова","Сейшельские Острова", "Сен-Бартельми", "Сенегал", "Сен-Пьер и Микелон", "Сент-Винсент и Гренадины","Сент-Киттс и Невис", "Сент-Люсия", "Сербия", "Сербия и Черногория, Государственный Союз", "Сингапур","Сирия", "Словацкая республика", "Словения", "Соломонские острова", "Сомали","Судан", "Суринам", "Сьерра-Леоне", "Таджикистан", "Тайвань","Тайланд", "Танзания", "Того", "Токелау", "Тонга","Тринидад и Тобаго", "Тувалу", "Тунис", "Туркмения", "Турция","Уганда", "Узбекистан", "Уругвай", "Фарерские острова", "Федеративные Штаты Микронезии","Фиджи", "Филиппины", "Финляндия", "Фолклендские о-ва", "Франция","Французская Гвинея", "Французская Полинезия", "Французские Южные Территории", "Хорватия", "Чад","Черногория", "Чешская Республика", "Чили", "Швейцария", "Швеция","Шпицберген и Ян-Майен", "Шри-Ланка", "Эквадор", "Экваториальная Гвинея", "Эритрея","Эстония", "Эфиопия", "Южная Корея", "Южно-Африканская Республика", "Ямайка", "Япония"],


	"region": ["Амурская", "Архангельская", "Астраханская", "Белгородская", "Брянская","Владимирская", "Волгоградская", "Вологодская", "Воронежская", "Ивановская","Иркутская", "Калининградская", "Калужская", "Кемеровская", "Кировская","Костромская", "Курганская", "Курская", "Ленинградская", "Липецкая","Магаданская", "Московская", "Мурманская", "Нижегородская", "Новгородская","Новосибирская", "Омская", "Оренбургская", "Орловская", "Пензенская","Псковская", "Ростовская", "Рязанская", "Самарская", "Саратовская","Сахалинская", "Свердловская", "Смоленская", "Тамбовская", "Тверская","Томская", "Тульская", "Тюменская", "Ульяновская", "Челябинская","Читинская", "Ярославская"],

	"city": ["Балашиха", "Видное", "Волоколамск", "Воскресенск", "Дмитров","Домодедово", "Дорохово", "Егорьевск", "Зарайск", "Истра","Кашира", "Клин", "Коломна", "Красногорск", "Лотошино","Луховицы", "Люберцы", "Можайск", "Москва", "Мытищи","Наро-Фоминск", "Ногинск", "Одинцово", "Озёры", "Орехово-Зуево","Павловский Посад", "Подольск", "Пушкино", "Раменское", "Сергиев Посад","Серебряные Пруды", "Серпухов", "Солнечногорск", "Ступино", "Талдом","Чехов", "Шатура", "Шаховская", "Щёлково"],

	"street": ["Косиора", "Ладыгина", "Ленина", "Ломоносова", "Сталина", "Печорина", "Макарова", "Маяковского", "Немцова", "Татарского", "Строителей", "Непокоренных", "Пионеров", "Труда", "Гегеля", "Академиков"]

	"postcode": ["######","######","#####"]
}