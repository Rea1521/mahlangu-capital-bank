package com.banking.repository;

import com.banking.model.Account;
import com.banking.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByCustomer(Customer customer);
    Optional<Account> findByAccountNumber(String accountNumber);
    List<Account> findByCustomerAndStatus(Customer customer, String status);
    boolean existsByAccountNumber(String accountNumber);
}