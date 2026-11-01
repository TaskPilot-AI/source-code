import type { Request, Response } from "express";
import {
  createProject,
  getSingleProject,
  getProjects,
  updateProject,
  deleteProject,
  removeTaskFromProject,
  addTaskToProject,
  removeDocumentFromProject,
  addDocumentToProject,
  getDashboardData,
  createFinalProject,
} from "../services/project.service";
import { CreateProjectSchema, ProjectBaseSchema } from "../types";
import {
  generateDocument,
  generateTasks,
  identifyKeyFeatures,
  initProject,
} from "../services/agent.service";

export const createProjectController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = CreateProjectSchema.parse(req.body);
    const project = await createProject(
      validatedData.name,
      validatedData.description ?? "",
      validatedData.projectType,
      validatedData.complexity,
      validatedData.ownerId,
      validatedData.timeEstimate,
      validatedData.key_features,
    );

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createFinalProjectController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      projectName,
      definition,
      selectedTeamMembers,
      document,
      tasks,
      projectDuration,
      newdefinition,
      ownerId,
    } = req.body;

    if (
      !projectName ||
      !definition ||
      !selectedTeamMembers ||
      !document ||
      !tasks ||
      !projectDuration ||
      !newdefinition ||
      !ownerId
    ) {
      throw new Error(
        "Project name, definition, selectedTeamMembers, document, tasks, projectDuration, newdefinition and ownerId are required",
      );
    }

    const projects = await createFinalProject(
      definition,
      projectName,
      selectedTeamMembers,
      document,
      tasks,
      projectDuration,
      newdefinition,
      ownerId,
    );
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: projects,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const initProjectController = async (req: Request, res: Response) => {
  try {
    var { project_name, definition } = req.body;

    if (!project_name || !definition) {
      throw new Error("Project name and definition are required");
    }

    const projects = await initProject(project_name, definition);
    res.status(200).json({
      success: true,
      message: "Project definition initialized successfully",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const generateDocumentController = async (
  req: Request,
  res: Response,
) => {
  try {
    var { project_name, definition, key_features } = req.body;

    if (!project_name || !definition || !key_features) {
      throw new Error("Project name, definition and key_features are required");
    }

    const projects = await generateDocument(
      project_name,
      definition,
      key_features,
    );
    res.status(200).json({
      success: true,
      message: "Document generated successfully",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const generateTasksController = async (req: Request, res: Response) => {
  try {
    var {
      project_name,
      definition,
      key_features,
      employees,
      development_type,
      complexity,
    } = req.body;

    if (
      !project_name ||
      !definition ||
      !key_features ||
      !employees ||
      !development_type ||
      !complexity
    ) {
      throw new Error(
        "Project name, definition, key_features, employees, development_type and complexity are required",
      );
    }

    const projects = await generateTasks(
      project_name,
      definition,
      key_features,
      employees,
      development_type,
      complexity,
    );
    res.status(200).json({
      success: true,
      message: "Tasks generated successfully",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const identifyKeyFeaturesController = async (
  req: Request,
  res: Response,
) => {
  try {
    var { definition } = req.body;

    if (!definition) {
      throw new Error("Project name is required");
    }

    const projects = await identifyKeyFeatures(definition);
    res.status(200).json({
      success: true,
      message: "Key features identified successfully",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getProjectsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projects = await getProjects(req.params.ownerId!);
    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getDashboardDataFun = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projects = await getDashboardData(req.params.ownerId!);
    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateProjectController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    var { name, description, ownerId } = req.body;
    if (!name || !ownerId) {
      throw new Error("Project name and ownerId are required");
    }

    if (!description) {
      throw new Error("Project description is required");
    }

    const project = await updateProject(
      req.params.projectId!,
      name,
      ownerId,
      description ?? "",
    );
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getProjectController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const project = await getSingleProject(req.params.projectId!);
    res.status(200).json({
      success: true,
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteProjectController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await deleteProject(req.params.projectId!);
    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const addDocumentToProjectController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await addDocumentToProject(req.body.projectId, req.body.documentId);
    res.status(200).json({
      success: true,
      message: "Document added to project successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const removeDocumentFromProjectController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await removeDocumentFromProject(req.body.projectId, req.body.documentId);
    res.status(200).json({
      success: true,
      message: "Document removed from project successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const addTaskToProjectController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await addTaskToProject(req.body.projectId, req.body.taskId);
    res.status(200).json({
      success: true,
      message: "Task added to project successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const removeTaskFromProjectController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await removeTaskFromProject(req.body.projectId, req.body.taskId);
    res.status(200).json({
      success: true,
      message: "Task removed from project successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
