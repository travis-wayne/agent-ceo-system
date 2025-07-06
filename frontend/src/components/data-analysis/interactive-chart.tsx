"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  Download, 
  Maximize, 
  Settings,
  Filter,
  RefreshCw
} from "lucide-react";

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

interface InteractiveChartProps {
  title: string;
  description?: string;
  chartType: 'bar' | 'line' | 'pie' | 'scatter' | 'area';
  data: ChartData;
  height?: number;
  showControls?: boolean;
  showExport?: boolean;
  className?: string;
}

export function InteractiveChart({
  title,
  description,
  chartType: initialChartType,
  data,
  height = 300,
  showControls = true,
  showExport = true,
  className = ""
}: InteractiveChartProps) {
  const [chartType, setChartType] = useState(initialChartType);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<string>("all");

  // Mock chart rendering - In production, this would use a library like Chart.js or Recharts
  const renderChart = () => {
    const chartHeight = isFullscreen ? 500 : height;
    
    switch (chartType) {
      case 'bar':
        return renderBarChart(chartHeight);
      case 'line':
        return renderLineChart(chartHeight);
      case 'pie':
        return renderPieChart(chartHeight);
      case 'scatter':
        return renderScatterChart(chartHeight);
      case 'area':
        return renderAreaChart(chartHeight);
      default:
        return renderBarChart(chartHeight);
    }
  };

  const renderBarChart = (height: number) => (
    <div 
      className="flex items-end justify-center space-x-2 p-4 bg-gradient-to-t from-blue-50 to-white rounded-lg border"
      style={{ height: `${height}px` }}
    >
      {data.labels.map((label, index) => {
        const value = data.datasets[0]?.data[index] || 0;
        const maxValue = Math.max(...(data.datasets[0]?.data || [0]));
        const barHeight = (value / maxValue) * (height - 100);
        
        return (
          <div key={label} className="flex flex-col items-center">
            <div className="text-xs font-medium mb-2">{value}</div>
            <div 
              className="bg-blue-500 rounded-t-md transition-all duration-300 hover:bg-blue-600 cursor-pointer"
              style={{ 
                height: `${barHeight}px`, 
                width: '40px',
                minHeight: '4px'
              }}
              title={`${label}: ${value}`}
            />
            <div className="text-xs text-gray-600 mt-2 max-w-[60px] truncate" title={label}>
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderLineChart = (height: number) => (
    <div 
      className="relative p-4 bg-gradient-to-br from-green-50 to-white rounded-lg border"
      style={{ height: `${height}px` }}
    >
      <svg width="100%" height="100%" className="overflow-visible">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1="0"
            y1={`${ratio * 100}%`}
            x2="100%"
            y2={`${ratio * 100}%`}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        
        {/* Data line */}
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          points={data.labels.map((_, index) => {
            const x = (index / (data.labels.length - 1)) * 100;
            const value = data.datasets[0]?.data[index] || 0;
            const maxValue = Math.max(...(data.datasets[0]?.data || [0]));
            const y = 100 - (value / maxValue) * 80;
            return `${x}%,${y}%`;
          }).join(' ')}
        />
        
        {/* Data points */}
        {data.labels.map((label, index) => {
          const x = (index / (data.labels.length - 1)) * 100;
          const value = data.datasets[0]?.data[index] || 0;
          const maxValue = Math.max(...(data.datasets[0]?.data || [0]));
          const y = 100 - (value / maxValue) * 80;
          
          return (
            <circle
              key={index}
              cx={`${x}%`}
              cy={`${y}%`}
              r="4"
              fill="#10b981"
              className="hover:r-6 transition-all cursor-pointer"
              title={`${label}: ${value}`}
            />
          );
        })}
      </svg>
      
      {/* Labels */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-xs text-gray-600">
        {data.labels.map((label, index) => (
          <span key={index} className="transform -translate-x-1/2">
            {label}
          </span>
        ))}
      </div>
    </div>
  );

  const renderPieChart = (height: number) => {
    const total = data.datasets[0]?.data.reduce((sum, value) => sum + value, 0) || 1;
    let cumulativePercentage = 0;
    
    return (
      <div 
        className="flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-white rounded-lg border"
        style={{ height: `${height}px` }}
      >
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            {data.labels.map((label, index) => {
              const value = data.datasets[0]?.data[index] || 0;
              const percentage = value / total;
              const startAngle = cumulativePercentage * 360;
              const endAngle = (cumulativePercentage + percentage) * 360;
              
              cumulativePercentage += percentage;
              
              const largeArcFlag = percentage > 0.5 ? 1 : 0;
              const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
              
              const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
              const color = colors[index % colors.length];
              
              return (
                <path
                  key={index}
                  d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  title={`${label}: ${value} (${(percentage * 100).toFixed(1)}%)`}
                />
              );
            })}
          </svg>
          
          {/* Legend */}
          <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 space-y-2">
            {data.labels.map((label, index) => {
              const value = data.datasets[0]?.data[index] || 0;
              const percentage = ((value / total) * 100).toFixed(1);
              const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
              const color = colors[index % colors.length];
              
              return (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-gray-700">
                    {label}: {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderScatterChart = (height: number) => (
    <div 
      className="relative p-4 bg-gradient-to-br from-orange-50 to-white rounded-lg border"
      style={{ height: `${height}px` }}
    >
      <svg width="100%" height="100%">
        {/* Grid */}
        {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio) => (
          <g key={ratio}>
            <line
              x1="0"
              y1={`${ratio * 100}%`}
              x2="100%"
              y2={`${ratio * 100}%`}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            <line
              x1={`${ratio * 100}%`}
              y1="0"
              x2={`${ratio * 100}%`}
              y2="100%"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          </g>
        ))}
        
        {/* Scatter points */}
        {data.labels.map((label, index) => {
          const value = data.datasets[0]?.data[index] || 0;
          const maxValue = Math.max(...(data.datasets[0]?.data || [0]));
          const x = (index / (data.labels.length - 1)) * 90 + 5;
          const y = 95 - (value / maxValue) * 85;
          
          return (
            <circle
              key={index}
              cx={`${x}%`}
              cy={`${y}%`}
              r="6"
              fill="#f97316"
              className="hover:r-8 transition-all cursor-pointer opacity-70 hover:opacity-100"
              title={`${label}: ${value}`}
            />
          );
        })}
      </svg>
    </div>
  );

  const renderAreaChart = (height: number) => (
    <div 
      className="relative p-4 bg-gradient-to-br from-indigo-50 to-white rounded-lg border"
      style={{ height: `${height}px` }}
    >
      <svg width="100%" height="100%">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <polygon
          fill="url(#areaGradient)"
          points={`0,100% ${data.labels.map((_, index) => {
            const x = (index / (data.labels.length - 1)) * 100;
            const value = data.datasets[0]?.data[index] || 0;
            const maxValue = Math.max(...(data.datasets[0]?.data || [0]));
            const y = 100 - (value / maxValue) * 80;
            return `${x}%,${y}%`;
          }).join(' ')} 100%,100%`}
        />
        
        {/* Line */}
        <polyline
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          points={data.labels.map((_, index) => {
            const x = (index / (data.labels.length - 1)) * 100;
            const value = data.datasets[0]?.data[index] || 0;
            const maxValue = Math.max(...(data.datasets[0]?.data || [0]));
            const y = 100 - (value / maxValue) * 80;
            return `${x}%,${y}%`;
          }).join(' ')}
        />
      </svg>
    </div>
  );

  const handleExport = () => {
    // Mock export functionality
    const exportData = {
      title,
      chartType,
      data,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-chart-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={`${className} ${isFullscreen ? 'fixed inset-4 z-50 bg-white' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {chartType === 'bar' && <BarChart3 className="h-5 w-5 text-blue-500" />}
              {chartType === 'line' && <LineChart className="h-5 w-5 text-green-500" />}
              {chartType === 'pie' && <PieChart className="h-5 w-5 text-purple-500" />}
              {chartType === 'scatter' && <TrendingUp className="h-5 w-5 text-orange-500" />}
              {chartType === 'area' && <TrendingUp className="h-5 w-5 text-indigo-500" />}
              {title}
            </CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {showControls && (
              <>
                <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                    <SelectItem value="scatter">Scatter Plot</SelectItem>
                    <SelectItem value="area">Area Chart</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {showExport && (
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {renderChart()}
        
        {/* Chart statistics */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="font-medium">{data.datasets[0]?.data.length || 0}</p>
            <p className="text-muted-foreground">Data Points</p>
          </div>
          <div className="text-center">
            <p className="font-medium">
              {Math.max(...(data.datasets[0]?.data || [0]))}
            </p>
            <p className="text-muted-foreground">Max Value</p>
          </div>
          <div className="text-center">
            <p className="font-medium">
              {Math.min(...(data.datasets[0]?.data || [0]))}
            </p>
            <p className="text-muted-foreground">Min Value</p>
          </div>
          <div className="text-center">
            <p className="font-medium">
              {((data.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0) / (data.datasets[0]?.data.length || 1)).toFixed(1)}
            </p>
            <p className="text-muted-foreground">Average</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 