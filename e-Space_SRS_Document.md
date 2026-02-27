# Software Requirements Specification (SRS)

## Project Name: e-Space

### Version: 1.0

### Organization: E-Cell, Vishnu Institute of Technology

### Deployment: Vercel

------------------------------------------------------------------------

# 1. Introduction

## 1.1 Purpose

This document specifies the functional and non-functional requirements
for **e-Space**, a centralized digital workspace platform developed
under the E-Cell of Vishnu Institute of Technology.

The platform is designed to manage hackathon teams, innovation projects,
collaboration, file storage, GitHub integration, progress tracking, and
evaluation within the college ecosystem.

------------------------------------------------------------------------

## 1.2 Scope

e-Space will:

-   Provide secure login using college email domain only
-   Allow admin-controlled team creation
-   Enable structured project progress tracking
-   Provide centralized file storage
-   Integrate GitHub repository monitoring
-   Offer real-time team chat and meeting functionality
-   Provide an admin dashboard for evaluation and analytics

The system will initially serve internal college users only.

------------------------------------------------------------------------

# 2. System Features

## 2.1 Authentication System

-   Users must log in using `@vishnu.edu.in`
-   Domain validation must be enforced
-   Role-based access control (Admin / Leader / Member)
-   Unauthorized emails must be rejected

------------------------------------------------------------------------

## 2.2 Team Management (Admin Controlled)

-   Admin can create teams manually
-   Admin can:
    -   Add team name
    -   Add project title
    -   Add problem statement
    -   Assign team leader
    -   Add team members
-   Admin can edit or delete teams
-   Admin can view all teams in tabular format

------------------------------------------------------------------------

## 2.3 Team Dashboard

Each team dashboard must display:

-   Team Name
-   Project Title
-   Problem Statement
-   Member List
-   Overall Progress Percentage
-   Activity Log
-   Weekly Progress Graph
-   Custom Goal Tracker (Milestones)

Progress Calculation Example: - 40% Milestones completion - 30% File
uploads - 30% GitHub activity

------------------------------------------------------------------------

## 2.4 Workspace Module

### File Storage

-   Upload files (PDF, PPT, ZIP, Images, Documents)
-   Folder-based structure per team
-   Download files
-   Delete files (Leader only)
-   File size limit enforcement

### GitHub Integration

-   OAuth connection for Team Leader
-   Select repository
-   Display:
    -   Repository link
    -   Total commits
    -   Contributors
    -   Last commit date
-   No internal code hosting

------------------------------------------------------------------------

## 2.5 Meet Space

### Chat System

-   Real-time team chat
-   Persistent message storage
-   File attachments

### Audio Meeting

-   One-click meeting initiation
-   Integration via Jitsi iframe

------------------------------------------------------------------------

## 2.6 Admin Dashboard

Accessible using keyboard shortcut: **Ctrl + Q**

Admin can:

-   View all teams
-   View team details
-   View progress percentage
-   View activity logs
-   View GitHub statistics
-   Display leaderboard ranking
-   Input manual score
-   Add remarks

------------------------------------------------------------------------

# 3. Database Tables

-   users
-   teams
-   team_members
-   projects
-   milestones
-   files
-   github_links
-   activity_logs
-   scores

------------------------------------------------------------------------

# 4. Technology Stack

## Frontend

-   Vite + React
-   Tailwind CSS
-   React Router
-   Recharts

## Backend

Primary Backend: - Supabase (Auth + PostgreSQL + Storage + Realtime)

Optional Backend: - Minimal Node.js server (for GitHub OAuth proxy)

## Deployment

-   Frontend: Vercel
-   Backend Services: Supabase

------------------------------------------------------------------------

# 5. Non-Functional Requirements

-   Domain-restricted authentication
-   Role-based access control
-   Dashboard load time \< 3 seconds
-   Support minimum 100 concurrent users
-   Clean and responsive UI
-   Target uptime ≥ 99%

------------------------------------------------------------------------

# 6. Conclusion

e-Space is designed as an official innovation workspace under E-Cell,
Vishnu Institute of Technology.

The system centralizes project collaboration, progress monitoring,
evaluation, and communication into a structured and scalable digital
infrastructure built with startup-grade architecture.
