from src.utils.prompt_formatter import format_prompt

_TEMPLATE = r"""
You are the best sotware engineer in the world. Which is hired to generate use case diagrams in Mermaid chart format.
Here is the project definition to be implemented:
{definition}
Your task is to generate a Mermaid diagram code for the use case diagram, focusing on the following:
1. Actors involved in the system (e.g., Patient, Doctor).
2. Use cases (e.g., Schedule Appointment, View Medical History).
3. Relationships between actors and use cases (e.g., Patient -- "schedules" --> Appointment).
4. Include any relevant details such as preconditions, postconditions, and triggers if mentioned in the definition.
5. Use the Mermaid chart format for the diagram.
Return exactly one JSON object with exactly one key, "use_case_diagram", whose value is the Mermaid chart code. Do not include any other keys.
Prepare the diagram according to the definition only. Do not include any explanation, extra text, or preamble.
Only provide the raw JSON output with the Mermaid code in the correct format. Strictly follow the format and syntax. dont use bad syntax like this UC15[Data Protection (GDPR, FERPA)]
For example: Definition: Student Management System
"use_case_diagram":
"graph TD
    %% Actors
Student((Student))
Parent((Parent))
Faculty((Faculty))
Administrator((Administrator))

    %% Use Cases
UC1[Login to System]
UC2[View Academic Progress]
UC3[View Attendance]
UC4[View Grades]
UC5[Make Tuition Payments]
UC6[Communicate with Faculty/Admin]
UC7[Update Profile]
UC8[View Student Progress]
UC9[View Student Attendance]
UC10[View Student Grades]
UC11[Manage Student Grades]
UC12[Manage Student Attendance]
UC13[Communicate with Students/Parents/Admin]
UC14[View Student Profiles]
UC15[Identify At-Risk Students]
UC16[Manage Student Admissions]
UC17[Generate Reports]
UC18[Manage User Accounts]
UC19[Manage Financial Transactions]
UC20[Allocate Scholarships]
UC21[Monitor System Performance]
UC22[Manage Data Security and Privacy]
UC23[Configure System Settings]
UC24[Perform Predictive Analytics]

    %% Included Use Cases
UC25[Role-Based Access Control]
UC26[AI-Driven Performance Analytics]
UC27[Customizable Reports and Dashboards]
UC28[Biometric Attendance Tracking]
UC29[Invoicing and Payment Tracking]
UC30[Student Lifecycle Management]

    %% Student Relationships
Student -->|uses| UC1
Student -->|uses| UC2
Student -->|uses| UC3
Student -->|uses| UC4
Student -->|uses| UC5
Student -->|uses| UC6
Student -->|uses| UC7

    %% Parent Relationships
Parent -->|uses| UC1
Parent -->|uses| UC8
Parent -->|uses| UC9
Parent -->|uses| UC10
Parent -->|uses| UC5
Parent -->|uses| UC6

    %% Faculty Relationships
Faculty -->|uses| UC1
Faculty -->|uses| UC11
Faculty -->|uses| UC12
Faculty -->|uses| UC13
Faculty -->|uses| UC14
Faculty -->|uses| UC15

    %% Administrator Relationships
Administrator -->|uses| UC1
Administrator -->|uses| UC16
Administrator -->|uses| UC17
Administrator -->|uses| UC18
Administrator -->|uses| UC19
Administrator -->|uses| UC20
Administrator -->|uses| UC21
Administrator -->|uses| UC22
Administrator -->|uses| UC23
Administrator -->|uses| UC24

    %% Include Relationships
UC1 -->|includes| UC25
UC11 -->|includes| UC26
UC17 -->|includes| UC27
UC12 -->|includes| UC28
UC19 -->|includes| UC29
UC16 -->|includes| UC30";
"""


def build_use_case_diagram_prompt(definition: str) -> str:
    return format_prompt(_TEMPLATE, {"definition": definition})
