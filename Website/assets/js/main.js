
/*Bugs
*/

/*
TODO
    UFO to drive around in, potentially removing shooting from alien in favor of getting to the ufo on the map and then shooting
    Add splashscreen/loading/etc whatever have you
    Add poewrups
        Invincibility
        Rapid Fire
        (If remove shooting) Gun
        Laser that continuesly damages enemies
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
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});
var player;
var jumpTimer = 0;

var map;
var layer;
var shiftKey;
var maxStamina = 150;
var stamina = maxStamina;
var staminaDisplay;
var runSpeed = 200;
var walkSpeed= 100;
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
function preload() {

    // game.load.tilemap('mario', 'assets/world.json', null, Phaser.Tilemap.TILED_JSON);
    // game.load.image('tiles', 'assets/pics/super_mario.png');

    // game.load.image('player', 'assets/pics/ball.png');
    game.load.atlas('enemy', 'assets/pics/tanks.png', 'assets/pics/tanks.json');
    game.load.spritesheet('player', 'assets/pics/dude.png', 32, 48);
    game.load.image('bullet', 'assets/pics/bullet.png');
    game.load.image('turret', 'assets/pics/bullet.png');
    game.load.image('floor', 'assets/pics/floor.png');
    game.load.image('coinSprite', 'assets/pics/coinSprite.gif');
    game.load.image('healthSprite', 'assets/pics/healthPotion.gif');
    game.load.spritesheet('kaboom', 'assets/pics/explosion.png', 64, 64, 23);
    
    
        game.load.spritesheet('button', 'assets/pics/button.png', 193, 71);

    //HUD
    game.load.image('health', 'assets/pics/Health.png');
    game.load.image('hud', 'assets/pics/hud.png');
    game.load.image('stamina', 'assets/pics/stamina.png');
}

var textGroup;
var debugText;
var hud;
function create() {
    // game.stage.backgroundColor = '#000000';

    
    game.add.tileSprite(0, 0, 2000, 2000, 'floor');
    game.world.setBounds(0, 0, 1400, 1400);


    game.physics.startSystem(Phaser.Physics.ARCADE);

    player = game.add.sprite(25, 0, 'player');
    healthBar = game.add.sprite(0, 0, 'health');
    healthBar.fixedToCamera = true;
    healthBar.cameraOffset.setTo(100,580);
    
    staminaBar = game.add.sprite(0, 0, 'stamina');
    staminaBar.fixedToCamera = true;
    staminaBar.cameraOffset.setTo(400,580);

    hud = game.add.sprite(0, 0, 'hud');
    hud.fixedToCamera = true;
    hud.cameraOffset.setTo(75,570);
    hud.width = 600;
    
    player.checkWorldBounds = true;
    game.physics.enable(player, Phaser.Physics.ARCADE);
    game.camera.follow(player);

    player.body.collideWorldBounds = true;

    // player.body.velocity.x=76;
    // player.body.velocity.y=95;

    // player.body.bounce.set(1);
    // player.body.gravity.y = 350;
    cursors = game.input.keyboard.createCursorKeys();

    shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    shiftKey.onDown.add(makeCharacterRun, this);
    shiftKey.onUp.add(makeCharacterWalk, this);
    
    
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    
    
    healthPotions = [];
    for (var i = 0; i < 5; i++)
    {
        healthPotions.push(game.add.sprite(game.world.randomX, game.world.randomY, 'healthSprite'));
       
        game.physics.enable(healthPotions[i], Phaser.Physics.ARCADE);
    }
    
    //Create enemies
    
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
    

    //  Create some baddies to waste :)
    enemies = [];

    enemiesTotal = 20;
    enemiesAlive = 20;

    for (var i = 0; i < enemiesTotal; i++)
    {
        enemies.push(new Enemy(i, game, player, enemyBullets, turret));
    }

     //  Explosion pool
    explosions = game.add.group();

    for (var i = 0; i < 10; i++)
    {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }


    

    addText();
}
function addText()
{
        //Text
    textGroup = game.add.group();
    debugText = new Phaser.Text(game, 0, 0, "Text", { font:"16 Arial", fill:"#ffffff"});
    debugText.fixedToCamera = true;
    debugText.stroke = '#000000';
    debugText.strokeThickness = 2;
    debugText.cameraOffset.setTo(650,20);
    
    
    var instructionText = new Phaser.Text(game, 0, 0,
    "Instructions: \nUse Arrows keys to move around \nUse mouse to shoot \nShift to run", { font:"16 Arial", fill:"#FFFFFF"});
    instructionText.fixedToCamera = true;
    instructionText.stroke = '#000000';
    instructionText.strokeThickness = 2;
    instructionText.cameraOffset.setTo(10, 20);
    
    
    var staminaBarText = new Phaser.Text(game, 0, 0, "Stamina", { font:"12 Arial", fill:"#FFFFFF", align: "center"});
    staminaBarText.fixedToCamera = true;
    staminaBarText.stroke = '#000000';
    staminaBarText.strokeThickness = 2;
    staminaBarText.cameraOffset.setTo(400, 550);
    textGroup.add(staminaBarText);
    
    var healthBarText = new Phaser.Text(game, 0, 0, "Health", { font:"12 Arial", fill:"#FFFFFF", align: "center"});
    healthBarText.fixedToCamera = true;
    healthBarText.stroke = '#000000';
    healthBarText.strokeThickness = 2;
    healthBarText.cameraOffset.setTo(100, 550);
    textGroup.add(healthBarText);
    
    textGroup.add(instructionText);
    textGroup.add(debugText);
}

function update() {
   
        game.physics.arcade.overlap(enemyBullets, player, bulletHitPlayer, null, this);
        
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        
        
        enemiesAlive = 0;
    
     
    
        if(gameOver == false)
        {
            for (var i = 0; i < enemies.length; i++)
            {
                if (enemies[i].alive)
                {
                    enemiesAlive++;
                    game.physics.arcade.collide(player, enemies[i].enemy);
                    game.physics.arcade.overlap(bullets, enemies[i].enemy, bulletHitEnemy, null, this);
                    enemies[i].update();
                }else
                {
                    game.physics.arcade.overlap(player, enemies[i].coinSprite, playerCollectCoin, null, this);
                }
            }
            if(enemiesAlive == 0)
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
            
            
            hud.bringToTop();
            displayPlayerHeath();
            displayStaminaBar();
        
        }else
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
            }
        }
    
    //Debug text
    displayDebug();
}
function addHealth(player, healthPotion)
{
    healthPotion.kill();
    if(health + 5 < maxHealth)
    {
        health += 5;
    }else
    {
        health = maxHealth;
    }
}
var score =0;
function playerCollectCoin(player, coin)
{
    coin.kill();
    score ++;
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

    emitter = game.add.emitter(player.x , player.y - 500, 200);

    emitter.makeParticles('coinSprite');

    //	false means don't explode all the sprites at once, but instead release at a rate of 20 particles per frame
    //	The 5000 value is the lifespan of each particle
    emitter.start(false, 5000, 20);
    var wonText = new Phaser.Text(game, 0, 0, "CONGRATULATIONS!\nYOU WON!", { font:"65 Arial", fill:"#ffffff", align: "center"});
    wonText.fixedToCamera = true;
    wonText.stroke = '#000000';
    wonText.strokeThickness = 2;
    wonText.cameraOffset.setTo(50, 220);
    textGroup.add(wonText);
    gameOver = true;
    

}
function playerMovement()
{
    if(stamina <= 0)
    {
        makeCharacterWalk();
    }
    if (cursors.left.isDown || game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        player.body.velocity.x = -characterSpeed;
	   if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    } else if (cursors.right.isDown || game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        player.body.velocity.x = +characterSpeed;
	   if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }else
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
    if (cursors.up.isDown || game.input.keyboard.isDown(Phaser.Keyboard.W)) {
        
        player.body.velocity.y = -characterSpeed;
	   
    } else if (cursors.down.isDown || game.input.keyboard.isDown(Phaser.Keyboard.S)) {
        
        player.body.velocity.y = characterSpeed;
    }
    
    if(characterSpeed == runSpeed && (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown ||
         game.input.keyboard.isDown(Phaser.Keyboard.W) || game.input.keyboard.isDown(Phaser.Keyboard.A) || game.input.keyboard.isDown(Phaser.Keyboard.S)
         || game.input.keyboard.isDown(Phaser.Keyboard.D)))
    {
        decreaseStamina();
    }else if(characterSpeed == walkSpeed)
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
    if (game.time.now > nextStaminaDecrease && stamina <=maxStamina)
    {
        nextStaminaDecrease = game.time.now + 100;
        stamina--;
    }
}
function displayStaminaBar()
{
    staminaBar.bringToTop();
    if( this.staminaBar.width != this.stamina)
    {
        this.staminaBar.width = this.stamina*1.5;
    }
}
function render()
{
    // game.debug.geom(staminaBar,'#ff0000');
    // geomHealth.fixedToCamera = true;
}
function makeCharacterRun()
{
    if(stamina > 0)
        updateCharacterSpeed(runSpeed);
}
function makeCharacterWalk()
{
    updateCharacterSpeed(walkSpeed);
}
function updateCharacterSpeed(newSpeed) {
    characterSpeed = newSpeed;
}
function bulletHitPlayer (tank, bullet) {

    bullet.kill();
    health -= 2;
    if(health <= 0)
    {
        healthBar.width = 0;
        var gameOverText = new Phaser.Text(game, 0, 0, "GAME OVER", { font:"65 Arial", fill:"#ffffff"});
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
    if( this.healthBar.width != this.health)
    {
        this.healthBar.width = this.health*4;
    }
}
function bulletHitEnemy (enemy, bullet) {

    bullet.kill();
    if(bullet.inCamera == true)
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
function fire () {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(player.x, player.y);
    
        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 0);
        
    }

}

/////Enemies!
Enemy = function (index, game, player, bullets, turret) {

    var x = game.world.randomX;
    var y = game.world.randomY;
    
    // var x = 100;
    // var y = game.world.centerY;

    this.game = game;
    this.health = (Math.random()*40)+30; //Setting random health between 30-70
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 3000;
    this.nextFire = 0;
    this.alive = true;

    // this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
    this.enemy = game.add.sprite(x, y, 'enemy', 'tank1');
    this.turret = game.add.sprite(x, y, 'enemy', 'turret');
        

    // this.shadow.anchor.set(0.5);
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

    this.enemyHealthBar = game.add.sprite(x,y,'health');
    this.enemyHealthBar.anchor.set(.5,5);
};

Enemy.prototype.damage = function() {

    this.health -= 10;

    this.enemyHealthBar.width = this.health;
    if (this.health <= 1)
    {
        this.alive = false;
        //1 out of 4 chance that you will get a key
        // if(Math.floor((Math.random()*4)+1) == 1 )
        if(true)
        {
            this.coinSprite = game.add.sprite(this.enemy.x, this.enemy.y, 'coinSprite');
            game.physics.enable(this.coinSprite, Phaser.Physics.ARCADE);
        }
        
        // this.shadow.kill();
        this.enemy.kill();
        this.turret.kill();
        this.enemyHealthBar.kill();

        return true;
    }

    return false;

}

Enemy.prototype.update = function() {

    // this.shadow.x = this.tank.x;
    // this.shadow.y = this.tank.y;
    // this.shadow.rotation = this.tank.rotation;
    // game.debug.geom(this.enemyHealthBar,'#ff0000');

    this.turret.x = this.enemy.x;
    this.turret.y = this.enemy.y;
    this.enemyHealthBar.y = this.enemy.y;
    this.enemyHealthBar.x = this.enemy.x;
    this.enemyHealthBar.width = this.health/2;
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
    
    // this.enemyHealthBar.x = this.enemy.x - this.health/2;
    // this.enemyHealthBar.y = this.enemy.y - 50;

};

/*
Better Weapons


*/