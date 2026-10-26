# Security Specification: Godongwane Progressive Projects

## 1. Data Invariants
1. **Administrative Access**: Users with email `servicewebsites6@gmail.com` and `mthethwapraisegodcebolenkosi@gmail.com` possess full administrative privileges across all projects, tasks, milestones, documents, and notifications.
2. **Project Ownership and Member Access**: A project can only be created or modified by authenticated users, and sub-collections (`tasks`, `milestones`, `documents`, `updates`) inherit permissions from parent project validation or admin status.
3. **Task & Milestone Integrity**: Tasks and Milestones must reference a valid `projectId` and have valid enum states (`status`, `priority`).
4. **Document Repository Security**: Documents stored in the repository require a valid `projectId`, categorized under strict allowed categories (`blueprint`, `contract`, `report`, `compliance`, `invoice`, `other`), with `uploadedByEmail` matching the authenticated caller (or admin).
5. **Real-time Status Updates**: Status updates must be tied to a project with an authorized author.
6. **Notification Privacy**: Notifications are private to the `recipientEmail` or accessible by admins.

## 2. The "Dirty Dozen" Payloads (Must be Rejected)
1. **Payload 1 (Unauthenticated Project Create)**: An unauthenticated client attempting to write a new project document to `/projects/{projectId}`.
2. **Payload 2 (Unauthenticated Task Create)**: An unauthenticated client attempting to write to `/projects/{projectId}/tasks/{taskId}`.
3. **Payload 3 (Spoofed Admin Elevation)**: A non-admin user creating a user profile with `role: "admin"` attempting to bypass RBAC gates.
4. **Payload 4 (Ghost Field Injection)**: A task update injecting arbitrary shadow fields `{ "isMalicious": true, "elevatePrivilege": true }`.
5. **Payload 5 (ID Poisoning Attack)**: Injecting a 2KB garbage string as document ID `{projectId}`.
6. **Payload 6 (Oversized Payload Denial of Wallet)**: Setting a project title or document name greater than 200 characters or 500KB text blobs.
7. **Payload 7 (Invalid Enum Status)**: Creating a task with `status: "DESTROYED_OR_HACKED"` not matching `["todo", "in_progress", "review", "completed"]`.
8. **Payload 8 (Foreign Document Mutation)**: Non-admin collaborator attempting to delete another project's critical blueprints without authorization.
9. **Payload 9 (Notification Scraping)**: A user attempting to read notifications intended for another user's email address.
10. **Payload 10 (Document Category Tampering)**: Uploading a document with category `root_exploit` instead of defined categories.
11. **Payload 11 (Unverified Email Claim)**: Using a token with `email_verified: false` to claim admin operations.
12. **Payload 12 (Direct Client Rollover)**: Modifying client company records or invoices with unauthorized user claims.

## 3. Test Runner
Included in `firestore.rules.test.ts` verifying that all twelve payloads are blocked with `PERMISSION_DENIED`.
