# SYSTEM SPECIFICATIONS DOCUMENT

## Project: e-Space

### Organization: E-Cell, Vishnu Institute of Technology

### Version: 1.0

------------------------------------------------------------------------

# 1. System Overview

e-Space is a web-based innovation workspace platform developed under
E-Cell to manage hackathon teams, project collaboration, documentation,
GitHub integration, communication, and evaluation.

The system is designed for internal institutional usage with
domain-restricted authentication.

------------------------------------------------------------------------

# 2. System Architecture

## 2.1 Architecture Type

-   Client-Server Architecture
-   Cloud-based Backend Services
-   Modular Component Design

### Architecture Flow

User Browser\
→ React Frontend (Vite)\
→ Supabase (Auth + Database + Storage + Realtime)\
→ Optional Node.js Server (GitHub OAuth Proxy)

------------------------------------------------------------------------

# 3. Hardware Requirements

## 3.1 Server Side

-   Cloud-hosted infrastructure (Supabase + Vercel)
-   No dedicated physical server required
-   Internet connectivity required

## 3.2 Client Side

Minimum Requirements:

-   Desktop / Laptop / Mobile device
-   Minimum 4GB RAM
-   Latest version of Chrome, Edge, or Firefox
-   Stable Internet connection

------------------------------------------------------------------------

# 4. Software Requirements

## 4.1 Development Environment

-   Node.js (LTS Version)
-   npm or yarn
-   Git
-   VS Code or equivalent IDE

------------------------------------------------------------------------

## 4.2 Frontend Stack

-   Vite
-   React
-   Tailwind CSS
-   React Router
-   Recharts (Analytics Visualization)

------------------------------------------------------------------------

## 4.3 Backend Stack

Primary Backend:

-   Supabase
    -   Authentication
    -   PostgreSQL Database
    -   Storage Buckets
    -   Realtime Services

Optional Backend:

-   Node.js (Express)
    -   GitHub OAuth handling
    -   Secure token exchange

------------------------------------------------------------------------

## 4.4 External Integrations

-   GitHub API (Repository metadata)
-   Jitsi (Audio meeting integration)

------------------------------------------------------------------------

# 5. Database Specifications

Database Type: PostgreSQL (Supabase managed)

## Tables

### users

-   id (UUID, Primary Key)
-   name (Text)
-   email (Text, Unique)
-   role (Enum: Admin, Leader, Member)
-   created_at (Timestamp)

### teams

-   id (UUID)
-   team_name (Text)
-   leader_id (Foreign Key → users.id)
-   created_at (Timestamp)

### team_members

-   id (UUID)
-   team_id (Foreign Key → teams.id)
-   user_id (Foreign Key → users.id)

### projects

-   id (UUID)
-   team_id (Foreign Key)
-   project_title (Text)
-   problem_statement (Text)
-   status (Text)

### milestones

-   id (UUID)
-   project_id (Foreign Key)
-   title (Text)
-   description (Text)
-   status (Boolean)
-   due_date (Date)

### files

-   id (UUID)
-   team_id (Foreign Key)
-   file_name (Text)
-   file_url (Text)
-   uploaded_by (Foreign Key → users.id)
-   uploaded_at (Timestamp)

### github_links

-   id (UUID)
-   team_id (Foreign Key)
-   repo_url (Text)
-   commit_count (Integer)
-   last_commit_date (Timestamp)

### activity_logs

-   id (UUID)
-   team_id (Foreign Key)
-   activity_type (Text)
-   user_id (Foreign Key)
-   timestamp (Timestamp)

### scores

-   id (UUID)
-   team_id (Foreign Key)
-   progress_score (Float)
-   admin_score (Float)
-   remarks (Text)

------------------------------------------------------------------------

# 6. Functional Specifications

## 6.1 Authentication

-   Only `@vishnu.edu.in` emails permitted
-   Role-based routing
-   Secure session handling

------------------------------------------------------------------------

## 6.2 Team Dashboard

-   Displays project information
-   Progress calculation logic
-   Recharts-based graph visualization
-   Milestone CRUD operations

------------------------------------------------------------------------

## 6.3 File Storage

-   Supabase storage buckets
-   Folder segregation per team
-   Size validation
-   Upload and delete permissions

------------------------------------------------------------------------

## 6.4 GitHub Integration

-   OAuth authentication
-   Fetch repository metadata
-   Display commit analytics
-   Store repository link in database

------------------------------------------------------------------------

## 6.5 Chat & Meet

Chat:

-   Supabase Realtime channels
-   Persistent message storage

Audio Meet:

-   Jitsi iframe integration

------------------------------------------------------------------------

## 6.6 Admin Dashboard

-   Keyboard shortcut (Ctrl + Q)
-   View all teams
-   View progress graphs
-   Compare analytics
-   Manual score entry
-   Activity audit trail

------------------------------------------------------------------------

# 7. Non-Functional Specifications

## 7.1 Security

-   Domain-restricted login
-   Role-based authorization
-   Secure OAuth token handling
-   Encrypted database connections

------------------------------------------------------------------------

## 7.2 Performance

-   Dashboard load time \< 3 seconds
-   Chat latency \< 2 seconds
-   Support minimum 100 concurrent users

------------------------------------------------------------------------

## 7.3 Scalability

-   Modular component-based frontend
-   Cloud-managed database
-   Expandable to multi-college deployment

------------------------------------------------------------------------

## 7.4 Reliability

-   Target uptime ≥ 99%
-   Automated backups via Supabase

------------------------------------------------------------------------

# 8. Deployment Specifications

Frontend:

-   Hosted on Vercel
-   Continuous deployment via GitHub

Backend:

-   Supabase cloud services
-   Environment variable management

------------------------------------------------------------------------

# 9. Security Considerations

-   Strict email domain validation
-   Secure API key storage
-   No internal source code hosting
-   GitHub OAuth token protection
-   Admin-only access to scoring

------------------------------------------------------------------------

# 10. Future Upgrade Compatibility

The system design supports:

-   Faculty dashboard integration
-   Multi-institution deployment
-   Storage tier upgrades
-   Advanced analytics
-   Automated scoring engine

------------------------------------------------------------------------

# End of Document
