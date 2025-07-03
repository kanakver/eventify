import React, { useState, useEffect } from 'react';

const initialForm = {
  title: '',
  start: '',
  end: '',
  description: '',
  location: '',
};

const EventForm = ({ open, eventData, onSave, onCancel }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (eventData) {
      setForm({
        title: eventData.title || '',
        start: eventData.start ? new Date(eventData.start).toISOString().slice(0,16) : '',
        end: eventData.end ? new Date(eventData.end).toISOString().slice(0,16) : '',
        description: eventData.description || '',
        location: eventData.location || '',
      });
    } else {
      setForm(initialForm);
    }
  }, [eventData, open]);

  if (!open) return null;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title || !form.start || !form.end) return;
    onSave({
      ...form,
      start: new Date(form.start),
      end: new Date(form.end),
    });
  };

  return (
    <div className="modal-bg">
      <form className="modal" onSubmit={handleSubmit}>
        <h2 style={{marginBottom: '1.5em', fontSize: '1.5em', fontWeight: 700}}> {eventData ? 'Edit Event' : 'Add Event'} </h2>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label className="form-label">Start</label>
          <input type="datetime-local" name="start" value={form.start} onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label className="form-label">End</label>
          <input type="datetime-local" name="end" value={form.end} onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="form-textarea" />
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input name="location" value={form.location} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn secondary">Cancel</button>
          <button type="submit" className="btn">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EventForm; 