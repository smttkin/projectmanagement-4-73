
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: number | string;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red';
}

const colorVariants = {
  blue: {
    bgLight: 'bg-blue-50',
    bgDark: 'bg-blue-500',
    text: 'text-blue-600',
    iconBg: 'bg-blue-100',
    border: 'border-blue-100',
  },
  green: {
    bgLight: 'bg-green-50',
    bgDark: 'bg-green-500',
    text: 'text-green-600',
    iconBg: 'bg-green-100',
    border: 'border-green-100',
  },
  orange: {
    bgLight: 'bg-orange-50',
    bgDark: 'bg-orange-500',
    text: 'text-orange-600',
    iconBg: 'bg-orange-100',
    border: 'border-orange-100',
  },
  purple: {
    bgLight: 'bg-purple-50',
    bgDark: 'bg-purple-500',
    text: 'text-purple-600',
    iconBg: 'bg-purple-100',
    border: 'border-purple-100',
  },
  red: {
    bgLight: 'bg-red-50',
    bgDark: 'bg-red-500',
    text: 'text-red-600',
    iconBg: 'bg-red-100',
    border: 'border-red-100',
  },
};

const changeVariants = {
  increase: {
    className: 'text-green-600 bg-green-50',
    prefix: '+',
  },
  decrease: {
    className: 'text-red-600 bg-red-50',
    prefix: '-',
  },
  neutral: {
    className: 'text-muted-foreground bg-muted',
    prefix: '',
  },
};

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
}) => {
  const colorClasses = colorVariants[color];
  
  return (
    <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden relative group transition-all duration-300 hover:shadow-card transform hover:translate-y-[-2px]">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h4 className="text-2xl font-bold">{value}</h4>
            
            {change && (
              <div className="flex items-center mt-1.5">
                <span className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded-full",
                  changeVariants[change.type].className
                )}>
                  {changeVariants[change.type].prefix}
                  {Math.abs(change.value)}%
                </span>
                <span className="text-xs text-muted-foreground ml-1.5">vs last month</span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "h-12 w-12 rounded-lg flex items-center justify-center",
            colorClasses.iconBg
          )}>
            <Icon className={cn("h-6 w-6", colorClasses.text)} />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-transparent group-hover:via-primary group-hover:to-transparent transition-all duration-500"></div>
    </div>
  );
};

export default StatusCard;
