package com.banking.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String transactionId;
    private String description;
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    private TransactionCategory category;
    
    private String type; // DEPOSIT, WITHDRAWAL, TRANSFER
    private LocalDateTime transactionDate;
    
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;
    
    private String toAccountNumber; // For transfers
    private BigDecimal balanceAfterTransaction;
    
    @PrePersist
    protected void onCreate() {
        transactionDate = LocalDateTime.now();
        if (transactionId == null) {
            transactionId = "TXN" + System.currentTimeMillis();
        }
    }
}