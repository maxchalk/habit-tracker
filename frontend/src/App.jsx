// frontend/src/App.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import ReminderList from "./components/ReminderList";
import ReminderItem from "./components/ReminderItem";

function App() {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState("");

  const API_URL = "http://localhost:5000/api/reminders";

  // Fetch reminders from backend
  const fetchReminders = async () => {
    try {
      const res = await axios.get(API_URL);
      setReminders(res.data);
    } catch (err) {
      console.error("Error fetching reminders:", err);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  // Add a new reminder
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
      const res = await axios.post(API_URL, { title, date: new Date() });
      setReminders((prev) => [...prev, res.data]);
      setTitle(""); // reset input
    } catch (err) {
      console.error("Error adding reminder:", err);
    }
  };

  // Delete a reminder
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setReminders((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting reminder:", err);
    }
  };

  // Toggle reminder as done/undone
  const handleToggleDone = async (reminder) => {
    try {
      const res = await axios.put(`${API_URL}/${reminder._id}`, {
        completed: !reminder.completed,
      });
      setReminders((prev) =>
        prev.map((r) => (r._id === reminder._id ? res.data : r))
      );
    } catch (err) {
      console.error("Error updating reminder:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Habit Tracker</h1>
      <form onSubmit={handleAdd} className="flex mb-4 space-x-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a reminder..."
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      <ReminderList
        reminders={reminders}
        onDelete={handleDelete}
        onToggleDone={handleToggleDone}
      />
    </div>
  );
}

export default App;
