package com.banking.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.banking.model.AccountType;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {
    private Long id;
    private String accountNumber;
    
    @NotNull(message = "Account type is required")
    private AccountType accountType;
    
    private String pin;
    private Double balance;
    private String status;
}