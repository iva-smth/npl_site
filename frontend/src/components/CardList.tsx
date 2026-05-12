import type { ResearchGroup, Employee, Equipment } from '../types';

interface CardListProps {
  items: ResearchGroup[] | Employee[] | Equipment[];
  type: 'groups' | 'employees' | 'equipment';
}

interface GroupItem {
  title: string;
  description: string;
}

interface EmployeeItem {
  full_name: string;
  position_label: string;
  position: string;
  photo_url?: string;
}

interface EquipmentItem {
  title: string;
  description: string;
  specs?: string;
  image_url?: string;
}

type CardItem = GroupItem | EmployeeItem | EquipmentItem;

export function CardList({ items, type }: CardListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Нет данных</p>
      </div>
    );
  }

  const renderCard = (item: CardItem, index: number) => {
    switch (type) {
      case 'groups':
        const groupItem = item as GroupItem;
        return (
          <div key={index} className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">{groupItem.title}</h3>
            <p className="text-gray-600 mb-4">{groupItem.description}</p>
          </div>
        );
      case 'employees':
        const employeeItem = item as EmployeeItem;
        return (
          <div key={index} className="border rounded-lg p-6 hover:shadow-lg transition flex items-center space-x-4">
            {employeeItem.photo_url && (
              <img
                src={employeeItem.photo_url}
                alt={employeeItem.full_name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div className="flex-grow">
              <h3 className="text-lg font-bold mb-1">{employeeItem.full_name}</h3>
              <p className="text-gray-600 text-sm mb-2">{employeeItem.position_label}</p>
              <p className="text-gray-500 text-xs">{employeeItem.position}</p>
            </div>
          </div>
        );
      case 'equipment':
        const equipmentItem = item as EquipmentItem;
        return (
          <div key={index} className="border rounded-lg p-6 hover:shadow-lg transition">
            {equipmentItem.image_url && (
              <img
                src={equipmentItem.image_url}
                alt={equipmentItem.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="text-xl font-bold mb-2">{equipmentItem.title}</h3>
            <p className="text-gray-600 mb-4">{equipmentItem.description}</p>
            {equipmentItem.specs && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium mb-1">Технические характеристики:</p>
                <p className="text-sm text-gray-600">{equipmentItem.specs}</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item, index) => renderCard(item, index))}
    </div>
  );
}