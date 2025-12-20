import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const today = new Date();
  const isToday = (day) => {
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon size={20} className="text-blue-500" />
          <h3 className="text-lg font-semibold">Calendar</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="p-1 hover:bg-gray-800/50 rounded transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium min-w-[120px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-gray-800/50 rounded transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-xs font-medium text-gray-500 pb-2">
            {day}
          </div>
        ))}
        
        {[...Array(firstDayOfMonth)].map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          return (
            <button
              key={day}
              className={`aspect-square p-2 rounded-lg text-sm font-medium transition-all
                ${isToday(day)
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'hover:bg-gray-800/50 text-gray-300'
                }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-600/10 border border-blue-600/20">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-sm text-gray-300">Today: December 20, 2025</span>
        </div>
      </div>
    </div>
  );
}

