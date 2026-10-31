# Taskpilot Labs

> AI-powered project management for software development teams

Taskpilot Labs is an intelligent project management platform that streamlines the entire software development lifecycle—from initial client requirements to task completion. Leveraging AI to generate detailed specifications, task breakdowns, and project insights, it empowers teams to work smarter and faster.

## 🚀 Features

### For Project Managers & CTOs

- **AI-Enhanced Requirement Processing**: Enter basic project requirements and let AI transform them into comprehensive, production-ready specifications
- **Intelligent Feature Identification**: Automatically extract and identify key features from project descriptions with AI assistance
- **Automated SRS Generation**: Generate complete Software Requirement Specifications with visual diagrams including:
  - System architecture diagrams
  - Workflow diagrams
  - Detailed functional and non-functional requirements
- **Team Assignment**: Seamlessly add and assign team members to projects
- **Project Overview Dashboard**: Get a complete summary before finalizing project creation
- **Advanced Analytics**:
  - Employee work tracking and performance metrics
  - Performance report generation
  - Interactive Gantt charts for timeline visualization
  - Comprehensive event logs and project history
- **AI Research Assistant**: Get instant answers from the internet about technologies, best practices, and solutions

### For Developers & Team Members

- **Jira-like Kanban Board**: Intuitive drag-and-drop interface for task management
- **Task Status Management**: Move tasks through workflow stages (To Do → In Progress → Done)
- **Personal Dashboard**: View all assigned tasks and project details
- **Collaborative Comments**: Add comments and updates to tasks
- **Real-time Updates**: Stay synchronized with team progress

## 📋 Project Creation Workflow

1. **Initial Input**: Enter basic project details and client requirements
2. **AI Enhancement**: System generates an enhanced, detailed project prompt
3. **Feature Identification**: AI identifies key features; review and edit as needed
4. **SRS Generation**: Complete Software Requirement Specification created with diagrams
5. **Team Assembly**: Add team members to the project
6. **Project Summary**: Review complete project overview
7. **Finalization**: Confirm and create project with auto-assigned tasks

## 🛠️ Tech Stack

- **Runtime & Package Manager**: Bun
- **Backend**: Express.js, TypeScript, Prisma ORM, PostgreSQL
- **Frontend**: Next.js 16 (App Router), React 18, TailwindCSS
- **Authentication**: Better Auth (In-house secure credentials with sessions & HTTP-only cookies)
- **AI Integration**: Google Gemini API
- **Search Integration**: SearXNG
- **Validation**: Zod

## 🔧 Quickstart (Zero-Setup)

### Prerequisites

- Docker and Docker Compose installed on your system
- (Optional for host development) [Bun](https://bun.sh/) (v1.3+)

### Running with Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd source-code
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Launch the entire stack**
   ```bash
   docker compose up --build
   ```

4. **Access the application**
   - **Frontend App**: [http://localhost:3000](http://localhost:3000)
   - **Nexus Workspace**: [http://localhost:3001](http://localhost:3001)
   - **Backend API**: [http://localhost:8000](http://localhost:8000)

## 📡 API Documentation

The API is built using Express.js and TypeScript. All routes are relative to the base URL: `http://localhost:8000/api/v1`

### Key Endpoints

- **Authentication**: `/api/auth/*` (Better Auth handlers: `/sign-up/email`, `/sign-in/email`, `/get-session`, `/sign-out`)
- **Projects**: `/api/v1/projects` (CRUD operations, AI generation)
- **Tasks**: `/api/v1/tasks` (CRUD operations)
- **Employees**: `/api/v1/employees` (Management and assignments)
- **Documents**: `/api/v1/documents` (SRS and documentation)
- **Research**: `/api/v1/research` (AI-powered internet research)

## 🔐 Authentication

- Secure, in-house credentials authentication powered by **Better Auth**
- Scrypt password hashing
- Session tokens with HTTP-only, SameSite cookies
- Automatic database sync between Better Auth users and TaskPilot Admin records

## 🤖 AI Features

- **Smart Prompt Enhancement**: Transforms basic requirements into detailed specifications
- **Feature Extraction**: Identifies key features from project descriptions
- **SRS Generation**: Creates comprehensive Software Requirement Specifications
- **Task Generation**: Automatically breaks down projects into actionable tasks
- **Research Assistant**: Answers technical questions using internet search

## 📊 Analytics & Reporting

- Real-time employee work tracking
- Automated performance reports
- Interactive Gantt charts for project timelines
- Complete audit logs and event history
- Dashboard with project metrics and KPIs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

Built with ❤️ by the Taskpilot Labs team
