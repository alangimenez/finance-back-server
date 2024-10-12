const moment = require('moment'); // require
moment().format();
moment().locale('es')

const monthsInEs = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const monthsInEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// calcula la diferencia en días entre hoy y la fecha que se le pase como parametro
const diffInDaysBetweenDateAndToday = (date) => {
    const today = new Date()
    const finishDate = moment([date.getFullYear(), date.getMonth(), date.getDate()])
    const todayMoment = moment([today.getFullYear(), today.getMonth(), today.getDate()])
    return finishDate.diff(todayMoment, 'days')
}

const transformDate = (date) => {
    return moment(date, 'YYYY-MM-DD').format('YYYY/MM/DD')
}

const addOneMonth = month => {
    const key = monthsInEs.findIndex(it => it == month)
    let responseMonth = ""
    key == 11 ? responseMonth = monthsInEs[0] : responseMonth = monthsInEs[key + 1]
    return responseMonth
}

const addOneYear = (year, month) => {
    let responseYear = 0
    month == "Diciembre" ? responseYear = year + 1 : responseYear = year
    return responseYear
}

// redondea un numero flotante a dos decimales
const roundToTwo = (num) => {
    return +(Math.round(num + "e+4") + "e-4");
}

const convertRequest = request => {
    let response;
    if (typeof (request) == 'string') {
        response = JSON.parse(request)
    } else {
        response = request
    }
    return response
}

const addDays = date => {
    const originalDate = moment(date).add(1, 'days').add(12, 'hours')
    return originalDate.format('YYYY-MM-DD')
}

const addSpecificDays = (date, days) => {
    const originalDate = moment(date).add(days, 'days').add(12, 'hours')
    return originalDate.format('YYYY-MM-DD')
}

const getMonthAndYearFromDate = date => {
    const month = moment(date, 'YYYY-MM-DD').format('MMMM')
    const year = moment(date, 'YYYY-MM-DD').format('YYYY')
    const key = monthsInEn.findIndex(it => it == month)
    return {
        "month": monthsInEs[key],
        "year": year
    }
}

const getActualDayInZero = () => {
    return moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate()
}

module.exports = {
    diffInDaysBetweenDateAndToday,
    roundToTwo,
    transformDate,
    convertRequest,
    addDays,
    addSpecificDays,
    addOneMonth,
    addOneYear, 
    getMonthAndYearFromDate,
    getActualDayInZero
}