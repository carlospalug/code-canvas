import React, { useState, useEffect } from 'react';
import { Code2, Copy, Check, Search, ChevronRight, Lock } from 'lucide-react';
import { allSamples, CodeSample } from '../samples';
import { useSubscriptionStore } from '../store/subscriptionStore';

const MONTHLY_PRICE = '$14.99/month';
const YEARLY_PRICE = '$149.99/year';
const YEARLY_SAVINGS = 'Save 17%';

const CodeSamples: React.FC = () => {
  const { subscription } = useSubscriptionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  const languages = Array.from(new Set(allSamples.map(s => s.language)));
  const categories = Array.from(new Set(allSamples.map(s => s.category)));

  const filteredSamples = allSamples.filter(sample => {
    const matchesSearch = searchQuery === '' || 
      sample.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLanguage = !selectedLanguage || sample.language === selectedLanguage;
    const matchesCategory = !selectedCategory || sample.category === selectedCategory;
    
    return matchesSearch && matchesLanguage && matchesCategory;
  });

  const handleCopy = async (code: string, id: string) => {
    if (!subscription?.isSubscribed) {
      setShowSubscribeModal(true);
      return;
    }

    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExpandSample = (id: string) => {
    if (!subscription?.isSubscribed) {
      setShowSubscribeModal(true);
      return;
    }
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Code Samples
          </h1>
          {!subscription?.isSubscribed && (
            <button
              onClick={() => setShowSubscribeModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search samples..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 
                border border-gray-200 dark:border-gray-700 rounded-lg
                text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedLanguage || ''}
              onChange={(e) => setSelectedLanguage(e.target.value || null)}
              className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 
                border border-gray-200 dark:border-gray-700 rounded-lg
                text-gray-900 dark:text-gray-100"
            >
              <option value="">All Languages</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 
                border border-gray-200 dark:border-gray-700 rounded-lg
                text-gray-900 dark:text-gray-100"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {filteredSamples.map(sample => (
            <div 
              key={sample.id}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
            >
              <div 
                className="p-4 cursor-pointer"
                onClick={() => handleExpandSample(sample.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Code2 size={20} className="text-gray-500" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {sample.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {sample.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!subscription?.isSubscribed && (
                      <Lock size={18} className="text-gray-500" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(sample.code, sample.id);
                      }}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      {copiedId === sample.id ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} className="text-gray-500" />
                      )}
                    </button>
                    <ChevronRight 
                      size={18} 
                      className={`text-gray-500 transition-transform ${
                        expandedId === sample.id ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <span className="inline-block px-2 py-1 text-xs font-medium 
                    bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                    {sample.category}
                  </span>
                  <span className="inline-block px-2 py-1 text-xs font-medium 
                    bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
                    {sample.language}
                  </span>
                </div>
              </div>
              
              {expandedId === sample.id && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <pre className="p-4 overflow-x-auto text-sm font-mono
                    bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                    <code>{sample.code}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Upgrade to Pro
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get unlimited access to all code samples and premium features.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => useSubscriptionStore.getState().subscribe('monthly')}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium
                  hover:bg-blue-700 transition-colors"
              >
                Subscribe Monthly - {MONTHLY_PRICE}
              </button>
              <button
                onClick={() => useSubscriptionStore.getState().subscribe('yearly')}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-medium
                  hover:bg-green-700 transition-colors relative"
              >
                <span>Subscribe Yearly - {YEARLY_PRICE}</span>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {YEARLY_SAVINGS}
                </span>
              </button>
              <button
                onClick={() => setShowSubscribeModal(false)}
                className="w-full py-3 text-gray-600 dark:text-gray-400 hover:underline"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeSamples;