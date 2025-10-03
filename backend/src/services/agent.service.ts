import { AgentRequest } from "../types";

// const localUrl = "http://agent-service-app:5000/";
const localUrl = "http://localhost:5001/";
interface Employee {
  name: string;
  designation: string;
  skillset: string[];
}
export const pipeline = async (input: AgentRequest) => {
  const response = await fetch(`${localUrl}pipeline`, {
    method: "POST",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await response.json();
  return data;
};

export const checkAgentServer = async () => {
  const response = await fetch(`${localUrl}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
};

export const initProject = async (project_name: string, defination: string) => {
  const response = await fetch(`${localUrl}init_project`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      project_name,
      defination,
    }),
  });
  const data = await response.json();
  return data;
};

export const identifyKeyFeatures = async (defination: string) => {
  const response = await fetch(`${localUrl}identify_key_features`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      defination,
    }),
  });
  const data = await response.json();
  return data;
};

export const generateDocument = async (
  project_name: string,
  defination: string,
  key_features: string[]
) => {
  const response = await fetch(`${localUrl}generate_docs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      project_name,
      defination,
      key_features,
    }),
  });
  const data = await response.json();
  return data;
};

export const generateTasks = async (
  project_name: string,
  defination: string,
  key_features: string[],
  employees: Employee[],
  development_type: string,
  complexity: string
) => {
  const response = await fetch(`${localUrl}create_tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      project_name,
      employees,
      defination,
      development_type,
      complexity,
      key_features,
    }),
  });
  const data = await response.json();
  return data;
};
