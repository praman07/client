// Re-exports the DB-backed useUser from @/entities/user.
// All callsites importing from '@/shared/hooks' continue to work unchanged.
export { useUser } from '@/entities/user'
