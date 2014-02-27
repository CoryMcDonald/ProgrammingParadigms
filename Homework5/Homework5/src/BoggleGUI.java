import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.io.FileNotFoundException;
import java.text.SimpleDateFormat;
import java.io.File;
import java.util.*;

import javax.swing.*;
import javax.swing.Timer;
import javax.swing.border.Border;
import javax.swing.border.EmptyBorder;

class BoggleGUI implements ActionListener
{
    Boggle boggleBackend;

    private long BeginTime;
    private long EndTime;
    private int InvalidWords = 0;
    private int TimeElapsed = 0;
    private int TotalWords = 0;
    private int ValidWords = 0;

    private ArrayList<String> Solutions = new ArrayList<String>();
    private static TreeSet<String> Dictionary = new TreeSet<String>();

    private static JFrame Frame = new JFrame("Boggle");

    private JLabel LabelTimer = new JLabel("00:00", SwingConstants.CENTER);
    private JLabel BoggleLabel = new JLabel("Boggle");
    private JLabel EnterWordsLabel = new JLabel("Enter Words Here");
    private JLabel AutoCompleteLabel = new JLabel("Autocomplete");
    
    private SimpleDateFormat Time = new SimpleDateFormat("mm:ss");

    private JButton BeginButton = new JButton("Begin");
    private JTextArea WordInput = new JTextArea ("");

    private JScrollPane WordInputScroll = new JScrollPane(WordInput);

    private JPanel UserInput = new JPanel(new GridLayout(3, 2));
    private JPanel BoggleBoard = new JPanel(new GridLayout(4, 4));
    private JPanel BoggleBoardContainer = new JPanel(new GridLayout(1, 2));
    private JPanel TimerAndBoggleLabel = new JPanel(new GridLayout(2, 1));

    private Timer Timer;

    public BoggleGUI()
    {
    	if(Dictionary.size() <= 1)
    	{
    		try
            {
             //Reading in file once
                Scanner s = new Scanner(new File("lexicon.txt"));
                while (s.hasNextLine())
                {
                    Dictionary.add(s.nextLine());
                }
            }
            catch (FileNotFoundException ex)
            {
             //If it couldn't find the file then prompt up the error
                JOptionPane.showMessageDialog(new JFrame(), "Could not find lexicon.txt");
            }
            catch (Exception ex)
            {
                //Show error
                JOptionPane.showMessageDialog(new JFrame(), "Critical Error! " + ex.toString());
            }
    	}
        createAndShowGUI();
    }

    private void createAndShowGUI()
    {
        //Initially disabling user input
        WordInput.setEditable(false);

        //Boggle Board stuff for representing letters
        LabelTimer.setFont(new Font("Arial", Font.PLAIN, 24));
        BoggleLabel.setVerticalAlignment(SwingConstants.BOTTOM);
        BoggleLabel.setFont(new Font("Arial", Font.PLAIN, 24));
        BoggleLabel.setForeground(Color.blue);

        //Java docs use anonymous functions (Sorry about bad coding practice)
        //http://docs.oracle.com/javase/7/docs/api/javax/swing/Timer.html
        Timer = new Timer(1000, new ActionListener()
        {
            public void actionPerformed(ActionEvent e)
            {
                TimeElapsed++;
                LabelTimer.setText(Time.format(TimeElapsed * 1000));
                Frame.repaint();
            }
        });
        
        //Making blank boggle board
        initializeBoggleBoard();

        //Adding an action listener to begin
        
        BeginButton.addActionListener(this);
        //Setting default button to be "Begin' so you can just press enter when the app starts
        Frame.getRootPane().setDefaultButton(BeginButton);
        BeginButton.requestFocus();

        //Making it look pretty
        BoggleLabel.setHorizontalAlignment(SwingConstants.CENTER);
        
        //Adding Boggle stuff
        TimerAndBoggleLabel.add(BoggleLabel);
        TimerAndBoggleLabel.add(LabelTimer);

        //More pretty stuff
        EnterWordsLabel.setHorizontalAlignment(SwingConstants.RIGHT);
        AutoCompleteLabel.setHorizontalAlignment(SwingConstants.RIGHT);
        
        UserInput.add(EnterWordsLabel);
        UserInput.add(WordInputScroll);
        UserInput.add(AutoCompleteLabel);
        UserInput.add(new AutoCompleteTextField());
        UserInput.add(BeginButton);
        
        //Adding padding to the boggle board container
        BoggleBoardContainer.setBorder(new EmptyBorder(10, 10, 0, 0));
        BoggleBoardContainer.add(BoggleBoard);
        BoggleBoardContainer.add(TimerAndBoggleLabel);
        
        Frame.add(BoggleBoardContainer);
        Frame.add(UserInput);
        Frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        Frame.getContentPane().setLayout(new GridLayout(2, 1, 5, 5));
        Frame.setSize(400, 400);
        Frame.setMinimumSize(new Dimension(250, 250));
        Frame.setVisible(true);
    }

    public void actionPerformed(ActionEvent e)
    {
        if (BeginButton.getText().equals("Begin"))
        {
            boggleBackend = new Boggle();
            generateBoggleBoard(); //Creates a random string and finds the solutions
            BeginTime = System.currentTimeMillis();
            BeginButton.setText("Done");
            WordInput.setEditable(true);
            WordInput.requestFocus();
            Timer.start();
        }
        else
        {
            EndTime = System.currentTimeMillis();
            Timer.stop();
            
            //Find user solutions
            ArrayList<String> userResults = new ArrayList<String>(Arrays.asList(WordInput.getText().split("\\r?\\n")));
            for (String userResult : userResults)
            {
                for (String computerResult : Solutions)
                {
                    if (computerResult.equalsIgnoreCase(userResult))
                    {
                        ValidWords++;
                    }
                }
            }

            if (userResults.size() > 0 && userResults.get(0).equals(""))
            {
                InvalidWords = 0;
            }
            else
            {
                InvalidWords = userResults.size();
            }

            JOptionPane.showMessageDialog(new JFrame()
                    , "Elapsed Time: " + (EndTime - BeginTime) / 1000 + " seconds \n" +
                    "Words Correct: " + ValidWords + "\n" +
                    "Words Possible: " + Solutions.size() + "\n" +
                    "Words not found by computer " + (InvalidWords - ValidWords));

            //Reset GUI
            WordInput.setEditable(false);
            BeginButton.setText("Begin");

            WordInput.setText("");
            TimeElapsed = 0;
            ValidWords = 0;
            
            //Resetting the timer
            Timer.stop();
            LabelTimer.setText(Time.format(TimeElapsed * 1000));
            //Initalizing a blank boggleboard
            initializeBoggleBoard();
        }
    }

    private void generateBoggleBoard()
    {
        if (boggleBackend == null)
        {
            throw new IllegalArgumentException("Boggle backend doesn't exist");
        }
        else
        {
            //Remove any initial values on the BoggleBoard
            BoggleBoard.removeAll();
            //Loop through all the dice and add it to the Board
            for (char c : boggleBackend.getDice().toCharArray())
            {
                final JLabel diceCharacter = new JLabel(String.valueOf(c).toUpperCase());
                diceCharacter.setBorder(BorderFactory.createLineBorder(Color.BLACK));
                diceCharacter.setHorizontalAlignment(SwingConstants.CENTER);
                diceCharacter.setFont(new Font("Arial", Font.PLAIN, 24));
                BoggleBoard.add(diceCharacter);
            }
        }
    }

    private void initializeBoggleBoard()
    {
        BoggleBoard.removeAll();
        for (int i = 0; i < 16; i++)
        {
            final JLabel diceCharacter = new JLabel("");
            diceCharacter.setBorder(BorderFactory.createLineBorder(Color.BLACK));
            diceCharacter.setHorizontalAlignment(SwingConstants.CENTER);
            diceCharacter.setFont(new Font("Arial", Font.PLAIN, 24));
            BoggleBoard.add(diceCharacter);
        }
    }


    private class Boggle
    {
        private String Dice = null;
        private boolean[] Used = new boolean[16];

        public Boggle()
        {
            createRandomBoggleBoard();
        }

        public String getDice()
        {
            return Dice;
        }

        private boolean isFound(String word)
        {
            for (int y = 0; y < 4; y++)
            {
                for (int x = 0; x < 4; x++)
                {
                    if (check(x, y, word.toUpperCase()))
                        return true;
                    for (int i = 0; i < Used.length; i++) //Reseting the Used values back
                    {
                        Used[i] = false;
                    }
                }
            }
            return false;
        }

        private void createRandomBoggleBoard()
        {
            Random random = new Random();
            char[] chars = "abcdefghijklmnopqrstuvwxyz".toCharArray(); //Grabbing the available characters
            StringBuilder sb = new StringBuilder();
            //For each letter configure how it looks and then add it to the boggle board
            for (int i = 0; i < 16; i++)
            {
                char c = chars[random.nextInt(chars.length)];

                sb.append(c);
            }
            Dice = sb.toString();
            Dice = Dice.toUpperCase();
            //Generates the solutions once the boggle board is loaded
            generateSolutions();
        }

        private void generateSolutions()
        {
            Solutions.clear();
            for (String word : Dictionary)
            {
                if (isFound(word))
                {
                    Solutions.add(word);
                    TotalWords++;
                }
            }
        }

        private boolean check(int x, int y, String remainder)
        {
            if (remainder.length() >= 0)
            {
                if (Dice.charAt(4 * y + x) == remainder.charAt(0))
                {
                    if (remainder.length() > 1)
                    {
                        Used[4 * y + x] = true;
                        for (int dx = x - 1; dx <= x + 1; dx++)
                        {
                            for (int dy = y - 1; dy <= y + 1; dy++)
                            {
                                if (dx >= 0 && dy >= 0 && dx < 4 && dy < 4 && !Used[4 * dy + dx])
                                {
                                    if (check(dx, dy, remainder.substring(1)))
                                    {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        return true;
                    }
                }
            }
            return false;
        }
    }

    private class AutoCompleteTextField extends JTextArea implements KeyListener
    {

        public AutoCompleteTextField()
        {
            this.addKeyListener(this);
            Border border = BorderFactory.createLineBorder(Color.GRAY);
            this.setBorder(border);
        }
        @Override
        public void keyPressed(KeyEvent e)
        {

        }

        @Override
        public void keyTyped(KeyEvent e)
        {
        
        }
        @Override
        public void keyReleased(KeyEvent e)
        {
         String dictionaryResult = Dictionary.ceiling(this.getText());
         if(e.getKeyCode() == KeyEvent.VK_BACK_SPACE
         || e.getKeyCode() == KeyEvent.VK_CONTROL
         || e.getKeyCode() == KeyEvent.VK_LEFT
         || e.getKeyCode() == KeyEvent.VK_RIGHT
         || e.getKeyCode() == KeyEvent.VK_DELETE)
            {
             return;
            }
         else if(dictionaryResult.contains(this.getText()))
            {
                int originalLength = this.getText().length();
                this.setText(dictionaryResult);
                this.setSelectionStart(originalLength);
                this.setSelectionEnd(dictionaryResult.length());
            }
        }
    }
}
