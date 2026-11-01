# Prompt builders

Each module exposes a function that returns a ready-to-send prompt with the
provided request values inserted:

- `init_project.build_init_project_prompt(project_name, definition)`
- `identify_key_features.build_identify_key_features_prompt(definition)`
- `generate_docs.build_generate_docs_prompt(definition, key_features)`
- `use_case_diagram.build_use_case_diagram_prompt(definition)`
- `er_diagram.build_er_diagram_prompt(definition, key_features)`
- `create_tasks.build_create_tasks_prompt(num_of_devs, ssd_request, documentation)`

Prompt formatting is handled by `src.utils.prompt_formatter.format_prompt`.
Literal Mermaid/JSON braces are preserved, and dynamic values are inserted as
provided.
