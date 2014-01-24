import java.io.IOException;
import java.util.Scanner;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.logging.FileHandler;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.Logger;

class Boggle {


    String dice;
    boolean[] used;

    Boggle(String d) {
        if(d.length() != 16)
            throw new IllegalArgumentException("Wrong size");
        this.dice = d;
        this.used = new boolean[16];
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
            Boggle b = new Boggle(args[0].toUpperCase()); //For later comparision
            Scanner s = new Scanner(new File("lexicon.txt"));
            while(s.hasNextLine()) {
                String word = s.nextLine();
                //Really we should check if the word has more than 3 char because that's how the game is played
                if(b.isFound(word))
                    System.out.println(word);
            }
        } catch(Exception ex) {
            System.out.println(ex.toString());
        }
    }
}