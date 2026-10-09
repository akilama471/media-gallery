# Project Transformation: Offline Bookmark Manager Desktop Application

## 1. Project Overview

Completely transform the existing project into a **modern, secure, offline-first Bookmark Manager Desktop Application**.

The application's primary purpose is to allow users to save, organize, search, preview, and manage website bookmarks efficiently from their local computer.

Do not simply add bookmark functionality to the existing application. Analyze the current project and transform its functionality, user interface, database, and business logic to match the new requirements while reusing suitable existing components and configurations where appropriate.

The application must run as a standalone desktop application using **Electron.js, React, Tailwind CSS v3, and SQLite**.

The application must work offline for all locally stored bookmark data and metadata. Internet access should only be required for retrieving website information, refreshing previews, or opening online websites.

---

## 2. Technology Stack

Use the following technologies:

* **Desktop Runtime:** Electron.js
* **Frontend:** React
* **Styling:** Tailwind CSS v3
* **Database:** SQLite
* **Language:** Follow the existing project's language and conventions. Prefer TypeScript if the project already uses it or can be migrated safely.
* **Desktop-to-Frontend Communication:** Secure Electron IPC
* **Local Asset Storage:** Local filesystem
* **Data Export/Import:** ZIP archives
* **Application Architecture:** Modular, maintainable, and strongly separated frontend, business logic, database, and filesystem operations.

Do not replace the existing technology stack unnecessarily. Preserve compatible dependencies and working configurations.

---

## 3. Core Bookmark Management

Users must be able to create and manage website bookmarks.

### Add Bookmark

Provide a simple and intuitive workflow for adding a bookmark using a website URL.

When a user enters a URL, the application should attempt to retrieve the following information:

* Website URL
* Page title
* Website description
* Website domain
* Website favicon
* Website preview image or Open Graph image
* Locally generated thumbnail when feasible
* Date and time created
* Date and time last updated

Automatically extract available metadata from the website when possible.

Users must be able to manually edit the title, description, URL, and other editable metadata if automatic extraction fails or returns incorrect information.

The application must validate URLs and handle invalid URLs, unreachable websites, missing metadata, timeouts, and network errors gracefully.

Do not prevent users from saving a valid bookmark simply because its website is offline or its metadata cannot be retrieved.

### Bookmark CRUD Operations

Users must be able to:

* Add bookmarks.
* View bookmark details.
* Edit existing bookmarks.
* Delete bookmarks.
* Copy bookmark URLs.
* Open bookmarks in the default browser.
* Open bookmarks in the application's configured browsing workflow, if supported.
* Mark bookmarks as favorites.
* Mark bookmarks as important.
* Add personal notes to bookmarks.
* View bookmark creation and update timestamps.
* Search, filter, and sort bookmarks.

Display confirmation dialogs for destructive actions where appropriate.

---

## 4. Local Image, Thumbnail, and Favicon Management

Implement a dedicated local asset management system.

### Image Preview Storage

Whenever possible, retrieve website preview images, Open Graph images, and other suitable preview assets.

Save retrieved images and generated thumbnails to the local filesystem rather than relying on remote image URLs for normal bookmark display.

Requirements:

* Download and store supported preview images locally.
* Generate appropriately sized thumbnails when feasible.
* Use reasonable image size limits and supported formats.
* Handle failed downloads, unsupported formats, missing images, and corrupted image files.
* Provide fallback placeholders when images are unavailable.
* Display locally cached images when the computer is offline.
* Avoid downloading the same asset repeatedly when a reusable local copy already exists.
* Keep asset references in SQLite and store actual image files in a dedicated application data directory.
* Implement asset cleanup when bookmarks are deleted, while preserving assets referenced by other bookmarks or collections.

### Shared Favicon Tracking

Implement a domain-based favicon caching system.

For example, if a user saves:

* `https://example.com/articles`
* `https://example.com/products`
* `https://example.com/contact`

The application should recognize that all three URLs belong to the same website domain and reuse the existing cached favicon whenever appropriate.

Requirements:

* Track website domains independently from individual bookmarks.
* Store domain information and favicon metadata in SQLite.
* Download each domain's favicon only when necessary.
* Reuse the cached favicon for bookmarks belonging to the same domain.
* Avoid duplicate favicon downloads and duplicate asset files.
* Support favicon refresh when requested or when the cached asset is missing or invalid.
* Display cached favicons in offline mode.
* Handle websites with multiple subdomains and different favicon configurations appropriately.

Use a normalized domain key and a consistent favicon resolution strategy. Do not assume every subdomain or domain uses the same favicon.

---

## 5. Automatic Domain Grouping

Automatically group bookmarks by their website domain.

For example:

* `github.com` → All saved GitHub bookmarks
* `youtube.com` → All saved YouTube bookmarks
* `stackoverflow.com` → All saved Stack Overflow bookmarks

Requirements:

* Extract and normalize domains from bookmark URLs.
* Automatically associate bookmarks with their corresponding domain records.
* Update domain associations when a bookmark URL changes.
* Maintain domain names, cached favicons, bookmark counts, and other relevant metadata.
* Provide a dedicated Domains or Websites section.
* Allow users to view all bookmarks belonging to a selected domain.
* Allow users to search domains by name.
* Allow users to filter bookmarks by domain.
* Handle subdomains consistently and provide a clear strategy for domain grouping.
* Avoid creating duplicate domain records for equivalent normalized domains.

Domain groups should be generated automatically and maintained as bookmarks are added, edited, or deleted.

---

## 6. Tags and Tag Management

Implement a flexible tagging system.

Users must be able to:

* Create tags.
* Rename tags.
* Delete tags.
* Assign multiple tags to a bookmark.
* Remove tags from bookmarks.
* Filter bookmarks by one or more tags.
* Search tags by name.
* View all bookmarks associated with a tag.
* Assign existing tags when creating or editing bookmarks.
* Create new tags directly from the bookmark form, where appropriate.

Requirements:

* Prevent duplicate tags according to a consistent case-insensitive naming policy.
* Use a many-to-many relationship between bookmarks and tags.
* Maintain referential integrity.
* Handle tag deletion safely.
* Ensure tag changes are reflected immediately throughout the interface.

---

## 7. Collections

Allow users to create custom collections for organizing bookmarks independently of their website domains.

Example collections:

* Development Resources
* Learning Materials
* Business Tools
* Design Inspiration
* Project References

Users must be able to:

* Create collections.
* Edit collection names and descriptions.
* Delete collections.
* Add existing bookmarks to collections.
* Remove bookmarks from collections without deleting the original bookmark.
* View all bookmarks in a collection.
* Search collections by name.
* Filter bookmarks by collection.
* Add a bookmark to multiple collections when appropriate.

Use a suitable relational database design to support flexible collection membership.

Deleting a collection must not automatically delete its bookmarks.

---

## 8. Search, Filtering, and Sorting

Implement a fast, comprehensive local search system.

Users should be able to search:

* Bookmark titles
* URLs
* Website domains
* Descriptions
* Tags
* Collection names
* Personal notes

Provide filters for:

* Favorites
* Important bookmarks
* Domains or websites
* Tags
* Collections
* Creation date
* Recently updated bookmarks

Support sorting by:

* Recently added
* Recently updated
* Alphabetical title
* Domain name
* Favorites
* Importance

Where appropriate, support combining multiple filters.

Search and filtering must operate on locally stored data and work without an internet connection.

Use SQLite indexes and, where appropriate, SQLite Full-Text Search (FTS5) to improve performance.

---

## 9. Offline-First Functionality

Offline operation is a core requirement, not an optional feature.

When the application is offline, users must still be able to:

* Launch the application.
* Unlock the application.
* Browse saved bookmarks.
* View locally stored titles, descriptions, domains, and notes.
* View cached thumbnails, preview images, and favicons.
* Search bookmarks.
* Search tags and collections.
* Create, edit, and delete bookmarks.
* Manage tags and collections.
* Change favorite and important statuses.
* Export and import local data.

Online-only operations, such as opening a website or retrieving updated website metadata, may require an internet connection.

Clearly distinguish between locally available information and information that needs to be fetched online.

Never make normal bookmark browsing dependent on a live website request.

---

## 10. Password Protection and Application Security

Protect the application with a local password-based unlock mechanism.

Requirements:

* Provide an initial password setup workflow.
* Require authentication when opening the application according to the configured lock policy.
* Provide a secure password verification mechanism.
* Never store plaintext passwords.
* Use a modern password hashing algorithm such as Argon2id or scrypt, with appropriate parameters and salts.
* Support changing the application password after successful authentication.
* Provide a secure lock or logout action.
* Avoid exposing password hashes, database internals, or filesystem paths unnecessarily to the renderer process.

Evaluate whether sensitive bookmark data should also be encrypted at rest. If implemented, use a suitable authenticated encryption mechanism and secure key management.

Do not hardcode encryption keys or passwords in source code.

### Electron Security Requirements

* Keep `nodeIntegration` disabled in renderer processes.
* Enable `contextIsolation`.
* Use a restricted preload script.
* Expose only explicitly authorized APIs through `contextBridge`.
* Validate IPC payloads in the main process.
* Keep database and filesystem access outside the React renderer.
* Restrict navigation and prevent unauthorized window creation.
* Apply an appropriate Content Security Policy.
* Prevent arbitrary renderer-controlled filesystem access.
* Avoid executing untrusted website content inside the privileged application window.
* Handle external URLs through validated and controlled navigation workflows.

Treat imported ZIP files, website metadata, URLs, and downloaded images as untrusted input.

---

## 11. ZIP Data Export and Import

Implement a complete backup and restore system.

### Export

Users must be able to export their bookmark data into a ZIP file.

The export should include:

* All bookmarks and their metadata
* Tags
* Bookmark-to-tag relationships
* Collections
* Bookmark-to-collection relationships
* Domain records and favicon references
* Local preview images
* Local thumbnails
* Cached favicons
* Relevant application metadata required for restoration

Use a documented and versioned backup format.

Requirements:

* Preserve relationships between records.
* Preserve asset references.
* Include a manifest containing the backup format version and relevant metadata.
* Ensure the export is internally consistent.
* Use safe relative asset paths within the archive.
* Inform the user when an export succeeds or fails.

### Import

Users must be able to import a previously exported ZIP backup.

Requirements:

* Validate the archive and manifest before importing.
* Verify the backup format version.
* Validate JSON or other metadata files against expected schemas.
* Reject path traversal attempts, unsafe archive paths, and malicious archive structures.
* Enforce reasonable archive size, entry count, and decompressed size limits.
* Prevent imported files from overwriting arbitrary files outside the application's data directory.
* Validate and sanitize imported records.
* Preserve bookmark, tag, collection, domain, and asset relationships.
* Detect duplicates and provide a clear conflict-resolution policy.
* Support merging imported data with existing data.
* Where appropriate, offer a replace/restore workflow with an explicit warning.
* Use database transactions to prevent partially imported database records.
* Clean up staged files if an import fails.
* Never delete existing user data before validating the replacement backup.

The import process should provide clear progress, success, and error feedback.

---

## 12. SQLite Database Architecture

Use SQLite as the primary database for all structured application data.

Store the database in Electron's application-specific user data directory, not inside the source code directory or the application's installation directory.

Design a normalized relational schema with appropriate foreign keys, unique constraints, and indexes.

Consider the following tables:

* `bookmarks`
* `domains`
* `tags`
* `bookmark_tags`
* `collections`
* `bookmark_collections`
* `application_settings`
* `schema_migrations`

Additional tables may be introduced when necessary.

The schema should support:

* Bookmark metadata
* Domain-based favicon reuse
* Local asset references
* Favorites and importance flags
* Personal notes
* Tag relationships
* Collection relationships
* Creation and update timestamps
* Future schema migrations

Requirements:

* Enable SQLite foreign key enforcement.
* Use parameterized queries or prepared statements.
* Use database transactions for multi-step operations.
* Create versioned database migrations.
* Avoid destructive schema changes without a migration strategy.
* Handle database initialization and migration failures safely.
* Implement a backup strategy that accounts for SQLite consistency.
* Keep binary image data in the filesystem unless there is a clear technical reason to store it in the database.

---

## 13. Application Architecture and Separation of Responsibilities

Maintain a strict separation between the React UI and backend application logic.

Do not implement database queries, filesystem operations, archive processing, password verification, or complex business rules directly inside React components.

Organize the application into clearly separated layers.

Suggested architecture:

### Electron Main Process

Responsible for:

* Application lifecycle
* Window management
* Database initialization
* SQLite access
* IPC handlers
* Password verification
* Filesystem operations
* Asset management
* Website metadata extraction
* ZIP export and import
* Security validation

### Preload Layer

Responsible for:

* Exposing a small, typed, allowlisted API
* Providing controlled communication between React and Electron
* Keeping privileged Node.js APIs inaccessible to the renderer

### React Renderer

Responsible for:

* User interface
* Navigation
* Forms and validation feedback
* Bookmark cards and lists
* Search and filtering controls
* Tags and collections UI
* Loading states
* Error messages
* Dialogs and notifications

### Business Logic Layer

Create independent modules or services for:

* BookmarkService
* DomainService
* TagService
* CollectionService
* SearchService
* MetadataService
* FaviconService
* AssetService
* PasswordService
* BackupService
* ImportService
* ExportService

### Database Layer

Responsible for:

* Database connection management
* Repositories or data-access objects
* SQL queries
* Transactions
* Schema migrations
* Referential integrity

### Shared Types and Validation

Maintain shared TypeScript types and validation schemas for IPC requests, responses, database entities, import manifests, and application settings.

Adjust the exact folder structure to match the existing project, but preserve the separation of responsibilities.

---

## 14. User Interface and User Experience

Build a clean, modern desktop application interface using React and Tailwind CSS v3.

The UI should feel like a polished desktop productivity application rather than a basic CRUD website.

### Suggested Main Layout

**Sidebar**

* All Bookmarks
* Favorites
* Important
* Recent
* Collections
* Tags
* Websites / Domains
* Settings

**Main Content Area**

* Search bar
* Filter and sort controls
* Bookmark grid/list toggle
* Bookmark cards
* Empty states
* Pagination or efficient incremental loading for large libraries

**Bookmark Card**

* Website favicon
* Preview thumbnail
* Bookmark title
* Domain name
* Short description
* Associated tags
* Favorite action
* Important action
* Quick edit and delete actions
* Open website action

**Bookmark Details View**

* Full title and URL
* Domain information
* Preview image
* Description
* Tags
* Collections
* Personal notes
* Creation and update timestamps
* Edit and delete actions

### Additional UX Requirements

* Provide a fast workflow for saving a new URL.
* Support keyboard shortcuts for common operations.
* Show loading states during metadata retrieval and image downloads.
* Provide clear error and success notifications.
* Design responsive layouts suitable for different desktop window sizes.
* Maintain consistent spacing, typography, icons, and colors.
* Ensure accessible labels, keyboard navigation, and visible focus states.
* Provide sensible empty states and fallback images.
* Support light and dark themes if practical.
* Keep the interface responsive when managing thousands of bookmarks.

Use Tailwind CSS v3-compatible syntax and configuration. Do not accidentally migrate the project to Tailwind CSS v4.

---

## 15. Reliability and Performance

The application should remain responsive when managing a large bookmark library.

Requirements:

* Use asynchronous operations where appropriate.
* Avoid blocking the Electron main process with long-running work.
* Use efficient SQLite queries and indexes.
* Debounce search input where appropriate.
* Avoid unnecessary React re-renders.
* Prevent duplicate concurrent favicon and image downloads.
* Use request timeouts and retry policies for transient network failures.
* Limit image dimensions, file sizes, and network resource consumption.
* Cancel obsolete metadata requests when appropriate.
* Handle missing or deleted local assets gracefully.
* Recover safely from interrupted imports and failed exports.
* Prevent race conditions during concurrent database and asset operations.

Do not sacrifice security or data integrity for performance.

---

## 16. Error Handling and Logging

Implement centralized error handling.

Handle errors involving:

* SQLite initialization and queries
* Database migrations
* Invalid URLs
* Network timeouts
* Metadata extraction
* Image downloads
* Favicon resolution
* Missing local files
* ZIP creation
* ZIP extraction
* Invalid imports
* Password verification
* IPC communication

Provide understandable messages to users while recording useful diagnostic information in local logs.

Never log plaintext passwords, sensitive credentials, or unnecessary private data.

---

## 17. Testing Requirements

Implement tests for the critical application functionality.

Include tests for:

* Bookmark creation, editing, and deletion
* Domain normalization and grouping
* Shared favicon caching
* Tag creation and assignment
* Collection membership
* Search and filtering
* Offline bookmark browsing
* Password verification
* Database migrations
* ZIP export and import
* Duplicate detection
* Malformed archives and path traversal
* IPC authorization and payload validation
* Missing or corrupted local assets

Test both successful operations and failure scenarios.

Verify that the application can be launched and used without an internet connection after its initial setup.

---

## 18. Development Workflow

Before making changes:

1. Inspect the existing repository and understand its current architecture.
2. Identify the current framework versions, dependencies, scripts, and entry points.
3. Identify reusable components and obsolete functionality.
4. Review existing database implementations and Electron security settings.
5. Create a migration plan for the transformation.

Then proceed with implementation:

1. Establish the application architecture and shared types.
2. Implement the SQLite schema and migrations.
3. Implement secure IPC and the preload API.
4. Implement core business services.
5. Implement bookmark management.
6. Implement domain grouping and favicon caching.
7. Implement local image and thumbnail storage.
8. Implement tags, collections, and search.
9. Implement password protection.
10. Implement ZIP export and import.
11. Build and refine the React UI.
12. Add tests and fix discovered issues.
13. Verify development and production builds.

Work directly in the existing project. Do not merely provide example code, pseudocode, or a proposed architecture when implementation is expected.

Do not delete existing files or dependencies without understanding their purpose. Make changes incrementally and keep the application in a buildable state.

---

## 19. Definition of Done

The transformation is complete only when:

* The project runs as a standalone Electron desktop application.
* React and Tailwind CSS v3 are correctly configured.
* SQLite stores all structured bookmark data locally.
* Users can create, view, edit, and delete bookmarks.
* Website metadata and previews are cached locally whenever available.
* Favicons are tracked by domain and reused across bookmarks.
* Saved bookmark details remain accessible offline.
* Tags and collections work correctly.
* Automatic domain grouping works correctly.
* Search and filtering operate on local data.
* Favorites and important bookmarks work correctly.
* Password protection is implemented securely.
* ZIP export and import preserve records, relationships, and local assets.
* Import validation prevents malicious archives from compromising local files.
* The renderer cannot directly access privileged Node.js or filesystem APIs.
* Database migrations and error handling are implemented.
* Critical features have appropriate automated tests.
* Development and production builds complete successfully.
* No critical errors or security issues remain unresolved.

---

## 20. Mandatory Coding Standards and Architecture Rules

These rules are mandatory for all new code and modifications to existing code. Apply them consistently throughout the project.

### 20.1. Keep the UI Simple and Modular

* Never create unnecessarily large, complex, or monolithic UI components.
* Follow a **small, modular, reusable component** approach.
* Break complex pages into smaller components based on their responsibilities.
* Keep page components focused on composition and coordination rather than implementing all UI logic themselves.
* Extract repeated UI patterns into reusable components.
* Avoid deeply nested JSX and unnecessarily complicated conditional rendering.
* Keep components readable, maintainable, and easy to test.
* Do not over-engineer simple UI requirements.

### 20.2. Reusable UI Components

Whenever possible, create and reuse common UI components instead of duplicating markup and styling.

Examples include:

* Buttons and icon buttons
* Input fields and text areas
* Selects and dropdowns
* Modal dialogs and confirmation dialogs
* Tables and pagination controls
* Search bars and filter controls
* Bookmark cards
* Empty states and loading indicators
* Error messages and notification components
* Page headers and section headers
* Reusable form components

Requirements:

* Maintain a consistent design system using React and Tailwind CSS v3.
* Keep reusable components configurable through well-defined props.
* Use composition when components need flexible layouts.
* Avoid creating abstractions for components that are genuinely unique and unlikely to be reused.
* Do not duplicate components that already exist in the project. Inspect the existing component library before creating new ones.

### 20.3. Reusable Custom Hooks

Extract reusable stateful logic and complex React behavior into custom hooks whenever appropriate.

Examples include:

* `useBookmarks`
* `useBookmarkSearch`
* `useTags`
* `useCollections`
* `useDomains`
* `useFavorites`
* `useDialog`
* `useDebounce`
* `usePagination`
* `useAsyncOperation`

Requirements:

* Custom hooks must follow React's Rules of Hooks.
* Keep hooks focused on a clearly defined responsibility.
* Reuse hooks when the same stateful behavior or logic is needed in multiple components.
* Avoid duplicating complex state management and side-effect logic across components.
* Keep Electron IPC communication behind an appropriate service or API abstraction rather than scattering raw IPC calls throughout the UI.
* Do not create custom hooks unnecessarily for trivial logic that is clearer inside a component.

### 20.4. Strict Single Responsibility Principle (SRP)

Every component, hook, function, class, controller, service, model, and module must have a clearly defined responsibility.

**Never create GOD Functions, GOD Components, GOD Classes, or GOD Modules.**

Avoid functions or classes that handle multiple unrelated responsibilities, become excessively long, or are difficult to understand, test, and maintain.

For example, a single function must not simultaneously:

* Validate user input.
* Execute database queries.
* Download website metadata.
* Process and save images.
* Update multiple database tables.
* Generate ZIP archives.
* Display UI notifications.

Instead, divide these operations into focused functions or delegate them to appropriate modules.

Requirements:

* Keep functions short and focused on one logical task.
* Extract complex conditional logic into named helper functions when this improves readability.
* Separate input validation, business rules, persistence, filesystem operations, and presentation.
* Avoid excessive nesting and deeply coupled dependencies.
* Use dependency injection or explicit dependencies where appropriate.
* Make functions and modules easy to test independently.
* Do not split code into meaningless one-line functions merely to satisfy a size limit.

Prioritize clear responsibilities and maintainability over arbitrary function-length limits.

### 20.5. Electron Backend File Naming Conventions

Whenever practical, organize Electron backend code using the following naming conventions:

* `[name].controller.ts`
* `[name].service.ts`
* `[name].model.ts`

Each file must have a clearly defined role.

#### Controller — `[name].controller.ts`

Responsible for handling application-level requests and coordinating operations.

Examples:

* `bookmark.controller.ts`
* `tag.controller.ts`
* `collection.controller.ts`
* `backup.controller.ts`

Responsibilities:

* Receive validated requests from IPC handlers.
* Coordinate the appropriate service operations.
* Return consistent results.
* Translate expected application errors into appropriate responses.

Controllers must not contain large amounts of business logic or directly implement complex SQL queries.

#### Service — `[name].service.ts`

Responsible for business logic and application operations.

Examples:

* `bookmark.service.ts`
* `domain.service.ts`
* `favicon.service.ts`
* `metadata.service.ts`
* `collection.service.ts`
* `backup.service.ts`

Responsibilities:

* Implement business rules.
* Coordinate repositories, models, and other services.
* Validate business-level constraints.
* Manage multi-step operations and transactions through appropriate data-access abstractions.
* Handle domain-specific errors.

Services must not contain React UI code or depend on renderer-specific functionality.

#### Model — `[name].model.ts`

Responsible for representing and accessing the corresponding database entity, where this convention fits the project's database architecture.

Examples:

* `bookmark.model.ts`
* `domain.model.ts`
* `tag.model.ts`
* `collection.model.ts`

Responsibilities may include:

* Defining entity types and database-related structures.
* Providing focused database operations for the corresponding entity.
* Encapsulating SQL queries or delegating them to a repository.
* Maintaining consistency with the SQLite schema.

Do not confuse a database model with a TypeScript interface or type definition. Keep shared entity types in appropriately named type files when needed.

Avoid placing unrelated business logic, filesystem operations, UI logic, or ZIP processing inside database model files.

### 20.6. IPC and Layer Separation

Maintain a clear separation between Electron's main process, preload script, React renderer, business services, and database access.

Use the following request flow whenever appropriate:

`React Component → Custom Hook → Frontend API/Service → Preload API → IPC Handler/Controller → Backend Service → Model/Repository → SQLite`

Requirements:

* React components must not execute SQL queries.
* React components must not access Node.js filesystem APIs directly.
* Renderer code must not import privileged Electron backend modules.
* Expose only explicitly authorized operations through `contextBridge`.
* Validate IPC inputs at the backend boundary.
* Do not expose unrestricted filesystem, database, or shell access through IPC.
* Keep backend services independent of React components.
* Avoid circular dependencies between controllers, services, models, and shared types.
* Use shared TypeScript types and consistent response structures where appropriate.

Adapt the flow when a simpler implementation is more suitable, but never compromise Electron's security boundaries.

### 20.7. Folder Structure and Code Organization

Organize code by feature and responsibility rather than accumulating unrelated functionality in large files.

A suggested structure is:

```text
src/
├── components/
│   ├── ui/
│   ├── bookmarks/
│   ├── tags/
│   └── collections/
├── hooks/
├── pages/
├── services/
├── types/
├── utils/
└── styles/

electron/
├── controllers/
│   ├── bookmark.controller.ts
│   ├── tag.controller.ts
│   └── collection.controller.ts
├── services/
│   ├── bookmark.service.ts
│   ├── domain.service.ts
│   └── backup.service.ts
├── models/
│   ├── bookmark.model.ts
│   ├── tag.model.ts
│   └── collection.model.ts
├── database/
├── ipc/
├── preload.ts
└── main.ts
```

This is a guideline, not a requirement to reproduce the exact structure. Follow the existing project's architecture when it is already well organized, and avoid unnecessary file movements.

### 20.8. Code Reuse and Duplication Prevention

Before implementing new functionality:

1. Inspect existing components, hooks, services, models, and utilities.
2. Identify reusable functionality that already exists.
3. Extend existing abstractions when doing so preserves their responsibilities.
4. Create new abstractions only when they provide meaningful reuse or separation.
5. Avoid duplicating validation rules, SQL queries, IPC contracts, and business logic.

Maintain a single authoritative implementation for shared business rules whenever practical.

### 20.9. TypeScript and Error Handling

* Prefer explicit types for public interfaces and IPC contracts.
* Avoid `any` unless there is a documented, justified reason.
* Use appropriate types for success and failure responses.
* Handle expected errors at the correct application boundary.
* Do not silently swallow errors.
* Avoid duplicating error-handling logic across multiple components.
* Keep error messages useful without exposing internal implementation details.
* Use consistent naming conventions and formatting throughout the codebase.

### 20.10. Mandatory Pre-Implementation Checklist

Before implementing a new feature or refactoring existing code, verify the following:

* [ ] Can this UI be divided into small, reusable components?
* [ ] Does an appropriate component already exist?
* [ ] Can repeated stateful behavior be extracted into a custom hook?
* [ ] Does each function, class, and module have one clear responsibility?
* [ ] Is any function or component becoming a GOD Function or GOD Component?
* [ ] Are controllers, services, and models separated appropriately?
* [ ] Are SQL queries and filesystem operations kept out of React components?
* [ ] Are Electron IPC boundaries secure and properly validated?
* [ ] Is duplicated business logic being avoided?
* [ ] Can the new code be tested independently?
* [ ] Is the solution simpler than unnecessary alternative abstractions?

### Final Enforcement Rule

Treat these coding standards as mandatory project-level instructions, not optional suggestions.

Whenever new code violates these rules, refactor it before considering the feature complete. When modifying existing code, improve its structure where practical without introducing unnecessary large-scale rewrites.

Always prioritize **simplicity, reusability, separation of concerns, SRP, security, testability, and maintainability** over writing large amounts of code in a single file.

---

## 21. Security Requirements and Rules

### 21.1. Backend and IPC Security

* Never trust user input in IPC requests. Always validate, sanitize, and type-check all data received from the renderer.
* Do not expose raw filesystem, shell, or database APIs through IPC. Wrap all privileged operations in controlled, type-safe interfaces.
* Enforce strict separation between renderer and main processes. Renderer code must not import or execute privileged Node.js modules.
* Enforce proper session, authentication, and authorization flows. Never skip authentication or rely solely on frontend flags to protect sensitive operations.

### 21.2. Password Protection and Database Security

* When using password protection, encrypt sensitive operations such as backup exports and database migrations using strong cryptography (e.g., AES-256-GCM). Avoid reversible or weak encryption.
* Implement password-based key derivation functions (e.g., PBKDF2 or Argon2) with a sufficient work factor (iterations) to protect against brute-force attacks.
* Never store passwords or secrets in plaintext in code, configuration files, or the database. Use secure secret management practices.
* Provide proper rate limiting and account lockout mechanisms to prevent brute-force password attempts.
* Implement proper session management with short timeouts and secure session tokens.

### 21.3. Frontend and Rendering Security

* Strictly follow the [Electron Security Guidelines](https://www.electronjs.org/docs/latest/tutorial/security).
* Disable Node.js integration in the renderer where possible. Use `contextBridge` to expose only necessary, explicitly authorized APIs to the renderer.
* Do not execute unsanitized user input in the renderer. Avoid `dangerouslySetInnerHTML`, inline event handlers, or dynamic code execution where input is untrusted.
* Prevent XSS attacks by sanitizing all user-provided text and metadata before rendering.
* Ensure all third-party scripts, libraries, and UI components are from trusted sources and kept up to date.

### 21.4. Data Validation and Integrity

* Validate all user inputs, database mutations, and file operations. Reject or sanitize invalid, unexpected, or potentially malicious input.
* Never perform absolute filesystem operations based on user-provided paths. Use relative paths, whitelists, and canonicalization to prevent path traversal attacks.
* Implement robust error handling that prevents data corruption, incomplete operations, or race conditions, especially during critical operations like database mutations or ZIP operations.
* Use digital signatures or checksums where appropriate to verify the integrity of important data, such as ZIP backups.

### 21.5. ZIP Import and Export Security

* Validate that imported ZIP files do not contain malicious structures, such as path traversal entries (`../../`), device files, symlinks, or nested archives that could overwrite critical application files.
* Strip malicious or unstable content before extracting archives.
* Scan and validate ZIP members to prevent exploiting vulnerable ZIP parsers.
* Ensure proper permission handling so that imported content does not overwrite protected application files or system assets.

### 21.6. Hardening Best Practices

* Disable `nodeIntegration` in the Electron renderer window configuration where possible. Use `contextIsolation` to enforce proper security boundaries.
* Implement fine-grained permissions when exposing APIs to the renderer. Do not provide blanket access to powerful backend functionality.
* Minimize the application’s attack surface by disabling unnecessary Electron features and hardening security configurations.
* Keep dependencies and Electron versions up to date to avoid known security vulnerabilities.
* Store secrets and sensitive configuration in environment variables, secure vaults, or encrypted files, never hardcode them in the source code.

---

## 22. Mandatory Git Commit Rules

Every successful file change must be committed to Git with a relevant, descriptive commit message.

### Requirements

* After successfully completing a file modification, addition, deletion, or refactoring, create a Git commit that includes the relevant changes.
* Use clear, meaningful commit messages that accurately describe the changes.
* Follow the Conventional Commits format whenever appropriate.

**Commit message format:**

`<type>(<scope>): <description>`

Examples:

* `feat(bookmarks): add bookmark creation functionality`
* `feat(favicon): implement domain-based favicon caching`
* `fix(database): resolve bookmark migration issue`
* `refactor(components): extract reusable bookmark card`
* `refactor(services): separate bookmark business logic`
* `fix(security): validate IPC request payloads`
* `test(backup): add ZIP import validation tests`
* `docs(project): update architecture documentation`
* `style(ui): improve bookmark grid spacing`

### Commit Workflow

1. Make the required code changes.
2. Review the modified files and ensure the changes are relevant to the intended task.
3. Run the appropriate tests, lint checks, type checks, or build commands when available.
4. Review the Git diff to ensure no unintended changes, secrets, credentials, generated files, or unrelated user modifications are included.
5. Stage only the files relevant to the completed change.
6. Create a Git commit with an appropriate commit message.
7. Verify that the commit was created successfully.

### Important Rules

* **Never leave successfully completed code changes uncommitted.**
* Create separate commits for logically independent changes whenever practical.
* Do not combine unrelated features, bug fixes, refactoring, and documentation changes into a single commit unnecessarily.
* Never use vague messages such as `update`, `changes`, `fix`, or `working`.
* Never stage or commit unrelated changes made by the user.
* Never include secrets, passwords, API keys, or sensitive configuration values in commits.
* Do not bypass failing tests or claim that validation passed when it did not.
* If validation fails, report the failure accurately and fix it when possible before committing.
* If a change cannot be completed successfully, do not create a commit that falsely represents it as completed.
* If Git is unavailable, the repository is not initialized, or a commit cannot be created, explain the issue instead of claiming the change was committed.
* Never rewrite shared Git history, force-push, or amend existing commits without explicit authorization.

### Final Enforcement Rule

After each successfully completed and verified unit of work, create a corresponding Git commit before moving to the next independent task. At the end of each task, report the commit hash, commit message, validation results, and any remaining uncommitted changes.

**This rule is mandatory for all project development activities, including new features, bug fixes, refactoring, tests, configuration changes, and documentation updates.**

## Final Instruction

Start by analyzing the existing project before modifying it.

Use the requirements above as the source of truth. Make sensible technical decisions where implementation details are unspecified, document important decisions, and prioritize security, offline reliability, data integrity, maintainability, and a polished user experience.

Implement the application as a complete, production-oriented desktop bookmark manager rather than a simple prototype.
