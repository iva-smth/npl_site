// src/components/Tabs.tsx
import { useState, Children, isValidElement, type ReactNode, type ReactElement } from 'react';

interface TabsProps {
  children: ReactNode;
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
}

// Вспомогательные функции для безопасной проверки типа элемента
const isTabsTrigger = (child: ReactNode): child is ReactElement<TabsTriggerProps> => 
  isValidElement(child) && child.type === TabsTrigger;

const isTabsContent = (child: ReactNode): child is ReactElement<TabsContentProps> => 
  isValidElement(child) && child.type === TabsContent;

export function Tabs({ children }: TabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const triggers = Children.toArray(children).filter(isTabsTrigger);
  const contents = Children.toArray(children).filter(isTabsContent);

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {triggers.map((child, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(child.props.value)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === child.props.value
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {child.props.children}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-6">
        {contents.map((child) => 
          child.props.value === activeTab && (
            <div key={child.props.value}>{child.props.children}</div>
          )
        )}
      </div>
    </div>
  );
}

// Исправлено: используем правильное имя поля 'value' и префикс '_' для подавления предупреждения
function TabsTrigger({ value: _value, children }: TabsTriggerProps) {
  return <>{children}</>;
}
TabsTrigger.displayName = 'TabsTrigger';

function TabsContent({ value: _value, children }: TabsContentProps) {
  return <>{children}</>;
}
TabsContent.displayName = 'TabsContent';

// Привязываем подкомпоненты к основному компоненту
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;