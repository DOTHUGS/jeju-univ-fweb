function loadTexture(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
  })
}

function createEnemies(ctx, canvas, enemyImg) {
    const MONSTER_TOTAL = 5;
    const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
    const START_X = (canvas.width - MONSTER_WIDTH) / 2;
    const STOP_X = START_X + MONSTER_WIDTH;
    for (let x = START_X; x < STOP_X; x += enemyImg.width) {
      for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height) {
        ctx.drawImage(enemyImg, x, y);
      }
    }
}

function createEnemies2(ctx, canvas, enemyImg) {
    const MONSTER_TOTAL = 5;
    for (let row = 0; row < MONSTER_TOTAL; row ++) {
        const MONSTER_ROW = MONSTER_TOTAL - row
        const MONSTER_WIDTH = MONSTER_ROW * enemyImg.width;
        const START_X = (canvas.width - MONSTER_WIDTH) / 2;

        for (let col = 0; col < MONSTER_ROW; col++) {
            const x = START_X + col * enemyImg.width
            const y = row * enemyImg.height
            ctx.drawImage(enemyImg, x, y);
        }
    }
}


window.onload = async() => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  const heroImg = await loadTexture('assets/player.png')
  const enemyImg = await loadTexture('assets/enemyShip.png')
  const backgroundImg = await loadTexture('assets/starBackground.png')
  const pattern = ctx.createPattern(backgroundImg, 'repeat');
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const heroWidth = heroImg.width * 0.5; 
  const heroHeight = heroImg.height * 0.5;

  const centerX = canvas.width / 2;
  const centerY = canvas.height - (canvas.height / 4);

  ctx.drawImage(heroImg, centerX - 45, centerY);
  ctx.drawImage(heroImg, centerX - heroWidth - 45, centerY + 25, heroWidth, heroHeight); 
  ctx.drawImage(heroImg, centerX + 55, centerY + 25, heroWidth, heroHeight); 
  createEnemies2(ctx, canvas, enemyImg);
};

