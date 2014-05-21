//Player.js
Player = function (game, playerName)
{
    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;

    this.sprite = game.add.sprite(x, y, 'player');
    this.sprite.name = playerName;
    this.sword = game.add.sprite(x, y, 'sword');
    this.sword.width = -this.sword.width;
    // this.sword.anchor.set();

    this.facing = 'left'
    
    this.health = 10;
    this.speed = 115;
    
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    game.physics.enable(this.sword, Phaser.Physics.ARCADE);

    this.sword.timeout = 0;
    this.sword.holding = 0;
    this.sword.numOfSecondsToHold = 3;
    this.sprite.body.collideWorldBounds = true;
    // this.sprite.body.immovable = true;
    
};
Player.prototype.update = function ()
{
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sword.y = this.sprite.y;
    this.sword.rotation = 0;
    
    if (cursors.left.isDown || game.input.keyboard.isDown(Phaser.Keyboard.A))
    {
        this.sprite.body.velocity.x = -this.speed;
        this.facing = 'left';
    }
    else if (cursors.right.isDown || game.input.keyboard.isDown(Phaser.Keyboard.D))
    {
        this.sprite.body.velocity.x = this.speed;
        this.facing = 'right';
    }
    if(cursors.up.isDown || game.input.keyboard.isDown(Phaser.Keyboard.W))
    {
        this.sprite.body.velocity.y = -this.speed;
    }
    else if(cursors.down.isDown || game.input.keyboard.isDown(Phaser.Keyboard.S))
    {
        this.sprite.body.velocity.y = this.speed;
    }
    
    if(this.facing == 'right')
    {
        this.sword.x = this.sprite.x + this.sprite.width;
        this.sword.width = 32;
    }
    else
    {
        this.sword.x = this.sprite.x;
        this.sword.width = -32;
    }
    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        //  && game.time.now > this.sword.timeout && this.sword.numOfSecondsToHold > 0
        // this.sword.timeout = game.time.now + 1000;
        
        if(this.sword.holding < game.time.now){
            // console. log(this.sword.numOfSecondsToHold)
            this.sword.numOfSecondsToHold--;
            this.sword.holding = game.time.now + 500;
        }
            
        if(this.facing == 'right'){
            this.sword.rotation = .75;
            this.sword.x = this.sword.x + 25;
        }
        else
        {
            this.sword.rotation -= .75;
            this.sword.x = this.sword.x - 25;
        }
    }else if(this.sword.numOfSecondsToHold <= 0 && this.sword.holding < game.time.now)
    {
        // console.log('replenishing')
        this.sword.numOfSecondsToHold = 3;
    }

};