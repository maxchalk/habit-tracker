import { useState } from "react"
import ReminderForm from "../components/ReminderForm"
import ReminderList from "../components/ReminderList"

function Home() {
  const [reminders, setReminders] = useState([
    "Drink Water 💧",
    "Exercise 🏋️"
  ])

  const addReminder = (text) => {
    setReminders([...reminders, text])
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Habit Tracker</h1>
      <ReminderForm onAdd={addReminder} />
      <ReminderList reminders={reminders} />
    </div>
  )
}

export default Home
