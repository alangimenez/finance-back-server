const cashFlowRepository = require('../../repository/daos/investments/cashflowDao');
const lastValueRepository = require('../../repository/daos/investments/lastValueDao');
const loggerService = require('../logs/logService');

const MAX_TIR_ITERATIONS = 1_000_000;
const STEP = 0.000001;

class TirByInterpolationService {
    constructor() {}

    async getTirs() {
        // #9: ambas queries corren en paralelo
        const [cashflows, lastRegister] = await Promise.all([
            cashFlowRepository.getActiveBonds(),
            lastValueRepository.getLastRegister()
        ]);

        const quotesMap = this.#buildQuotesMap(lastRegister.quotes);
        const mep = lastRegister.otherQuotes.quotes.dolarMep;

        const promises = cashflows.map((bond, i) => this.#calculateTir(i, bond, quotesMap, mep));
        const results = await Promise.all(promises);
        return results.filter(r => r.value !== 0.0);
    }

    async #calculateTir(id, bond, quotesMap, mep) {
        try {
            const actualPrice = this.#getActualPrice(quotesMap, bond.ticket, mep);
            const tirAnual = this.#computeAnnualTIR(bond, actualPrice);
            return {
                key: bond.ticket,
                value: Math.round(tirAnual * 100 * 100) / 100,
                price: Math.round(actualPrice * 100) / 100,
                finishDate: this.#formatDate(new Date(bond.finish)),
                company: bond.company
            };
        } catch (err) {
            // #5: mensaje sin terminología de Go
            loggerService.createNewMessage(`Error calculando TIR de ${bond.ticket}: ${err.message}`);
            return {
                key: bond.ticket,
                value: 0.0,
                price: 0.0,
                finishDate: this.#formatDate(new Date(bond.finish)),
                company: bond.company
            };
        }
    }

    // #6: Map en lugar de objeto plano
    #buildQuotesMap(quotes) {
        const map = new Map();
        for (const bond of quotes) {
            if (!map.has(bond.simbolo)) {
                map.set(bond.simbolo, bond);
            }
        }
        return map;
    }

    #getActualPrice(quotesMap, ticket, mep) {
        const bond = quotesMap.get(ticket);
        if (!bond) throw new Error(`no price found for ticket ${ticket}`);
        // #7: normalización explícita de moneda
        if (String(bond.moneda) === '1' || bond.moneda === 'AR$') {
            return bond.ultimoPrecio / mep;
        }
        return bond.ultimoPrecio;
    }

    #computeAnnualTIR(cashflow, price) {
        // #2: now se crea una sola vez y se comparte
        const now = new Date();
        const array = this.#createArray(now, new Date(cashflow.finish));
        const arrayWithPayments = this.#addPaymentsToArray(
            cashflow.dateOfPayment,
            cashflow.amountInterest,
            cashflow.amountAmortization,
            array,
            price,
            now
        );
        const tir = this.#calculoTirByInterpolation(arrayWithPayments);
        return this.#tasaEfectivaAnual(tir);
    }

    #createArray(now, endDate) {
        const length = this.#diffInDays(now, endDate);
        return new Array(length).fill(0);
    }

    #diffInDays(date1, date2) {
        const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
        const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
        return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    }

    #addPaymentsToArray(paymentDays, paymentInterest, paymentAmortization, array, actualPrice, now) {
        for (let i = 0; i < paymentDays.length; i++) {
            const diffDays = this.#diffInDays(now, new Date(paymentDays[i]));
            if (diffDays > 0) {
                array[diffDays - 1] = paymentInterest[i] + paymentAmortization[i];
            }
        }
        array[0] = -actualPrice;
        return array;
    }

    #calculoTirByInterpolation(cashflow) {
        // #3: rate derivado del índice para evitar acumulación de error float
        for (let i = 0; i < MAX_TIR_ITERATIONS; i++) {
            const rate = (i + 1) * STEP;
            const previousNpv = this.#calcularNPV(rate - STEP, cashflow);
            const actualNPV = this.#calcularNPV(rate, cashflow);
            const previousNpvNegative = this.#calcularNPV(-rate + STEP, cashflow);
            const actualNPVNegative = this.#calcularNPV(-rate, cashflow);

            if (previousNpv >= 0.0 && actualNPV < 0.0) {
                return this.#interpolation(rate, previousNpv, actualNPV);
            }
            if (previousNpvNegative <= 0.0 && actualNPVNegative > 0.0) {
                return this.#interpolation(-rate, previousNpvNegative, actualNPVNegative);
            }
        }
        throw new Error('TIR did not converge within the maximum number of iterations');
    }

    // #1: multiplicación acumulativa en lugar de Math.pow por cada elemento
    #calcularNPV(tasaDescuento, cashFlow) {
        let sum = cashFlow[0];
        let acc = 1;
        for (let i = 1; i < cashFlow.length; i++) {
            acc *= (1 + tasaDescuento);
            sum += cashFlow[i] / acc;
        }
        return sum;
    }

    #tasaEfectivaAnual(tasaEfectivaDiaria) {
        return Math.pow(1 + tasaEfectivaDiaria, 365) - 1;
    }

    #interpolation(rate, npvPositive, npvNegative) {
        const previousRate = rate - STEP;
        return previousRate + ((rate - previousRate) * (npvPositive / (npvPositive - npvNegative)));
    }

    #formatDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}/${m}/${d}`;
    }
}

const tirByInterpolationService = new TirByInterpolationService();
module.exports = tirByInterpolationService;
