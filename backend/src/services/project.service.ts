import { json } from "express";
import prisma from "../db";
import { pipeline } from "./agent.service";
import { convertJsonToMarkdown } from "../utils/markdown_converter";
// import { addCollaborator, createRepo } from "./github.service";

interface Employee {
  id: string;
  name: string;
  role: string;
  skills: string[];
}

interface AssignedTask {
  asssigned_to: string;
  assigned_to_avatar: string;
  assigned_to_id: string;
  deadline: string;
  desc: string;
  name: string;
  priority: string;
  required_skills: string[];
}
interface Task {
  id: string;
  name: string;
  description: string | null; // Allow null
  tag: string | null; // Allow null
  status: string;
  priority: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string | null; // Allow null
  due: Date | null; // Allow null
  assignedEmployees?: Employee[];
}

interface Project {
  id: string;
  name: string;
  description: string | null; // Allow null
  projectType: string;
  complexity?: string; // Optional, may be null or omitted
  completionStatus: string;
  ownerId: string;
  timeEstimate: number;
  employeesWorkingOn?: Employee[]; // Optional
  tasks?: Task[]; // Optional
  documents?: any[];
  createdAt: Date;
  updatedAt: Date;
}

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function getTaskDueDate(deadline: unknown, taskName: string): Date | null {
  const deadlineText =
    typeof deadline === "string" ? deadline.trim() : "";
  const deadlineMatch = deadlineText.match(
    /^(\d+(?:\.\d+)?)\s*(?:days?)?$/i,
  );
  const deadlineDays =
    typeof deadline === "number"
      ? deadline
      : deadlineMatch
        ? Number(deadlineMatch[1])
        : Number.NaN;

  const dueDate = new Date(Date.now() + deadlineDays * MILLISECONDS_PER_DAY);
  if (
    !Number.isFinite(deadlineDays) ||
    deadlineDays < 0 ||
    !Number.isFinite(dueDate.getTime())
  ) {
    console.warn(
      `Invalid deadline for task "${taskName}": expected a non-negative number of days; saving without a due date.`,
    );
    return null;
  }

  return dueDate;
}

export const createProject = async (
  name: string,
  description: string,
  projectType: string,
  complexity: string,
  ownerId: string,
  timeEstimate: number,
  key_features: string[],
) => {
  const admin = await prisma.admin.findFirst({
    where: { id: ownerId },
    select: { name: true, accessToken: true },
  });
  if (!admin) {
    throw new Error("Admin with this id does not exist");
  }

  const employees: any = await prisma.employee.findMany({
    where: { employerId: ownerId },
    select: { id: true, name: true, role: true, skills: true },
  });

  const employeesMap = employees.map((employee: Employee) => ({
    name: employee.name,
    designation: employee.role,
    skillset: employee.skills,
  }));
  // const createRepoRes = await createRepo(
  //   name,
  //   description || "",
  //   admin.accessToken
  // );

  // const owner = createRepoRes.data.owner.login;
  // const repoName = createRepoRes.data.name;
  const project: Project = await prisma.project.create({
    data: {
      name,
      description,
      projectType,
      complexity,
      completionStatus: "NOT_STARTED",
      ownerId,
      timeEstimate,
    },
  });

  const agentResponse: any = await pipeline({
    project_name: name,
    employees: employeesMap,
    description,
    development_type: projectType,
    response_type: "json",
    complexity,
    timeline: timeEstimate,
    key_features,
  });

  if (!agentResponse) {
    return Error("No response from agents");
  }

  if (
    agentResponse.description &&
    agentResponse.doc_body &&
    agentResponse.tasks &&
    agentResponse.name
  ) {
    const docDescription = agentResponse.description;
    const docName = agentResponse.name;
    const tasks = agentResponse.tasks;
    const docBody = convertJsonToMarkdown(agentResponse.doc_body);

    const doc = await prisma.document.create({
      data: {
        description: docDescription,
        name: docName,
        status: "DRAFT",
        body: docBody,
        projectId: project.id,
        createdBy: admin.name,
        ownerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const createdTasksData = await Promise.all(
      tasks.map(async (task: any) => {
        const createdTask: Task = await prisma.task.create({
          data: {
            name: task.name,
            description: task.desc,
            tag: task.name,
            status: "ASSIGNED",
            priority: task.priority,
            projectId: project.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            ownerId,
            due: getTaskDueDate(task.deadline, task.name),
          },
        });

        return { task: createdTask, roleNeeded: task.assigned_to };
      }),
    );

    // await assignTasksToEmployees(
    //   createdTasksData,
    //   employees,
    //   project.id,
    //   owner,
    //   repoName,
    //   admin.accessToken
    // );
  } else {
  }

  return project;
};

interface SelectedEmployee {
  avatar: string;
  name: string;
  id: string;
  role: string;
  selected: boolean;
}

interface SoftwareRequirementsSpecification {
  doc_body: Section[];
  doc_desc: string;
  doc_name: string;
  er_diagram: string;
  use_case_diagram: string;
}

interface Section {
  content: SectionContent[];
  section: string;
}

interface SectionContent {
  content: SubsectionContent[] | string;
  subsection: string;
}

interface SubsectionContent {
  content: string | SubsubsectionContent[];
  subsection?: string;
  subsubsection?: string;
}

interface SubsubsectionContent {
  content: string;
  subsubsection: string;
}
export async function createFinalProject(
  definition: string,
  projectName: string,
  selectedTeamMembers: SelectedEmployee[],
  document: SoftwareRequirementsSpecification,
  tasks: AssignedTask[],
  projectDuration: number,
  newdefinition: string,
  ownerId: string,
) {
  const admin = await prisma.admin.findFirst({
    where: { id: ownerId },
    select: {
      name: true,
      accessToken: true,
      subscription: true,
      remainingProjectLimit: true,
      remainingDocumentLimit: true,
      remainingResearchLimit: true,
      dailyResearchLimit: true,
      lastLimitResetDate: true,
    },
  });
  if (!admin) {
    throw new Error("Admin with this id does not exist");
  }
  // if (admin.remainingProjectLimit <= 0) {
  //   throw new Error("You have reached your project limit");
  // }
  // if (
  //   (admin.subscription?.status === "pending" ||
  //     admin.subscription?.status === "cancelled") &&
  //   admin.subscription?.planId === "pro"
  // ) {
  //   throw new Error("Subscription is pending");
  // }
  const employees = await prisma.employee.findMany({
    where: { employerId: ownerId },
    select: {
      id: true,
      name: true,
      role: true,
      skills: true,
      githubUsername: true,
    },
  });

  // createdTasksData: Array<{ task: Task; roleNeeded: string }>,

  const choosenEmployees = employees.filter((employee: Employee) => {
    return selectedTeamMembers.some(
      (selectedEmployee: SelectedEmployee) =>
        selectedEmployee.id === employee.id,
    );
  });
  // const createRepoRes = await createRepo(
  //   projectName,
  //   definition,
  //   admin.accessToken
  // );

  // const owner = createRepoRes.data.owner.login;
  // const repoName = createRepoRes.data.name;
  const project: Project = await prisma.project.create({
    data: {
      name: projectName,
      description: newdefinition,
      projectType: "web",
      complexity: "Medium",
      completionStatus: "NOT_STARTED",
      ownerId,
      timeEstimate: projectDuration,
    },
  });

  if (!project) {
    throw new Error("Unable to create project");
  }

  // else if (admin.subscription?.planId != "pro" && admin.remainingProjectLimit > 0) {
  //   await prisma.admin.update({
  //     where: { id: ownerId },
  //     data: {
  //       remainingProjectLimit: {
  //         decrement: 1,
  //       },
  //     },
  //   });
  // }

  const createdDocument = await prisma.document.create({
    data: {
      description: document.doc_desc,
      name: document.doc_name,
      status: "CREATED",
      docBody: JSON.stringify(document.doc_body),
      docDesc: document.doc_desc,
      docName: document.doc_name,
      erDiagram: document.er_diagram,
      useCaseDiagram: document.use_case_diagram,
      projectId: project.id,
      createdBy: admin.name,
      ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  if (!createdDocument) {
    throw new Error("Unable to create document");
  }
  // else if (
  //   admin.subscription?.planId != "pro" &&
  //   admin.remainingDocumentLimit > 0
  // ) {
  //   await prisma.admin.update({
  //     where: { id: ownerId },
  //     data: {
  //       remainingDocumentLimit: {
  //         decrement: 1,
  //       },
  //     },
  //   });
  // }

  const createdTasks = await Promise.all(
    tasks.map(async (task: AssignedTask) => {
      const createdTask: Task = await prisma.task.create({
        data: {
          name: task.name,
          description: task.desc,
          tag: task.name,
          status: "ASSIGNED",
          priority: task.priority,
          projectId: project.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          ownerId,
          due: getTaskDueDate(task.deadline, task.name),
        },
      });

      if (!createdTask) {
        throw new Error("Unable to create task");
      }

      return {
        task: createdTask,
        assigned_to: task.asssigned_to,

        assigned_to_id: task.assigned_to_id,
        deadline: task.deadline,
        desc: task.desc,
        name: task.name,
        priority: task.priority,
        required_skills: task.required_skills,
      };
    }),
  );

  if (createdTasks.length === 0) {
    throw new Error("No tasks created");
  }

  const allTasks = await prisma.task.findMany({
    where: { projectId: project.id },
    select: {
      id: true,
      name: true,
      description: true,
      tag: true,
      status: true,
      priority: true,
      due: true,
      createdAt: true,
      updatedAt: true,
      projectId: true,
      ownerId: true,
    },
  });

  await assignTasksToEmployees(
    allTasks,
    choosenEmployees,
    project.id,
    "owner",
    "repoName",
    admin.accessToken,
    createdTasks,
  );

  return project;
}

async function assignTasksToEmployees(
  tasks: Task[],
  employees: Employee[],
  projectId: string,
  owner: string,
  repoName: string,
  admin: string,
  assignedTasks: Array<{
    assigned_to: string;
    assigned_to_avatar?: string;
    assigned_to_id: string;
    deadline: string;
    desc: string;
    name: string;
    priority: string;
    required_skills?: string[];
  }>,
) {
  // Create a map of employees by ID for quick lookup
  const employeesById = employees.reduce(
    (map, employee) => {
      map[employee.id] = employee;
      return map;
    },
    {} as Record<string, Employee>,
  );

  // Create a map of tasks by name for matching with assigned tasks
  const tasksByName = tasks.reduce(
    (map, task) => {
      map[task.name] = task;
      return map;
    },
    {} as Record<string, Task>,
  );

  // Process each assigned task
  for (const assignedTask of assignedTasks) {
    const taskToAssign = tasksByName[assignedTask.name];
    const employeeToAssign = employeesById[assignedTask.assigned_to_id];

    if (!taskToAssign) {
      console.error(`Task "${assignedTask.name}" not found in created tasks`);
      continue;
    }

    if (!employeeToAssign) {
      console.error(
        `Employee with ID "${assignedTask.assigned_to_id}" not found`,
      );
      continue;
    }

    try {
      // Update the task with the assigned employee
      const updatedTask = await prisma.task.update({
        where: { id: taskToAssign.id },
        data: {
          assignedEmployees: { connect: { id: employeeToAssign.id } },
        },
        include: { assignedEmployees: true },
      });

      // Update the employee to be assigned to the project
      const updatedEmployee = await prisma.employee.update({
        where: { id: employeeToAssign.id },
        data: {
          projectsAssigned: { connect: { id: projectId } },
        },
        include: { projectsAssigned: true },
      });

      // Add the employee as a collaborator to the GitHub repository
      // const addCollaboratorRes = await addCollaborator(
      //   repoName,
      //   owner,
      //   updatedEmployee.githubUsername,
      //   admin
      // );
    } catch (error) {
      console.error(
        `Error assigning task "${taskToAssign.name}" to employee ${employeeToAssign.name}:`,
        error,
      );
    }
  }
}

export const getProjects = async (ownerId: string) => {
  const admin = await prisma.admin.findFirst({
    where: { id: ownerId },
  });

  if (!admin) {
    throw new Error("Admin with this id does not exist");
  }

  const projects = await prisma.project.findMany({
    where: { ownerId },
    select: {
      id: true,
      name: true,
      description: true,
      completionStatus: true,
      updatedAt: true,
      employeesWorkingOn: { select: { name: true } },
      tasks: { select: { status: true } },
      owner: { select: { name: true } },
    },
  });

  return projects.map((project: any) => {
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(
      (task: any) => task.status === "DONE",
    ).length;

    let statusColor = "";
    let statusIcon = null;

    switch (project.completionStatus.toLowerCase()) {
      case "DONE":
        statusColor = "green";
        statusIcon = "CheckCircle";
        break;
      case "IN_PROGRESS":
        statusColor = "blue";
        statusIcon = "Clock";
        break;
      case "ASSIGNED":
        statusColor = "gray";
        statusIcon = "CircleDashed";
        break;
      case "NOT_STARTED":
        statusColor = "red";
        statusIcon = "AlertTriangle";
        break;
      default:
        statusColor = "gray";
        statusIcon = "Circle";
    }

    return {
      id: project.id,
      title: project.name,
      description: project.description || "", // Handle null
      status: project.completionStatus,
      statusIcon,
      statusColor,
      team: project.employeesWorkingOn.map((employee: any) => employee.name),
      tasks: { completed: completedTasks, total: totalTasks },
      lastUpdated: project.updatedAt.toISOString(),
      client: project.owner.name,
    };
  });
};

export const getDashboardData = async (ownerId: string) => {
  const employees = await prisma.employee.findMany({
    where: { employerId: ownerId },
    select: { name: true },
  });

  const temp = await prisma.admin.findFirst({
    where: { id: ownerId },
  });
  if (!temp) {
    throw new Error("Admin with this id does not exist");
  }

  const projects: Project[] = await prisma.project.findMany({
    where: { ownerId },
    select: {
      id: true,
      name: true,
      description: true,
      ownerId: true,
      projectType: true,
      createdAt: true,
      updatedAt: true,
      completionStatus: true,
      timeEstimate: true,
    },
  });

  const tasks: Task[] = await prisma.task.findMany({
    where: { projectId: { in: projects.map((project) => project.id) } },
    select: {
      id: true,
      name: true,
      description: true, // Include description to match Task interface
      tag: true, // Include tag
      status: true,
      priority: true,
      due: true,
      createdAt: true,
      updatedAt: true,
      projectId: true,
      ownerId: true, // Include ownerId
    },
  });

  const projectHealthStatuses = projects.map((project: Project) => {
    const projectTasks = tasks.filter((task) => task.projectId === project.id);
    const totalProjectTasks = projectTasks.length;

    if (totalProjectTasks === 0) {
      return {
        id: project.id,
        name: project.name,
        description: project.description || "", // Handle null
        status: "ON_TRACK",
        progress: 0,
      };
    }

    const completedTasks = projectTasks.filter(
      (task: Task) => task.status === "DONE",
    ).length;
    const overdueTasks = projectTasks.filter(
      (task: Task) =>
        task.status !== "DONE" && task.due && new Date(task.due) < new Date(),
    ).length;

    const progress =
      totalProjectTasks > 0
        ? Math.round((completedTasks / totalProjectTasks) * 100)
        : 0;

    let status = "ON_TRACK";
    if (overdueTasks > 0 || progress < 30) {
      status = "NEEDS_ATTENTION";
    } else if (project.completionStatus === "COMPLETED") {
      status = "COMPLETED";
    }

    return {
      name: project.name,
      description: project.description || "", // Handle null
      id: project.id,
      status,
      progress,
    };
  });

  const onTrackProjects = projectHealthStatuses.filter(
    (p: any) => p.status === "ON_TRACK",
  ).length;
  const needsAttentionProjects = projectHealthStatuses.filter(
    (p: any) => p.status === "NEEDS_ATTENTION",
  ).length;
  const completedProjects = projectHealthStatuses.filter(
    (p: any) => p.status === "COMPLETED",
  ).length;

  let overallHealth = "Good";
  let healthDetail = `${onTrackProjects} projects on track`;

  if (needsAttentionProjects > 0) {
    healthDetail += `, ${needsAttentionProjects} needs attention`;
  }

  if (completedProjects > 0) {
    healthDetail += `, ${completedProjects} completed`;
  }

  if (
    needsAttentionProjects > 0 &&
    needsAttentionProjects / projects.length > 0.3
  ) {
    overallHealth = "Medium";
  }

  if (
    needsAttentionProjects > 0 &&
    needsAttentionProjects / projects.length > 0.5
  ) {
    overallHealth = "Bad";
  }

  const totalTasks = tasks.length;
  const totalEmployees = employees.length; // Note: This might need adjustment
  const tasksCompleted = tasks.filter(
    (task: Task) => task.status === "DONE",
  ).length;
  const active = projects.filter(
    (project: Project) => project.completionStatus === "IN_PROGRESS",
  ).length;
  const pendingTasks = tasks.filter((task: Task) =>
    ["ASSIGNED", "IN_PROGRESS", "REVIEW", "BACKLOG", "TODO"].includes(
      task.status,
    ),
  );

  return {
    active,
    tasksCompleted,
    totalTasks,
    totalEmployees,
    health: overallHealth,
    healthDetail,
    pendingTasks,
    projectHealthStatuses,
  };
};

export const updateProject = async (
  projectId: string,
  name: string,
  ownerId: string,
  description: string,
) => {
  const temp = await prisma.project.findFirst({
    where: { id: projectId, ownerId },
  });

  if (!temp) {
    throw new Error("Project with this id does not exist");
  }

  const project: Project = await prisma.project.update({
    where: { id: projectId },
    data: { name, description },
  });
  return project;
};

export const getSingleProject = async (projectId: string) => {
  const temp = await prisma.project.findFirst({
    where: { id: projectId },
  });
  if (!temp) {
    throw new Error("Project with this id does not exist");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      employeesWorkingOn: true,
      documents: true,
      tasks: {
        select: {
          id: true,
          status: true,
          name: true,
          description: true,
          tag: true,
          priority: true,
          due: true,
          createdAt: true,
          updatedAt: true,
          projectId: true,
          ownerId: true,
          comments: true,
          assignedEmployees: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
      completionStatus: true,
      complexity: true,
      description: true,
      id: true,
      name: true,
      ownerId: true,
      projectType: true,
      createdAt: true,
      updatedAt: true,
      timeEstimate: true,
    },
  });
  return project;
};

export const deleteProject = async (projectId: string) => {
  const temp = await prisma.project.findFirst({
    where: { id: projectId },
  });

  if (!temp) {
    throw new Error("Project with this id does not exist");
  }

  // Delete all comments related to the project first (due to Task -> Comment relationship)
  await prisma.comment.deleteMany({
    where: { projectId: temp.id },
  });

  // Delete all tasks related to the project
  await prisma.task.deleteMany({
    where: { projectId: temp.id },
  });

  // Delete all documents related to the project
  await prisma.document.deleteMany({
    where: { projectId: temp.id },
  });

  // Now that all dependencies are cleared, delete the project
  const project = await prisma.project.delete({
    where: { id: temp.id },
  });

  return project;
};

export const addEmployeeToProject = async (
  projectId: string,
  employeeId: string,
) => {
  const temp = await prisma.project.findFirst({
    where: { id: projectId },
  });
  if (!temp) {
    throw new Error("Project with this id does not exist");
  }

  const project: Project = await prisma.project.update({
    where: { id: projectId },
    data: { employeesWorkingOn: { connect: { id: employeeId } } },
  });
  return project;
};

export const removeEmployeeFromProject = async (
  projectId: string,
  employeeId: string,
) => {
  const temp = await prisma.project.findFirst({
    where: { id: projectId },
  });
  if (!temp) {
    throw new Error("Project with this id does not exist");
  }

  const project: Project = await prisma.project.update({
    where: { id: projectId },
    data: { employeesWorkingOn: { disconnect: { id: employeeId } } },
  });
  return project;
};

export const addDocumentToProject = async (
  projectId: string,
  documentId: string,
) => {
  const temp = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!temp) {
    throw new Error("Project with this id does not exist");
  }

  const project: Project = await prisma.project.update({
    where: { id: projectId },
    data: { documents: { connect: { id: documentId } } },
  });
  return project;
};

export const removeDocumentFromProject = async (
  projectId: string,
  documentId: string,
) => {
  const temp = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!temp) {
    throw new Error("Project with this id does not exist");
  }

  const project: Project = await prisma.project.update({
    where: { id: projectId },
    data: { documents: { delete: { id: documentId } } },
  });
  return project;
};

export const addTaskToProject = async (projectId: string, taskId: string) => {
  const temp = await prisma.project.findFirst({
    where: { id: projectId },
  });
  if (!temp) {
    throw new Error("Project with this id does not exist");
  }

  const project: Project = await prisma.project.update({
    where: { id: projectId },
    data: { tasks: { connect: { id: taskId } } },
  });
  return project;
};

export const removeTaskFromProject = async (
  projectId: string,
  taskId: string,
) => {
  const temp = await prisma.project.findFirst({
    where: { id: projectId },
  });
  if (!temp) {
    throw new Error("Project with this id does not exist");
  }

  const project: Project = await prisma.project.update({
    where: { id: projectId },
    data: { tasks: { disconnect: { id: taskId } } },
  });
  return project;
};
