import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReminderList from "./components/ReminderList";
import ReminderForm from "./components/ReminderForm";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { reminderAPI } from "./services/api";
import { authAPI, tokenManager } from "./services/auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [repeat, setRepeat] = useState("none");
  const queryClient = useQueryClient();

  // Handle logout - moved up to avoid temporal dead zone
  const handleLogout = () => {
    tokenManager.removeToken();
    setUser(null);
    setIsAuthenticated(false);
    queryClient.clear(); // Clear all cached data
  };

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = () => {
      const token = tokenManager.getToken();
      if (token) {
        setIsAuthenticated(true);
        // Don't fetch reminders here - let the useQuery handle it
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Fetch reminders (only when authenticated)
  const { data: reminders = [], isLoading: remindersLoading, error: remindersError } = useQuery({
    queryKey: ['reminders'],
    queryFn: reminderAPI.getReminders,
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: false, // Don't retry on auth errors
    onError: (error) => {
      console.error('Reminders fetch error:', error);
      // If we get an auth error, logout the user
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  });

  // Create reminder mutation
  const createMutation = useMutation({
    mutationFn: reminderAPI.createReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      setTitle("");
      setPriority("low");
      setDueDate("");
      setDueTime("");
      setRepeat("none");
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

  // Handle login
  const handleLogin = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      console.log('Login response:', response);
      console.log('Token received:', response.token);
      
      tokenManager.setToken(response.token);
      console.log('Token saved to localStorage');
      
      setUser(response.user);
      setIsAuthenticated(true);
      console.log('User state updated, isAuthenticated:', true);
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw to let Login component handle it
    }
  };

  // Handle signup (now just shows success, doesn't auto-login)
  const handleSignup = async (userData) => {
    await authAPI.register(userData);
    // Don't auto-login, just show success message
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title) return;
    
    // Create date object from date and time
    let dateTime = new Date();
    
    if (dueDate) {
      // Parse the date string properly to avoid timezone issues
      const [year, month, day] = dueDate.split('-');
      dateTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      if (dueTime) {
        // If time is provided, set the specific time
        const [hours, minutes] = dueTime.split(':');
        dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      } else {
        // If no time is provided, set to end of day (23:59) so it's not overdue
        dateTime.setHours(23, 59, 0, 0);
      }
    } else {
      // If no date is provided, use current date/time
      dateTime = new Date();
    }
    
    createMutation.mutate({
      title,
      date: dateTime,
      priority,
      repeat,
      completed: false,
    });
  };

  const handleDelete = async (id) => {
    deleteMutation.mutate(id);
  };

  const handleToggleDone = async (reminder) => {
    toggleMutation.mutate(reminder._id);
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-700 mb-4">Loading...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show login/signup forms if not authenticated
  if (!isAuthenticated) {
    if (showSignup) {
      return (
        <Signup
          onSignup={handleSignup}
          onSwitchToLogin={() => setShowSignup(false)}
        />
      );
    }
    
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToSignup={() => setShowSignup(true)}
      />
    );
  }

  // Show main app if authenticated
  if (remindersLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-700 mb-4">Loading reminders...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
      </div>
    </div>
  );
  
  if (remindersError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-center text-red-500">
          <div className="text-2xl font-bold mb-4">Error loading reminders</div>
          <div className="mb-4">
            <strong>Status:</strong> {remindersError.response?.status || 'Unknown'}<br/>
            <strong>Message:</strong> {remindersError.message}<br/>
            <strong>Details:</strong> {remindersError.response?.data?.message || 'No details available'}
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout and try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">
            Habit Tracker
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Logout
          </button>
        </div>

        {user && (
          <div className="text-center text-gray-600 mb-4">
            Welcome, {user.name}!
          </div>
        )}

        <ReminderForm 
          title={title} 
          setTitle={setTitle} 
          priority={priority}
          setPriority={setPriority}
          dueDate={dueDate}
          setDueDate={setDueDate}
          dueTime={dueTime}
          setDueTime={setDueTime}
          repeat={repeat}
          setRepeat={setRepeat}
          onAdd={handleAdd} 
        />

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