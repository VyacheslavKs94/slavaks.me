//let transDone = document.querySelector("transDone"); // переменная для вывода текста
//const btn = document.querySelector("#btn"); // константа (не меняющаяся) для кнопки перевода
//const textInp = document.querySelector("textarea"); // константа (не меняющаяся) для ввода текста

// let request = new XMLHttpRequest(); // запрос на открытие файла в дб
// request.open('GET', 'csv.csv', true);

// document.getElementById(addthetext).innerHTML = "This is text";

const searchTerm = 'ковш бульдозера';

const myFile = `English (EN);Russian (RU);Chinese (ZH)
Cutter repulse;Импульс резчика;切割机反推器
Corsair Harpoon;Гарпун корсара;海盗船鱼叉
Dozer forklift;Ковш бульдозера;推土机铲车`;

function processLine(line) {
	const found = line.toLowerCase().includes(searchTerm);
  return found;
}

function getTranslations(word) {
	return word.toLowerCase() !== searchTerm; // 'проныра' === 'проныра' // true
}

const lines = myFile.split('\n'); // ["Russian,English,Chinese", "Проныра,Sneaky,滑头", "Вячеслав,Alaric,奥利亚"]

const myLine = lines.find(processLine); // "Проныра,Sneaky,滑头"

const words = myLine.split(';'); // ["Проныра", "Sneaky", "滑头"]

const translations = words.filter(getTranslations); // ["Sneaky", "滑头"]

console.log(translations);