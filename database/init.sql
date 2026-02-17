-- Create database
CREATE DATABASE banking_db;

-- Connect to database
\c banking_db;

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    customer_id VARCHAR(50) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id BIGSERIAL PRIMARY KEY,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    balance DECIMAL(15,2) DEFAULT 0.00,
    pin_hash VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    customer_id BIGINT REFERENCES customers(id)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    amount DECIMAL(15,2),
    category VARCHAR(50),
    type VARCHAR(50),
    transaction_date TIMESTAMP,
    to_account_number VARCHAR(50),
    balance_after_transaction DECIMAL(15,2),
    account_id BIGINT REFERENCES accounts(id)
);

-- Create indexes for performance
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_customer_id ON customers(customer_id);
CREATE INDEX idx_accounts_account_number ON accounts(account_number);
CREATE INDEX idx_accounts_customer_id ON accounts(customer_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);