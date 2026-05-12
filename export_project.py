# export_project.py
import os
from pathlib import Path

# Настройки: какие файлы собирать и какие папки игнорировать
TARGET_FILES = ['models.py', 'serializers.py', 'admin.py', 'views.py', 'urls.py', 'apps.py', 'settings.py']
IGNORE_DIRS = {'.venv', 'venv', '__pycache__', 'node_modules', '.git', 'migrations', 'static', 'media', 'staticfiles'}

def collect_files(root_path):
    """Собирает содержимое целевых файлов из всех приложений Django"""
    result = []
    root = Path(root_path)
    
    for file_path in root.rglob('*'):
        # Пропускаем ненужные директории и файлы
        if any(ignore in file_path.parts for ignore in IGNORE_DIRS):
            continue
        if file_path.is_file() and file_path.name in TARGET_FILES:
            # Определяем относительный путь для заголовка
            rel_path = file_path.relative_to(root)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                result.append(f"\n{'='*60}")
                result.append(f"📄 Файл: {rel_path}")
                result.append(f"{'='*60}\n")
                result.append(content)
                result.append("\n")
            except Exception as e:
                result.append(f"\n⚠️ Ошибка чтения {rel_path}: {e}\n")
    
    return '\n'.join(result)

if __name__ == '__main__':
    # Запуск из корня проекта: python export_project.py
    output = collect_files('.')
    
    # Вывод в консоль (можно скопировать)
    print(output)
    
    # Опционально: сохранить в файл
    with open('project_dump.txt', 'w', encoding='utf-8') as f:
        f.write(output)
    print("\n✅ Сохранено в project_dump.txt")