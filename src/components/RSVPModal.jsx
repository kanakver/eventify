import React from 'react';

const RSVPModal = ({ open, event, onRSVP, onClose }) => {
  if (!open || !event) return null;

  // RSVP counts (for demo, just show current RSVP)
  const rsvpStatus = event.rsvp ? event.rsvp.charAt(0).toUpperCase() + event.rsvp.slice(1) : 'None';

  return (
    <div className="modal-bg">
      <div className="modal">
        <h2 style={{marginBottom: '1em', fontSize: '1.3em', fontWeight: 700}}>RSVP for: {event.title}</h2>
        <p style={{marginBottom: '0.5em'}}>{event.description}</p>
        <p style={{marginBottom: '1em', color: 'var(--primary)'}}>{event.location}</p>
        <div style={{marginBottom: '1em', fontWeight: 600}}>
          Your RSVP: <span>{rsvpStatus}</span>
        </div>
        <div className="form-actions">
          <button onClick={() => onRSVP('yes')} className="btn">Yes</button>
          <button onClick={() => onRSVP('maybe')} className="btn secondary">Maybe</button>
          <button onClick={() => onRSVP('no')} className="btn secondary">No</button>
        </div>
        <div className="form-actions">
          <button onClick={onClose} className="btn secondary">Close</button>
        </div>
      </div>
    </div>
  );
};

export default RSVPModal; 