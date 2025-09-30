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
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false); // Add dark mode state
  const queryClient = useQueryClient();

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
  }, []);

  // Save dark mode preference to localStorage
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

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

  // Filter reminders based on search term
  const filteredReminders = reminders.filter(reminder => 
    reminder.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-purple-100 to-blue-100'
      } flex items-center justify-center`}>
        <div className="text-center">
          <div className={`text-2xl font-bold mb-4 ${
            isDarkMode ? 'text-blue-300' : 'text-blue-700'
          }`}>
            Loading...
          </div>
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
            isDarkMode ? 'border-blue-300' : 'border-blue-700'
          } mx-auto`}></div>
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
          isDarkMode={isDarkMode}
        />
      );
    }
    
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToSignup={() => setShowSignup(true)}
        isDarkMode={isDarkMode}
      />
    );
  }

  // Show main app if authenticated
  if (remindersLoading) return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-purple-100 to-blue-100'
    } flex items-center justify-center`}>
      <div className="text-center">
        <div className={`text-2xl font-bold mb-4 ${
          isDarkMode ? 'text-blue-300' : 'text-blue-700'
        }`}>
          Loading reminders...
        </div>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
          isDarkMode ? 'border-blue-300' : 'border-blue-700'
        } mx-auto`}></div>
      </div>
    </div>
  );
  
  if (remindersError) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-purple-100 to-blue-100'
      } flex items-center justify-center`}>
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
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-purple-100 to-blue-100'
    } flex items-center justify-center p-4`}>
      <div className={`w-full max-w-md rounded-3xl shadow-2xl p-6 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-blue-300' : 'text-blue-700'
          }`}>
            Habit Tracker
          </h1>
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
              }`}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleLogout}
              className={`px-4 py-2 text-sm rounded-lg transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
            >
              Logout
            </button>
          </div>
        </div>

        {user && (
          <div className={`text-center mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Welcome, {user.name}!
          </div>
        )}

        {/* Search Input with Clear Button */}
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search reminders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              ✕
            </button>
          )}
        </div>

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
          isDarkMode={isDarkMode}
        />

        <ReminderList
          reminders={filteredReminders}
          onDelete={handleDelete}
          onToggleDone={handleToggleDone}
          searchTerm={searchTerm}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
}

export default App;