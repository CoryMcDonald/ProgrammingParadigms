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
var nextFire = 200;
var fireRate = 200;
var bullets;
var turret;
var healthBar;
var staminaBar;
var maxHealth = 35;
var health = maxHealth;
function preload() {

    // game.load.tilemap('mario', 'assets/world.json', null, Phaser.Tilemap.TILED_JSON);
    // game.load.image('tiles', 'assets/pics/super_mario.png');

    // game.load.image('player', 'assets/pics/ball.png');
    game.load.atlas('enemy', 'assets/pics/tanks.png', 'assets/pics/tanks.json');
    game.load.spritesheet('player', 'assets/pics/dude.png', 32, 48);
    game.load.image('bullet', 'assets/pics/bullet.png');
    game.load.image('turret', 'assets/pics/bullet.png');
    game.load.image('floor', 'assets/pics/floor.png');

}

function create() {
    // game.stage.backgroundColor = '#000000';

    
    game.add.tileSprite(0, 0, 2000, 2000, 'floor');
    game.world.setBounds(0, 0, 1400, 1400);


    game.physics.startSystem(Phaser.Physics.ARCADE);

    player = game.add.sprite(25, game.world.centerY, 'player');
    healthBar = new Phaser.Rectangle(player.x, player.y-10, health, 7);
    staminaBar = new Phaser.Rectangle(5, 0, 10, -stamina);


    
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
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);



    //  Create some baddies to waste :)
    enemies = [];

    enemiesTotal = 20;
    enemiesAlive = 20;

    for (var i = 0; i < enemiesTotal; i++)
    {
        enemies.push(new Enemy(i, game, player, enemyBullets, turret));
    }

    
}
//An adventure game where you retrieve holy artifacts with cyclops while upgrading your gear.


function update() {
    // game.physics.arcade.collide(player);
    game.debug.geom(healthBar,'#ff0000');
    game.debug.geom(staminaBar,'#000000');
    
    game.physics.arcade.overlap(enemyBullets, player, bulletHitPlayer, null, this);

    //Debuging sprite boundries
    // game.debug.spriteBounds(player);
    
    enemiesAlive = 0;


    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    
    for (var i = 0; i < enemies.length; i++)
    {
        if (enemies[i].alive)
        {
            enemiesAlive++;
            game.physics.arcade.collide(player, enemies[i].enemy);
            game.physics.arcade.overlap(bullets, enemies[i].enemy, bulletHitEnemy, null, this);
            enemies[i].update();
        }
    }



    if(stamina <= 0)
    {
        makeCharacterWalk();
    }
    if (cursors.left.isDown) {
        player.body.velocity.x = -characterSpeed;
	   if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    } else if (cursors.right.isDown) {
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
    if (cursors.up.isDown) {
        
        player.body.velocity.y = -characterSpeed;
	   
    } else if (cursors.down.isDown) {
        
        player.body.velocity.y = characterSpeed;
    }
    
    if(characterSpeed == runSpeed && (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown))
    {
        decreaseStamina();
    }else if(characterSpeed == walkSpeed)
    {
       increaseStamina();
    }
    
    
    
    if (game.input.activePointer.isDown)
    {
        //  Boom!
        fire();
    }

    displayPlayerHeath();
    displayStaminaBar();
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
    this.staminaBar.y = game.camera.y + 300;
    this.staminaBar.x = game.camera.x + 20;
    this.staminaBar.height = -this.stamina;
}
function render()
{
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
    health -= 5;
    if(health <= 0)
    {
        player.reset(0,50);
        health = maxHealth;
        stamina = maxStamina;
    }
}
function displayPlayerHeath()
{
    this.healthBar.x = this.player.x;
    this.healthBar.y = this.player.y - 10;
    this.healthBar.width = this.health;
}
function bulletHitEnemy (enemy, bullet) {

    bullet.kill();

    var destroyed = enemies[enemy.name].damage();

    if (destroyed)
    {
        
        // var explosionAnimation = explosions.getFirstExists(false);
        // explosionAnimation.reset(enemy.x, enemy.y);
        // explosionAnimation.play('kaboom', 30, false, true);
    }

}
function fire () {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstExists(false);

        bullet.reset(player.x, player.y);

        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
    }

}

/////Enemies!
Enemy = function (index, game, player, bullets, turret) {

    var x = game.world.randomX;
    var y = game.world.randomY;
    
    // var x = 100;
    // var y = game.world.centerY;

    this.game = game;
    this.health = 30;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 2000;
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

    // this.enemy.angle = game.rnd.angle();

    // game.physics.arcade.velocityFromRotation(this.enemy.rotation, 100, this.enemy.body.velocity);
    

    this.enemyHealthBar = new Phaser.Rectangle(this.enemy.x - this.health/2, this.enemy.y - 50, this.health, 7);
    // this.enemyHealthBar.anchor.set(0.5);
};

Enemy.prototype.damage = function() {

    this.health -= 10;

    this.enemyHealthBar.width = this.health;
    if (this.health <= 0)
    {
        this.alive = false;

        // this.shadow.kill();
        this.enemy.kill();
        this.turret.kill();

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
    this.turret.rotation = this.game.physics.arcade.angleBetween(this.enemy, this.player);

    if (this.game.physics.arcade.distanceBetween(this.enemy, this.player) < 300)
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