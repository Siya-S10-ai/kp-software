const ROLES = {
  CUSTOMER: 'customer',
  WORKER: 'worker',
  OPERATIONS_ADMIN: 'operations_admin',
  SUPER_ADMIN: 'super_admin',
}

const ADMIN_ROLES = [ROLES.OPERATIONS_ADMIN, ROLES.SUPER_ADMIN]

const PROJECT_STATUSES = ['planning', 'in_progress', 'on_hold', 'completed', 'cancelled']

const TASK_STATUSES = ['pending', 'in_progress', 'completed', 'blocked']

const REVIEW_STATUSES = ['pending', 'approved', 'rejected']

const MILESTONE_STATUSES = ['upcoming', 'in_progress', 'completed']

module.exports = {
  ROLES,
  ADMIN_ROLES,
  PROJECT_STATUSES,
  TASK_STATUSES,
  REVIEW_STATUSES,
  MILESTONE_STATUSES,
}
