import json
import os
import time
from agents import *
from .models.gemini.interface import init_gemini
from langchain_core.prompts import PromptTemplate

import warnings
warnings.filterwarnings("ignore")


def redefine_defination(project_name, defination):
    new_defination = init_gemini()
    template = f"""
                You are an AI agent that can understand the project definition and provide a new one.
                
                Your task is to:
                    1. Understand the project definition provided by the user.
                    2. Analyze the project definition and identify any inconsistencies or errors.
                    3. Suggest a new project definition that is more accurate and aligned with the original one.
                    
                - Return all information in a structured JSON format.
                - Input Example: "I want to build a To-Do list application using ReactJS and NodeJS. The application should use an SQLite database stored locally."
                - Generated Response Structure
                    "new_defination": "I understand that you want to build a To-Do list application using ReactJS and NodeJS. The application should use an SQLite database stored locally and should be responsive to all devices. The application should have a user-friendly interface and should allow users to easily add, edit, and delete tasks. The application should also have a backend server that can handle CRUD operations and integrate with the SQLite database. Additionally, the application should have unit tests to ensure its functionality and should be deployed on a cloud-based platform such as AWS or Azure."
                    
                Key Considerations:
                Ensure the JSON output is well-structured and ready for implementation.
                
                Here is the project name and defination to be implemented.
                {project_name}:
                {defination}
                provide sole output as json no preemble explaination required.
                """

    prompt = PromptTemplate(template=template, input_variables=["defination"])

    requirements_chain = prompt | new_defination

    result = requirements_chain.invoke({"defination": defination})

    start_idx = result.find("{")
    end_idx = result.rfind("}") + 1

    result = result[start_idx:end_idx]
    # with open("./agents-service/docs/redefned_defination.txt", "w") as f:
    #     f.write(result)
    return result


def key_features_identification(defination):
    key_features_finder = init_gemini()
    template = f"""
                You are an AI agent that can understand the project definition and provide a list of key features.
                
                Your task is to:
                    1. Understand the project definition provided by the user.
                    2. Analyze the project definition and identify the key features.
                    3. Provide a list of all key features in a structured JSON format.
                    
                - Return all information in a structured JSON format.
                - Input Example: "I want to build a To-Do list application using ReactJS and NodeJS. The application should use an SQLite database stored locally."
                - This are some examples of key features in the project defination. You can identify from this list of features or other features that are important for the project.
                    1. User Authentication
                    2. Data Analytics
                    3. File Upload/Download
                    4. Reporting
                    5. Mobile Res onsiveness
                    6. Payment Processing
                    7. Real-time Updates
                    8. API Integration
                    9. Admin Dashboard
                    10. Notifications

                - Generated Response Structure
                    "key_features": ["Responsive design", "User-friendly interface", "Database integration", "Unit testing", "Deployment on cloud"]
                    
                Key Considerations:
                Ensure the JSON output is well-structured and ready for implementation.
                
                Here is the project defination to be implemented.
                {defination}
                provide sole output as json no preemble explaination required.
                """

    prompt = PromptTemplate(template=template, input_variables=["defination"])

    requirements_chain = prompt | key_features_finder

    result = requirements_chain.invoke({"defination": defination})

    start_idx = result.find("{")
    end_idx = result.rfind("}") + 1

    result = result[start_idx:end_idx]
    # with open("./agents-service/docs/key_features.txt", "w") as f:
    #     f.write(result)
    return result


def generate_documentation(defination, key_features):
    generate_docs = init_gemini(temperature=1)

    template = f"""
                   You are an AI agent that can understand the project definition and provide a documentation. 
                   
                   Your task is to:
                       1. Understand the project definition provided by the user.
                       2. Analyze the project definition and identify the key features.
                       3. Generate a documentation (Software Requirements Specification, User Stories, etc.) based on the key features.
                       4. I have provided outline of the documentation. Please provide the actual content by understanding the project definition and key features and generate very very detailed documentation.
                    
                    - Here is the project defination to be implemented.
                        {defination}
                    - Here is the key features to be implemented.
                        {key_features}
                        
                   - Return all information in a structured JSON format.
                     "doc_name": string (eg. Software Requirements Specification)
                     "doc_desc": string (Small description about this documentation)
                     "doc_body": string json array with the following structure (each key feature is a json object with the following structure) 
                        - doc_body will have must have to following structure:
                            - section: string (eg. 1. Introduction)
                            - content:[
                                - subsection: string (eg. 1.1 Purpose)
                                - content: string (eg. This Software Requirements Specification (SRS) document details the requirements for the To-Do list application. This application allows users to create, read, update, and delete tasks, providing a simple and effective way to manage their activities. This document covers the initial release of the application.)
                                - subsection: string (eg. 1.2 Document Conventions)
                                - content: string (eg. Key words such as MUST, SHOULD, and MAY are used in accordance with RFC 2119 to indicate requirement levels. Priorities are explicitly stated for each requirement (High, Medium, Low). )
                            ]
                        - section: string (eg. 2. Overall Description)
                        - content: [
                            - subsection: string (eg. 2.1 Product Perspective)
                            - content: string (eg. This is a new, self-contained product. The To-Do list application is designed to be a standalone tool for personal task management. It interacts with the user through a web browser and stores data locally using SQLite.)
                            ]
                        - section: string (eg. 3. System Features)
                        - content: [
                            - subsection: string (eg. 3.1 Task Management)
                            - content: [
                                - subsubsection: string (eg. 3.1.1 Description and Priority)
                                    - content: string (eg. This feature allows users to manage their tasks (create, read, update, delete). Priority: High)
                                - subsubsection: string (eg. 3.1.2 Stimulus/Response Sequences)
                                    - content: string (eg. * **Create Task:** User clicks 'Add Task' button, enters task details, and saves. System creates a new task in the database and displays it in the task list.
                                - subsubsection: string (eg. 3.1.3 Functional Requirements)
                                    - content: string (eg. * REQ-1: The application MUST allow users to create new tasks with a title and description.
                                - subsubsection: string (eg. 3.1.3 Functional Requirements)
                                    - content: string (eg. * REQ-1: The application MUST allow users to create new tasks with a title and description.
                                ]
                            ]
                    
                           
                   - Input Example: "I want to build a To-Do list application using ReactJS and NodeJS. The application should use an SQLite database stored locally."
                   - Generated Response Structure you must need to follow this format:
                      "doc_name": "Software Requirements Specification",
                      "doc_desc": "This document outlines the requirements for the To-Do list application, detailing functionalities, non-functional requirements, and technical requirements.",
                      "doc_body": "
                        1. Introduction (Maximum 5 Purpose only)
                        - 1.1 Purpose 
                        <Identify the product whose software requirements are specified in this document, including the revision or release number. Describe the scope of the product that is covered by this SRS, particularly if this SRS describes only part of the system or a single subsystem.>
                        
                        - 1.2 Document Conventions
                        <Describe any standards or typographical conventions that were followed when writing this SRS, such as fonts or highlighting that have special significance. For example, state whether priorities  for higher-level requirements are assumed to be inherited by detailed requirements, or whether every requirement statement is to have its own priority.>
                        
                        - 1.3 Intended Audience and Reading Suggestions
                        <Describe the different types of reader that the document is intended for, such as developers, project managers, marketing staff, users, testers, and documentation writers. Describe what the rest of this SRS contains and how it is organized. Suggest a sequence for reading the document, beginning with the overview sections and proceeding through the sections that are most pertinent to each reader type.>
                        
                        - 1.4 Project Scope
                        <Provide a short description of the software being specified and its purpose, including relevant benefits, objectives, and goals. Relate the software to corporate goals or business strategies. If a separate vision and scope document is available, refer to it rather than duplicating its contents here. An SRS that specifies the next release of an evolving product should contain its own scope statement as a subset of the long-term strategic product vision.>
                        
                        - 1.5 References
                        <List any other documents or Web addresses to which this SRS refers. These may include user interface style guides, contracts, standards, system requirements specifications, use case documents, or a vision and scope document. Provide enough information so that the reader could access a copy of each reference, including title, author, version number, date, and source or location.>
                        
                        2. Overall Description (Maximum 7 Product Perspective only)
                        - 2.1 Product Perspective 
                        <Describe the context and origin of the product being specified in this SRS. For example, state whether this product is a follow-on member of a product family, a replacement for certain existing systems, or a new, self-contained product. If the SRS defines a component of a larger system, relate the requirements of the larger system to the functionality of this software and identify interfaces between the two. A simple diagram that shows the major components of the overall system, subsystem interconnections, and external interfaces can be helpful.>
                        
                        - 2.2 Product Features
                        <Summarize the major features the product contains or the significant functions that it performs or lets the user perform. Details will be provided in Section 3, so only a high level summary  is needed here. Organize the functions to make them understandable to any reader of the SRS. A picture of the major groups of related requirements and how they relate, such as a top level data flow diagram or a class diagram, is often effective.>
                        
                        - 2.3 User Classes and Characteristics
                        <Identify the various user classes that you anticipate will use this product. User classes may be differentiated based on frequency of use, subset of product functions used, technical expertise, security or privilege levels, educational level, or experience. Describe the pertinent characteristics of each user class. Certain requirements may pertain only to certain user classes. Distinguish the favored user classes from those who are less important to satisfy.>
                        
                        - 2.4 Operating Environment
                        <Describe the environment in which the software will operate, including the hardware platform, operating system and versions, and any other software components or applications with which it must peacefully coexist.>
                        
                        - 2.5 Design and Implementation Constraints
                        <Describe any items or issues that will limit the options available to the developers. These might include: corporate or regulatory policies; hardware limitations (timing requirements, memory requirements); interfaces to other applications; specific technologies, tools, and databases to be used; parallel operations; language requirements; communications protocols; security considerations; design conventions or programming standards (for example, if the customer's organization will be responsible for maintaining the delivered software).>
                        
                        - 2.6 User Documentation
                        <List the user documentation components (such as user manuals, on-line help, and tutorials) that will be delivered along with the software. Identify any known user documentation delivery formats or standards.>
                        
                        - 2.7 Assumptions and Dependencies
                        <List any assumed factors (as opposed to known facts) that could affect the requirements stated in the SRS. These could include third-party or commercial components that you plan to use, issues around the development or operating environment, or constraints. The project could be affected if these assumptions are incorrect, are not shared, or change. Also identify any dependencies the project has on external factors, such as software components that you intend to reuse from another project, unless they are already documented elsewhere (for example, in the vision and scope document or the project plan).>
                        
                        3. System Features (Maximum will be 10 most critical features only)
                        <This template illustrates organizing the functional requirements for the product by system features, the major services provided by the product. You may prefer to organize this section by use case, mode of operation, user class, object class, functional hierarchy, or combinations of these, whatever makes the most logical sense for your product.>
                        
                        - 3.1 System Feature 1
                        <Don't really say “System Feature 1.” State the feature name in just a few words.>
                            - 3.1.1	Description and Priority
                                 <Provide a short description of the feature and indicate whether it is of High, Medium, or Low priority. You could also include specific priority component ratings, such as benefit, penalty, cost, and risk (each rated on a relative scale from a low of 1 to a high of 9).>
                            - 3.1.2	Stimulus/Response Sequences
                                <List the sequences of user actions and system responses that stimulate the behavior defined for this feature. These will correspond to the dialog elements associated with use cases.>
                            - 3.1.3	Functional Requirements
                                <Itemize the detailed functional requirements associated with this feature. These are the software capabilities that must be present in order for the user to carry out the services provided by the feature, or to execute the use case. Include how the product should respond to anticipated error conditions or invalid inputs. Requirements should be concise, complete, unambiguous, verifiable, and necessary. Use “TBD” as a placeholder to indicate when necessary information is not yet available.>

                                <Each requirement should be uniquely identified with a sequence number or a meaningful tag of some kind.>
                                REQ-1:	
                                REQ-2:	
                        
                        - 3.2 System Feature 2 (and so on)
                        
                        4. External Interface Requirements (Maximum 4 Interface Requirements only)
                        - 4.1 User Interfaces
                        <Describe the logical characteristics of each interface between the software product and the users. This may include sample screen images, any GUI standards or product family style guides that are to be followed, screen layout constraints, standard buttons and functions (e.g., help) that will appear on every screen, keyboard shortcuts, error message display standards, and so on. Define the software components for which a user interface is needed. Details of the user interface design should be documented in a separate user interface specification.>
                        
                        - 4.2 Hardware Interfaces
                        <Describe the logical and physical characteristics of each interface between the software product and the hardware components of the system. This may include the supported device types, the nature of the data and control interactions between the software and the hardware, and communication protocols to be used.>
                        
                        - 4.3 Software Interfaces
                        <Describe the connections between this product and other specific software components (name and version), including databases, operating systems, tools, libraries, and integrated commercial components. Identify the data items or messages coming into the system and going out and describe the purpose of each. Describe the services needed and the nature of communications. Refer to documents that describe detailed application programming interface protocols. Identify data that will be shared across software components. If the data sharing mechanism must be implemented in a specific way (for example, use of a global data area in a multitasking operating system), specify this as an implementation constraint.>
                        
                        - 4.4 Communications Interfaces
                        <Describe the requirements associated with any communications functions required by this product, including e-mail, web browser, network server communications protocols, electronic forms, and so on. Define any pertinent message formatting. Identify any communication standards that will be used, such as FTP or HTTP. Specify any communication security or encryption issues, data transfer rates, and synchronization mechanisms.>
                        
                        5. Other Nonfunctional Requirements (Maximum 4 Nonfunctional Requirements only)
                        - 5.1 Performance Requirements
                        <If there are performance requirements for the product under various circumstances, state them here and explain their rationale, to help the developers understand the intent and make suitable design choices. Specify the timing relationships for real time systems. Make such requirements as specific as possible. You may need to state performance requirements for individual functional requirements or features.>
                        
                        - 5.2 Safety Requirements
                        <Specify those requirements that are concerned with possible loss, damage, or harm that could result from the use of the product. Define any safeguards or actions that must be taken, as well as actions that must be prevented. Refer to any external policies or regulations that state safety issues that affect the product's design or use. Define any safety certifications that must be satisfied.>
                        
                        - 5.3 Security Requirements
                        <Specify any requirements regarding security or privacy issues surrounding use of the product or protection of the data used or created by the product. Define any user identity authentication requirements. Refer to any external policies or regulations containing security issues that affect the product. Define any security or privacy certifications that must be satisfied.>
                        
                        - 5.4 Software Quality Attributes
                        <Specify any additional quality characteristics for the product that will be important to either the customers or the developers. Some to consider are: adaptability, availability, correctness, flexibility, interoperability, maintainability, portability, reliability, reusability, robustness, testability, and usability. Write these to be specific, quantitative, and verifiable when possible. At the least, clarify the relative preferences for various attributes, such as ease of use over ease of learning.>
                        
                        6. Other Requirements
                        <Define any other requirements not covered elsewhere in the SRS. This might include database requirements, internationalization requirements, legal requirements, reuse objectives for the project, and so on. Add any new sections that are pertinent to the project.>
                        
                        Appendix A: Glossary
                        <Define all the terms necessary to properly interpret the SRS, including acronyms and abbreviations. You may wish to build a separate glossary that spans multiple projects or the entire organization, and just include terms specific to a single project in each SRS.>
                        
                        Appendix B: Analysis Models
                        <Optionally, include any pertinent analysis models, such as data flow diagrams, class diagrams, state-transition diagrams, or entity-relationship diagrams.>
                        
                        Appendix C: Issues List
                        < This is a dynamic list of the open requirements issues that remain to be resolved, including TBDs, pending decisions, information that is needed, conflicts awaiting resolution, and the like.>
                      "
                      
                """
    prompt = PromptTemplate(template=template, input_variables=[
                            "defination", "key_features"])

    requirements_chain = prompt | generate_docs
    start = time.time()
    result = requirements_chain.invoke(
        {"defination": defination, "key_features": key_features})
    end = time.time()
    # print("Time taken:", end - start)

    start_idx = result.find("{")
    end_idx = result.rfind("}") + 1

    result = result[start_idx:end_idx]

    # result = '{"' + defination + "}"

    if not os.path.exists('./docs'):
        os.makedirs('./docs')

    with open("./docs/generate_docs.md", "w") as f:
        f.write(result)

    return result


def parse_request(request):
    project_name = request.get("project_name", "")
    employees = request.get("employees", [])
    description = request.get("description", "")
    development_type = request.get("development_type", "")
    complexity = request.get("complexity", "")
    key_features = request.get("key_features", "")
    timeline = request.get("timeline", "")
    # Ensure employees is a list of dictionaries
    if not isinstance(employees, list):
        raise ValueError("Employees must be a list of dictionaries.")

    # Constructing the requests
    ba_request = (
        f"I want to build a {development_type} for the project '{project_name}'. Which involves this key features {', '.join(key_features)}."
        f"In brief, it is about {complexity} complexity and involves: {description}."
    )

    # Creating employee list with skillset
    employee_list = ', '.join(
        [f"{employee['name']} ({employee['designation']}, Skills: {', '.join(employee['skillset'])})" for employee in employees]
    )
    ssd_request = f"My team includes the following members: {employee_list}. and timeline to complete the project is {timeline} days."

    return ba_request, ssd_request, len(employees)


def generate_tasks(request):
    task_decomposer = init_gemini()

    documentation, ssd_request, num_of_devs = parse_request(request)

    template = f"""
                You are an AI agent that can understand the project definition and key features and create tasks for the project and assign them to the appropriate team members. 
                
                Your task is to:
                    1. Understand the project definition and key features provided by the user.
                    2. Analyze the project definition and key features and identify the tasks that need to be created.
                    3. Decompose the tasks into smaller subtasks.
                    4. Assign the subtasks to the appropriate team members provie only designation of employees in assigned_to key.
                    5. Provide a detailed list of tasks and subtasks in a structured JSON format.
                    
                Your primary responsibilities include:
                1. Assigning tasks to {num_of_devs} employees based on their skill sets and project requirements. 
                2. Here are the employees available to work with their designations: {ssd_request}
                
                3. Selecting the most suitable technology stack for each project.
                    - Setting realistic deadlines for task completion to ensure timely project delivery.

                Instructions:
                - Analyze the project manager's document to extract key project requirements.
                - Break down the project into well-defined, manageable tasks.
                - Match each task with the most suitable developer based on their expertise.
                - Determine the appropriate technology stack (programming languages, frameworks, databases, and tools).
                - Estimate realistic deadlines for each task.
                
                Output Format (JSON): 
                Return the structured response in a JSON array named "tasks" with the following keys:
                - tasks: [
                    - name: (string) Task name
                    - desc: (string) Description of the task, including the technology stack used
                    - priority: (string) Low/Medium/High
                    - assigned_to: (string) Only designation of employees which are suitable for the task (must be one of the available employees with the best skill set)
                    - required_skills: (list) Contaninig required skills to complete task with availble skillset only
                    - deadline: (string) Deadline for task completion in days
                ]
                          
                json structure:
                tasks:
                    [
                    
                        "name": "Set up database",
                        "desc": "Create and configure the PostgreSQL database for the application.",
                        "priority": "High",
                        "assigned_to": "Senior Database Administrator"
                        "required_skills": ["PostgreSQL", "SQL"],
                        "deadline": "3"
                    ,
                    
                        "name": "Develop API endpoints",
                        "desc": "Implement RESTful API endpoints using Node.js and Express framework.",
                        "priority": "High",
                        "assigned_to": "Backend Developer"
                        "required_skills": ["Node.js", "Express"],
                        "deadline": "3"
                    ,
                    
                        "name": "Design user interface",
                        "desc": "Create responsive UI components using React and CSS.",
                        "priority": "Medium",
                        "assigned_to": "Frontend Developer"
                        "required_skills": ["React", "CSS"],
                        "deadline": "2"
                    ,
                    
                        "name": "Write unit tests",
                        "desc": "Develop unit tests for the API using Jest.",
                        "priority": "Low",
                        "assigned_to": "QA Tester"
                        "required_skills": ["Jest", "Unit Testing"],
                        "deadline": "5"  
                ]
                            
            Project Manager's documentation:
            {documentation}
            """

    prompt = PromptTemplate(
        template=template, input_variables=["documentation"])

    requirements_chain = prompt | task_decomposer

    result = requirements_chain.invoke(
        {"formated_documentation": documentation})

    start_idx = result.find("{")
    end_idx = result.rfind("}") + 1

    result = result[start_idx:end_idx]
    # result = result[8:-4]

    with open("./docs/sde_result.txt", "w") as f:
        f.write(result)

    return result
