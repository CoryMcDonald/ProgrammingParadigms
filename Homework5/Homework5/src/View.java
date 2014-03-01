import javax.imageio.ImageIO;
import javax.swing.JPanel;
import java.awt.*;
import java.io.File;

class View extends JPanel {
	Controller controller;
	Model model;
    static Image backgroundImage;
	View(Controller c, Model m) {
		this.controller = c;
		this.model = m;
		this.addMouseListener(c);
	}
	
	Font myFont = new Font("Arial", Font.PLAIN, 24);
	public void paintComponent(Graphics g) {
        try{
            if(backgroundImage == null)
                backgroundImage = ImageIO.read(new File("resources/background.png"));
            g.drawImage(backgroundImage,0,275, null);
        }catch
                (Exception ex)
        {
            System.out.println("Could not find background image: " + ex.toString());
        }
        Graphics2D g2 = (Graphics2D) g;
        g2.setColor(Color.WHITE);
    	g2.setFont(myFont);
        g2.drawString("Score", 5, 25);
        g2.drawString(String.format("%05d", (model.turtleDeaths*100)), 5,50);
		this.model.update(g);
		revalidate();
	}
}
