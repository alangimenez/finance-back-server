class ErrorResponse {
    constructor(error, detail, stacktrace) {
        this.error = error
        this.detail = detail
        this.stacktrace = stacktrace
    }
}

module.exports = ErrorResponse