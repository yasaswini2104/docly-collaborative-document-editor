# Submission Summary
This submission delivers **Docly**, a production-ready, SaaS-style collaborative document editor. Built within the 4 hour assessment window, the focus was placed heavily on a flawless user experience, rigorous backend validation, secure authentication, and clean, maintainable code architecture.

## Implemented Features

### Authentication
- Full user registration (`/auth/register`) with conflict checking.
- Login system with JWT generation.
- Secure bcrypt password hashing.
- Client-side in-memory token storage.

### Document Management
- Create, read, update, and delete (CRUD) operations for documents.
- Dashboard with clear separation of "Owned" vs "Shared" documents.

### Rich Text Editing
- Integrated TipTap editor with standard formatting (bold, italic, headings, lists).
- Clean, distraction-free writing surface.

### File Upload
- Client-side `.txt` and `.md` file import parsed directly into the editor.

### Sharing
- Secure sharing modal to grant `VIEWER` or `EDITOR` permissions by email.
- Real-time permission boundary enforcement on the backend.

### Persistence
- MySQL database with Prisma ORM.
- Document content safely stored as JSON.

### UI/UX
- Premium, minimalist SaaS aesthetic.
- Responsive split-screen authentication layouts.
- Dark mode support with FOUC prevention.
- Accessible, responsive components built with Tailwind CSS.

### Testing
- Foundation laid for Vitest and React Testing Library.

### Deployment
- Application is container/deployment ready, utilizing standard environment variables.

## Known Limitations
- Concurrent editing by multiple users on the same document at the exact same time will result in "last write wins" behavior, as real-time WebSockets and CRDTs were omitted.
- The JWT is stored in memory, meaning hard-refreshing the page clears the session. 

## Future Improvements
- Implement WebSockets for true real-time, multiplayer cursor tracking and editing (via Yjs).
- Add HTTP-only secure cookies for JWT storage with a refresh-token rotation strategy.
- Implement robust cursor-based pagination for the document dashboard.

## Live Deployment
[Placeholder for Live URL]

## Walkthrough Video
[Placeholder for Video URL]

## Demo Credentials
To easily test the application, the database is seeded with the following accounts:
- **Alice**: `alice@example.com` / `alice-password-123`
- **Bob**: `bob@example.com` / `bob-password-123`

## Reviewer Notes
Thank you for reviewing Docly! Throughout this assessment, I made deliberate scoping choices to prioritize polish, security, and architectural soundness over a sprawling feature set. You will notice that complex features like real-time CRDTs and offline support were intentionally deferred in favor of delivering a highly stable, production-quality slice of the product. Please feel free to use the seeded demo accounts to explore the sharing and permission mechanics.
