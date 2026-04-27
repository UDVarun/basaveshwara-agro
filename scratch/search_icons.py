import os

targets = ["Grass", "CheckCircle", "FlaskConical", "Printer"]

for root, dirs, files in os.walk("."):
    if "node_modules" in dirs:
        dirs.remove("node_modules")
    if ".next" in dirs:
        dirs.remove(".next")
    
    for file in files:
        if file.endswith((".tsx", ".ts", ".js", ".jsx")):
            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                    for t in targets:
                        if t in content:
                            print(f"Found '{t}' in {path}")
            except Exception as e:
                pass
