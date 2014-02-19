import javax.imageio.ImageIO;
import java.awt.*;
import java.io.IOException;

class Turtle extends Sprite
{
    Image turtleImage;
    Turtle(int initX, int initY) throws IOException
    {
        this.x = initX;
        this.y = initY;
        this.dest_x = initX;
        this.dest_y = initY;
        if(turtleImage == null)
        {
            turtleImage = ImageIO.read(getClass().getResourceAsStream("turtle.png"));
            setSpriteImage(turtleImage);
        }
    }

    @Override
    void update()
    {
        // Move the turtle
    }
}