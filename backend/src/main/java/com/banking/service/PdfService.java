package com.banking.service;

import com.banking.model.Account;
import com.banking.model.Transaction;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfService {
    
    public byte[] generateMonthlyStatement(Account account, List<Transaction> transactions, 
                                           LocalDate startDate, LocalDate endDate) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            // Add header
            Paragraph header = new Paragraph("MAHLANGU CAPITAL BANK")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(20);
            document.add(header);
            
            Paragraph statementTitle = new Paragraph("Monthly Account Statement")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(16);
            document.add(statementTitle);
            
            // Add account details
            document.add(new Paragraph("\n"));
            document.add(new Paragraph("Account Number: " + account.getAccountNumber()));
            document.add(new Paragraph("Account Type: " + account.getAccountType()));
            document.add(new Paragraph("Customer Name: " + account.getCustomer().getFullName()));
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            document.add(new Paragraph("Statement Period: " + 
                startDate.format(formatter) + " to " + endDate.format(formatter)));
            document.add(new Paragraph("\n"));
            
            // Create transactions table
            float[] columnWidths = {1, 2, 1, 1, 1, 1};
            Table table = new Table(UnitValue.createPercentArray(columnWidths))
                .useAllAvailableWidth();
            
            // Add table headers
            table.addHeaderCell(new Paragraph("Date").setBold());
            table.addHeaderCell(new Paragraph("Description").setBold());
            table.addHeaderCell(new Paragraph("Category").setBold());
            table.addHeaderCell(new Paragraph("Type").setBold());
            table.addHeaderCell(new Paragraph("Amount").setBold());
            table.addHeaderCell(new Paragraph("Balance").setBold());
            
            // Add transaction rows
            for (Transaction t : transactions) {
                table.addCell(new Paragraph(t.getTransactionDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
                table.addCell(new Paragraph(t.getDescription() != null ? t.getDescription() : ""));
                table.addCell(new Paragraph(t.getCategory() != null ? t.getCategory().toString() : "OTHER"));
                table.addCell(new Paragraph(t.getType() != null ? t.getType() : ""));
                table.addCell(new Paragraph("R" + (t.getAmount() != null ? t.getAmount().toString() : "0.00")));
                table.addCell(new Paragraph("R" + (t.getBalanceAfterTransaction() != null ? t.getBalanceAfterTransaction().toString() : "0.00")));
            }
            
            document.add(table);
            
            // Add summary
            document.add(new Paragraph("\n"));
            
            // Calculate opening and closing balances
            double openingBalance = 0.0;
            double closingBalance = account.getBalance() != null ? account.getBalance().doubleValue() : 0.0;
            
            if (!transactions.isEmpty()) {
                openingBalance = transactions.get(transactions.size() - 1).getBalanceAfterTransaction() != null ? 
                    transactions.get(transactions.size() - 1).getBalanceAfterTransaction().doubleValue() - 
                    transactions.get(0).getAmount().doubleValue() : 0.0;
            }
            
            document.add(new Paragraph("Opening Balance: R" + String.format("%.2f", openingBalance)));
            document.add(new Paragraph("Closing Balance: R" + String.format("%.2f", closingBalance)));
            
            // Add footer
            document.add(new Paragraph("\n"));
            document.add(new Paragraph("This is a system-generated statement for Mahlangu Capital Bank.")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(10));
            
            document.close();
            return baos.toByteArray();
            
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error generating PDF statement: " + e.getMessage(), e);
        }
    }
}