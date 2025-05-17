import React from 'react';
import { Code } from 'lucide-react';

const CodeSamples: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
      <Code size={48} className="mb-4 opacity-50" />
      <p>Code samples coming soon</p>
    </div>
  );
};

export default CodeSamples;