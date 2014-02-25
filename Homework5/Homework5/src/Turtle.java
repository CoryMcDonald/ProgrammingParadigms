import com.sun.swing.internal.plaf.synth.resources.synth_sv;

import javax.imageio.ImageIO;
import java.awt.*;
import java.io.IOException;

class Turtle extends Sprite
{
    Image turtleImage;
    Image turtleDeath;
    Image turtleWalk1;
    Image turtleWalk2;
    Image turtleWalk3;
    Image turtleWalk4;
    Image turtleWalk5;
    Image turtleWalk6;
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
            turtleImage = ImageIO.read(getClass().getResourceAsStream("turtle1.png"));
            setSpriteImage(turtleImage);
        }
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
            //set friction
//            characterSpeed *= .9;
        }

        //Handling moving to left
        if(death)
        {
            if(turtleDeath == null)
            {
                try{
                    turtleDeath = ImageIO.read(getClass().getResourceAsStream("turtlesmashed.png"));
                    setSpriteImage(turtleDeath);
                    this.y = floor;
                }catch (Exception ex)
                {
                    System.out.println(ex.toString());
                }
            }
            deathFrame++;
            removeSprite = true;
        }else if(velocity == 0 && this.x > 0)
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
                turtleWalk1 = ImageIO.read(getClass().getResourceAsStream("turtlewalk1.png"));
            if(turtleWalk2 == null)
                turtleWalk2 = ImageIO.read(getClass().getResourceAsStream("turtlewalk2.png"));
            if(turtleWalk3 == null)
                turtleWalk3 = ImageIO.read(getClass().getResourceAsStream("turtlewalk3.png"));
            if(turtleWalk4 == null)
                turtleWalk4 = ImageIO.read(getClass().getResourceAsStream("turtlewalk4.png"));
            if(turtleWalk5 == null)
                turtleWalk5 = ImageIO.read(getClass().getResourceAsStream("turtlewalk5.png"));
            if(turtleWalk6 == null)
                turtleWalk6 = ImageIO.read(getClass().getResourceAsStream("turtlewalk6.png"));

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
        death = true;
    }
}