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

import javax.swing.*;
import javax.swing.border.EmptyBorder;

class BoggleGUI {
    private static String dice = null;
    private static boolean[] used = new boolean[16];

    private long beginTime;
    private long endTime;
    private static int timeElapsed = 0;
    private static int totalWords = 0;
    private static int validWords = 0;
    private static int wordsNotFoundByComputer = 0;

    private static ArrayList<String> results = new ArrayList<String>();

    private JFrame frame = new JFrame("Boggle");
    
    private JLabel LabelTimer = new JLabel("00:00", SwingConstants.CENTER);
    private JLabel BoggleLabel = new JLabel("Boggle");
    private JLabel EnterWordsLabel = new JLabel("Enter Words Here");

    private SimpleDateFormat TIME = new SimpleDateFormat("mm:ss");

    private JButton BeginButton = new JButton("Begin");
    private JButton SubmitButton = new JButton("Done");
    private JTextArea WordInput = new JTextArea("");
    
    private JScrollPane WordInputScroll = new JScrollPane(WordInput);
    
    private JPanel userInput = new JPanel(new GridLayout(3,1));
    private JPanel boggleBoard = new JPanel(new GridLayout(4,4));
    private JPanel boggleBoardContainer = new JPanel(new GridLayout(1,2));
    private JPanel EnterLabelPanel = new JPanel(new GridLayout(1,1));
    private JPanel TimerAndBoggleLabel = new JPanel(new GridLayout(2,1));
    
    BoggleGUI() 
    {
        createAndShowGUI();
    }
    private void createAndShowGUI()
    {
        WordInput.setEditable(false);

        //Boggle Board stuff for representing letters
     
        LabelTimer.setFont(new Font("Arial", Font.PLAIN, 24));
        BoggleLabel.setVerticalAlignment(SwingConstants.BOTTOM);
        BoggleLabel.setFont(new Font("Arial", Font.PLAIN, 24));
        BoggleLabel.setForeground(Color.blue);

        final Timer timer = new Timer(1000, new ActionListener(){
            public void actionPerformed(ActionEvent e) {
                timeElapsed++;
                LabelTimer.setText(TIME.format(timeElapsed * 1000));
                frame.repaint();
            }
        });
       
        generateBoggleBoard();

        //todo Functionalize this (prevent anonymous function)
        BeginButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent evt)
            {
                //Is this thread safe? is there a better way to do this?
                if (BeginButton.getText() == "Begin") {
                    beginTime = System.currentTimeMillis();
                    BeginButton.setText("Done");
                    WordInput.setEditable(true);
                    timer.start();
                } else {
                    endTime = System.currentTimeMillis();
                    timer.stop();

                    ArrayList<String> userResults = new ArrayList<String>(Arrays.asList(WordInput.getText().split("\\r?\\n")));
                    for(String userResult : userResults)
                    {
                        for(String computerResult : results)
                        {
                            if(computerResult.equalsIgnoreCase(userResult))
                            {
                                validWords++;
                            }
                        }
                    }

                    JOptionPane.showMessageDialog(new JFrame()
                            , "Elapsed Time: " + (endTime - beginTime) / 1000 + " seconds \n" +
                            "Words Correct: " + validWords + "\n" +
                            "Words Possible: " + results.size() + "\n" +
                            "Words not found by computer " + (userResults.size()-validWords));
                    WordInput.setEditable(false);
                    BeginButton.setEnabled(false);
                }
            }
        });

        BoggleLabel.setHorizontalAlignment(SwingConstants.CENTER);
        TimerAndBoggleLabel.add(BoggleLabel);
        TimerAndBoggleLabel.add(LabelTimer);
        
        EnterWordsLabel.setVerticalAlignment(SwingConstants.BOTTOM);
        
        userInput.add(EnterWordsLabel);
        userInput.add(WordInputScroll);
        userInput.add(BeginButton);

        boggleBoardContainer.setBorder(new EmptyBorder(10, 10, 0, 0));
        boggleBoardContainer.add(boggleBoard);
        boggleBoardContainer.add(TimerAndBoggleLabel);

        frame.add(boggleBoardContainer);
        frame.add(userInput);
        
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.getContentPane().setLayout(new GridLayout(2, 1, 5, 5));
        frame.setSize(400, 400);
        frame.setVisible(true);
    }
	
	public void generateBoggleBoard()
	{
        Random random = new Random();
        char[] chars = "abcdefghijklmnopqrstuvwxyz".toCharArray();
        
        StringBuilder sb = new StringBuilder();		
        for (int i = 0; i < 16; i++) {
            char c = chars[random.nextInt(chars.length)];
            final JLabel diceCharacter = new JLabel(String.valueOf(c).toUpperCase());
            diceCharacter.setBorder(BorderFactory.createLineBorder(Color.BLACK));
            diceCharacter.setHorizontalAlignment(SwingConstants.CENTER);
            diceCharacter.setFont(new Font("Arial", Font.PLAIN, 24));
            sb.append(c);
            boggleBoard.add(diceCharacter);
        }
        dice = sb.toString();
        dice = dice.toUpperCase();
        
        //Calls the previous assignment
        generateSolutions();
	}
	
    public boolean check(int x, int y, String remainder) {
        if(remainder.length() >= 0)
        {
            if(dice.charAt(4*y+x) == remainder.charAt(0))
            {
                if(remainder.length() > 1)
                {
                    used[4*y+x] = true;
                    for (int dx = x-1; dx <= x+1; dx++) {
                        for (int dy = y-1; dy <= y+1; dy++) {
                            if (dx >= 0 && dy >= 0 && dx < 4 && dy < 4 && !used[4*dy+dx]) {
                                if(check(dx,dy, remainder.substring(1))) {
                                    return true;
                                }
                            }
                        }
                    }
                }else
                {
                    return true;
                }
            } 
        }
        return false;
    }

    public boolean isFound(String word) {
        for(int y = 0; y < 4; y++) {
            for(int x = 0; x < 4; x++) {
                if(check(x, y, word.toUpperCase()))
                    return true;
                for(int i =0; i<used.length; i++) //Reseting the used values back
                {
                    used[i] = false;
                }
            }
        }
        return false;
    }

    public static void main(String[] args) {
        try 
		{
            
			BoggleGUI b = new BoggleGUI();  
			
        } catch(Exception ex) 
		{
            System.out.println(ex.toString());
        }
    }
    public void generateSolutions()
    {
        try{
        Scanner s = new Scanner(new File("lexicon.txt"));
        while(s.hasNextLine()) {
            String word = s.nextLine();
            //Really we should check if the word has more than 3 char because that's how the game is played
            if(isFound(word))
            {
                results.add(word);
                totalWords++;
            }
        }
        }catch(Exception ex)
        {
        	 JOptionPane.showMessageDialog(new JFrame()
             , "Exception while generating solutions " + ex.toString());
        }
    }
}
