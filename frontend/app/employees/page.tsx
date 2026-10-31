"use client";

import type React from "react";

import { useState, useEffect, type KeyboardEvent } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Calendar,
  Github,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_URL } from "@/app/lib/server-config";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { toast } from "@/components/ui/use-toast";

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  githubUsername: string;
  joinDate: string;
  avatar: string;
  skills: string[];
  projects: { id: string; name: string }[];
  status: string;
}

interface NewEmployeeForm {
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  githubUsername: string;
  skills: string[];
}

interface Project {
  id: string;
  name: string;
  description?: string;
}

interface RemoveProjectConfirmation {
  isOpen: boolean;
  employeeId: string;
  projectId: string;
  projectName: string;
}

interface RemoveEmployeeConfirmation {
  isOpen: boolean;
  employeeId: string;
  employeeName: string;
}

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone validation regex - accepts various formats with optional country codes
const PHONE_REGEX = /^(\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

// Validation helper functions
const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email);
const isValidPhone = (phone: string): boolean => PHONE_REGEX.test(phone);

const roleOptions = [
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
];

const departmentOptions = [
  "Engineering",
  "Design",
  "Management",
  "Business",
  "QA",
  "DevOps",
  "Data",
];

const commonSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Python",
  "Java",
  "C#",
  "SQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Git",
  "UI/UX Design",
  "Figma",
  "Project Management",
  "Agile",
  "DevOps",
];

export default function EmployeesView() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState<NewEmployeeForm>({
    name: "",
    role: "",
    department: "",
    email: "",
    phone: "",
    location: "",
    githubUsername: "",
    skills: [],
  });
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isAssignProjectOpen, setIsAssignProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [removeProjectConfirmation, setRemoveProjectConfirmation] =
    useState<RemoveProjectConfirmation>({
      isOpen: false,
      employeeId: "",
      projectId: "",
      projectName: "",
    });
  const [removeEmployeeConfirmation, setRemoveEmployeeConfirmation] =
    useState<RemoveEmployeeConfirmation>({
      isOpen: false,
      employeeId: "",
      employeeName: "",
    });

  // New state for skill input
  const [newSkillInput, setNewSkillInput] = useState("");
  const [editSkillInput, setEditSkillInput] = useState("");
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const session = useSession();

  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 2000);
  };

  useEffect(() => {
    if (!session.data) {
      router.push("/");
    }
  }, [session]);

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/employees/all/${localStorage.getItem("adminId")}`,
          {
            method: "GET",
            headers: {
              "x-api-key": "thisisasdca",
              "Content-Type": "application/json",
              Authorization: `Authorization ${localStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );

        if (response.status === 401) {
          window.location.href = "/";
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch employees: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const formattedEmployees = result.data.map((employee: any) => ({
            id: employee.id,
            name: employee.name,
            role: employee.role,
            department: employee.department,
            email: employee.email,
            phone: employee.contact,
            location: employee.location,
            githubUsername: employee.githubUsername || "",
            joinDate: new Date(employee.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            }),
            avatar: employee.name
              .split(" ")
              .map((n: string) => n[0])
              .join(""),
            skills: Array.isArray(employee.skills) ? employee.skills : [],
            projects: Array.isArray(employee.projectsAssigned)
              ? employee.projectsAssigned.map((project: any) => ({
                  id: project.id,
                  name: project.name,
                }))
              : [],
            status: employee.status === "ACTIVE" ? "Active" : employee.status,
          }));

          setEmployees(formattedEmployees);
        } else {
          console.warn("API returned no data or invalid format");
          setEmployees([]);
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${API_URL}/projects/all/${localStorage.getItem("adminId")}`,
          {
            method: "GET",
            headers: {
              "x-api-key": "thisisasdca",
              "Content-Type": "application/json",
              Authorization: `Authorization ${localStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setProjects(
            result.data.map((project: any) => ({
              id: project.id,
              name: project.title,
              description: project.description,
            }))
          );
        } else {
          console.warn("API returned no project data or invalid format");
          setProjects([]);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchEmployees();
    fetchProjects();
  }, []);

  // Filter skills suggestions based on input
  useEffect(() => {
    if (newSkillInput.trim() !== "") {
      const filtered = commonSkills.filter(
        (skill) =>
          skill.toLowerCase().includes(newSkillInput.toLowerCase()) &&
          !newEmployee.skills.includes(skill)
      );
      setSkillSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSkillSuggestions([]);
      setShowSuggestions(false);
    }
  }, [newSkillInput, newEmployee.skills]);

  // Filter skills suggestions for edit mode
  useEffect(() => {
    if (editSkillInput.trim() !== "" && selectedEmployee) {
      const filtered = commonSkills.filter(
        (skill) =>
          skill.toLowerCase().includes(editSkillInput.toLowerCase()) &&
          !selectedEmployee.skills.includes(skill)
      );
      setSkillSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSkillSuggestions([]);
      setShowSuggestions(false);
    }
  }, [editSkillInput, selectedEmployee]);

  const filteredEmployees = employees.filter((employee: Employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.githubUsername.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || employee.role === roleFilter;
    const matchesDepartment =
      departmentFilter === "all" || employee.department === departmentFilter;

    return matchesSearch && matchesRole && matchesDepartment;
  });

  const validateForm = (
    data: Record<string, any>,
    fields: string[]
  ): boolean => {
    const errors: Record<string, string> = {};

    fields.forEach((field) => {
      // Check if field is empty
      if (
        !data[field] ||
        (typeof data[field] === "string" && data[field].trim() === "") ||
        (Array.isArray(data[field]) && data[field].length === 0)
      ) {
        errors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      } else if (field === "email" && !isValidEmail(data[field])) {
        // Email validation
        errors[field] = "Please enter a valid email address";
      } else if (field === "phone" && !isValidPhone(data[field])) {
        // Phone validation
        errors[field] = "Please enter a valid phone number";
      } else if (field === "githubUsername" && data[field].includes(" ")) {
        // GitHub username validation
        errors[field] = "GitHub username cannot contain spaces";
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add a new skill to the new employee form
  const handleAddSkill = (skill: string = newSkillInput.trim()) => {
    if (skill && !newEmployee.skills.includes(skill)) {
      setNewEmployee((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
      setNewSkillInput("");

      // Clear any skills error
      if (formErrors.skills) {
        setFormErrors((prev) => {
          const updated = { ...prev };
          delete updated.skills;
          return updated;
        });
      }
    }
  };

  // Remove a skill from the new employee form
  const handleRemoveSkill = (skillToRemove: string) => {
    setNewEmployee((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Add a skill to the selected employee
  const handleAddEditSkill = (skill: string = editSkillInput.trim()) => {
    if (selectedEmployee && skill && !selectedEmployee.skills.includes(skill)) {
      setSelectedEmployee((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          skills: [...prev.skills, skill],
        };
      });
      setEditSkillInput("");

      // Clear any skills error
      if (formErrors.skills) {
        setFormErrors((prev) => {
          const updated = { ...prev };
          delete updated.skills;
          return updated;
        });
      }
    }
  };

  // Remove a skill from the selected employee
  const handleRemoveEditSkill = (skillToRemove: string) => {
    if (selectedEmployee) {
      setSelectedEmployee((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          skills: prev.skills.filter((skill) => skill !== skillToRemove),
        };
      });
    }
  };

  // Handle key press in skill input fields
  const handleSkillKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    isEdit = false
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (isEdit) {
        handleAddEditSkill();
      } else {
        handleAddSkill();
      }
    }
  };

  const displayValidationErrors = (errors: Record<string, string>) => {
    const errorList = Object.values(errors);
    if (errorList.length > 0) {
      toast({
        title: "Validation Error",
        description: (
          <div className="mt-2 space-y-2">
            <p>Please fix the following errors:</p>
            <ul className="list-disc pl-4 space-y-1">
              {errorList.map((error, index) => (
                <li key={index} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        ),
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleAddEmployee = async () => {
    const requiredFields = [
      "name",
      "role",
      "department",
      "email",
      "phone",
      "location",
      "githubUsername",
      "skills",
    ];

    if (!validateForm(newEmployee, requiredFields)) {
      displayValidationErrors(formErrors);
      return;
    }

    const newEmployeeData = {
      name: newEmployee.name,
      role: newEmployee.role,
      email: newEmployee.email,
      department: newEmployee.department,
      contact: newEmployee.phone,
      location: newEmployee.location,
      githubUsername: newEmployee.githubUsername,
      skills: newEmployee.skills,
      status: "ACTIVE",
      employerId: localStorage.getItem("adminId"),
    };
    setIsAddEmployeeOpen(false);
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/employees/create`, {
        method: "POST",
        headers: {
          "x-api-key": "thisisasdca",
          "Content-Type": "application/json",
          Authorization: `Authorization ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(newEmployeeData),
      });

      const data = await response.json();
      if (response.status === 400 || data.error === "Employee limit reached") {
        toast({
          title: "Limit Reached",
          description: "You have reached your Employee Creation limit.",
          variant: "destructive",
        });
      }
      if (!response.ok) {
        if (data.message) {
          if (
            typeof data.message === "string"
              ? data.message
              : JSON.stringify(data.message) === "Employee limit reached"
          ) {
            toast({
              title: "Limit Reached",
              description: "You have reached your Employee Creation limit.",

              variant: "destructive",
            });
            return;
          }
          try {
            const errorObj =
              typeof data.message === "string"
                ? JSON.parse(data.message)
                : data.message;
            if (Array.isArray(errorObj)) {
              const errors: Record<string, string> = {};
              errorObj.forEach((err: any) => {
                if (err.path && err.path.length > 0) {
                  const key = String(err.path[0]);
                  errors[key] = err.message as string;
                }
              });
              setFormErrors(errors);
            }
          } catch (e) {
            setFormErrors(data.errors || {});
          }
          setIsAddEmployeeOpen(false);
          throw new Error(
            typeof data.message === "string"
              ? data.message
              : JSON.stringify(data.message)
          );
        } else {
          setIsAddEmployeeOpen(false);
          throw new Error("Adding employee failed");
        }
      } else {
        setIsAddEmployeeOpen(false);
        toast({
          title: "Limit Reached",
          description: "You have reached your Employee Creation limit.",
          variant: "destructive",
        });
      }

      const formattedNewEmployee: Employee = {
        id: data.data.id,
        name: data.data.name,
        role: data.data.role,
        department: data.data.department,
        email: data.data.email,
        phone: data.data.contact,
        location: data.data.location,
        githubUsername: data.data.githubUsername || "",
        joinDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        avatar: data.data.name
          .split(" ")
          .map((n: string) => n[0])
          .join(""),
        skills: data.data.skills || [],
        projects: [],
        status: data.data.status === "ACTIVE" ? "Active" : data.data.status,
      };

      setEmployees([...employees, formattedNewEmployee]);
      setIsAddEmployeeOpen(false);
      setNewEmployee({
        name: "",
        role: "",
        department: "",
        email: "",
        phone: "",
        location: "",
        githubUsername: "",
        skills: [],
      });
      showSuccess("Employee added successfully");
    } catch (err: any) {
      console.error("Error adding employee:", err);
      toast({
        title: "Error",
        description: `Failed to add employee: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation for specific fields
    if (name === "email" && value.trim() !== "") {
      if (!isValidEmail(value)) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "Please enter a valid email address",
        }));
      } else {
        // Clear error for this field if it exists
        setFormErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    } else if (name === "phone" && value.trim() !== "") {
      if (!isValidPhone(value)) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "Please enter a valid phone number",
        }));
      } else {
        // Clear error for this field if it exists
        setFormErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    } else if (name === "githubUsername" && value.includes(" ")) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "GitHub username cannot contain spaces",
      }));
    } else if (formErrors[name]) {
      // Clear error for this field if it exists
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleUpdateEmployee = async () => {
    if (!selectedEmployee) return;

    // Validate required fields
    const requiredFields = [
      "name",
      "role",
      "department",
      "email",
      "phone",
      "location",
      "githubUsername",
      "skills",
    ];

    if (!validateForm(selectedEmployee, requiredFields)) {
      displayValidationErrors(formErrors);
      return;
    }

    try {
      setIsLoading(true);
      // Store the current projects to preserve them
      const currentProjects = selectedEmployee.projects;

      const res = await fetch(`${API_URL}/employees/${selectedEmployee.id}`, {
        method: "PUT",
        headers: {
          "x-api-key": "thisisasdca",
          "Content-Type": "application/json",
          Authorization: `Authorization ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          name: selectedEmployee.name,
          role: selectedEmployee.role,
          department: selectedEmployee.department,
          email: selectedEmployee.email,
          contact: selectedEmployee.phone,
          location: selectedEmployee.location,
          githubUsername: selectedEmployee.githubUsername,
          skills: selectedEmployee.skills,
          status: "ACTIVE",
          employerId: localStorage.getItem("adminId"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message) {
          try {
            const errorObj =
              typeof data.message === "string"
                ? JSON.parse(data.message)
                : data.message;
            if (Array.isArray(errorObj)) {
              const errors: Record<string, string> = {};
              errorObj.forEach((err: any) => {
                if (err.path && err.path.length > 0) {
                  const key = String(err.path[0]);
                  errors[key] = err.message as string;
                }
              });
              setFormErrors(errors);
            }
          } catch (e) {
            setFormErrors(data.errors || {});
          }
          throw new Error(
            typeof data.message === "string"
              ? data.message
              : JSON.stringify(data.message)
          );
        } else {
          throw new Error("Updating employee failed");
        }
      }

      if (data.success) {
        setEmployees(
          employees.map((e) =>
            e.id === selectedEmployee.id
              ? {
                  ...e,
                  name: data.data.name,
                  role: data.data.role,
                  department: data.data.department,
                  email: data.data.email,
                  phone: data.data.contact,
                  location: data.data.location,
                  githubUsername: data.data.githubUsername || "",
                  skills: Array.isArray(data.data.skills)
                    ? data.data.skills
                    : [],
                  // Preserve projects if they're not in the response
                  projects:
                    Array.isArray(data.data.projectsAssigned) &&
                    data.data.projectsAssigned.length > 0
                      ? data.data.projectsAssigned.map((project: any) => ({
                          id: project.id,
                          name: project.name,
                        }))
                      : currentProjects,
                  status:
                    data.data.status === "ACTIVE" ? "Active" : data.data.status,
                }
              : e
          )
        );
        setIsEditEmployeeOpen(false);
        setSelectedEmployee(null);
        showSuccess("Employee updated successfully");
      } else {
        throw new Error(data.message || "Updating employee failed");
      }
    } catch (err: any) {
      console.error("Error updating employee:", err);
      toast({
        title: "Error",
        description: `Failed to update employee: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee({
      ...employee,
      skills: Array.isArray(employee.skills) ? employee.skills : [],
    });
    setEditSkillInput("");
    setIsEditEmployeeOpen(true);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!selectedEmployee) return;

    const { name, value } = e.target;
    setSelectedEmployee((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });

    // Real-time validation for specific fields
    if (name === "email" && value.trim() !== "") {
      if (!isValidEmail(value)) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "Please enter a valid email address",
        }));
      } else {
        // Clear error for this field if it exists
        setFormErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    } else if (name === "phone" && value.trim() !== "") {
      if (!isValidPhone(value)) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "Please enter a valid phone number",
        }));
      } else {
        // Clear error for this field if it exists
        setFormErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    } else if (name === "githubUsername" && value.includes(" ")) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "GitHub username cannot contain spaces",
      }));
    } else if (formErrors[name]) {
      // Clear error for this field if it exists
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleEditSelectChange = (name: string, value: string) => {
    if (!selectedEmployee) return;

    setSelectedEmployee((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleAssignProject = async () => {
    if (!selectedEmployee || !selectedProject) {
      toast({
        title: "Error",
        description: "Please select a project to assign",
        variant: "destructive",
      });
      return;
    }

    // Check if project is already assigned
    const isAlreadyAssigned = selectedEmployee.projects.some(
      (project) => project.id === selectedProject
    );

    if (isAlreadyAssigned) {
      toast({
        title: "Warning",
        description: "This project is already assigned to the employee",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/employees/add-project`, {
        method: "POST",
        headers: {
          "x-api-key": "thisisasdca",
          "Content-Type": "application/json",
          Authorization: `Authorization ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          employeeId: selectedEmployee.id,
          projectId: selectedProject,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to assign project");
      }

      // Find the project details
      const assignedProject = projects.find((p) => p.id === selectedProject);

      if (assignedProject) {
        // Update the employee's projects list
        const updatedEmployees = employees.map((emp) => {
          if (emp.id === selectedEmployee.id) {
            return {
              ...emp,
              projects: [
                ...emp.projects,
                { id: assignedProject.id, name: assignedProject.name },
              ],
            };
          }
          return emp;
        });

        setEmployees(updatedEmployees);

        // Update the selected employee if it's still open
        if (selectedEmployee) {
          setSelectedEmployee({
            ...selectedEmployee,
            projects: [
              ...selectedEmployee.projects,
              { id: assignedProject.id, name: assignedProject.name },
            ],
          });
        }
      }

      setIsAssignProjectOpen(false);
      setSelectedProject("");
      showSuccess("Project assigned successfully");
    } catch (err: any) {
      console.error("Error assigning project:", err);
      toast({
        title: "Error",
        description: `Failed to assign project: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmRemoveProject = (
    employeeId: string,
    projectId: string,
    projectName: string
  ) => {
    setRemoveProjectConfirmation({
      isOpen: true,
      employeeId,
      projectId,
      projectName,
    });
  };

  const handleRemoveProject = async () => {
    const { employeeId, projectId, projectName } = removeProjectConfirmation;

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/employees/remove-project`, {
        method: "POST",
        headers: {
          "x-api-key": "thisisasdca",
          "Content-Type": "application/json",
          Authorization: `Authorization ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          employeeId,
          projectId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove project");
      }

      // Update the employees list
      const updatedEmployees = employees.map((emp) => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            projects: emp.projects.filter((p) => p.id !== projectId),
          };
        }
        return emp;
      });

      setEmployees(updatedEmployees);

      // Update the selected employee if it's still open
      if (selectedEmployee && selectedEmployee.id === employeeId) {
        setSelectedEmployee({
          ...selectedEmployee,
          projects: selectedEmployee.projects.filter((p) => p.id !== projectId),
        });
      }

      showSuccess(`Removed ${projectName} from employee`);
    } catch (err: any) {
      console.error("Error removing project:", err);
      toast({
        title: "Error",
        description: `Failed to remove project: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setRemoveProjectConfirmation({
        isOpen: false,
        employeeId: "",
        projectId: "",
        projectName: "",
      });
    }
  };

  const confirmRemoveEmployee = (employeeId: string, employeeName: string) => {
    setRemoveEmployeeConfirmation({
      isOpen: true,
      employeeId,
      employeeName,
    });
  };

  const handleRemoveEmployee = async () => {
    const { employeeId } = removeEmployeeConfirmation;

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/employees/${employeeId}`, {
        method: "DELETE",
        headers: {
          "x-api-key": "thisisasdca",
          "Content-Type": "application/json",
          Authorization: `Authorization ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove employee");
      }

      if (data.success) {
        setEmployees(employees.filter((e) => e.id !== employeeId));
        setIsEditEmployeeOpen(false);
        setSelectedEmployee(null);

        showSuccess("Employee removed successfully");
      } else {
        throw new Error(data.message || "Failed to remove employee");
      }
    } catch (err: any) {
      console.error("Error removing employee:", err);
      toast({
        title: "Error",
        description: `Failed to remove employee: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setRemoveEmployeeConfirmation({
        isOpen: false,
        employeeId: "",
        employeeName: "",
      });
    }
  };

  const handleAssignProjectClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsAssignProjectOpen(true);
  };

  const getAvailableProjects = () => {
    if (!selectedEmployee) return projects;

    // Filter out projects that are already assigned to the employee
    const assignedProjectIds = selectedEmployee.projects.map((p) => p.id);
    return projects.filter(
      (project) => !assignedProjectIds.includes(project.id)
    );
  };

  return (
    <div className="space-y-6 animate-fade-in px-4">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
            Team Members
          </h1>
          <p className="text-muted-foreground">
            Manage your team members and assign them to projects and tasks.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="flex flex-row items-center gap-4 p-6">
              <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800">
                <Briefcase className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Employees
                </p>
                <h3 className="text-2xl font-bold">{employees.length}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="flex flex-row items-center gap-4 p-6">
              <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800">
                <Filter className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Departments
                </p>
                <h3 className="text-2xl font-bold">
                  {[...new Set(employees.map((e) => e.department))].length}
                </h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="flex flex-row items-center gap-4 p-6">
              <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800">
                <Github className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  GitHub Users
                </p>
                <h3 className="text-2xl font-bold">
                  {employees.filter((e) => e.githubUsername).length}
                </h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="flex flex-row items-center gap-4 p-6">
              <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800">
                <Calendar className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Projects
                </p>
                <h3 className="text-2xl font-bold">{projects.length}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search employees..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <SelectValue placeholder="Filter by role" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roleOptions.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter by department" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departmentOptions.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600">
              <Plus className="h-4 w-4" /> Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
              <DialogDescription>
                Add a new employee to your team. They will be able to be
                assigned to projects and tasks.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newEmployee.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={formErrors.name ? "border-destructive" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-destructive">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newEmployee.email}
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com"
                      className={
                        formErrors.email ? "border-destructive pr-10" : ""
                      }
                    />
                    {formErrors.email && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      </div>
                    )}
                  </div>
                  {formErrors.email && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">
                    Role <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    name="role"
                    value={newEmployee.role}
                    onValueChange={(value) =>
                      handleInputChange({
                        target: { name: "role", value },
                      } as any)
                    }
                  >
                    <SelectTrigger
                      id="role"
                      className={formErrors.role ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.role && (
                    <p className="text-xs text-destructive">
                      {formErrors.role}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">
                    Department <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    name="department"
                    value={newEmployee.department}
                    onValueChange={(value) =>
                      handleInputChange({
                        target: { name: "department", value },
                      } as any)
                    }
                  >
                    <SelectTrigger
                      id="department"
                      className={
                        formErrors.department ? "border-destructive" : ""
                      }
                    >
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentOptions.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.department && (
                    <p className="text-xs text-destructive">
                      {formErrors.department}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      name="phone"
                      value={newEmployee.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className={
                        formErrors.phone ? "border-destructive pr-10" : ""
                      }
                    />
                    {formErrors.phone && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      </div>
                    )}
                  </div>
                  {formErrors.phone && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {formErrors.phone}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Format: +1 (555) 123-4567 or 555-123-4567
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">
                    Location <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={newEmployee.location}
                    onChange={handleInputChange}
                    placeholder="San Francisco, CA"
                    className={formErrors.location ? "border-destructive" : ""}
                  />
                  {formErrors.location && (
                    <p className="text-xs text-destructive">
                      {formErrors.location}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubUsername">
                  GitHub Username <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="githubUsername"
                    name="githubUsername"
                    value={newEmployee.githubUsername}
                    onChange={handleInputChange}
                    placeholder="johndoe"
                    className={
                      formErrors.githubUsername
                        ? "border-destructive pr-10"
                        : ""
                    }
                  />
                  {formErrors.githubUsername && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    </div>
                  )}
                </div>
                {formErrors.githubUsername && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {formErrors.githubUsername}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Your GitHub username without spaces
                </p>
              </div>

              {/* New tag-based skills input */}
              <div className="space-y-2">
                <Label htmlFor="skills">
                  Skills <span className="text-destructive">*</span>
                </Label>
                <div
                  className={`border rounded-md p-2 ${
                    formErrors.skills ? "border-destructive" : ""
                  }`}
                >
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newEmployee.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-2 py-1 text-xs"
                      >
                        {skill}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {skill}</span>
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="relative">
                    <Input
                      id="newSkill"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => handleSkillKeyDown(e)}
                      placeholder="Type a skill and press Enter"
                      className="pr-20"
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="absolute right-1 top-1 h-7"
                      onClick={() => handleAddSkill()}
                      disabled={!newSkillInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  {showSuggestions && (
                    <div className="mt-1 p-1 border rounded-md bg-white dark:bg-slate-800 shadow-sm">
                      <div className="text-xs text-muted-foreground mb-1">
                        Suggestions:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {skillSuggestions.slice(0, 5).map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={() => handleAddSkill(skill)}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {formErrors.skills && (
                    <p className="text-xs text-destructive mt-1">
                      {formErrors.skills}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Press Enter or click Add to add a skill
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddEmployeeOpen(false);
                  setFormErrors({});
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddEmployee}>Add Team Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditEmployeeOpen} onOpenChange={setIsEditEmployeeOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
              <DialogDescription>
                Update the details of your team member.
              </DialogDescription>
            </DialogHeader>
            {selectedEmployee && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={selectedEmployee.name}
                      onChange={handleEditInputChange}
                      placeholder="John Doe"
                      className={formErrors.name ? "border-destructive" : ""}
                    />
                    {formErrors.name && (
                      <p className="text-xs text-destructive">
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="edit-email"
                        name="email"
                        type="email"
                        value={selectedEmployee.email}
                        onChange={handleEditInputChange}
                        placeholder="john.doe@example.com"
                        className={
                          formErrors.email ? "border-destructive pr-10" : ""
                        }
                      />
                      {formErrors.email && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        </div>
                      )}
                    </div>
                    {formErrors.email && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">
                      Role <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      name="role"
                      value={selectedEmployee.role}
                      onValueChange={(value) =>
                        handleEditSelectChange("role", value)
                      }
                    >
                      <SelectTrigger
                        id="edit-role"
                        className={formErrors.role ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.role && (
                      <p className="text-xs text-destructive">
                        {formErrors.role}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-department">
                      Department <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      name="department"
                      value={selectedEmployee.department}
                      onValueChange={(value) =>
                        handleEditSelectChange("department", value)
                      }
                    >
                      <SelectTrigger
                        id="edit-department"
                        className={
                          formErrors.department ? "border-destructive" : ""
                        }
                      >
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentOptions.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.department && (
                      <p className="text-xs text-destructive">
                        {formErrors.department}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="edit-phone"
                        name="phone"
                        value={selectedEmployee.phone}
                        onChange={handleEditInputChange}
                        placeholder="+1 (555) 123-4567"
                        className={
                          formErrors.phone ? "border-destructive pr-10" : ""
                        }
                      />
                      {formErrors.phone && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        </div>
                      )}
                    </div>
                    {formErrors.phone && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {formErrors.phone}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Format: +1 (555) 123-4567 or 555-123-4567
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-location">
                      Location <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="edit-location"
                      name="location"
                      value={selectedEmployee.location}
                      onChange={handleEditInputChange}
                      placeholder="San Francisco, CA"
                      className={
                        formErrors.location ? "border-destructive" : ""
                      }
                    />
                    {formErrors.location && (
                      <p className="text-xs text-destructive">
                        {formErrors.location}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-githubUsername">
                    GitHub Username <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-githubUsername"
                    name="githubUsername"
                    value={selectedEmployee.githubUsername}
                    onChange={handleEditInputChange}
                    placeholder="johndoe"
                    className={
                      formErrors.githubUsername ? "border-destructive" : ""
                    }
                  />
                  {formErrors.githubUsername && (
                    <p className="text-xs text-destructive">
                      {formErrors.githubUsername}
                    </p>
                  )}
                </div>

                {/* New tag-based skills input for edit mode */}
                <div className="space-y-2">
                  <Label htmlFor="edit-skills">
                    Skills <span className="text-destructive">*</span>
                  </Label>
                  <div
                    className={`border rounded-md p-2 ${
                      formErrors.skills ? "border-destructive" : ""
                    }`}
                  >
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedEmployee.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-2 py-1 text-xs"
                        >
                          {skill}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => handleRemoveEditSkill(skill)}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove {skill}</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="relative">
                      <Input
                        id="editSkill"
                        value={editSkillInput}
                        onChange={(e) => setEditSkillInput(e.target.value)}
                        onKeyDown={(e) => handleSkillKeyDown(e, true)}
                        placeholder="Type a skill and press Enter"
                        className="pr-20"
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="absolute right-1 top-1 h-7"
                        onClick={() => handleAddEditSkill()}
                        disabled={!editSkillInput.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    {showSuggestions && (
                      <div className="mt-1 p-1 border rounded-md bg-white dark:bg-slate-800 shadow-sm">
                        <div className="text-xs text-muted-foreground mb-1">
                          Suggestions:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {skillSuggestions.slice(0, 5).map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                              onClick={() => handleAddEditSkill(skill)}
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {formErrors.skills && (
                      <p className="text-xs text-destructive mt-1">
                        {formErrors.skills}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Press Enter or click Add to add a skill
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Projects</Label>
                  <div className="border rounded-md p-3">
                    {selectedEmployee.projects.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedEmployee.projects.map((project) => (
                          <div
                            key={project.id}
                            className="flex items-center gap-1 bg-muted rounded-md px-2 py-1"
                          >
                            <span className="text-sm">{project.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 rounded-full"
                              onClick={() =>
                                confirmRemoveProject(
                                  selectedEmployee.id,
                                  project.id,
                                  project.name
                                )
                              }
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No projects assigned
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditEmployeeOpen(false);
                  setSelectedEmployee(null);
                  setFormErrors({});
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateEmployee}
                disabled={!selectedEmployee}
              >
                Update Team Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog
          open={isAssignProjectOpen}
          onOpenChange={setIsAssignProjectOpen}
        >
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-slate-500" />
                Assign Project
              </DialogTitle>
              <DialogDescription>
                Assign a project to{" "}
                <span className="font-medium">
                  {selectedEmployee?.name || "this employee"}
                </span>
                .
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {selectedEmployee && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md border border-slate-200 dark:border-slate-700">
                  <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
                    <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {selectedEmployee.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedEmployee.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedEmployee.role}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="project" className="text-base">
                  Select Project <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedProject}
                  onValueChange={setSelectedProject}
                >
                  <SelectTrigger id="project" className="h-10">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableProjects().map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                          <span>{project.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedEmployee && selectedEmployee.projects.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm mb-2 block">
                      Current Projects
                    </Label>
                    <div className="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-md border border-slate-200 dark:border-slate-700">
                      {selectedEmployee.projects.map((project, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-white dark:bg-slate-800"
                        >
                          {project.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {getAvailableProjects().length === 0 && (
                  <div className="flex items-center gap-2 p-3 mt-2 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-md border border-amber-200 dark:border-amber-800">
                    <AlertTriangle className="h-4 w-4" />
                    <p className="text-sm">
                      All available projects are already assigned to this
                      employee.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAssignProjectOpen(false);
                  setSelectedProject("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignProject}
                disabled={
                  !selectedProject || getAvailableProjects().length === 0
                }
                className="bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                Assign Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Remove Project Confirmation Dialog */}
      <AlertDialog
        open={removeProjectConfirmation.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setRemoveProjectConfirmation({
              isOpen: false,
              employeeId: "",
              projectId: "",
              projectName: "",
            });
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Project Removal
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-medium">
                {removeProjectConfirmation.projectName}
              </span>{" "}
              from this employee? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Employee Confirmation Dialog */}
      <AlertDialog
        open={removeEmployeeConfirmation.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setRemoveEmployeeConfirmation({
              isOpen: false,
              employeeId: "",
              employeeName: "",
            });
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Employee Removal
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-medium">
                {removeEmployeeConfirmation.employeeName}
              </span>{" "}
              from your team? This action cannot be undone and will remove all
              project assignments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveEmployee}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList className="bg-slate-100 dark:bg-slate-800/50 w-full sm:w-auto">
          <TabsTrigger
            value="grid"
            className="flex-1 sm:flex-initial data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
          >
            Grid View
          </TabsTrigger>
          <TabsTrigger
            value="table"
            className="flex-1 sm:flex-initial data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
          >
            Table View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <Card
                  key={employee.id}
                  className="overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700 hover:translate-y-[-2px]"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{employee.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">
                            {employee.name}
                          </CardTitle>
                          <CardDescription>{employee.role}</CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={
                          employee.status === "Active" ? "outline" : "secondary"
                        }
                      >
                        {employee.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2 space-y-4">
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{employee.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{employee.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4 text-muted-foreground" />
                        <span>{employee.githubUsername || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Joined {employee.joinDate}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(employee.skills) &&
                        employee.skills.length > 0 ? (
                          employee.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No skills listed
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Projects</h4>
                        {Array.isArray(employee.projects) &&
                          employee.projects.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {employee.projects.length}
                            </Badge>
                          )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(employee.projects) &&
                        employee.projects.length > 0 ? (
                          employee.projects.map((project, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-md px-2 py-1 border border-slate-200 dark:border-slate-700 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
                            >
                              <span className="text-xs font-medium">
                                {project.name}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmRemoveProject(
                                    employee.id,
                                    project.id,
                                    project.name
                                  );
                                }}
                              >
                                <X className="h-2 w-2" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-center w-full p-2 border border-dashed rounded-md border-slate-200 dark:border-slate-700">
                            <span className="text-xs text-muted-foreground">
                              No projects assigned
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => handleEditClick(employee)}
                        >
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => handleAssignProjectClick(employee)}
                        >
                          Assign to Project
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onSelect={() =>
                            confirmRemoveEmployee(employee.id, employee.name)
                          }
                          className="text-destructive"
                        >
                          Remove Employee
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                <div className="rounded-full bg-muted p-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  No employees found
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We couldn't find any team members matching your search
                  criteria.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-700 dark:text-slate-300">
                      Name
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-700 dark:text-slate-300">
                      Role
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-700 dark:text-slate-300">
                      Department
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-700 dark:text-slate-300">
                      Email
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-700 dark:text-slate-300">
                      GitHub
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-700 dark:text-slate-300">
                      Location
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-700 dark:text-slate-300">
                      Projects
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-700 dark:text-slate-300">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-700 dark:text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee, idx) => (
                      <tr
                        key={employee.id}
                        className={`border-b border-slate-200 dark:border-slate-700 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                          idx % 2 === 0
                            ? "bg-white dark:bg-transparent"
                            : "bg-slate-50/50 dark:bg-slate-800/20"
                        }`}
                      >
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700">
                              <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                {employee.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{employee.name}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">{employee.role}</td>
                        <td className="p-4 align-middle">
                          <Badge variant="outline" className="font-normal">
                            {employee.department}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <a
                            href={`mailto:${employee.email}`}
                            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                          >
                            {employee.email}
                          </a>
                        </td>
                        <td className="p-4 align-middle">
                          {employee.githubUsername ? (
                            <a
                              href={`https://github.com/${employee.githubUsername}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                            >
                              <Github className="h-3.5 w-3.5" />
                              {employee.githubUsername}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <span>{employee.location}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            {Array.isArray(employee.projects) &&
                            employee.projects.length > 0 ? (
                              <>
                                <Badge className="bg-slate-700 hover:bg-slate-600 text-white">
                                  {employee.projects.length}
                                </Badge>
                                <div className="flex flex-wrap gap-1">
                                  {employee.projects
                                    .slice(0, 2)
                                    .map((project, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                      >
                                        {project.name}
                                      </Badge>
                                    ))}
                                  {employee.projects.length > 2 && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-6 text-xs px-2 py-0 border-slate-300 dark:border-slate-600"
                                        >
                                          +{employee.projects.length - 2} more
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="start"
                                        className="w-48"
                                      >
                                        {employee.projects
                                          .slice(2)
                                          .map((project, index) => (
                                            <DropdownMenuItem
                                              key={index}
                                              className="text-sm"
                                            >
                                              {project.name}
                                            </DropdownMenuItem>
                                          ))}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                              </>
                            ) : (
                              <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800">
                                No projects
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <Badge
                            variant={
                              employee.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              employee.status === "Active"
                                ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/40"
                                : ""
                            }
                          >
                            {employee.status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                              onClick={() => handleEditClick(employee)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                                <path d="m15 5 4 4"></path>
                              </svg>
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                              onClick={() => handleAssignProjectClick(employee)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="12" x2="12" y1="18" y2="12"></line>
                                <line x1="9" x2="15" y1="15" y2="15"></line>
                              </svg>
                              <span className="sr-only">Assign Project</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                              onClick={() =>
                                confirmRemoveEmployee(
                                  employee.id,
                                  employee.name
                                )
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              </svg>
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800">
                            <Search className="h-6 w-6 text-slate-400" />
                          </div>
                          <h3 className="mt-2 text-lg font-semibold">
                            No employees found
                          </h3>
                          <p className="text-sm text-muted-foreground max-w-md">
                            We couldn't find any team members matching your
                            search criteria. Try adjusting your filters or
                            search term.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 dark:bg-slate-950/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-800 dark:border-slate-200"></div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Processing your request...
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 text-center max-w-xs">
              This may take a moment. Please don't refresh the page.
            </p>
          </div>
        </div>
      )}
      {showSuccessAnimation && (
        <div className="fixed inset-0 bg-white/50 dark:bg-slate-950/50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-green-600 dark:text-green-400"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
              {successMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
