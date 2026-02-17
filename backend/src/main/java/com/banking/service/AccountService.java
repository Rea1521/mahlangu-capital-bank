package com.banking.service;

import com.banking.model.*;
import com.banking.dto.TransactionDTO;
import com.banking.dto.AccountDTO;
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
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        Account account = new Account();
        account.setAccountNumber(PasswordUtils.generateAccountNumber());
        account.setAccountType(accountDTO.getAccountType());
        account.setStatus(AccountStatus.ACTIVE);
        account.setBalance(BigDecimal.ZERO);
        account.setCustomer(customer);
        
        if (accountDTO.getPin() != null) {
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
            .orElseThrow(() -> new RuntimeException("Account not found"));
    }
    
    @Transactional
    public Account deposit(String accountNumber, BigDecimal amount, String description) {
        Account account = getAccount(accountNumber);
        
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }
        
        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);
        
        // Create transaction record
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
        
        // Verify PIN if provided
        if (account.getPinHash() != null && !PasswordUtils.verifyPassword(pin, account.getPinHash())) {
            throw new RuntimeException("Invalid PIN");
        }
        
        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient funds");
        }
        
        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);
        
        // Create transaction record
        TransactionDTO transactionDTO = new TransactionDTO();
        transactionDTO.setAmount(amount);
        transactionDTO.setType("WITHDRAWAL");
        transactionDTO.setDescription(description != null ? description : "Cash withdrawal");
        transactionDTO.setCategory(TransactionCategory.OTHER);
        
        transactionService.createTransaction(account, transactionDTO, account.getBalance());
        
        return account;
    }
    
    @Transactional
    public void transfer(String fromAccountNumber, String toAccountNumber, 
                         BigDecimal amount, String pin, String description) {
        Account fromAccount = getAccount(fromAccountNumber);
        Account toAccount = getAccount(toAccountNumber);
        
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
        
        if (fromAccount.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient funds");
        }
        
        // Withdraw from source
        fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
        accountRepository.save(fromAccount);
        
        // Deposit to destination
        toAccount.setBalance(toAccount.getBalance().add(amount));
        accountRepository.save(toAccount);
        
        // Create transaction records
        TransactionDTO fromTransactionDTO = new TransactionDTO();
        fromTransactionDTO.setAmount(amount);
        fromTransactionDTO.setType("TRANSFER_OUT");
        fromTransactionDTO.setDescription(description != null ? description : "Transfer to " + toAccountNumber);
        fromTransactionDTO.setToAccountNumber(toAccountNumber);
        fromTransactionDTO.setCategory(TransactionCategory.OTHER);
        
        TransactionDTO toTransactionDTO = new TransactionDTO();
        toTransactionDTO.setAmount(amount);
        toTransactionDTO.setType("TRANSFER_IN");
        toTransactionDTO.setDescription(description != null ? description : "Transfer from " + fromAccountNumber);
        toTransactionDTO.setCategory(TransactionCategory.OTHER);
        
        transactionService.createTransaction(fromAccount, fromTransactionDTO, fromAccount.getBalance());
        transactionService.createTransaction(toAccount, toTransactionDTO, toAccount.getBalance());
    }
    
    public Account updateAccountStatus(String accountNumber, AccountStatus status) {
        Account account = getAccount(accountNumber);
        account.setStatus(status);
        return accountRepository.save(account);
    }
}