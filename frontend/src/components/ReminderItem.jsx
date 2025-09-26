// frontend/src/components/ReminderItem.jsx
function ReminderItem({ reminder, onDelete, onToggleDone }) {
  return (
    <div
      className={`flex items-center justify-between p-3 border rounded-md ${
        reminder.completed ? "bg-green-100 line-through" : "bg-white"
      }`}
    >
      <div className="flex-1">
        <h3 className="font-semibold">{reminder.title}</h3>
        {reminder.description && (
          <p className="text-gray-600 text-sm">{reminder.description}</p>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onToggleDone(reminder)}
          className={`px-2 py-1 rounded ${
            reminder.completed ? "bg-yellow-300" : "bg-green-300"
          }`}
        >
          {reminder.completed ? "Undo" : "Done"}
        </button>

        <button
          onClick={() => onDelete(reminder._id)}
          className="px-2 py-1 rounded bg-red-400 text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ReminderItem;
