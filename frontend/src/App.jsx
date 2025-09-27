import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReminderList from "./components/ReminderList";
import ReminderForm from "./components/ReminderForm";
import { reminderAPI } from "./services/api";

function App() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  // Fetch reminders
  const { data: reminders = [], isLoading, error } = useQuery({
    queryKey: ['reminders'],
    queryFn: reminderAPI.getReminders,
  });

  // Create reminder mutation
  const createMutation = useMutation({
    mutationFn: reminderAPI.createReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      setTitle("");
    },
  });

  // Delete reminder mutation
  const deleteMutation = useMutation({
    mutationFn: reminderAPI.deleteReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  // Toggle reminder mutation
  const toggleMutation = useMutation({
    mutationFn: reminderAPI.toggleReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title) return;
    
    createMutation.mutate({
      title,
      date: new Date(),
      priority: "low",
      completed: false,
    });
  };

  const handleDelete = async (id) => {
    deleteMutation.mutate(id);
  };

  const handleToggleDone = async (reminder) => {
    toggleMutation.mutate(reminder._id);
  };

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Habit Tracker
        </h1>

        <ReminderForm title={title} setTitle={setTitle} onAdd={handleAdd} />

        <ReminderList
          reminders={reminders}
          onDelete={handleDelete}
          onToggleDone={handleToggleDone}
        />
      </div>
    </div>
  );
}

export default App;