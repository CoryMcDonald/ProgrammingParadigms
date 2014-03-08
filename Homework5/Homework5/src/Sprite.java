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
    int deathFrame = 0;
    int imageHeight = 100;
    int imageWidth = 100;
    Image sprite_image;
    double velocity = -.5;
    double characterSpeed = 3;
    boolean death = false;
    boolean jumpCharacter = false;
    boolean initialPosition = true;
    boolean onPlatform = false;

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

        //if(velocity != 0)
        if(this.y < floor)
        {
            velocity -= .9;
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

    //Function is used to handle what happens if there's a collide
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

    public boolean collidesWith(Sprite otherSprite)
    {
        boolean collisionDetected = false;
        if(this.x + this.imageWidth > otherSprite.x
                && this.x < otherSprite.x + otherSprite.imageWidth
                && this.y + this.imageHeight > otherSprite.y
                && this.y < otherSprite.y + otherSprite.imageHeight && !otherSprite.death )
        {
            collisionDetected = true;
        }
        return collisionDetected;
    }
    public void handleCollision(Sprite otherSprite)
    {
        //World
        //System.out.println(System.currentTimeMillis() + "Collision: " + this.getClass().getName() + " Other: " + otherSprite.getClass().getName());
        if(otherSprite instanceof Brick)
        {
            if(this.y  + 15< otherSprite.y)
            {
                this.y = otherSprite.y - this.imageHeight + 1;
                velocity = 0;
            }else
            {
                //Vertical collision
                if(velocity > 0)
                     velocity = -.1;
                //Horizontal collision
                if(this.y + 15 < otherSprite.y && this.y > otherSprite.y && this.y < (otherSprite.y + ((Brick) otherSprite).imageHeight))
                {
                    System.out.println("COLL");
                    if(this.x < otherSprite.x){
                        this.x = otherSprite.x - this.imageWidth;
                    }else if(this.x > otherSprite.x)
                    {
                        this.x = otherSprite.x + ((Brick) otherSprite).imageWidth;
                    }
                    if(velocity >= 0)
                        this.dest_x = this.x;
                }
            }
        }
        collide(otherSprite);
    }
    //All sprites will handle their own collisions unless
    abstract void collide(Sprite otherSprite);

    public void setJump(boolean tJump)
    {
        this.jumpCharacter = tJump;
    }
}
