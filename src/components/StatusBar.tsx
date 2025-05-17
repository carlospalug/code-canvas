import React, { useState, useEffect } from 'react';
import { GitBranch, Wifi, Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning } from 'lucide-react';
import { useGitStore } from '../store/gitStore';
import { Capacitor } from '@capacitor/core';

interface StatusBarProps {
  isDark: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ isDark }) => {
  const { branch } = useGitStore();
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Simplified battery display without actual battery info
  const getBatteryIcon = () => <BatteryFull size={14} />;

  return (
    <div className={`h-12 flex items-center justify-between px-4 text-sm
      ${isDark ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-200'}
      border-t transition-colors`}
    >
      <div className="flex items-center space-x-6">
        <div className="flex items-center">
          <GitBranch size={14} className="mr-2" />
          <span>{branch || 'main'}</span>
        </div>
        <div>TypeScript</div>
        <div>UTF-8</div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Wifi size={14} className="mr-2" />
          <span>Online</span>
        </div>
        <div className="flex items-center">
          {getBatteryIcon()}
          <span className="ml-2">100%</span>
        </div>
        <div>{time}</div>
      </div>
    </div>
  );
};

export default StatusBar;