import React, { useState, useEffect } from 'react';

export default function ParameterGrid() {
  // State for the 10 server parameters
  const [parameters, setParameters] = useState({
    cpu: { value: 76, trend: 'up', status: 'warning', history: [65, 68, 72, 75, 76] },
    memory: { value: 67, trend: 'up', status: 'normal', history: [60, 62, 64, 66, 67] },
    disk: { value: 82, trend: 'stable', status: 'warning', history: [81, 81, 82, 82, 82] },
    temperature: { value: 58, trend: 'up', status: 'warning', history: [52, 54, 56, 57, 58] },
    errors: { value: 12, trend: 'up', status: 'critical', history: [2, 4, 7, 9, 12] },
    responseTime: { value: 230, trend: 'up', status: 'critical', history: [150, 175, 195, 210, 230] },
    network: { value: 45, trend: 'down', status: 'normal', history: [60, 55, 50, 47, 45] },
    uptime: { value: 8.5, trend: 'stable', status: 'normal', history: [8.5, 8.5, 8.5, 8.5, 8.5] },
    processor: { value: 82, trend: 'up', status: 'warning', history: [70, 74, 78, 80, 82] },
    threads: { value: 128, trend: 'up', status: 'normal', history: [100, 110, 118, 125, 128] },
  });

  // Crash likelihood calculation based on parameter values
  const [crashLikelihood, setCrashLikelihood] = useState({
    probability: 0.64,
    timeFrame: '6 hours',
    recommendations: [
      'Reduce CPU-intensive tasks',
      'Investigate error rate increase',
      'Optimize response time'
    ]
  });

  // Thresholds for determining parameter status
  const thresholds = {
    cpu: { warning: 70, critical: 85 },
    memory: { warning: 75, critical: 90 },
    disk: { warning: 80, critical: 90 },
    temperature: { warning: 55, critical: 70 },
    errors: { warning: 5, critical: 10 },
    responseTime: { warning: 180, critical: 220 },
    network: { warning: 80, critical: 95 },
    uptime: { warning: 0, critical: 0 },  // Lower is bad for uptime
    processor: { warning: 75, critical: 90 },
    threads: { warning: 150, critical: 200 }
  };

  // Units for each parameter
  const units = {
    cpu: '%',
    memory: '%',
    disk: '%',
    temperature: '°C',
    errors: '',
    responseTime: 'ms',
    network: '%',
    uptime: 'days',
    processor: '%',
    threads: ''
  };

  // Parameter names for display
  const paramNames = {
    cpu: 'CPU Load',
    memory: 'Memory Usage',
    disk: 'Disk Space',
    temperature: 'Temperature',
    errors: 'Error Rate',
    responseTime: 'Response Time',
    network: 'Network Usage',
    uptime: 'Uptime',
    processor: 'Processor',
    threads: 'Active Threads'
  };

  // Update parameters periodically (mock data)
  useEffect(() => {
    const timer = setInterval(() => {
      // Create a new object to avoid mutation
      const newParameters = { ...parameters };
      
      // Update each parameter with slight random changes
      Object.keys(newParameters).forEach(param => {
        const currentParam = newParameters[param];
        let change = 0;
        
        // Determine change direction based on current trend
        if (currentParam.trend === 'up') {
          change = Math.random() * 5;
        } else if (currentParam.trend === 'down') {
          change = -Math.random() * 5;
        } else {
          change = (Math.random() - 0.5) * 4;
        }
        
        // Special case for uptime (always increases)
        if (param === 'uptime') {
          change = 0.01; // Slight increase in uptime
        }
        
        // Calculate new value
        let newValue = Math.round((currentParam.value + change) * 10) / 10;
        
        // Ensure values are within reasonable bounds
        if (param === 'cpu' || param === 'memory' || param === 'disk' || param === 'processor' || param === 'network') {
          newValue = Math.max(0, Math.min(100, newValue));
        }
        if (param === 'temperature') {
          newValue = Math.max(20, Math.min(90, newValue));
        }
        if (param === 'errors') {
          newValue = Math.max(0, Math.min(50, newValue));
        }
        if (param === 'responseTime') {
          newValue = Math.max(50, Math.min(500, newValue));
        }
        if (param === 'threads') {
          newValue = Math.max(10, Math.min(300, newValue));
        }
        
        // Update history
        const newHistory = [...currentParam.history.slice(1), newValue];
        
        // Determine trend
        let trend = 'stable';
        if (newValue > currentParam.value + 1) {
          trend = 'up';
        } else if (newValue < currentParam.value - 1) {
          trend = 'down';
        }
        
        // Determine status based on thresholds
        let status = 'normal';
        if (param === 'uptime') {
          status = 'normal'; // Uptime is always normal or critical
        } else {
          if (newValue >= thresholds[param].critical) {
            status = 'critical';
          } else if (newValue >= thresholds[param].warning) {
            status = 'warning';
          }
        }
        
        // Update parameter
        newParameters[param] = {
          value: newValue,
          trend,
          status,
          history: newHistory
        };
      });
      
      // Calculate crash likelihood based on parameter statuses
      const criticalCount = Object.values(newParameters).filter(p => p.status === 'critical').length;
      const warningCount = Object.values(newParameters).filter(p => p.status === 'warning').length;
      
      // Calculate probability (more critical/warning parameters = higher probability)
      const newProbability = Math.min(
        0.95,
        (criticalCount * 0.15) + (warningCount * 0.08) + 0.2
      );
      
      // Update time frame based on probability
      let newTimeFrame = '24 hours';
      if (newProbability > 0.7) {
        newTimeFrame = '1 hour';
      } else if (newProbability > 0.5) {
        newTimeFrame = '6 hours';
      } else if (newProbability > 0.3) {
        newTimeFrame = '12 hours';
      }
      
      // Generate recommendations based on critical and warning parameters
      const newRecommendations = [];
      
      if (newParameters.cpu.status === 'critical' || newParameters.processor.status === 'critical') {
        newRecommendations.push('Reduce CPU-intensive tasks immediately');
      } else if (newParameters.cpu.status === 'warning' || newParameters.processor.status === 'warning') {
        newRecommendations.push('Monitor CPU usage and prepare to scale');
      }
      
      if (newParameters.memory.status === 'critical') {
        newRecommendations.push('Increase memory allocation or check for memory leaks');
      }
      
      if (newParameters.disk.status === 'critical' || newParameters.disk.status === 'warning') {
        newRecommendations.push('Free up disk space or add storage');
      }
      
      if (newParameters.errors.status === 'critical') {
        newRecommendations.push('Critical: Investigate increasing error rate');
      } else if (newParameters.errors.status === 'warning') {
        newRecommendations.push('Monitor application errors');
      }
      
      if (newParameters.responseTime.status === 'critical') {
        newRecommendations.push('Optimize response time - service degradation detected');
      }
      
      if (newParameters.temperature.status === 'critical') {
        newRecommendations.push('Check cooling systems immediately');
      }
      
      // Limit to top 3 recommendations
      const limitedRecommendations = newRecommendations.slice(0, 3);
      
      setCrashLikelihood({
        probability: newProbability,
        timeFrame: newTimeFrame,
        recommendations: limitedRecommendations.length > 0 ? limitedRecommendations : ['System operating within normal parameters']
      });
      
      setParameters(newParameters);
    }, 3000);
    
    return () => clearInterval(timer);
  }, [parameters]);

  // Helper function to render trend indicator
  const renderTrend = (trend) => {
    switch (trend) {
      case 'up':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        );
      case 'down':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  // Helper function to get color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return {
          bg: 'bg-red-600',
          text: 'text-red-500',
          border: 'border-red-500',
          light: 'bg-red-600/10',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          text: 'text-yellow-500',
          border: 'border-yellow-500',
          light: 'bg-yellow-500/10',
        };
      default:
        return {
          bg: 'bg-green-500',
          text: 'text-green-500',
          border: 'border-green-500',
          light: 'bg-green-500/10',
        };
    }
  };

  // Mini sparkline chart
  const renderSparkline = (history, status) => {
    const colors = getStatusColor(status);
    const max = Math.max(...history);
    const min = Math.min(...history);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end h-6 gap-[2px]">
        {history.map((value, i) => {
          const height = ((value - min) / range) * 100;
          return (
            <div 
              key={i} 
              className={`w-[3px] ${colors.bg} rounded-sm`} 
              style={{ height: `${Math.max(15, height)}%` }}
            ></div>
          );
        })}
      </div>
    );
  };

  // Get crash likelihood color
  const getCrashLikelihoodColor = () => {
    const probability = crashLikelihood.probability;
    if (probability >= 0.7) {
      return {
        bg: 'bg-red-600',
        text: 'text-red-500',
        border: 'border-red-500',
        light: 'bg-red-600/10',
      };
    } else if (probability >= 0.4) {
      return {
        bg: 'bg-yellow-500',
        text: 'text-yellow-500',
        border: 'border-yellow-500',
        light: 'bg-yellow-500/10',
      };
    } else {
      return {
        bg: 'bg-green-500',
        text: 'text-green-500',
        border: 'border-green-500',
        light: 'bg-green-500/10',
      };
    }
  };

  const crashColors = getCrashLikelihoodColor();
  const crashProbabilityPercentage = Math.round(crashLikelihood.probability * 100);

  return (
    <section id="parameters" className="py-12 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Server Parameters</h2>
        <p className="text-gray-400 mb-8">Real-time monitoring of critical server metrics</p>
        
        {/* Crash Likelihood Banner */}
        <div className={`mb-8 p-4 rounded-lg ${crashColors.light} border ${crashColors.border} border-opacity-30`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className={`${crashColors.bg} h-4 w-4 rounded-full mr-3 animate-pulse`}></div>
              <div>
                <h3 className="font-bold text-lg">
                  Crash Likelihood: <span className={crashColors.text}>{crashProbabilityPercentage}%</span>
                </h3>
                <p className="text-sm text-gray-300">
                  Estimated time frame: <span className="font-medium">{crashLikelihood.timeFrame}</span>
                </p>
              </div>
            </div>
            <div className="bg-black bg-opacity-20 px-4 py-2 rounded-lg">
              <h4 className="text-sm font-medium text-gray-200 mb-1">Recommendations:</h4>
              <ul className="text-xs text-gray-300 list-disc pl-4">
                {crashLikelihood.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.keys(parameters).map((key) => {
            const param = parameters[key];
            const colors = getStatusColor(param.status);
            
            return (
              <div 
                key={key}
                className="bg-[#141414] rounded-lg border border-[#2A2A2A] p-4 hover:border-[#3A3A3A] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-gray-300 font-medium">{paramNames[key]}</h3>
                    <div className="flex items-center">
                      <span className={`text-xl font-bold ${colors.text}`}>
                        {param.value}{units[key]}
                      </span>
                      <div className="ml-2">
                        {renderTrend(param.trend)}
                      </div>
                    </div>
                  </div>
                  <div 
                    className={`h-3 w-3 rounded-full ${colors.bg} ${
                      param.status !== 'normal' ? 'animate-pulse' : ''
                    }`}
                  ></div>
                </div>
                
                {/* Sparkline chart */}
                <div className="mt-4">
                  {renderSparkline(param.history, param.status)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
