import { useState } from "react";

const ReminderCard = ({ reminder, onDelete, onToggleDone, searchTerm = "", isDarkMode = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Function to highlight search term
  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className={`px-1 rounded transition-colors duration-300 ${
          isDarkMode ? 'bg-yellow-600 text-yellow-100' : 'bg-yellow-200 text-yellow-900'
        }`}>
          {part}
        </mark>
      ) : part
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const reminderDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (reminderDate.getTime() === today.getTime()) {
      return "Today";
    } else if (reminderDate.getTime() === today.getTime() + 86400000) {
      return "Tomorrow";
    } else if (reminderDate.getTime() === today.getTime() - 86400000) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Only show time if it's not set to end of day (23:59)
    if (date.getHours() === 23 && date.getMinutes() === 59) {
      return null; // Don't show time for end-of-day reminders
    }
    return time;
  };

  const isOverdue = (dateString) => {
    if (!dateString || reminder.completed) return false;
    
    const reminderDate = new Date(dateString);
    const now = new Date();
    
    // Debug: Show the actual comparison
    console.log(`🔍 OVERDUE: ${reminder.title} | Reminder: ${reminderDate.toLocaleString()} | Now: ${now.toLocaleString()} | Past: ${reminderDate < now}`);
    
    return reminderDate < now;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return isDarkMode ? "border-l-red-400" : "border-l-red-500";
      case "medium":
        return isDarkMode ? "border-l-orange-400" : "border-l-orange-500";
      case "low":
        return isDarkMode ? "border-l-yellow-400" : "border-l-yellow-500";
      default:
        return isDarkMode ? "border-l-gray-500" : "border-l-gray-500";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "high":
        return "High Priority";
      case "medium":
        return "Medium Priority";
      case "low":
        return "Low Priority";
      default:
        return "No Priority";
    }
  };

  const getRepeatText = (repeat) => {
    switch (repeat) {
      case "daily":
        return "Every day";
      case "weekly":
        return "Every week";
      case "monthly":
        return "Every month";
      case "yearly":
        return "Every year";
      case "none":
        return "No repeat";
      default:
        return repeat;
    }
  };

  return (
    <div
      className={`rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all duration-200 ${
        reminder.completed ? "opacity-60" : ""
      } ${
        isOverdue(reminder.date)
          ? `border-l-red-600 ${isDarkMode ? 'bg-red-900 hover:bg-red-800' : 'bg-red-100 hover:bg-red-200 border-red-200'}` 
          : `${getPriorityColor(reminder.priority)} ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* iOS-style checkbox */}
            <button
              onClick={() => onToggleDone(reminder)}
              className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                reminder.completed
                  ? "bg-blue-500 border-blue-500"
                  : isDarkMode 
                    ? "border-gray-500 hover:border-blue-400" 
                    : "border-gray-300 hover:border-blue-400"
              }`}
            >
              {reminder.completed && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className={`text-lg font-medium transition-colors duration-300 ${
                reminder.completed 
                  ? "line-through text-gray-500" 
                  : isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}>
                {highlightText(reminder.title, searchTerm)}
              </div>
              
              <div className={`text-sm mt-1 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <div className="flex items-center space-x-2">
                  <span>{formatDate(reminder.date)}</span>
                  {formatTime(reminder.date) && (
                    <>
                      <span>•</span>
                      <span>{formatTime(reminder.date)}</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 mt-1">
                  {isOverdue(reminder.date) && !reminder.completed && (
                    <>
                      <span>•</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        isDarkMode 
                          ? 'bg-red-900/30 text-red-300' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        Overdue
                      </span>
                    </>
                  )}
                  
                  <span className={`px-2 py-1 text-xs rounded-full transition-colors duration-300 ${
                    reminder.priority === "high" 
                      ? isDarkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-700"
                    : reminder.priority === "medium" 
                      ? isDarkMode ? "bg-orange-900 text-orange-300" : "bg-orange-100 text-orange-700"
                    : isDarkMode ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {getPriorityText(reminder.priority)}
                  </span>
                  
                  {reminder.repeat !== "none" && (
                    <span className={`px-2 py-1 text-xs rounded-full transition-colors duration-300 ${
                      isDarkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-700"
                    }`}>
                      {getRepeatText(reminder.repeat)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Delete button */}
          {isHovered && (
            <button
              onClick={() => onDelete(reminder._id)}
              className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;
