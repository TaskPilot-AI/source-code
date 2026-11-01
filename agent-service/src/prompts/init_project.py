from src.utils.prompt_formatter import format_prompt

_TEMPLATE = """
You improve project definitions while preserving the user's intent.

Return exactly one JSON object with exactly one key: "new_definition".
Do not include the project name, original definition, analysis, explanations, or
any other keys. Consider missing implementation details internally and include
only the improved project definition in the value of "new_definition".

- Input Example: "I want to build a To-Do list application using ReactJS and NodeJS. The application should use an SQLite database stored locally."
- Required JSON shape: {"new_definition": "<improved project definition>"}

Here is the project name and definition to be implemented.
{project_name}:
{definition}
"""


def build_init_project_prompt(project_name: str, definition: str) -> str:
    return format_prompt(
        _TEMPLATE,
        {"project_name": project_name, "definition": definition},
    )
