import { useState, ReactNode, ReactElement } from 'react';

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

export function Tabs({ children }: TabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {React.Children.toArray(children).filter((child): child is ReactElement => 
            child.type && child.type.displayName === 'TabsTrigger'
          ).map((child, index: number) => (
            <button
              key={index}
              onClick={() => handleTabClick(child.props.value)}
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
        {React.Children.toArray(children).filter((child): child is ReactElement => 
          child.type && child.type.displayName === 'TabsContent'
        ).map((child) =>
          child.props.value === activeTab && <div key={child.props.value}>{child.props.children}</div>
        )}
      </div>
    </div>
  );
}

Tabs.Trigger = function TabsTrigger({ value, children }: TabsTriggerProps) {
  return <>{children}</>;
};

Tabs.Trigger.displayName = 'TabsTrigger';

Tabs.Content = function TabsContent({ value, children }: TabsContentProps) {
  return <>{children}</>;
};

Tabs.Content.displayName = 'TabsContent';