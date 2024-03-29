const getFile = async () => {
    try {
      const response = await fetch('./cats.csv');
      const result = await response.text();
      return result;
    } catch (err) {
      console.log('Error getting the CSV file!');
      console.log(err);
    }
  };

  function copyEng() { //кнопка копирования английского текста
    var copyEngTranslation = document.getElementById("outputEN");
    copyEngTranslation.select();
    navigator.clipboard.writeText(copyEngTranslation.value);

    var tooltipbtn = document.getElementById("translateTooltipEng");
    tooltipbtn.textContent = "Перевод скопирован";
  };

  function copyRus() { //кнопка копирования русского текста
    var copyRusTranslation = document.getElementById("outputRU");
    copyRusTranslation.select();
    navigator.clipboard.writeText(copyRusTranslation.value);

    var tooltipbtn = document.getElementById("translateTooltipRus");
    tooltipbtn.textContent = "Перевод скопирован";
  };

  function copyZh() { //кнопка копирования китайского текста
    var copyZhTranslation = document.getElementById("outputZH");
    copyZhTranslation.select();
    navigator.clipboard.writeText(copyZhTranslation.value);

    var tooltipbtn = document.getElementById("translateTooltipZh");
    tooltipbtn.textContent = "Перевод скопирован";
  };

  function outFuncEng () { //наведение курсора на кнопку перевода
    var tooltipbtn = document.getElementById("translateTooltipEng");
    tooltipbtn.textContent = "Скопировать перевод";
  };

  function outFuncRus () { //наведение курсора на кнопку перевода
    var tooltipbtn = document.getElementById("translateTooltipRus");
    tooltipbtn.textContent = "Скопировать перевод";
  };

  function outFuncZh () { //наведение курсора на кнопку перевода
    var tooltipbtn = document.getElementById("translateTooltipZh");
    tooltipbtn.textContent = "Скопировать перевод";
  };
  
  const allMyCode = async () => {
  
    const myFile = await getFile();

    const mySearchButton = document.querySelector('button');
    const myTextArea = document.querySelector('#input');
    const outputEN = document.querySelector('#outputEN');
    const outputRU = document.querySelector('#outputRU');
    const outputZH = document.querySelector('#outputZH');
    const outputID = document.querySelector('#outputID'); // TemplateID

    myTextArea.addEventListener(`click`, function () { // Remove text on click, но костылями
      if (myTextArea.value === 'Вставьте названия предметов') {
      myTextArea.value = '';
      }
    });

    mySearchButton.addEventListener('click', function () {
      outputEN.value = '';
      outputRU.value = '';
      outputZH.value = '';
      outputID.value = '';
      searchTerms = myTextArea.value.split('\n');
      const results = searchTerms.map(function(searchTerm) {
        searchTerm = searchTerm.replace(/^-\s*/, "");
        return translateOneLine(searchTerm);
            });
  
      results.forEach(function (result) {
        result.forEach(function (phrase) {
          if (phrase.lang === 'EN') {
            outputEN.value += "- " + phrase.name + '\n';
          }
          if (phrase.lang === 'RU') {
            outputRU.value += "- " + phrase.name + '\n';
          }
          if (phrase.lang === 'ZH') {
            outputZH.value += "- " + phrase.name + '\n';
          }
          if (phrase.lang === 'ID') {
            outputID.value += phrase.name + '\n';
          }
        });
      });
    });


    translateUltButton.addEventListener('click', function (){
        ultCashOutput.value = "- " + document.getElementById('ultCashInput').value + " Ультимативной валюты" + '\n' + "- " + document.getElementById('ultCashInput').value + " Ult Cash" + '\n' + "- " + document.getElementById('ultCashInput').value + " 终极现金";
    });

    translateTokensButton.addEventListener('click', function (){
        tokensOutput.value = "- " + document.getElementById('tokensInput').value + " Токенов" + '\n' + "- " + document.getElementById('tokensInput').value + " Ultimate Tokens" + '\n' + "- " + document.getElementById('tokensInput').value + " 终极代币货币";
    });

    translateJokersButton.addEventListener('click', function (){
        jokersOutput.value = "- " + document.getElementById('jokersInput').value + " Карточек Джокера" + '\n' + "- " + document.getElementById('jokersInput').value + " Joker Cards" + '\n' + "- " + document.getElementById('jokersInput').value + " 王牌";
    });
  
    function translateOneLine(searchTerm) {
      function processLine(line) {
        const found = line.toLowerCase().includes(searchTerm.toLowerCase());
        return found;
      }
  
      function getTranslations(phrase, index) {
        const validPhrase = phrase.toLowerCase() !== searchTerm.toLowerCase();
        const languages = ['ID', 'EN', 'RU', 'ZH'];
  
        if (validPhrase) {
          const obj = { name: phrase, lang: languages[index] };
          translationObjects.push(obj);
        }
      }
  
      const lines = myFile.split('\n');
      const myLine = lines.find(processLine);
      const phrases = myLine.split(';');
      const translationObjects = [];
      phrases.forEach(getTranslations);
  
      return translationObjects;
    };
  };
  
  function convertDate() {
    var dateInput = document.getElementById('dateInput').value; 
    var dateParts = dateInput.split(" ")[0].split("/"); 
    var timeParts = dateInput.split(" ")[1].split(":"); 

    var dateObject = new Date(Date.UTC(2023, dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1]));

    var optionsEN = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
    var dateStringEN = new Intl.DateTimeFormat('en-GB', optionsEN).format(dateObject);
    dateStringEN = dateStringEN.replace("GMT", "UTC"); 

    var optionsRU = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
    var dateStringRU = new Intl.DateTimeFormat('ru-RU', optionsRU).format(dateObject);
    dateStringRU = dateStringRU.replace("GMT", "МСК");

    var dateStringZH = dateStringEN;

    document.getElementById('dateResult').innerHTML = "English: " + dateStringEN + "<br/>Russian: " + dateStringRU + "<br/>Chinese: " + dateStringZH;
}

  allMyCode();
  