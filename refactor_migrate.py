#!/usr/bin/env python3
"""Migrate case studies to Jekyll collection format"""

import re
import os


def extract_case_study_content(html_file):
    """Extract styles and body content from HTML file"""
    with open(html_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract styles from <style> tag
    style_match = re.search(r"<style>(.*?)</style>", content, re.DOTALL)
    styles = style_match.group(1).strip() if style_match else ""

    # Extract body content (everything after <body> tag, excluding top-bar header)
    body_match = re.search(r"<body>(.*?)</body>", content, re.DOTALL)
    body = body_match.group(1) if body_match else ""

    # Remove top-bar header
    body = re.sub(r'<header class="top-bar">.*?</header>', "", body, flags=re.DOTALL)
    body = body.strip()

    return styles, body


# Case study metadata
case_studies = [
    {
        "source": "case-studies/pit-strategy-case-study.html",
        "output": "_case_studies/pit-strategy.html",
        "title": "Pit Strategy Optimizer",
        "subtitle": "Data-driven decision support for Formula 1 pit stop strategy",
        "featured": True,
        "meta": "Product Case Study · February 2026",
    },
    {
        "source": "case-studies/microhelp-case-study.html",
        "output": "_case_studies/microhelp.html",
        "title": "MicroHelp",
        "subtitle": "Rebuilding community, one small favor at a time",
        "featured": True,
        "meta": "Product Case Study · February 2026",
    },
    {
        "source": "case-studies/autoperfpy-case-study.html",
        "output": "_case_studies/autoperfpy.html",
        "title": "AutoPerfPy",
        "subtitle": "Democratizing performance engineering for edge AI",
        "featured": True,
        "meta": "Product Case Study · February 2026",
    },
]

# Migrate each case study
for case in case_studies:
    if not os.path.exists(case["source"]):
        print(f"Warning: {case['source']} not found, skipping...")
        continue

    styles, body = extract_case_study_content(case["source"])

    front_matter = f"""---
layout: case_study
title: {case['title']}
subtitle: {case['subtitle']}
featured: {str(case['featured']).lower()}
meta: {case['meta']}
---"""

    output_content = f"""{front_matter}

<style>
{styles}
</style>

{body}
"""

    os.makedirs(os.path.dirname(case["output"]), exist_ok=True)
    with open(case["output"], "w", encoding="utf-8") as f:
        f.write(output_content)
    print(f"Created {case['output']}")

print("\nAll case studies migrated to Jekyll collection format!")
