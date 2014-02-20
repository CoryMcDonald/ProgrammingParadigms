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
    double velocity = .5;
    double characterSpeed = 3;
    double time;
    boolean jumpCharacter = false;

    boolean initialPosition = true;

    Sprite() throws IOException
    {
       // this.sprite_image = ImageIO.read(getClass().getResourceAsStream("turtle.png"));

    }

    abstract void update();

    public void update(Graphics g) {
        time = System.currentTimeMillis() / 100;

        this.update();

        //Check if need to set initial position
        if(initialPosition == true)
        {
            g.drawImage(this.sprite_image, this.x, this.y, null);
            initialPosition = false;
        }

        if(jumpCharacter)
        {
           // velocity -= 2 *  (time-System.currentTimeMillis())/100;
            velocity = 10;
            jumpCharacter = false;
        }else if(this.y >= 500)
        {
            //on ground set no falling
            velocity = 0;
            this.y = 500;
            //set friction
//            characterSpeed *= .9;
        }
        if(velocity != 0)
        {
            velocity -= .9 ;// * (time-System.currentTimeMillis())/100;
        }
        //detecting collision

        this.y -= velocity;

        if(characterSpeed > (dest_x - this.x ))
        {
            if(this.x < this.dest_x )
                this.x += characterSpeed;
            else if(this.x > this.dest_x)
                this.x -= characterSpeed;
        }else
        {
            this.x += characterSpeed;
        }
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
