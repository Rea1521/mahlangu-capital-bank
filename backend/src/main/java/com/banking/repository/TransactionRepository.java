package com.banking.repository;

import com.banking.model.Account;
import com.banking.model.Transaction;
import com.banking.model.TransactionCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccountOrderByTransactionDateDesc(Account account);
    List<Transaction> findByAccountAndTransactionDateBetween(
        Account account, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT t FROM Transaction t WHERE t.account = :account AND t.category = :category")
    List<Transaction> findByAccountAndCategory(@Param("account") Account account, 
                                               @Param("category") TransactionCategory category);
}