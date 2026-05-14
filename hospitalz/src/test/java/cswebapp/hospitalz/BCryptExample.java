package cswebapp.hospitalz;

import org.mindrot.jbcrypt.BCrypt;

public class BCryptExample {

    public static void main(String[] args) {

        // Original text/password
        String text = "pass";

        // Generate hash
        String hashed = BCrypt.hashpw(text, BCrypt.gensalt());

        // Print results
        System.out.println("Original Text: " + text);
        System.out.println("BCrypt Hash: " + hashed);

        // Verify text against hash
        boolean matched = BCrypt.checkpw(text, hashed);

        System.out.println("Match Result: " + matched);
    }
}