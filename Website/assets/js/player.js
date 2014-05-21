//Player.js
Player = function (game, playerName)
{
    this.game = game;
    this.health = 10;

    this.sprite = game.add.sprite(0, 0, 'player');

    this.sprite.name = playerName;
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
};
Player.prototype.update = function ()
{
    //update player
};