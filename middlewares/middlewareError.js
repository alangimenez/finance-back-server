const ErrorResponse = require('../models/errorResponse')
const logService = require('../services/logs/logService')

const handlerError = async (err, req, res, next) => {
    let error
    let status
    switch (err.message) {
        case "DuplicateAccountException": {
            error = new ErrorResponse(
                err.message,
                `La cuenta ${err.account} en moneda ${err.currency} ya existe`,
                ""
            )
            status = 400
            break
        }
        case "CantCreateObjectException": {
            error = new ErrorResponse(
                err.message,
                `Ocurrió un error al crear el registor. Detalle: ${err.detail}`,
                ""
            )
            status = 500
            break
        }
        default: {
            error = new ErrorResponse(
                err.message,
                `Ocurrio un error inesperado. Motivo: ${err.message}`,
                err.stack
            )
            status = 500
            break
        }
    }
    await logService.createNewMessage(error)
    res.status(status).json(error)
}

module.exports = { handlerError }