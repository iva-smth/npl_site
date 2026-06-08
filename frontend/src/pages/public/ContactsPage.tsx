import { useEffect, useState } from 'react';
import { teamApi } from '../../api/services/team';
import { ContactCard } from '../../components/ContactCard';
import type { Employee } from '../../types';

export function ContactsPage() {
  const [contacts, setContacts] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    teamApi.getContacts()
      .then(res => setContacts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4 text-primary">Контакты</h1>
        <p className="text-lg text-gray-600">
          Свяжитесь с ключевыми сотрудниками лаборатории по вопросам сотрудничества,
          оборудования или научных исследований.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse max-w-4xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl w-full"></div>
          ))}
        </div>
      ) : contacts.length > 0 ? (
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {contacts.map(emp => (
            <ContactCard key={emp.id} employee={emp} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300 max-w-2xl mx-auto">
          <p className="text-gray-500 text-lg">В данный момент нет выделенных контактных лиц.</p>
          <p className="text-gray-400 text-sm mt-2">Пожалуйста, обратитесь через общую форму обратной связи.</p>
        </div>
      )}
    </div>
  );
}