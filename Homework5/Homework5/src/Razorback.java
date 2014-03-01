import javax.imageio.ImageIO;
import java.awt.*;
import java.io.File;
import java.io.IOException;

/**
 * Created by Cory on 2/22/14.
 */
public class Razorback extends Sprite
{
    int currentWalk = 0;
    static Image razorbackImage;
    static Image flippedRazorbackImage;
    static Image inAirRazorbackImage;
    static Image inAirRazorbackImageLeft;
    static Image razorbackWalkLeft1;
    static Image razorbackWalkLeft2;
    static Image razorbackWalkLeft3;
    static Image razorbackWalkRight1;
    static Image razorbackWalkRight2;
    static Image razorbackWalkRight3;
    Razorback(int initX, int initY) throws IOException
    {
        this.x = initX;
        this.y = initY;
        this.dest_x = initX;
        this.dest_y = initY;
        //Default character speed
        characterSpeed = 7.5;
        if(razorbackImage == null)
        {
            razorbackImage = ImageIO.read(new File("resources/razorback.png"));
            setSpriteImage(razorbackImage);
        }
        if(flippedRazorbackImage == null)
        {
            flippedRazorbackImage = ImageIO.read(new File("resources/razorbackLeft.png"));
        }
    }
    
    @Override
    boolean update()
    {
        //Checks if on the ground and right click button was pressed
        if(jumpCharacter && velocity == 0)
        {
            velocity = 15;
            jumpCharacter = false;

        }else if(this.y >= floor) //This checks to see if there needs to be a collision with the floor
        {
            //So it doesn't queue up a jump
            jumpCharacter = false;
            velocity = 0;
            this.y = floor;
        }

        //Handling walking behavior
        if(this.x < this.dest_x)
        {
            if(this.x > this.dest_x - characterSpeed)
            {
                this.x = this.dest_x;
                setSpriteImage(razorbackImage);
            }
            else
            {
                if(velocity == 0){
                    currentWalk++;
                    walkRight();
                }else
                {
                    jumpRight();
                }
                this.x += characterSpeed;
            }
        }
        else if(this.x > this.dest_x)
        {
            if(this.x < this.dest_x + characterSpeed)
            {
                this.x = this.dest_x;
                setSpriteImage(flippedRazorbackImage);
            }
            else
            {
                this.x -= characterSpeed;
                if(this.velocity == 0){
                    currentWalk++;
                    walkLeft();
                }else
                {
                    jumpLeft();
                }
            }
        }
        return false; //Never remove the razorback from the game
    }

    private void walkLeft()
    {
        try{
            if(razorbackWalkLeft1 == null)
                razorbackWalkLeft1 = ImageIO.read(new File("resources/razorbackwalkleft1.png"));
            if(razorbackWalkLeft2 == null)
                razorbackWalkLeft2 = ImageIO.read(new File("resources/razorbackwalkleft2.png"));
            if(razorbackWalkLeft3 == null)
                razorbackWalkLeft3 = ImageIO.read(new File("resources/razorbackwalkleft3.png"));

            if(currentWalk == 1)
                setSpriteImage(razorbackWalkLeft1);
            else if(currentWalk == 2)
                setSpriteImage(razorbackWalkLeft2);
            else
            {
                currentWalk = 1;
                setSpriteImage(razorbackWalkLeft3);
            }
        }catch(Exception ex)
        {
            System.out.println(ex.toString());
        }
    }
    private void walkRight()
    {
        try{
            if(razorbackWalkRight1 == null)
                razorbackWalkRight1 = ImageIO.read(new File("resources/razorbackwalkright1.png"));
            if(razorbackWalkRight2 == null)
                razorbackWalkRight2 = ImageIO.read(new File("resources/razorbackwalkright2.png"));
            if(razorbackWalkRight3 == null)
                razorbackWalkRight3 = ImageIO.read(new File("resources/razorbackwalkright3.png"));

            if(currentWalk == 1)
                setSpriteImage(razorbackWalkRight1);
            else if(currentWalk == 2)
                setSpriteImage(razorbackWalkRight2);
            else
            {
                currentWalk = 1;
                setSpriteImage(razorbackWalkRight3);
            }
        }catch(Exception ex)
        {
            System.out.println(ex.toString());
        }
    }
    private void jumpRight()
    {
        try
        {
            if(inAirRazorbackImage == null)
                inAirRazorbackImage = ImageIO.read(new File("resources/inAirRazorback.png"));
            setSpriteImage(inAirRazorbackImage);
        }
        catch (Exception ex)
        {
            System.out.println("Error loading jump sprite - " +ex.toString()); //Log exception getting sprite
        }
    }
    private void jumpLeft()
    {
        try

        {
            if(inAirRazorbackImageLeft == null)
                inAirRazorbackImageLeft = ImageIO.read(new File("resources/inAirRazorbackLeft.png"));
            setSpriteImage(inAirRazorbackImageLeft);
        }
        catch (Exception ex)
        {
            System.out.println("Error loading left jump sprite - " +ex.toString()); //Log exception getting sprite
        }
    }

    void bounce()
    {
        velocity = 10;
    }
    @Override
    void die()
    {
        this.x = 0;
        death = true;
        setSpriteImage(razorbackImage);
        this.y = floor;
        this.dest_x = 0;
        this.dest_y = floor;
    }
}
