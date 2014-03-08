import java.awt.Graphics;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Random;

class Model
{

    static ArrayList<Sprite> ListOfSprites = new ArrayList<Sprite>();
    int numOfFrames = 0;
    static int score = 0;
    Random rand = new Random();
    Razorback r = new Razorback(0,0); //Add a razorback at position 0,0 (put this as a static for update function

	Model() throws IOException
    {
        //ListOfSprites.add(new Turtle(rand.nextInt(900)+100,0)); //Add an anonymous turtle at any x position but at y=0
        ListOfSprites.add(new Brick(300,450));
        ListOfSprites.add(new Brick(350,450));
        ListOfSprites.add(new Brick(400,450));
        ListOfSprites.add(new Brick(450,450));
        ListOfSprites.add(new Brick(500,450));
        ListOfSprites.add(new Brick(150,550));

        //ListOfSprites.add(new BoggleSprite()); //Adds the boggle sprite
        ListOfSprites.add(r); //Go ahead and add the razorback we created
    }

    public void update(Graphics g) {
        numOfFrames++;
        Iterator<Sprite> i = ListOfSprites.iterator();
        while (i.hasNext())
        {
            Sprite currentSprite = i.next();
            for(Sprite collidingSprite : ListOfSprites)
            {
                if(currentSprite != collidingSprite && currentSprite.collidesWith(collidingSprite))
                {
                    currentSprite.handleCollision(collidingSprite);
                }else
                {
                    currentSprite.onPlatform = false;
                }
            }

            if(currentSprite.update(g) == true )
            {
                //Removes dead turtles
                if(currentSprite.death && currentSprite.deathFrame == 60)
                {
                    i.remove();
                }else if(!currentSprite.death) //Removes turtles from left, they won't be dead
                {
                    i.remove();
                }
            }
        }
        if(numOfFrames == 60) //Every 3 seconds add a new turtle
        {
            try
            {
                //ListOfSprites.add(new Turtle(rand.nextInt(900)+100, 0));
            }
            catch(Exception ex)
            {
                System.out.println("Error adding turtle " + ex.toString());
            }
            numOfFrames = 0;
        }
    }

    public void setDestination(int x, int y) {
        for(Sprite currentSprite : ListOfSprites)
        {
            currentSprite.setDestination(x, y);
        }
    }

    //Used by the controller class to determine if the sprite can jump
    public void setJump(boolean jumpCharacter) {
        for(Sprite currentSprite : ListOfSprites)
        {
            currentSprite.setJump(jumpCharacter);
        }
    }
}
