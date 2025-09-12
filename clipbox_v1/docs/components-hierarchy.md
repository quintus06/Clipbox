# Hiérarchie des Composants UI Clipbox

## Vue d'ensemble

L'architecture des composants suit une approche modulaire et réutilisable, organisée en couches distinctes : composants UI de base, composants métier, layouts et pages. Tous les composants sont développés en TypeScript avec React/Next.js.

## Structure des Dossiers

```
src/
├── components/
│   ├── ui/                    # Composants UI atomiques
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Table/
│   │   └── ...
│   ├── features/              # Composants métier
│   │   ├── campaigns/
│   │   ├── submissions/
│   │   ├── payments/
│   │   └── ...
│   ├── layouts/               # Layouts réutilisables
│   │   ├── DashboardLayout/
│   │   ├── PublicLayout/
│   │   └── AdminLayout/
│   └── providers/             # Context Providers
│       ├── AuthProvider/
│       ├── ThemeProvider/
│       └── LocaleProvider/
├── app/                       # Pages Next.js App Router
└── lib/                       # Utilitaires et hooks
```

## Composants UI de Base

### 1. Button Component
```typescript
// components/ui/Button/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
}

Button/
├── Button.tsx
├── Button.module.css
├── Button.test.tsx
└── index.ts
```

### 2. Card Component
```typescript
// components/ui/Card/Card.tsx
interface CardProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  footer?: React.ReactNode
  hoverable?: boolean
  children: React.ReactNode
}

Card/
├── Card.tsx
├── CardHeader.tsx
├── CardBody.tsx
├── CardFooter.tsx
└── index.ts
```

### 3. Input Component
```typescript
// components/ui/Input/Input.tsx
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'textarea'
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  required?: boolean
}

Input/
├── Input.tsx
├── TextInput.tsx
├── NumberInput.tsx
├── TextArea.tsx
├── Select.tsx
└── index.ts
```

### 4. Modal Component
```typescript
// components/ui/Modal/Modal.tsx
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
  children: React.ReactNode
}

Modal/
├── Modal.tsx
├── ModalHeader.tsx
├── ModalBody.tsx
├── ModalFooter.tsx
└── index.ts
```

### 5. Table Component
```typescript
// components/ui/Table/Table.tsx
interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  pagination?: PaginationProps
  onRowClick?: (row: T) => void
  selectable?: boolean
  onSelectionChange?: (selected: T[]) => void
}

Table/
├── Table.tsx
├── TableHeader.tsx
├── TableBody.tsx
├── TableRow.tsx
├── TablePagination.tsx
└── index.ts
```

### 6. Badge Component
```typescript
// components/ui/Badge/Badge.tsx
interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'default'
  size: 'sm' | 'md'
  dot?: boolean
  children: React.ReactNode
}
```

### 7. Avatar Component
```typescript
// components/ui/Avatar/Avatar.tsx
interface AvatarProps {
  src?: string
  alt?: string
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
  status?: 'online' | 'offline' | 'busy'
}
```

### 8. Dropdown Component
```typescript
// components/ui/Dropdown/Dropdown.tsx
interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  placement?: 'bottom' | 'top' | 'left' | 'right'
}
```

### 9. Toast/Notification Component
```typescript
// components/ui/Toast/Toast.tsx
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}
```

### 10. Skeleton Loader
```typescript
// components/ui/Skeleton/Skeleton.tsx
interface SkeletonProps {
  variant: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}
```

## Composants Métier (Features)

### 1. Campaign Components

```
components/features/campaigns/
├── CampaignCard/
│   ├── CampaignCard.tsx
│   ├── CampaignCardSkeleton.tsx
│   └── index.ts
├── CampaignList/
│   ├── CampaignList.tsx
│   ├── CampaignFilters.tsx
│   └── index.ts
├── CampaignForm/
│   ├── CampaignForm.tsx
│   ├── StepBasicInfo.tsx
│   ├── StepTargeting.tsx
│   ├── StepBudget.tsx
│   ├── StepReview.tsx
│   └── index.ts
├── CampaignDetails/
│   ├── CampaignDetails.tsx
│   ├── CampaignStats.tsx
│   ├── CampaignSubmissions.tsx
│   └── index.ts
└── CampaignAnalytics/
    ├── AnalyticsOverview.tsx
    ├── PerformanceChart.tsx
    ├── PlatformBreakdown.tsx
    └── index.ts
```

#### CampaignCard Component
```typescript
interface CampaignCardProps {
  campaign: Campaign
  variant: 'compact' | 'detailed'
  showActions?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onViewDetails?: () => void
}
```

#### CampaignForm Component
```typescript
interface CampaignFormProps {
  mode: 'create' | 'edit'
  initialData?: Partial<Campaign>
  onSubmit: (data: CampaignFormData) => Promise<void>
  onCancel: () => void
}
```

### 2. Submission Components

```
components/features/submissions/
├── SubmissionCard/
│   ├── SubmissionCard.tsx
│   ├── SubmissionStatus.tsx
│   └── index.ts
├── SubmissionForm/
│   ├── SubmissionForm.tsx
│   ├── ClipUploader.tsx
│   └── index.ts
├── SubmissionReview/
│   ├── ReviewModal.tsx
│   ├── ReviewForm.tsx
│   └── index.ts
└── SubmissionMetrics/
    ├── MetricsDisplay.tsx
    ├── MetricsChart.tsx
    └── index.ts
```

#### SubmissionCard Component
```typescript
interface SubmissionCardProps {
  submission: Submission
  showCampaign?: boolean
  showClipper?: boolean
  onReview?: () => void
  onViewClip?: () => void
}
```

### 3. Payment Components

```
components/features/payments/
├── BalanceCard/
│   ├── BalanceCard.tsx
│   ├── BalanceChart.tsx
│   └── index.ts
├── TransactionList/
│   ├── TransactionList.tsx
│   ├── TransactionRow.tsx
│   ├── TransactionFilters.tsx
│   └── index.ts
├── WithdrawForm/
│   ├── WithdrawForm.tsx
│   ├── BankDetailsForm.tsx
│   └── index.ts
└── SubscriptionManager/
    ├── PlanSelector.tsx
    ├── BillingHistory.tsx
    ├── PaymentMethod.tsx
    └── index.ts
```

#### BalanceCard Component
```typescript
interface BalanceCardProps {
  balance: Balance
  showWithdrawButton?: boolean
  showHistory?: boolean
  onWithdraw?: () => void
}
```

### 4. User/Profile Components

```
components/features/users/
├── ProfileCard/
│   ├── ProfileCard.tsx
│   ├── ProfileAvatar.tsx
│   ├── ProfileStats.tsx
│   └── index.ts
├── ProfileForm/
│   ├── ProfileForm.tsx
│   ├── PersonalInfo.tsx
│   ├── BusinessInfo.tsx
│   └── index.ts
├── KYCVerification/
│   ├── KYCStatus.tsx
│   ├── KYCInitiator.tsx
│   ├── KYCDocuments.tsx
│   └── index.ts
└── SocialAccounts/
    ├── AccountsList.tsx
    ├── ConnectAccount.tsx
    └── index.ts
```

### 5. Dashboard Components

```
components/features/dashboard/
├── StatsOverview/
│   ├── StatsCard.tsx
│   ├── StatsGrid.tsx
│   └── index.ts
├── RecentActivity/
│   ├── ActivityFeed.tsx
│   ├── ActivityItem.tsx
│   └── index.ts
├── QuickActions/
│   ├── QuickActions.tsx
│   ├── ActionButton.tsx
│   └── index.ts
└── Charts/
    ├── RevenueChart.tsx
    ├── PerformanceChart.tsx
    ├── GrowthChart.tsx
    └── index.ts
```

## Layout Components

### 1. DashboardLayout
```typescript
// components/layouts/DashboardLayout/DashboardLayout.tsx
interface DashboardLayoutProps {
  children: React.ReactNode
  role: UserRole
}

DashboardLayout/
├── DashboardLayout.tsx
├── Sidebar/
│   ├── Sidebar.tsx
│   ├── SidebarNav.tsx
│   ├── SidebarFooter.tsx
│   └── index.ts
├── Header/
│   ├── Header.tsx
│   ├── UserMenu.tsx
│   ├── NotificationBell.tsx
│   ├── SearchBar.tsx
│   └── index.ts
└── index.ts
```

### 2. PublicLayout
```typescript
// components/layouts/PublicLayout/PublicLayout.tsx
interface PublicLayoutProps {
  children: React.ReactNode
  showFooter?: boolean
}

PublicLayout/
├── PublicLayout.tsx
├── Navbar/
│   ├── Navbar.tsx
│   ├── NavLinks.tsx
│   ├── MobileMenu.tsx
│   └── index.ts
├── Footer/
│   ├── Footer.tsx
│   ├── FooterLinks.tsx
│   ├── SocialLinks.tsx
│   └── index.ts
└── index.ts
```

### 3. AdminLayout
```typescript
// components/layouts/AdminLayout/AdminLayout.tsx
interface AdminLayoutProps {
  children: React.ReactNode
}

AdminLayout/
├── AdminLayout.tsx
├── AdminSidebar.tsx
├── AdminHeader.tsx
└── index.ts
```

## Provider Components

### 1. AuthProvider
```typescript
// components/providers/AuthProvider/AuthProvider.tsx
interface AuthContextValue {
  user: User | null
  loading: boolean
  signIn: (credentials: SignInCredentials) => Promise<void>
  signOut: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<void>
}
```

### 2. ThemeProvider
```typescript
// components/providers/ThemeProvider/ThemeProvider.tsx
interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
}
```

### 3. LocaleProvider
```typescript
// components/providers/LocaleProvider/LocaleProvider.tsx
interface LocaleContextValue {
  locale: 'fr' | 'en'
  t: (key: string, params?: Record<string, any>) => string
  setLocale: (locale: 'fr' | 'en') => void
}
```

## Page Components Structure

### 1. Landing Page
```typescript
app/[locale]/page.tsx
├── HeroSection
│   ├── HeroContent
│   ├── HeroImage
│   └── CTAButtons
├── FeaturesSection
│   ├── FeatureCard
│   └── FeatureGrid
├── HowItWorksSection
│   ├── StepCard
│   └── ProcessFlow
├── PricingSection
│   ├── PricingCard
│   └── PricingComparison
├── TestimonialsSection
│   ├── TestimonialCard
│   └── TestimonialSlider
└── CTASection
```

### 2. Dashboard Pages

#### Clipper Dashboard
```typescript
app/[locale]/(auth)/dashboard/clipper/page.tsx
├── EarningsOverview
├── ActiveCampaigns
├── RecentSubmissions
├── PerformanceMetrics
└── QuickActions
```

#### Advertiser Dashboard
```typescript
app/[locale]/(auth)/dashboard/advertiser/page.tsx
├── CampaignOverview
├── BudgetStatus
├── PendingReviews
├── TopPerformers
└── Analytics
```

#### Admin Dashboard
```typescript
app/[locale]/(admin)/admin/dashboard/page.tsx
├── PlatformStats
├── UserManagement
├── RevenueMetrics
├── SystemHealth
└── RecentActions
```

### 3. Campaign Pages
```typescript
app/[locale]/(auth)/campaigns/
├── page.tsx              # Liste des campagnes
│   ├── CampaignFilters
│   ├── CampaignGrid
│   └── Pagination
├── [id]/page.tsx        # Détails campagne
│   ├── CampaignHeader
│   ├── CampaignInfo
│   ├── SubmissionsList
│   └── Analytics
└── create/page.tsx      # Création campagne
    └── CampaignWizard
```

## Component Composition Patterns

### 1. Compound Components
```typescript
// Exemple avec Card
<Card>
  <Card.Header>
    <Card.Title>Titre</Card.Title>
    <Card.Actions>
      <Button>Action</Button>
    </Card.Actions>
  </Card.Header>
  <Card.Body>
    Contenu
  </Card.Body>
  <Card.Footer>
    Footer
  </Card.Footer>
</Card>
```

### 2. Render Props
```typescript
// Exemple avec DataTable
<DataTable
  data={campaigns}
  columns={columns}
  renderRow={(campaign) => (
    <CampaignRow 
      campaign={campaign}
      onEdit={handleEdit}
    />
  )}
/>
```

### 3. Higher-Order Components
```typescript
// HOC pour l'authentification
const withAuth = (Component: React.FC) => {
  return (props: any) => {
    const { user } = useAuth()
    
    if (!user) {
      return <Redirect to="/login" />
    }
    
    return <Component {...props} user={user} />
  }
}

export default withAuth(DashboardPage)
```

### 4. Custom Hooks
```typescript
// Hook pour les campagnes
function useCampaigns(filters?: CampaignFilters) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    fetchCampaigns(filters)
      .then(setCampaigns)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [filters])
  
  return { campaigns, loading, error }
}
```

## Styling Strategy

### 1. CSS Modules
```typescript
// components/ui/Button/Button.module.css
.button {
  @apply px-4 py-2 rounded-lg font-medium transition-colors;
}

.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.secondary {
  @apply bg-gray-200 text-gray-800 hover:bg-gray-300;
}
```

### 2. Tailwind CSS Classes
```typescript
// Utilisation directe de Tailwind
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
  {/* Contenu */}
</div>
```

### 3. CSS-in-JS (styled-components alternative)
```typescript
// Si utilisation de styled-components
const StyledButton = styled.button<{ variant: string }>`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: ${props => 
    props.variant === 'primary' ? '#3B82F6' : '#E5E7EB'
  };
`
```

## Accessibility (a11y)

### 1. ARIA Labels
```typescript
<Button
  aria-label="Créer une nouvelle campagne"
  aria-pressed={isActive}
  aria-disabled={isDisabled}
>
  Nouvelle Campagne
</Button>
```

### 2. Keyboard Navigation
```typescript
// Support navigation clavier
const handleKeyDown = (e: KeyboardEvent) => {
  switch(e.key) {
    case 'Enter':
    case ' ':
      handleClick()
      break
    case 'Escape':
      handleClose()
      break
  }
}
```

### 3. Focus Management
```typescript
// Gestion du focus
useEffect(() => {
  if (isOpen) {
    firstFocusableElement?.focus()
  }
}, [isOpen])
```

## Testing Strategy

### 1. Unit Tests
```typescript
// Button.test.tsx
describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 2. Integration Tests
```typescript
// CampaignForm.test.tsx
describe('Campaign Form', () => {
  it('submits form with valid data', async () => {
    const onSubmit = jest.fn()
    render(<CampaignForm onSubmit={onSubmit} />)
    
    // Fill form
    await userEvent.type(screen.getByLabelText('Title'), 'Test Campaign')
    await userEvent.click(screen.getByText('Submit'))
    
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Campaign'
      })
    )
  })
})
```

### 3. E2E Tests
```typescript
// e2e/campaign-flow.spec.ts
test('complete campaign creation flow', async ({ page }) => {
  await page.goto('/campaigns/create')
  await page.fill('[name="title"]', 'New Campaign')
  await page.fill('[name="budget"]', '1000')
  await page.click('button[type="submit"]')
  
  await expect(page).toHaveURL('/campaigns/success')
})
```

## Performance Optimizations

### 1. Code Splitting
```typescript
// Lazy loading des composants
const CampaignAnalytics = lazy(() => 
  import('@/components/features/campaigns/CampaignAnalytics')
)

// Utilisation avec Suspense
<Suspense fallback={<Skeleton />}>
  <CampaignAnalytics />
</Suspense>
```

### 2. Memoization
```typescript
// Mémoisation des composants
const MemoizedCampaignCard = memo(CampaignCard, (prevProps, nextProps) => {
  return prevProps.campaign.id === nextProps.campaign.id &&
         prevProps.campaign.updatedAt === nextProps.campaign.updatedAt
})
```

### 3. Virtual Scrolling
```typescript
// Pour les longues listes
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={campaigns.length}
  itemSize={120}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <CampaignCard campaign={campaigns[index]} />
    </div>
  )}
</FixedSizeList>
```

## Component Documentation

### Storybook Stories
```typescript
// Button.stories.tsx
export default {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger']
    }
  }
}

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
}

export const WithIcon = {
  args: {
    variant: 'primary',
    icon: <PlusIcon />,
    children: 'Add Item'
  }
}
```

## Design System Tokens

### 1. Colors
```typescript
// design-tokens/colors.ts
export const colors = {
  primary: {
    50: '#EFF6FF',
    500: '#3B82F6',
    900: '#1E3A8A'
  },
  gray: {
    50: '#F9FAFB',
    500: '#6B7280',
    900: '#111827'
  },
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
}
```

### 2. Typography
```typescript
// design-tokens/typography.ts
export const typography = {
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem'
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
}
```

### 3. Spacing
```typescript
// design-tokens/spacing.ts
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  4: '1rem',
  8: '2rem',
  16: '4rem'
}
```

## Conclusion

Cette hiérarchie de composants offre une architecture modulaire, maintenable et scalable pour Clipbox. Les composants sont conçus pour être réutilisables, accessibles et performants, tout en suivant les meilleures pratiques de React et Next.js.