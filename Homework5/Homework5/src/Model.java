import java.awt.Graphics;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Random;

class Model
{

    static ArrayList<Sprite> ListOfSprites = new ArrayList<Sprite>();
    Random rand = new Random();
    boolean canJump = true;

	Model() throws IOException
    {
        ListOfSprites.add(new Turtle(rand.nextInt(500),rand.nextInt(500)));
        ListOfSprites.add(new Razorback(0,0));
    }

    public void update(Graphics g) {
        for(Sprite currentSprite : ListOfSprites)
        {
            currentSprite.update(g);
        }
    }

    public void setDestination(int x, int y) {
        for(Sprite currentSprite : ListOfSprites)
        {
            currentSprite.setDestination(x, y);
        }
    }
    public void setJump(boolean jumpCharacter) {
        for(Sprite currentSprite : ListOfSprites)
        {
            currentSprite.setJump(jumpCharacter);
        }
    }
}
