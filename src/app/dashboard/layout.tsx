import DashboardHeader from '@/components/layout/DashboardHeader';
import DashboardSidebar from '@/components/layout/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="md:pl-64 flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}