#!/usr/bin/env python3
import sys
import os
import json
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
THEMES_FILE = os.path.join(SCRIPT_DIR, "themes.json")
CSS_PATH = os.path.join(SCRIPT_DIR, "..", "src", "styles", "global.css")

with open(THEMES_FILE, "r", encoding="utf-8") as f:
    THEMES = json.load(f)

def get_current_theme():
    if not os.path.exists(CSS_PATH):
        return "unknown"
    with open(CSS_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    match = re.search(r"/\* ACTIVE_THEME: ([\w\-]+) \*/", content)
    if match:
        return match.group(1)
    return "ayu"

def apply_theme(key):
    key = key.lower().strip()
    if key not in THEMES:
        print(f"Error: Unknown theme '{key}'.")
        print(f"Available themes: {', '.join(THEMES.keys())}")
        return False
    
    t = THEMES[key]
    l = t["light"]
    d = t["dark"]
    
    new_vars = f"""/* ACTIVE_THEME: {key} */
:root {{
  --theme-bg: {l['bg']};
  --theme-fg: {l['fg']};
  --theme-heading: {l['heading']};
  --theme-muted: {l['muted']};
  --theme-accent: {l['accent']};
  --theme-link: {l['link']};
  --theme-link-hover: {l['link_hover']};
  --theme-card: {l['card']};
  --theme-border: {l['border']};
  --theme-pill: {l['pill']};
}}

.dark {{
  --theme-bg: {d['bg']};
  --theme-fg: {d['fg']};
  --theme-heading: {d['heading']};
  --theme-muted: {d['muted']};
  --theme-accent: {d['accent']};
  --theme-link: {d['link']};
  --theme-link-hover: {d['link_hover']};
  --theme-card: {d['card']};
  --theme-border: {d['border']};
  --theme-pill: {d['pill']};
}}"""

    with open(CSS_PATH, "r", encoding="utf-8") as f:
        css = f.read()
    
    pattern = r"(/\* ACTIVE_THEME: [\w\-]+ \*/\s*)?:root\s*\{[^}]+\}\s*\.dark\s*\{[^}]+\}"
    if re.search(pattern, css):
        updated_css = re.sub(pattern, new_vars, css)
    else:
        updated_css = css.replace("@theme {", f"{new_vars}\n\n@theme {{")
    
    with open(CSS_PATH, "w", encoding="utf-8") as f:
        f.write(updated_css)
    
    print(f"\n✨ Theme switched to: \033[1;32m{t['name']}\033[0m ({key})")
    print(f"   Light: Canvas {l['bg']}, Accent {l['accent']}, Links {l['link']}")
    print(f"   Dark:  Canvas {d['bg']}, Accent {d['accent']}, Links {d['link']}\n")
    return True

def print_theme_list():
    current = get_current_theme()
    print("\n" + "="*60)
    print(" 🎨 Available Popular Terminal & Editor Color Themes")
    print("="*60)
    for k, t in THEMES.items():
        is_active = (k == current)
        marker = "▶ \033[1;32m[ACTIVE]\033[0m" if is_active else "  "
        print(f"\n{marker} \033[1m{k.ljust(14)}\033[0m - {t['name']}")
        print(f"   \033[2m{t['description']}\033[0m")
        print(f"   Light: bg {t['light']['bg']}  accent {t['light']['accent']}  link {t['light']['link']}")
    print("\n" + "="*60)
    print("Usage: npm run theme <theme-name>")
    print("Example: npm run theme gruvbox\n")

def interactive_menu():
    print_theme_list()
    keys = list(THEMES.keys())
    print("Select a theme number or name to apply (or 'q' to quit):")
    for idx, k in enumerate(keys, 1):
        print(f" [{idx}] {k}")
    
    try:
        choice = input("\nEnter choice: ").strip().lower()
        if choice in ['q', 'exit', '']:
            return
        if choice.isdigit() and 1 <= int(choice) <= len(keys):
            apply_theme(keys[int(choice) - 1])
        elif choice in THEMES:
            apply_theme(choice)
        else:
            print(f"Invalid option: {choice}")
    except (EOFError, KeyboardInterrupt):
        pass

def main():
    if len(sys.argv) < 2:
        interactive_menu()
    elif sys.argv[1] in ['list', '-l', '--list']:
        print_theme_list()
    elif sys.argv[1] in ['current', '-c', '--current']:
        cur = get_current_theme()
        print(f"Current theme: {cur} ({THEMES.get(cur, {}).get('name', 'Custom')})")
    elif sys.argv[1] in ['help', '-h', '--help']:
        print("Theme Switcher CLI")
        print("Commands:")
        print("  npm run theme             -> Interactive selection")
        print("  npm run theme list        -> List all available color themes")
        print("  npm run theme <name>      -> Switch directly to theme (e.g. gruvbox, catppuccin, nord)")
        print("  npm run theme current     -> Show current theme")
    else:
        apply_theme(sys.argv[1])

if __name__ == "__main__":
    main()
