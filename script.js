// ===============================
// GET HTML ELEMENTS
// ===============================

const rocket = document.getElementById("rocket");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

const object = document.getElementById("object");
const score = document.getElementById("score");
const meteor = document.getElementById("meteor");
const battery = document.getElementById("battery");
const blackHole = document.getElementById("blackHole");

const fuelDisplay = document.getElementById("fuel");
const restartButton = document.getElementById("restartButton");

// Sounds
const collectSound = document.getElementById("collectSound");
const blackHoleSound = document.getElementById("blackHoleSound");
const meteorSound = document.getElementById("meteorSound");
const explosionSound = document.getElementById("explosionSound");
const gameOverSound = document.getElementById("gameOverSound");
const winSound = document.getElementById("winSound");


// ===============================
// SAFE SOUND FUNCTION
// ===============================

function playSound(sound) {

    if (!sound) {
        return;
    }

    try {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    } catch (error) {
        // Sound error இருந்தாலும் game நிற்கக்கூடாது
    }
}


// ===============================
// GAME VARIABLES
// ===============================

let rocketPosition = 40;

let objectPosition = 10;
let batteryPosition = 10;
let meteorPosition = 10;

let fuel = 60;
let batteryPower = 15;

let scoreNumber = 0;

let totalStarsCollected = 0;
let starsCollected = 0;

let blackHoleCount = 0;

let blackHoleActive = false;
let gameOver = false;

let batteryWaiting = false;

let meteorTargetLocked = false;
let meteorTargetX = 0;

// ===============================
// BLACK HOLE TARGET
// 25 - 30 STARS
// ===============================

let blackHoleTarget =
    Math.floor(Math.random() * 6) + 25;


// ===============================
// NORMAL METEOR
// ===============================

let starsBeforeMeteor =
    Math.floor(Math.random() * 10) + 1;


// ===============================
// BLACK HOLE METEORS
// ===============================

let blackHoleMeteorCount = 0;

let blackHoleMeteorLimit = 0;

let dangerousMeteorNumber = 0;

let blackHoleMeteorDangerous = false;


// ===============================
// INITIAL POSITIONS
// ===============================

object.style.left =
    Math.floor(Math.random() * 80) + "%";

battery.style.left =
    Math.floor(Math.random() * 80) + "%";

meteor.style.left =
    Math.floor(Math.random() * 80) + "%";

blackHole.style.display = "none";


// ===============================
// RESTART
// ===============================

restartButton.addEventListener("click", function () {
    location.reload();
});


// ===============================
// ROCKET LEFT
// ===============================

leftButton.addEventListener("click", function () {

    if (gameOver || fuel <= 0) {
        return;
    }

    rocketPosition -= 10;

    if (rocketPosition < 0) {
        rocketPosition = 0;
    }

    fuel -= 1;

    if (fuel < 0) {
        fuel = 0;
    }

    rocket.style.left =
        rocketPosition + "%";

    fuelDisplay.innerText =
        "Fuel: " + fuel + "%";

    checkFuel();
});


// ===============================
// ROCKET RIGHT
// ===============================

rightButton.addEventListener("click", function () {

    if (gameOver || fuel <= 0) {
        return;
    }

    rocketPosition += 10;

    if (rocketPosition > 85) {
        rocketPosition = 85;
    }

    fuel -= 1;

    if (fuel < 0) {
        fuel = 0;
    }

    rocket.style.left =
        rocketPosition + "%";

    fuelDisplay.innerText =
        "Fuel: " + fuel + "%";

    checkFuel();
});


// ===============================
// FUEL EMPTY
// ===============================

function checkFuel() {

    if (fuel <= 0 && !gameOver) {

        fuel = 0;

        gameOver = true;

        playSound(gameOverSound);

        restartButton.style.display =
            "block";

        alert("GAME OVER! FUEL EMPTY!");
    }
}


// ===============================
// BATTERY
// ===============================

setInterval(function () {

    if (gameOver || batteryWaiting) {
        return;
    }

    // Black Hole நேரத்தில் battery வேகம்
    if (blackHoleActive) {

        batteryPosition += 12;

    } else {

        batteryPosition += 4;
    }

    battery.style.top =
        batteryPosition + "px";


    // Battery bottom சென்றுவிட்டது
    if (batteryPosition > 500) {

        batteryWaiting = true;

        battery.style.display = "none";

        let batterySpawnTime;

        if (blackHoleActive) {

            batterySpawnTime = 1500;

        } else {

            batterySpawnTime = 2000;
        }

        setTimeout(function () {

            if (gameOver) {
                return;
            }

            batteryPosition = 10;

            battery.style.top =
                "10px";

            battery.style.left =
                Math.floor(Math.random() * 80) + "%";

            battery.style.display =
                "block";

            batteryWaiting = false;

        }, batterySpawnTime);
    }

}, 75);


// ===============================
// STAR + BATTERY GAME LOOP
// ===============================

setInterval(function () {

    if (gameOver) {
        return;
    }


    // ===========================
    // STAR MOVEMENT
    // ===========================

    if (blackHoleActive) {

        objectPosition += 80;

    } else {

        objectPosition += 15;
    }

    object.style.top =
        objectPosition + "px";


    // ===========================
    // ROCKET POSITION
    // ===========================

    const rocketLeft =
        rocket.offsetLeft;

    const rocketRight =
        rocketLeft + rocket.offsetWidth;


    // ===========================
    // BATTERY COLLISION
    // ===========================

    const batteryLeft =
        battery.offsetLeft;

    const batteryRight =
        batteryLeft + battery.offsetWidth;


    if (
        batteryPosition > 400 &&
        batteryLeft < rocketRight &&
        batteryRight > rocketLeft
    ) {

        playSound(collectSound);

        fuel += batteryPower;

        if (fuel > 100) {
            fuel = 100;
        }

        fuelDisplay.innerText =
            "Fuel: " + fuel + "%";


        batteryPosition = 10;

        battery.style.top =
            "10px";

        battery.style.left =
            Math.floor(Math.random() * 80) + "%";

        battery.style.display =
            "block";
    }


    // ===========================
    // STAR COLLISION
    // ===========================

    const objectLeft =
        object.offsetLeft;

    const objectRight =
        objectLeft + object.offsetWidth;


    if (
        objectPosition > 400 &&
        objectLeft < rocketRight &&
        objectRight > rocketLeft
    ) {

        // Star sound
        playSound(collectSound);


        // Score
        scoreNumber += 5;

        starsCollected += 1;

        totalStarsCollected += 1;


        // Score display
        score.innerText =
            "Score: " + scoreNumber;


        // =======================
        // BLACK HOLE CHECK
        // =======================

        if (
            totalStarsCollected >= blackHoleTarget &&
            !blackHoleActive
        ) {

            startBlackHole();
        }


        // =======================
        // RESET STAR
        // =======================

        objectPosition = 10;

        object.style.top =
            "10px";

        object.style.left =
            Math.floor(Math.random() * 80) + "%";
    }


    // ===========================
    // STAR MISSED
    // ===========================

    if (objectPosition > 500) {

        objectPosition = 10;

        object.style.top =
            "10px";

        object.style.left =
            Math.floor(Math.random() * 80) + "%";
    }

}, 75);


// ===============================
// START BLACK HOLE
// ===============================

function startBlackHole() {

    if (blackHoleActive || gameOver) {
        return;
    }


    blackHoleActive = true;

    blackHoleCount += 1;


    // ===========================
    // BLACK HOLE SOUND
    // ===========================

    playSound(blackHoleSound);


    // ===========================
    // BLACK HOLE POSITION
    // ===========================

    blackHole.style.top =
        "10px";

    blackHole.style.left =
        Math.floor(Math.random() * 70) + "%";

    blackHole.style.display =
        "block";


    // ===========================
    // 4 OR 5 METEORS
    // ===========================

    blackHoleMeteorCount = 1;

    blackHoleMeteorLimit =
        Math.floor(Math.random() * 2) + 4;


    // ===========================
    // RANDOM DANGEROUS METEOR
    // ===========================

    dangerousMeteorNumber =
        Math.floor(
            Math.random() *
            blackHoleMeteorLimit
        ) + 1;


    // ===========================
    // FIRST METEOR
    // ===========================

    prepareBlackHoleMeteor();


    // ===========================
    // BLACK HOLE LASTS 5 SEC
    // ===========================

    setTimeout(function () {

        if (gameOver) {
            return;
        }


        blackHole.style.display =
            "none";

        blackHoleActive = false;


        // =======================
        // THIRD BLACK HOLE = WIN
        // =======================

        if (blackHoleCount >= 3) {

            gameOver = true;

            playSound(winSound);

            alert("🏆 YOU WIN! 🚀");

            restartButton.style.display =
                "block";

            return;
        }


        // =======================
        // NEXT BLACK HOLE
        // 25 - 30 STARS
        // =======================

        blackHoleTarget =
            totalStarsCollected +
            Math.floor(Math.random() * 6) + 25;

    }, 5000);
}


// ===============================
// PREPARE BLACK HOLE METEOR
// ===============================

function prepareBlackHoleMeteor() {

    if (!blackHoleActive || gameOver) {
        return;
    }
meteorTargetX =
    rocket.offsetLeft;

meteorTargetLocked = true;

    meteorPosition = 10;


    // IMPORTANT:
    // Meteor target = rocket position
    meteorTargetX =
        rocket.offsetLeft;

    meteorTargetLocked = true;


    // Meteor dangerous or safe?
    if (
        blackHoleMeteorCount ===
        dangerousMeteorNumber
    ) {

        blackHoleMeteorDangerous = true;

    } else {

        blackHoleMeteorDangerous = false;
    }


    meteor.style.top =
        "10px";

    meteor.style.left =
        meteorTargetX + "px";

    meteor.style.display =
        "block";


    // Meteor sound
    playSound(meteorSound);
}


// ===============================
// METEOR GAME LOOP
// ===============================

setInterval(function () {

    if (gameOver) {
        return;
    }


    // ===========================
    // BLACK HOLE METEOR
    // ===========================

    if (blackHoleActive) {

        meteorPosition += 35;


        // Target stays locked
        if (meteorTargetLocked) {

            meteor.style.left =
                meteorTargetX + "px";
        }


        meteor.style.top =
            meteorPosition + "px";


        checkMeteorCollision();


        // Meteor reached bottom
        if (meteorPosition > 500) {

            // இன்னும் Meteors இருக்கா?
            if (
                blackHoleMeteorCount <
                blackHoleMeteorLimit
            ) {

                blackHoleMeteorCount += 1;

                prepareBlackHoleMeteor();

            } else {

                meteor.style.display =
                    "none";

                meteorPosition = 10;

                meteorTargetLocked =
                    false;
            }
        }

        return;
    }


    // ===========================
    // NORMAL METEOR
    // ===========================

    if (
        starsCollected <
        starsBeforeMeteor
    ) {

        return;
    }


    meteorPosition += 20;


    // Normal meteor target lock
    if (
        meteorPosition >= 240 &&
        !meteorTargetLocked
    ) {

        meteorTargetX =
            rocket.offsetLeft;

        meteorTargetLocked =
            true;
    }


    if (meteorTargetLocked) {

        meteor.style.left =
            meteorTargetX + "px";
    }


    meteor.style.top =
        meteorPosition + "px";


    checkMeteorCollision();


    // ===========================
    // NORMAL METEOR BOTTOM
    // ===========================

    if (meteorPosition > 500) {

        meteor.style.display =
            "none";

        meteorPosition = 10;

        meteorTargetLocked =
            false;


        // புதிய meteor star requirement
        starsCollected = 0;

        starsBeforeMeteor =
            Math.floor(Math.random() * 10) + 1;


        setTimeout(function () {

            if (gameOver) {
                return;
            }

            meteor.style.left =
                Math.floor(Math.random() * 80) + "%";

            meteor.style.display =
                "block";

        }, 1500);
    }

}, 75);


// ===============================
// METEOR COLLISION
// ===============================

function checkMeteorCollision() {

    const rocketLeft =
        rocket.offsetLeft;

    const rocketRight =
        rocketLeft + rocket.offsetWidth;


    const meteorLeft =
        meteor.offsetLeft;

    const meteorRight =
        meteorLeft + meteor.offsetWidth;


    if (
        meteorPosition > 400 &&
        meteorLeft < rocketRight &&
        meteorRight > rocketLeft
    ) {

        // =======================
        // BLACK HOLE METEOR
        // =======================

        if (blackHoleActive) {

            // Random dangerous meteor மட்டும்
            if (!blackHoleMeteorDangerous) {

                // Safe meteor
                meteor.style.display =
                    "none";

                meteorPosition = 10;

                meteorTargetLocked =
                    false;

                return;
            }
        }


        // =======================
        // ROCKET EXPLOSION
        // =======================

        gameOver = true;

        rocket.classList.add("exploding");

        playSound(explosionSound);

        meteor.style.display =
            "none";


        setTimeout(function () {

            rocket.innerText =
                "💥";

        }, 400);


        setTimeout(function () {

            playSound(gameOverSound);

            alert("GAME OVER!");

            restartButton.style.display =
                "block";

        }, 900);
    }
}