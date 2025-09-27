import React from "react";

const ReminderForm = ({ title, setTitle, onAdd }) => {
  return (
    <form
      onSubmit={onAdd}
      className="flex mb-6 gap-3 bg-white p-4 rounded-xl shadow-md"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new habit..."
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="px-5 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-200"
      >
        Add
      </button>
    </form>
  );
};

export default ReminderForm;
