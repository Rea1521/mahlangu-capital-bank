package com.banking.security;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Random;

public class PasswordUtils {
    
    public static String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(password.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
    
    public static boolean verifyPassword(String password, String hash) {
        String hashedInput = hashPassword(password);
        return hashedInput.equals(hash);
    }
    
    public static String generateCustomerId() {
        SecureRandom random = new SecureRandom();
        int number = random.nextInt(1000000);
        return String.format("CUST%06d", number);
    }
    
    public static String generateAccountNumber() {
        Random random = new Random();
        // Generate a random number between 1000000000 and 9999999999
        long number = 1000000000L + (long)(random.nextDouble() * 9000000000L);
        return String.format("ACC%010d", number);
    }
}