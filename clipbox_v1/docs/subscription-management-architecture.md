# Architecture de Gestion des Abonnements ClipBox

## Vue d'ensemble

Ce document définit l'architecture complète de la gestion des abonnements pour la plateforme ClipBox, applicable aux **Annonceurs** et aux **Clippers**. Il établit les règles métier critiques qui régissent les changements d'abonnement.

**Date de création :** 11 octobre 2025  
**Version :** 1.0  
**Statut :** Documentation d'architecture

---

## 📋 Table des matières

1. [Règles Métier Fondamentales](#règles-métier-fondamentales)
2. [Logique de Mise à Niveau (Upgrade)](#logique-de-mise-à-niveau-upgrade)
3. [Logique de Rétrogradation (Downgrade)](#logique-de-rétrogradation-downgrade)
4. [Plans d'Abonnement](#plans-dabonnement)
5. [Exigences Techniques](#exigences-techniques)
6. [Cas Limites et Scénarios Complexes](#cas-limites-et-scénarios-complexes)
7. [Plan d'Implémentation](#plan-dimplémentation)

---

## Règles Métier Fondamentales

### Principe Général

Les changements d'abonnement suivent deux logiques distinctes selon le sens du changement :

- **UPGRADE** (passage à un plan supérieur) : **Effet immédiat**
- **DOWNGRADE** (passage à un plan inférieur) : **Effet différé au prochain cycle**

### Justification

Cette approche garantit :
- ✅ Une expérience utilisateur positive (accès immédiat aux nouvelles fonctionnalités)
- ✅ Une équité financière (pas de remboursement complexe)
- ✅ Une continuité de service (maintien des avantages payés)
- ✅ Une simplicité de gestion (calculs prorata uniquement pour upgrades)

---

## Logique de Mise à Niveau (Upgrade)

### Définition

Un **upgrade** est un changement vers un plan d'abonnement de niveau supérieur ou de prix plus élevé.

### Règles d'Application

#### 1. Paiement Immédiat - Calcul Prorata

**Formule :**
```
Montant à payer = (Prix nouveau plan - Prix ancien plan) × (Jours restants / Jours dans le mois)
```

**Exemple concret :**
- Plan actuel : Starter à 14€/mois
- Nouveau plan : Pro à 27€/mois
- Date de changement : 15 du mois (15 jours restants sur 30)
- **Calcul :** (27€ - 14€) × (15/30) = 13€ × 0.5 = **6.50€ à payer immédiatement**

#### 2. Activation Immédiate

- ✅ Les nouvelles fonctionnalités sont **activées instantanément**
- ✅ Les nouvelles limites s'appliquent **immédiatement**
- ✅ Les nouveaux droits d'accès sont **accordés sans délai**

#### 3. Renouvellement

- Le prochain cycle de facturation facturera le **prix complet du nouveau plan**
- La date de renouvellement reste **inchangée**

#### 4. Notification Utilisateur

L'utilisateur reçoit :
- ✉️ Confirmation de l'upgrade
- 💳 Reçu du paiement prorata
- 🎉 Liste des nouvelles fonctionnalités disponibles
- 📅 Date du prochain renouvellement et montant

### Flux Technique - Upgrade

```
1. Utilisateur sélectionne nouveau plan
2. Système calcule montant prorata
3. Affichage modal de confirmation avec détails
4. Utilisateur confirme
5. Traitement paiement Stripe
   ├─ Succès → Étape 6
   └─ Échec → Afficher erreur et arrêter
6. Mise à jour base de données :
   ├─ Subscription.plan = nouveau_plan
   ├─ Subscription.stripePriceId = nouveau_price_id
   ├─ Subscription.maxCampaigns = nouvelles_limites
   ├─ Subscription.commissionRate = nouveau_taux
   └─ Subscription.updatedAt = maintenant
7. Création Transaction (type: SUBSCRIPTION_PAYMENT)
8. Envoi notification utilisateur
9. Redirection vers dashboard avec message succès
```

---

## Logique de Rétrogradation (Downgrade)

### Définition

Un **downgrade** est un changement vers un plan d'abonnement de niveau inférieur ou de prix moins élevé.

### Règles d'Application

#### 1. Date d'Effet

- ⏰ Le changement prend effet **au début du prochain cycle de facturation**
- 📅 Aucun changement immédiat des fonctionnalités
- 💰 Aucun remboursement pour la période en cours

**Exemple :**
- Date actuelle : 15 janvier
- Date de renouvellement : 1er février
- Downgrade demandé le 15 janvier
- **Effet réel : 1er février à 00h00**

#### 2. Période de Transition

Durant la période entre la demande et l'effet :
- ✅ L'utilisateur **conserve tous les avantages** de son plan actuel
- ✅ Il peut **annuler le downgrade programmé** à tout moment
- ⚠️ Un badge "Changement programmé" est affiché dans l'interface
- 📧 Un rappel est envoyé 3 jours avant l'effet

#### 3. Application des Limitations

Au moment de l'effet (début du nouveau cycle) :

**Pour les Clippers :**
- 🎬 **Campagnes excédentaires** → Mises en pause (par ordre de soumission, les plus récentes d'abord)
- 📱 **Comptes sociaux excédentaires** → Déconnectés automatiquement (par ordre d'ajout, les plus récents d'abord)
- 📹 **Vidéos excédentaires** → Impossibilité de soumettre de nouvelles vidéos au-delà de la limite
- 💰 **Commission** → Ajustée selon le nouveau plan
- ⏱️ **Délais de retrait** → Modifiés selon le nouveau plan

**Pour les Annonceurs :**
- 📊 **Campagnes excédentaires** → Mises en pause (par date de création, les plus récentes d'abord)
- 💵 **Budget mensuel** → Limité selon le nouveau plan
- 📈 **Analytics** → Accès restreint aux fonctionnalités du nouveau plan
- 🎯 **Ciblage avancé** → Désactivé si non inclus dans le nouveau plan

#### 4. Sauvegarde des Données

- 💾 **Toutes les données restent sauvegardées**
- 🔄 En cas de re-upgrade, les données sont **réactivées automatiquement**
- 📦 Les campagnes/comptes en pause peuvent être **réactivés manuellement** après upgrade

#### 5. Notification Utilisateur

L'utilisateur reçoit :
- ✉️ Confirmation de la programmation du downgrade
- ⚠️ Liste détaillée des limitations qui seront appliquées
- 📅 Date exacte de l'effet
- 🔔 Rappel 3 jours avant l'effet
- 📧 Confirmation le jour de l'effet

### Flux Technique - Downgrade

```
1. Utilisateur sélectionne plan inférieur
2. Système détecte downgrade
3. Affichage modal d'avertissement avec :
   ├─ Liste des limitations
   ├─ Date d'effet
   └─ Impact sur les données actuelles
4. Utilisateur confirme
5. Création enregistrement ScheduledSubscriptionChange
6. Envoi notification confirmation
7. Affichage badge "Changement programmé" dans UI
8. Création job planifié pour la date d'effet
```

---

## Plans d'Abonnement

### Plans Clippers

| Plan | Prix Mensuel | Prix Annuel | Campagnes | Comptes/Réseau | Vidéos/Campagne | Commission |
|------|--------------|-------------|-----------|----------------|-----------------|------------|
| **Gratuit** | 0€ | 0€ | 5 | 1 | 4 | 15% |
| **Starter** | 14€ | 140€ (-17%) | 10 | 2 | 6 | 15% |
| **Pro** | 27€ | 270€ (-17%) | Illimité | 4 | 10 | 10% |
| **Goat** | 49€ | 490€ (-17%) | Illimité | Illimité | Illimité | 5% |

**Hiérarchie :** Gratuit < Starter < Pro < Goat

### Plans Annonceurs

| Plan | Prix Mensuel | Prix Annuel | Campagnes | Budget Mensuel | Support |
|------|--------------|-------------|-----------|----------------|---------|
| **Gratuit** | 0€ | 0€ | 5 | 10k€ | Email |
| **Starter** | 29€ | 278€ (-20%) | 10 | 20k€ | Prioritaire |
| **Growth** | 55€ | 528€ (-20%) | Illimité | Illimité | Prioritaire |
| **Business** | 97€ | 931€ (-20%) | Illimité | Illimité | Dédié 24/7 |

**Hiérarchie :** Gratuit < Starter < Growth < Business

---

## Exigences Techniques

### 1. Schéma de Base de Données

#### Nouveau modèle : ScheduledSubscriptionChange

```prisma
model ScheduledSubscriptionChange {
  id              String             @id @default(cuid())
  subscriptionId  String
  currentPlan     SubscriptionPlan
  scheduledPlan   SubscriptionPlan
  effectiveDate   DateTime
  status          ScheduledChangeStatus @default(PENDING)
  reason          String?            @db.Text
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt
  completedAt     DateTime?
  cancelledAt     DateTime?
  
  subscription    Subscription       @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)
  
  @@index([subscriptionId])
  @@index([effectiveDate])
  @@index([status])
}

enum ScheduledChangeStatus {
  PENDING
  COMPLETED
  CANCELLED
  FAILED
}
```

#### Modification du modèle Subscription

```prisma
model Subscription {
  // ... champs existants ...
  
  // Nouvelle relation
  scheduledChanges  ScheduledSubscriptionChange[]
}
```

### 2. API Endpoints

#### POST `/api/subscription/upgrade`

**Request:**
```typescript
{
  newPlan: 'PRO' | 'GOAT' | 'STARTER' | 'GROWTH' | 'BUSINESS',
  billingCycle: 'monthly' | 'yearly',
  paymentMethodId?: string
}
```

**Response:**
```typescript
{
  success: boolean,
  subscription: Subscription,
  transaction: Transaction,
  prorataAmount: number,
  message: string
}
```

#### POST `/api/subscription/downgrade`

**Request:**
```typescript
{
  newPlan: 'FREE' | 'STARTER' | 'PRO',
  reason?: string
}
```

**Response:**
```typescript
{
  success: boolean,
  scheduledChange: ScheduledSubscriptionChange,
  effectiveDate: string,
  limitations: {
    campaignsToPause: number,
    accountsToDisconnect: number
  },
  message: string
}
```

#### DELETE `/api/subscription/scheduled-change/:id`

Annule un downgrade programmé.

#### GET `/api/subscription/preview-change`

Prévisualise les changements avant confirmation.

### 3. Jobs Planifiés

#### Job : `apply-scheduled-subscription-changes`

**Fréquence :** Toutes les heures

**Fonction :**
- Récupère tous les changements programmés dont la date est passée
- Applique les limitations selon le type d'utilisateur
- Met à jour l'abonnement
- Envoie les notifications

#### Job : `send-downgrade-reminders`

**Fréquence :** Une fois par jour à 10h

**Fonction :**
- Envoie des rappels 3 jours avant l'effet d'un downgrade

### 4. Interface Utilisateur

#### Composants Clés

1. **SubscriptionChangeModal** - Modal de confirmation pour upgrades
2. **DowngradeWarningModal** - Modal d'avertissement pour downgrades
3. **ScheduledChangeBadge** - Badge affichant le changement programmé
4. **CampaignSelector** - Sélection des campagnes à conserver (downgrade)
5. **SocialAccountSelector** - Sélection des comptes sociaux à conserver (downgrade)

---

## Cas Limites et Scénarios Complexes

### Scénario 1 : Upgrade puis Downgrade avant le prochain cycle

**Situation :**
1. Utilisateur sur plan Starter (14€/mois)
2. Upgrade vers Pro (27€/mois) le 10 du mois
3. Downgrade vers Starter le 20 du mois
4. Prochain renouvellement : 1er du mois suivant

**Résolution :**
- L'upgrade du 10 est appliqué immédiatement (paiement prorata)
- Le downgrade du 20 est programmé pour le 1er du mois suivant
- L'utilisateur profite du plan Pro jusqu'au 1er du mois suivant
- Au 1er du mois suivant, retour au plan Starter
- **Aucun remboursement** pour la période Pro (règle métier)

### Scénario 2 : Downgrade puis Upgrade avant la date d'effet

**Situation :**
1. Utilisateur sur plan Pro (27€/mois)
2. Downgrade vers Starter programmé pour le 1er février
3. Le 25 janvier, upgrade vers Goat (49€/mois)

**Résolution :**
- L'upgrade **annule automatiquement** le downgrade programmé
- Suppression du [`ScheduledSubscriptionChange`](clipbox_v1/docs/subscription-management-architecture.md:1:1)
- Application immédiate de l'upgrade vers Goat
- Paiement prorata : (49€ - 27€) × (jours restants / jours total)
- Notification : "Votre changement programmé a été annulé suite à votre upgrade"

### Scénario 3 : Échec de paiement lors du renouvellement avec downgrade programmé

**Situation :**
1. Utilisateur sur plan Pro avec downgrade vers Starter programmé
2. Date de renouvellement arrive
3. Le paiement échoue

**Résolution :**
- Le downgrade programmé est **maintenu** (pas annulé)
- L'abonnement passe en statut `PAST_DUE`
- Période de grâce de 7 jours pour régulariser
- Si régularisé : application du downgrade comme prévu
- Si non régularisé après 7 jours : passage au plan gratuit

### Scénario 4 : Annulation complète de l'abonnement

**Différence avec Downgrade :**
- **Downgrade** : changement vers un plan payant inférieur
- **Annulation** : passage au plan gratuit à la fin de période

**Résolution :**
- Marquer `cancelAtPeriodEnd = true`
- L'utilisateur garde son plan actuel jusqu'à la fin de la période
- À la fin de la période : passage automatique au plan gratuit
- Possibilité de réactiver avant la fin de période

### Scénario 5 : Changement de cycle de facturation (mensuel ↔ annuel)

**Situation :**
1. Utilisateur sur plan Pro mensuel (27€/mois)
2. Veut passer au plan Pro annuel (270€/an)

**Résolution :**
- Considéré comme un "upgrade" (économie de 20%)
- Calcul du crédit restant sur le cycle mensuel
- Paiement du montant annuel moins le crédit
- Application immédiate du cycle annuel

**Calcul :**
```
Crédit restant = Prix mensuel × (Jours restants / Jours total)
Montant à payer = Prix annuel - Crédit restant
```

### Scénario 6 : Utilisateur atteint les limites avant un downgrade programmé

**Situation :**
1. Utilisateur sur plan Pro (campagnes illimitées)
2. Downgrade vers Starter (10 campagnes max) programmé pour le 1er février
3. Le 25 janvier, l'utilisateur a 15 campagnes actives

**Résolution :**
- **Avant la date d'effet** : Aucune restriction
- **Avertissement proactif** : "Attention, vous avez 15 campagnes actives. Au 1er février, 5 seront mises en pause."
- **À la date d'effet** : Les 5 campagnes les plus récentes sont mises en pause automatiquement
- **Notification** : Liste des campagnes mises en pause avec possibilité de choisir lesquelles garder actives

### Scénario 7 : Downgrade avec données excédentaires (Clippers)

**Situation :**
1. Clipper sur plan Goat (comptes illimités)
2. A connecté 10 comptes TikTok
3. Downgrade vers Pro (4 comptes max par réseau)

**Résolution :**
- **Avant la date d'effet** : Tous les comptes restent connectés
- **Notification préventive** : "6 de vos comptes TikTok seront déconnectés. Choisissez lesquels garder."
- **Interface de sélection** : L'utilisateur peut choisir les 4 comptes à conserver
- **Si pas de choix** : Déconnexion automatique des 6 comptes les plus récents
- **Sauvegarde** : Les comptes déconnectés restent en base de données (status: INACTIVE)
- **Réactivation** : En cas de re-upgrade, possibilité de reconnecter facilement

---

## Plan d'Implémentation

### Phase 1 : Fondations (Semaine 1-2)

**Backend :**
- [ ] Créer modèle `ScheduledSubscriptionChange` dans Prisma
- [ ] Créer migrations de base de données
- [ ] Implémenter fonctions de calcul prorata
- [ ] Implémenter fonctions de détection upgrade/downgrade

**API :**
- [ ] Créer endpoint `POST /api/subscription/upgrade`
- [ ] Créer endpoint `POST /api/subscription/downgrade`
- [ ] Créer endpoint `GET /api/subscription/preview-change`
- [ ] Créer endpoint `DELETE /api/subscription/scheduled-change/:id`
- [ ] Intégrer Stripe pour paiements prorata

### Phase 2 : Logique Métier (Semaine 3-4)

**Backend :**
- [ ] Implémenter logique d'application des limitations (clippers)
- [ ] Implémenter logique d'application des limitations (annonceurs)
- [ ] Créer système de jobs planifiés
- [ ] Implémenter job `apply-scheduled-subscription-changes`
- [ ] Implémenter job `send-downgrade-reminders`

**Cas Limites :**
- [ ] Gérer annulation de downgrade programmé lors d'upgrade
- [ ] Gérer échecs de paiement avec downgrade programmé
- [ ] Gérer sélection manuelle des données à conserver

### Phase 3 : Interface Utilisateur (Semaine 5-6)

**Composants React :**
- [ ] Créer `SubscriptionChangeModal` (upgrade)
- [ ] Créer `DowngradeWarningModal`
- [ ] Créer `ScheduledChangeBadge`
- [ ] Créer `CampaignSelector` (pour downgrade)
- [ ] Créer `SocialAccountSelector` (pour downgrade)
- [ ] Mettre à jour pages subscription (clipper & advertiser)

### Phase 4 : Notifications (Semaine 7)

**Système de Notifications :**
- [ ] Templates email confirmation upgrade
- [ ] Templates email confirmation downgrade programmé
- [ ] Templates email rappel downgrade (3 jours avant)
- [ ] Templates email confirmation effet downgrade
- [ ] Templates email annulation changement programmé
- [ ] Notifications in-app

### Phase 5 : Tests et Déploiement (Semaine 8-9)

**Tests :**
- [ ] Tests unitaires calculs prorata
- [ ] Tests API endpoints
- [ ] Tests intégration Stripe
- [ ] Tests scénarios complexes
- [ ] Tests E2E flux complets

**Déploiement :**
- [ ] Déploiement staging
- [ ] Tests en staging
- [ ] Migration données production
- [ ] Déploiement production
- [ ] Monitoring post-déploiement

---

## Métriques de Succès

### KPIs à Suivre

1. **Taux de Conversion Upgrade**
   - Objectif : > 15% des utilisateurs gratuits upgradent dans les 30 jours

2. **Taux de Rétention Post-Upgrade**
   - Objectif : > 85% restent sur le plan upgradé après 3 mois

3. **Taux de Downgrade**
   - Objectif : < 5% des utilisateurs payants downgrade par mois

4. **Taux d'Annulation de Downgrade Programmé**
   - Objectif : > 20% annulent leur downgrade avant l'effet

5. **Valeur Vie Client (LTV)**
   - Objectif : Augmentation de 30% avec le nouveau système

---

## Sécurité et Conformité

### Sécurité

1. **Paiements**
   - Utilisation de Stripe pour tous les paiements
   - Pas de stockage de données de carte bancaire
   - Conformité PCI-DSS via Stripe

2. **Données Personnelles**
   - Chiffrement des données sensibles en base
   - Logs d'audit pour tous les changements d'abonnement
   - Accès restreint aux données financières

3. **API**
   - Authentification JWT pour tous les endpoints
   - Rate limiting pour prévenir les abus
   - Validation stricte des inputs

### Conformité RGPD

1. **Transparence** - Informations claires sur les changements
2. **Consentement** - Confirmation explicite pour tous les changements
3. **Droit à l'Oubli** - Suppression des données après annulation définitive

---

## Conclusion

Cette architecture de gestion des abonnements offre :

✅ **Simplicité** : Règles claires et prévisibles  
✅ **Équité** : Pas de perte pour l'utilisateur  
✅ **Flexibilité** : Changements faciles et réversibles  
✅ **Transparence** : Communication claire à chaque étape  
✅ **Sécurité** : Gestion robuste des paiements et données

### Prochaines Étapes

1. **Validation** : Revue de cette architecture avec l'équipe
2. **Priorisation** : Définir les fonctionnalités MVP vs Nice-to-have
3. **Planning** : Affiner le planning d'implémentation
4. **Démarrage** : Lancer la Phase 1 du développement

---

## Règle d'Accès aux Campagnes Premium

### Vue d'ensemble

Cette section définit la règle métier critique qui régit l'accès des clippers aux campagnes premium basée sur leur niveau d'abonnement et le CPM (coût pour 1000 vues) des campagnes.

**Date d'ajout :** 11 octobre 2025
**Priorité :** Haute - Règle de monétisation critique

---

### Définition de la Règle

#### Critère de Classification Premium

Une campagne est classée comme **"Campagne Premium"** si et seulement si :

```
remunerationPer1000Views > 2€
```

**Où :**
- `remunerationPer1000Views` : Rémunération versée au clipper pour 1000 vues générées
- Seuil premium : **2€ par 1000 vues**

#### Règle d'Accès

| Type de Campagne | Plans avec Accès | Plans sans Accès |
|------------------|------------------|------------------|
| **Standard** (CPM ≤ 2€) | Tous les plans (Gratuit, Starter, Pro, Goat) | Aucun |
| **Premium** (CPM > 2€) | Pro, Goat uniquement | Gratuit, Starter |

**Résumé :**
- ✅ **Plans Pro et Goat** : Accès complet à toutes les campagnes (standard + premium)
- ⚠️ **Plans Gratuit et Starter** : Accès uniquement aux campagnes standard (CPM ≤ 2€)

---

### Justification Métier

#### Objectifs Stratégiques

1. **Monétisation Progressive**
   - Inciter les clippers performants à upgrader vers Pro/Goat
   - Créer une valeur perçue claire pour les plans premium
   - Augmenter le taux de conversion vers les plans payants supérieurs

2. **Qualité et Professionnalisme**
   - Les campagnes premium nécessitent des créateurs expérimentés
   - Garantir un niveau de qualité élevé pour les annonceurs premium
   - Protéger la réputation de la plateforme

3. **Équilibre Économique**
   - Les campagnes à fort CPM génèrent plus de revenus
   - Réserver ces opportunités aux clippers investis dans la plateforme
   - Créer un écosystème durable et équitable

#### Avantages pour les Parties Prenantes

**Pour les Clippers Pro/Goat :**
- 💰 Accès exclusif aux campagnes les mieux rémunérées
- 🎯 Moins de concurrence sur les campagnes premium
- 📈 Potentiel de revenus significativement plus élevé
- ⭐ Reconnaissance de leur statut professionnel

**Pour les Annonceurs :**
- ✨ Accès à des créateurs plus expérimentés pour leurs campagnes premium
- 📊 Meilleure qualité de contenu attendue
- 🎬 Créateurs plus engagés et professionnels
- 💼 ROI potentiellement supérieur

**Pour la Plateforme :**
- 💵 Augmentation des revenus d'abonnement
- 📈 Meilleur taux de rétention des clippers premium
- 🏆 Positionnement premium sur le marché
- ⚖️ Équilibre offre/demande optimisé

---

### Implémentation Technique

#### 1. Modifications du Schéma de Base de Données

**Aucune modification requise** - Le champ `remunerationPer1000Views` existe déjà dans le modèle Campaign (utilisé en frontend).

**Action requise :** Ajouter ce champ au schéma Prisma s'il n'existe pas encore en base de données.

```prisma
model Campaign {
  // ... champs existants ...
  
  // Rémunération pour les clippers
  remunerationPer1000Views Decimal  @db.Decimal(10, 2)  // Nouveau champ si absent
  
  // Champ calculé virtuel (optionnel, pour performance)
  isPremium         Boolean  @default(false)  // Calculé : remunerationPer1000Views > 2
  
  // ... autres champs ...
}
```

**Migration suggérée :**
```sql
-- Ajouter le champ remunerationPer1000Views si absent
ALTER TABLE "Campaign"
  ADD COLUMN IF NOT EXISTS "remunerationPer1000Views" DECIMAL(10, 2) DEFAULT 0;

-- Ajouter un champ calculé pour optimisation (optionnel)
ALTER TABLE "Campaign"
  ADD COLUMN IF NOT EXISTS "isPremium" BOOLEAN
  GENERATED ALWAYS AS ("remunerationPer1000Views" > 2) STORED;

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_campaign_premium
  ON "Campaign" ("isPremium", "status", "startDate");
```

#### 2. Logique Métier - Fonction de Vérification

```typescript
// lib/campaign-access.ts

import { SubscriptionPlan } from '@prisma/client';

/**
 * Détermine si une campagne est premium
 */
export function isCampaignPremium(remunerationPer1000Views: number): boolean {
  const PREMIUM_THRESHOLD = 2.0; // 2€ par 1000 vues
  return remunerationPer1000Views > PREMIUM_THRESHOLD;
}

/**
 * Vérifie si un clipper peut accéder à une campagne
 */
export function canAccessCampaign(
  clipperPlan: SubscriptionPlan,
  campaignCPM: number
): boolean {
  const isPremium = isCampaignPremium(campaignCPM);
  
  // Campagnes standard : accessibles à tous
  if (!isPremium) {
    return true;
  }
  
  // Campagnes premium : uniquement Pro et Goat
  const premiumPlans: SubscriptionPlan[] = ['PRO', 'GOAT'];
  return premiumPlans.includes(clipperPlan);
}

/**
 * Obtient le message d'erreur approprié
 */
export function getAccessDeniedMessage(
  clipperPlan: SubscriptionPlan,
  campaignCPM: number
): string {
  if (!isCampaignPremium(campaignCPM)) {
    return "Vous avez accès à cette campagne.";
  }
  
  return `Cette campagne premium (${campaignCPM}€/1000 vues) est réservée aux abonnés Pro et Goat. Upgradez votre plan pour y accéder.`;
}

/**
 * Filtre les campagnes accessibles pour un clipper
 */
export function filterAccessibleCampaigns<T extends { remunerationPer1000Views: number }>(
  campaigns: T[],
  clipperPlan: SubscriptionPlan
): T[] {
  return campaigns.filter(campaign =>
    canAccessCampaign(clipperPlan, campaign.remunerationPer1000Views)
  );
}
```

#### 3. Modifications des API Endpoints

##### GET `/api/campaigns/public` - Liste des campagnes

**Modification requise :** Filtrer les campagnes selon le plan de l'utilisateur

```typescript
// src/app/api/campaigns/public/route.ts

import { canAccessCampaign, isCampaignPremium } from '@/lib/campaign-access';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Récupérer le plan de l'utilisateur
  const userPlan = session?.user?.subscription?.plan || 'BASIC';
  
  // Récupérer toutes les campagnes actives
  const campaigns = await prisma.campaign.findMany({
    where: { status: 'ACTIVE' },
    include: { advertiser: true }
  });
  
  // Enrichir avec les informations d'accès
  const enrichedCampaigns = campaigns.map(campaign => ({
    ...campaign,
    isPremium: isCampaignPremium(campaign.remunerationPer1000Views),
    isAccessible: canAccessCampaign(userPlan, campaign.remunerationPer1000Views),
    requiresUpgrade: !canAccessCampaign(userPlan, campaign.remunerationPer1000Views)
  }));
  
  return NextResponse.json(enrichedCampaigns);
}
```

##### GET `/api/campaigns/[id]` - Détails d'une campagne

**Modification requise :** Vérifier l'accès avant de retourner les détails

```typescript
// src/app/api/campaigns/[id]/route.ts

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userPlan = session?.user?.subscription?.plan || 'BASIC';
  
  const campaign = await prisma.campaign.findUnique({
    where: { id: params.id },
    include: { advertiser: true }
  });
  
  if (!campaign) {
    return NextResponse.json({ error: 'Campagne non trouvée' }, { status: 404 });
  }
  
  // Vérifier l'accès
  const hasAccess = canAccessCampaign(userPlan, campaign.remunerationPer1000Views);
  
  if (!hasAccess) {
    return NextResponse.json({
      error: 'Accès refusé',
      message: getAccessDeniedMessage(userPlan, campaign.remunerationPer1000Views),
      requiresUpgrade: true,
      requiredPlans: ['PRO', 'GOAT']
    }, { status: 403 });
  }
  
  return NextResponse.json({
    ...campaign,
    isPremium: isCampaignPremium(campaign.remunerationPer1000Views),
    isAccessible: true
  });
}
```

##### POST `/api/campaigns/[id]/join` - Rejoindre une campagne

**Modification requise :** Bloquer l'inscription si pas d'accès

```typescript
// src/app/api/campaigns/[id]/join/route.ts

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }
  
  const userPlan = session.user.subscription?.plan || 'BASIC';
  
  const campaign = await prisma.campaign.findUnique({
    where: { id: params.id }
  });
  
  if (!campaign) {
    return NextResponse.json({ error: 'Campagne non trouvée' }, { status: 404 });
  }
  
  // Vérification d'accès CRITIQUE
  const hasAccess = canAccessCampaign(userPlan, campaign.remunerationPer1000Views);
  
  if (!hasAccess) {
    return NextResponse.json({
      error: 'Accès refusé',
      message: 'Cette campagne premium nécessite un abonnement Pro ou Goat.',
      requiresUpgrade: true,
      requiredPlans: ['PRO', 'GOAT'],
      currentPlan: userPlan
    }, { status: 403 });
  }
  
  // Logique d'inscription à la campagne...
  // ...
}
```

#### 4. Modifications de l'Interface Utilisateur

##### Composant CampaignCard - Badge Premium

```typescript
// components/campaign-card.tsx

import { Lock, Crown } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
  userPlan: SubscriptionPlan;
}

export function CampaignCard({ campaign, userPlan }: CampaignCardProps) {
  const isPremium = campaign.remunerationPer1000Views > 2;
  const hasAccess = canAccessCampaign(userPlan, campaign.remunerationPer1000Views);
  
  return (
    <div className={`campaign-card ${!hasAccess ? 'opacity-75' : ''}`}>
      {/* Badge Premium */}
      {isPremium && (
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-semibold shadow-lg">
          <Crown className="w-4 h-4" />
          <span>Premium</span>
        </div>
      )}
      
      {/* Indicateur de verrouillage */}
      {isPremium && !hasAccess && (
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm">
            <Lock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Campagne Premium
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Cette campagne à {campaign.remunerationPer1000Views}€/1000 vues est réservée aux abonnés Pro et Goat.
            </p>
            <Link
              href="/dashboard/clipper/subscription"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <Crown className="w-4 h-4" />
              Upgrader mon plan
            </Link>
          </div>
        </div>
      )}
      
      {/* Contenu de la carte */}
      <div className="p-6">
        <h3 className="text-xl font-bold">{campaign.title}</h3>
        
        {/* Badge CPM avec couleur conditionnelle */}
        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
          isPremium
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        }`}>
          💰 {campaign.remunerationPer1000Views}€ / 1000 vues
          {isPremium && <Crown className="w-3 h-3" />}
        </div>
        
        {/* Reste du contenu... */}
      </div>
    </div>
  );
}
```

##### Page Liste des Campagnes - Filtres et Sections

```typescript
// src/app/dashboard/clipper/campaigns/page.tsx

export default function CampaignsPage() {
  const { data: session } = useSession();
  const userPlan = session?.user?.subscription?.plan || 'BASIC';
  
  // Séparer les campagnes par type
  const premiumCampaigns = campaigns.filter(c => c.remunerationPer1000Views > 2);
  const standardCampaigns = campaigns.filter(c => c.remunerationPer1000Views <= 2);
  
  const accessiblePremium = premiumCampaigns.filter(c =>
    canAccessCampaign(userPlan, c.remunerationPer1000Views)
  );
  const lockedPremium = premiumCampaigns.filter(c =>
    !canAccessCampaign(userPlan, c.remunerationPer1000Views)
  );
  
  return (
    <div className="space-y-8">
      {/* Bannière d'upgrade si plan Gratuit/Starter */}
      {(userPlan === 'BASIC' || userPlan === 'STARTER') && lockedPremium.length > 0 && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">
                🔓 Débloquez {lockedPremium.length} campagnes premium
              </h3>
              <p className="text-purple-100">
                Passez à Pro ou Goat pour accéder aux campagnes les mieux rémunérées (> 2€/1000 vues)
              </p>
            </div>
            <Link
              href="/dashboard/clipper/subscription"
              className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:shadow-lg transition-all whitespace-nowrap"
            >
              Voir les plans
            </Link>
          </div>
        </div>
      )}
      
      {/* Section Campagnes Premium Accessibles */}
      {accessiblePremium.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">Campagnes Premium</h2>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              {accessiblePremium.length}
            </span>
          </div>
          <div className="grid gap-4">
            {accessiblePremium.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} userPlan={userPlan} />
            ))}
          </div>
        </section>
      )}
      
      {/* Section Campagnes Premium Verrouillées */}
      {lockedPremium.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-600">Campagnes Premium Verrouillées</h2>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
              {lockedPremium.length}
            </span>
          </div>
          <div className="grid gap-4">
            {lockedPremium.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} userPlan={userPlan} />
            ))}
          </div>
        </section>
      )}
      
      {/* Section Campagnes Standard */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Campagnes Standard</h2>
        <div className="grid gap-4">
          {standardCampaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} userPlan={userPlan} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

##### Modal d'Upgrade

```typescript
// components/upgrade-modal.tsx

export function UpgradeModal({
  isOpen,
  onClose,
  campaignCPM
}: UpgradeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Crown className="w-6 h-6 text-yellow-500" />
            Accédez aux Campagnes Premium
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Cette campagne offre <strong>{campaignCPM}€ par 1000 vues</strong> et nécessite un abonnement Pro ou Goat.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Plan Pro */}
            <div className="border-2 border-purple-500 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-8 h-8 text-purple-500" />
                <h3 className="text-xl font-bold">Plan Pro</h3>
              </div>
              <p className="text-3xl font-bold mb-4">27€<span className="text-sm text-gray-500">/mois</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  Accès campagnes premium
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  Commission réduite (10%)
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  Campagnes illimitées
                </li>
              </ul>
              <Link
                href="/dashboard/clipper/subscription?plan=pro"
                className="block w-full text-center px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Choisir Pro
              </Link>
            </div>
            
            {/* Plan Goat */}
            <div className="border-2 border-yellow-500 rounded-xl p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-8 h-8 text-yellow-500" />
                <h3 className="text-xl font-bold">Plan Goat</h3>
                <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">Recommandé</span>
              </div>
              <p className="text-3xl font-bold mb-4">49€<span className="text-sm text-gray-500">/mois</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  Tout de Pro +
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  Commission minimale (5%)
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  Accès VIP prioritaire
                </li>
              </ul>
              <Link
                href="/dashboard/clipper/subscription?plan=goat"
                className="block w-full text-center px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Choisir Goat
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

### Cas Limites et Scénarios

#### Scénario 1 : Downgrade avec Campagnes Premium Actives

**Situation :**
- Clipper sur plan Pro avec 3 campagnes premium actives (CPM > 2€)
- Demande un downgrade vers Starter
- Date d'effet : dans 15 jours

**Résolution :**
1. **Avant la date d'effet :**
   - Le clipper conserve l'accès à ses campagnes premium actives
   - Peut continuer à soumettre des vidéos
   - Reçoit un avertissement : "Attention : vous perdrez l'accès aux campagnes premium le [date]"

2. **À la date d'effet du downgrade :**
   - Les soumissions en cours restent valides
   - Les paiements en attente sont honorés
   - **Impossibilité de rejoindre de nouvelles campagnes premium**
   - **Impossibilité de soumettre de nouvelles vidéos** aux campagnes premium existantes
   - Les campagnes premium disparaissent de la liste des campagnes disponibles

3. **Notification envoyée :**
   ```
   Titre: Changement de plan effectué
   Message: Votre plan est maintenant Starter. Vous n'avez plus accès aux campagnes premium (CPM > 2€).
   Vos soumissions en cours restent valides. Upgradez vers Pro ou Goat pour retrouver l'accès.
   ```

#### Scénario 2 : Upgrade Immédiat

**Situation :**
- Clipper sur plan Gratuit
- Voit une campagne premium à 3€/1000 vues
- Décide d'upgrader vers Pro

**Résolution :**
1. Clipper clique sur "Upgrader" depuis la campagne verrouillée
2. Redirection vers page d'abonnement avec paramètre `?from=campaign&id=xxx`
3. Après paiement réussi :
   - Accès immédiat aux campagnes premium
   - Redirection automatique vers la campagne d'origine
   - Message de succès : "Félicitations ! Vous pouvez maintenant rejoindre cette campagne premium."

#### Scénario 3 : Campagne Devient Premium en Cours

**Situation :**
- Campagne initialement à 1.5€/1000 vues (standard)
- Clipper Starter l'a rejointe
- Annonceur augmente à 2.5€/1000 vues (devient premium)

**Résolution :**
- **Les clippers déjà inscrits conservent leur accès** (principe de non-rétroactivité)
- Les nouveaux clippers Gratuit/Starter ne peuvent plus rejoindre
- Notification aux clippers existants : "Bonne nouvelle ! Cette campagne est maintenant premium (2.5€/1000 vues)"

#### Scénario 4 : Expiration d'Abonnement

**Situation :**
- Clipper Pro avec abonnement expiré
- A des campagnes premium actives
- Paiement échoue au renouvellement

**Résolution :**
1. **Période de grâce (7 jours) :**
   - Accès maintenu aux campagnes premium
   - Bannière d'avertissement : "Votre abonnement expire bientôt. Mettez à jour votre moyen de paiement."

2. **Après 7 jours sans paiement :**
   - Passage automatique au plan Gratuit
   - Perte d'accès aux campagnes premium (même logique que downgrade)
   - Email de notification avec lien de réactivation

#### Scénario 5 : Tentative de Contournement API

**Situation :**
- Clipper Gratuit tente d'appeler directement l'API pour rejoindre une campagne premium

**Résolution :**
```typescript
// Validation côté serveur OBLIGATOIRE
if (!canAccessCampaign(userPlan, campaign.remunerationPer1000Views)) {
  // Log de sécurité
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'UNAUTHORIZED_CAMPAIGN_ACCESS_ATTEMPT',
      entity: 'Campaign',
      entityId: campaign.id,
      metadata: {
        userPlan,
        campaignCPM: campaign.remunerationPer1000Views,
        timestamp: new Date()
      }
    }
  });
  
  return NextResponse.json({
    error: 'Accès refusé',
    code: 'PREMIUM_ACCESS_REQUIRED'
  }, { status: 403 });
}
```

#### Scénario 6 : Campagne à Exactement 2€

**Situation :**
- Campagne avec `remunerationPer1000Views = 2.00€` (seuil exact)

**Résolution :**
- **Considérée comme STANDARD** (règle : `> 2€` pour être premium)
- Accessible à tous les plans
- Clarification dans la documentation : "Le seuil de 2€ est EXCLUSIF (> 2€, pas ≥ 2€)"

---

### Expérience Utilisateur

#### Affichage des Campagnes Premium

**Option Recommandée : Affichage avec Verrouillage**

**Avantages :**
- ✅ Crée de la visibilité sur les opportunités premium
- ✅ Incite naturellement à l'upgrade
- ✅ Transparence totale sur ce qui est disponible
- ✅ Permet aux utilisateurs de voir la valeur des plans supérieurs

**Implémentation :**
- Afficher toutes les campagnes (standard + premium)
- Appliquer un effet visuel de verrouillage sur les campagnes premium inaccessibles
- Badge "Premium" bien visible avec icône couronne
- Bouton "Upgrader pour accéder" au lieu de "Rejoindre"

#### Messages et Communication

**Message de Verrouillage (Court) :**
```
🔒 Campagne Premium
Réservée aux plans Pro et Goat
```

**Message de Verrouillage (Détaillé) :**
```
Cette campagne premium offre 3€ par 1000 vues et nécessite un abonnement Pro ou Goat.

Avec un plan premium, vous débloquez :
✨ Accès aux campagnes les mieux rémunérées
💰 Commission réduite sur tous vos gains
🎯 Priorité sur les nouvelles campagnes
📈 Analytics avancés

[Voir les plans] [Plus tard]
```

**Message après Upgrade :**
```
🎉 Félicitations !
Vous avez maintenant accès à toutes les campagnes premium.
Découvrez les opportunités les mieux rémunérées !

[Voir les campagnes premium]
```

#### Filtres et Navigation

**Filtre "Type de Campagne" :**
- ⭐ Toutes les campagnes
- 💎 Premium uniquement (CPM > 2€)
- 📊 Standard uniquement (CPM ≤ 2€)
- 🔓 Accessibles pour moi

**Tri par CPM :**
- CPM croissant
- CPM décroissant (mettre en avant les premium)

---

### Métriques et Suivi

#### KPIs à Monitorer

1. **Taux de Conversion Premium**
   ```
   Métrique : % de clippers Gratuit/Starter qui upgradent après avoir vu une campagne premium
   Objectif : > 8% dans les 30 jours
   ```

2. **Engagement avec Campagnes Premium**
   ```
   Métrique : Nombre de clics sur campagnes premium verrouillées
   Utilité : Mesurer l'intérêt et optimiser le messaging
   ```

3. **Taux de Rétention Post-Upgrade**
   ```
   Métrique : % de clippers qui restent Pro/Goat après 3 mois
   Objectif : > 80%
   ```

4. **Revenus Campagnes Premium**
   ```
   Métrique : Revenus générés par les campagnes premium vs standard
   Objectif : 60% des revenus totaux via campagnes premium
   ```

#### Événements Analytics à Tracker

```typescript
// Événements à implémenter

// Vue d'une campagne premium verrouillée
analytics.track('premium_campaign_viewed', {
  campaignId: string,
  campaignCPM: number,
  userPlan: string,
  timestamp: Date
});

// Clic sur "Upgrader"
analytics.track('upgrade_cta_clicked', {
  source: 'premium_campaign_lock',
  campaignId: string,
  campaignCPM: number,
  currentPlan: string
});

// Upgrade réussi depuis campagne premium
analytics.track('upgrade_completed', {
  source: 'premium_campaign',
  fromPlan: string,
  toPlan: string,
  triggerCampaignId: string
});

// Tentative d'accès refusée
analytics.track('premium_access_denied', {
  campaignId: string,
  userPlan: string,
  attemptType: 'view' | 'join' | 'submit'
});
```

---

### Tests et Validation

#### Tests Unitaires

```typescript
// __tests__/campaign-access.test.ts

describe('Campaign Access Rules', () => {
  describe('isCampaignPremium', () => {
    it('should return false for CPM <= 2€', () => {
      expect(isCampaignPremium(1.5)).toBe(false);
      expect(isCampaignPremium(2.0)).toBe(false);
    });
    
    it('should return true for CPM > 2€', () => {
      expect(isCampaignPremium(2.01)).toBe(true);
      expect(isCampaignPremium(5.0)).toBe(true);
    });
  });
  
  describe('canAccessCampaign', () => {
    it('should allow all plans to access standard campaigns', () => {
      expect(canAccessCampaign('BASIC', 1.5)).toBe(true);
      expect(canAccessCampaign('STARTER', 2.0)).toBe(true);
      expect(canAccessCampaign('PRO', 1.0)).toBe(true);
      expect(canAccessCampaign('GOAT', 1.5)).toBe(true);
    });
    
    it('should only allow Pro and Goat to access premium campaigns', () => {
      expect(canAccessCampaign('BASIC', 2.5)).toBe(false);
      expect(canAccessCampaign('STARTER', 3.0)).toBe(false);
      expect(canAccessCampaign('PRO', 2.5)).toBe(true);
      expect(canAccessCampaign('GOAT', 5.0)).toBe(true);
    });
  });
});
```

#### Tests d'Intégration

```typescript
// __tests__/api/campaigns.test.ts

describe('GET /api/campaigns/public', () => {
  it('should filter premium campaigns for Basic users', async () => {
    const response = await fetch('/api/campaigns/public', {
      headers: { Authorization: `Bearer ${basicUserToken}` }
    });
    
    const campaigns = await response.json();
    const premiumCampaigns = campaigns.filter(c => c.isPremium);
    
    premiumCampaigns.forEach(campaign => {
      expect(campaign.isAccessible).toBe(false);
      expect(campaign.requiresUpgrade).toBe(true);
    });
  });
  
  it('should allow Pro users to access all campaigns', async () => {
    const response = await fetch('/api/campaigns/public', {
      headers: { Authorization: `Bearer ${proUserToken}` }
    });
    
    const campaigns = await response.json();
    
    campaigns.forEach(campaign => {
      expect(campaign.isAccessible).toBe(true);
      expect(campaign.requiresUpgrade).toBe(false);
    });
  });
});

describe('POST /api/campaigns/[id]/join', () => {
  it('should reject Basic user joining premium campaign', async () => {
    const response = await fetch(`/api/campaigns/${premiumCampaignId}/join`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${basicUserToken}` }
    });
    
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.requiresUpgrade).toBe(true);
    expect(data.requiredPlans).toContain('PRO');
  });
});
```

#### Tests E2E

```typescript
// e2e/premium-campaigns.spec.ts

test('Basic user sees premium campaigns as locked', async ({ page }) => {
  await loginAs(page, 'basic-user');
  await page.goto('/dashboard/clipper/campaigns');
  
  // Vérifier la présence du badge Premium
  const premiumBadge = page.locator('[data-testid="premium-badge"]').first();
  await expect(premiumBadge).toBeVisible();
  
  // Vérifier l'overlay de verrouillage
  const lockOverlay = page.locator('[data-testid="lock-overlay"]').first();
  await expect(lockOverlay).toBeVisible();
  
  // Cliquer sur "Upgrader"
  await page.click('[data-testid="upgrade-button"]');
  await expect(page).toHaveURL(/.*subscription/);
});

test('Pro user can access premium campaigns', async ({ page }) => {
  await loginAs(page, 'pro-user');
  await page.goto('/dashboard/clipper/campaigns');
  
  // Vérifier l'absence d'overlay de verrouillage
  const lockOverlay = page.locator('[data-testid="lock-overlay"]');
  await expect(lockOverlay).toHaveCount(0);
  
  // Pouvoir rejoindre une campagne premium
  await page.click('[data-testid="join-premium-campaign"]');
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

---

### Plan de Déploiement

#### Phase 1 : Préparation (Semaine 1)
- [ ] Ajouter le champ `remunerationPer1000Views` au schéma Prisma si absent
- [ ] Créer les migrations de base de données
- [ ] Implémenter les fonctions de vérification d'accès
- [ ] Créer les tests unitaires

#### Phase 2 : Backend (Semaine 2)
- [ ] Modifier les endpoints API pour inclure la vérification d'accès
- [ ] Ajouter les logs d'audit pour les tentatives d'accès
- [ ] Implémenter les tests d'intégration API
- [ ] Documenter les nouveaux endpoints

#### Phase 3 : Frontend (Semaine 3)
- [ ] Créer les composants UI (badges, overlays, modals)
- [ ] Implémenter les filtres et sections de campagnes
- [ ] Ajouter les événements analytics
- [ ] Tests E2E

#### Phase 4 : Communication (Semaine 4)
- [ ] Préparer les emails de notification
- [ ] Créer les bannières in-app
- [ ] Rédiger les articles de blog/FAQ
- [ ] Former l'équipe support

#### Phase 5 : Déploiement Progressif (Semaine 5)
- [ ] Déploiement en staging
- [ ] Tests avec utilisateurs beta
- [ ] Déploiement production (10% des utilisateurs)
- [ ] Monitoring intensif des métriques
- [ ] Déploiement complet (100%)

#### Phase 6 : Optimisation (Semaine 6+)
- [ ] Analyser les métriques de conversion
- [ ] Ajuster le messaging si nécessaire
- [ ] Optimiser les performances
- [ ] Itérer sur l'UX

---

### Checklist de Validation

Avant de considérer cette fonctionnalité comme complète :

**Technique :**
- [ ] Le champ `remunerationPer1000Views` existe en base de données
- [ ] Les fonctions de vérification d'accès sont implémentées
- [ ] Tous les endpoints API vérifient l'accès
- [ ] Les tests unitaires passent à 100%
- [ ] Les tests d'intégration passent à 100%
- [ ] Les tests E2E couvrent tous les scénarios

**UX/UI :**
- [ ] Les campagnes premium sont clairement identifiées
- [ ] Les messages de verrouillage sont clairs et incitatifs
- [ ] Le flow d'upgrade est fluide
- [ ] Les filtres fonctionnent correctement
- [ ] L'expérience mobile est optimale

**Business :**
- [ ] Les métriques de tracking sont en place
- [ ] Les dashboards analytics sont configurés
- [ ] L'équipe support est formée
- [ ] La documentation utilisateur est à jour
- [ ] Les emails de notification sont prêts

**Sécurité :**
- [ ] Validation côté serveur obligatoire
- [ ] Logs d'audit en place
- [ ] Pas de contournement possible
- [ ] Tests de sécurité effectués

---

**Document créé le :** 11 octobre 2025
**Version :** 1.0
**Auteur :** Architecture Team ClipBox
**Statut :** En attente de validation