import javax.imageio.ImageIO;
import java.awt.*;
import java.io.File;
import java.io.IOException;

/**
 * Created by Cory on 2/28/14.
 */
public class Brick extends Sprite
{
    static Image brickImage;
    Brick(int initX, int initY) throws IOException
    {
        this.x = initX;
        this.y = initY;
        this.dest_x = initX;
        this.dest_y = initY;
        if(brickImage == null)
        {
            brickImage = ImageIO.read(new File("resources/brick.png"));
        }
        setSpriteImage(brickImage);
    }

    @Override
    boolean update()
    {
        this.velocity = 0;
        return false;
    }

    @Override
    void die()
    {

    }

    @Override
    void collide(Sprite otherSprite)
    {

    }
}
