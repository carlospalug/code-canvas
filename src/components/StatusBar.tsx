import React, { useState, useEffect } from 'react';
import { GitBranch, Wifi, Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning } from 'lucide-react';
import { useGitStore } from '../store/gitStore';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';

interface StatusBarProps {
  isDark: boolean;
}

interface BatteryInfo {
  level: number;
  isCharging: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ isDark }) => {
  const { branch } = useGitStore();
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [batteryInfo, setBatteryInfo] = useState<BatteryInfo>({ level: 100, isCharging: false });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const getBatteryInfo = async () => {
      // Check if we're on a native platform (not web)
      if (Capacitor.getPlatform() !== 'web' && Capacitor.isPluginAvailable('Device')) {
        try {
          const info = await Device.getBatteryInfo();
          setBatteryInfo({ 
            level: Math.round(info.batteryLevel * 100), 
            isCharging: info.isCharging 
          });
        } catch (error) {
          console.error('Error fetching battery info:', error);
        }
      } else {
        // In web browser, use default values
        setBatteryInfo({ level: 100, isCharging: false });
      }
    };

    // Get battery info immediately
    getBatteryInfo();

    // Set up interval to update battery status
    const batteryCheckInterval = setInterval(getBatteryInfo, 30000); // every 30 seconds

    return () => {
      clearInterval(batteryCheckInterval);
    };
  }, []);

  const getBatteryIcon = () => {
    const { level, isCharging } = batteryInfo;
    
    if (isCharging) return <BatteryCharging size={14} className="text-green-500" />;
    
    if (level <= 20) return <BatteryWarning size={14} className="text-red-500" />;
    if (level <= 40) return <BatteryLow size={14} className="text-yellow-500" />;
    if (level <= 70) return <BatteryMedium size={14} className="text-gray-400" />;
    return <BatteryFull size={14} className="text-green-500" />;
  };

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
        <div className="flex items-center group">
          {getBatteryIcon()}
          <span className={`ml-2 ${
            batteryInfo.level <= 20 
              ? 'text-red-500' 
              : batteryInfo.isCharging 
                ? 'text-green-500' 
                : ''
          }`}>
            {batteryInfo.level}%
            {batteryInfo.isCharging && <span className="ml-1 animate-pulse">⚡</span>}
          </span>
          
          {/* Battery tooltip on hover */}
          <div className="absolute bottom-12 right-16 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg
            opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
            {batteryInfo.isCharging ? 'Charging' : 'Battery'}: {batteryInfo.level}%
          </div>
        </div>
        <div>{time}</div>
      </div>
    </div>
  );
};

export default StatusBar;