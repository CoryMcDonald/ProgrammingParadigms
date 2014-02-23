import javax.imageio.ImageIO;
import java.awt.*;
import java.io.IOException;

/**
 * Created by Cory on 2/22/14.
 */
public class Razorback extends Sprite
{
    Image razorbackImage;
    Image flippedRazorbackImage;
    Image inAirRazorbackImage;
    Razorback(int initX, int initY) throws IOException
    {
        this.x = initX;
        this.y = initY;
        this.dest_x = initX;
        this.dest_y = initY;
        characterSpeed = 7.5;
        if(razorbackImage == null)
        {
            razorbackImage = ImageIO.read(getClass().getResourceAsStream("razorback.png"));
            setSpriteImage(razorbackImage);
        }
    }
    
    @Override
    void update()
    {
        //Checks if on the ground and right click button was pressed
        if(jumpCharacter && velocity == 0)
        {
            velocity = 15;
            jumpCharacter = false;
            try
            {
                if(inAirRazorbackImage == null)
                    inAirRazorbackImage = ImageIO.read(getClass().getResourceAsStream("inAirRazorback.png"));
                setSpriteImage(inAirRazorbackImage);
            }
            catch (Exception ex)
            {
                System.out.println("Error loading jump sprite - " +ex.toString()); //Log exception getting sprite
            }

        }else if(this.y >= floor) //This checks to see if there needs to be a collision with the floor
        {
            velocity = 0;
            this.y = floor;
            setSpriteImage(razorbackImage);
        }

        //Handling walking behavior
        if(this.x < this.dest_x)
        {
            if(this.x > this.dest_x - characterSpeed)
                this.x = this.dest_x;
            else
                this.x += characterSpeed;
        }
        else if(this.x > this.dest_x)
        {
            if(this.x < this.dest_x + characterSpeed)
                this.x = this.dest_x;
            else
                this.x -= characterSpeed;
        }
    }
}
