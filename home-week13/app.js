class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dead = false;     // 객체가 파괴되었는지 여부
    this.type = "";        // 객체 타입 (영웅/적)
    this.width = 0;        // 객체의 폭
    this.height = 0;       // 객체의 높이
    this.img = undefined;  // 객체의 이미지
  }

  rectFromGameObject() {
    return {
      top: this.y,
      left: this.x,
      bottom: this.y + this.height,
      right: this.x + this.width,
    };
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height); // 캔버스에 이미지 그리기
  }
}

class Hero extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 99;
    this.height = 75;
    this.type = 'Hero';
    this.cooldown = 0; // 초기화
    this.life = 3;
    this.points = 0;
    this.shieldActive = false;
  }
  fire() {
    if (this.canFire()) { // 쿨다운 확인
      gameObjects.push(new Laser(this.x + 45, this.y - 10)); // 레이저 생성
      this.cooldown = 500; // 쿨다운 500ms 설정
      let id = setInterval(() => {
        if (this.cooldown > 0) {
          this.cooldown -= 100;
        } else {
          clearInterval(id); // 쿨다운 완료 후 타이머 종료
        }
      }, 100);
    }
  }
  canFire() {
    return this.cooldown === 0; // 쿨다운 상태 확인
  }
  decrementLife() {
    if (!this.shieldActive) {
      this.life--;
      this.img = heroDamagedImg; // 히어로 이미지 heroDamagedImg로 변경
      if (this.life === 0) {
        this.dead = true;
      }
    }
  }
  incrementPoints() {
    this.points += 100;
  }
  activateShield() {
    if (this.points >= 100) { // 포인트가 충분한지 확인
      this.points -= 100; // 쉴드 사용 후 포인트 차감
      this.shieldActive = true;
      const shield = new Shield(this.x - 50, this.y - 50);
      gameObjects.push(shield);

      // 5초 후 쉴드 제거
      setTimeout(() => {
        this.shieldActive = false;
      }, 5000);
    }
  }
}

class Enemy extends GameObject {
  constructor(x, y, isBoss = false) {
    super(x, y);
    this.width = 98;
    this.height = 50;
    this.type = isBoss ? "Boss" : "Enemy"; // boss인지 확인 아니면 enemy
    this.isBoss = isBoss; // 보스 여부

    // 적 캐릭터의 자동 이동 (Y축 방향)
    let id = setInterval(() => {
      if (this.y < canvas.height - this.height) {
        this.y += 5;  // 아래로 이동
      } else {
        console.log('Stopped at', this.y);
        clearInterval(id); // 화면 끝에 도달하면 정지
      }
    }, 300);

    // 보스가 메테오 발사
    if (this.isBoss) {
      //console.log('Boss detected'); // Debug message
      setInterval(() => {
        this.fireMeteor();
      }, 10000); // 10초 간격으로 메테오 발사
    } else {
      //console.log('Regular enemy detected'); // Debug message
    }
  }

  fireMeteor() {
    //console.log("Meteor fired by Boss"); // Debug message
    const meteorImg = Math.random() > 0.5 ? meteorBigImg : meteorSmallImg;
    const meteor = new Meteor(this.x + this.width / 2 - 30, this.y + this.height, meteorImg);
    gameObjects.push(meteor);
  }
}

class EventEmitter {
  constructor() {
    this.listeners = {};
  }
  on(message, listener) {
    if (!this.listeners[message]) {
    this.listeners[message] = [];
    }
    this.listeners[message].push(listener);
  }
  emit(message, payload = null) {
    if (this.listeners[message]) {
    this.listeners[message].forEach((l) => l(message, payload));
    }
  }
  clear() {
    this.listeners = {};
  }
}

class Laser extends GameObject {
  constructor(x, y) {
    super(x, y);
    (this.width = 9), (this.height = 33);
    this.type = 'Laser';
    this.img = laserImg;
    let id = setInterval(() => {
      if (this.y > 0) {
        this.y -= 15; // 레이저가 위로 이동
      } else {
        this.dead = true; // 화면 상단에 도달하면 제거
        clearInterval(id);
      }
    }, 100);
  }
}

class Greenshot extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 100;  // 크기 설정
    this.height = 60;
    this.type = 'greenshot';
    this.img = shotimg; // 미리 로드된 이미지 사용
    this.dead = false;

    // 1초 후 자동 제거 타이머
    setTimeout(() => {
      this.dead = true;
    }, 1000);
  }
}

class Redshot extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 100;  // 크기 설정
    this.height = 60;
    this.type = 'redshot';
    this.img = shotLedtimg; // 미리 로드된 이미지 사용
    this.dead = false;

    // 1초 후 자동 제거 타이머
    setTimeout(() => {
      this.dead = true;
    }, 1000);
  }
}

class Shield extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 120;  // 크기 설정
    this.height = 120;
    this.type = 'shield';
    this.img = shieldImg; // 미리 로드된 이미지 사용
    this.dead = false;

    // 5초 후 자동 제거 타이머
    setTimeout(() => {
      this.dead = true;
    }, 5000);
  }
}

class Meteor extends GameObject {
  constructor(x, y, img) {
    super(x, y);
    this.width = img === meteorBigImg ? 120 : 60; // 크기 설정
    this.height = img === meteorBigImg ? 120 : 60;
    this.type = 'Meteor';
    this.img = img; // 미리 로드된 이미지 사용
    let id = setInterval(() => {
      if (this.y < canvas.height) {
        this.y += 10; // 메테오가 아래로 이동
      } else {
        this.dead = true; // 화면 하단에 도달하면 제거
        clearInterval(id);
      }
    }, 100);
  }
}

let gameLoopId;
let stage = 1;
let remainingTime = 60; // 남은시간 60초로 설정

let heroImg, leftheroImg, rightheroImg, bossImg, enemyImg, laserImg, lifeImg, canvas, ctx, gameObjects = [], hero, eventEmitter = new EventEmitter();

let onKeyDown = function (e) {
  console.log(e.keyCode);
  switch (e.keyCode) {
    case 37: // 왼쪽 화살표
    case 39: // 오른쪽 화살표
    case 38: // 위쪽 화살표
    case 40: // 아래쪽 화살표
    case 32: // 스페이스바
      e.preventDefault();
      break;
    default:
      break;
  }
};

function initGame() {
  gameObjects = [];
  stage = 1; // 스테이지 1
  remainingTime = 60; // 타이머 초기화
  createEnemies();
  createHero();
  eventEmitter.clear(); // 이벤트 리스너 중복 방지

  eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
    if (hero.canFire()) {
      hero.fire();
      righthero.fire();
      lefthero.fire();
    }
  });

  eventEmitter.on(Messages.KEY_EVENT_SHIELD, () => {
    hero.activateShield();
  });
  
  eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
    first.dead = true;
    second.dead = true;
    console.log(`${second.type} hit by laser and marked as dead.`);
    hero.incrementPoints();

    const greenshot = new Greenshot(second.x, second.y);
    gameObjects.push(greenshot);

    if (isEnemiesDead()) {
      if (stage < 3) {
        stage++;
        clearLasers(); //스테이지 종료시 레이저 제거
        createEnemies();
      } else {
        eventEmitter.emit(Messages.GAME_END_WIN);
      }
    }
  });

  eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
    enemy.dead = true;
    hero.decrementLife();

    if (isHeroDead()) {
      eventEmitter.emit(Messages.GAME_END_LOSS);
      return; 
    }
    if (isEnemiesDead()) {
      if (stage < 3) {
        stage++;
        clearLasers(); //스테이지 종료시 레이저 제거
        createEnemies();
      } else {
        eventEmitter.emit(Messages.GAME_END_WIN);
      }
    }
  });

  eventEmitter.on(Messages.GAME_END_WIN, () => {
    endGame(true);
  });

  eventEmitter.on(Messages.GAME_END_LOSS, () => {
    endGame(false);
  });

  eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
    resetGame();
  });

  startTimer(); // Start the timer
}

function clearLasers() {
  gameObjects = gameObjects.filter(go => go.type !== 'Laser');
}

function startTimer() {
  let timerId = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
    } else {
      clearInterval(timerId);
      eventEmitter.emit(Messages.GAME_END_LOSS); // 시간 0이 되면 게임 종료
    }
  }, 1000);
}

function createEnemies() {
  const MONSTER_TOTAL = 5 + stage;
  const MONSTER_WIDTH = MONSTER_TOTAL * 98;
  const START_X = (canvas.width - MONSTER_WIDTH) / 2;
  const STOP_X = START_X + MONSTER_WIDTH;
  for (let x = START_X; x < STOP_X; x += 98) {
    for (let y = 0; y < 50 * (3 + stage); y += 50) {
      const isBoss = stage === 3;
      const enemy = new Enemy(x, y, isBoss);
      enemy.img = isBoss ? bossImg : enemyImg; // Use bossImg if isBoss is true
      if (isBoss) {
        //console.log('Assigning boss image'); // Debug message
      }
      gameObjects.push(enemy);
    }
  }
  console.log(`Created ${gameObjects.length} enemies for stage ${stage}`); // Debug message
}

function createHero() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height - canvas.height / 4;
  hero = new Hero(
    canvas.width / 2 - 45,
    canvas.height - canvas.height / 4
  );
  hero.img = heroImg;
  gameObjects.push(hero);

  lefthero = new Hero(
    centerX - 45 - 100, centerY + 5
  );
  lefthero.img = leftheroImg; // Use the left hero image
  gameObjects.push(lefthero);

  righthero = new Hero(
    centerX - 45 + 100, centerY + 5
  );
  righthero.img = rightheroImg; // Use the right hero image
  gameObjects.push(righthero);
}

function drawLife() {
  const START_POS = canvas.width - 180;
  for(let i=0; i < hero.life; i++ ) {
    ctx.drawImage(
      lifeImg, 
      START_POS + (45 * (i+1) ), 
      canvas.height - 37);
  }
}

 function drawPoints() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "left";
  drawText("Points: " + hero.points, 10, canvas.height-20);
}

function drawRemainingTime(ctx) {
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "right";
  ctx.fillText(`Time: ${remainingTime}s`, canvas.width - 10, 40);
}

function drawText(message, x, y) {
  ctx.fillText(message, x, y);
}

function drawStage() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "left"; 
  drawText("Stage " + stage, 10, 40); 
}

function isHeroDead() {
  return hero.life <= 0;
}

function isEnemiesDead() {
  const enemies = gameObjects.filter((go) => go.type === "Enemy" && !go.dead);
  const bosses = gameObjects.filter((go) => go.type === "Boss" && !go.dead);
  //console.log(`Enemies remaining: ${enemies.length}, Bosses remaining: ${bosses.length}`); // Debug message
  return enemies.length === 0 && bosses.length === 0;
}

function drawGameObjects(ctx) {
  gameObjects.forEach(go => go.draw(ctx));
  drawRemainingTime(ctx);
  drawStage();
}

function loadTexture(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
  })
}

function intersectRect(r1, r2) {
  return !(
    r2.left > r1.right ||  // r2가 r1의 오른쪽에 있음
    r2.right < r1.left ||  // r2가 r1의 왼쪽에 있음
    r2.top > r1.bottom ||  // r2가 r1의 아래에 있음
    r2.bottom < r1.top     // r2가 r1의 위에 있음
  );
}

function updateGameObjects() {
  const enemies = gameObjects.filter(go => go.type === 'Enemy' || go.type === 'Boss');
  const lasers = gameObjects.filter((go) => go.type === "Laser");
  const meteors = gameObjects.filter((go) => go.type === "Meteor");
  const shields = gameObjects.filter((go) => go.type === "shield");

  // 방향키에 따라 히어로 이동
  if (keyState["ArrowUp"]) {
    hero.y -= 10;
    lefthero.y -= 10;
    righthero.y -= 10;
  }
  if (keyState["ArrowDown"]) {
    hero.y += 10;
    lefthero.y += 10;
    righthero.y += 10;
  }
  if (keyState["ArrowLeft"]) {
    hero.x -= 10;
    lefthero.x -= 10;
    righthero.x -= 10;
  }
  if (keyState["ArrowRight"]) {
    hero.x += 10;
    lefthero.x += 10;
    righthero.x += 10;
  }

  // 스페이스바로 히어로 발사
  if (keyState[" "]) { // 스페이스바가 눌려있는 동안
    if (hero.canFire()) hero.fire();
    if (lefthero.canFire()) lefthero.fire();
    if (righthero.canFire()) righthero.fire();
  }

  // 쉴드 위치 조정
  shields.forEach(shield => {
    shield.x = hero.x - 10; 
    shield.y = hero.y - 20; 
  });

  lasers.forEach((l) => {
    enemies.forEach((m) => {
      if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
        eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
          first: l,
          second: m,
        });
      }
    });
  });

  meteors.forEach(meteor => {
    const heroRect = hero.rectFromGameObject();
    if (intersectRect(heroRect, meteor.rectFromGameObject())) {
      eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy: meteor });
    }
  });

  enemies.forEach(enemy => {
    const heroRect = hero.rectFromGameObject();
    if (intersectRect(heroRect, enemy.rectFromGameObject())) {
      eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
    }
  });

  // 죽은 객체 제거
  gameObjects = gameObjects.filter(go => !go.dead);

  // 적이 모두 제거되었는지 확인
  if (isEnemiesDead()) {
    eventEmitter.emit(Messages.GAME_END_WIN);
  }
}

function displayMessage(message, color = "red") {
  ctx.font = "30px Arial";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

function endGame(win) {
  clearInterval(gameLoopId);
  // 게임 화면이 겹칠 수 있으니, 200ms 지연
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (win) {
      displayMessage(
        "Victory!!! Pew Pew... - Press [Enter] to start a new game Captain Pew Pew",
        "green"
      );
    } else {
      displayMessage(
        "You died !!! Press [Enter] to start a new game Captain Pew Pew"
      );
    }
  }, 200)  
 } 

function resetGame() {
  if (gameLoopId) {
    clearInterval(gameLoopId); // 게임 루프 중지, 중복 실행 방지
  }
  eventEmitter.clear(); // 모든 이벤트 리스너 제거, 이전 게임 세션 충돌 방지
  initGame(); // 게임 초기 상태 실행
  gameLoopId = setInterval(() => { // 100ms 간격으로 새로운 게임 루프 시작
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    drawPoints();
    drawLife();
    updateGameObjects();
    drawGameObjects(ctx);
  }, 100);
}
 
const Messages = {
  KEY_EVENT_UP: "KEY_EVENT_UP",
  KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
  KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
  KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
  KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
  KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
  KEY_EVENT_SHIELD: "KEY_EVENT_SHIELD",
  COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
  COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
  GAME_END_LOSS: "GAME_END_LOSS",
  GAME_END_WIN: "GAME_END_WIN",
};

window.addEventListener("keydown", (evt) => {
  keyState[evt.key] = true; // 키가 눌리면 상태를 true로 설정
  if (evt.key === "s") {
    eventEmitter.emit(Messages.KEY_EVENT_SHIELD);
  }
});


window.addEventListener("keyup", (evt) => {
  keyState[evt.key] = false; // 키를 떼면 상태를 false로 설정
  if (evt.key === "Enter") {
    eventEmitter.emit(Messages.KEY_EVENT_ENTER);
  }
});

const keyState = {}; // 눌린 키 상태를 저장하는 객체

window.onload = async () => {
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  heroImg = await loadTexture("assets/player.png");
  leftheroImg = await loadTexture("assets/playerLeft.png"); // Load left hero image
  rightheroImg = await loadTexture("assets/playerRight.png"); // Load right hero image
  heroDamagedImg = await loadTexture("assets/playerDamaged.png"); // Load damaged hero image
  enemyImg = await loadTexture("assets/enemyShip.png");
  laserImg = await loadTexture("assets/laserRed.png");
  laserGreenImg = await loadTexture("assets/laserGreen.png");
  shotimg = await loadTexture("assets/laserGreenShot.png");
  shotLedtimg = await loadTexture("assets/laserRedShot.png");
  lifeImg = await loadTexture("assets/life.png");
  backgroundImg = await loadTexture("assets/starBackground.png");
  bossImg = await loadTexture("assets/enemyUFO.png");
  shieldImg = await loadTexture("assets/shield.png");
  meteorBigImg = await loadTexture("assets/meteorBig.png");
  meteorSmallImg = await loadTexture("assets/meteorSmall.png");

  initGame();
  gameLoopId = setInterval(() => {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    drawPoints();
    drawLife();
    drawGameObjects(ctx);
    updateGameObjects();
  }, 100);
};