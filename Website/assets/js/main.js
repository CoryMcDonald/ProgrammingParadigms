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
var maxStamina = 25;
var stamina = maxStamina;
var staminaDisplay;
var runSpeed = 2;
var walkSpeed= 1;
var characterSpeed = walkSpeed;
var facing = '';

var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;

var bullets;

function preload() {

    // game.load.tilemap('mario', 'assets/world.json', null, Phaser.Tilemap.TILED_JSON);
    // game.load.image('tiles', 'assets/pics/super_mario.png');

    // game.load.image('player', 'assets/pics/ball.png');
    game.load.atlas('enemy', 'assets/pics/tanks.png', 'assets/pics/tanks.json');
    game.load.spritesheet('player', 'assets/pics/dude.png', 32, 48);

}

function create() {
    game.stage.backgroundColor = '#000000';

    var text = "Stamina: " + stamina;
    var style = { font: "12px Arial", fill: "#ffffff" };

    staminaDisplay = game.add.text(50, 0, text,style);

    //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
    //  The second parameter maps this name to the Phaser.Cache key 'tiles'
    //  Creates a blank tilemap
    map = game.add.tilemap();

    //  Add a Tileset image to the map
    // map.addTilesetImage('tiles');
    // layer = map.create('level1', 40, 30, 32, 32);


    //  This resizes the game world to match the layer dimensions
    // layer.resizeWorld();

    game.physics.startSystem(Phaser.Physics.ARCADE);

    player = game.add.sprite(25, game.world.centerY, 'player');
    
    
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

    //  Create some baddies to waste :)
    enemies = [];

    enemiesTotal = 20;
    enemiesAlive = 20;

    for (var i = 0; i < enemiesTotal; i++)
    {
        enemies.push(new Enemy(i, game, player, enemyBullets));
    }

    
}
//An adventure game where you retrieve holy artifacts with cyclops while upgrading your gear.


function update() {
    // game.physics.arcade.collide(player);

    // game.physics.arcade.overlap(enemyBullets, player, bulletHitPlayer, null, this);

    enemiesAlive = 0;

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
	   player.x -= characterSpeed;
	   if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    } else if (cursors.right.isDown) {
	   player.x += characterSpeed;
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
	   player.y -= characterSpeed;
    } else if (cursors.down.isDown) {
	   player.y += characterSpeed;
    }
    
    if(characterSpeed == runSpeed && (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown))
    {
        decreaseStamina();
    }else if(characterSpeed == walkSpeed)
    {
       increaseStamina();
    }
    staminaDisplay.setText('Stamina: ' + stamina + '\ncharacterSpeed: ' + characterSpeed);
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

}
function bulletHitEnemy (tank, bullet) {

    bullet.kill();

    var destroyed = enemies[enemy.name].damage();

    if (destroyed)
    {
        // var explosionAnimation = explosions.getFirstExists(false);
        // explosionAnimation.reset(tank.x, tank.y);
        // explosionAnimation.play('kaboom', 30, false, true);
    }

}

/////Enemies!
Enemy = function (index, game, player, bullets) {

    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.health = 3;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1000;
    this.nextFire = 0;
    this.alive = true;

    // this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
    this.enemy = game.add.sprite(x, y, 'enemy', 'tank1');
    // this.turret = game.add.sprite(x, y, 'enemy', 'turret');

    // this.shadow.anchor.set(0.5);
    // this.tank.anchor.set(0.5);
    // this.turret.anchor.set(0.3, 0.5);

    this.enemy.name = index.toString();
    game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
    this.enemy.body.immovable = false;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.body.bounce.setTo(1, 1);

    this.enemy.angle = game.rnd.angle();

    game.physics.arcade.velocityFromRotation(this.enemy.rotation, 100, this.enemy.body.velocity);

};

Enemy.prototype.damage = function() {

    this.health -= 1;

    if (this.health <= 0)
    {
        this.alive = false;

        // this.shadow.kill();
        this.enemy.kill();
        // this.turret.kill();

        return true;
    }

    return false;

}

Enemy.prototype.update = function() {

    // this.shadow.x = this.tank.x;
    // this.shadow.y = this.tank.y;
    // this.shadow.rotation = this.tank.rotation;

    // this.turret.x = this.tank.x;
    // this.turret.y = this.tank.y;
    // this.turret.rotation = this.game.physics.arcade.angleBetween(this.tank, this.player);

    if (this.game.physics.arcade.distanceBetween(this.enemy, this.player) < 300)
    {
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.x, this.y);

            bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
        }
    }

};