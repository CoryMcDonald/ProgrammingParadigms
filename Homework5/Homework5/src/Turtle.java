import com.sun.swing.internal.plaf.synth.resources.synth_sv;

import javax.imageio.ImageIO;
import java.awt.*;
import java.io.File;
import java.io.IOException;

class Turtle extends Sprite
{
    static Image turtleImage;
    static Image turtleDeath;
    static Image turtleWalk1;
    static Image turtleWalk2;
    static Image turtleWalk3;
    static Image turtleWalk4;
    static Image turtleWalk5;
    static Image turtleWalk6;
    int currentWalk = 0;

    Turtle(int initX, int initY) throws IOException
    {
        this.x = initX;
        this.y = initY;
        this.dest_x = initX;
        this.dest_y = initY;
        characterSpeed = 1; //Make turtle move slow!
        if(turtleImage == null)
        {
            turtleImage = ImageIO.read(new File("resources/turtle1.png"));
        }
        setSpriteImage(turtleImage);
        setFloor();
    }

    @Override
    boolean update()
    {
        boolean removeSprite = false;
        if(this.y >= floor)
        {
            //on ground set no falling
            this.y = this.floor;
            velocity = 0;
        }

        if(death)
        {
            if(turtleDeath == null)
            {
                try{
                    turtleDeath = ImageIO.read(new File("resources/turtlesmashed.png"));
                }catch (Exception ex)
                {
                    System.out.println(ex.toString());
                }
            }
            int differenceInHeight = this.imageHeight;
            setSpriteImage(turtleDeath);
            differenceInHeight -= this.imageHeight;
            this.y += differenceInHeight;
            deathFrame++;
            removeSprite = true;
        }else if(velocity == 0 && this.x > 0)        //Handling moving to left
        {
            this.x -= characterSpeed;
            walk(); //Changes sprite while walking - totally unneccessary
        }else if (this.x < 5)
        {
            removeSprite = true; //Remove the sprite
        }
        else
        {
            setSpriteImage(turtleImage);
        }
        return removeSprite;
    }
    private void walk()
    {
        //Hope you like inefficient coding! :D
        currentWalk++;
        try{
            if(turtleWalk1 == null)
                turtleWalk1 = ImageIO.read(new File("resources/turtlewalk1.png"));
            if(turtleWalk2 == null)
                turtleWalk2 = ImageIO.read(new File("resources/turtlewalk2.png"));
            if(turtleWalk3 == null)
                turtleWalk3 = ImageIO.read(new File("resources/turtlewalk3.png"));
            if(turtleWalk4 == null)
                turtleWalk4 = ImageIO.read(new File("resources/turtlewalk4.png"));
            if(turtleWalk5 == null)
                turtleWalk5 = ImageIO.read(new File("resources/turtlewalk5.png"));
            if(turtleWalk6 == null)
                turtleWalk6 = ImageIO.read(new File("resources/turtlewalk6.png"));

            if(currentWalk == 1)
                setSpriteImage(turtleWalk1);
            else if(currentWalk == 2)
                setSpriteImage(turtleWalk2);
            else if(currentWalk == 3)
                setSpriteImage(turtleWalk3);
            else if(currentWalk == 4)
                setSpriteImage(turtleWalk4);
            else if(currentWalk == 5)
                setSpriteImage(turtleWalk5);
            else
            {
                setSpriteImage(turtleWalk6);
                currentWalk=1;
            }
        }catch(Exception ex)
        {
            System.out.println("Error updating turtle walk" + ex.toString());
        }
    }

    @Override
    void die()
    {
        //Some complex code right here
        death = true;
    }

    @Override
    void collide(Sprite otherSprite)
    {

    }
}