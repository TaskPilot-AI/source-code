import re
from collections.abc import Mapping


_PLACEHOLDER = re.compile(r"\{([a-zA-Z_][a-zA-Z0-9_]*)\}")


def format_prompt(template: str, values: Mapping[str, object]) -> str:
    template = template.replace("{{", "{").replace("}}", "}")
    return _PLACEHOLDER.sub(
        lambda match: (
            str(values[match.group(1)])
            if match.group(1) in values
            else match.group(0)
        ),
        template,
    )
