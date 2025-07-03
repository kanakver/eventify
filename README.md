# 🗓️ Eventify – Advanced Event Scheduler & Reminder System

## Problem Statement
Coordinating events across teams or social groups is often messy—miscommunications, forgotten details, and lack of reminders lead to poor attendance and planning. There's a need for a lightweight, interactive, browser-based tool that simplifies event scheduling, RSVP tracking, and reminder management.

## Project Overview
Eventify is a modern event scheduler that offers an intuitive calendar interface to plan, edit, and track events. Users can RSVP, receive browser-based reminders, and export schedules in PDF or CSV formats. It’s designed to streamline collaboration for both individuals and small teams.

## Goals & Features
- Interactive Calendar UI
- Add/Edit/Delete Events (title, time, description, location)
- RSVP Tracking for Events
- Browser Notifications for Upcoming Events
- Export Schedules to CSV or PDF
- Responsive Design for All Devices

## Technical Stack
| Task                | Stack/Tech Used                                                 |
| ------------------- | --------------------------------------------------------------- |
| UI/UX               | Semantic HTML5, Tailwind CSS or Bootstrap 5                     |
| Calendar            | FullCalendar.js / React Big Calendar                            |
| State Management    | JavaScript (Vanilla or React)                                   |
| Notifications       | Web Notifications API + optional Service Worker                 |
| Export              | html2pdf.js, jsPDF, or SheetJS for CSV                          |
| Optional Backend    | Firebase Firestore for real-time sync (or localStorage for MVP) |

## Folder Structure
...