'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeNotices: 0,
    totalViews: 0,
    admins: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (!loading && user && user.role !== 'admin') {
      router.push('/dashboard');
    }
    if (user?.role === 'admin') {
      fetchStats();
    }
  }, [user, loading, router]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      
      // Fetch users for stats
      const usersRes = await axios.get('/api/admin/users', {
        withCredentials: true,
      });
      
      // Fetch notices for stats
      const noticesRes = await axios.get('/api/notices?status=active', {
        withCredentials: true,
      });
      
      const users = usersRes.data || [];
      const notices = noticesRes.data || [];
      
      // Calculate stats
      const totalUsers = users.length;
      const admins = users.filter(u => u.role === 'admin').length;
      const activeNotices = notices.length;
      const totalViews = notices.reduce((sum, notice) => sum + (notice.views || 0), 0);
      
      setStats({
        totalUsers,
        admins,
        activeNotices,
        totalViews
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading || statsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}</p>
        </div>
        
        {/* Quick Stats */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Users Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-blue-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">Users</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-sm text-gray-500 mt-1">Total registered users</p>
            </div>

            {/* Active Notices Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-green-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Notices</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.activeNotices}</p>
              <p className="text-sm text-gray-500 mt-1">Active notices</p>
            </div>

            {/* Total Views Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-purple-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">Views</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalViews}</p>
              <p className="text-sm text-gray-500 mt-1">Total notice views</p>
            </div>

            {/* Admins Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-yellow-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Admins</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.admins}</p>
              <p className="text-sm text-gray-500 mt-1">Administrators</p>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Manage Users Card */}
            <Link href="/dashboard/users" className="block group">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-lg p-3 group-hover:bg-blue-200 transition">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">Manage Users</h3>
                <p className="text-gray-600">Create, edit, and manage user accounts and permissions</p>
                <div className="mt-4 text-sm text-blue-600 group-hover:underline">
                  Go to Users → {stats.totalUsers} total
                </div>
              </div>
            </Link>

            {/* All Notices Card */}
            <Link href="/dashboard" className="block group">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 rounded-lg p-3 group-hover:bg-green-200 transition">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition">All Notices</h3>
                <p className="text-gray-600">View and manage all notices in the system</p>
                <div className="mt-4 text-sm text-green-600 group-hover:underline">
                  Go to Dashboard → {stats.activeNotices} active
                </div>
              </div>
            </Link>

            {/* Create Notice Card */}
            <Link href="/dashboard/create-notice" className="block group">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 rounded-lg p-3 group-hover:bg-purple-200 transition">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition">Create Notice</h3>
                <p className="text-gray-600">Post a new notice or announcement</p>
                <div className="mt-4 text-sm text-purple-600 group-hover:underline">
                  Create New Notice →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}