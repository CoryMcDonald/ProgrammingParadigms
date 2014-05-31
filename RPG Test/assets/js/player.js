//Player.js
Player = function (game, playerName)
{
    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;

    this.sprite = game.add.sprite(x, y, 'player');
    this.sprite.name = playerName;
    
    //health
    this.sprite.health = 300;
    this.sprite.maxHealth = 300;
    this.healthBar = game.add.sprite(x, y-20, 'healthBar');
    this.healthBar.width = this.sprite.width;
    
    this.sword = game.add.sprite(x, y, '001');
    this.sword.damage = 5;
    this.sword.width = -this.sword.width;
    // this.sword.anchor.set();

    this.facing = 'left'
    
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
        this.facing = 'up';
    }
    else if(cursors.down.isDown || game.input.keyboard.isDown(Phaser.Keyboard.S))
    {
        this.sprite.body.velocity.y = this.speed;
        this.facing = 'down';
    }
    
    
    //Sword
    if(this.facing == 'right')
    {
        this.sword.x = this.sprite.x + this.sprite.width;
        this.sword.width = 32;
    }
    else if(this.facing == 'left')
    {
        this.sword.x = this.sprite.x;
        this.sword.width = -32;
    }
    else if(this.facing == 'up')
    {
        this.sword.x = this.sprite.x;
        this.sword.y = this.sprite.y-15;
        this.sword.width = 32;
        this.sword.rotation = -.78;
    }
    else if(this.facing == 'down')
    {
        this.sword.x = this.sprite.x-5;
        this.sword.y = this.sprite.y+65;
        this.sword.width = -32;
        this.sword.rotation = 3.9;
    }
    
    //health
    this.healthBar.x = this.sprite.x;
    this.healthBar.y = this.sprite.y-20;
    
    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        //  && game.time.now > this.sword.timeout && this.sword.numOfSecondsToHold > 0
        // this.sword.timeout = game.time.now + 1000;
        
        // if(this.sword.holding < game.time.now){
        //     // console. log(this.sword.numOfSecondsToHold)
        //     this.sword.numOfSecondsToHold--;
        //     this.sword.holding = game.time.now + 500;
        // }
            
        if(this.facing == 'right'){
            this.sword.rotation = .75;
            this.sword.x = this.sword.x + 25;
        }
        else if(this.facing =='left')
        {
            this.sword.rotation -= .75;
            this.sword.x = this.sword.x - 25;
        }
    }
    // else if(this.sword.numOfSecondsToHold <= 0 && this.sword.holding < game.time.now)
    // {
    //     // console.log('replenishing')
    //     this.sword.numOfSecondsToHold = 3;
    // }

};