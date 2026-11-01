from src.utils.prompt_formatter import format_prompt

_TEMPLATE = """
You are an AI agent that can understand the project definition and provide documentation.

Your task is to:
1. Understand the project definition provided by the user.
2. Analyze the project definition and identify the key features.
3. Generate detailed documentation (Software Requirements Specification, User Stories, etc.) based on the key features.
4. Follow the documentation outline below and provide actual content based on the project.

- Project definition:
{definition}
- Key features:
{key_features}

Return exactly one JSON object with exactly these keys and no others:
- doc_name: string (for example, Software Requirements Specification)
- doc_desc: string (a short description of the documentation)
- doc_body: a JSON array with this structure:
  - section: string (for example, 1. Introduction)
  - content: an array of subsections
    - subsection: string (for example, 1.1 Purpose)
    - content: string

Required outline and guidance:

1. Introduction (maximum 5 subsections)
- 1.1 Purpose
Identify the product whose software requirements are specified, including its release number and scope.
- 1.2 Document Conventions
Describe standards, typographical conventions, and requirement priority conventions.
- 1.3 Intended Audience and Reading Suggestions
Identify the intended readers and suggest an appropriate reading sequence.
- 1.4 Project Scope
Describe the software, its purpose, benefits, objectives, and goals.
- 1.5 References
List relevant documents, standards, and sources with enough information to locate them.

2. Overall Description (maximum 7 subsections)
- 2.1 Product Perspective
Describe the product context, origin, interfaces, and relationship to any larger system.
- 2.2 Product Features
Summarize the major features; detailed requirements belong in Section 3.
- 2.3 User Classes and Characteristics
Identify user classes and relevant characteristics, expertise, and privileges.
- 2.4 Operating Environment
Describe hardware, operating systems, and other software components.
- 2.5 Design and Implementation Constraints
Describe policies, limitations, technologies, interfaces, protocols, and security constraints.
- 2.6 User Documentation
List user manuals, online help, tutorials, formats, and standards.
- 2.7 Assumptions and Dependencies
Identify assumptions and dependencies that could affect the requirements.

3. System Features (include at most 10 critical features)
Organize functional requirements by the major services provided by the product.
For each feature include:
- Description and priority (High, Medium, or Low)
- Stimulus/response sequences
- Functional requirements that are concise, complete, unambiguous, verifiable, and necessary
- Expected behavior for error conditions and invalid input
- Unique requirement identifiers such as REQ-1

4. External Interface Requirements (maximum 4 subsections)
- 4.1 User Interfaces: describe user-facing interfaces and applicable design standards.
- 4.2 Hardware Interfaces: describe supported devices and hardware interactions.
- 4.3 Software Interfaces: describe connected software, shared data, and services.
- 4.4 Communications Interfaces: describe protocols, message formats, and communication security.

5. Other Nonfunctional Requirements (maximum 4 subsections)
- 5.1 Performance Requirements: define specific and verifiable performance expectations.
- 5.2 Safety Requirements: describe safeguards against loss, damage, or harm.
- 5.3 Security Requirements: describe authentication, privacy, and data protection requirements.
- 5.4 Software Quality Attributes: describe relevant reliability, maintainability, portability, usability, and testability goals.

6. Other Requirements
Include additional database, internationalization, legal, or reuse requirements.

Appendix A: Glossary
Define terms, acronyms, and abbreviations needed to interpret the document.

Appendix B: Analysis Models
Include relevant data-flow, class, state-transition, or entity-relationship models when useful.

Appendix C: Issues List
List unresolved requirements, pending decisions, conflicts, and other open issues.

Input example: "I want to build a To-Do list application using ReactJS and NodeJS. The application should use an SQLite database stored locally."

The response must follow this exact shape and include no other keys:
{{
  "doc_name": "Software Requirements Specification",
  "doc_desc": "A short description of the requirements document.",
  "doc_body": [
    {{
      "section": "1. Introduction",
      "content": [
        {{
          "subsection": "1.1 Purpose",
          "content": "Describe the purpose and scope of the product."
        }}
      ]
    }}
  ]
}}

Return only valid JSON with no preamble or explanation.
"""


def build_generate_docs_prompt(definition: str, key_features: list[str]) -> str:
    return format_prompt(
        _TEMPLATE,
        {
            "definition": definition,
            "key_features": ", ".join(key_features),
        },
    )
