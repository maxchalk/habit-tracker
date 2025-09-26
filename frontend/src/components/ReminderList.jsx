// frontend/src/components/ReminderList.jsx
import ReminderItem from "./ReminderItem";

function ReminderList({ reminders, onDelete, onToggleDone }) {
  if (reminders.length === 0) {
    return <p className="text-gray-500">No reminders yet.</p>;
  }

  return (
    <div className="space-y-2">
      {reminders.map((reminder) => (
        <ReminderItem
          key={reminder._id}
          reminder={reminder}
          onDelete={onDelete}
          onToggleDone={onToggleDone}
        />
      ))}
    </div>
  );
}

export default ReminderList;
