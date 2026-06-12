const bcrypt = require('bcryptjs')
const { ROLES } = require('../config/constants')

async function seedDatabase(store) {
  const existing = await store.findOne('users', { email: 'admin@kp.com' })
  if (existing) return

  const now = new Date().toISOString()
  const passwordHash = await bcrypt.hash('password123', 10)

  const customer = await store.insert('customers', {
    id: store.generateId(),
    name: 'Jane Customer',
    email: 'customer@kp.com',
    phone: '071 234 5678',
    createdAt: now,
    updatedAt: now,
  })

  const worker = await store.insert('workers', {
    id: store.generateId(),
    name: 'Mike Worker',
    email: 'worker@kp.com',
    phone: '072 345 6789',
    skills: ['welding', 'fabrication'],
    createdAt: now,
    updatedAt: now,
  })

  const users = [
    {
      email: 'admin@kp.com',
      name: 'Super Admin',
      role: ROLES.SUPER_ADMIN,
      customerId: null,
      workerId: null,
    },
    {
      email: 'nhlanhla9700@gmail.com',
      name: 'Siya',
      role: ROLES.CUSTOMER,
      customerId: customer.id,
      workerId: null,
    },
    {
      email: 'ops@kp.com',
      name: 'Operations Admin',
      role: ROLES.OPERATIONS_ADMIN,
      customerId: null,
      workerId: null,
    },
    {
      email: 'customer@kp.com',
      name: 'Jane Customer',
      role: ROLES.CUSTOMER,
      customerId: customer.id,
      workerId: null,
    },
    {
      email: 'worker@kp.com',
      name: 'Mike Worker',
      role: ROLES.WORKER,
      customerId: null,
      workerId: worker.id,
    },
  ]

  for (const user of users) {
    await store.insert('users', {
      id: store.generateId(),
      ...user,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    })
  }

  const portfolioProject = await store.insert('projects', {
    id: store.generateId(),
    title: 'Custom Steel Gate — Riverside Estate',
    description: 'Ornamental steel driveway gate with automated opener.',
    service: 'gates-fencing',
    status: 'completed',
    customerId: customer.id,
    enquiryId: null,
    assignedWorkerIds: [worker.id],
    milestones: [
      { id: store.generateId(), title: 'Design approval', status: 'completed', dueDate: '2026-01-15' },
      { id: store.generateId(), title: 'Fabrication', status: 'completed', dueDate: '2026-02-01' },
      { id: store.generateId(), title: 'Installation', status: 'completed', dueDate: '2026-02-10' },
    ],
    isPublicPortfolio: true,
    createdAt: now,
    updatedAt: now,
    completedAt: now,
  })

  await store.insert('reviews', {
    id: store.generateId(),
    projectId: portfolioProject.id,
    customerId: customer.id,
    authorName: 'Jane Customer',
    rating: 4,
    title: 'Outstanding craftsmanship',
    body: 'KP Enterprise delivered exactly what we envisioned. Professional team from start to finish.',
    status: 'approved',
    createdAt: now,
    updatedAt: now,
  })
}

module.exports = { seedDatabase }
