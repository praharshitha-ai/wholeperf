# Security Specification - Wholeperf Cardiac Perfusion Suite

## Data Invariants
1. A **PatientRecord** must be associated with the user ID of the clinician who created or synchronized it.
2. **Patient IDs** and **User IDs** must be strictly validated for format and length to prevent injection attacks.
3. **Inventory Items** are shared across the facility but can only be updated by authenticated surgical staff.
4. **Audit Logs** are append-only for standard users and represent a terminal transaction record.

## The Dirty Dozen Payloads (Red Team Tests)

### 1. Identity Spoofing (Patient Records)
- **Attack**: Authenticated User A attempts to update a patient record created by User B.
- **Payload**: `UPDATE /patients/P-901 { userId: "USER_A", name: "Malicious Change" }`
- **Expected**: `PERMISSION_DENIED` (Relational check fails).

### 2. Shadow Field Injection
- **Attack**: Injecting an `isVerifiedAdmin: true` field into a user profile or patient record.
- **Payload**: `CREATE /patients/P-999 { ..., isVerifiedAdmin: true }`
- **Expected**: `PERMISSION_DENIED` (Schema strictness/AffectedKeys check fails).

### 3. Resource Poisoning (Large Document ID)
- **Attack**: Attempting to create a document with a 2MB string as the ID.
- **Payload**: `CREATE /patients/[2MB_STRING] { ... }`
- **Expected**: `PERMISSION_DENIED` (`isValidId` size check).

### 4. Timestamp Fraud
- **Attack**: Setting a future `createdAt` date to bypass aging filters.
- **Payload**: `CREATE /patients/P-101 { createdAt: "2099-01-01T00:00:00Z" }`
- **Expected**: `PERMISSION_DENIED` (`request.time` server enforcement).

### 5. Inventory Drain
- **Attack**: Setting stock to a negative value.
- **Payload**: `UPDATE /inventory/1 { stock: -100 }`
- **Expected**: `PERMISSION_DENIED` (Schema validation).

### 6. Unauthorized Log Deletion
- **Attack**: Attempting to delete an audit log to hide malfeasance.
- **Expected**: `PERMISSION_DENIED` (`allow delete: if false`).

### 7. PII Blanket Scraping
- **Attack**: A signed-in user attempts to list ALL patient records without a valid ownership query.
- **Expected**: `PERMISSION_DENIED` (`allow list` ownerId check).

### 8. Orphaned Write
- **Attack**: Creating a patient record without a valid User ID.
- **Expected**: `PERMISSION_DENIED` (Required field check).

### 9. Type Mismatch
- **Attack**: Sending `bsa` as a string instead of a number.
- **Expected**: `PERMISSION_DENIED` (Schema type guard).

### 10. Status Shortcut
- **Attack**: Moving a patient from `Pre-Op` to `Discharged` skipping `Intra-Op`.
- **Expected**: `PERMISSION_DENIED` (State transition logic).

### 11. ID Pattern Violation
- **Attack**: Using symbols in IDs (e.g., `records/$$$#%`).
- **Expected**: `PERMISSION_DENIED` (`isValidId` regex).

### 12. Unverified Email Access
- **Attack**: Accessing data with an unverified Google account.
- **Expected**: `PERMISSION_DENIED` (`request.auth.token.email_verified == true`).
