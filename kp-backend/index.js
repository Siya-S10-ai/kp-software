require('dotenv').config()

const createApp = require('./app')
const PORT = process.env.PORT || 5000

const app = createApp()

app.ready().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})
