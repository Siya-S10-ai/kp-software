# KP Enterprise Software — Use Cases & Authorization Rules

## Purpose

This document defines the official use cases, permissions, restrictions, and responsibilities for every user role within KP Enterprise Software.

This document serves as the source of truth for:

* System design
* Database design
* API development
* Access control
* Testing
* Security reviews

---

# User Roles

The platform supports five primary roles:

1. Visitor
2. Customer
3. Worker
4. Operations Admin
5. Super Admin

---

# Role Definitions

## Visitor

A public user who has not authenticated.

Visitors can:

* View services
* View portfolio articles
* View approved reviews
* Submit enquiries
* Contact the business

Visitors cannot:

* View projects
* View customer data
* View worker data
* Leave reviews
* Access any portal

---

## Customer

A paying customer with an authenticated account.

Customers can:

* View their own projects
* View project timelines
* View project milestones
* View customer-visible progress updates
* View customer-visible media
* Submit reviews
* Comment on their own reviews
* Update personal profile details

Customers cannot:

* View other customers' projects
* Assign workers
* Create projects
* Edit project status
* Access internal notes
* Access operational dashboards

---

## Worker

A welder, builder, technician, or contractor.

Workers can:

* View assigned projects
* View assigned tasks
* Update task status
* Upload progress photos
* Submit work notes
* Mark tasks complete
* View project instructions

Workers cannot:

* View unassigned projects
* Create projects
* Delete projects
* Access financial information
* Access customer private information
* Approve reviews
* Manage users

---

## Operations Admin

Responsible for day-to-day business operations.

Operations Admins can:

* View enquiries
* Create projects
* Convert enquiries into projects
* Create customer records
* Assign workers
* Create tasks
* Manage project progress
* Upload customer-visible updates
* Moderate reviews
* Manage customer communication

Operations Admins cannot:

* Modify Super Admin accounts
* Change system-wide permissions
* Delete audit records
* Access platform configuration settings

---

## Super Admin

System owner and highest authority.

Super Admins can:

* Perform all Operations Admin actions
* Create users
* Suspend users
* Change roles
* Configure system settings
* View all projects
* View business metrics
* Approve portfolio publications
* Manage platform-wide permissions

Super Admin restrictions:

* No restrictions except technical safeguards.

---

# Business Use Cases

---

# UC-001 Submit Enquiry

## Actor

Visitor

## Description

A visitor submits a request for a quote or service.

## Preconditions

* Visitor is on public website.

## Main Flow

1. Visitor completes enquiry form.
2. System validates submission.
3. System stores enquiry.
4. System assigns status = New.
5. Admin receives notification.

## Postconditions

* Enquiry exists in database.

---

# UC-002 Convert Enquiry To Project

## Actor

Operations Admin

## Description

An enquiry becomes a real project.

## Preconditions

* Enquiry exists.
* Enquiry status = New or Qualified.

## Main Flow

1. Admin opens enquiry.
2. Admin reviews information.
3. Admin creates project.
4. System links customer.
5. Enquiry status becomes Converted.

## Postconditions

* Project exists.
* Customer account exists.

---

# UC-003 Assign Worker

## Actor

Operations Admin

## Description

Assign workers to a project.

## Preconditions

* Project exists.
* Worker account exists.

## Main Flow

1. Admin opens project.
2. Admin selects worker.
3. Admin assigns worker.
4. System records assignment.

## Postconditions

* Worker receives assignment.

---

# UC-004 Update Project Progress

## Actor

Worker

## Description

Worker submits progress information.

## Preconditions

* Worker assigned to project.

## Main Flow

1. Worker opens assigned project.
2. Worker uploads notes.
3. Worker uploads media.
4. Worker submits update.

## Postconditions

* Progress update stored.
* Customer visibility determined.

---

# UC-005 View Project Progress

## Actor

Customer

## Description

Customer tracks work progress.

## Preconditions

* Customer owns project.

## Main Flow

1. Customer logs in.
2. Customer opens project.
3. System displays timeline.
4. System displays visible updates.

## Postconditions

* Customer informed of progress.

---

# UC-006 Submit Review

## Actor

Customer

## Description

Customer reviews completed work.

## Preconditions

* Project completed.

## Main Flow

1. Customer opens review form.
2. Customer enters rating.
3. Customer enters comments.
4. Review saved.
5. Review status = Pending Approval.

## Postconditions

* Review awaiting moderation.

---

# UC-007 Moderate Review

## Actor

Operations Admin

## Description

Admin approves or rejects review.

## Preconditions

* Review exists.

## Main Flow

1. Admin opens review.
2. Admin evaluates content.
3. Admin approves or rejects.

## Postconditions

* Review published or hidden.

---

# Data Visibility Rules

## Project Visibility

Customer:

* Own projects only

Worker:

* Assigned projects only

Operations Admin:

* All projects

Super Admin:

* All projects

---

## Task Visibility

Customer:

* None

Worker:

* Assigned tasks

Operations Admin:

* All tasks

Super Admin:

* All tasks

---

## Review Visibility

Visitor:

* Approved reviews only

Customer:

* Own reviews

Operations Admin:

* All reviews

Super Admin:

* All reviews

---

## Media Visibility

Customer:

* Customer-visible media only

Worker:

* Assigned project media

Operations Admin:

* All project media

Super Admin:

* All project media

---

# Security Principles

The system must enforce:

## Least Privilege

Users receive only the permissions required to perform their duties.

## Role-Based Access Control

Every protected endpoint must verify:

* Authentication
* User role
* Resource ownership where applicable

## Ownership Validation

Customers may only access resources belonging to them.

Workers may only access resources assigned to them.

## Auditability

The system should record:

* Project creation
* Assignment changes
* Status changes
* Review moderation actions
* User role changes

---

# MVP Scope Enforcement

Included in MVP:

* Authentication
* Enquiries
* Projects
* Worker assignments
* Progress updates
* Customer visibility
* Reviews

Excluded from MVP:

* Payments
* Inventory management
* Payroll
* Analytics dashboards
* Marketing automation
* AI features

These features belong to future releases.
