'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Message, 
  Ticket, 
  ChatState, 
  ChatNotification,
  AUTO_REPLY_TEMPLATES,
  SUPPORT_AGENTS
} from '@/types/chat';

const STORAGE_KEY = 'clipbox_chat_data';
const NOTIFICATION_STORAGE_KEY = 'clipbox_chat_notifications';

export function useChat(userRole: 'clipper' | 'advertiser', userId: string = 'user-1') {
  const [state, setState] = useState<ChatState>({
    tickets: [],
    activeTicketId: null,
    isTyping: false,
    typingUser: undefined,
    unreadCount: 0,
    connectionStatus: 'connected'
  });

  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoReplyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          // Convert date strings back to Date objects
          const tickets = parsedData.tickets.map((ticket: any) => ({
            ...ticket,
            createdAt: new Date(ticket.createdAt),
            updatedAt: new Date(ticket.updatedAt),
            messages: ticket.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }));
          
          setState(prev => ({
            ...prev,
            tickets: tickets.filter((t: Ticket) => t.userId === userId && t.userRole === userRole)
          }));
        }

        const storedNotifications = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications);
          setNotifications(parsedNotifications.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          })));
        }
      } catch (error) {
        console.error('Error loading chat data:', error);
      }
    };

    loadData();
  }, [userId, userRole]);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    try {
      const dataToStore = {
        tickets: state.tickets,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Error saving chat data:', error);
    }
  }, [state.tickets]);

  // Save notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }, [notifications]);

  // Create a new ticket
  const createTicket = useCallback((subject: string, category: string, priority: 'low' | 'normal' | 'high', initialMessage: string) => {
    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      userId,
      userRole,
      userName: userRole === 'clipper' ? 'Jean Dupont' : 'Entreprise ABC',
      userEmail: userRole === 'clipper' ? 'jean@example.com' : 'contact@abc.com',
      subject,
      category,
      priority,
      status: 'open',
      messages: [
        {
          id: `msg-${Date.now()}`,
          ticketId: `ticket-${Date.now()}`,
          sender: 'user',
          senderName: userRole === 'clipper' ? 'Jean Dupont' : 'Entreprise ABC',
          content: initialMessage,
          timestamp: new Date(),
          read: true,
          status: 'sent'
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [category]
    };

    setState(prev => ({
      ...prev,
      tickets: [...prev.tickets, newTicket],
      activeTicketId: newTicket.id
    }));

    // Add notification
    const notification: ChatNotification = {
      id: `notif-${Date.now()}`,
      ticketId: newTicket.id,
      type: 'new_message',
      message: `Nouveau ticket créé: ${subject}`,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [...prev, notification]);

    // Simulate auto-reply after a delay
    simulateAutoReply(newTicket.id, initialMessage);

    return newTicket.id;
  }, [userId, userRole]);

  // Send a message in an existing ticket
  const sendMessage = useCallback((ticketId: string, content: string, attachments?: any[]) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      ticketId,
      sender: 'user',
      senderName: userRole === 'clipper' ? 'Jean Dupont' : 'Entreprise ABC',
      content,
      timestamp: new Date(),
      read: true,
      attachments,
      status: 'sending'
    };

    setState(prev => ({
      ...prev,
      tickets: prev.tickets.map(ticket => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            messages: [...ticket.messages, newMessage],
            updatedAt: new Date()
          };
        }
        return ticket;
      })
    }));

    // Simulate message sent status
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        tickets: prev.tickets.map(ticket => {
          if (ticket.id === ticketId) {
            return {
              ...ticket,
              messages: ticket.messages.map(msg => 
                msg.id === newMessage.id 
                  ? { ...msg, status: 'sent' }
                  : msg
              )
            };
          }
          return ticket;
        })
      }));
    }, 500);

    // Simulate auto-reply
    simulateAutoReply(ticketId, content);
  }, [userRole]);

  // Simulate auto-reply from support
  const simulateAutoReply = useCallback((ticketId: string, userMessage: string) => {
    // Clear any existing timeout
    if (autoReplyTimeoutRef.current) {
      clearTimeout(autoReplyTimeoutRef.current);
    }

    // Show typing indicator
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isTyping: true,
        typingUser: 'Support'
      }));
    }, 1000);

    // Find appropriate auto-reply template
    const lowerMessage = userMessage.toLowerCase();
    let template = AUTO_REPLY_TEMPLATES.find(t => 
      t.trigger !== 'default' && lowerMessage.includes(t.trigger)
    ) || AUTO_REPLY_TEMPLATES.find(t => t.trigger === 'default');

    const delay = template?.delay || 3000;

    autoReplyTimeoutRef.current = setTimeout(() => {
      // Select a random online agent
      const onlineAgents = SUPPORT_AGENTS.filter(a => a.status === 'online');
      const agent = onlineAgents[Math.floor(Math.random() * onlineAgents.length)] || SUPPORT_AGENTS[0];

      const replyMessage: Message = {
        id: `msg-${Date.now()}`,
        ticketId,
        sender: 'support',
        senderName: agent.name,
        senderAvatar: agent.avatar,
        content: template?.response || "Merci pour votre message. Un agent va vous répondre rapidement.",
        timestamp: new Date(),
        read: false,
        status: 'sent'
      };

      setState(prev => ({
        ...prev,
        isTyping: false,
        typingUser: undefined,
        unreadCount: prev.unreadCount + 1,
        tickets: prev.tickets.map(ticket => {
          if (ticket.id === ticketId) {
            return {
              ...ticket,
              messages: [...ticket.messages, replyMessage],
              updatedAt: new Date(),
              assignedTo: agent.name
            };
          }
          return ticket;
        })
      }));

      // Add notification for new message
      const notification: ChatNotification = {
        id: `notif-${Date.now()}`,
        ticketId,
        type: 'new_message',
        message: `Nouvelle réponse de ${agent.name}`,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [...prev, notification]);

      // Play notification sound (optional)
      playNotificationSound();
    }, delay);
  }, []);

  // Mark messages as read
  const markAsRead = useCallback((ticketId: string) => {
    setState(prev => ({
      ...prev,
      tickets: prev.tickets.map(ticket => {
        if (ticket.id === ticketId) {
          const unreadMessages = ticket.messages.filter(m => !m.read && m.sender === 'support');
          return {
            ...ticket,
            messages: ticket.messages.map(msg => ({ ...msg, read: true }))
          };
        }
        return ticket;
      }),
      unreadCount: Math.max(0, prev.unreadCount - 1)
    }));
  }, []);

  // Update ticket status
  const updateTicketStatus = useCallback((ticketId: string, status: Ticket['status']) => {
    setState(prev => ({
      ...prev,
      tickets: prev.tickets.map(ticket => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            status,
            updatedAt: new Date()
          };
        }
        return ticket;
      })
    }));

    // Add notification
    const notification: ChatNotification = {
      id: `notif-${Date.now()}`,
      ticketId,
      type: status === 'resolved' ? 'ticket_resolved' : 'ticket_updated',
      message: `Ticket ${status === 'resolved' ? 'résolu' : 'mis à jour'}`,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [...prev, notification]);
  }, []);

  // Set active ticket
  const setActiveTicket = useCallback((ticketId: string | null) => {
    setState(prev => ({
      ...prev,
      activeTicketId: ticketId
    }));

    if (ticketId) {
      markAsRead(ticketId);
    }
  }, [markAsRead]);

  // Delete ticket
  const deleteTicket = useCallback((ticketId: string) => {
    setState(prev => ({
      ...prev,
      tickets: prev.tickets.filter(t => t.id !== ticketId),
      activeTicketId: prev.activeTicketId === ticketId ? null : prev.activeTicketId
    }));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  // Play notification sound
  const playNotificationSound = () => {
    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  };

  // Simulate file upload
  const uploadFile = useCallback(async (file: File): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `file-${Date.now()}`,
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type.startsWith('image/') ? 'image' : 'document',
          size: file.size
        });
      }, 1500);
    });
  }, []);

  // Get active ticket
  const activeTicket = state.tickets.find(t => t.id === state.activeTicketId);

  // Get unread notifications count
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return {
    tickets: state.tickets,
    activeTicket,
    activeTicketId: state.activeTicketId,
    isTyping: state.isTyping,
    typingUser: state.typingUser,
    unreadCount: state.unreadCount,
    connectionStatus: state.connectionStatus,
    notifications,
    unreadNotificationsCount,
    createTicket,
    sendMessage,
    markAsRead,
    updateTicketStatus,
    setActiveTicket,
    deleteTicket,
    clearNotifications,
    markNotificationAsRead,
    uploadFile
  };
}