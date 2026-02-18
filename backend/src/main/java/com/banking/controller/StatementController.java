package com.banking.controller;

import com.banking.model.Account;
import com.banking.model.Transaction;
import com.banking.service.AccountService;
import com.banking.service.PdfService;
import com.banking.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/statements")
@CrossOrigin(origins = "https://mahlangu-capital-bank-frontend.onrender.com", allowCredentials = "true")
public class StatementController {
    
    @Autowired
    private AccountService accountService;
    
    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private PdfService pdfService;
    
    @GetMapping("/{accountNumber}/pdf")
    public ResponseEntity<byte[]> generateStatement(
            @PathVariable String accountNumber,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        try {
            Account account = accountService.getAccount(accountNumber);
            List<Transaction> transactions = transactionService
                .getTransactionsByDateRange(account, startDate, endDate);
            
            byte[] pdfBytes = pdfService.generateMonthlyStatement(account, transactions, startDate, endDate);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "statement.pdf");
            headers.setContentLength(pdfBytes.length);
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
                
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}