import javax.swing.*;
import java.awt.*;
import java.io.IOException;

public abstract class Sprite
{
    int x;
    int y;
    int dest_x;
    int dest_y;
    int floor = 0; //Setting default floor
    int imageHeight = 100;
    int imageWidth = 100;
    int deathFrame = 0;
    Image sprite_image;
    boolean death = false;
    double velocity = .5;
    double characterSpeed = 3;
    double time;
    boolean jumpCharacter = false;

    boolean initialPosition = true;

    Sprite() throws IOException
    {
    }

    abstract boolean update();

    public boolean update(Graphics g) {
        boolean removeSprite = false;
        removeSprite = this.update();

        //Check if need to set initial position
        if(initialPosition == true)
        {
            g.drawImage(this.sprite_image, this.x, this.y, null);
            initialPosition = false;
        }

        if(velocity != 0)
        {
            velocity -= .9 ;
        }

        //All sprites will have gravity effect them
        this.y -= velocity;


        // Draw the sprite
        g.drawImage(this.sprite_image, this.x, this.y, null);

        return removeSprite;
        }

    public void setDestination(int x, int y) {
        this.dest_x = x;
        this.dest_y = y;
    }

    //Function is used to handle what happens if there's a collision
    abstract void die();

    public void setSpriteImage(Image i)
    {
        this.sprite_image = i;
        ImageIcon myImage = new ImageIcon(sprite_image);
        imageHeight = myImage.getIconHeight();  //neat hack :)
        imageWidth = myImage.getIconWidth();  //neat hack :)
        setFloor();
    }

    public void setFloor()
    {
        floor = 601 - imageHeight;
    }
    public void setJump(boolean tJump)
    {
        this.jumpCharacter = tJump;
    }
}
