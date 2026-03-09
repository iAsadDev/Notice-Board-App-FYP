'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function NoticeCard({ notice }) {
  const [expanded, setExpanded] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Academic':
        return 'bg-blue-100 text-blue-800';
      case 'Events':
        return 'bg-purple-100 text-purple-800';
      case 'Urgent':
        return 'bg-red-100 text-red-800';
      case 'General':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(notice.category)}`}>
            {notice.category}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(notice.priority)}`}>
            {notice.priority}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-2">
          <Link href={`/notice/${notice._id}`} className="hover:text-blue-600">
            {notice.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4">
          {expanded ? notice.description : `${notice.description.substring(0, 150)}...`}
          {notice.description.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 hover:underline ml-1"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <span>Posted by: {notice.createdBy?.name || 'Admin'}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(notice.createdDate), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{notice.views || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}