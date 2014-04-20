/*Bugs
    Coins are on top of explosison
    If player bumps into tanks they stop moving due to the way they accelerate
    If player shoots while really close to tank it won't take
*/
/*
IDEAS
    UFO to drive around in, potentially removing shooting from alien in favor of getting to the ufo on the map and then shooting
    Add splashscreen/loading/etc whatever have you
    Add more enemies
        Soliders
        Planes
    Add walls, obstrucitnos, scenery
    Add unlockables, I.E. an enemy can unlock something, a gate, something.
    
    Levels
        - First level soliders
        - Second level soliders and tanks
        - Third level soliders, tanks, planes
    Come up with name
    Improve game graphics

*/
//Globals
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example',
{
    preload: preload,
    create: create,
    update: update,
    render: render
});
var player;
var jumpTimer = 0;
var shiftKey;
var maxStamina = 150;
var stamina = maxStamina;
var staminaDisplay;
var runSpeed = 200;
var walkSpeed = 100;
var characterSpeed = walkSpeed;
var facing = '';
var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;
var nextFire = 0;
var fireRate = 100;
var bullets;
var turret;
var healthBar;
var staminaBar;
var maxHealth = 50;
var health = maxHealth;
var coinSprite;
var gameOver = false;
var healthPotions;
var pause = false;
var shieldWidth;
var shieldHeight;
var isTitleScreenShowing;
var textGroup;
var debugText;
var hud;
var bg;
var layer;
var map;
var surroundShield;
var TitleText;
var background;
var filter;

function preload()
{

    game.load.atlas('enemy', 'assets/pics/tanks.png', 'assets/pics/tanks.json');
    game.load.spritesheet('player', 'assets/pics/dude.png', 32, 48);
    game.load.image('bullet', 'assets/pics/bullet.png');
    game.load.image('turret', 'assets/pics/bullet.png');
    game.load.image('floor', 'assets/pics/floor.png');
    game.load.image('healthSprite', 'assets/pics/healthPotion.gif');
    game.load.spritesheet('kaboom', 'assets/pics/explosion.png', 64, 64, 23);
    game.load.script('filter', 'assets/phaser/filters/Fire.js');

    //Powerups
    game.load.image('coinSprite', 'assets/pics/coinSprite.gif');
    game.load.image('surroundShield', 'assets/pics/surroundShield.png');
    game.load.image('shield', 'assets/pics/shield.png');
    game.load.image('bluepotion', 'assets/pics/bluepotion.png');

    game.load.image('button', 'assets/pics/button.png');

    //HUD
    game.load.image('health', 'assets/pics/Health.png');
    game.load.image('hud', 'assets/pics/hud.png');
    game.load.image('stamina', 'assets/pics/stamina.png');
}

function create()
{
    //Map that will eventually get added :)
    // map = game.add.tilemap('World');
    // map.addTilesetImage('JSONMap', 'tiles');
    // // map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
    // layer = map.createLayer('World1');
    // layer.resizeWorld();

    game.physics.startSystem(Phaser.Physics.ARCADE);

    textGroup = game.add.group();

    titleScreen();
}

function titleScreen()
{
    background = game.add.sprite(0, 0);
    background.width = 800;
    background.height = 600;

    filter = game.add.filter('Fire', 800, 600);
    filter.alpha = 0.0;

    background.filters = [filter];

    isTitleScreenShowing = true;
    TitleText = new Phaser.Text(game, 0, 0, "CORY'S GAME",
    {
        font: "72px Arial",
        fill: "#FFFFFF",
        align: "center"
    });
    TitleText.fixedToCamera = true;
    TitleText.stroke = '#000000';
    TitleText.strokeThickness = 2;
    TitleText.cameraOffset.setTo(175, 100);
    textGroup.add(TitleText);

    //Instruction Text
    instructionText();
    button = game.add.button(325, 500, 'button', removeTitleScreen, this, 0, 0, 0);

}

function removeTitleScreen()
{
    background.kill();

    isTitleScreenShowing = false;
    TitleText.destroy();
    instructionText.destroy();
    createLevel();
}
var instructionText;

function instructionText()
{
    instructionText = new Phaser.Text(game, 0, 0,
        "Instructions\n Destroy the tanks, collect power-ups, and score as you go along\n\nControls: \nUse Arrows keys or WASD to move around \nUse left mouse button to shoot \nHold shift to run",
        {
            font: "16px Arial",
            fill: "#FFFFFF",
            align: "center"
        });
    instructionText.fixedToCamera = true;
    instructionText.stroke = '#000000';
    instructionText.strokeThickness = 2;
    instructionText.cameraOffset.setTo(200, 300);
    textGroup.add(instructionText);
}

function createLevel()
{
    game.add.tileSprite(0, 0, 2000, 2000, 'floor');
    game.world.setBounds(0, 0, 1400, 1400);
    // game.world.setBounds(0, 0, 800, 600);

    healthBar = game.add.sprite(0, 0, 'health');
    healthBar.fixedToCamera = true;
    healthBar.cameraOffset.setTo(100, 580);

    staminaBar = game.add.sprite(0, 0, 'stamina');
    staminaBar.fixedToCamera = true;
    staminaBar.cameraOffset.setTo(400, 580);

    hud = game.add.sprite(0, 0, 'hud');
    hud.fixedToCamera = true;
    hud.cameraOffset.setTo(75, 570);
    hud.width = 600;


    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    player.checkWorldBounds = true;
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;

    game.camera.follow(player);

    //KEYBOARD
    cursors = game.input.keyboard.createCursorKeys();
    shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    shiftKey.onDown.add(makeCharacterRun, this);
    shiftKey.onUp.add(makeCharacterWalk, this);


    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);



    //HEALTH POTIONS
    healthPotions = [];
    for (var i = 0; i < 5; i++)
    {
        healthPotions.push(game.add.sprite(game.world.randomX, game.world.randomY, 'healthSprite'));

        game.physics.enable(healthPotions[i], Phaser.Physics.ARCADE);
    }


    //BULLETS
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(100, 'bullet');

    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0);
    bullets.setAll('anchor.y', 0);
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);


    //ENEMIES
    enemies = [];

    enemiesTotal = 25;
    enemiesAlive = enemiesTotal;
    for (var i = 0; i < enemiesTotal; i++)
    {
        enemies.push(new Enemy(i, game, player, enemyBullets, turret));
    }

    //EXPLOSIONS
    explosions = game.add.group();

    for (var i = 0; i < 10; i++)
    {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }
    addText();
}
var staminaBarText;
var healthBarText;

function addText()
{
    textGroup = game.add.group();

    //Adds text to main level
    debugText = new Phaser.Text(game, 0, 0, "Text",
    {
        font: "16px Arial",
        fill: "#ffffff"
    });
    debugText.fixedToCamera = true;
    debugText.stroke = '#000000';
    debugText.strokeThickness = 2;
    debugText.cameraOffset.setTo(650, 20);
    textGroup.add(debugText);


    staminaBarText = new Phaser.Text(game, 0, 0, "Stamina",
    {
        font: "12px Arial",
        fill: "#FFFFFF",
        align: "center"
    });
    staminaBarText.fixedToCamera = true;
    staminaBarText.stroke = '#000000';
    staminaBarText.strokeThickness = 2;
    staminaBarText.cameraOffset.setTo(400, 550);
    textGroup.add(staminaBarText);

    healthBarText = new Phaser.Text(game, 0, 0, "Health",
    {
        font: "12px Arial",
        fill: "#FFFFFF",
        align: "center"
    });
    healthBarText.fixedToCamera = true;
    healthBarText.stroke = '#000000';
    healthBarText.strokeThickness = 2;
    healthBarText.cameraOffset.setTo(100, 550);
    textGroup.add(healthBarText);
}


function update()
{
    if (isTitleScreenShowing == true)
    {
        filter.update();
    }
    else
    {
        if (surroundShield !== undefined && surroundShield.exists == true)
        {
            game.physics.arcade.overlap(enemyBullets, surroundShield, bulletHitShield, null, this);
        }
        else
        {
            game.physics.arcade.overlap(enemyBullets, player, bulletHitPlayer, null, this);
        }
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;


        enemiesAlive = 0;


        if (gameOver == false)
        {
            for (var i = 0; i < enemies.length; i++)
            {
                if (enemies[i].alive)
                {
                    enemiesAlive++;
                    game.physics.arcade.collide(player, enemies[i].enemy);

                    game.physics.arcade.overlap(bullets, enemies[i].enemy, bulletHitEnemy, null, this);
                    enemies[i].update();
                }
                else
                {
                    game.physics.arcade.overlap(player, enemies[i].coinSprite.sprite, playerCollectCoin, null, this);
                }
            }
            if (enemiesAlive == 0)
            {

                gameWon();
            }

            for (var i = 0; i < healthPotions.length; i++)
            {
                // console.log(healthPotions[i])
                game.physics.arcade.overlap(player, healthPotions[i], addHealth, null, this);
            }


            playerMovement();


            if (game.input.activePointer.isDown)
            {
                fire();
            }

            //POWERUPS
            if (surroundShield !== undefined)
            {
                surroundShield.x = player.x - (surroundShield.width - player.width) / 2;
                surroundShield.y = player.y - (surroundShield.height - player.height) / 2.5; //Magic? Maybe
            }
            if (superSpeedTime !== "" && superSpeedTime < game.time.now)
            {
                setCharacterSpeed(characterSpeed / 2);
                runSpeed /= 2;
                walkSpeed /= 2;
                superSpeedTime = "";
            }

            hud.bringToTop();
            displayPlayerHeath();
            displayStaminaBar();

        }
        else
        {
            player.kill();
            for (var i = 0; i < enemies.length; i++)
            {
                if (enemies[i].alive)
                {
                    enemies[i].enemy.kill();
                    enemies[i].turret.kill();
                    enemies[i].enemyHealthBar.kill();
                }
                else
                {
                    enemies[i].coinSprite.sprite.kill();
                }
            }
            for (var i = 0; i < healthPotions.length; i++)
            {
                healthPotions[i].kill();
            }


            if (surroundShield !== undefined)
                surroundShield.kill();
        }

        //Debug text
        displayDebug();
    }
}

function addHealth(player, healthPotion)
{
    healthPotion.kill();
    if (health + 5 < maxHealth)
    {
        health += 5;
    }
    else
    {
        health = maxHealth;
    }
}
var score = 0;

function playerCollectCoin(player, powerup)
{

    powerup.kill();
    if (powerup.name == "coin")
    {
        score++;
    }
    else if (powerup.name == "shield")
    {
        if (surroundShield === undefined || surroundShield.exists === false)
        {
            surroundShield = game.add.sprite(player.x, player.y, 'surroundShield');
            shieldWidth = surroundShield.width;
            shieldHeight = surroundShield.height;
            surroundShield.health = 3;
            surroundShield.alpha = .3;
            game.physics.enable(surroundShield, Phaser.Physics.ARCADE);
        }
        else //Regenerates shield helath
        {
            surroundShield.health = 3;
            surroundShield.width = shieldWidth;
            surroundShield.height = shieldHeight;
        }
    }
    else if (powerup.name == "superspeed")
    {

        if (characterSpeed == walkSpeed)
            setCharacterSpeed(200);
        else
            setCharacterSpeed(400);
        runSpeed = 400;
        walkSpeed = 200;
        superSpeedTime = game.time.now + 5000;
    }
}
var superSpeedTime;

function bulletHitShield(enemy, bullet)
{
    bullet.kill();
    surroundShield.health--;
    surroundShield.width -= surroundShield.width * .25;
    surroundShield.height -= surroundShield.height * .25;
    if (surroundShield.health <= 0)
    {
        surroundShield.kill();
    }
}

function displayDebug()
{
    //Debuging sprite boundries
    // game.debug.spriteBounds(player);

    debugText.setText(
        "Health: " + health + "\n" +
        "maxHealth: " + maxHealth + "\n" +
        "Stamina: " + stamina + "\n" +
        "maxStamina: " + maxStamina + "\n" +
        "characterSpeed: " + characterSpeed + "\n" +
        "enemiesAlive: " + enemiesAlive + "\n" +
        "score: " + score + "\n"
    );
}

function gameWon()
{

    emitter = game.add.emitter(player.x, player.y - 500, 200);

    emitter.makeParticles('coinSprite');

    //	false means don't explode all the sprites at once, but instead release at a rate of 20 particles per frame
    //	The 5000 value is the lifespan of each particle
    emitter.start(false, 5000, 20);
    var wonText = new Phaser.Text(game, 0, 0, "Winner!\n Final Score: " + score,
    {
        font: "65px Arial",
        fill: "#ffffff",
        align: "center"
    });
    wonText.fixedToCamera = true;
    wonText.stroke = '#000000';
    wonText.strokeThickness = 2;
    wonText.cameraOffset.setTo(175, 220);
    textGroup.add(wonText);
    gameOver = true;
}

function playerMovement()
{
    if (stamina <= 0)
    {
        makeCharacterWalk();
    }
    if (cursors.left.isDown || game.input.keyboard.isDown(Phaser.Keyboard.A))
    {
        player.body.velocity.x = -characterSpeed;
        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown || game.input.keyboard.isDown(Phaser.Keyboard.D))
    {
        player.body.velocity.x = +characterSpeed;
        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    if (cursors.up.isDown || game.input.keyboard.isDown(Phaser.Keyboard.W))
    {

        player.body.velocity.y = -characterSpeed;

    }
    else if (cursors.down.isDown || game.input.keyboard.isDown(Phaser.Keyboard.S))
    {

        player.body.velocity.y = characterSpeed;
    }

    if (characterSpeed == runSpeed && (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown ||
        game.input.keyboard.isDown(Phaser.Keyboard.W) || game.input.keyboard.isDown(Phaser.Keyboard.A) || game.input.keyboard.isDown(Phaser.Keyboard.S) || game.input.keyboard.isDown(Phaser.Keyboard.D)))
    {
        decreaseStamina();
    }
    else if (characterSpeed == walkSpeed)
    {
        increaseStamina();
    }
}

var nextStaminaIncrease = 0;

function increaseStamina()
{
    if (game.time.now > nextStaminaIncrease && stamina < maxStamina)
    {
        nextStaminaIncrease = game.time.now + 1000;
        stamina++;
    }
}
var nextStaminaDecrease = 0;

function decreaseStamina()
{
    if (game.time.now > nextStaminaDecrease && stamina <= maxStamina)
    {
        nextStaminaDecrease = game.time.now + 100;
        stamina--;
    }
}

function displayStaminaBar()
{
    staminaBar.bringToTop();
    if (this.staminaBar.width != this.stamina)
    {
        this.staminaBar.width = this.stamina * 1.5;
    }
}

function render()
{}

function makeCharacterRun()
{
    if (stamina > 0)
        setCharacterSpeed(runSpeed);
}

function makeCharacterWalk()
{
    setCharacterSpeed(walkSpeed);
}

function setCharacterSpeed(newSpeed)
{
    characterSpeed = newSpeed;
}

function bulletHitPlayer(tank, bullet)
{

    bullet.kill();
    health -= 2;
    if (health <= 0)
    {
        healthBar.width = 0;
        var gameOverText = new Phaser.Text(game, 0, 0, "GAME OVER\n Score: " + score,
        {
            font: "65px Arial",
            fill: "#ffffff"
        });
        gameOverText.fixedToCamera = true;
        gameOverText.stroke = '#000000';
        gameOverText.strokeThickness = 2;
        gameOverText.cameraOffset.setTo(200, 200);
        textGroup.add(gameOverText);
        gameOver = true;
    }
}

function displayPlayerHeath()
{
    healthBar.bringToTop();
    if (this.healthBar.width != this.health)
    {
        this.healthBar.width = this.health * 4;
    }
}

function bulletHitEnemy(enemy, bullet)
{

    bullet.kill();
    if (bullet.inCamera == true)
    {
        score++;
        var destroyed = enemies[enemy.name].damage();
        if (destroyed)
        {
            var explosionAnimation = explosions.getFirstExists(false);
            explosionAnimation.reset(enemy.x, enemy.y);
            explosionAnimation.play('kaboom', 30, false, true);

        }
    }
}

function fire()
{

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(player.x, player.y);

        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 0);

    }

}

/////Enemies!
Enemy = function (index, game, player, bullets, turret)
{

    var x = game.world.randomX;
    var y = game.world.randomY;


    this.game = game;
    this.health = (Math.random() * 40) + 30; //Setting random health between 30-70
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 3000;
    this.nextFire = 0;
    this.alive = true;

    this.enemy = game.add.sprite(x, y, 'enemy', 'tank1');
    this.turret = game.add.sprite(x, y, 'enemy', 'turret');

    this.enemy.anchor.set(0.5);
    this.turret.anchor.set(0.3, 0.5);

    this.enemy.name = index.toString();
    game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
    this.enemy.body.immovable = false;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.body.bounce.setTo(1, 1);

    this.enemy.angle = game.rnd.angle();

    game.physics.arcade.velocityFromRotation(this.enemy.rotation, 100, this.enemy.body.velocity);
    this.coinSprite;

    this.enemyHealthBar = game.add.sprite(x, y, 'health');
    this.enemyHealthBar.anchor.set(.5, 5);

};

Enemy.prototype.damage = function ()
{

    this.health -= 10;

    this.enemyHealthBar.width = this.health;
    if (this.health <= 1)
    {
        this.alive = false;
        this.coinSprite = new Powerup(game, this.enemy.x, this.enemy.y);
        this.enemy.kill();
        this.turret.kill();
        this.enemyHealthBar.kill();

        return true;
    }

    return false;

}

Enemy.prototype.update = function ()
{

    this.turret.x = this.enemy.x;
    this.turret.y = this.enemy.y;
    this.enemyHealthBar.y = this.enemy.y;
    this.enemyHealthBar.x = this.enemy.x;
    this.enemyHealthBar.width = this.health / 2;
    this.turret.rotation = this.game.physics.arcade.angleBetween(this.enemy, this.player);

    if (this.game.physics.arcade.distanceBetween(this.enemy, this.player) < 400)
    {
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {

            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.turret.x, this.turret.y);

            bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
        }
    }
};


Powerup = function (game, x, y)
{
    this.game = game;
    var OneAndFour = Math.floor((Math.random() * 4) + 1);
    if (OneAndFour == 1)
    {
        this.sprite = game.add.sprite(x, y, 'shield');
        this.sprite.name = "shield";
    }
    else if (OneAndFour == 2)
    {
        this.sprite = game.add.sprite(x, y, 'bluepotion');
        this.sprite.name = "superspeed";
    }
    else
    {
        this.sprite = game.add.sprite(x, y, 'coinSprite');
        this.sprite.name = "coin";
    }
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
};