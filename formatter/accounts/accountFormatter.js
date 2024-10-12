const moment = require('moment'); // require
moment().format();

const addCurrencyToDuplicateAccountsAndSort = listOfAccounts => {
    listOfAccounts.sort((a, b) => a.name.localeCompare(b.name))

    const listOfNamesOfAccounts = []
    listOfAccounts.map(it => listOfNamesOfAccounts.push(it.name))

    const keysOfRepeatedAccounts = encontrarIndicesValoresRepetidos(listOfNamesOfAccounts)

    for (let i = 0; i < keysOfRepeatedAccounts.length; i++) {
        listOfNamesOfAccounts[keysOfRepeatedAccounts[i]] = `${listOfAccounts[keysOfRepeatedAccounts[i]].name} - ${listOfAccounts[keysOfRepeatedAccounts[i]].currency}`
    }

    return listOfNamesOfAccounts

}

const formatDateOfMongo = date => {
    return moment(date).add(3, 'hours').format("yyyy/MM/DD")
}

// PRIVATE
function encontrarIndicesValoresRepetidos(array) {
    let indicesRepetidos = [];

    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[i] === array[j] && !indicesRepetidos.includes(i)) {
                indicesRepetidos.push(i);
                indicesRepetidos.push(j)
            }
        }
    }

    return indicesRepetidos;
}

module.exports = {
    addCurrencyToDuplicateAccountsAndSort,
    formatDateOfMongo
}