'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  X,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Image as ImageIcon,
  FileText,
  Download,
  Trash2,
  Archive,
  Bell,
  BellOff,
  User,
  Bot,
  Loader2,
  Smile,
  Mic,
  Camera
} from 'lucide-react';
import { useChat } from '@/hooks/use-chat';
import { Message, Ticket } from '@/types/chat';

interface ChatWidgetProps {
  userRole: 'clipper' | 'advertiser';
  userId?: string;
  className?: string;
  onClose?: () => void;
}

export default function ChatWidget({ userRole, userId = 'user-1', className = '', onClose }: ChatWidgetProps) {
  const {
    tickets,
    activeTicket,
    activeTicketId,
    isTyping,
    typingUser,
    unreadCount,
    connectionStatus,
    notifications,
    unreadNotificationsCount,
    createTicket,
    sendMessage,
    markAsRead,
    updateTicketStatus,
    setActiveTicket,
    deleteTicket,
    uploadFile
  } = useChat(userRole, userId);

  const [message, setMessage] = useState('');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTicket?.messages]);

  // Focus on input when active ticket changes
  useEffect(() => {
    if (activeTicket) {
      messageInputRef.current?.focus();
    }
  }, [activeTicketId]);

  const handleSendMessage = () => {
    if (!message.trim() || !activeTicketId) return;

    sendMessage(activeTicketId, message.trim(), attachments);
    setMessage('');
    setAttachments([]);
  };

  const handleCreateTicket = () => {
    if (!newTicketSubject.trim() || !newTicketMessage.trim() || !newTicketCategory) return;

    const ticketId = createTicket(
      newTicketSubject,
      newTicketCategory,
      newTicketPriority,
      newTicketMessage
    );

    setShowNewTicketForm(false);
    setNewTicketSubject('');
    setNewTicketCategory('');
    setNewTicketPriority('normal');
    setNewTicketMessage('');
    setActiveTicket(ticketId);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    const uploadedFiles: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploaded = await uploadFile(file);
      uploadedFiles.push(uploaded);
    }

    setAttachments(prev => [...prev, ...uploadedFiles]);
    setIsUploading(false);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getMessageStatusIcon = (status?: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'resolved':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'normal':
        return 'text-blue-600 dark:text-blue-400';
      case 'low':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const emojis = ['😊', '👍', '❤️', '🎉', '😂', '😍', '🤔', '👏', '🔥', '💯', '😎', '🙏'];

  const categories = userRole === 'clipper' 
    ? [
        { value: 'payments', label: 'Paiements' },
        { value: 'campaigns', label: 'Campagnes' },
        { value: 'technical', label: 'Problème technique' },
        { value: 'account', label: 'Compte' },
        { value: 'other', label: 'Autre' }
      ]
    : [
        { value: 'campaigns', label: 'Campagnes' },
        { value: 'billing', label: 'Facturation' },
        { value: 'analytics', label: 'Analytics' },
        { value: 'technical', label: 'Problème technique' },
        { value: 'account', label: 'Compte entreprise' },
        { value: 'api', label: 'Intégration API' },
        { value: 'other', label: 'Autre' }
      ];

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Support ClipBox</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {connectionStatus === 'connected' ? 'En ligne' : 
               connectionStatus === 'connecting' ? 'Connexion...' : 'Hors ligne'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            {soundEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tickets List or New Ticket Form */}
      {!activeTicket && !showNewTicketForm && (
        <div className="flex-1 overflow-y-auto p-4">
          <button
            onClick={() => setShowNewTicketForm(true)}
            className="w-full mb-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Nouveau ticket
          </button>
          
          {tickets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Aucun ticket en cours</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tickets.map(ticket => (
                <button
                  key={ticket.id}
                  onClick={() => setActiveTicket(ticket.id)}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                      {ticket.subject}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {ticket.category} • {new Date(ticket.updatedAt).toLocaleDateString()}
                    </span>
                    <span className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority === 'high' ? '🔴' : ticket.priority === 'normal' ? '🟡' : '🟢'}
                    </span>
                  </div>
                  {ticket.messages.filter(m => !m.read && m.sender === 'support').length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                        {ticket.messages.filter(m => !m.read && m.sender === 'support').length} nouveau(x) message(s)
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Ticket Form */}
      {showNewTicketForm && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <button
              onClick={() => setShowNewTicketForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
            >
              ← Retour
            </button>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Créer un nouveau ticket
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catégorie
              </label>
              <select
                value={newTicketCategory}
                onChange={(e) => setNewTicketCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priorité
              </label>
              <select
                value={newTicketPriority}
                onChange={(e) => setNewTicketPriority(e.target.value as 'low' | 'normal' | 'high')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="low">Faible</option>
                <option value="normal">Normal</option>
                <option value="high">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sujet
              </label>
              <input
                type="text"
                value={newTicketSubject}
                onChange={(e) => setNewTicketSubject(e.target.value)}
                placeholder="Décrivez brièvement votre problème"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                value={newTicketMessage}
                onChange={(e) => setNewTicketMessage(e.target.value)}
                rows={4}
                placeholder="Décrivez votre problème en détail..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              onClick={handleCreateTicket}
              disabled={!newTicketSubject.trim() || !newTicketMessage.trim() || !newTicketCategory}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Créer le ticket
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      {activeTicket && (
        <>
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTicket(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ←
              </button>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  {activeTicket.subject}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className={`px-2 py-0.5 rounded-full ${getStatusColor(activeTicket.status)}`}>
                    {activeTicket.status}
                  </span>
                  <span>#{activeTicket.id.slice(-6)}</span>
                  {activeTicket.assignedTo && (
                    <span>• Assigné à {activeTicket.assignedTo}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeTicket.status === 'open' && (
                <button
                  onClick={() => updateTicketStatus(activeTicket.id, 'resolved')}
                  className="text-xs px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Marquer résolu
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
                    deleteTicket(activeTicket.id);
                  }
                }}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTicket.messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0">
                    {msg.sender === 'support' ? (
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <span className="text-lg">{msg.senderAvatar || '🤖'}</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className={`px-4 py-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {msg.attachments.map((att, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 bg-white/10 rounded">
                              {att.type === 'image' ? (
                                <ImageIcon className="w-4 h-4" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                              <span className="text-xs">{att.name}</span>
                              <Download className="w-3 h-3 ml-auto cursor-pointer" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {msg.sender === 'user' && getMessageStatusIcon(msg.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <span className="text-lg">🤖</span>
                  </div>
                  <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{typingUser} est en train d'écrire</span>
                      <Loader2 className="w-3 h-3 animate-spin text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2 flex-wrap">
                {attachments.map((att, index) => (
                  <div key={index} className="relative group">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center gap-2">
                      {att.type === 'image' ? (
                        <ImageIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      )}
                      <span className="text-xs text-gray-700 dark:text-gray-300">{att.name}</span>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="ml-2 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={messageInputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Tapez votre message..."
                  rows={1}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  style={{ minHeight: '40px', maxHeight: '120px' }}
                />
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-2 bottom-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <Smile className="w-5 h-5" />
                </button>
                
                {showEmojiPicker && (
                  <div className="absolute bottom-12 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 grid grid-cols-6 gap-1">
                    {emojis.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setMessage(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Paperclip className="w-5 h-5" />
                )}
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || !activeTicketId}
                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="absolute top-16 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white">Notifications</h4>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-500 dark:text-gray-400">
                Aucune notification
              </p>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      !notif.read ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                    }`}
                  >
                    <p className="text-sm text-gray-900 dark:text-white">{notif.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(notif.timestamp).toLocaleString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}