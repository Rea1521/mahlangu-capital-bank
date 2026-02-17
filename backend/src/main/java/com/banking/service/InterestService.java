package com.banking.service;

import com.banking.model.Account;
import com.banking.model.AccountType;
import com.banking.model.TransactionCategory;
import com.banking.repository.AccountRepository;
import com.banking.dto.TransactionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class InterestService {
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private TransactionService transactionService;
    
    private static final BigDecimal SAVINGS_INTEREST_RATE = new BigDecimal("0.04"); // 4% annual
    private static final BigDecimal CURRENT_INTEREST_RATE = new BigDecimal("0.01"); // 1% annual
    
    @Scheduled(cron = "0 0 0 1 * ?") // Run at midnight on the first day of every month
    @Transactional
    public void calculateMonthlyInterest() {
        List<Account> allAccounts = accountRepository.findAll();
        
        for (Account account : allAccounts) {
            if (account.getStatus() == com.banking.model.AccountStatus.ACTIVE) {
                BigDecimal interest = calculateInterest(account);
                
                if (interest.compareTo(BigDecimal.ZERO) > 0) {
                    // Add interest to account
                    account.setBalance(account.getBalance().add(interest));
                    accountRepository.save(account);
                    
                    // Create transaction record for interest
                    TransactionDTO transactionDTO = new TransactionDTO();
                    transactionDTO.setAmount(interest);
                    transactionDTO.setType("INTEREST");
                    transactionDTO.setDescription("Monthly interest credit");
                    transactionDTO.setCategory(TransactionCategory.OTHER);
                    
                    transactionService.createTransaction(account, transactionDTO, account.getBalance());
                }
            }
        }
    }
    
    private BigDecimal calculateInterest(Account account) {
        BigDecimal balance = account.getBalance();
        BigDecimal rate;
        
        if (account.getAccountType() == AccountType.SAVINGS) {
            rate = SAVINGS_INTEREST_RATE;
        } else {
            rate = CURRENT_INTEREST_RATE;
        }
        
        // Calculate monthly interest (annual rate / 12)
        BigDecimal monthlyRate = rate.divide(new BigDecimal("12"), 10, RoundingMode.HALF_UP);
        return balance.multiply(monthlyRate).setScale(2, RoundingMode.HALF_UP);
    }
    
    public BigDecimal calculateProjectedInterest(Account account, int months) {
        BigDecimal balance = account.getBalance();
        BigDecimal rate;
        
        if (account.getAccountType() == AccountType.SAVINGS) {
            rate = SAVINGS_INTEREST_RATE;
        } else {
            rate = CURRENT_INTEREST_RATE;
        }
        
        BigDecimal monthlyRate = rate.divide(new BigDecimal("12"), 10, RoundingMode.HALF_UP);
        BigDecimal totalInterest = BigDecimal.ZERO;
        BigDecimal currentBalance = balance;
        
        for (int i = 0; i < months; i++) {
            BigDecimal monthlyInterest = currentBalance.multiply(monthlyRate)
                .setScale(2, RoundingMode.HALF_UP);
            totalInterest = totalInterest.add(monthlyInterest);
            currentBalance = currentBalance.add(monthlyInterest);
        }
        
        return totalInterest;
    }
}