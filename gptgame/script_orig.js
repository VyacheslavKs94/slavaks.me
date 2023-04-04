document.addEventListener("DOMContentLoaded", function () {
    const [startButton, characterSelection, classSelection, characters, classes, nicknameSelection, nicknameInput, chooseNicknameButton] = ["start-button", "character-selection", "class-selection", "characters", "classes", "nickname-selection", "nickname-input", "choose-nickname-button"].map(id => document.getElementById(id));
    let chosenCharacter = "", chosenClass = null;
    const keysPressed = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, a: false, s: false, d: false };

    const logs = [];
    const LOG_SIZE_MULTIPLIER = 2;
    const LOG_TOUCH_INTERVAL = 2000;

      function handleEnemyTouchesLogs(enemy) {
        const log = logs.find(
          (log) =>
            Math.abs(log.y - enemy.y) < 40 &&
            log.x > enemy.x &&
            log.x < enemy.x + 40 * LOG_SIZE_MULTIPLIER
        );
      
        if (log && log.touchCooldown <= 0) {
          log.touches++;
          log.touchCooldown = LOG_TOUCH_INTERVAL;
      
          if (log.touches >= 3) {
            logs = logs.filter((l) => l !== log);
          }
        }
      }

      document.addEventListener("keydown", (event) => {
        if (keysPressed.hasOwnProperty(event.key)) {
            keysPressed[event.key] = true;
        }
        if (event.key === "E" && player.className === "Lumberjack") {
            logs.push({ x: player.x + 40, y: player.y, touches: 0, size: 160 });
        }
    });    
    
    document.addEventListener("keyup", (event) => {
        if (keysPressed.hasOwnProperty(event.key)) {
            keysPressed[event.key] = false;
        }
    });

const startWithoutTutorialButton = document.getElementById("start-button");
const startWithTutorialButton = document.getElementById("start-button-tutorial");
const debugButton = document.getElementById("debug-button");

startWithoutTutorialButton.addEventListener("click", () => {
  startWithTutorialButton.classList.add("hidden");
  debugButton.classList.add("hidden");
});
    
    const addEventListenerToElem = (elem, eventType, listener) => elem.addEventListener(eventType, listener);

    addEventListenerToElem(startButton, "click", () => {
        characterSelection.classList.remove("hidden");
        startButton.classList.add("hidden");
        document.getElementById("worldwide-emoji").classList.add("hidden");
    });

    addEventListenerToElem(document.getElementById("debug-button"), "click", () => {
        [chosenCharacter, chosenClass, player.nickname] = ["🦊", { emoji: "🪓", name: "Lumberjack" }, "MrFreemanBBQ"];
        ["start-button", "worldwide-emoji"].forEach(id => document.getElementById(id).classList.add("hidden"));
        startGame(chosenClass);
    });

    const makeButtonsFromList = (container, list, onClick) => list.forEach((item) => {
        const element = document.createElement("button");
        element.textContent = item;
        element.addEventListener("click", () => onClick(item));
        container.appendChild(element);
    });

    makeButtonsFromList(characters, ["🥷", "🧑‍🎤", "🦊"], (character) => {
        characterSelection.classList.add("hidden");
        classSelection.classList.remove("hidden");
        chosenCharacter = character;
    });

    const classOptions = [{ emoji: "🪓", name: "Lumberjack" }, { emoji: "💣", name: "Demoman" }, { emoji: "🔫", name: "Sniper" }, { emoji: "🤖", name: "Robospy" }];

    classOptions.forEach((classOption) => {
        const classElement = document.createElement("span");
        classElement.textContent = classOption.emoji;
        classElement.addEventListener("click", (event) => {
            classSelection.classList.add("hidden");
            nicknameSelection.classList.remove("hidden");
            chosenClass = classOptions.find(option => option.emoji === event.target.textContent);
        });
        classes.appendChild(classElement);
    });    
    
    addEventListenerToElem(chooseNicknameButton, "click", () => {
        const len = nicknameInput.value.length;
        if (len >= 3 && len <= 12) {
            player.nickname = nicknameInput.value;
            nicknameSelection.classList.add("hidden");
            startGame(chosenClass);
        } else {
            alert(`Nickname should not be ${len < 3 ? "shorter" : "longer"} than ${len < 3 ? "3" : "12"} characters.`);
        }
    });   

    function updateBullets(enemies) {
        enemies.forEach((enemy) => {
            enemy.bullets.forEach((bullet, index) => {
                bullet.x -= 10;
                if (bullet.x < 0) {
                    enemy.bullets.splice(index, 1);
                }
            });
        });
    }

    function startGame(classOption) {
        const gameCanvas = document.getElementById("game");
        gameCanvas.classList.remove("hidden");
    
        gameCanvas.width = document.documentElement.clientWidth;
        gameCanvas.height = document.documentElement.clientHeight;
    
        player.character = chosenCharacter;
        player.className = classOption.name;
        player.classEmoji = classOption.emoji;
    
        setInterval(() => shootBullets(enemies), 1500);
    
        function getRandomEnemy() {
            const enemyList = ['⊂(◉‿◉)つ', '╰(*°▽°*)╯'];
            const randomIndex = Math.floor(Math.random() * enemyList.length);
            return { character: enemyList[randomIndex], scale: 1 / 1.5 };
        }        
        const minX = gameCanvas.width * 0.9;
        const maxY = gameCanvas.height - 80;
        const maxX = gameCanvas.width * 0.95 - 40;
        
        const numberOfEnemies = 10;
        const enemies = [];

        for (let i = 0; i < numberOfEnemies; i++) {
            enemies.push({
                x: minX + Math.random() * (maxX - minX),
                y: Math.random() * maxY * 0.8, 
                z: Math.random() * maxY,
                speed: 1,
                ...getRandomEnemy(),
                bullets: [],
                health: 3,
                touchCooldown: 0,
            });
        }

        function shootBullets(enemies) {
            enemies.forEach((enemy) => {
                enemy.bullets.push({ x: enemy.x - 40, y: enemy.y - 20 });
            });
        }        
    
        draw(enemies);
    }
   
    document.addEventListener("keydown", (event) => {
        const key = event.key.toLowerCase();
        if (!keysPressed.hasOwnProperty(key)) {
            keysPressed[key] = true;
        }
        if (key === "e" && player.className === "Lumberjack") {
            logs.push({ x: player.x + 40, y: player.y, touches: 0, size: 160 });
        }
    });     
    
    document.addEventListener("keyup", (event) => {
        if (keysPressed.hasOwnProperty(event.key)) {
            keysPressed[event.key] = false;
        }
    });

    const player = {
        x: window.innerWidth * 0.15,
        y: window.innerHeight * 0.4,
        speed: 3,
        character: "",
        className: "",
        classEmoji: "",
    };

    function updatePlayerPosition() {
        const gameCanvas = document.getElementById("game");
    
        const numberOfRoads = 14;
        const roadSpacing = gameCanvas.height / (numberOfRoads + 1);
        const closestRoad = Math.round(player.y / roadSpacing);
        const closestRoadY = roadSpacing * closestRoad;
    
        if (keysPressed.ArrowUp || keysPressed.w) {
            if (!keysPressed.moveUp) {
                keysPressed.moveUp = true;
                player.y = Math.max(closestRoadY - roadSpacing, player.y - roadSpacing);
            }
        } else {
            keysPressed.moveUp = false;
        }
        if (keysPressed.ArrowDown || keysPressed.s) {
            if (!keysPressed.moveDown) {
                keysPressed.moveDown = true;
                player.y = Math.min(closestRoadY + roadSpacing, player.y + roadSpacing);
            }
        } else {
            keysPressed.moveDown = false;
        }
        if (keysPressed.ArrowLeft || keysPressed.a) {
            player.x = Math.max(gameCanvas.width * 0.1 + 20, player.x - player.speed);
        }
        if (keysPressed.ArrowRight || keysPressed.d) {
            player.x = Math.min(gameCanvas.width * 0.8 - 40, player.x + player.speed);
        }
    
        if (player.y < 0) {
            player.y = 0;
        } else if (player.y > gameCanvas.height) {
            player.y = gameCanvas.height;
        }
    }
        
    let lastEnemyUpdate = 0;
    const currencies = [];

    function updateEnemy(enemies, gameCanvas) {
        const numberOfRoads = 14;
        const roadSpacing = gameCanvas.height / (numberOfRoads + 1);
    
        enemies.forEach((enemy) => {
            const logInFront = logs.find(log => Math.abs(log.y - enemy.y) < log.size / 2 && enemy.x - log.x < log.size && enemy.x - log.x > -log.size);
    
            if (logInFront) {
                if (enemy.touchCooldown <= 0) {
                    logInFront.touches += 1;
                    enemy.touchCooldown = 2;
                    if (logInFront.touches >= 3) {
                        logs.splice(logs.indexOf(logInFront), 1);
                    }
                } else {
                    enemy.touchCooldown -= 1/30;
                }
            } else {
                enemy.x -= enemy.speed;
            }
    
            if (Math.random() < 0.05) { 
                const currentRoad = Math.round(enemy.y / roadSpacing);
                const nextRoad = Math.max(1, Math.min(numberOfRoads, currentRoad + Math.round(Math.random() * 2) - 1));
                enemy.y = roadSpacing * nextRoad;
            }
        });
    }    
    
    function drawRoads(ctx, gameCanvas) {
        const numberOfRoads = 14;
        const roadSpacing = gameCanvas.height / (numberOfRoads + 1);
    
        ctx.setLineDash([5, 15]);
        ctx.lineWidth = 7;
        ctx.strokeStyle = 'grey';
    
        for (let i = 1; i <= numberOfRoads; i++) {
            const yPos = roadSpacing * i;
            ctx.beginPath();
            ctx.moveTo(gameCanvas.width * 0.1, yPos);
            ctx.lineTo(gameCanvas.width * 0.8, yPos);
            ctx.stroke();
        }
    
        ctx.setLineDash([]); 
    }       

    function draw(enemies) {
        const gameCanvas = document.getElementById("game");
        const ctx = gameCanvas.getContext("2d");
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        drawRoads(ctx, gameCanvas);
    
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(gameCanvas.width * 0.8, 0);
        ctx.lineTo(gameCanvas.width * 0.8, gameCanvas.height);
        ctx.stroke();
    
        updatePlayerPosition();
        updateEnemy(enemies, gameCanvas);
    
        ctx.font = "40px 'Bebas Neue'";
        ctx.fillStyle = "black";
        ctx.fillText(player.character, player.x, player.y);

        ctx.font = `calc(40px * ${LOG_SIZE_MULTIPLIER}) 'Bebas Neue'`;
        ctx.fillStyle = "brown";
        logs.forEach((log) => {
            ctx.font = "40px 'Bebas Neue'";
            ctx.fillStyle = "black";
            ctx.fillText("🪵", log.x, log.y);
        });
      
        // Handle enemy touches
        enemies.forEach((enemy) => {
          handleEnemyTouchesLogs(enemy);
        });
    
        enemies.forEach((enemy, index) => {
        
            ctx.font = `calc(40px * ${enemy.scale}) 'Bebas Neue'`;
            ctx.fillStyle = "white"; 
            ctx.fillText(enemy.character, enemy.x, enemy.y);
            enemy.bullets.forEach((bullet) => {
                ctx.font = "30px 'Bebas Neue'";
                ctx.fillStyle = "white";
                ctx.fillText("(___|", bullet.x, bullet.y);
            });

            const distance = Math.sqrt(Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2));
            if (distance < 40) {
                if (enemy.health > 1) {
                    enemy.health -= 1;
                    ctx.font = "40px 'Bebas Neue'";
                    ctx.fillStyle = "red";
                    ctx.fillText("💢", enemy.x + 20, enemy.y - 20);
                    setTimeout(() => {
                        enemy.character = getRandomEnemy().character;
                    }, 50);
                    setTimeout(() => {
                        enemy.character = getRandomEnemy().character;
                    }, 100);
                    setTimeout(() => {
                        enemy.character = getRandomEnemy().character;
                    }, 150);
                } else {

            const currencySymbols = ["💵", "💶", "💷"];
            const randomIndex = Math.floor(Math.random() * currencySymbols.length);
            const currencySymbol = currencySymbols[randomIndex];
            console.log(currencySymbol); 
            
            ctx.font = "40px 'Bebas Neue'";
            ctx.fillStyle = "yellow";
            ctx.fillText(currencySymbol, enemy.x, enemy.y);
            
            const currency = {
                symbol: currencySymbol,
                x: enemy.x,
                y: enemy.y,
            };
            currencies.push(currency);
            
            enemies.splice(index, 1);
        }
        }
      });

      ctx.font = "40px 'Bebas Neue'";
    currencies.forEach((currency) => {
        ctx.fillText(currency.symbol, currency.x, currency.y);
    });
        
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(gameCanvas.width * 0.1, 0);
        ctx.lineTo(gameCanvas.width * 0.1, gameCanvas.height);
        ctx.stroke();
    
        //"Player base"
        ctx.save();
        ctx.translate(gameCanvas.width * 0.09, gameCanvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "center";
        ctx.font = "90px 'Bebas Neue'";
        ctx.fillStyle = "white";
        ctx.fillText(`🏠 ${player.nickname} Base 🏠`, 0, 0);
        ctx.restore();

        //"Enemy spawn" text
        ctx.save();
        ctx.translate(gameCanvas.width - 25, gameCanvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "center";
        ctx.font = "90px 'Bebas Neue'";
        ctx.fillStyle = "white";
        ctx.fillText(`🛖${player.nickname.split('').reverse().join('')} spawn🛖`, 0, 0);
        ctx.restore();

        const currentTime = new Date().getTime();
    if (currentTime - lastEnemyUpdate > 1000) {
        lastEnemyUpdate = currentTime;
    }

        updateBullets(enemies); 

        ctx.font = "70px 'Bebas Neue'";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(`You are: ${player.classEmoji} - ${player.className}`, gameCanvas.width / 2, gameCanvas.height - 30);

        requestAnimationFrame(() => draw(enemies));
    }
});