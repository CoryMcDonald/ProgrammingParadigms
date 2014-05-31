/* Inventory.js */
var inventoryGroup;
var playerInventory = [];
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
    var defaultX = 208;
    var defaultY = 150;
    
    inventoryGroup.add(itemSlots);
    inventoryGroup.add(playerEquiped);
    for (var i = 0; i < 6; i++)
    {
        for(var j=0; j<8; j++)
        {
            //j*50 = the image width * column
            //game.world.centerX/5 = position of where it is going to be
            //j*5 = 5 pixel padding between each slot
            var s = itemSlots.create(j*50 + defaultX + (j*5), i*50 + defaultY + 65 + (i*5), 'button');
            s.name = {row:i, column:j};
            s.exists = true;
            s.visible = true;
        }
    }
    var playerEquipedSprite = playerEquiped.create(defaultX , defaultY - 115, 'playerEquipedSprite')
    for(var i=0; i<3; i++)
    {
        for(var j=0; j<3; j++)
        {
            var s = playerEquiped.create(j*50 + defaultX + (j*5) + 220, i*50 + defaultY - 115 + (i*5), 'button');
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
        var item = itemSlots.create(row*50 + 220 + (row*5), column*50 + 155 + 65 + (column*5) , playerInventory[i].id);
        item.inputEnabled = true;
        game.physics.enable(item, Phaser.Physics.ARCADE);
        globalItem = item;
            item.body.setSize(400, 50, -100, 20);
        game.debug.body(item)
        
        var myRec = new Phaser.Rectangle(defaultX, defaultY+50,450,300);
        item.input.enableDrag(true, true, false, 255, myRec, "");
        item.input.enableSnap(55, 55, true, true);


    }
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