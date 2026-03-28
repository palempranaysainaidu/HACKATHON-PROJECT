import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useEventStore from '../store/useEventStore';
import { getEmailsByEvent, updateEmail, sendEmail } from '../api/email.api';
import { LayoutDashboard, ListTodo, PieChart, Mail, Zap, Send, Copy, Edit3, Check, X, Loader2 } from 'lucide-react';

const TYPE_LABELS = {
  permission: { label: 'Permission Request', color: 'text-amber-400 bg-amber-400/10' },
  sponsorship: { label: 'Sponsorship Proposal', color: 'text-blue-400 bg-blue-400/10' },
  volunteer_recruitment: { label: 'Volunteer Recruitment', color: 'text-emerald-400 bg-emerald-400/10' },
  attendee_confirmation: { label: 'Confirmation', color: 'text-purple-400 bg-purple-400/10' },
  general: { label: 'General', color: 'text-gray-400 bg-gray-400/10' },
};

export default function EmailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { emails, setEmails } = useEventStore();
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editBody, setEditBody] = useState('');
  const [sendingId, setSendingId] = useState(null);
  const [recipientEmails, setRecipientEmails] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getEmailsByEvent(eventId);
        setEmails(res.data.emails);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [eventId]);

  const handleEdit = (email) => {
    setEditingId(email._id);
    setEditBody(email.body);
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateEmail(id, { body: editBody });
      setEmails(emails.map(e => e._id === id ? { ...e, body: editBody } : e));
    } catch (err) { console.error(err); }
    setEditingId(null);
  };

  const handleSend = async (id) => {
    const recipient = recipientEmails[id];
    if (!recipient) return;
    setSendingId(id);
    try {
      await sendEmail(id, recipient);
      setEmails(emails.map(e => e._id === id ? { ...e, status: 'sent', sentAt: new Date() } : e));
    } catch (err) {
      console.error(err);
    }
    setSendingId(null);
  };

  const handleCopy = (email) => {
    navigator.clipboard.writeText(email.subject + '\n\n' + email.body);
    setCopiedId(email._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: `/dashboard/${eventId}` },
    { icon: ListTodo, label: 'Tasks', path: `/dashboard/${eventId}/tasks` },
    { icon: PieChart, label: 'Budget', path: `/dashboard/${eventId}/budget` },
    { icon: Mail, label: 'Emails', path: `/dashboard/${eventId}/emails`, active: true },
  ];

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><svg className="animate-spin h-6 w-6 text-purple-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>;

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <aside className="w-64 bg-gray-900/50 border-r border-gray-800 flex flex-col fixed h-screen">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-white">Event<span className="text-purple-400">OS</span></span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item, i) => (
            <Link key={i} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${item.active ? 'bg-purple-600/20 text-purple-300 border border-purple-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
              <item.icon className="w-5 h-5" />{item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="ml-64 flex-1 p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Email Drafts</h1>
        <p className="text-gray-400 text-sm mb-8">AI-generated emails ready to review and send</p>

        <div className="space-y-6">
          {emails.map(email => (
            <div key={email._id} className="glass-card rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/50">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${TYPE_LABELS[email.type]?.color || 'text-gray-400 bg-gray-400/10'}`}>
                    {TYPE_LABELS[email.type]?.label || email.type}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${email.status === 'sent' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                    {email.status === 'sent' ? '✓ Sent' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Subject */}
              <div className="px-6 py-3 border-b border-gray-800/30">
                <p className="text-sm font-semibold text-white">{email.subject}</p>
              </div>

              {/* Body */}
              <div className="px-6 py-4">
                {editingId === email._id ? (
                  <div>
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      rows={12}
                      className="w-full bg-gray-800 text-gray-200 text-sm rounded-lg p-4 outline-none focus:ring-1 focus:ring-purple-500 border border-gray-700 resize-y"
                    />
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleSaveEdit(email._id)} className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-all">
                        <Check className="w-4 h-4" />Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="flex items-center gap-1.5 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-all">
                        <X className="w-4 h-4" />Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <pre className={`text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed ${expandedId !== email._id ? 'max-h-32 overflow-hidden' : ''}`}>
                      {email.body}
                    </pre>
                    {email.body.length > 200 && (
                      <button onClick={() => setExpandedId(expandedId === email._id ? null : email._id)} className="text-purple-400 text-xs mt-2 hover:text-purple-300">
                        {expandedId === email._id ? 'Show less' : 'Read more...'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              {editingId !== email._id && (
                <div className="px-6 py-4 border-t border-gray-800/30 flex items-center gap-3 flex-wrap">
                  {email.status !== 'sent' && (
                    <>
                      <input
                        type="email"
                        placeholder="recipient@email.com"
                        value={recipientEmails[email._id] || ''}
                        onChange={(e) => setRecipientEmails({ ...recipientEmails, [email._id]: e.target.value })}
                        className="px-3 py-2 bg-gray-800 text-white text-sm rounded-lg border border-gray-700 focus:border-purple-500 outline-none w-64"
                      />
                      <button
                        onClick={() => handleSend(email._id)}
                        disabled={sendingId === email._id || !recipientEmails[email._id]}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm rounded-lg transition-all disabled:opacity-50"
                      >
                        {sendingId === email._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {sendingId === email._id ? 'Sending...' : 'Send'}
                      </button>
                    </>
                  )}
                  <button onClick={() => handleEdit(email)} className="flex items-center gap-1.5 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-all">
                    <Edit3 className="w-4 h-4" />Edit
                  </button>
                  <button onClick={() => handleCopy(email)} className="flex items-center gap-1.5 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-all">
                    {copiedId === email._id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copiedId === email._id ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>
          ))}

          {emails.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No email drafts yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
