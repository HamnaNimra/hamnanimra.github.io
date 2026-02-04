#!/usr/bin/env python3
"""
Generate Jekyll _photography entries from image files.

Usage:
  # From repo root: create/update .md for every image in images/photos/
  python scripts/generate_photography.py

  # Or pass image filenames (relative to images/photos/)
  python scripts/generate_photography.py sunset.jpg street.jpg cafe.png

  # Or pass a text file with one filename per line
  python scripts/generate_photography.py --list my-photos.txt

Images are expected in images/photos/. Output is written to _photography/<slug>.md.
Slug = filename without extension. Title = slug with hyphens/underscores replaced by spaces, title-cased.
"""

import argparse
import sys
from pathlib import Path


def slug_to_title(slug: str) -> str:
    """Turn a slug like 'sunset-at-beach' into 'Sunset at beach'."""
    s = slug.replace("_", " ").replace("-", " ")
    return s.strip().title() if s.strip() else slug


def main() -> None:
    repo_root = Path(__file__).resolve().parent.parent
    photos_dir = repo_root / "images" / "photos"
    out_dir = repo_root / "_photography"

    IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

    parser = argparse.ArgumentParser(
        description="Generate _photography entries from image filenames."
    )
    parser.add_argument(
        "filenames",
        nargs="*",
        help="Image filenames (e.g. sunset.jpg). If none, all images in images/photos/ are used.",
    )
    parser.add_argument(
        "--list",
        "-l",
        metavar="FILE",
        help="Read filenames from a file (one per line).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would be written, don't create files.",
    )
    args = parser.parse_args()

    if args.list:
        list_path = Path(args.list)
        if not list_path.is_absolute():
            list_path = repo_root / list_path
        if not list_path.exists():
            print(f"Error: list file not found: {list_path}", file=sys.stderr)
            sys.exit(1)
        filenames = [
            line.strip()
            for line in list_path.read_text(encoding="utf-8").splitlines()
            if line.strip()
        ]
    elif args.filenames:
        filenames = args.filenames
    else:
        if not photos_dir.exists():
            print(f"Error: photos directory not found: {photos_dir}", file=sys.stderr)
            sys.exit(1)
        filenames = [
            f.name
            for f in photos_dir.iterdir()
            if f.is_file() and f.suffix.lower() in IMAGE_EXTENSIONS
        ]
        filenames.sort()

    if not filenames:
        print("No image filenames to process.", file=sys.stderr)
        print(f"  Add .jpg/.png/.webp files to {photos_dir}", file=sys.stderr)
        print(
            "  or run: python scripts/generate_photography.py file1.jpg file2.png",
            file=sys.stderr,
        )
        sys.exit(0)

    out_dir.mkdir(parents=True, exist_ok=True)

    for filename in filenames:
        stem = Path(filename).stem
        ext = Path(filename).suffix.lower()
        if ext not in IMAGE_EXTENSIONS:
            print(f"Skipping {filename} (unknown extension).", file=sys.stderr)
            continue
        slug = stem
        title = slug_to_title(slug)
        image_path = f"/images/photos/{filename}"
        content = f"""---
title: {title}
image: {image_path}
---
"""
        out_path = out_dir / f"{slug}.md"
        if args.dry_run:
            print(f"Would write {out_path}\n{content}")
        else:
            out_path.write_text(content, encoding="utf-8")
            print(f"Wrote {out_path}")

    if not args.dry_run:
        print(
            f"Done. {len(filenames)} photography entr{'y' if len(filenames) == 1 else 'ies'} generated."
        )


if __name__ == "__main__":
    main()
