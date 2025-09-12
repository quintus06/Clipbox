'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Message, 
  Ticket, 
  ChatNotification,
  SUPPORT_AGENTS
} from '@/types/chat';

// Extended types for admin view
export interface AdminTicketView extends Ticket {
  assignedTo?: string;
  internalNotes?: string[];
  responseTime?: number;
  satisfaction?: number;
  tags?: string[];
  firstResponseTime?: number;
  resolutionTime?: number;
  interactions?: number;
}

export interface AdminStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  averageResponseTime: number;
  averageResolutionTime: number;
  satisfactionScore: number;
  ticketsByCategory: Record<string, number>;
  ticketsByPriority: Record<string, number>;
  ticketsByRole: { clipper: number; advertiser: number };
  agentPerformance: Record<string, {
    assigned: number;
    resolved: number;
    avgResponseTime: number;
    satisfaction: number;
  }>;
  trendsData: {
    date: string;
    created: number;
    resolved: number;
  }[];
}

export interface AdminFilters {
  status?: 'all' | 'open' | 'pending' | 'resolved' | 'closed';
  priority?: 'all' | 'low' | 'normal' | 'high';
  role?: 'all' | 'clipper' | 'advertiser';
  assignedTo?: string;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
  tags?: string[];
}

export interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  shortcuts?: string[];
  variables?: string[];
}

const STORAGE_KEY = 'clipbox_chat_data';
const ADMIN_STORAGE_KEY = 'clipbox_admin_chat_data';
const TEMPLATES_STORAGE_KEY = 'clipbox_admin_templates';

// Default response templates
const DEFAULT_TEMPLATES: ResponseTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Bienvenue',
    content: 'Bonjour {{userName}},\n\nMerci de nous avoir contactés. Je suis {{agentName}} et je vais m\'occuper de votre demande.\n\nComment puis-je vous aider aujourd\'hui ?',
    category: 'general',
    shortcuts: ['welcome', 'bienvenue'],
    variables: ['userName', 'agentName']
  },
  {
    id: 'tpl-2',
    name: 'Problème résolu',
    content: 'Bonjour {{userName}},\n\nJe suis heureux de vous informer que votre problème a été résolu. {{resolution}}\n\nN\'hésitez pas à nous recontacter si vous avez d\'autres questions.\n\nCordialement,\n{{agentName}}',
    category: 'resolution',
    shortcuts: ['resolved', 'resolu'],
    variables: ['userName', 'resolution', 'agentName']
  },
  {
    id: 'tpl-3',
    name: 'Demande d\'informations',
    content: 'Bonjour {{userName}},\n\nPour traiter votre demande, j\'aurais besoin des informations suivantes :\n{{infoList}}\n\nMerci de me fournir ces éléments dès que possible.\n\nCordialement,\n{{agentName}}',
    category: 'info_request',
    shortcuts: ['info', 'details'],
    variables: ['userName', 'infoList', 'agentName']
  },
  {
    id: 'tpl-4',
    name: 'Escalade',
    content: 'Bonjour {{userName}},\n\nVotre demande nécessite l\'intervention d\'un spécialiste. Je transfère votre ticket à {{specialistName}} qui est expert en {{expertise}}.\n\nIl/Elle vous contactera dans les plus brefs délais.\n\nCordialement,\n{{agentName}}',
    category: 'escalation',
    shortcuts: ['escalate', 'transfer'],
    variables: ['userName', 'specialistName', 'expertise', 'agentName']
  },
  {
    id: 'tpl-5',
    name: 'Suivi',
    content: 'Bonjour {{userName}},\n\nJe fais suite à notre échange concernant {{subject}}.\n\n{{updateInfo}}\n\nJe reste à votre disposition pour toute question.\n\nCordialement,\n{{agentName}}',
    category: 'followup',
    shortcuts: ['followup', 'suivi'],
    variables: ['userName', 'subject', 'updateInfo', 'agentName']
  }
];

export function useAdminChat() {
  const [tickets, setTickets] = useState<AdminTicketView[]>([]);
  const [filters, setFilters] = useState<AdminFilters>({
    status: 'all',
    priority: 'all',
    role: 'all'
  });
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [templates, setTemplates] = useState<ResponseTemplate[]>(DEFAULT_TEMPLATES);
  const [agents] = useState(SUPPORT_AGENTS);
  const [isLoading, setIsLoading] = useState(true);

  // Load all tickets from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        setIsLoading(true);
        
        // Load main chat data
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const allTickets = parsedData.tickets.map((ticket: any) => ({
            ...ticket,
            createdAt: new Date(ticket.createdAt),
            updatedAt: new Date(ticket.updatedAt),
            messages: ticket.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            })),
            // Add admin-specific fields
            responseTime: calculateResponseTime(ticket),
            interactions: ticket.messages.length,
            satisfaction: Math.floor(Math.random() * 5) + 1 // Mock satisfaction
          }));
          
          setTickets(allTickets);
        }

        // Load admin-specific data
        const adminData = localStorage.getItem(ADMIN_STORAGE_KEY);
        if (adminData) {
          const parsedAdminData = JSON.parse(adminData);
          // Merge admin data with tickets
          setTickets(prev => prev.map(ticket => {
            const adminInfo = parsedAdminData[ticket.id];
            if (adminInfo) {
              return { ...ticket, ...adminInfo };
            }
            return ticket;
          }));
        }

        // Load templates
        const storedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
        if (storedTemplates) {
          setTemplates(JSON.parse(storedTemplates));
        }
      } catch (error) {
        console.error('Error loading admin chat data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    // Set up interval to refresh data
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Save admin-specific data
  useEffect(() => {
    if (tickets.length > 0) {
      try {
        const adminData: Record<string, any> = {};
        tickets.forEach(ticket => {
          adminData[ticket.id] = {
            assignedTo: ticket.assignedTo,
            internalNotes: ticket.internalNotes,
            tags: ticket.tags,
            satisfaction: ticket.satisfaction
          };
        });
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminData));
      } catch (error) {
        console.error('Error saving admin data:', error);
      }
    }
  }, [tickets]);

  // Save templates
  useEffect(() => {
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error('Error saving templates:', error);
    }
  }, [templates]);

  // Calculate response time
  const calculateResponseTime = (ticket: any): number => {
    const firstUserMessage = ticket.messages.find((m: any) => m.sender === 'user');
    const firstSupportMessage = ticket.messages.find((m: any) => m.sender === 'support');
    
    if (firstUserMessage && firstSupportMessage) {
      const userTime = new Date(firstUserMessage.timestamp).getTime();
      const supportTime = new Date(firstSupportMessage.timestamp).getTime();
      return Math.floor((supportTime - userTime) / 1000 / 60); // in minutes
    }
    
    return 0;
  };

  // Filter tickets based on criteria
  const filteredTickets = useMemo(() => {
    let filtered = [...tickets];

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(t => t.priority === filters.priority);
    }

    if (filters.role && filters.role !== 'all') {
      filtered = filtered.filter(t => t.userRole === filters.role);
    }

    if (filters.assignedTo) {
      filtered = filtered.filter(t => t.assignedTo === filters.assignedTo);
    }

    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(t => new Date(t.createdAt) >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(t => new Date(t.createdAt) <= filters.dateTo!);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.subject.toLowerCase().includes(term) ||
        t.userName.toLowerCase().includes(term) ||
        t.userEmail.toLowerCase().includes(term) ||
        t.messages.some(m => m.content.toLowerCase().includes(term))
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(t =>
        filters.tags!.some(tag => t.tags?.includes(tag))
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    return filtered;
  }, [tickets, filters]);

  // Calculate statistics
  const stats = useMemo((): AdminStats => {
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'pending').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
    const closedTickets = tickets.filter(t => t.status === 'closed').length;

    // Average response time
    const responseTimes = tickets
      .map(t => t.responseTime || 0)
      .filter(t => t > 0);
    const averageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;

    // Average resolution time (mock data)
    const resolutionTimes = tickets
      .filter(t => t.status === 'resolved' || t.status === 'closed')
      .map(t => {
        const created = t.createdAt.getTime();
        const updated = t.updatedAt.getTime();
        return (updated - created) / 1000 / 60 / 60; // in hours
      });
    const averageResolutionTime = resolutionTimes.length > 0
      ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length
      : 0;

    // Satisfaction score
    const satisfactionScores = tickets
      .map(t => t.satisfaction || 0)
      .filter(s => s > 0);
    const satisfactionScore = satisfactionScores.length > 0
      ? satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length
      : 0;

    // Tickets by category
    const ticketsByCategory: Record<string, number> = {};
    tickets.forEach(t => {
      ticketsByCategory[t.category] = (ticketsByCategory[t.category] || 0) + 1;
    });

    // Tickets by priority
    const ticketsByPriority: Record<string, number> = {
      low: tickets.filter(t => t.priority === 'low').length,
      normal: tickets.filter(t => t.priority === 'normal').length,
      high: tickets.filter(t => t.priority === 'high').length
    };

    // Tickets by role
    const ticketsByRole = {
      clipper: tickets.filter(t => t.userRole === 'clipper').length,
      advertiser: tickets.filter(t => t.userRole === 'advertiser').length
    };

    // Agent performance
    const agentPerformance: Record<string, any> = {};
    agents.forEach(agent => {
      const agentTickets = tickets.filter(t => t.assignedTo === agent.name);
      const resolvedByAgent = agentTickets.filter(t => 
        t.status === 'resolved' || t.status === 'closed'
      );
      const agentResponseTimes = agentTickets
        .map(t => t.responseTime || 0)
        .filter(t => t > 0);
      const agentSatisfaction = agentTickets
        .map(t => t.satisfaction || 0)
        .filter(s => s > 0);

      agentPerformance[agent.name] = {
        assigned: agentTickets.length,
        resolved: resolvedByAgent.length,
        avgResponseTime: agentResponseTimes.length > 0
          ? agentResponseTimes.reduce((a, b) => a + b, 0) / agentResponseTimes.length
          : 0,
        satisfaction: agentSatisfaction.length > 0
          ? agentSatisfaction.reduce((a, b) => a + b, 0) / agentSatisfaction.length
          : 0
      };
    });

    // Trends data (last 7 days)
    const trendsData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const created = tickets.filter(t => 
        t.createdAt >= date && t.createdAt < nextDate
      ).length;

      const resolved = tickets.filter(t =>
        (t.status === 'resolved' || t.status === 'closed') &&
        t.updatedAt >= date && t.updatedAt < nextDate
      ).length;

      trendsData.push({
        date: date.toISOString().split('T')[0],
        created,
        resolved
      });
    }

    return {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      averageResponseTime,
      averageResolutionTime,
      satisfactionScore,
      ticketsByCategory,
      ticketsByPriority,
      ticketsByRole,
      agentPerformance,
      trendsData
    };
  }, [tickets, agents]);

  // Reply to ticket as admin
  const replyToTicket = useCallback((ticketId: string, content: string, agentName: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      ticketId,
      sender: 'support',
      senderName: agentName,
      content,
      timestamp: new Date(),
      read: false,
      status: 'sent'
    };

    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          messages: [...ticket.messages, newMessage],
          updatedAt: new Date(),
          status: ticket.status === 'open' ? 'pending' : ticket.status
        };
      }
      return ticket;
    }));

    // Update the main storage to sync with user dashboards
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const updatedTickets = parsedData.tickets.map((t: any) => {
          if (t.id === ticketId) {
            return {
              ...t,
              messages: [...t.messages, newMessage],
              updatedAt: new Date().toISOString(),
              status: t.status === 'open' ? 'pending' : t.status
            };
          }
          return t;
        });
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...parsedData,
          tickets: updatedTickets
        }));
      }
    } catch (error) {
      console.error('Error updating main storage:', error);
    }
  }, []);

  // Update ticket status
  const updateTicketStatus = useCallback((ticketId: string, status: Ticket['status']) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status,
          updatedAt: new Date()
        };
      }
      return ticket;
    }));

    // Update main storage
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const updatedTickets = parsedData.tickets.map((t: any) => {
          if (t.id === ticketId) {
            return {
              ...t,
              status,
              updatedAt: new Date().toISOString()
            };
          }
          return t;
        });
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...parsedData,
          tickets: updatedTickets
        }));
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  }, []);

  // Update ticket priority
  const updateTicketPriority = useCallback((ticketId: string, priority: 'low' | 'normal' | 'high') => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          priority,
          updatedAt: new Date()
        };
      }
      return ticket;
    }));
  }, []);

  // Assign ticket to agent
  const assignTicket = useCallback((ticketId: string, agentName: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          assignedTo: agentName,
          updatedAt: new Date()
        };
      }
      return ticket;
    }));
  }, []);

  // Add internal note
  const addInternalNote = useCallback((ticketId: string, note: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          internalNotes: [...(ticket.internalNotes || []), note],
          updatedAt: new Date()
        };
      }
      return ticket;
    }));
  }, []);

  // Add tag to ticket
  const addTag = useCallback((ticketId: string, tag: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        const currentTags = ticket.tags || [];
        if (!currentTags.includes(tag)) {
          return {
            ...ticket,
            tags: [...currentTags, tag],
            updatedAt: new Date()
          };
        }
      }
      return ticket;
    }));
  }, []);

  // Remove tag from ticket
  const removeTag = useCallback((ticketId: string, tag: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          tags: (ticket.tags || []).filter(t => t !== tag),
          updatedAt: new Date()
        };
      }
      return ticket;
    }));
  }, []);

  // Bulk update tickets
  const bulkUpdateStatus = useCallback((ticketIds: string[], status: Ticket['status']) => {
    ticketIds.forEach(id => updateTicketStatus(id, status));
  }, [updateTicketStatus]);

  const bulkAssign = useCallback((ticketIds: string[], agentName: string) => {
    ticketIds.forEach(id => assignTicket(id, agentName));
  }, [assignTicket]);

  // Export tickets to CSV
  const exportToCSV = useCallback(() => {
    const headers = [
      'ID', 'Subject', 'Status', 'Priority', 'Category', 
      'User Name', 'User Email', 'User Role', 'Assigned To',
      'Created At', 'Updated At', 'Messages Count', 'Response Time (min)',
      'Satisfaction'
    ];

    const rows = filteredTickets.map(ticket => [
      ticket.id,
      ticket.subject,
      ticket.status,
      ticket.priority,
      ticket.category,
      ticket.userName,
      ticket.userEmail,
      ticket.userRole,
      ticket.assignedTo || '',
      ticket.createdAt.toISOString(),
      ticket.updatedAt.toISOString(),
      ticket.messages.length.toString(),
      (ticket.responseTime || 0).toString(),
      (ticket.satisfaction || 0).toString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `tickets_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredTickets]);

  // Add/Update template
  const saveTemplate = useCallback((template: ResponseTemplate) => {
    setTemplates(prev => {
      const existing = prev.findIndex(t => t.id === template.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = template;
        return updated;
      }
      return [...prev, template];
    });
  }, []);

  // Delete template
  const deleteTemplate = useCallback((templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  }, []);

  // Get selected ticket
  const selectedTicket = useMemo(() => {
    return tickets.find(t => t.id === selectedTicketId) || null;
  }, [tickets, selectedTicketId]);

  return {
    tickets: filteredTickets,
    allTickets: tickets,
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
  };
}