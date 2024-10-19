import sys
import os
import ast
import importlib

def ignore_files(file_path):
    """Ignore specific files (temp files etc)"""
    ignored_patterns = [
        r'tmp',               
        r'__pycache__',       
        r'\.pyc$',           
        r'\.pyo$',           
        r'\.tmp$',           
        r'\.log$',
        r'cli\.py$'
    ]
    return any(pattern in file_path for pattern in ignored_patterns)


def find_imports_in_file(filepath):
    """Extracts import statements"""
    with open(filepath, 'r') as file:
        file_content = file.read()
    
    #parse the file and find import statements
    tree = ast.parse(file_content)
    imports = set()

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                imports.add(alias.name)
        elif isinstance(node, ast.ImportFrom):
            # add the module being imported
            imports.add(node.module)
    
    return imports


def get_directory_files(directory):
    """Get a dictionary of module names and their file paths in the specified directory"""
    return {os.path.splitext(f)[0]: os.path.join(directory, f)
            for f in os.listdir(directory) if f.endswith('.py')}


def reload_module(module_name):
    """Reload an existing module or import a new one"""
    ignored_modules = [
        "cli"
    ]
    
    if module_name in ignored_modules:
        print(f"Skipping reload of module: {module_name}")
        return
    
    if module_name in sys.modules:
        try:
            importlib.reload(sys.modules[module_name])
            print(f"Reloaded module: {module_name}")
        except Exception as e:
            print(f"Error reloading module {module_name}: {e}")
    else:
        try:
            importlib.import_module(module_name)
            print(f"Imported new module: {module_name}")
        except Exception as e:
            print(f"Error importing new module {module_name}: {e}")


def reload_imports_from_file(filepath):
    """Reload imports found in a specific file"""
    imports = find_imports_in_file(filepath)
    for import_name in imports:
        reload_module(import_name)


def reload_all_modules(directory):
    """Reload all modules in the specified directory and their imports"""
    print("Reloading modules from directory:", directory)

    directory_files = get_directory_files(directory)
    
    # reload imports from each file
    for filepath in directory_files.values():
        reload_imports_from_file(filepath)

    # reload modules corresponding to files in directories
    for module_name in directory_files.keys():
        reload_module(module_name)

    print("All modules reloaded.")