import java.awt.Graphics;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Random;

class Model
{

    static ArrayList<Sprite> ListOfSprites = new ArrayList<Sprite>();
    int numOfFrames = 0;
    int turtleDeaths = 0;
    Random rand = new Random();
    Razorback r = new Razorback(0,0); //Add a razorback at position 0,0

	Model() throws IOException
    {
        ListOfSprites.add(new Turtle(rand.nextInt(500)+100,0)); //Add an anonymous turtle at any x position but at y=0
        ListOfSprites.add(r); //Go ahead and add the razorback we created
    }

    public void update(Graphics g) {
        numOfFrames++;
        Iterator<Sprite> i = ListOfSprites.iterator();
        while (i.hasNext())
        {
            Sprite currentSprite = i.next();
            if(!(currentSprite instanceof Razorback)) //Detect collision for every sprite EXCEPT the Razorback
            {
//                if(r.x + r.imageWidth > currentSprite.x
                		&& r.x < currentSprite.x + currentSprite.imageWidth
                        && r.y + r.imageHeight > currentSprite.y                       
                        && r.y < currentSprite.y + currentSprite.imageHeight
                        && r.y + 10 < currentSprite.y)
                {
                     if(!currentSprite.death)
                     {
                        r.bounce();
                        currentSprite.die();
                        turtleDeaths++;
                     }
                }
                else  if(r.x + r.imageWidth > currentSprite.x
                        && r.x < currentSprite.x + currentSprite.imageWidth
                        && r.y + r.imageHeight > currentSprite.y
                        && r.y < currentSprite.y + currentSprite.imageHeight && !currentSprite.death)
                {
                    r.die();
                }
            }

            if(currentSprite.update(g) == true )
            {
                if(currentSprite.death && currentSprite.deathFrame == 60)
                {
                    i.remove();
                }else if(!currentSprite.death)
                {
                    i.remove();
                }
            }
        }
        if(numOfFrames == 60)
        {
            try
            {
                ListOfSprites.add(new Turtle(rand.nextInt(1000), 0));
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
