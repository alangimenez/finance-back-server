module.exports = (e) => {
    const error = new Error("CantCreateObject")
    error.detail = e.message
    throw error
}