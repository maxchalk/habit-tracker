import React from "react";
import ReminderItem from "./ReminderItem";

const ReminderList = ({ reminders, onToggleDone, onDelete }) => {
  if (!reminders || reminders.length === 0)
    return <p className="text-gray-500 text-center">No reminders yet</p>;

  return (
    <div className="space-y-3">
      {reminders.map((reminder) => (
        <ReminderItem
          key={reminder._id}
          reminder={reminder}
          onToggleDone={onToggleDone}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ReminderList;
