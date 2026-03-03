
import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, User, Mail, Phone, Calendar, Clock } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Та энэ зурвасыг устгахдаа итгэлтэй байна уу?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Ирсэн зурвасууд</h1>
        <p className="text-slate-500">Холбоо барих хэсгээр ирсэн хэрэглэгчдийн зурвас.</p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {messages.length === 0 ? (
            <div className="bg-white p-20 rounded-[40px] border border-dashed border-slate-300 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Зурвас ирээгүй байна</h3>
              <p className="text-slate-500">Одоогоор ямар нэгэн зурвас бүртгэгдээгүй байна.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-slate-600 font-bold text-sm">
                        <User className="w-4 h-4 text-red-600" />
                        {msg.name}
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-slate-600 font-bold text-sm">
                        <Mail className="w-4 h-4 text-red-600" />
                        {msg.email}
                      </div>
                      {msg.phone && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-slate-600 font-bold text-sm">
                          <Phone className="w-4 h-4 text-red-600" />
                          {msg.phone}
                        </div>
                      )}
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed">
                      {msg.message}
                    </div>
                  </div>
                  <div className="md:w-48 flex flex-col justify-between items-end gap-4">
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center justify-end gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Устгах
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
