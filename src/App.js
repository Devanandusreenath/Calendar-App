import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, parseISO, isSameMonth } from 'date-fns';
import './App.css';

const mockEvents = [
  {
    id: 1,
    title: "Team Meeting",
    date: "2025-05-10",
    time: "10:00",
    duration: 60,
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Project Review",
    date: "2025-05-10",
    time: "11:30",
    duration: 45,
    color: "bg-green-500"
  },
  {
    id: 3,
    title: "Client Call",
    date: "2025-05-12",
    time: "14:00",
    duration: 30,
    color: "bg-purple-500"
  },
  {
    id: 4,
    title: "Lunch with Team",
    date: "2025-05-15",
    time: "12:30",
    duration: 90,
    color: "bg-yellow-500"
  },
  {
    id: 5,
    title: "Code Review",
    date: "2025-05-20",
    time: "15:00",
    duration: 60,
    color: "bg-red-500"
  },
  {
    id: 6,
    title: "Weekly Report",
    date: "2025-05-20",
    time: "16:30",
    duration: 45,
    color: "bg-teal-500"
  }
];

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    setEvents(mockEvents);
  }, []);

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    
    const dateEvents = events.filter(event => 
      isSameDay(parseISO(event.date), date)
    );
    
    setSelectedEvents(dateEvents);
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const startDay = monthStart.getDay();
    
    const emptyDays = Array.from({ length: startDay }, (_, i) => (
      <div key={`empty-${i}`} className="p-2 border border-gray-200"></div>
    ));
    
    const days = daysInMonth.map(day => {
      const dayEvents = events.filter(event => 
        isSameDay(parseISO(event.date), day)
      );
      
      const isCurrentDay = isToday(day);
      const isSelected = selectedDate && isSameDay(day, selectedDate);
      const isCurrentMonth = isSameMonth(day, currentDate);
      
      return (
        <div 
          key={day.toString()} 
          onClick={() => handleDateClick(day)}
          className={`p-2 border border-gray-200 min-h-24 relative cursor-pointer transition-colors
            ${isCurrentDay ? 'bg-blue-100' : ''}
            ${isSelected ? 'ring-2 ring-blue-500' : ''}
            ${isCurrentMonth ? '' : 'text-gray-400'}`}
        >
          <div className={`text-sm font-medium ${isCurrentDay ? 'text-blue-600 font-bold' : ''}`}>
            {format(day, 'd')}
          </div>
          <div className="mt-1">
            {dayEvents.slice(0, 3).map(event => (
              <div 
                key={event.id} 
                className={`text-xs text-white p-1 mb-1 rounded truncate ${event.color}`}
                title={`${event.title} at ${event.time}`}
              >
                {event.time} {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    });
    
    return [...emptyDays, ...days];
  };

  const checkEventConflicts = (events) => {
    const conflictingEvents = [];
    
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const event1 = events[i];
        const event2 = events[j];
        
        if (event1.date !== event2.date) continue;
        
        const [hours1, minutes1] = event1.time.split(':').map(Number);
        const [hours2, minutes2] = event2.time.split(':').map(Number);
        
        const start1 = hours1 * 60 + minutes1;
        const end1 = start1 + event1.duration;
        
        const start2 = hours2 * 60 + minutes2;
        const end2 = start2 + event2.duration;
        
        if ((start1 < end2 && end1 > start2)) {
          if (!conflictingEvents.includes(event1.id)) conflictingEvents.push(event1.id);
          if (!conflictingEvents.includes(event2.id)) conflictingEvents.push(event2.id);
        }
      }
    }
    
    return conflictingEvents;
  };

  const conflictingEvents = selectedEvents.length > 0 ? checkEventConflicts(selectedEvents) : [];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          { }
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h1>
            <div className="flex space-x-2">
              <button 
                onClick={goToPreviousMonth}
                className="p-2 bg-white bg-opacity-20 text-white rounded hover:bg-opacity-30 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 bg-white bg-opacity-20 text-white rounded hover:bg-opacity-30 transition text-sm"
              >
                Today
              </button>
              <button 
                onClick={goToNextMonth}
                className="p-2 bg-white bg-opacity-20 text-white rounded hover:bg-opacity-30 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          { }
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-gray-600 font-medium">
                {day}
              </div>
            ))}
          </div>
          
          { }
          <div className="grid grid-cols-7">
            {renderCalendar()}
          </div>
        </div>
        
        { }
        {selectedDate && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {format(selectedDate, 'MMMM d, yyyy')}
              </h2>
              <span className="text-sm text-gray-500">
                {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {selectedEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedEvents.map(event => {
                  const hasConflict = conflictingEvents.includes(event.id);
                  
                  return (
                    <div 
                      key={event.id} 
                      className={`p-3 rounded-lg border ${hasConflict ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium">{event.title}</h3>
                        {hasConflict && (
                          <span className="text-xs text-red-500 font-medium px-2 py-1 bg-red-100 rounded-full">
                            Time Conflict
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {event.time} • {event.duration} minutes
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No events scheduled for this day.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
