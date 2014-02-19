import javax.swing.JPanel;
import java.awt.Graphics;

class View extends JPanel {
	Controller controller;
	Model model;

	View(Controller c, Model m) {
		this.controller = c;
		this.model = m;
		this.addMouseListener(c);
	}

	public void paintComponent(Graphics g) {
		this.model.update(g);
		revalidate();
	}
}
