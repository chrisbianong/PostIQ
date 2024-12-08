import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'Posts', href: '/dashboard/posts', icon: DocumentTextIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function DashboardSidebar() {
  const router = useRouter();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-20 bg-white overflow-y-auto border-r">
        <div className="flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <a className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}>
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        isActive
                          ? 'text-gray-900'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}