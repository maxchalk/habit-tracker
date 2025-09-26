import { useState } from "react"

function ReminderForm({ onAdd }) {
  const [text, setText] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text)   // send new reminder up to parent
    setText("")   // clear input
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input 
        type="text" 
        placeholder="Add a new reminder..." 
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border rounded px-2 py-1 flex-1"
      />
      <button 
        type="submit" 
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Add
      </button>
    </form>
  )
}

export default ReminderForm
