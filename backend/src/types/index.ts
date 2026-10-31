import { z } from "zod";

const ProjectTypeEnum = z.enum(["web", "mobile", "desktop"]);
const ComplexityEnum = z.enum(["low", "medium", "high", "critical"]);
const CompletionStatusEnum = z.enum([
  "NOT_STARTED",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
  "CANCELLED",
]);

const roleOptions = z.enum([
  "Senior Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UX Designer",
  "UI Designer",
  "Product Designer",
  "Project Manager",
  "Business Analyst",
  "QA Engineer",
  "DevOps Engineer",
  "Data Scientist",
]);

const departmentOptions = z.enum([
  "Engineering",
  "Design",
  "Management",
  "Business",
  "QA",
  "DevOps",
  "Data",
]);
const EmployeeStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "ON_LEAVE",
  "TERMINATED",
]);
const TaskStatusEnum = z.enum([
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
  "BLOCKED",
]);

const TaskPriorityEnum = z.enum(["low", "medium", "high", "urgent"]);
const DocumentStatusEnum = z.enum([
  "DRAFT",
  "REVIEW",
  "APPROVED",
  "REJECTED",
  "ARCHIVED",
]);

// Base schemas (for fields that don't include relations)
export const AdminSchema = z.object({
  id: z.string().uuid().optional(), // Optional for creation
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().optional(),
  createdAt: z.date().optional(),
  accessToken: z.string().optional().default(""),
});

export const ProjectBaseSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional().nullable(),
  projectType: ProjectTypeEnum,
  complexity: ComplexityEnum,
  completionStatus: CompletionStatusEnum,
  ownerId: z.string().uuid("Invalid owner ID format"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  timeEstimate: z.number().int().nonnegative().optional().default(0),
  key_features: z
    .array(z.string())
    .min(1, "At least one key feature is required"),
});

export const EmployeeBaseSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Employee name is required"),
  email: z.string().email("Invalid email format"),
  contact: z.string().optional().nullable(),
  role: roleOptions,
  department: departmentOptions,
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  status: EmployeeStatusEnum,
  location: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  employerId: z.string().uuid("Invalid employer ID format"),
  githubUsername: z.string().nullable(),
});

export const TaskBaseSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Task name is required"),
  description: z.string().optional().nullable(),
  tag: z.string().optional().nullable(),
  status: TaskStatusEnum,
  priority: TaskPriorityEnum,
  projectId: z.string().uuid("Invalid project ID format"),
  due: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  ownerId: z.string().uuid("Invalid owner ID format").optional().default(""),
});

export const DocumentBaseSchema = z.object({
  id: z.string().uuid().optional(),
  createdBy: z.string().min(1, "Document creator is required"),
  views: z.number().int().nonnegative().optional().default(0),
  description: z.string().optional().nullable(),
  status: DocumentStatusEnum,
  body: z.string().min(1, "Document body is required"),
  projectId: z.string().uuid("Invalid project ID format"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  name: z.string().min(1, "Document name is required"),
  ownerId: z.string().uuid("Invalid owner ID format").optional().default(""),
});

// Input schemas for creating new records
export const CreateAdminSchema = AdminSchema.omit({
  id: true,
  createdAt: true,
});

export const CreateProjectSchema = ProjectBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateEmployeeSchema = EmployeeBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateTaskSchema = TaskBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  assignedEmployeeIds: z
    .array(z.string().uuid("Invalid employee ID format"))
    .optional(),
});

export const CreateDocumentSchema = DocumentBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
});
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginInput = z.infer<typeof LoginSchema>;
// Update schemas (make all fields optional)
export const UpdateAdminSchema = CreateAdminSchema.partial();

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  employeeIds: z
    .array(z.string().uuid("Invalid employee ID format"))
    .optional(),
});

export const UpdateProjectSchema1 = ProjectBaseSchema.extend({
  employeeIds: z
    .array(z.string().uuid("Invalid employee ID format"))
    .optional(),
});

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();

export const UpdateTaskSchema = CreateTaskSchema.partial();

export const UpdateDocumentSchema = CreateDocumentSchema.partial();

// Response schemas (include relations)
export const AdminResponseSchema = AdminSchema.extend({
  projects: z.array(z.object({ id: z.string().uuid() })).optional(),
});

export const ProjectResponseSchema = ProjectBaseSchema.extend({
  employeesWorkingOn: z.array(z.object({ id: z.string().uuid() })).optional(),
  documents: z.array(z.object({ id: z.string().uuid() })).optional(),
  tasks: z.array(z.object({ id: z.string().uuid() })).optional(),
  owner: z.object({ id: z.string().uuid(), name: z.string() }).optional(),
});

export const EmployeeResponseSchema = EmployeeBaseSchema.extend({
  projectsAssigned: z.array(z.object({ id: z.string().uuid() })).optional(),
  assignedTasks: z.array(z.object({ id: z.string().uuid() })).optional(),
});

export const TaskResponseSchema = TaskBaseSchema.extend({
  assignedEmployees: z
    .array(z.object({ id: z.string().uuid(), name: z.string() }))
    .optional(),
  project: z.object({ id: z.string().uuid(), name: z.string() }).optional(),
});

export const DocumentResponseSchema = DocumentBaseSchema.extend({
  project: z.object({ id: z.string().uuid(), name: z.string() }).optional(),
});

export interface Employee1 {
  name: string;
  designation: string;
  skillset: string[];
}

export interface AgentRequest {
  project_name: string;
  employees: Employee1[];
  description: string;
  development_type: string;
  response_type: string;
  complexity: string;
  timeline: number;
  key_features: string[];
}

// Export types derived from the schemas
export type Admin = z.infer<typeof AdminSchema>;
export type Project = z.infer<typeof ProjectBaseSchema>;
export type Employee = z.infer<typeof EmployeeBaseSchema>;
export type Task = z.infer<typeof TaskBaseSchema>;
export type Document = z.infer<typeof DocumentBaseSchema>;

export type CreateAdminInput = z.infer<typeof CreateAdminSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type CreateEmployeeInput = z.infer<typeof CreateEmployeeSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>;

export type UpdateAdminInput = z.infer<typeof UpdateAdminSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
export type UpdateEmployeeInput = z.infer<typeof UpdateEmployeeSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type UpdateDocumentInput = z.infer<typeof UpdateDocumentSchema>;

export type AdminResponse = z.infer<typeof AdminResponseSchema>;
export type ProjectResponse = z.infer<typeof ProjectResponseSchema>;
export type EmployeeResponse = z.infer<typeof EmployeeResponseSchema>;
export type TaskResponse = z.infer<typeof TaskResponseSchema>;
export type DocumentResponse = z.infer<typeof DocumentResponseSchema>;
