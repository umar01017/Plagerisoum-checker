"use client";

import { useEffect, useState } from 'react';
import { getHistoryAPI } from '@/lib/api';
import { Loader2, Calendar } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistoryAPI().then(res => {
      setHistory(res.data);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rewriting History</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">View and manage your previous document rewrites.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {history.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">No rewriting history found. Let's rewrite something!</div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {history.map((item) => (
              <li key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400 rounded-full capitalize">
                      {item.mode} Rewrite
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" /> {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                    Uniqueness: {100 - (item.plagiarism_score_after || 0)}%
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Original</h4>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm text-gray-700 dark:text-gray-300 line-clamp-4">{item.original_text}</div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Rewritten</h4>
                    <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg text-sm text-gray-700 dark:text-gray-300 line-clamp-4">{item.rewritten_text}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
