import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ScoreData {
  name: string;
  passed: boolean;
  attempts: number;
}

interface ScoreChartProps {
  data: ScoreData[];
}

const ScoreChart: React.FC<ScoreChartProps> = ({ data }) => {
  const maxAttempts = Math.max(...data.map(d => d.attempts), 1);

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 truncate" title={item.name}>
              {item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name}
            </span>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.passed 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {item.passed ? 'Passed' : 'Not Attempted'}
              </span>
              <span className="text-xs text-gray-500">
                {item.attempts} attempt{item.attempts !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="flex h-3 rounded-full overflow-hidden">
              {/* Passed portion */}
              <div
                className={`${item.passed ? 'bg-green-500' : 'bg-red-400'} transition-all duration-500`}
                style={{ 
                  width: item.attempts > 0 ? `${Math.max((item.attempts / maxAttempts) * 100, 10)}%` : '0%' 
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No quiz data available yet.</p>
        </div>
      )}
    </div>
  );
};

export default ScoreChart;