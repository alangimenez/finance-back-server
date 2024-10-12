const cashFlowRepository = require('../../repository/daos/investments/cashflowDao');
const lastValueService = require('./lastValueService');
const { irr } = require('node-irr');
const TirModel = require('../../models/tirModel')
const TirResponse = require('../../models/tirResponse')
const tirRepository = require('../../repository/daos/investments/tirDao')
const { diffInDaysBetweenDateAndToday, roundToTwo } = require('../../utils/utils')

class TirService {
    constructor() { }

    async generateTir() {
        // obtiene los cashFlows de todos los bonos (cambiar repository por service)
        const cashFlows = await cashFlowRepository.leerInfo()

        // calculo del tir
        let arrayTir = []
        for (let i = 0; i < cashFlows.length; i++) {
            // obtiene la última cotizacion guardada de un bono en particular
            const lastValueBond = await lastValueService.getInfoByBondName(cashFlows[i].bondName);

            // agrega la inversión en el momento cero al cashflow
            cashFlows[i].cashFlow.unshift(-(lastValueBond[0].closePrice - 1 + 1));

            // calcula la tir y guarda la información en la base de datos
            let tirMonthly = irr(cashFlows[i].cashFlow)
            let tirAnnual = Math.pow(1 + tirMonthly, 12)
            let tirAnnualRound = roundToTwo(((tirAnnual) - 1))
            let tirModel = new TirModel(
                cashFlows[i].bondName,
                new Date().toLocaleString(),
                new Date().toLocaleString(),
                tirAnnualRound)
            tirRepository.subirInfo(tirModel)

            // incorpora el resultado de la tir en un array que se devuelve posterior al bucle
            let tirResponse = new TirResponse(
                tirModel.bondName,
                cashFlows[i].company,
                cashFlows[i].start,
                cashFlows[i].finish,
                cashFlows[i].rate - 1 + 1,
                tirModel.date,
                tirModel.time,
                tirModel.tir * 100
            )
            arrayTir.push(tirResponse)
        }
        return arrayTir;
    }

    async generateTirDaily() {
        // obtiene los cashFlows de todos los bonos
        const cashFlowsData = await cashFlowRepository.leerInfo()
        const tirData = await tirRepository.leerInfo()
        let tirAnnualRound = 0;

        // ESTO SOLO SERÍA NECESARIO SI QUISIERA ACTUALIZAR LA TIR DE UN BONO EN PARTICULAR
        // obtiene el indice del bono que se quiere calcular la tir
        // const bondIndex = cashFlowsData.findIndex((bond) => bond.bondName == bondName)

        for (let i = 0; i < cashFlowsData.length; i++) {
            // calcula cuantos días faltan hasta el vencimiento del ticket
            const daysDiff = diffInDaysBetweenDateAndToday(new Date(cashFlowsData[i].finish))

            // crea un array con los días faltantes y lo setea todo a cero
            const cashFlow = new Array(daysDiff);
            for (let j = 0; j < cashFlow.length; j++) {
                cashFlow[j] = 0
            }

            // incorpora el monto de intereses en el array del cashflow
            for (let k = 0; k < cashFlowsData[i].dateInterest.length; k++) {
                cashFlow[diffInDaysBetweenDateAndToday(new Date(cashFlowsData[i].dateInterest[k]))] = cashFlowsData[i].amountInterest[k]
            }

            // incorpora el gasto de inversión al momento cero con la última cotización
            const lastValueBond = await lastValueService.getInfoByBondName(cashFlowsData[i].bondName);
            cashFlow.unshift(-(lastValueBond.closePrice - 1 + 1))

            const tiempoTranscurrido = Date.now();
            const hoy = new Date(tiempoTranscurrido);

            // calculate tir and persist result in DB
            let tirDaily = irr(cashFlow)
            let tirAnnual = Math.pow(1 + tirDaily, 365)
            tirAnnualRound = roundToTwo(((tirAnnual) - 1))
            const index = tirData.findIndex((e) => e.bondName == lastValueBond.bondName)
            if (index >= 0) {
                tirRepository.modifyData(lastValueBond.bondName, hoy.toLocaleDateString(), hoy.toLocaleTimeString(), tirAnnualRound)
            } else {
                tirRepository.subirInfo(
                    new TirModel(
                        cashFlowsData[i].bondName,
                        "data",
                        "time",
                        tirAnnualRound
                    )
                ) 
            }       
        }
        return {"message": "ok"}

    }

    async getTirDaily() {
        return tirRepository.leerInfo()
    }

    async getTir() {
        return tirRepository.leerInfo()
    }
}

const tirService = new TirService()

module.exports = tirService