import React from "react";

const ReminderItem = ({ reminder, onToggleDone, onDelete }) => {
  // Priority color mapping
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'medium':
        return 'border-l-4 border-orange-500 bg-orange-50';
      case 'low':
        return 'border-l-4 border-yellow-500 bg-yellow-50';
      default:
        return 'border-l-4 border-gray-300 bg-gray-50';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      default:
        return 'No Priority';
    }
  };

  const getRepeatText = (repeat) => {
    switch (repeat) {
      case 'daily':
        return 'Repeats Daily';
      case 'weekly':
        return 'Repeats Weekly';
      case 'monthly':
        return 'Repeats Monthly';
      case 'yearly':
        return 'Repeats Yearly';
      default:
        return '';
    }
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const isOverdue = date < now && !reminder.completed;
    
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Check if it's set to end of day (date-only reminder)
    const isEndOfDay = date.getHours() === 23 && date.getMinutes() === 59;
    
    return (
      <div className={`text-xs mt-1 ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
        {dateStr}
        {!isEndOfDay && ` at ${timeStr}`}
        {isOverdue && <span className="ml-1">(OVERDUE)</span>}
      </div>
    );
  };

  return (
    <div
      className={`flex items-center p-4 rounded-xl shadow hover:shadow-lg transition duration-200 ${getPriorityColor(reminder.priority)} ${
        reminder.completed ? "opacity-60" : ""
      }`}
    >
      {/* iOS-style Checkbox */}
      <div className="flex-shrink-0 mr-4">
        <button
          onClick={() => onToggleDone(reminder)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
            reminder.completed
              ? 'bg-blue-500 border-blue-500 text-white'
              : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          {reminder.completed && (
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Reminder Content */}
      <div className="flex-1">
        <div className={`text-lg font-medium ${reminder.completed ? 'line-through text-gray-400' : ''}`}>
          {reminder.title}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {getPriorityText(reminder.priority)}
          {reminder.repeat && reminder.repeat !== 'none' && (
            <span className="ml-2 text-blue-600">• {getRepeatText(reminder.repeat)}</span>
          )}
        </div>
        {formatDateTime(reminder.date)}
      </div>
      
      {/* Delete Button */}
      <div className="flex-shrink-0 ml-2">
        <button
          onClick={() => onDelete(reminder._id)}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition duration-200"
          title="Delete reminder"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ReminderItem;