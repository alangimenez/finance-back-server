module.exports = (message) => {
    const error = new Error("CantCreateObjectException")
    error.detail = message
    throw error
}