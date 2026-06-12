const { createMemoryStore } = require('./memoryStore')
const { createMongoStore } = require('./mongoStore')

let storeInstance = null

async function getStore() {
  if (storeInstance) return storeInstance

  const uri = process.env.MONGODB_URI
  if (uri && process.env.NODE_ENV !== 'test') {
    storeInstance = await createMongoStore(uri)
  } else {
    storeInstance = createMemoryStore()
  }

  return storeInstance
}

async function resetStore() {
  if (storeInstance?.close) await storeInstance.close()
  storeInstance = null
  return getStore()
}

module.exports = { getStore, resetStore }
