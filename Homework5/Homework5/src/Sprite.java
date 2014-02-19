import javax.imageio.ImageIO;
import java.awt.*;
import java.io.IOException;
import java.util.Random;

public abstract class Sprite
{
    int x;
    int y;
    int dest_x;
    int dest_y;
    Image sprite_image;
    double velocity = 1;
    double acceleration = 9.8;
    boolean initialPosition = true;

    Sprite() throws IOException
    {
       // this.sprite_image = ImageIO.read(getClass().getResourceAsStream("turtle.png"));
    }

    abstract void update();

    public void update(Graphics g) {
        this.update();
        //Check if need to set initial position
        if(initialPosition == true)
        {
            g.drawImage(this.sprite_image, this.x, this.y, null);
            initialPosition = false;
        }
        //todo test else
        if(this.x < this.dest_x)
            this.x += velocity;
        else if(this.x > this.dest_x)
            this.x -= velocity;
        if(this.y < this.dest_y)
            this.y += velocity;
        else if(this.y > this.dest_y)
            this.y -= velocity;
        // Draw the turtle
        g.drawImage(this.sprite_image, this.x, this.y, null);

    }

    public void setDestination(int x, int y) {
        this.dest_x = x;
        this.dest_y = y;
    }
    public void setSpriteImage(Image i)
    {
        this.sprite_image = i;
    }
}
