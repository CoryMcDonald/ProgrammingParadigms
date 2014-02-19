import javax.swing.JFrame;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import javax.swing.Timer;
import java.io.IOException;

public class Game extends JFrame implements ActionListener {
	Model model;
	Controller controller;

	public Game() throws IOException, Exception {
        this.model = new Model();
		this.controller = new Controller(this.model);
		this.setTitle("Turtle Attack");
		this.setSize(1000, 700);
		this.getContentPane().add(new View(this.controller, this.model));
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		this.setVisible(true);
		new Timer(50, this).start();
	}

	public void actionPerformed(ActionEvent evt) {
		repaint();
	}

	public static void main(String[] args) throws IOException, Exception {
		new Game();
	}
}
