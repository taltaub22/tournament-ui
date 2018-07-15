const express = require('express')
const app = express()
const domain = require('domain')
const path = require('path')
const {authenticationMiddleware, authenticationDevMiddleware} = require('@first-lego-league/ms-auth')
const {correlateSession} = require('@first-lego-league/ms-correlation')
const {Logger} = require('@first-lego-league/ms-logger')

const appPort = process.env.PORT || 3000

const logger = Logger()

logger.setLogLevel(process.env.LOG_LEVEL || logger.LOG_LEVELS.DEBUG)

if (process.env.DEV) {
  app.use(authenticationDevMiddleware())
} else {
  app.use(authenticationMiddleware)
}

// App files
app.use('/', express.static(path.resolve(__dirname, 'dist/client')))

// Design files
app.use('/design', express.static(path.resolve(__dirname, 'node_modules/@first-lego-league/user-interface/current/assets')))

// So every route will end up at the angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/client/index.html'));
});

app.listen(appPort, () => {
  domain.create().run(() => {
    correlateSession()
    logger.info('Server started on port ' + appPort)
  })
})
