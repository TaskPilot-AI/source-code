from src.utils.prompt_formatter import format_prompt

_TEMPLATE = r"""
You are an AI-powered agent that generates Entity-Relationship (ER) diagrams in Mermaid chart format.
Here is the project definition to be implemented:
{definition}
Here is the key features to be implemented:
{key_features}

Your task is to generate a Mermaid diagram code for the Entity-Relationship diagram, focusing on the following:
1. Entities involved in the system (e.g., Patient, Doctor, Appointment).
2. Attributes of each entity (e.g., Patient: ID, Name, Age).
3. Relationships between entities (e.g., Patient -- "makes" --> Appointment).
4. Cardinality (e.g., one-to-many, many-to-one) between entities.
5. Indicate any primary keys and foreign keys if mentioned in the definition.

Return exactly one JSON object with exactly one key, "er_diagram", whose value is the Mermaid chart code. Do not include any other keys.
Prepare the diagram according to the definition only. Do not include any explanation, extra text, or preamble.
Only provide the raw JSON output with the Mermaid code in the correct format.

For example: Definition: Hospital Management System
"er_diagram":"erDiagram
  STUDENT ||--o{ ORDER : places
  STUDENT ||--o{ ADMISSION : applies
  STUDENT ||--o{ COMMUNICATIONCHANNEL : uses
  STUDENT ||--o{ ATTENDANCE : has
  STUDENT ||--o{ GRADINGSYSTEM : receives
  STUDENT ||--o{ ACADEMICPROGRESS : achieves
  FINANCIALTRANSACTION ||--o{ STUDENT : related_to
  FINANCIALTRANSACTION ||--o{ ORDER : pertains_to

  STUDENT {
    string name
    string studentId PK
    string email
    string phone
    string password
    string role
  }
  ORDER {
    string orderId PK
    string status
  }
  ADMISSION {
    string admissionId PK
    string status
  }
  COMMUNICATIONCHANNEL {
    string channelId PK
    string type
  }
  ATTENDANCE {
    string attendanceId PK
    date date
    bool present
  }
  GRADINGSYSTEM {
    string gradeId PK
    string subject
    string grade
  }
  ACADEMICPROGRESS {
    string progressId PK
    string description
  }
  FINANCIALTRANSACTION {
    string transactionId PK
    float amount
    string type
  }"
"""


def build_er_diagram_prompt(definition: str, key_features: list[str]) -> str:
    return format_prompt(
        _TEMPLATE,
        {
            "definition": definition,
            "key_features": ", ".join(key_features),
        },
    )
