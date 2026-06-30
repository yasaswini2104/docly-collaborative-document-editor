# Architecture Overview
Docly follows a standard decoupled Client-Server architecture. The frontend is a Single Page Application (SPA) that communicates with a RESTful Node.js/Express backend, which in turn interfaces with a MySQL database via Prisma ORM.

## System Architecture

### Frontend
- **Framework**: React 19 built with Vite.
- **Styling**: Tailwind CSS v4 for utility-first styling and robust design tokens.
- **Routing**: React Router v7 for declarative, client-side routing.
- **Editor**: TipTap provides a headless, extensible rich-text editing experience without dictating UI.

### Backend
- **Framework**: Express.js handling REST API routes.
- **Validation**: Zod is used to strongly type and validate incoming request payloads.
- **Error Handling**: Centralized error middleware ensures consistent API responses.

### Database
- **Engine**: MySQL.
- **ORM**: Prisma for type-safe database access and schema migrations.

### Authentication
- Uses JSON Web Tokens (JWT).
- The client stores the JWT in memory (AuthContext) to prevent XSS exposure, rather than localStorage.

### API Communication
- RESTful JSON endpoints.
- Axios is configured as the HTTP client.

### State Management
- **Server State**: TanStack Query (React Query) handles data fetching, caching, and background synchronization for documents.
- **Client State**: React Context is used strictly for global UI state (ThemeContext) and auth session existence (AuthContext).

### File Upload Flow
- Uploads (e.g., `.txt`, `.md` import) are parsed entirely on the client side using standard Web APIs (FileReader). The parsed text is then converted into TipTap's JSON format and saved via the standard document creation API. No files are stored on the backend filesystem.

### Sharing Flow
- Document owners can grant `VIEWER` or `EDITOR` roles to other registered users by email via a dedicated sharing endpoint. The backend strictly enforces authorization boundaries based on these roles.

### Persistence Strategy
- Documents are stored as unstructured JSON within a MySQL `JSON` column, mapping directly to TipTap's internal document model. This avoids complex relational mapping for document content.

## Database Design
The schema is normalized and consists of three primary models:

### Users
Stores account information.
- `id` (cuid)
- `email` (unique)
- `passwordHash` (bcrypt)
- `name`

### Documents
Stores the document metadata and content.
- `id` (cuid)
- `title`
- `content` (MySQL JSON)
- `ownerId` (Foreign Key -> User)

### Document Permissions
A join table handling many-to-many relationships between Users and Documents for sharing.
- `documentId` (Foreign Key -> Document)
- `userId` (Foreign Key -> User)
- `role` (Enum: VIEWER, EDITOR)

### Relationships
- A `User` has many owned `Documents` (1:N).
- A `Document` has many `DocumentPermissions` (1:N).
- A `User` has many `DocumentPermissions` (1:N).

## Authentication
- **Password Hashing**: User passwords are securely hashed using `bcrypt` (12 rounds) before being persisted.
- **JWT**: Upon successful login or signup, a signed JWT is issued containing the user's ID.
- **Protected Routes**: Both frontend and backend utilize middleware/wrappers to reject unauthenticated access. The backend verifies the JWT signature on every protected request.
- **Authorization**: Endpoint controllers verify that the authenticated user either owns the requested document or holds a valid `DocumentPermission` for it.

## State Management
- **TanStack Query** was selected for server state because it drastically reduces boilerplate for fetching, caching, loading states, and mutations compared to Redux or manual `useEffect` fetching.
- **React Context** was used for application/UI state (like the current Theme or Auth session) because this state changes infrequently and needs to be accessed globally, making Context the perfect lightweight tool.

## Security Considerations
- **Input Validation**: Zod ensures all API boundaries reject malformed or malicious payloads before hitting business logic.
- **Password Hashing**: Plaintext passwords never touch the database or logs.
- **JWT**: Tokens are kept in memory on the client.
- **File Validation**: File imports are strictly checked for valid MIME types and size limits on the client before processing.
- **Content Sanitization**: By storing document content as a TipTap JSON object rather than raw HTML, we mitigate Cross-Site Scripting (XSS) attacks. TipTap safely renders this JSON to the DOM.

## Engineering Decisions
- **Prisma & MySQL**: Chosen for robust schema management and type safety out of the box. MySQL handles JSON columns natively, fitting TipTap's data model perfectly.
- **Tailwind CSS**: Allows rapid UI iteration without context-switching between CSS and TSX files.
- **TipTap**: Selected over alternatives like Draft.js or Quill because of its headless nature, modern architecture, and first-class React support.

## Trade-offs
Given the 4–6 hour assessment constraint, the following decisions were made:

### Current Scope
- Secure document sharing and permission enforcement.
- Single-user rich-text editing.
- Persistent database storage.

### Intentionally Out of Scope
- **Optimistic concurrency control**: Skipped to simplify the mutation logic.
- **Real-time collaboration (CRDT / Yjs)**: Setting up WebSockets, Hocuspocus, and resolving merge conflicts requires significant infrastructure and debugging time outside the scope.
- **Version history**: Demands complex delta-storage or snapshotting logic.
- **Comments**: Requires a robust anchoring system within the TipTap editor to track text ranges.
- **Offline support**: Service workers and IndexedDB synchronization would drastically expand the scope.
- **Refresh tokens**: Implemented simple short-lived/session JWTs to focus on core features rather than auth infrastructure.
- **Token revocation**: Requires a Redis blacklist or database session tracking, skipped for speed.
- **Pagination**: The dashboard currently loads all documents; acceptable for a prototype, but would need cursor-based pagination at scale.
- **CSRF protection**: Skipped because tokens are not currently stored in cookies.
- **Magic-byte validation**: File imports rely on browser MIME types rather than binary inspection for speed of implementation.
- **Rate limiting**: No Redis or memory-based rate limiting on auth routes to minimize infrastructure dependencies.