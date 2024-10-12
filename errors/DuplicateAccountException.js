module.exports = (name, currency) => {
    const error = new Error("DuplicateAccountException")
    error.account = name
    error.currency = currency
    throw error
}