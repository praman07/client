import { render, screen } from '@testing-library/react'
import { UserProfilePanel } from './user-profile-panel'

// Mock the dependencies
jest.mock('@/features/chat/user-profile-panel', () => ({
  useUserProfilePanel: () => ({
    isOpen: true,
    userId: 'user-123',
    projectId: 'project-456',
    close: jest.fn(),
  }),
}))

jest.mock('@/widgets/chat-window/lib/member-cache-context', () => ({
  useMemberCache: () => ({
    getMemberInfo: () => ({
      fullName: 'John Doe',
      email: 'john@example.com',
      avatarUrl: null,
      joinedAt: new Date('2024-01-15'),
      role: 'Developer',
    }),
  }),
}))

jest.mock('@/shared/lib/auth/guard', () => ({
  Guard: ({ children }: { children: React.ReactNode }) => children,
}))

describe('UserProfilePanel', () => {
  it('renders large avatar and display name', () => {
    render(<UserProfilePanel />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders email', () => {
    render(<UserProfilePanel />)
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('shows project role badge when available', () => {
    render(<UserProfilePanel />)
    expect(screen.getByText('Developer')).toBeInTheDocument()
  })

  it('shows member since date', () => {
    render(<UserProfilePanel />)
    expect(screen.getByText(/January 2024/)).toBeInTheDocument()
  })

  it('shows Send DM button', () => {
    render(<UserProfilePanel />)
    expect(screen.getByText('Send Direct Message')).toBeInTheDocument()
  })

  it('shows Close button in footer', () => {
    render(<UserProfilePanel />)
    expect(screen.getByText('Close')).toBeInTheDocument()
  })
})
