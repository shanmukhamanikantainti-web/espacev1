# PROJECT PROPOSAL

## e-Space -- Official Innovation Workspace Platform

### Proposed by: E-Cell, Vishnu Institute of Technology

### Project Lead: E-Cell President

------------------------------------------------------------------------

# 1. Executive Summary

e-Space is a centralized digital innovation workspace proposed under the
Entrepreneurship Cell (E-Cell) of Vishnu Institute of Technology.

The platform aims to formalize and digitize the way hackathon teams,
project groups, and innovation initiatives are managed within the
institution.

Currently, project tracking, collaboration, documentation, and
evaluation occur through fragmented systems such as messaging apps and
shared drives. e-Space introduces a structured, secure, and
institutionally controlled digital environment for project management,
collaboration, progress monitoring, and evaluation.

The platform will initially serve internal college teams and will be
scalable for future institutional expansion.

------------------------------------------------------------------------

# 2. Background & Need for the Project

At present:

-   Project discussions happen in informal chat groups.
-   Files are stored in scattered cloud drives.
-   No standardized method exists to track progress.
-   Hackathon evaluation lacks structured progress analytics.
-   Documentation culture is weak due to decentralized storage.

This creates:

-   Inefficient communication
-   Loss of project data
-   Limited accountability
-   Difficulty in fair evaluation
-   No historical archive of innovation work

There is a clear institutional need for a centralized innovation
tracking system.

------------------------------------------------------------------------

# 3. Problem Statement

Vishnu Institute of Technology lacks a unified, structured digital
platform for managing hackathon teams, innovation projects,
documentation, collaboration, and evaluation under E-Cell supervision.

------------------------------------------------------------------------

# 4. Proposed Solution

e-Space will function as the official digital innovation workspace under
E-Cell.

The system will provide:

-   Domain-restricted login using `@vishnu.edu.in`
-   Admin-controlled team registration
-   Structured team dashboards
-   Goal tracking and milestone management
-   Real-time progress analytics
-   Secure file storage per team
-   GitHub repository integration
-   Real-time team communication (chat + audio meet)
-   Admin evaluation dashboard with scoring system

This ensures complete visibility, structured development, and
transparent evaluation.

------------------------------------------------------------------------

# 5. Objectives

1.  Establish a centralized project management system.
2.  Improve collaboration efficiency among student teams.
3.  Enable measurable progress tracking.
4.  Provide structured evaluation infrastructure for hackathons.
5.  Improve documentation culture within the institution.
6.  Build scalable digital infrastructure under E-Cell leadership.

------------------------------------------------------------------------

# 6. System Overview

## 6.1 Authentication Module

-   Login restricted to `@vishnu.edu.in`
-   Role-based access control:
    -   Admin
    -   Team Leader
    -   Team Member

------------------------------------------------------------------------

## 6.2 Team Dashboard

Each team dashboard will display:

-   Team name
-   Project title
-   Problem statement
-   Team members
-   Goal tracker (milestones)
-   Progress percentage
-   Weekly progress graph
-   Activity log

Progress will be calculated using weighted metrics such as:

-   Milestone completion
-   File uploads
-   GitHub activity

------------------------------------------------------------------------

## 6.3 Workspace Module

### File Storage

-   Team-specific storage folders
-   Upload/download functionality
-   File size limit control
-   Activity logging

### GitHub Integration

-   OAuth-based connection
-   Repository selection
-   Display of:
    -   Commit count
    -   Contributors
    -   Last commit date

No internal code hosting will be performed.

------------------------------------------------------------------------

## 6.4 Meet Space

### Chat

-   Real-time team chat
-   Message persistence
-   File sharing

### Audio Meeting

-   One-click meeting creation
-   Integration using lightweight meeting service

------------------------------------------------------------------------

## 6.5 Admin Dashboard

Accessible via shortcut (Ctrl + Q)

Admin capabilities:

-   View all teams
-   Monitor progress percentages
-   Compare teams via analytics graphs
-   View GitHub metrics
-   Input manual evaluation scores
-   Add remarks
-   Generate structured evaluation records

This dashboard will serve as official hackathon judging infrastructure.

------------------------------------------------------------------------

# 7. Technology Stack

## Frontend

-   Vite + React
-   Tailwind CSS
-   React Router
-   Recharts

## Backend

-   Supabase
    -   Authentication
    -   PostgreSQL Database
    -   Storage
    -   Realtime Services

## Optional Backend Layer

-   Minimal Node.js server (for GitHub OAuth proxy if required)

## Deployment

-   Frontend: Vercel
-   Backend Services: Supabase

------------------------------------------------------------------------

# 8. Implementation Plan

The system will be developed in a single structured execution phase
including:

1.  Authentication setup
2.  Team creation module
3.  Dashboard implementation
4.  File storage integration
5.  GitHub API integration
6.  Chat system integration
7.  Admin analytics and evaluation dashboard

Estimated timeline: 4--6 weeks.

------------------------------------------------------------------------

# 9. Expected Impact

The implementation of e-Space will:

-   Improve project transparency
-   Strengthen accountability among teams
-   Enable data-driven evaluation
-   Increase documentation quality
-   Establish E-Cell as a digitally empowered innovation body
-   Create scalable infrastructure for inter-college expansion

------------------------------------------------------------------------

# 10. Future Scope

-   Multi-college deployment
-   Faculty monitoring dashboard
-   Automated scoring engine
-   Storage upgrade models
-   Institutional-level SaaS expansion

------------------------------------------------------------------------

# 11. Conclusion

e-Space is designed to serve as the official innovation workspace under
E-Cell, Vishnu Institute of Technology.

The platform aims to transform the current unstructured collaboration
ecosystem into a centralized, scalable, and institutionally governed
digital infrastructure.

This initiative represents a strategic step toward structured innovation
management and digital transformation within the institution.
