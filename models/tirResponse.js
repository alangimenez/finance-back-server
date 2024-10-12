class TirResponse {
    constructor(bondName, company, start, finish, rate, date, time, tir) {
        this.bondName = bondName;
        this.company = company;
        this.start = start;
        this.finish = finish;
        this.rate = rate;
        this.date = date;
        this.time = time;
        this.tir = tir
      }
}

module.exports = TirResponse