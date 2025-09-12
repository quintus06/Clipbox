import { Ticket, Message } from '@/types/chat';

export function generateTestTickets(): void {
  const tickets: Ticket[] = [
    {
      id: 'ticket-001',
      userId: 'user-clipper-1',
      userRole: 'clipper',
      userName: 'Jean Dupont',
      userEmail: 'jean.dupont@example.com',
      subject: 'Problème de paiement - Virement non reçu',
      category: 'payments',
      priority: 'high',
      status: 'open',
      messages: [
        {
          id: 'msg-001-1',
          ticketId: 'ticket-001',
          sender: 'user',
          senderName: 'Jean Dupont',
          content: 'Bonjour, j\'ai effectué une campagne il y a 10 jours mais je n\'ai toujours pas reçu mon paiement. Pouvez-vous vérifier ?',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true,
          status: 'sent'
        },
        {
          id: 'msg-001-2',
          ticketId: 'ticket-001',
          sender: 'support',
          senderName: 'Sophie Martin',
          senderAvatar: '👩‍💼',
          content: 'Bonjour Jean, je vais vérifier votre compte immédiatement. Pouvez-vous me donner l\'ID de la campagne concernée ?',
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
          read: false,
          status: 'sent'
        }
      ],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      assignedTo: 'Sophie Martin',
      tags: ['urgent', 'paiement']
    },
    {
      id: 'ticket-002',
      userId: 'user-adv-1',
      userRole: 'advertiser',
      userName: 'Nike France',
      userEmail: 'marketing@nike.fr',
      subject: 'Campagne rejetée sans raison apparente',
      category: 'campaigns',
      priority: 'normal',
      status: 'pending',
      messages: [
        {
          id: 'msg-002-1',
          ticketId: 'ticket-002',
          sender: 'user',
          senderName: 'Nike France',
          content: 'Notre nouvelle campagne a été rejetée mais nous ne comprenons pas pourquoi. Elle respecte toutes les guidelines.',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          read: true,
          status: 'sent'
        },
        {
          id: 'msg-002-2',
          ticketId: 'ticket-002',
          sender: 'support',
          senderName: 'Thomas Dubois',
          senderAvatar: '👨‍💻',
          content: 'Bonjour, je vais examiner votre campagne. Il semble qu\'il y ait un problème avec les dimensions des visuels. Je reviens vers vous rapidement.',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          read: true,
          status: 'sent'
        },
        {
          id: 'msg-002-3',
          ticketId: 'ticket-002',
          sender: 'user',
          senderName: 'Nike France',
          content: 'D\'accord, nous attendons votre retour. C\'est assez urgent car nous avons une deadline.',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          read: true,
          status: 'sent'
        }
      ],
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      assignedTo: 'Thomas Dubois',
      tags: ['campagne', 'modération']
    },
    {
      id: 'ticket-003',
      userId: 'user-clipper-2',
      userRole: 'clipper',
      userName: '@influenceur_mode',
      userEmail: 'contact@influenceur.com',
      subject: 'Vérification KYC bloquée depuis 1 semaine',
      category: 'account',
      priority: 'high',
      status: 'open',
      messages: [
        {
          id: 'msg-003-1',
          ticketId: 'ticket-003',
          sender: 'user',
          senderName: '@influenceur_mode',
          content: 'Ma vérification KYC est bloquée depuis une semaine. J\'ai envoyé tous les documents demandés. C\'est urgent car j\'ai des campagnes en attente.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          read: true,
          status: 'sent'
        }
      ],
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      tags: ['kyc', 'urgent', 'verification']
    },
    {
      id: 'ticket-004',
      userId: 'user-adv-2',
      userRole: 'advertiser',
      userName: 'Adidas Sport',
      userEmail: 'support@adidas.com',
      subject: 'Statistiques incorrectes sur le dashboard',
      category: 'technical',
      priority: 'low',
      status: 'resolved',
      messages: [
        {
          id: 'msg-004-1',
          ticketId: 'ticket-004',
          sender: 'user',
          senderName: 'Adidas Sport',
          content: 'Les statistiques affichées sur notre dashboard ne correspondent pas aux chiffres réels. Il y a un écart de 30%.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          read: true,
          status: 'sent'
        },
        {
          id: 'msg-004-2',
          ticketId: 'ticket-004',
          sender: 'support',
          senderName: 'Marie Laurent',
          senderAvatar: '👩‍🎓',
          content: 'Bonjour, nous avons identifié le problème. Il s\'agissait d\'un bug dans le calcul des impressions. C\'est maintenant corrigé.',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          read: true,
          status: 'sent'
        },
        {
          id: 'msg-004-3',
          ticketId: 'ticket-004',
          sender: 'user',
          senderName: 'Adidas Sport',
          content: 'Parfait, merci pour la résolution rapide !',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          read: true,
          status: 'sent'
        }
      ],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      assignedTo: 'Marie Laurent',
      tags: ['bug', 'stats', 'résolu']
    },
    {
      id: 'ticket-005',
      userId: 'user-clipper-3',
      userRole: 'clipper',
      userName: '@fitness_coach',
      userEmail: 'coach@fitness.com',
      subject: 'Impossible de retirer mes gains',
      category: 'payments',
      priority: 'high',
      status: 'pending',
      messages: [
        {
          id: 'msg-005-1',
          ticketId: 'ticket-005',
          sender: 'user',
          senderName: '@fitness_coach',
          content: 'J\'essaie de retirer mes gains depuis 3 jours mais j\'ai toujours une erreur. Mon solde est de 2500€.',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          read: true,
          status: 'sent'
        },
        {
          id: 'msg-005-2',
          ticketId: 'ticket-005',
          sender: 'support',
          senderName: 'Sophie Martin',
          senderAvatar: '👩‍💼',
          content: 'Bonjour, je vois le problème. Votre compte bancaire n\'est pas correctement vérifié. Je vais vous envoyer un lien pour compléter la vérification.',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          read: true,
          status: 'sent'
        }
      ],
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      assignedTo: 'Sophie Martin',
      tags: ['retrait', 'urgent']
    },
    {
      id: 'ticket-006',
      userId: 'user-adv-3',
      userRole: 'advertiser',
      userName: 'Beauty Brand Co',
      userEmail: 'hello@beautybrand.com',
      subject: 'Demande de fonctionnalité : ciblage par région',
      category: 'feature_request',
      priority: 'low',
      status: 'open',
      messages: [
        {
          id: 'msg-006-1',
          ticketId: 'ticket-006',
          sender: 'user',
          senderName: 'Beauty Brand Co',
          content: 'Serait-il possible d\'ajouter un ciblage par région pour nos campagnes ? Nous aimerions cibler uniquement certaines villes.',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          read: true,
          status: 'sent'
        }
      ],
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      tags: ['feature', 'ciblage']
    },
    {
      id: 'ticket-007',
      userId: 'user-clipper-4',
      userRole: 'clipper',
      userName: '@tech_reviewer',
      userEmail: 'reviewer@tech.com',
      subject: 'Problème avec l\'upload de vidéos',
      category: 'technical',
      priority: 'normal',
      status: 'closed',
      messages: [
        {
          id: 'msg-007-1',
          ticketId: 'ticket-007',
          sender: 'user',
          senderName: '@tech_reviewer',
          content: 'Je ne peux pas uploader de vidéos de plus de 100MB. Y a-t-il une limite ?',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          read: true,
          status: 'sent'
        },
        {
          id: 'msg-007-2',
          ticketId: 'ticket-007',
          sender: 'support',
          senderName: 'Thomas Dubois',
          senderAvatar: '👨‍💻',
          content: 'Oui, la limite actuelle est de 100MB par vidéo. Nous recommandons de compresser vos vidéos avant l\'upload.',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          read: true,
          status: 'sent'
        },
        {
          id: 'msg-007-3',
          ticketId: 'ticket-007',
          sender: 'user',
          senderName: '@tech_reviewer',
          content: 'D\'accord, merci pour l\'information.',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          read: true,
          status: 'sent'
        }
      ],
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      assignedTo: 'Thomas Dubois',
      tags: ['vidéo', 'limite', 'fermé']
    },
    {
      id: 'ticket-008',
      userId: 'user-adv-4',
      userRole: 'advertiser',
      userName: 'Fashion Week Paris',
      userEmail: 'contact@fashionweek.fr',
      subject: 'Augmentation du budget quotidien',
      category: 'billing',
      priority: 'normal',
      status: 'pending',
      messages: [
        {
          id: 'msg-008-1',
          ticketId: 'ticket-008',
          sender: 'user',
          senderName: 'Fashion Week Paris',
          content: 'Nous souhaitons augmenter notre budget quotidien à 10000€. Comment procéder ?',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          read: true,
          status: 'sent'
        },
        {
          id: 'msg-008-2',
          ticketId: 'ticket-008',
          sender: 'support',
          senderName: 'Sophie Martin',
          senderAvatar: '👩‍💼',
          content: 'Pour augmenter votre budget au-delà de 5000€/jour, nous devons vérifier certaines informations. Je vous envoie un formulaire.',
          timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
          read: false,
          status: 'sent'
        }
      ],
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      assignedTo: 'Sophie Martin',
      tags: ['budget', 'facturation']
    }
  ];

  // Sauvegarder dans localStorage
  const existingData = localStorage.getItem('clipbox_chat_data');
  let dataToStore;
  
  if (existingData) {
    const parsed = JSON.parse(existingData);
    // Fusionner avec les tickets existants
    const existingIds = parsed.tickets.map((t: any) => t.id);
    const newTickets = tickets.filter(t => !existingIds.includes(t.id));
    dataToStore = {
      ...parsed,
      tickets: [...parsed.tickets, ...newTickets]
    };
  } else {
    dataToStore = {
      tickets,
      lastUpdated: new Date().toISOString()
    };
  }
  
  localStorage.setItem('clipbox_chat_data', JSON.stringify(dataToStore));
  
  // Générer aussi des données admin
  const adminData: Record<string, any> = {};
  tickets.forEach(ticket => {
    adminData[ticket.id] = {
      assignedTo: ticket.assignedTo,
      internalNotes: [
        'Client important, traiter en priorité',
        'Vérification des documents en cours'
      ].slice(0, Math.floor(Math.random() * 2) + 1),
      tags: ticket.tags,
      satisfaction: Math.floor(Math.random() * 5) + 1
    };
  });
  
  localStorage.setItem('clipbox_admin_chat_data', JSON.stringify(adminData));
  
  console.log('Test tickets generated successfully!');
}

// Fonction pour nettoyer les données de test
export function clearTestTickets(): void {
  localStorage.removeItem('clipbox_chat_data');
  localStorage.removeItem('clipbox_admin_chat_data');
  localStorage.removeItem('clipbox_admin_templates');
  localStorage.removeItem('clipbox_chat_notifications');
  console.log('Test tickets cleared!');
}