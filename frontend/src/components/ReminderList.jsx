import ReminderCard from "./ReminderCard";

const ReminderList = ({ reminders, onDelete, onToggleDone, searchTerm = "", isDarkMode = false }) => {
  if (reminders.length === 0) {
    return (
      <div className={`text-center py-8 transition-colors duration-300 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <div className="text-6xl mb-4">📝</div>
        <div className="text-lg">No reminders yet</div>
        <div className="text-sm">Add your first reminder above!</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className={`text-sm mb-2 transition-colors duration-300 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {reminders.length} reminder{reminders.length !== 1 ? 's' : ''}
      </div>
      {reminders.map((reminder) => (
        <ReminderCard
          key={reminder._id}
          reminder={reminder}
          onDelete={onDelete}
          onToggleDone={onToggleDone}
          searchTerm={searchTerm}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
};

export default ReminderList;