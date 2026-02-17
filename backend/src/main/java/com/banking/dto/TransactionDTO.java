package com.banking.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.banking.model.TransactionCategory;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    @NotNull(message = "Amount is required")
    private BigDecimal amount;
    
    private String description;
    private TransactionCategory category;
    private String type;
    private String toAccountNumber;
}