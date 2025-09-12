export interface Message {
  id: string;
  ticketId: string;
  sender: 'user' | 'support';
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: Attachment[];
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'other';
  size: number;
}

export interface Ticket {
  id: string;
  userId: string;
  userRole: 'clipper' | 'advertiser';
  userName: string;
  userEmail: string;
  subject: string;
  category: string;
  priority: 'low' | 'normal' | 'high';
  status: 'open' | 'pending' | 'resolved' | 'closed';
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  tags?: string[];
}

export interface ChatState {
  tickets: Ticket[];
  activeTicketId: string | null;
  isTyping: boolean;
  typingUser?: string;
  unreadCount: number;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

export interface ChatNotification {
  id: string;
  ticketId: string;
  type: 'new_message' | 'ticket_updated' | 'ticket_resolved';
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface SupportAgent {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  specialties?: string[];
  responseTime?: string;
}

export interface AutoReplyTemplate {
  trigger: string;
  response: string;
  category?: string;
  delay?: number;
}

export const AUTO_REPLY_TEMPLATES: AutoReplyTemplate[] = [
  {
    trigger: 'paiement',
    response: "Je comprends votre préoccupation concernant le paiement. Je vais vérifier votre compte immédiatement. Pouvez-vous me donner le numéro de la campagne concernée ?",
    category: 'payments',
    delay: 2000
  },
  {
    trigger: 'campagne',
    response: "Je vais examiner votre campagne. Quel est l'ID de la campagne et quel problème rencontrez-vous exactement ?",
    category: 'campaigns',
    delay: 2500
  },
  {
    trigger: 'bug',
    response: "Merci de nous avoir signalé ce problème technique. Pouvez-vous me donner plus de détails sur l'erreur que vous rencontrez ? Une capture d'écran serait très utile.",
    category: 'technical',
    delay: 2000
  },
  {
    trigger: 'compte',
    response: "Je vais vérifier les informations de votre compte. Quel type de modification souhaitez-vous effectuer ?",
    category: 'account',
    delay: 1800
  },
  {
    trigger: 'abonnement',
    response: "Je peux vous aider avec votre abonnement. Souhaitez-vous changer de plan ou avez-vous une question spécifique ?",
    category: 'subscription',
    delay: 2200
  },
  {
    trigger: 'urgent',
    response: "Je comprends l'urgence de votre situation. Je traite votre demande en priorité. Pouvez-vous me donner tous les détails pertinents ?",
    category: 'urgent',
    delay: 1500
  },
  {
    trigger: 'default',
    response: "Merci pour votre message. Je vais examiner votre demande et vous répondre dans les plus brefs délais. N'hésitez pas à ajouter des détails supplémentaires si nécessaire.",
    category: 'general',
    delay: 3000
  }
];

export const SUPPORT_AGENTS: SupportAgent[] = [
  {
    id: 'agent-1',
    name: 'Sophie Martin',
    avatar: '👩‍💼',
    status: 'online',
    specialties: ['Paiements', 'Facturation'],
    responseTime: '< 5 min'
  },
  {
    id: 'agent-2',
    name: 'Thomas Dubois',
    avatar: '👨‍💻',
    status: 'online',
    specialties: ['Technique', 'API'],
    responseTime: '< 10 min'
  },
  {
    id: 'agent-3',
    name: 'Marie Laurent',
    avatar: '👩‍🎓',
    status: 'away',
    specialties: ['Campagnes', 'Stratégie'],
    responseTime: '< 15 min'
  }
];