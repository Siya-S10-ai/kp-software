const { randomUUID } = require('crypto')

function createMemoryStore() {
  const collections = {
    users: [],
    customers: [],
    workers: [],
    enquiries: [],
    projects: [],
    tasks: [],
    progressUpdates: [],
    mediaFiles: [],
    reviews: [],
    reviewComments: [],
  }

  function generateId() {
    return randomUUID()
  }

  async function insert(collection, doc) {
    const record = { ...doc, _id: doc._id || doc.id || generateId() }
    if (!record.id) record.id = record._id
    collections[collection].push(record)
    return { ...record }
  }

  async function find(collection, filter = {}) {
    return collections[collection].filter((doc) =>
      Object.entries(filter).every(([key, value]) => {
        if (Array.isArray(value)) return value.includes(doc[key])
        return doc[key] === value
      })
    )
  }

  async function findOne(collection, filter = {}) {
    const results = await find(collection, filter)
    return results[0] || null
  }

  async function findById(collection, id) {
    return (
      collections[collection].find((doc) => doc.id === id || doc._id === id) ||
      null
    )
  }

  async function updateById(collection, id, updates) {
    const index = collections[collection].findIndex(
      (doc) => doc.id === id || doc._id === id
    )
    if (index === -1) return null
    collections[collection][index] = {
      ...collections[collection][index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return { ...collections[collection][index] }
  }

  async function deleteById(collection, id) {
    const index = collections[collection].findIndex(
      (doc) => doc.id === id || doc._id === id
    )
    if (index === -1) return false
    collections[collection].splice(index, 1)
    return true
  }

  async function clear() {
    Object.keys(collections).forEach((key) => {
      collections[key] = []
    })
  }

  return {
    insert,
    find,
    findOne,
    findById,
    updateById,
    deleteById,
    clear,
    generateId,
    isMemory: true,
  }
}

module.exports = { createMemoryStore }
