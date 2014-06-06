/* Inventory.js */
var inventoryGroup;
var playerInventory = [];
function inventory()
{
    //disable buttons
    gamePaused = true;
    
    inventoryGroup  = game.add.group();
    
    var itemSlots = game.add.group();
     itemsInventory = game.add.group();
    var playerEquiped = game.add.group();
    
    
    //Stylings
    var bg = inventoryGroup.create(0,0, 'bg');
    bg.alpha = .5;
    var defaultX = 208;
    var defaultY = 150;
    
    inventoryGroup.add(itemSlots);
    inventoryGroup.add(playerEquiped);
    inventoryGroup.add(itemsInventory);
    for (var i = 0; i < 5; i++)
    {
        for(var j=0; j<8; j++)
        {
            //j*50 = the image width * column
            //game.world.centerX/5 = position of where it is going to be
            //j*5 = 5 pixel padding between each slot
            var s = itemSlots.create(j*50 + defaultX + (j*5), i*50 + defaultY + 115 + (i*5), 'button');
            s.name = {row:i, column:j};
            s.exists = true;
            s.visible = true;
        }
    }
    var playerEquipedSprite = playerEquiped.create(defaultX , defaultY - 100, 'playerEquipedSprite')
    for(var i=0; i<3; i++)
    {
        for(var j=0; j<3; j++)
        {
            var s = playerEquiped.create(j*50 + defaultX + (j*5) + 220, i*50 + defaultY - 100 + (i*5), 'button');
            s.name = {row:i, column:j};
            s.exists = true;
            s.visible = true;
        }
    }
    console.log('populating inventory')
    for(var i=0; i<playerInventory.length; i++)
    {
        // console.log(playerInventory[i].id)
        var column = 0;
        var row = i%8;

        if(i>7)
        {
            column = Math.floor(i/8);
        }
        // console.log(i, row,column)
        var item = itemsInventory.create(row*50 + 220 + (row*5), column*50 + 210 + 65 + (column*5) , playerInventory[i].id);
        item.id =  playerInventory[i].id;
        // globalItem = item;
        item.inputEnabled = true;
        var boundsRectangle = new Phaser.Rectangle(defaultX, defaultY-100,435,485);

        item.input.useHandCursor = true;
        // item.input.enableDrag(true, false, false, 255, boundsRectangle, "");
        // item.input.enableSnap(55,55, false, true);
        item.events.onInputDown.add(checkItemAction, this);
        
        
        
    }
}
function checkItemAction(item)
{
    // console.log(item)
    if(inventoryMapping[item.id].action !== "")
    {
        var action = inventoryMapping[item.id].action
        //pop up menu
        optionGroup = game.add.group();
        for(var i =0; i< action.length; i++)
        {
            var baseY = item.y-20 + (i*30)
            var sprite = optionGroup.create(item.x+43, baseY, 'option');
            
            sprite.action = action[i];
            sprite.width = 105;
            sprite.alpha = .7;
            var style = { font: "12px Arial", fill: "#ffffff", align: "left" };
            game.add.text(sprite.x+5, sprite.y+7, action[i], style, optionGroup);
            sprite.inputEnabled = true;
            sprite.events.onInputOver.add(function (spriteToChange) { spriteToChange.alpha = 1; }, this);
            sprite.events.onInputOut.add(function (spriteToChange) { spriteToChange.alpha = .7; }, this);
            sprite.events.onInputDown.add(performAction, this);
        }
    }
}
function performAction(item)
{
    console.log("preforming action: " + item.action)
    //duplicate item if necessary and find available actions
    //farming
        //duplicate item and enable drag
        //find valid spots, disable the other ones
    
    //eat
        //increase health
        //remove item from inventory
    exitInventory();
    optionGroup.destroy()
    
}
function readInventory()
{
    playerInventory = JSON.parse(readCookie('inventory'));
}
function saveInventory()
{
    createCookie('inventory',JSON.stringify(playerInventory),30)
}
function addItemToInventory(id)
{
    if(inventoryMapping == null)
    {
        createInventoryMapping();
    }else if(playerInventory.length < 48)
    {
        playerInventory.push({'id':id})
    }
    saveInventory();
}

function createInventoryMapping()
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", 'assets/inventory/inventoryMapping.json', false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0)
            {
                inventoryMapping = JSON.parse(rawFile.responseText);
            }
        }
    }
    rawFile.send(null);
}

//Concepts behind the inventory system.
/*
    Grab existing inventory from cookie and parse it.
    Upon getting a new item update variable


*/