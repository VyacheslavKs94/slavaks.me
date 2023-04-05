document.addEventListener("DOMContentLoaded", function () {
    const [sb, cs, clS, ch, cl, ns, ni, cnb] = ["start-button", "character-selection", "class-selection", "characters", "classes", "nickname-selection", "nickname-input", "choose-nickname-button"].map(id => document.getElementById(id));
    let chosenCharacter = "", chosenClass = null;
    const keysPressed = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, a: false, s: false, d: false };

    const logs = [];
    const LOG_SIZE_MULTIPLIER = 4;
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
        if (event.key.toLowerCase() === "e" && player.classEmoji === "🪓" && logs.length < 5) {
            logs.push({ x: player.x + 40, y: player.y, touches: 0, size: 160 });
          }          
    });    
    
    document.addEventListener("keyup", (event) => {
        if (keysPressed.hasOwnProperty(event.key)) {
            keysPressed[event.key] = false;
        }
    });
    
    const addEventListenerToElem = (elem, eventType, listener) => elem.addEventListener(eventType, listener);

    addEventListenerToElem(sb, "click", () => {
        cs.classList.remove("hidden");
        sb.classList.add("hidden");
        document.getElementById("worldwide-emoji").classList.add("hidden");
    });
    
    const makeButtonsFromList = (container, list, onClick) => list.forEach((item) => {
        const element = document.createElement("button");
        element.textContent = item;
        element.addEventListener("click", () => onClick(item));
        container.appendChild(element);
    });

    makeButtonsFromList(ch, ["🧟", "😼"], (character) => {
        cs.classList.add("hidden");
        clS.classList.remove("hidden");
        chosenCharacter = character;
    });

    const classOptions = [{ emoji: "🪓", name: "Lumberjack" }, { emoji: "🔧", name: "Mechanic" }];

    classOptions.forEach((classOption) => {
        const classElement = document.createElement("span");
        classElement.textContent = classOption.emoji;
        classElement.addEventListener("click", (event) => {
            clS.classList.add("hidden");
            ns.classList.remove("hidden");
            chosenClass = classOptions.find(option => option.emoji === event.target.textContent);
        });
        cl.appendChild(classElement);
    });
    
    addEventListenerToElem(cnb, "click", () => {
        const len = ni.value.length;
        if (len >= 3 && len <= 15) {
            player.nickname = ni.value;
            ns.classList.add("hidden");
            startGame(chosenClass);
        } else {
           alert(`Nickname should not be ${len < 3 ? "shorter" : "longer"} than 3 or 15 ch.`);
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

    function getRandomEnemy() {
        const enemyList = ['⊂(◉‿◉)つ', '╰(*°▽°*)╯'];
        const randomIndex = Math.floor(Math.random() * enemyList.length);
        return { character: enemyList[randomIndex], scale: 1 / 1.5 };
    }

    function startGame(classOption) {
        document.getElementById("menu-title").classList.add("hidden");
        const gameCanvas = document.getElementById("game");
        gameCanvas.classList.remove("hidden");
    
        gameCanvas.width = document.documentElement.clientWidth;
        gameCanvas.height = document.documentElement.clientHeight;
    
        player.character = chosenCharacter;
        player.className = classOption.name;
        player.classEmoji = classOption.emoji;

        const characterClasses = {
            "🧟": "Zombie",
            "😼": "Cat"
          };
          
          player.className = `${characterClasses[chosenCharacter]} ${player.className}`;
    
        setInterval(() => shootBullets(enemies), 1500);
    
        const minX = gameCanvas.width * 0.99;
        const maxY = gameCanvas.height - 80;
        const maxX = gameCanvas.width * 0.95 - 40;
        
        const numberOfEnemies = 20;
        const enemies = [];

        function setRandomEnemyMovementDelay(enemy) {
            const delay = Math.random() * (5 - 0.5) + 0.5;
            setTimeout(() => {
              enemy.speed = 0.5;
            }, delay * 1000);
          }
          
          for (let i = 0; i < numberOfEnemies; i++) {
            const enemy = {
              x: minX + Math.random() * (maxX - minX),
              y: Math.random() * maxY * 0.8,
              z: Math.random() * maxY,
              speed: 0,
              ...getRandomEnemy(),
              bullets: [],
              health: 3,
              touchCooldown: 0,
            };
            setRandomEnemyMovementDelay(enemy);
            enemies.push(enemy);
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
        x: window.innerWidth * 0.25,
        y: window.innerHeight * 0.4,
        speed: 3,
        character: "",
        className: "",
        classEmoji: "",
        dinero: 0,
    };

    function updatePlayerPosition() {
        const gameCanvas = document.getElementById("game");
    
        const numberOfRoads = 14;
        const roadSpacing = gameCanvas.height / (numberOfRoads + 1);
        const roadHeight = roadSpacing / 2;
        const minY = roadHeight;
        const maxY = gameCanvas.height - roadHeight;
    
        const closestRoad = Math.round(player.y / roadSpacing);
        const closestRoadY = roadSpacing * closestRoad;
    
        if (keysPressed.ArrowUp || keysPressed.w) {
            if (!keysPressed.moveUp) {
                keysPressed.moveUp = true;
                player.y = Math.max(minY, closestRoadY - roadSpacing);
            }
        } else {
            keysPressed.moveUp = false;
        }
    
        if (keysPressed.ArrowDown || keysPressed.s) {
            if (!keysPressed.moveDown) {
                keysPressed.moveDown = true;
                player.y = Math.min(maxY, closestRoadY + roadSpacing);
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
    
        if (player.y < minY) {
            player.y = minY;
        } else if (player.y > maxY) {
            player.y = maxY;
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
        const lineWidth = 9;
      
        ctx.strokeStyle = 'white';
        ctx.setLineDash([5, 15]);
        ctx.lineWidth = lineWidth;
      
        Array(numberOfRoads).fill().forEach((_, i) => {
          const yPos = roadSpacing * (i + 1);
          ctx.beginPath();
          ctx.moveTo(gameCanvas.width * 0.1, yPos);
          ctx.lineTo(gameCanvas.width * 0.85, yPos);
          ctx.stroke();
      
          ctx.font = "40px 'Bebas Neue'";
          ctx.fillStyle = "green";
          ctx.fillText("🌲", gameCanvas.width * 0.1, yPos);
      
          ctx.fillText("🌳", gameCanvas.width * 0.75 + 71, yPos);
        });
        ctx.setLineDash([]);
      }
    
    function draw(enemies) {

        function emojiNumber(number) {
            return number.toString().split('').map(digit => {
                if (digit === '-') {
                    return '➖';
                }
                return String.fromCharCode('0️⃣'.charCodeAt(0) + parseInt(digit));
            }).join('');
        }
        const gameCanvas = document.getElementById("game");
        const ctx = gameCanvas.getContext("2d");
        
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        drawRoads(ctx, gameCanvas);

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
      
        enemies.forEach((enemy) => {
          handleEnemyTouchesLogs(enemy);
        });
    
        enemies.forEach((enemy, index) => {
        
            const bulletImage = new Image();
            bulletImage.src = "https://slavaks.me/img/pew.png";

        ctx.font = `calc(40px * ${enemy.scale}) 'Bebas Neue'`;
        ctx.fillStyle = "white"; 
        ctx.fillText(enemy.character, enemy.x, enemy.y);
        enemy.bullets.forEach((bullet) => {
        ctx.drawImage(bulletImage, bullet.x, bullet.y, 30, 30);
        });

            const distance = Math.sqrt(Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2));
            if (distance < 40) {
                if (enemy.health > 1) {
                    enemy.health -= 1;
                    ctx.font = "45px 'Bebas Neue'";
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
      const allEliminated = allEnemiesEliminated(enemies);
      function allEnemiesEliminated(enemies) {
        return enemies.length === 0;
    }    

    if (allEliminated) {
        ctx.font = "40px 'Bebas Neue'";
        currencies.forEach((currency, index) => {
            const distance = Math.sqrt(Math.pow(currency.x - player.x, 2) + Math.pow(currency.y - player.y, 2));
            if (distance < 40) {
                player.dinero++;
                currencies.splice(index, 1);
            }
            ctx.fillText(currency.symbol, currency.x, currency.y);
        });
    }

        function drawTextWithRotation(text, x, y, angle) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.textAlign = "center";
            ctx.font = "90px 'Bebas Neue'";
            ctx.fillStyle = "white";
            ctx.fillText(text, 0, 0);
            ctx.restore();
        }
        
        drawTextWithRotation(`🏠 ${player.nickname} Base 🏠`, gameCanvas.width * 0.09, gameCanvas.height / 2, -Math.PI / 2);
        drawTextWithRotation(`🛖${player.nickname.split('').reverse().join('')} spawn🛖`, gameCanvas.width - 25, gameCanvas.height / 2, -Math.PI / 2);        

        const currentTime = new Date().getTime();
    if (currentTime - lastEnemyUpdate > 1000) {
        lastEnemyUpdate = currentTime;
    }

        updateBullets(enemies);
        ctx.font = "30px 'Bebas Neue'";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(`You are: ${player.classEmoji} - ${player.className} | Dinero 💰 - ${emojiNumber(player.dinero)}`, gameCanvas.width / 2, gameCanvas.height - 30);
        
        requestAnimationFrame(() => draw(enemies));
    }
});