import { useState } from 'react';
import CalendarView from './components/CalendarView';
import EventForm from './components/EventForm';
import './styles.css';

function App() {
  const [dark, setDark] = useState(false);

  // Toggle theme
  const toggleTheme = () => {
    setDark(d => {
      document.body.classList.toggle('dark', !d);
      return !d;
    });
  };

  return (
    <div className="app-container">
      <button className="theme-toggle" onClick={toggleTheme}>
        {dark ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
      <h1>Eventify – Advanced Event Scheduler</h1>
      <CalendarView />
    </div>
  );
}

export default App;
