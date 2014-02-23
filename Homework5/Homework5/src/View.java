import javax.imageio.ImageIO;
import javax.swing.JPanel;
import java.awt.*;

class View extends JPanel {
	Controller controller;
	Model model;
    Image backgroundImage;
	View(Controller c, Model m) {
		this.controller = c;
		this.model = m;
		this.addMouseListener(c);
	}

	public void paintComponent(Graphics g) {
        try{
            if(backgroundImage == null)
                backgroundImage = ImageIO.read(getClass().getResourceAsStream("background.png"));
            g.drawImage(backgroundImage,0,275, null);
        }catch
                (Exception ex)
        {
            System.out.println("Could not find background image: " + ex.toString());
        }
		this.model.update(g);
		revalidate();
	}
}
