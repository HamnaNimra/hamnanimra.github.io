#!/usr/bin/env python3
"""Migrate case studies from html/ to _case_studies/ collection"""

import re
import os


def extract_case_study(html_file, output_file, front_matter):
    """Extract styles and body content from HTML file"""
    with open(html_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract styles
    style_match = re.search(r"<style>(.*?)</style>", content, re.DOTALL)
    styles = style_match.group(1) if style_match else ""

    # Extract body content
    body_match = re.search(r"<body>(.*?)</body>", content, re.DOTALL)
    body = body_match.group(1) if body_match else ""

    # Remove top-bar header
    body = re.sub(r'<header class="top-bar">.*?</header>', "", body, flags=re.DOTALL)

    # Combine front matter, styles, and body
    output = f"""{front_matter}

<style>
{styles}
</style>

{body}
"""

    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(output)
    print(f"Created {output_file}")


# Migrate pit-strategy
extract_case_study(
    "html/pit-strategy-case-study.html",
    "_case_studies/pit-strategy.html",
    """---
layout: case_study
title: Pit Strategy Optimizer
subtitle: Data-driven decision support for Formula 1 pit stop strategy
featured: true
meta: Product Case Study · February 2026
---""",
)

# Migrate microhelp
extract_case_study(
    "html/microhelp-case-study.html",
    "_case_studies/microhelp.html",
    """---
layout: case_study
title: MicroHelp
subtitle: Rebuilding community, one small favor at a time
featured: true
meta: Product Case Study · February 2026
---""",
)

# Migrate autoperfpy
extract_case_study(
    "html/autoperfpy-case-study.html",
    "_case_studies/autoperfpy.html",
    """---
layout: case_study
title: AutoPerfPy
subtitle: Democratizing performance engineering for edge AI
featured: true
meta: Product Case Study · February 2026
---""",
)

print("\nAll case studies migrated!")
