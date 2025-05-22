/**
 * Dashboard.tsx
 * Main dashboard page showing overview and stats
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserSites } from '../../store/slices/siteSlice';
import { type AppDispatch, type RootState } from '../../store/index';

// Import custom icons or use Heroicons
import {
  ShoppingBagIcon,
  UsersIcon,
  CursorArrowRaysIcon as CursorClickIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
  PencilIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// TypeScript interfaces
interface StatsCard {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon: React.FC<{ className?: string }>;
  color: string;
}

interface ActivityItem {
  id: string;
  title: string;
  time: string;
  type: 'edit' | 'visit' | 'order' | 'create';
  target?: string;
  targetUrl?: string;
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { sites, isLoading } = useSelector((state: RootState) => state.site);
  
  // Local state for recent activity
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  
  // Fetch user's sites on component mount
  useEffect(() => {
    if (user?.id) {
      dispatch(getUserSites(user.id));
    }
  }, [user, dispatch]);
  
  // Mock data for stats cards (in a real app, these would come from an API)
  const statsCards: StatsCard[] = [
    {
      title: 'Total Stores',
      value: sites.length || 0,
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Visitors',
      value: '1,423',
      change: '12%',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '0.4%',
      changeType: 'increase',
      icon: CursorClickIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Total Revenue',
      value: '$12,430',
      change: '8%',
      changeType: 'increase',
      icon: ChartBarIcon,
      color: 'bg-yellow-500',
    },
  ];
  
  // Mock recent activity (in a real app, this would come from an API)
  useEffect(() => {
    const mockActivity: ActivityItem[] = [
      {
        id: '1',
        title: 'Updated home page',
        time: '2 hours ago',
        type: 'edit',
        target: 'Fashion Store',
        targetUrl: '/builder/site-1/pages/page-1',
      },
      {
        id: '2',
        title: 'New order received',
        time: '5 hours ago',
        type: 'order',
        target: 'Order #1234',
        targetUrl: '/orders/1234',
      },
      {
        id: '3',
        title: 'Created a new site',
        time: '1 day ago',
        type: 'create',
        target: 'Electronics Shop',
        targetUrl: '/builder/site-2/pages',
      },
      {
        id: '4',
        title: 'Visitor spike detected',
        time: '2 days ago',
        type: 'visit',
        target: 'Furniture Outlet',
        targetUrl: '/analytics/site-3',
      },
    ];
    
    setRecentActivity(mockActivity);
  }, []);
  
  // Get activity icon based on type
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'edit':
        return <PencilIcon className="h-5 w-5 text-blue-500" />;
      case 'visit':
        return <CursorClickIcon className="h-5 w-5 text-purple-500" />;
      case 'order':
        return <ShoppingBagIcon className="h-5 w-5 text-green-500" />;
      case 'create':
        return <PlusIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user?.firstName}. Here's an overview of your stores.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              {stat.change && (
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span
                      className={`font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      } `}
                    >
                      {stat.changeType === 'increase' ? '↑' : '↓'} {stat.change}
                    </span>{' '}
                    <span className="text-gray-500">from last month</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Quick Access & Recent Activity */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Your Sites */}
          <div className="bg-white shadow rounded-lg lg:col-span-2">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Your Sites</h2>
                <Link
                  to="/dashboard/sites"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View all
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : sites.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No sites yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating your first e-commerce site.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/dashboard/sites/create"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      New Site
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {sites.slice(0, 3).map((site) => (
                    <div key={site.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        {site.logo ? (
                          <img src={site.logo} alt={site.name} className="h-10 w-10 rounded" />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-gray-500">
                            {site.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{site.name}</h3>
                          <p className="text-sm text-gray-500">{site.domain}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/builder/${site.id}/pages`}
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                        <a
                          href={`https://${site.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <ExternalLinkIcon className="h-4 w-4 mr-1" />
                          Visit
                        </a>
                      </div>
                    </div>
                  ))}
                  
                  {sites.length > 3 && (
                    <div className="pt-2 text-center">
                      <Link
                        to="/dashboard/sites"
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        View all {sites.length} sites
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <ul className="divide-y divide-gray-200">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </div>
                        {activity.target && (
                          <div className="mt-1 text-sm text-gray-500">
                            <span>{activity.target}</span>
                          </div>
                        )}
                        <div className="mt-1 text-sm text-gray-500">
                          {activity.time}
                        </div>
                      </div>
                      {activity.targetUrl && (
                        <div className="flex-shrink-0 ml-2">
                          <Link
                            to={activity.targetUrl}
                            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                          >
                            View
                          </Link>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Getting Started / Tips Section */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Getting Started</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                  <PlusIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Create Your First Store</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Start by creating a new e-commerce storefront. Choose from beautiful templates or start from scratch.
                </p>
                <Link
                  to="/dashboard/sites/create"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Create a store →
                </Link>
              </div>
              
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4">
                  <PencilIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Customize Your Design</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Use our drag-and-drop editor to create stunning pages for your store without any coding knowledge.
                </p>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View tutorials →
                </a>
              </div>
              
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mb-4">
                  <ShoppingBagIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Add Your Products</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Start adding products to your store, set up categories, and manage your inventory.
                </p>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Learn more →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;