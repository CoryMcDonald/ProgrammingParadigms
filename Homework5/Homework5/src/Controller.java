import javax.swing.*;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseListener;
import java.awt.event.MouseEvent;

class Controller implements MouseListener
{
	Model model;

	Controller(Model m) {
		this.model = m;
	}

	public void mousePressed(MouseEvent e) {
        model.setDestination(e.getX(), e.getY() );
        //Allow model to be able to jump
        if(SwingUtilities.isRightMouseButton(e))
            model.setJump(true);
	}

	public void mouseReleased(MouseEvent e) {    }
	public void mouseEntered(MouseEvent e) {    }
	public void mouseExited(MouseEvent e) {    }
	public void mouseClicked(MouseEvent e) {    }


    public void keyTyped(KeyEvent e)
    {

    }
    public void keyPressed(KeyEvent e)
    {

        if (e.getKeyCode() == KeyEvent.VK_D) {
            model.setDestination(model.r.x + 25,0);
        }else if(e.getKeyCode() == KeyEvent.VK_A)
        {
            model.setDestination(model.r.x -25 ,0);
        }
        if(e.getKeyCode() == KeyEvent.VK_W || e.getKeyCode() == KeyEvent.VK_SPACE)
        {
            model.setJump(true);
        }
    }

    public void keyReleased(KeyEvent e)
    {
//        if(model.r.dest_x > model.r.x)
//        {
//            model.setDestination(model.r.x + (int)(model.r.characterSpeed * 5),0);
//        }else if(model.r.dest_x < model.r.x)
//        {
//            model.setDestination(model.r.x - (int)(model.r.characterSpeed * 5),0);
//        }
    }
}
