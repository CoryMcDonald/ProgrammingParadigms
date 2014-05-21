/* Inventory.js */
var inventoryGroup;
function inventory()
{
    //disable buttons
    gamePaused = true;
    
    inventoryGroup  = game.add.group();
    
    var itemSlots = game.add.group();
    var playerEquiped = game.add.group();
    
    //Stylings
    var bg = inventoryGroup.create(0,0, 'bg');
    bg.alpha = .5;
    
    inventoryGroup.add(itemSlots);
    inventoryGroup.add(playerEquiped);
    for (var i = 0; i < 6; i++)
    {
        for(var j=0; j<8; j++)
        {
            //j*50 = the image width * column
            //game.world.centerX/5 = position of where it is going to be
            //j*5 = 5 pixel padding between each slot
            var s = itemSlots.create(j*50 + game.world.centerX/2 + (j*5), i*50 + game.world.centerY/2 + 65 + (i*5), 'button');
            s.name = {row:i, column:j};
            s.exists = true;
            s.visible = true;
        }
    }
    var playerEquipedSprite = playerEquiped.create(game.world.centerX/2 , game.world.centerY/2 - 115, 'playerEquipedSprite')
    for(var i=0; i<3; i++)
    {
        for(var j=0; j<3; j++)
        {
            var s = playerEquiped.create(j*50 + game.world.centerX/2 + (j*5) + 220, i*50 + game.world.centerY/2 - 115 + (i*5), 'button');
            s.name = {row:i, column:j};
            s.exists = true;
            s.visible = true;
        }
    }
}