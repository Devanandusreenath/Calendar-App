import React, { useState, useEffect } from 'react';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, isSameDay, isToday, parseISO, isSameMonth
} from 'date-fns';
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
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    duration: '',
    color: 'bg-blue-500'
  });

  useEffect(() => {
    setEvents(mockEvents);
  }, []);

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedEvents(events.filter(e => isSameDay(parseISO(e.date), date)));
  };

  const handleAddEvent = () => {
    setNewEvent({
      title: '',
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      time: '',
      duration: '',
      color: 'bg-blue-500'
    });
    setShowModal(true);
  };

  const saveNewEvent = () => {
    const id = events.length + 1;
    setEvents([...events, { ...newEvent, id }]);
    setShowModal(false);

    if (selectedDate && isSameDay(parseISO(newEvent.date), selectedDate)) {
      setSelectedEvents([...selectedEvents, { ...newEvent, id }]);
    }
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: endOfMonth(monthStart) });
    const emptyDays = Array.from({ length: monthStart.getDay() }, (_, i) => (
      <div key={`empty-${i}`} className="p-2 border border-gray-200"></div>
    ));

    return [...emptyDays, ...days.map(day => {
      const dayEvents = events.filter(e => isSameDay(parseISO(e.date), day));
      const isTodayFlag = isToday(day);
      const isSelected = selectedDate && isSameDay(day, selectedDate);
      const isCurrentMonthFlag = isSameMonth(day, currentDate);

      return (
        <div
          key={day.toString()}
          onClick={() => handleDateClick(day)}
          className={`p-2 border min-h-24 relative cursor-pointer
            ${isTodayFlag ? 'bg-blue-100' : ''}
            ${isSelected ? 'ring-2 ring-blue-500' : ''}
            ${isCurrentMonthFlag ? '' : 'text-gray-400'}
          `}
        >
          <div className={`text-sm font-medium ${isTodayFlag ? 'text-blue-600 font-bold' : ''}`}>
            {format(day, 'd')}
          </div>
          <div className="mt-1">
            {dayEvents.slice(0, 3).map(event => (
              <div key={event.id} className={`text-xs text-white p-1 mb-1 rounded truncate ${event.color}`}>
                {event.time} {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500">+{dayEvents.length - 3} more</div>
            )}
          </div>
        </div>
      );
    })];
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h1>
            <div className="flex space-x-3">
              <button onClick={goToPreviousMonth} className="px-4 py-2 bg-white bg-opacity-30 text-white rounded-md hover:bg-opacity-50 transition font-medium shadow-sm">‹</button>
              <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-white bg-opacity-30 text-white rounded-md hover:bg-opacity-50 transition font-medium shadow-sm">Today</button>
              <button onClick={goToNextMonth} className="px-4 py-2 bg-white bg-opacity-30 text-white rounded-md hover:bg-opacity-50 transition font-medium shadow-sm">›</button>
              <button onClick={handleAddEvent} className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-300 transition font-semibold shadow-sm">Add Event</button>
            </div>
          </div>

          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-gray-600 font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {renderCalendar()}
          </div>
        </div>

        {selectedDate && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{format(selectedDate, 'MMMM d, yyyy')}</h2>
              <span className="text-sm text-gray-500">
                {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''}
              </span>
            </div>
            {selectedEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedEvents.map(event => (
                  <div key={event.id} className="p-3 rounded-lg border border-gray-200">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{event.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {event.time} • {event.duration} minutes
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No events scheduled for this day.</p>
            )}
          </div>
        )}
      </div>

      { }
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Event</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={newEvent.title}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                value={newEvent.date}
                onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="time"
                value={newEvent.time}
                onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Duration in minutes"
                value={newEvent.duration}
                onChange={e => setNewEvent({ ...newEvent, duration: parseInt(e.target.value) || '' })}
                className="w-full p-2 border rounded"
              />
              <select
                value={newEvent.color}
                onChange={e => setNewEvent({ ...newEvent, color: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="bg-blue-500">Blue</option>
                <option value="bg-green-500">Green</option>
                <option value="bg-red-500">Red</option>
                <option value="bg-yellow-500">Yellow</option>
                <option value="bg-purple-500">Purple</option>
                <option value="bg-teal-500">Teal</option>
              </select>
              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button onClick={saveNewEvent} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

