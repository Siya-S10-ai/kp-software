# ADR 0001: Use MongoDB for Core Data Storage

- **Status:** Accepted
- **Date:** 2026-05-25
- **Decision Makers:** Product Owner, Principal Software Architect, Lead Developer
- **Context:** KP Enterprise Software

## Context

KP Enterprise Software is a digital operations and customer management platform for a welding and fabrication business. The system must support a four-portal ecosystem:

- **Public Site**
- **Client Portal**
- **Worker Portal**
- **Admin Dashboard**

The platform will manage business entities such as:

- leads and enquiries
- customers and client accounts
- fabrication projects
- job stages and timelines
- worker assignments
- task updates
- progress photos and documents
- reviews and comments
- operational notes and future analytics

This domain contains data that is both structured and semi-structured. A single fabrication project may contain:

- a customer record
- multiple job stages
- multiple tasks
- assigned workers
- checklists
- media files
- status history
- client-visible updates
- internal notes
- optional custom attributes depending on the service type

The schema is expected to evolve over time as the business adds new service types, workflow rules, reporting needs, and automation features.

## Decision

We will use **MongoDB** as the primary data store for KP Enterprise Software.

## Rationale

MongoDB is a strong fit for this platform because it supports a **flexible document model** that matches the shape of real-world fabrication work.

### 1. Flexible schema for evolving business workflows

Fabrication and workshop operations do not always fit a rigid relational structure. Project data may vary by:

- service type
- complexity
- customer requirements
- workshop process
- media attachments
- approval steps
- special notes

MongoDB allows the data model to evolve without forcing frequent disruptive database migrations. This is valuable while the product is still being refined and the business process is still being formalized.

### 2. Natural fit for nested business records

A fabrication project is not just a flat record. It is a container for related data:

- project metadata
- assigned workers
- tasks and subtasks
- progress timeline
- uploaded images
- comments and notes
- customer-visible status updates

MongoDB documents can represent this structure naturally, making it easier to store and retrieve a complete project view in a single query when appropriate.

### 3. Faster product iteration

The platform is being built as a living business system, not a static brochure site. The ability to add fields, extend embedded structures, and evolve document shapes supports faster delivery of:

- MVP features
- workflow changes
- new portal screens
- new service categories
- additional data required for reporting

This is especially useful in the early stages, when business requirements are still being clarified.

### 4. Suitable for media-rich operational data

The system will handle progress photos, documents, and other operational attachments. MongoDB works well alongside object storage for file metadata and reference tracking, while keeping core business records grouped with their related file descriptors.

### 5. Horizontal scaling path

MongoDB provides a clear path for growth through:

- indexing
- replication
- sharding
- high availability deployments
- managed cloud hosting

This matters if KP Enterprise Software later supports:

- more users
- more projects
- more workers
- more portals
- more concurrent updates
- additional business units or branches

## Considered Alternatives

### PostgreSQL / relational database
A relational database would offer strong consistency and structured reporting, but it would require more upfront schema design and tighter migration control. It is well suited to highly normalized systems, but less flexible for a rapidly evolving fabrication workflow with nested project data.

### MySQL
MySQL is a mature relational option, but it has the same core limitation for this use case: more rigid structure and less natural handling of variable project documents.

### Firebase / NoSQL alternatives
Some cloud-first NoSQL tools could speed prototyping, but they are less suitable as the core operational store for a business system that needs clear querying, controlled access patterns, and future maintainability.

## Consequences

### Positive
- Faster iteration during product development
- Natural representation of projects, tasks, updates, and timelines
- Easier handling of changing business requirements
- Strong fit for portal-based operational data
- Good foundation for scalable cloud deployment

### Negative
- Reporting and joins must be designed carefully
- Data duplication must be controlled intentionally
- Schema discipline is still required at the application level
- Complex analytics may require additional aggregation design or reporting storage later

## Implementation Notes

To keep the system maintainable, we will:

- define clear collection boundaries
- use schema validation in the application layer
- normalize only where it improves clarity or reporting
- index fields used for search, filtering, and dashboard views
- separate public, client-visible, and internal operational data where needed
- store file metadata in MongoDB and actual files in dedicated object storage

## Decision Outcome

MongoDB is the preferred core database for KP Enterprise Software because it aligns with the platform’s evolving workflow, media-heavy project records, and need for rapid iteration without sacrificing scalability.
