const { MongoClient } = require('mongodb')
const { randomUUID } = require('crypto')

const COLLECTIONS = [
  'users',
  'customers',
  'workers',
  'enquiries',
  'projects',
  'tasks',
  'progressUpdates',
  'mediaFiles',
  'reviews',
  'reviewComments',
]

async function createMongoStore(uri) {
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db()

  for (const name of COLLECTIONS) {
    await db.collection(name).createIndex({ id: 1 }, { unique: true })
  }

  function generateId() {
    return randomUUID()
  }

  async function insert(collection, doc) {
    const record = { ...doc, _id: doc._id || doc.id || generateId() }
    if (!record.id) record.id = record._id
    await db.collection(collection).insertOne(record)
    return { ...record }
  }

  async function find(collection, filter = {}) {
    return db.collection(collection).find(filter).toArray()
  }

  async function findOne(collection, filter = {}) {
    return db.collection(collection).findOne(filter)
  }

  async function findById(collection, id) {
    return db.collection(collection).findOne({ id })
  }

  async function updateById(collection, id, updates) {
    const result = await db.collection(collection).findOneAndUpdate(
      { id },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    )
    return result || null
  }

  async function deleteById(collection, id) {
    const result = await db.collection(collection).deleteOne({ id })
    return result.deletedCount > 0
  }

  async function clear() {
    for (const name of COLLECTIONS) {
      await db.collection(name).deleteMany({})
    }
  }

  async function close() {
    await client.close()
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
    close,
    isMemory: false,
  }
}

module.exports = { createMongoStore }
