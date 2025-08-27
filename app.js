const config = require('./config/config.environments');
const express = require("express");
const path = require('path');
const app = express();
const cors = require('cors')
const quotesRouter = require('./router/investments/quotesRouter');
const lastValueRouter = require('./router/investments/lastValueRouter');
const tirRouter = require('./router/investments/tirRouter');
const cashflowRouter = require('./router/investments/cashFlowRouter');
const registersRouter = require('./router/registers/registerRouter');
const accountRouter = require('./router/accounts/accountRouter');
const investmentRouter = require('./router/investments/investmentRouter');
const assetTypeRouter = require('./router/accounts/assetTypeRouter');
const otherQuotesRouter = require('./router/investments/otherQuotesRouter');
const creditCardRouter = require('./router/creditCard/creditCardRouter');
const expenseCreditCardRouter = require('./router/creditCard/expensesCreditCardRouter');
const mercadoPagoRouter = require('./router/periods/mercadoPagoRouter')
const periodRouter = require('./router/periods/periodRouter')
const refundRouter = require('./router/registers/refundRouter')
const userRouter = require('./router/user/userRouter')
const monthRegisterRouter = require('./router/registers/monthRegisterRouter')
const publicOtherQuotesRouter = require('./router/publicData/otherQuotesRouter')
const publicLastValueRouter = require('./router/publicData/lastValuePublicRouter')
const publicRegistersRouter = require('./router/publicData/publicRegistersRouter')
const scheduledTasksRouter = require('./router/scheduledTasks/scheduledTasksRouter')
const healthCheckRouter = require('./router/healthCheck/healthCheckRouter')
const auth = require('./middlewares/auth');
const { handlerError } = require('./middlewares/middlewareError')

app.use(cors())

// Hacer que node sirva los archivos de nuestro app React
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(express.json());

// Manejar las peticiones GET en la ruta /api
app.get("/api", (req, res) => {
  res.json({ message: "Hola desde el servidor!" });
});

app.use('/quotes', auth, quotesRouter)
app.use('/lastvalue', auth, lastValueRouter)
app.use('/tir', auth, tirRouter)
app.use('/cashflow', auth, cashflowRouter)
app.use('/registers', auth, registersRouter)
app.use('/account', auth, accountRouter)
app.use('/investment', auth, investmentRouter)
app.use('/assettype', auth, assetTypeRouter)
app.use('/otherquotes', auth, otherQuotesRouter)
app.use('/creditcard', auth, creditCardRouter)
app.use('/expensecreditcard', auth, expenseCreditCardRouter)
app.use('/mercadopago', auth, mercadoPagoRouter)
app.use('/period', auth, periodRouter)
app.use('/refund', auth, refundRouter)
app.use('/user', userRouter)
app.use('/monthregister', monthRegisterRouter)
app.use('/public/otherquotes', publicOtherQuotesRouter)
app.use('/public/lastvalue', publicLastValueRouter)
app.use('/public/registers', publicRegistersRouter)
app.use('/__space/v0/actions', scheduledTasksRouter)
app.use('/healthcheck', healthCheckRouter)
app.use(handlerError)

const port = config.PORT;

app.get("/", (req, res) => {
    setTimeout(() => {
        res.json("Hola").status(200)
    }, 60000)
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
