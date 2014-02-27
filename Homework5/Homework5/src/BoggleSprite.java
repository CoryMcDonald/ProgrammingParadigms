import java.awt.Image;
import java.io.IOException;

import javax.imageio.ImageIO;


public class BoggleSprite extends Sprite{
    Image boggleSpriteImage;
    
	BoggleSprite() throws IOException {
		super();
		if(boggleSpriteImage == null)
        {
        	boggleSpriteImage = ImageIO.read(getClass().getResourceAsStream("boggle.png"));
            setSpriteImage(boggleSpriteImage);
        }
		this.x = 900;
        this.y = floor;
        this.dest_x = 1000;
        this.dest_y = floor;        
	}

	@Override
	boolean update() {
		if(this.y >= floor)
        {
            this.y = this.floor;
            velocity = 0;
        }
		return false;
	}

	@Override
	void die() {
		death = true;
	}

}
