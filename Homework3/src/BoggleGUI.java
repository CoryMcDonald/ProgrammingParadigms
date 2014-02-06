import java.awt.Color;
import java.awt.Font;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Random;
import java.util.Scanner;
import java.io.File;
import java.io.IOException;

import javax.swing.*;
import javax.swing.border.EmptyBorder;

class BoggleGUI implements ActionListener
{
    private static String Dice = null;
    private static boolean[] Used = new boolean[16];

    private long BeginTime;
    private long EndTime;
    private static int TimeElapsed = 0;
    private static int TotalWords = 0;
    private static int ValidWords = 0;

    private static ArrayList<String> Solutions = new ArrayList<String>();

    private JFrame Frame = new JFrame("Boggle");

    private JLabel LabelTimer = new JLabel("00:00", SwingConstants.CENTER);
    private JLabel BoggleLabel = new JLabel("Boggle");
    private JLabel EnterWordsLabel = new JLabel("Enter Words Here");

    private SimpleDateFormat Time = new SimpleDateFormat("mm:ss");

    private JButton BeginButton = new JButton("Begin");
    private JTextArea WordInput = new JTextArea("");

    private JScrollPane WordInputScroll = new JScrollPane(WordInput);

    private JPanel UserInput = new JPanel(new GridLayout(3, 1));
    private JPanel BoggleBoard = new JPanel(new GridLayout(4, 4));
    private JPanel BoggleBoardContainer = new JPanel(new GridLayout(1, 2));
    private JPanel TimerAndBoggleLabel = new JPanel(new GridLayout(2, 1));

    private Timer Timer;

    public static void main(String[] args)
    {
        try
        {
            new BoggleGUI();
        }
        catch (Exception ex)
        {
            //Sorry, I am an awful programmer for using try/catch (Bad habit forced by code reviews :) )
            JOptionPane.showMessageDialog(new JFrame(), "Critical Error! " + ex.toString());
        }
    }

    private BoggleGUI()
    {
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

        //Generates a random string of 16 characters and places the label on the board
        generateBoggleBoard();

        BeginButton.addActionListener(this);
        //Setting default button to be "Begin' so you can just press enter when the app starts
        Frame.getRootPane().setDefaultButton(BeginButton);
        BeginButton.requestFocus();

        BoggleLabel.setHorizontalAlignment(SwingConstants.CENTER);

        TimerAndBoggleLabel.add(BoggleLabel);
        TimerAndBoggleLabel.add(LabelTimer);

        EnterWordsLabel.setVerticalAlignment(SwingConstants.BOTTOM);

        UserInput.add(EnterWordsLabel);
        UserInput.add(WordInputScroll);
        UserInput.add(BeginButton);

        BoggleBoardContainer.setBorder(new EmptyBorder(10, 10, 0, 0));
        BoggleBoardContainer.add(BoggleBoard);
        BoggleBoardContainer.add(TimerAndBoggleLabel);

        Frame.add(BoggleBoardContainer);
        Frame.add(UserInput);
        Frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        Frame.getContentPane().setLayout(new GridLayout(2, 1, 5, 5));
        Frame.setSize(400, 400);
        Frame.setVisible(true);
    }

    public void actionPerformed(ActionEvent e)
    {
        if (BeginButton.getText().equals("Begin"))
        {
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
            
            if(userResults.size() > 0 && userResults.get(0).equals(""))
            {
            	InvalidWords = 0;            	
            }else
            {
            	InvalidWords = userResults.size();
            }
            
            JOptionPane.showMessageDialog(new JFrame()
                    , "Elapsed Time: " + (EndTime - BeginTime) / 1000 + " seconds \n" +
                    "Words Correct: " + ValidWords + "\n" +
                    "Words Possible: " + Solutions.size() + "\n" +
                    "Words not found by computer " + (userResults.size() - ValidWords));
            WordInput.setEditable(false);
            BeginButton.setEnabled(false);
        }
    }

    private void generateBoggleBoard()
    {
        Random random = new Random();
        char[] chars = "abcdefghijklmnopqrstuvwxyz".toCharArray(); //Grabbing the available characters
        StringBuilder sb = new StringBuilder();
        //For each letter configure how it looks and then add it to the boggle board
        for (int i = 0; i < 16; i++)
        {
            char c = chars[random.nextInt(chars.length)];
            final JLabel diceCharacter = new JLabel(String.valueOf(c).toUpperCase());
            diceCharacter.setBorder(BorderFactory.createLineBorder(Color.BLACK));
            diceCharacter.setHorizontalAlignment(SwingConstants.CENTER);
            diceCharacter.setFont(new Font("Arial", Font.PLAIN, 24));
            sb.append(c);
            BoggleBoard.add(diceCharacter);
        }
        Dice = sb.toString();
        Dice = Dice.toUpperCase();
        //Generates the solutions once the boggle board is loaded
        generateSolutions();
    }
    private void generateSolutions()
    {
        try
        {
            Scanner s = new Scanner(new File("lexicon.txt"));
            while (s.hasNextLine())
            {
                String word = s.nextLine();
                //Really we should check if the word has more than 3 char because that's how the game is played
                if (isFound(word))
                {
                    Solutions.add(word);
                    TotalWords++;
                }
            }
        }
        catch (IOException ex)
        {
            JOptionPane.showMessageDialog(new JFrame(), "Sorry, could locate lexicon.txt",
                    "Error", JOptionPane.ERROR_MESSAGE);
            System.exit(0); //Closing out the applications once they accept the msgbox
        }
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
