import javax.swing.*;
import java.awt.*;
import java.io.IOException;

public abstract class Sprite
{
    int x;
    int y;
    int dest_x;
    int dest_y;
    int imageHeight = 100;
    Image sprite_image;
    double characterSpeed = 1;
    double gravity = 3;
    double velocity = 1;
    double time;
    boolean jumpCharacter = false;

    boolean initialPosition = true;

    Sprite() throws IOException
    {
       // this.sprite_image = ImageIO.read(getClass().getResourceAsStream("turtle.png"));
        time = System.currentTimeMillis() / 100;
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

        velocity =  gravity * (time-(System.currentTimeMillis() / 100)) + characterSpeed;
        if(jumpCharacter && this.y >= 300)
        {
            velocity = gravity + characterSpeed;
        }else if(this.y <= 300 && this.y >= 500)
        {
            velocity =  gravity * (time-(System.currentTimeMillis() / 100)) + characterSpeed;
        }
        else if(this.y >= 500)
        {
            velocity = 0;
            dest_y = this.y;
        }

        this.y -= velocity;

        if(this.x < this.dest_x)
            this.x += characterSpeed;
        else if(this.x > this.dest_x)
            this.x -= characterSpeed;
        if(this.y < this.dest_y)
            this.y += characterSpeed;
        else if(this.y > this.dest_y)
            this.y -= characterSpeed;

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
        imageHeight = new ImageIcon(sprite_image).getIconHeight(); //neat hack :)
    }
    public void setJump(boolean tJump)
    {
        this.jumpCharacter = tJump;
    }
}
