import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="relative">
        <div className="absolute -inset-1 rounded-lg bg-linear-to-r from-teal-500 to-purple-600 opacity-25 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
        <div className="relative w-full max-w-md bg-white ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-gray-100/10 sm:rounded-lg sm:p-2 sm:shadow-xl">
           <Outlet />
        </div>
      </div>
    </div>
  )
}
