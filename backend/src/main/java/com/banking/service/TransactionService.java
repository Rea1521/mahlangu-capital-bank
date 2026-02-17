package com.banking.service;

import com.banking.model.Account;
import com.banking.model.Transaction;
import com.banking.model.TransactionCategory;
import com.banking.dto.TransactionDTO;
import com.banking.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    public Transaction createTransaction(Account account, TransactionDTO transactionDTO, 
                                         BigDecimal balanceAfterTransaction) {
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setDescription(transactionDTO.getDescription());
        transaction.setType(transactionDTO.getType());
        transaction.setCategory(transactionDTO.getCategory() != null ? 
            transactionDTO.getCategory() : TransactionCategory.OTHER);
        transaction.setToAccountNumber(transactionDTO.getToAccountNumber());
        transaction.setBalanceAfterTransaction(balanceAfterTransaction);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setTransactionId("TXN" + System.currentTimeMillis());
        
        return transactionRepository.save(transaction);
    }
    
    public List<Transaction> getAccountTransactions(Account account) {
        return transactionRepository.findByAccountOrderByTransactionDateDesc(account);
    }
    
    public List<Transaction> getTransactionsByDateRange(Account account, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();
        return transactionRepository.findByAccountAndTransactionDateBetween(account, startDateTime, endDateTime);
    }
    
    public List<Transaction> getTransactionsByCategory(Account account, TransactionCategory category) {
        return transactionRepository.findByAccountAndCategory(account, category);
    }
}