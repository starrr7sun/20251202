let seeSpriteSheet, walkSpriteSheet, shootSpriteSheet, sleepSpriteSheet, smileSpriteSheet, drinkSpriteSheet;
let seeAnimation = [], walkAnimation = [], shootAnimation = [], sleepAnimation = [], smileAnimation = [], drinkAnimation = [];

const seeFrameCount = 8; // 'see.png' 的圖片總數
const walkFrameCount = 4; // 'walk.png' 的圖片總數
const shootFrameCount = 5; // 'shoot.png' 的圖片總數
const sleepFrameCount = 12; // 'sleep.png' 的圖片總數
const smileFrameCount = 8; // 'smile.png' 的圖片總數
const drinkFrameCount = 15; // 'drink.png' 的圖片總數

let seeFrameWidth, walkFrameWidth, shootFrameWidth, sleepFrameWidth, smileFrameWidth, drinkFrameWidth;
let charX, charY; // 角色的位置
let smileCharX, smileCharY; // 新角色的位置
let speed = 3; // 角色的移動速度
let facingRight = true; // 角色面向的方向，預設向右
let smileCharFacingRight = false; // 新角色面向的方向，預設向左

const proximityThreshold = 150; // 觸發動畫的距離閾值

let nameInput; // 玩家輸入框
let conversationState = 'none'; // 'none', 'asking', 'answered'
let brianSays = ""; // 角色2對話框的內容
let drinkFrame = 0; // 喝東西動畫的目前畫格

let isShooting = false; // 是否正在播放射擊動畫
let shootFrame = 0; // 目前射擊動畫的畫格
const shootAnimationSpeed = 8; // 射擊動畫速度，數字越小越快

let isSleeping = false; // 是否正在播放睡眠動畫
let sleepPlayFrame = 0; // 睡眠動畫已播放的畫格數


function preload() {
  // 預先載入圖片精靈檔案
  seeSpriteSheet = loadImage('1/see/see.png');
  walkSpriteSheet = loadImage('1/walk/walk.png');
  shootSpriteSheet = loadImage('1/shoot/shoot.png');
  sleepSpriteSheet = loadImage('1/sleep/sleep.png');
  smileSpriteSheet = loadImage('2/smile/smile.png');
  drinkSpriteSheet = loadImage('2/drink/drink.png');
}

function setup() {
  // 建立一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);

  // 初始化角色位置在畫布中央
  charX = width / 2;
  charY = height / 2;

  // 初始化新角色位置在原角色的左邊
  smileCharX = charX - 100; // 假設一個初始距離
  smileCharY = charY;

  // --- 建立 DOM 輸入框 ---
  nameInput = createInput();
  nameInput.style('font-size', '16px');
  nameInput.style('background-color', 'rgb(255, 255, 240)'); // 象牙白背景
  nameInput.style('border', '2px solid black'); // 黑色邊框
  nameInput.style('border-radius', '10px'); // 圓角
  nameInput.style('padding', '10px'); // 內邊距，讓文字有空間
  nameInput.style('text-align', 'center'); // 文字置中
  nameInput.style('width', '180px'); // 設定寬度
  nameInput.hide();

  // --- 處理 'see' 動畫 ---
  seeFrameWidth = seeSpriteSheet.width / seeFrameCount;
  for (let i = 0; i < seeFrameCount; i++) {
    let frame = seeSpriteSheet.get(i * seeFrameWidth, 0, seeFrameWidth, seeSpriteSheet.height);
    seeAnimation.push(frame);
  }

  // --- 處理 'walk' 動畫 ---
  walkFrameWidth = walkSpriteSheet.width / walkFrameCount;
  for (let i = 0; i < walkFrameCount; i++) {
    let frame = walkSpriteSheet.get(i * walkFrameWidth, 0, walkFrameWidth, walkSpriteSheet.height);
    walkAnimation.push(frame);
  }

  // --- 處理 'shoot' 動畫 ---
  shootFrameWidth = shootSpriteSheet.width / shootFrameCount;
  for (let i = 0; i < shootFrameCount; i++) {
    let frame = shootSpriteSheet.get(i * shootFrameWidth, 0, shootFrameWidth, shootSpriteSheet.height);
    shootAnimation.push(frame);
  }

  // --- 處理 'sleep' 動畫 ---
  sleepFrameWidth = sleepSpriteSheet.width / sleepFrameCount;
  for (let i = 0; i < sleepFrameCount; i++) {
    let frame = sleepSpriteSheet.get(i * sleepFrameWidth, 0, sleepFrameWidth, sleepSpriteSheet.height);
    sleepAnimation.push(frame);
  }

  // --- 處理 'smile' 動畫 ---
  smileFrameWidth = smileSpriteSheet.width / smileFrameCount;
  for (let i = 0; i < smileFrameCount; i++) {
    let frame = smileSpriteSheet.get(i * smileFrameWidth, 0, smileFrameWidth, smileSpriteSheet.height);
    smileAnimation.push(frame);
  }

  // --- 處理 'drink' 動畫 ---
  drinkFrameWidth = drinkSpriteSheet.width / drinkFrameCount;
  for (let i = 0; i < drinkFrameCount; i++) {
    let frame = drinkSpriteSheet.get(i * drinkFrameWidth, 0, drinkFrameWidth, drinkSpriteSheet.height);
    drinkAnimation.push(frame);
  }
}

function keyPressed() {
  // 當按下空白鍵且不在射擊狀態時，開始射擊動畫
  if (keyCode === 32 && !isShooting) {
    isShooting = true;
    shootFrame = 0; // 從第一格開始
  }

  // 當玩家在輸入框按下 Enter 鍵
  if (keyCode === ENTER && conversationState === 'asking') {
    const playerName = nameInput.value();
    brianSays = playerName + "，歡迎你！";
    conversationState = 'answered';
    nameInput.hide();
  }
}

function draw() {
  // 設定背景顏色
  background('#b2e6e3ff');

  // 繪製新的微笑角色
  drawSmileCharacter();

  // 當對話開始時，顯示對話框
  if (conversationState === 'asking' || conversationState === 'answered') {
    drawQuestionBox();
  }

  if (isShooting) {
    // --- 播放射擊動畫 ---
    playShootAnimation();

  } else if (isSleeping) {
    // --- 播放睡眠動畫 ---
    playSleepAnimation();

  } else {
    // --- 處理移動和閒置狀態 ---
    handleMovementAndIdle();
  }
}

function drawSmileCharacter() {
  // 計算兩個角色之間的距離
  const d = dist(charX, charY, smileCharX, smileCharY);
  // 判斷角色2是否應該面向右邊。由於drink.png的視覺特性，我們將邏輯反轉。
  const shouldFaceRight = charX < smileCharX;

  // 根據距離管理對話狀態
  if (d < proximityThreshold && conversationState === 'none') {
    // 開始對話
    conversationState = 'asking';
    brianSays = "請問你叫甚麼名字";
    drinkFrame = 0; // 從第一格開始
    nameInput.value(''); // 清空輸入框以便重新輸入
    nameInput.show();
  } else if (d >= proximityThreshold && conversationState !== 'none') {
    // 結束對話
    conversationState = 'none';
    nameInput.hide();
  }

  // 當處於對話狀態時，播放 drink 動畫
  if (conversationState === 'asking' || conversationState === 'answered') {
    nameInput.position(charX - nameInput.width / 2, charY + 40); // 更新輸入框位置

    const currentFrameIndex = floor(drinkFrame);
    const currentImg = drinkAnimation[currentFrameIndex];

    if (shouldFaceRight) {
      // 面向右邊
      push();
      translate(smileCharX + drinkFrameWidth / 2, smileCharY - drinkSpriteSheet.height / 2);
      scale(-1, 1); // 水平翻轉
      image(currentImg, 0, 0);
      pop();
    } else {
      // 面向左邊
      image(currentImg, smileCharX - drinkFrameWidth / 2, smileCharY - drinkSpriteSheet.height / 2);
    }

    // 更新動畫畫格
    // 讓動畫循環播放，只要還在對話中
    drinkFrame = (drinkFrame + 0.25) % drinkFrameCount;

  } else {
    // --- 播放原本的待機/轉向動畫 ---
    const currentFrame = floor(frameCount / 8) % smileAnimation.length;
    if (shouldFaceRight) {
      // 面向右邊
      push();
      translate(smileCharX + smileFrameWidth / 2, smileCharY - smileSpriteSheet.height / 2);
      scale(-1, 1);
      image(smileAnimation[currentFrame], 0, 0);
      pop();
    } else {
      // 面向左邊
      image(smileAnimation[currentFrame], smileCharX - smileFrameWidth / 2, smileCharY - smileSpriteSheet.height / 2);
    }
  }
}

function drawQuestionBox() {
  push(); // 儲存當前的繪圖設定

  const boxWidth = 200;
  const boxHeight = 60;
  const boxX = smileCharX - boxWidth / 2;
  const boxY = smileCharY - smileSpriteSheet.height / 2 - boxHeight - 10; // 在角色頭頂上方10像素

  // 繪製對話框背景
  fill(255, 255, 240); // 象牙白色背景
  stroke(0); // 黑色邊框
  strokeWeight(2);
  rect(boxX, boxY, boxWidth, boxHeight, 10); // 圓角矩形

  // 繪製文字 (關鍵：設定文字大小)
  noStroke();
  fill(0); // 黑色文字
  textSize(16);
  textAlign(CENTER, CENTER);
  text(brianSays, boxX + boxWidth / 2, boxY + boxHeight / 2);

  pop(); // 恢復之前的繪圖設定
}

function handleMovementAndIdle() {
    // 檢查方向鍵
    if (keyIsDown(RIGHT_ARROW)) {
    // 按下右鍵：向右移動
    charX += speed;
    facingRight = true;
    let currentFrame = floor(frameCount / 8) % walkAnimation.length;
    image(walkAnimation[currentFrame], charX - walkFrameWidth / 2, charY - walkSpriteSheet.height / 2);

  } else if (keyIsDown(LEFT_ARROW)) {
    // 按下左鍵：向左移動並翻轉圖片
    charX -= speed;
    facingRight = false;
    let currentFrame = floor(frameCount / 8) % walkAnimation.length;
    
    push(); // 儲存目前的繪圖設定
    translate(charX + walkFrameWidth / 2, charY - walkSpriteSheet.height / 2); // 將原點移動到圖片的右上角
    scale(-1, 1); // 水平翻轉座標系
    image(walkAnimation[currentFrame], 0, 0); // 在新的原點繪製圖片
    pop(); // 恢復原本的繪圖設定

  } else if (keyIsDown(DOWN_ARROW)) {
    // 按下下鍵：開始睡眠動畫
    isSleeping = true;
    sleepPlayFrame = 0; // 重置播放計數

  } else {
    // 沒有按鍵：播放觀望動畫，並保持最後的方向
    let currentFrame = floor(frameCount / 8) % seeAnimation.length;
    if (facingRight) {
      image(seeAnimation[currentFrame], charX - seeFrameWidth / 2, charY - seeSpriteSheet.height / 2);
    } else {
      push();
      translate(charX + seeFrameWidth / 2, charY - seeSpriteSheet.height / 2);
      scale(-1, 1);
      image(seeAnimation[currentFrame], 0, 0);
      pop();
    }
  }
}

function playShootAnimation() {
  // 根據 shootFrame 決定要顯示哪一格
  let currentFrameIndex = floor(shootFrame);
  let currentImg = shootAnimation[currentFrameIndex];

  // 讓角色在播放動畫時輕微上下移動
  let yOffset = 0;
  if (currentFrameIndex < 2) yOffset = -5; // 向上
  else if (currentFrameIndex > 2) yOffset = 5; // 向下

  // 根據角色面向的方向來繪製
  if (facingRight) {
    image(currentImg, charX - shootFrameWidth / 2, charY - shootSpriteSheet.height / 2 + yOffset);
  } else {
    push();
    translate(charX + shootFrameWidth / 2, charY - shootSpriteSheet.height / 2 + yOffset);
    scale(-1, 1);
    image(currentImg, 0, 0);
    pop();
  }

  // 更新射擊動畫的畫格
  shootFrame += 1 / shootAnimationSpeed;

  // 如果動畫播放完畢，則結束射擊狀態
  if (shootFrame >= shootFrameCount) {
    isShooting = false;
  }
}

function playSleepAnimation() {
  // 根據已播放的畫格數來決定要顯示 sleepAnimation 中的哪一格 (循環播放)
  let currentFrameIndex = floor(sleepPlayFrame);
  let currentImg = sleepAnimation[currentFrameIndex];

  // 讓角色在播放動畫時輕微上下移動
  let yOffset = sin(frameCount * 0.2) * 5;

  // 根據角色面向的方向來繪製
  if (facingRight) {
    image(currentImg, charX - sleepFrameWidth / 2, charY - sleepSpriteSheet.height / 2 + yOffset);
  } else {
    push();
    translate(charX + sleepFrameWidth / 2, charY - sleepSpriteSheet.height / 2 + yOffset);
    scale(-1, 1);
    image(currentImg, 0, 0);
    pop();
  }

  // 更新已播放的畫格數，調整數值以控制動畫速度
  sleepPlayFrame += 0.2;

  // 如果動畫播放完畢 (達到12個畫格)，則結束睡眠狀態
  // 當沒有按下向上鍵時，恢復顯示SeeSheet -> 這裡的邏輯是播放完12個畫格後就恢復
  if (sleepPlayFrame >= 12) {
    isSleeping = false;
  }
}
