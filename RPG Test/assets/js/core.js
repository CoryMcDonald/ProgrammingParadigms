/*GLOBALS*/
var cursors;
var gamePaused = false;
var Player;

var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'game',
{
    preload: preload,
    create: create,
    update: update
})

function preload()
{
    //Player
    game.load.image('player', 'assets/pics/player.gif');
    game.load.image('001', 'assets/pics/sword.png');
    game.load.image('011', 'assets/pics/seed.png');
    
    //GUI
    game.load.image('button', 'assets/pics/button.gif');
    game.load.image('option', 'assets/pics/option.gif');
    game.load.image('playerEquipedSprite', 'assets/pics/playerEquipedSprite.gif');
    game.load.image('healthBar', 'assets/pics/healthBar.png');
    
    //Backgrounds
    game.load.image('bg', 'assets/pics/bg.jpg');
    
    //NPCs
    game.load.image('NPC', 'assets/pics/npc.gif');
    
    //Enemies
    game.load.image('Enemy1', 'assets/pics/Enemy1.gif');
}

function create()
{
    cursors = game.input.keyboard.createCursorKeys();
    createWorld();
    createButtons();
    createInventoryMapping();
    readInventory();
    initalizeCharacters();
}
function createWorld()
{
    game.world.setBounds(0, 0, 800, 600);
    game.stage.backgroundColor = '#60A859';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // createNPCs();
    // createEnemies();
}
function createNPCs()
{
    NPCs = game.add.group();
    for(var i =0 ; i<5; i++)
    {
        var originX =game.rnd.integerInRange(50,550);
        var originY= game.rnd.integerInRange(50, 550);
        var currentNPC = NPCs.create(originX,originY, 'NPC');
        currentNPC.health = 10;
        currentNPC.speed = 50;
        
        currentNPC.originX = originX;
        currentNPC.originY = originY;
        game.physics.enable(currentNPC, Phaser.Physics.ARCADE);
        currentNPC.body.collideWorldBounds = true;
    }
}

var Enemies;
function createEnemies()
{
    Enemies = game.add.group();
    for(var i =0 ; i<2; i++)
    {
        var originX = game.rnd.integerInRange(50,550);
        var originY = game.rnd.integerInRange(50, 550);
        
        var patrolDistance = game.rnd.integerInRange(200, 350);
        var currentEnemy = Enemies.create(originX,originY, 'Enemy1');

        currentEnemy.speed = game.rnd.integerInRange(75, 125);
        
        currentEnemy.originX = originX;
        currentEnemy.originY = originY;
        
        currentEnemy.sword = game.add.sprite(originX, originY, '001');
        currentEnemy.sword.width = 32;
        currentEnemy.sword.swingTime = 0;
        currentEnemy.sword.hold = 50;
        
        //Display health
        currentEnemy.healthBar = game.add.sprite(originX, originY-20, 'healthBar');
        currentEnemy.healthBar.width = currentEnemy.width;
        currentEnemy.maxHealth = 50;
        currentEnemy.health = currentEnemy.maxHealth;
        
        //Patrol logic
        currentEnemy.moving = '';
        currentEnemy.facing = '';
        currentEnemy.moveToOrigin = false;
        currentEnemy.patrolDown = Math.floor(Math.random()*2);
        
        if(currentEnemy.patrolDown == 1)
        {
            if(currentEnemy.originY+patrolDistance > game.world.bounds.height-currentEnemy.height){
                currentEnemy.maxPatrol = game.world.bounds.height-currentEnemy.height-5;
                currentEnemy.originY = game.world.bounds.height-patrolDistance;
                if(currentEnemy.originY < 0) //Ideally this should never happen but we'll see
                    currentEnemy.originY = 0;
                currentEnemy.y = currentEnemy.originY;
            }
                
            else
                currentEnemy.maxPatrol = currentEnemy.originY+patrolDistance;
        }
        else
        {
            if(currentEnemy.originX+patrolDistance > game.world.bounds.width-currentEnemy.width){
                currentEnemy.maxPatrol = game.world.bounds.width-1; console.log('out of bounds')}
            else
                currentEnemy.maxPatrol = currentEnemy.originX+patrolDistance;
        }
        
        currentEnemy.followingPlayer = false;
        
        game.physics.enable(currentEnemy, Phaser.Physics.ARCADE);
        game.physics.enable(currentEnemy.sword, Phaser.Physics.ARCADE);


        // currentEnemy.body.collideWorldBounds = true;
    }
    Enemies.setAll('body.collideWorldBounds', true);
}

function initalizeCharacters()
{
    Player = new Player(game, "Player1");
    game.camera.follow(Player.sprite);
}
var button;
function createButtons()
{
    button = game.add.button(745, 450, 'button', inventory, this);
    button.alpha = .75;
    button.z = -999;
    button.fixedToCamera = true;
}

var NPCs;
nextExecutionTime = 0;
function update()
{
    
    if(gamePaused === false)
    {
        game.physics.arcade.collide(Player.sprite, NPCs, collision, null, this);
        // game.physics.arcade.collide(NPCs);
        // UpdateNPCs();
        UpdateEnemies();
        Player.update();
        
    }else if(game.input.keyboard.isDown(Phaser.Keyboard.ESC))
    {
        exitInventory();
    }
    
}
function exitInventory()
{
    console.log('exiting inventory')
    gamePaused = false;
    inventoryGroup.destroy();
}
function collision(player, obj2)
{
    obj2.body.velocity.y = 0;
    obj2.body.velocity.x = 0;
    
    player.body.velocity.y = 0;
    player.body.velocity.x = 0;
}


function UpdateEnemies()
{
   
    if(Enemies !== undefined && Enemies.children.length > 0)
    {
        game.physics.arcade.collide(Enemies);
        game.physics.arcade.collide(Player.sprite, Enemies, collision, null, this);
        game.physics.arcade.overlap(Player.sword, Enemies, playerHitEnemy, null, this);
        

        Enemies.forEach(function(item)
        {
            var distanceFromPlayer = game.physics.arcade.distanceBetween(item, Player.sprite);
            var distanceFromOrigin = game.physics.arcade.distanceToXY(item, item.originX, item.originY);
            
            game.physics.arcade.overlap(item.sword, Player.sprite, enemyHitPlayer, null, this);
            
            item.body.velocity.x = 0;
            item.body.velocity.y = 0;
            
            //sword animation
            item.sword.x = item.x;
            item.sword.y = item.y;
            item.sword.rotation = 0;
            if(item.facing == 'right')
            {
                item.sword.x = item.x + item.width;
                item.sword.width = 32;
            }else if(item.facing == 'left')
            {
                item.sword.width = -32;
            }else if(item.facing == 'up')
            {
                item.sword.x = item.x-5;
                item.sword.y = item.y-15;
                item.sword.width = 32;
                item.sword.rotation = -.79;
            }
            else if(item.facing == 'down')
            {
                item.sword.x = item.x-5;
                item.sword.y = item.y+65;
                item.sword.width = -32;
                item.sword.rotation = 3.91;
            }
        
            
            //Healthbar
            item.healthBar.x = item.x;
            item.healthBar.y = item.y-20;
            
            if(distanceFromPlayer < 200)
            {
                item.followingPlayer = true;
                if(distanceFromPlayer > 65 && (item.facing == 'left' || item.facing == 'right'))
                {
                    game.physics.arcade.moveToObject(item, Player.sprite, item.speed);
                }
                else if(distanceFromPlayer > 80 && (item.facing =='up' || item.facing == 'down'))
                {
                    game.physics.arcade.moveToObject(item, Player.sprite, item.speed);
                }
                                    
                // swinging stuff
                if(game.time.now > item.sword.swingTime || item.sword.hold > 0)
                {
                    item.sword.swingTime = game.time.now + 500;
                    item.sword.hold --;
                    if(item.sword.hold < 0)
                    {
                        item.sword.hold  = 50;
                    }
                    if(item.facing == 'right')
                    {
                        item.sword.rotation = .75;
                        item.sword.x = item.sword.x+20;
                    }
                    else if(item.facing == 'left')
                    {
                        item.sword.x = item.sword.x-20;
                        item.sword.rotation = -.75;
                    }
                }
                xDifference = Player.sprite.x - item.x;
                yDifference = Player.sprite.y - item.y;
                globalItem = item; //todo take this out
                if(Math.abs(xDifference) > Math.abs(yDifference)) //the player is more towards the left or right than the bottom or up
                {
                    if(Player.sprite.x < item.x)
                    {
                        item.facing = 'left'
                    }else if(Player.sprite.x > item.x)
                    {
                        item.facing = 'right'
                    }
                }else
                {
                    if(Player.sprite.y < item.y)
                    {
                        item.facing = 'up'
                    }else if(Player.sprite.y > item.y)
                    {
                        item.facing = 'down'
                    }
                }
            }
            else if(item.moveToOrigin == true || (distanceFromOrigin > 50 && item.followingPlayer === true))
            {
                item.moveToOrigin = true;
                game.physics.arcade.moveToXY(item, item.originX, item.originY, item.speed);
                
                if(distanceFromOrigin < 5)
                {
                    item.followingPlayer = false;
                    item.moveToOrigin = false;
                }
                
                  if(item.body.velocity.x < 0)
                        item.facing = 'left';
                    else if( item.body.velocity.x > 0)
                        item.facing = 'right';
                    else if(item.body.velocity.y > 0)
                        item.facing = 'down'
                    else if(item.body.velocity.y < 0)
                        item.facing = 'up';
                    else
                        item.faing = 'stationary';
            }
            else if(item.followingPlayer == false)
            {
                //Patrol speed is 75% of normal speed
                if(item.moving == 'left')
                    item.body.velocity.x = -item.speed*.75;
                else if(item.moving == 'right')
                    item.body.velocity.x = item.speed*.75;
                else if(item.moving == 'up')
                    item.body.velocity.y = -item.speed*.75;
                else if(item.moving == 'down')
                    item.body.velocity.y = item.speed*.75;
                
                
                if(item.patrolDown == 1)
                {
                    if(item.y >= item.maxPatrol)
                        item.moving = 'up';
                    else if(distanceFromOrigin <= 5)
                        item.moving = 'down';
                    else if(item.y < item.originY)
                        game.physics.arcade.moveToXY(item, item.originX, item.originY, item.speed);
                }else
                {
                    if(item.x >= item.maxPatrol)
                    {
                        item.moving = 'left';
                    }
                    else if(distanceFromOrigin <= 5)
                    {
                        item.moving = 'right';
                    }else if(item.x < item.originX)
                        game.physics.arcade.moveToXY(item, item.originX, item.originY, item.speed);
                }
        
                  if(item.body.velocity.x < 0)
                        item.facing = 'left';
                    else if( item.body.velocity.x > 0)
                        item.facing = 'right';
                    else if(item.body.velocity.y > 0)
                        item.facing = 'down'
                    else if(item.body.velocity.y < 0)
                        item.facing = 'up';
                    else
                        item.faing = 'stationary';
            }

            
        });
    }

}
//todo figure out polymorphism in Javasript
function playerHitEnemy (player, enemy) {
    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        if(enemy.health <= 0)
        {
            enemy.sword.kill();
            enemy.kill();
            enemy.healthBar.kill();
        }else{
            enemy.health --;
            enemy.healthBar.width = (enemy.health*enemy.width)/enemy.maxHealth;
        }
        console.log(enemy.health);
        console.log(enemy.healthBar.width)
        //implement bounce
    }
}
function enemyHitPlayer(sword, player)
{
    if(player.health < 0)
    {
        Player.sword.kill();
        player.kill();
        Player.healthBar.kill();
    }else{
        // player.health--;
        Player.healthBar.width = (player.health*player.width)/player.maxHealth;
    }
}
function UpdateNPCs()
{
    if(game.time.now  > nextExecutionTime)
        {
            NPCs.forEach(function(item)
            {
                nextExecutionTime = game.time.now + 750;
                item.body.velocity.x = 0;
                item.body.velocity.y = 0;
                // item.body.acceleration.x = 0;
                // item.body.acceleration.y = 0;
                if(game.physics.arcade.distanceToXY(item, item.originX, item.originY) > 150 )
                {
                    // console.log('distance is greater than 150 for sprite - moving')
                    // item.alpha -= .75;
                    game.physics.arcade.moveToXY(item, item.originX, item.originY, item.speed);
                }else
                {
                    var randomNumber = Math.random();
                
                    if (randomNumber < .02)
                    {
                        item.body.velocity.x = -item.speed;
                    }
                    else if(randomNumber > .98)
                    {
                        item.body.velocity.x = item.speed;
                    }
                    
                    if(
                        (randomNumber > .005  && randomNumber < .01 || randomNumber > .995 && randomNumber < 1 ) ||
                        (randomNumber > .08  && randomNumber < .1)
                    )
                    {
                        item.body.velocity.y = -item.speed;
                    }
                    else if(
                        (randomNumber > .99 && randomNumber <.995 || randomNumber > 0 && randomNumber < .005 ) ||
                        (randomNumber > .93  && randomNumber < .95)
                    )
                    {
                        item.body.velocity.y = item.speed;
                    }
                }
            });
        }
}
function saveGame()
{
    //save inventory
    // createCookie('inventory',playerInventory,30)
    
}
window.onbeforeunload = function() {
    saveInventory();
}