from pydantic import BaseModel, ConfigDict, Field


class APIRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")


class DefinitionRequest(APIRequest):
    definition: str = Field(min_length=1)


class InitProjectRequest(DefinitionRequest):
    project_name: str = Field(min_length=1)


class DocumentationRequest(DefinitionRequest):
    key_features: list[str]


class Employee(BaseModel):
    name: str = Field(min_length=1)
    designation: str = Field(min_length=1)
    skillset: list[str]


class TaskRequest(DocumentationRequest):
    project_name: str = ""
    employees: list[Employee] = Field(default_factory=list)
    development_type: str = ""
    complexity: str = ""
    description: str = ""
    timeline: int | str | None = None


class PipelineRequest(APIRequest):
    project_name: str = Field(min_length=1)
    employees: list[Employee] = Field(default_factory=list)
    description: str = ""
    definition: str = ""
    development_type: str = ""
    response_type: str = "json"
    complexity: str = ""
    timeline: int | str = ""
    key_features: list[str] = Field(default_factory=list)
