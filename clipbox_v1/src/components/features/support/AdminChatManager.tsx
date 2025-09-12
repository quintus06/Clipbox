'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  HeadphonesIcon,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  User,
  Calendar,
  Send,
  Paperclip,
  Star,
  MoreVertical,
  Archive,
  Trash2,
  Flag,
  X,
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  BarChart3,
  PieChart,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Edit,
  Save,
  Plus,
  Tag,
  StickyNote,
  UserCheck,
  Mail,
  Phone,
  Building,
  Zap,
  AlertTriangle,
  CheckSquare,
  XCircle,
  ArrowUp,
  ArrowDown,
  ArrowRight
} from 'lucide-react';
import { useAdminChat, AdminFilters, ResponseTemplate } from '@/hooks/use-admin-chat';
import { Ticket } from '@/types/chat';

interface AdminChatManagerProps {
  className?: string;
}

export default function AdminChatManager({ className = '' }: AdminChatManagerProps) {
  const {
    tickets,
    allTickets,
    filters,
    setFilters,
    selectedTicket,
    selectedTicketId,
    setSelectedTicketId,
    stats,
    agents,
    templates,
    isLoading,
    replyToTicket,
    updateTicketStatus,
    updateTicketPriority,
    assignTicket,
    addInternalNote,
    addTag,
    removeTag,
    bulkUpdateStatus,
    bulkAssign,
    exportToCSV,
    saveTemplate,
    deleteTemplate
  } = useAdminChat();

  const [replyMessage, setReplyMessage] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [activeTab, setActiveTab] = useState<'tickets' | 'stats' | 'templates'>('tickets');
  const [showInternalNotes, setShowInternalNotes] = useState(false);
  const [internalNote, setInternalNote] = useState('');
  const [newTag, setNewTag] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentAgent, setCurrentAgent] = useState('Admin');
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'kanban'>('split');

  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Format time functions
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Il y a quelques secondes';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  };

  const formatResponseTime = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}min`;
  };

  // Status and priority helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'resolved':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'closed':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <ArrowUp className="h-4 w-4 text-red-600" />;
      case 'normal':
        return <ArrowRight className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <ArrowDown className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'closed':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Handle reply
  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    
    replyToTicket(selectedTicket.id, replyMessage, currentAgent);
    setReplyMessage('');
  };

  // Handle template selection
  const handleTemplateSelect = (template: ResponseTemplate) => {
    let content = template.content;
    
    // Replace variables with actual values
    if (selectedTicket) {
      content = content
        .replace('{{userName}}', selectedTicket.userName)
        .replace('{{agentName}}', currentAgent)
        .replace('{{subject}}', selectedTicket.subject);
    }
    
    setReplyMessage(content);
    setShowTemplates(false);
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'close':
        bulkUpdateStatus(selectedTickets, 'closed');
        break;
      case 'resolve':
        bulkUpdateStatus(selectedTickets, 'resolved');
        break;
      case 'assign':
        // Show agent selection modal
        const agent = prompt('Assigner à quel agent ?');
        if (agent) {
          bulkAssign(selectedTickets, agent);
        }
        break;
    }
    setSelectedTickets([]);
    setShowBulkActions(false);
  };

  // Toggle ticket selection
  const toggleTicketSelection = (ticketId: string) => {
    setSelectedTickets(prev => {
      if (prev.includes(ticketId)) {
        return prev.filter(id => id !== ticketId);
      }
      return [...prev, ticketId];
    });
  };

  // Stats cards data
  const statsCards = [
    {
      label: 'Total tickets',
      value: stats.totalTickets,
      change: '+12%',
      trend: 'up',
      icon: HeadphonesIcon,
      color: 'purple'
    },
    {
      label: 'Ouverts',
      value: stats.openTickets,
      change: stats.openTickets > 10 ? '+5' : '-2',
      trend: stats.openTickets > 10 ? 'up' : 'down',
      icon: AlertCircle,
      color: 'red'
    },
    {
      label: 'Temps de réponse',
      value: formatResponseTime(stats.averageResponseTime),
      change: '-15%',
      trend: 'down',
      icon: Clock,
      color: 'blue'
    },
    {
      label: 'Satisfaction',
      value: `${stats.satisfactionScore.toFixed(1)}/5`,
      change: '+0.3',
      trend: 'up',
      icon: Star,
      color: 'yellow'
    }
  ];

  // Render statistics dashboard
  const renderStatsDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
              </div>
              <span className={`text-xs font-medium flex items-center gap-1 ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Tickets par catégorie
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.ticketsByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {category}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Performance des agents
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.agentPerformance).map(([agent, perf]) => (
              <div key={agent} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {agent}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {perf.resolved}/{perf.assigned} résolus
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.round(perf.satisfaction)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>⏱ {formatResponseTime(perf.avgResponseTime)}</span>
                  <span>📊 {perf.assigned} assignés</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Tendances (7 derniers jours)
        </h3>
        <div className="flex items-end gap-2 h-40">
          {stats.trendsData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center gap-1">
                <div
                  className="w-full bg-purple-600 rounded-t"
                  style={{ height: `${day.created * 20}px` }}
                  title={`${day.created} créés`}
                ></div>
                <div
                  className="w-full bg-green-600 rounded-t"
                  style={{ height: `${day.resolved * 20}px` }}
                  title={`${day.resolved} résolus`}
                ></div>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-600 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Créés</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Résolus</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render templates manager
  const renderTemplatesManager = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Templates de réponse
          </h3>
          <button
            onClick={() => {
              const name = prompt('Nom du template:');
              if (name) {
                const newTemplate: ResponseTemplate = {
                  id: `tpl-${Date.now()}`,
                  name,
                  content: '',
                  category: 'custom',
                  shortcuts: [],
                  variables: []
                };
                saveTemplate(newTemplate);
              }
            }}
            className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouveau
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {templates.map((template) => (
          <div key={template.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {template.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                    {template.category}
                  </span>
                  {template.shortcuts?.map(shortcut => (
                    <span key={shortcut} className="text-xs text-gray-500">
                      /{shortcut}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const content = prompt('Contenu du template:', template.content);
                    if (content !== null) {
                      saveTemplate({ ...template, content });
                    }
                  }}
                  className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="p-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {template.content}
            </p>
            {template.variables && template.variables.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">Variables:</span>
                {template.variables.map(variable => (
                  <span key={variable} className="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded">
                    {`{{${variable}}}`}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render ticket list
  const renderTicketList = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={filters.searchTerm || ''}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 ${
                showFilters ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <Filter className="h-5 w-5" />
            </button>
            <button
              onClick={exportToCSV}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
              title="Exporter en CSV"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <select
                value={filters.status || 'all'}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              >
                <option value="all">Tous statuts</option>
                <option value="open">Ouverts</option>
                <option value="pending">En cours</option>
                <option value="resolved">Résolus</option>
                <option value="closed">Fermés</option>
              </select>
              
              <select
                value={filters.priority || 'all'}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value as any })}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              >
                <option value="all">Toutes priorités</option>
                <option value="high">Haute</option>
                <option value="normal">Normale</option>
                <option value="low">Basse</option>
              </select>
              
              <select
                value={filters.role || 'all'}
                onChange={(e) => setFilters({ ...filters, role: e.target.value as any })}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              >
                <option value="all">Tous rôles</option>
                <option value="clipper">Clippers</option>
                <option value="advertiser">Advertisers</option>
              </select>
              
              <select
                value={filters.assignedTo || ''}
                onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              >
                <option value="">Non assigné</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.name}>{agent.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Bulk actions */}
      {selectedTickets.length > 0 && (
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-700 dark:text-purple-300">
              {selectedTickets.length} ticket(s) sélectionné(s)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('resolve')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Marquer résolu
              </button>
              <button
                onClick={() => handleBulkAction('close')}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Fermer
              </button>
              <button
                onClick={() => handleBulkAction('assign')}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Assigner
              </button>
              <button
                onClick={() => setSelectedTickets([])}
                className="p-1 text-gray-600 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tickets */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors ${
              selectedTicketId === ticket.id ? 'bg-purple-50 dark:bg-purple-900/20' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedTickets.includes(ticket.id)}
                onChange={() => toggleTicketSelection(ticket.id)}
                className="mt-1"
                onClick={(e) => e.stopPropagation()}
              />
              
              <div
                className="flex-1"
                onClick={() => {
                  setSelectedTicketId(ticket.id);
                  if (isMobile) setShowMobileChat(true);
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {ticket.subject}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">#{ticket.id.slice(-6)}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {ticket.userName}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        ticket.userRole === 'clipper' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {ticket.userRole}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(ticket.priority)}
                    <span className={`p-1 rounded ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                  {ticket.messages[ticket.messages.length - 1]?.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {ticket.assignedTo && (
                      <div className="flex items-center gap-1">
                        <UserCheck className="h-3 w-3" />
                        {ticket.assignedTo}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {ticket.messages.length}
                    </div>
                    {ticket.responseTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatResponseTime(ticket.responseTime)}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimeAgo(ticket.updatedAt)}
                  </span>
                </div>
                
                {ticket.tags && ticket.tags.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {ticket.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render ticket detail
  const renderTicketDetail = () => {
    if (!selectedTicket) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-full flex items-center justify-center">
          <div className="text-center">
            <HeadphonesIcon className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">
              Sélectionnez un ticket pour voir les détails
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col">
        {/* Ticket Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedTicket.subject}
              </h2>
              <div className="flex items-center gap-3 mt-2 text-sm">
                <span className="text-gray-500">#{selectedTicket.id.slice(-6)}</span>
                <span className="text-gray-500">•</span>
                <div className="flex items-center gap-1">
                  {selectedTicket.userRole === 'clipper' ? (
                    <User className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Building className="h-4 w-4 text-green-600" />
                  )}
                  <span className="text-gray-700 dark:text-gray-300">{selectedTicket.userName}</span>
                </div>
                <span className="text-gray-500">•</span>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{selectedTicket.userEmail}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTicket.status)}`}>
                  {selectedTicket.status === 'open' && 'Ouvert'}
                  {selectedTicket.status === 'pending' && 'En cours'}
                  {selectedTicket.status === 'resolved' && 'Résolu'}
                  {selectedTicket.status === 'closed' && 'Fermé'}
                </span>
                <div className="flex items-center gap-1">
                  {getPriorityIcon(selectedTicket.priority)}
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Priorité {selectedTicket.priority}
                  </span>
                </div>
                {selectedTicket.assignedTo && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <UserCheck className="h-3 w-3" />
                    {selectedTicket.assignedTo}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={selectedTicket.status}
                onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              >
                <option value="open">Ouvert</option>
                <option value="pending">En cours</option>
                <option value="resolved">Résolu</option>
                <option value="closed">Fermé</option>
              </select>
              
              <select
                value={selectedTicket.priority}
                onChange={(e) => updateTicketPriority(selectedTicket.id, e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              >
                <option value="low">Basse</option>
                <option value="normal">Normale</option>
                <option value="high">Haute</option>
              </select>
              
              <button
                onClick={() => setShowInternalNotes(!showInternalNotes)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                title="Notes internes"
              >
                <StickyNote className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex items-center gap-2 mt-3">
            <Tag className="h-4 w-4 text-gray-400" />
            {selectedTicket.tags?.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded flex items-center gap-1">
                {tag}
                <button
                  onClick={() => removeTag(selectedTicket.id, tag)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nouveau tag"
                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newTag.trim()) {
                    addTag(selectedTicket.id, newTag.trim());
                    setNewTag('');
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Internal Notes */}
        {showInternalNotes && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Notes internes
            </h4>
            <div className="space-y-2 mb-3">
              {selectedTicket.internalNotes?.map((note, index) => (
                <div key={index} className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-white dark:bg-gray-800 rounded">
                  {note}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Ajouter une note interne..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && internalNote.trim()) {
                    addInternalNote(selectedTicket.id, internalNote.trim());
                    setInternalNote('');
                  }
                }}
              />
              <button
                onClick={() => {
                  if (internalNote.trim()) {
                    addInternalNote(selectedTicket.id, internalNote.trim());
                    setInternalNote('');
                  }
                }}
                className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Ajouter
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {selectedTicket.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'support' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${message.sender === 'support' ? 'order-2' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {message.senderAvatar && (
                      <span className="text-lg">{message.senderAvatar}</span>
                    )}
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {message.senderName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(message.timestamp)}
                    </span>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.sender === 'support'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map(attachment => (
                        <a
                          key={attachment.id}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700"
                        >
                          <Paperclip className="h-3 w-3" />
                          {attachment.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reply Box */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {showTemplates && (
            <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg max-h-60 overflow-y-auto">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Templates de réponse
              </p>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className="w-full text-left p-2 text-sm bg-white dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {template.content}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <select
              value={currentAgent}
              onChange={(e) => setCurrentAgent(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
            >
              {agents.map(agent => (
                <option key={agent.id} value={agent.name}>{agent.name}</option>
              ))}
            </select>
            
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Tapez votre réponse..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 resize-none"
              rows={3}
            />
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                title="Templates"
              >
                <FileText className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <Paperclip className="h-4 w-4" />
              </button>
            </div>
            
            <button
              onClick={handleSendReply}
              disabled={!replyMessage.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Envoyer
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Centre de support admin
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gérez tous les tickets de support des clippers et advertisers
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            title="Rafraîchir"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-3 py-1 text-sm rounded ${
                activeTab === 'tickets'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 font-medium'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Tickets
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-3 py-1 text-sm rounded ${
                activeTab === 'stats'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 font-medium'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Statistiques
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1 text-sm rounded ${
                activeTab === 'templates'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 font-medium'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Templates
            </button>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'stats' && renderStatsDashboard()}
      
      {activeTab === 'templates' && renderTemplatesManager()}
      
      {activeTab === 'tickets' && (
        <>
          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsCards.slice(0, 4).map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                    <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main content */}
          {isMobile ? (
            // Mobile view
            <div>
              {!showMobileChat ? (
                renderTicketList()
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowMobileChat(false)}
                    className="absolute top-4 left-4 z-10 p-2 bg-white dark:bg-gray-800 rounded-lg shadow"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {renderTicketDetail()}
                </div>
              )}
            </div>
          ) : (
            // Desktop view
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                {renderTicketList()}
              </div>
              <div className="lg:col-span-2">
                {renderTicketDetail()}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}