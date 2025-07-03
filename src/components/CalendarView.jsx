import React, { useState, useEffect, useRef } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventForm from './EventForm';
import RSVPModal from './RSVPModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const initialEvents = [
  {
    title: 'Sample Event',
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000),
    allDay: false,
    description: '',
    location: '',
  },
];

const LOCAL_KEY = 'eventify_events';

const CalendarView = () => {
  const [events, setEvents] = useState(initialEvents);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpEvent, setRsvpEvent] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuEvent, setMenuEvent] = useState(null);
  const notificationTimeouts = useRef([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      try {
        setEvents(JSON.parse(stored).map(e => ({ ...e, start: new Date(e.start), end: new Date(e.end) })));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    if (Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    // Clear previous timeouts
    notificationTimeouts.current.forEach(clearTimeout);
    notificationTimeouts.current = [];
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now = Date.now();
    events.forEach(event => {
      if (!event.start) return;
      const start = new Date(event.start).getTime();
      const diff = start - now - 60000; // 1 min before
      if (diff > 0) {
        const timeout = setTimeout(() => {
          new Notification(`Upcoming: ${event.title}`, {
            body: event.description || 'Event starts soon!',
          });
        }, diff);
        notificationTimeouts.current.push(timeout);
      }
    });
    return () => notificationTimeouts.current.forEach(clearTimeout);
  }, [events]);

  const handleSelectSlot = ({ start, end }) => {
    setFormData({ start, end });
    setFormOpen(true);
    setEditingIndex(null);
  };

  const handleSelectEvent = (event) => {
    setMenuEvent(event);
    setMenuOpen(true);
  };

  const handleMenuAction = (action) => {
    setMenuOpen(false);
    if (action === 'edit') {
      const idx = events.findIndex(e => e === menuEvent);
      setEditingIndex(idx);
      setFormData(menuEvent);
      setFormOpen(true);
    } else if (action === 'rsvp') {
      setRsvpEvent(menuEvent);
      setRsvpOpen(true);
    }
    setMenuEvent(null);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
    setMenuEvent(null);
  };

  const handleSave = (event) => {
    if (editingIndex !== null) {
      // Update existing event
      const updated = [...events];
      updated[editingIndex] = event;
      setEvents(updated);
    } else {
      // Add new event
      setEvents([...events, event]);
    }
    setFormOpen(false);
    setFormData(null);
    setEditingIndex(null);
  };

  const handleCancel = () => {
    setFormOpen(false);
    setFormData(null);
    setEditingIndex(null);
  };

  const handleRSVP = (status) => {
    setEvents(events.map(e => e === rsvpEvent ? { ...e, rsvp: status } : e));
    setRsvpOpen(false);
    setRsvpEvent(null);
  };

  const handleRSVPClose = () => {
    setRsvpOpen(false);
    setRsvpEvent(null);
  };

  // CSV export
  const exportCSV = () => {
    const headers = ['Title', 'Start', 'End', 'Description', 'Location', 'RSVP'];
    const rows = events.map(e => [
      e.title,
      e.start ? new Date(e.start).toLocaleString() : '',
      e.end ? new Date(e.end).toLocaleString() : '',
      e.description || '',
      e.location || '',
      e.rsvp || '',
    ]);
    const csv = [headers, ...rows].map(row => row.map(field => '"' + String(field).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // PDF export
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Eventify Events', 14, 16);
    const headers = [['Title', 'Start', 'End', 'Description', 'Location', 'RSVP']];
    const rows = events.map(e => [
      e.title,
      e.start ? new Date(e.start).toLocaleString() : '',
      e.end ? new Date(e.end).toLocaleString() : '',
      e.description || '',
      e.location || '',
      e.rsvp || '',
    ]);
    doc.autoTable({ head: headers, body: rows, startY: 22 });
    doc.save('events.pdf');
  };

  // RSVP counts helper
  const getRSVPSummary = (event) => {
    if (!event.rsvp) return '';
    if (event.rsvp === 'yes') return '✅';
    if (event.rsvp === 'maybe') return '🤔';
    if (event.rsvp === 'no') return '❌';
    return '';
  };

  return (
    <div className="p-2 bg-white rounded shadow">
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '1em' }}>
        <button onClick={exportCSV} className="export-btn">Export CSV</button>
        <button onClick={exportPDF} className="export-btn">Export PDF</button>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={event => ({
          className: '',
          style: {
            backgroundColor: event.rsvp === 'yes' ? '#4ade80' : event.rsvp === 'maybe' ? '#facc15' : event.rsvp === 'no' ? '#f87171' : '#6366f1',
            color: '#222',
            borderRadius: '8px',
            border: 'none',
            padding: '2px 6px',
            fontWeight: 600,
            fontSize: '1em',
          },
        })}
        components={{
          event: ({ event }) => (
            <span>
              {event.title} <span className="ml-1">{getRSVPSummary(event)}</span>
            </span>
          ),
        }}
      />
      <EventForm open={formOpen} eventData={formData} onSave={handleSave} onCancel={handleCancel} />
      <RSVPModal open={rsvpOpen} event={rsvpEvent} onRSVP={handleRSVP} onClose={handleRSVPClose} />
      {/* Menu modal for RSVP or Edit */}
      {menuOpen && menuEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-xs text-center">
            <h3 className="text-lg font-bold mb-4">What would you like to do?</h3>
            <div className="flex flex-col gap-3 mb-4">
              <button onClick={() => handleMenuAction('edit')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Edit Event</button>
              <button onClick={() => handleMenuAction('rsvp')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">RSVP</button>
            </div>
            <button onClick={handleMenuClose} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView; 