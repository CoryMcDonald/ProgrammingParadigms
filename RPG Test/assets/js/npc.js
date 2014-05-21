/*
    A general class for NPC's
*/
NPC = function (game, NPCName)
{
    this.game = game;

    this.sprite = game.add.sprite(Math.random()*800, Math.random()*600, 'NPC');
    this.sprite.name = NPCName;

    this.health = 10;
    this.speed = 30;
    this.collidingWithPlayer = false;
    this.nextExecution = 0;

    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    
    this.sprite.body.collideWorldBounds = true;
    // this.sprite.body.immovable = true;
    game.time.events.loop(Phaser.Timer.SECOND, this.move, this);

};

NPC.prototype.update = function ()
{
};

