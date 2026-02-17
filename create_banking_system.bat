@echo off
echo Creating Banking System Project Structure...

REM ==============================
REM BACKEND STRUCTURE
REM ==============================

mkdir backend
mkdir backend\src
mkdir backend\src\main
mkdir backend\src\main\java
mkdir backend\src\main\java\com
mkdir backend\src\main\java\com\banking

mkdir backend\src\main\java\com\banking\controller
mkdir backend\src\main\java\com\banking\service
mkdir backend\src\main\java\com\banking\repository
mkdir backend\src\main\java\com\banking\model
mkdir backend\src\main\java\com\banking\security
mkdir backend\src\main\java\com\banking\dto

REM Controllers
type nul > backend\src\main\java\com\banking\controller\AuthController.java
type nul > backend\src\main\java\com\banking\controller\CustomerController.java
type nul > backend\src\main\java\com\banking\controller\AccountController.java
type nul > backend\src\main\java\com\banking\controller\TransactionController.java
type nul > backend\src\main\java\com\banking\controller\StatementController.java

REM Services
type nul > backend\src\main\java\com\banking\service\CustomerService.java
type nul > backend\src\main\java\com\banking\service\AccountService.java
type nul > backend\src\main\java\com\banking\service\TransactionService.java
type nul > backend\src\main\java\com\banking\service\InterestService.java
type nul > backend\src\main\java\com\banking\service\PdfService.java

REM Repositories
type nul > backend\src\main\java\com\banking\repository\CustomerRepository.java
type nul > backend\src\main\java\com\banking\repository\AccountRepository.java
type nul > backend\src\main\java\com\banking\repository\TransactionRepository.java

REM Models
type nul > backend\src\main\java\com\banking\model\Customer.java
type nul > backend\src\main\java\com\banking\model\Account.java
type nul > backend\src\main\java\com\banking\model\Transaction.java
type nul > backend\src\main\java\com\banking\model\AccountType.java
type nul > backend\src\main\java\com\banking\model\TransactionCategory.java
type nul > backend\src\main\java\com\banking\model\AccountStatus.java

REM Security
type nul > backend\src\main\java\com\banking\security\PasswordUtils.java

REM DTOs
type nul > backend\src\main\java\com\banking\dto\CustomerDTO.java
type nul > backend\src\main\java\com\banking\dto\AccountDTO.java
type nul > backend\src\main\java\com\banking\dto\TransactionDTO.java
type nul > backend\src\main\java\com\banking\dto\LoginRequest.java

REM Main Application
type nul > backend\src\main\java\com\banking\BankingApplication.java

REM Backend root files
type nul > backend\pom.xml
type nul > backend\Dockerfile

REM ==============================
REM FRONTEND STRUCTURE
REM ==============================

mkdir frontend
mkdir frontend\src
mkdir frontend\src\components
mkdir frontend\src\services

REM Components
type nul > frontend\src\components\Login.js
type nul > frontend\src\components\Register.js
type nul > frontend\src\components\Dashboard.js
type nul > frontend\src\components\AccountList.js
type nul > frontend\src\components\CreateAccount.js
type nul > frontend\src\components\TransactionForm.js
type nul > frontend\src\components\TransactionHistory.js
type nul > frontend\src\components\FundTransfer.js
type nul > frontend\src\components\AccountSettings.js
type nul > frontend\src\components\StatementGenerator.js

REM Services
type nul > frontend\src\services\api.js

REM Frontend root files
type nul > frontend\src\App.js
type nul > frontend\src\index.js
type nul > frontend\package.json
type nul > frontend\Dockerfile

REM ==============================
REM DATABASE
REM ==============================

mkdir database
type nul > database\init.sql

REM ==============================
REM ROOT FILES
REM ==============================

type nul > docker-compose.yml
type nul > render.yaml
type nul > README.md

echo.
echo Banking System Structure Created Successfully!
pause