package com.banking.service;

import com.banking.model.*;
import com.banking.dto.AccountDTO;
import com.banking.dto.TransactionDTO;
import com.banking.repository.AccountRepository;
import com.banking.repository.CustomerRepository;
import com.banking.security.PasswordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
public class AccountService {
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private TransactionService transactionService;
    
    public Account createAccount(Long customerId, AccountDTO accountDTO) {
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));
        
        Account account = new Account();
        account.setAccountNumber(PasswordUtils.generateAccountNumber());
        account.setAccountType(accountDTO.getAccountType());
        account.setStatus(AccountStatus.ACTIVE);
        account.setBalance(BigDecimal.ZERO);
        account.setCustomer(customer);
        
        if (accountDTO.getPin() != null && !accountDTO.getPin().isEmpty()) {
            account.setPinHash(PasswordUtils.hashPassword(accountDTO.getPin()));
        }
        
        return accountRepository.save(account);
    }
    
    public List<Account> getCustomerAccounts(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        return accountRepository.findByCustomer(customer);
    }
    
    public Account getAccount(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> new RuntimeException("Account not found with number: " + accountNumber));
    }
    
    @Transactional
    public Account deposit(String accountNumber, BigDecimal amount, String description) {
        Account account = getAccount(accountNumber);
        
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }
        
        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);
        
        TransactionDTO transactionDTO = new TransactionDTO();
        transactionDTO.setAmount(amount);
        transactionDTO.setType("DEPOSIT");
        transactionDTO.setDescription(description != null ? description : "Cash deposit");
        transactionDTO.setCategory(TransactionCategory.OTHER);
        
        transactionService.createTransaction(account, transactionDTO, account.getBalance());
        
        return account;
    }
    
    @Transactional
    public Account withdraw(String accountNumber, BigDecimal amount, String pin, String description) {
        Account account = getAccount(accountNumber);
        
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }
        
        if (account.getPinHash() != null && !PasswordUtils.verifyPassword(pin, account.getPinHash())) {
            throw new RuntimeException("Invalid PIN");
        }
        
        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient funds");
        }
        
        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);
        
        TransactionDTO transactionDTO = new TransactionDTO();
        transactionDTO.setAmount(amount);
        transactionDTO.setType("WITHDRAWAL");
        transactionDTO.setDescription(description != null ? description : "Cash withdrawal");
        transactionDTO.setCategory(TransactionCategory.OTHER);
        
        transactionService.createTransaction(account, transactionDTO, account.getBalance());
        
        return account;
    }
    
    @Transactional
    public TransferResult transfer(String fromAccountNumber, String toAccountNumber, 
                                   BigDecimal amount, String pin, String description) {
        
        // Validate accounts
        Account fromAccount = getAccount(fromAccountNumber);
        Account toAccount = getAccount(toAccountNumber);
        
        // Check if accounts are active
        if (fromAccount.getStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("Source account is not active");
        }
        
        if (toAccount.getStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("Destination account is not active");
        }
        
        // Verify PIN
        if (fromAccount.getPinHash() != null && !PasswordUtils.verifyPassword(pin, fromAccount.getPinHash())) {
            throw new RuntimeException("Invalid PIN");
        }
        
        // Check sufficient funds
        if (fromAccount.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient funds");
        }
        
        // Determine if this is an internal transfer (same customer) or external (different customers)
        boolean isInternalTransfer = fromAccount.getCustomer().getId()
                .equals(toAccount.getCustomer().getId());
        
        // Perform transfer
        fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
        toAccount.setBalance(toAccount.getBalance().add(amount));
        
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);
        
        // Create transaction for sender
        TransactionDTO fromTransactionDTO = new TransactionDTO();
        fromTransactionDTO.setAmount(amount);
        fromTransactionDTO.setType("TRANSFER_OUT");
        fromTransactionDTO.setDescription(description != null ? description : 
            (isInternalTransfer ? "Transfer to your " : "Transfer to ") + toAccountNumber);
        fromTransactionDTO.setToAccountNumber(toAccountNumber);
        fromTransactionDTO.setCategory(TransactionCategory.OTHER);
        
        Transaction fromTransaction = transactionService.createTransaction(
            fromAccount, fromTransactionDTO, fromAccount.getBalance());
        
        // Create transaction for recipient
        TransactionDTO toTransactionDTO = new TransactionDTO();
        toTransactionDTO.setAmount(amount);
        toTransactionDTO.setType("TRANSFER_IN");
        toTransactionDTO.setDescription(description != null ? description : 
            (isInternalTransfer ? "Transfer from your " : "Transfer from ") + fromAccountNumber);
        toTransactionDTO.setCategory(TransactionCategory.OTHER);
        
        Transaction toTransaction = transactionService.createTransaction(
            toAccount, toTransactionDTO, toAccount.getBalance());
        
        // Return transfer result with details
        return new TransferResult(
            fromAccount,
            toAccount,
            fromTransaction,
            toTransaction,
            amount,
            isInternalTransfer,
            fromAccount.getCustomer().getFullName(),
            toAccount.getCustomer().getFullName()
        );
    }
    
    public Account updateAccountStatus(String accountNumber, AccountStatus status) {
        Account account = getAccount(accountNumber);
        account.setStatus(status);
        return accountRepository.save(account);
    }
    
    // Inner class to hold transfer result details
    public static class TransferResult {
        private final Account fromAccount;
        private final Account toAccount;
        private final Transaction fromTransaction;
        private final Transaction toTransaction;
        private final BigDecimal amount;
        private final boolean internalTransfer;
        private final String senderName;
        private final String recipientName;
        
        public TransferResult(Account fromAccount, Account toAccount, 
                             Transaction fromTransaction, Transaction toTransaction,
                             BigDecimal amount, boolean internalTransfer,
                             String senderName, String recipientName) {
            this.fromAccount = fromAccount;
            this.toAccount = toAccount;
            this.fromTransaction = fromTransaction;
            this.toTransaction = toTransaction;
            this.amount = amount;
            this.internalTransfer = internalTransfer;
            this.senderName = senderName;
            this.recipientName = recipientName;
        }
        
        // Getters
        public Account getFromAccount() { return fromAccount; }
        public Account getToAccount() { return toAccount; }
        public Transaction getFromTransaction() { return fromTransaction; }
        public Transaction getToTransaction() { return toTransaction; }
        public BigDecimal getAmount() { return amount; }
        public boolean isInternalTransfer() { return internalTransfer; }
        public String getSenderName() { return senderName; }
        public String getRecipientName() { return recipientName; }
    }
}