import React from "react";

const ReminderItem = ({ reminder, onToggleDone, onDelete }) => {
  return (
    <div
      className={`flex justify-between items-center p-4 rounded-xl shadow hover:shadow-lg transition duration-200 ${
        reminder.completed ? "bg-green-100 line-through text-gray-400" : "bg-white"
      }`}
    >
      <span className="text-lg font-medium">{reminder.title}</span>
      <div className="flex gap-2">
        <button
          onClick={() => onToggleDone(reminder)}
          className={`px-4 py-2 rounded-lg text-white font-semibold transition duration-200 ${
            reminder.completed ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {reminder.completed ? "Undo" : "Done"}
        </button>
        <button
          onClick={() => onDelete(reminder._id)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ReminderItem;
