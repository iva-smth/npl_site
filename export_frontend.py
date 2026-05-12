#!/usr/bin/env python3
"""
Скрипт для экспорта фронтенд-кода в один файл.
Исключает node_modules, сборки и другие тяжелые папки.
"""

import os
from pathlib import Path
from datetime import datetime

# Настройки
FRONTEND_DIR = "frontend"
OUTPUT_FILE = "frontend_export.txt"

# Что исключать из экспорта
EXCLUDE_DIRS = {
    "node_modules",
    ".vite",
    ".vite-temp",
    "dist",
    "build",
    "coverage",
    ".git",
    "__pycache__",
}

EXCLUDE_FILES = {
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "tsconfig.node.json",
    "tsconfig.app.json",
    ".DS_Store",
    "Thumbs.db",
    ".gitignore",
}

# Расширения файлов, которые хотим включить
INCLUDE_EXTENSIONS = {
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".json",
    ".css",
    ".scss",
    ".html",
    ".env",
    ".env.example",
    ".eslintrc",
    ".eslintignore",
    ".prettierrc",
    "tailwind.config.js",
    "vite.config.ts",
    "tsconfig.json",
    "postcss.config.js",
}


def should_include_file(file_path: Path) -> bool:
    """Проверяет, нужно ли включать файл в экспорт."""
    # Исключаем файлы из blacklist
    if file_path.name in EXCLUDE_FILES:
        return False
    
    # Проверяем расширения
    if file_path.suffix.lower() in INCLUDE_EXTENSIONS:
        return True
    
    # Специфичные файлы без расширения или с точкой
    if file_path.name.startswith("."):
        return True
    
    return False


def should_exclude_dir(dir_name: str) -> bool:
    """Проверяет, нужно ли исключать папку."""
    return dir_name in EXCLUDE_DIRS or dir_name.startswith(".")


def export_frontend():
    """Основная функция экспорта."""
    frontend_path = Path(FRONTEND_DIR)
    
    if not frontend_path.exists():
        print(f"❌ Папка {FRONTEND_DIR} не найдена!")
        return
    
    # Собираем все файлы
    files_content = []
    total_files = 0
    total_size = 0
    
    for root, dirs, files in os.walk(frontend_path):
        # Фильтруем папки
        dirs[:] = [d for d in dirs if not should_exclude_dir(d)]
        
        root_path = Path(root)
        
        for file in files:
            file_path = root_path / file
            
            if not should_include_file(file_path):
                continue
            
            try:
                # Читаем файл
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                
                # Относительный путь для заголовка
                relative_path = file_path.relative_to(frontend_path)
                
                # Добавляем в коллекцию
                files_content.append({
                    "path": str(relative_path),
                    "content": content,
                    "size": len(content.encode("utf-8"))
                })
                
                total_files += 1
                total_size += len(content.encode("utf-8"))
                
            except Exception as e:
                print(f"⚠️ Ошибка чтения {file_path}: {e}")
    
    # Сортируем файлы по путям для удобства
    files_content.sort(key=lambda x: x["path"])
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        # Заголовок
        f.write("=" * 80 + "\n")
        f.write("ФРОНТЕНД ЭКСПОРТ\n")
        f.write("=" * 80 + "\n")
        f.write(f"Дата экспорта: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Всего файлов: {total_files}\n")
        f.write(f"Общий размер: {total_size / 1024:.2f} KB\n")
        f.write("=" * 80 + "\n\n")
        
        # Оглавление
        f.write("📋 ОГЛАВЛЕНИЕ\n")
        f.write("-" * 80 + "\n")
        for i, file_info in enumerate(files_content, 1):
            f.write(f"{i:3d}. {file_info['path']}\n")
        f.write("\n" + "=" * 80 + "\n\n")
        
        # Содержимое файлов
        f.write("📁 СОДЕРЖИМОЕ ФАЙЛОВ\n")
        f.write("=" * 80 + "\n\n")
        
        for file_info in files_content:
            f.write("=" * 80 + "\n")
            f.write(f"📄 ФАЙЛ: {file_info['path']}\n")
            f.write(f"📊 Размер: {len(file_info['content'].encode('utf-8'))} байт\n")
            f.write("=" * 80 + "\n\n")
            f.write(file_info["content"])
            f.write("\n\n")
    
    print(f"📦 Экспортировано файлов: {total_files}")
    print(f"📁 Выходной файл: {OUTPUT_FILE}")


if __name__ == "__main__":
    export_frontend()