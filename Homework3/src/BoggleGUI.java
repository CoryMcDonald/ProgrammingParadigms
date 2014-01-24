import java.awt.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.io.File;
import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.Timer;
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

    BoggleGUI() {
        createAndShowGUI();
    }
    private void createAndShowGUI()
    {
        final JFrame frame = new JFrame("Boggle");

        final JLabel LabelTimer = new JLabel("00:00", SwingConstants.CENTER);
        JLabel BoggleLabel = new JLabel("Boggle");
        final JLabel EnterWordsLabel = new JLabel("Enter Words Here");

        final SimpleDateFormat TIME = new SimpleDateFormat("mm:ss");

        final JButton BeginButton = new JButton("Begin");
        final JButton SubmitButton = new JButton("Done");

        final JTextArea WordInput = new JTextArea("");
        WordInput.setEditable(false);

        //Boggle Board stuff for representing letters
        final JPanel userInput = new JPanel(new GridLayout(3,1));
        JPanel boggleBoard = new JPanel(new GridLayout(4,4));
        JPanel boggleBoardContainer = new JPanel(new GridLayout(1,2));
        JPanel EnterLabelPanel = new JPanel(new GridLayout(1,1));
        JPanel TimerAndBoggleLabel = new JPanel(new GridLayout(2,1));

        JScrollPane WordInputScroll = new JScrollPane(WordInput);

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

        //http://stackoverflow.com/questions/5683327/how-to-generate-a-random-string-of-20-characters
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
        generateSolutions();

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
//        frame.add(TimerAndBoggleLabel);
        frame.add(userInput);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.getContentPane().setLayout(new GridLayout(2, 1, 5, 5));
        frame.setSize(400, 400);
        frame.setVisible(true);
    }

    public boolean check(int x, int y, String remainder) {
        if(remainder.length() >= 0)
        {
            if(dice.charAt(4*y+x) == remainder.charAt(0))
            {
                if(remainder.length() > 1)
                {
                    used[4*y+x] = true;
                    for (int dx = x-1; dx <= x+1; dx++)  {
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
            } else {
                return false;
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
        try {

            BoggleGUI b = new BoggleGUI(); //For later comparision

        } catch(Exception ex) {
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
            System.out.println("Exception while generating solutions " + ex.toString());
        }
    }
}