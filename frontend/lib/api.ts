import { API_URL } from "@/app/lib/server-config";

export interface TeamMember {
  name: string;
  designation: string;
  skillset: string[];
}

// Helper function to handle API errors
const handleApiError = (response: Response) => {
  if (response.status === 401) {
    // Handle unauthorized access
    console.error("Unauthorized access. Please log in again.");
    // You might want to redirect to login page or refresh token
  }

  if (response.status === 500) {
    console.error("Server error occurred");
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response;
};

export async function initializeProject(
  projectName: string,
  definition: string,
) {
  try {
    const response = await fetch(`${API_URL}/projects/init-project`, {
      method: "POST",
      headers: {
        "x-api-key": "thisisasdca",
        "Content-Type": "application/json",
        Authorization: `Authorization ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        project_name: projectName,
        definition: definition,
      }),
    });

    handleApiError(response);
    return await response.json();
  } catch (error) {
    console.error("Error initializing project:", error);
    throw error;
  }
}
export async function conductResearch(projectDescription: string) {
  try {
    const response = await fetch(`${API_URL}/projects/research`, {
      method: "POST",
      headers: {
        "x-api-key": "thisisasdca",
        "Content-Type": "application/json",
        Authorization: `Authorization ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        projectDescription,
      }),
    });

    handleApiError(response);
    return await response.json();
  } catch (error) {
    console.error("Error conducting research:", error);
    throw error;
  }
}
export async function identifyKeyFeatures(definition: string) {
  try {
    const response = await fetch(`${API_URL}/projects/identify-key-features`, {
      method: "POST",
      headers: {
        "x-api-key": "thisisasdca",
        "Content-Type": "application/json",
        Authorization: `Authorization ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        definition: definition,
      }),
    });

    handleApiError(response);
    return await response.json();
  } catch (error) {
    console.error("Error identifying key features:", error);
    throw error;
  }
}

export async function generateDocument(
  projectName: string,
  definition: string,
  keyFeatures: string[],
) {
  try {
    const response = await fetch(`${API_URL}/projects/generate-document`, {
      method: "POST",
      headers: {
        "x-api-key": "thisisasdca",
        "Content-Type": "application/json",
        Authorization: `Authorization ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        project_name: projectName,
        definition: definition,
        key_features: keyFeatures,
      }),
    });

    handleApiError(response);
    return await response.json();
  } catch (error) {
    console.error("Error generating document:", error);
    throw error;
  }
}

export async function generateTasks(
  projectName: string,
  definition: string,
  keyFeatures: string[],
  complexity = "medium",
  developmentType = "Web Application",
) {
  try {
    // Get admin ID from localStorage
    const adminId = localStorage.getItem("adminId");

    // Prepare employees data from selected team members
    const employeesResponse = await fetch(
      `${API_URL}/employees/all/${adminId}`,
      {
        method: "GET",
        headers: {
          "x-api-key": "thisisasdca",
          "Content-Type": "application/json",
          Authorization: `Authorization ${localStorage.getItem("accessToken")}`,
        },
      },
    );

    handleApiError(employeesResponse);
    const employeesResult = await employeesResponse.json();

    let employees = [];
    if (employeesResult.success && Array.isArray(employeesResult.data)) {
      employees = employeesResult.data.map((employee: any) => ({
        name: employee.name,
        designation: employee.role,
        skillset: employee.skills || [],
      }));
    }

    // Now generate tasks
    const response = await fetch(`${API_URL}/projects/generate-tasks`, {
      method: "POST",
      headers: {
        "x-api-key": "thisisasdca",
        "Content-Type": "application/json",
        Authorization: `Authorization ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        project_name: projectName,
        employees: employees,
        definition: definition,
        development_type: developmentType,
        complexity: complexity,
        key_features: keyFeatures,
      }),
    });

    handleApiError(response);
    return await response.json();
  } catch (error) {
    console.error("Error generating tasks:", error);
    throw error;
  }
}

export async function fetchEmployees() {
  try {
    const adminId = localStorage.getItem("adminId");
    const response = await fetch(`${API_URL}/employees/all/${adminId}`, {
      method: "GET",
      headers: {
        "x-api-key": "thisisasdca",
        "Content-Type": "application/json",
        Authorization: `Authorization ${localStorage.getItem("accessToken")}`,
      },
    });

    handleApiError(response);
    return await response.json();
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
}
