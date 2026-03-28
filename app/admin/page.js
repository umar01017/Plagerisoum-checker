import Link from 'next/link';
import { Users, Activity } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="mt-1 text-gray-500">Manage users and monitor usage.</p>
          </div>
          <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100">
            Back to App
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
              <Users className="w-8 h-8"/>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">System Users</div>
              <div className="text-sm text-gray-500">Manage registered accounts (API coming soon)</div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-4">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
              <Activity className="w-8 h-8"/>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">API Usage</div>
              <div className="text-sm text-gray-500">Monitor Groq AI inference calls (Metrics coming soon)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
