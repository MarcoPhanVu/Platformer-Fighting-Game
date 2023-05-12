let gravity = 1.2;

function keepInside(obj) {
    if (obj.pos.y + 80 >= display.height) { // Ground
        obj.pos.y = display.height - 80;
        obj.inAir = false;
        obj.velocity.y = 0; // to prevent weird attack's Y offsets
    }

    if (obj.pos.x + 40 >= display.width) { //R ight
        obj.pos.x = display.width - 40;
    }
    
    if (obj.pos.x <= 0) { // left
        obj.pos.x = 0;
    }
}

function checkAttack(charA, charB) {
    let attack = charA.attack;

    if ((attack.pos.x <= charB.pos.x && charB.pos.x <= attack.pos.x + attack.width) ||
    (attack.pos.x <= charB.pos.x + charB.width && charB.pos.x + charB.width <= attack.pos.x + attack.width)) {
        charB.hp -= 100;
    }
}

function checkCollision(base, target) {
    // if ( 
    //     (base.pos.x >= target.pos.x && base.pos.x <= target.pos.x + target.width) // target on left
    // ||
    //     (base.pos.x + base.width >= target.pos.x && base.pos.x + base.width <= target.pos.x + target.width) // target on right
    // ) {
    //     // console.log(`${base.name} hit ${target.name}`)
    //     return true;
    // }

    if ((base.pos.x <= target.pos.x && target.pos.x <= base.pos.x + base.width) ||
        (base.pos.x <= target.pos.x + target.width && target.pos.x + target.width <= base.pos.x + base.width)) {
        return `${base.name} hit ${target.name} on ${base.direction}`;
    }


    return "no hit";
}


const movementState = {} // Empty Object but will be filled and modified with keyPressed and keyRelease function

function animate() {
    if ((player.hp <= 0) || enemy.hp <= 0) {
        gameOver = true;
    }

    if (gameOver == true) {
        displayerGameState();
        return;
    }

    cvs.clearRect(0, 0, display.width, display.height);
    cvs.fillStyle = FeldGrau;
    cvs.fillRect(0, 0, display.width, display.height);

// Movement
    //Avoid using elseif because we need to be able to use multiple keys at once
    //Player Section
        if (movementState.d_keyPressed == true) { //Right
            player.velocity.x = speedX;
            player.attack.direction = "toRight";
        }

        if (movementState.a_keyPressed == true) { //Left
            player.velocity.x = -speedX;
            player.attack.direction = "toLeft";
        }

        if (movementState.w_keyPressed == true && player.inAir == false) { //Jump
            player.jump();
            movementState.w_keyPressed = false;
        }

        if (movementState.spacebar_keyPressed == true) { // Player attack
            // player.attack.ing = true;
            player.drawAttack();
        }

        if (movementState.k_keyPressed == true) {
            console.log("pressed");
            debugger;
        }

    // Enemy Section
        if (movementState.arrowright_keyPressed == true) { //Right
            enemy.velocity.x = speedX;
            enemy.attack.direction = "toRight";
        }

        if (movementState.arrowleft_keyPressed == true) { //Left
            enemy.velocity.x = -speedX;
            enemy.attack.direction = "toLeft";
        }

        if (movementState.arrowup_keyPressed == true && enemy.inAir == false) {
            enemy.jump();
            movementState.arrowup_keyPressed = false;
        }
        if (movementState.shift_keyPressed == true) {
            enemy.drawAttack();
        }

    player.drawChar();
    enemy.drawChar();

    // to stop the character from moving horizontally and keep on flying up
    player.velocity = {x: 0, y: player.velocity.y};
    enemy.velocity = {x: 0, y: enemy.velocity.y};
}


document.addEventListener("keydown", (event) => {
    let key = event.key;
    if (key == " ") {
        key = "spacebar";
    }
    // dynamicCaseIncrement(keyStrokes, key.toLowerCase(), keyPressHandler(key)); //adding new cases whenever there's a new key pressed
    keyPressHandler(key);
});

document.addEventListener("keyup", (event) => {
    let key = event.key;
    if (key == " ") {
        key = "spacebar"; // Have to add this so that the player can retrieve their attack
    }
    keyReleaseHandler(key);
});

function keyPressHandler(key) {
    let placeholder = key.toLowerCase() + "_keyPressed";
    dynamicCaseIncrement(movementState, placeholder, true);
    movementState[`${placeholder}`] = true;
}

function keyReleaseHandler(key) {
    let placeholder = key.toLowerCase() + "_keyPressed";
    movementState[`${placeholder}`] = false;
}


// THIS FUNCTION WILL ONLY ADD UNDEFINED CASES, IF THEY'VE EXISTED THEN NOTHING WILL HAPPEN
function dynamicCaseIncrement(obj, _case, func = null) { // Cannot type "case" and "function" because they're built-ins.
    if (obj[_case] == undefined) {
        obj[_case] = func;
    }

    return;
}