const accountRepository = require('../../repository/daos/accounts/accountDao');
const { convertRequest } = require('../../utils/utils');
const duplicateAccountException = require('../../errors/DuplicateAccountException')
const { addCurrencyToDuplicateAccountsAndSort } = require('../../formatter/accounts/accountFormatter')

class AccountService {
    constructor() { }

    async newAccount(request) {
        let account = convertRequest(request)

        let checkIfAccountExist = await accountRepository.getAccountByNameAndCurrency(account.name, account.currency)
        if (checkIfAccountExist.length > 0) {
            duplicateAccountException(account.name, account.currency)
        }

        const result = await accountRepository.subirInfo(account)
        return result
    }

    async updateBalance(amount, account, currency, operation) {
        const accountInfo = await accountRepository.getAccountByNameAndCurrency(account, currency);
        operation == "add" ? accountInfo[0].balance = +accountInfo[0].balance + amount : accountInfo[0].balance = +accountInfo[0].balance - amount
        await accountRepository.updateBalanceByNameAndCurrency(account, currency, accountInfo[0].balance)
        return ({ "message": "ok" })
    }

    async resetBalance(account, currency) {
        await accountRepository.updateBalanceByNameAndCurrency(account, currency, 0)
    }

    async getAllAccounts() {
        return await accountRepository.leerInfo()
    }

    async getExpenseAccounts() {
        const listOfExpenseAccounts = await accountRepository.getExpenseAccounts()
        const response = addCurrencyToDuplicateAccountsAndSort(listOfExpenseAccounts)
        return response
    }

    async getLiquidAccounts() {
        const accountsWithDetail = await accountRepository.getLiquidAccounts()
        const accounts = []
        accountsWithDetail.map(it => accounts.push(it.name))
        return accounts
    }

    async getLiquidAndFciAccounts() {
        const accounts = await accountRepository.getLiquidAndFciAccounts()
        return accounts
    }

    async getNamesOfAccountsByType(type) {
        const accountsByType = await accountRepository.getAccountsByType(type)
        const arrayOfAccountName = []
        accountsByType.map(it => arrayOfAccountName.push(it.name))
        return arrayOfAccountName
    }

    async getNameByTicket(ticket) {
        const account = await accountRepository.getAccountByTicket(ticket)
        return account[0].name
    }

    async getAccountsByType(type) {
        return await accountRepository.getAccountsByType(type)
    }

    async getTicketsByAssetTypeWithBalanceGreatherThanZero(assetType) {
        const accounts = await accountRepository.getAccountsByAssetType(assetType)
        const accountsWithBalanceGreathenThanZero = []

        accounts.map(account => {
            if (account.balance > 0) {
                accountsWithBalanceGreathenThanZero.push(account.ticket)
            }
        })
        
        return accountsWithBalanceGreathenThanZero
    }
}

const accountService = new AccountService()

module.exports = accountService