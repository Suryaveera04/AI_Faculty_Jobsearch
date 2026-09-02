'use client';

import React, { useState } from 'react';
import { Application, InterviewSlot } from '@/types';
import { StorageService } from '@/lib/storage';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Link as LinkIcon, 
  CheckCircle2, 
  X 
} from 'lucide-react';

interface InterviewScheduleModalProps {
  application: Application | null;
  onClose: () => void;
  onScheduled?: () => void;
}

export default function InterviewScheduleModal({
  application,
  onClose,
  onScheduled,
}: InterviewScheduleModalProps) {
  const [date, setDate] = useState('2026-09-15');
  const [time, setTime] = useState('11:00 AM IST');
  const [platform, setPlatform] = useState<InterviewSlot['platform']>('In-Person (Campus Selection Board Room)');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/acad-sel-board');
  const [roomVenue, setRoomVenue] = useState('Main Administrative Building, Senate Board Room, Campus');
  const [committeeMembers, setCommitteeMembers] = useState('Dean of Faculty Affairs, Head of Department, External Subject Expert (IIT/IISc), VC Nominee');
  const [instructions, setInstructions] = useState('Please prepare a 35-minute presentation: 20 min on research and 15 min on pedagogical teaching plan.');
  const [submitting, setSubmitting] = useState(false);

  if (!application) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const slot: InterviewSlot = {
      date,
      time,
      platform,
      meetingLink: platform !== 'In-Person (Campus Selection Board Room)' ? meetingLink : undefined,
      roomVenue: platform === 'In-Person (Campus Selection Board Room)' ? roomVenue : undefined,
      committeeMembers: committeeMembers.split(',').map(m => m.trim()),
      instructions,
    };

    StorageService.scheduleInterview(application.id, slot);

    setTimeout(() => {
      setSubmitting(false);
      if (onScheduled) onScheduled();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-slate-800 shadow-2xl animate-in zoom-in-95 my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                <Calendar className="w-5 h-5" />
              </span>
              <h3 className="font-serif font-bold text-slate-900 text-lg sm:text-xl">
                Schedule Selection Colloquium
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Candidate: <strong className="text-slate-900">{application.candidateName}</strong> • {application.jobTitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Schedule Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" /> Date:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-600" /> Time Slot:
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 11:00 AM IST"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Interview Platform / Format:</label>
            <select
              value={platform}
              onChange={(e: any) => setPlatform(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
            >
              <option value="In-Person (Campus Selection Board Room)">In-Person (Campus Selection Board Room)</option>
              <option value="Google Meet">Google Meet (Virtual Colloquium)</option>
              <option value="Microsoft Teams">Microsoft Teams</option>
              <option value="Zoom">Zoom</option>
            </select>
          </div>

          {platform === 'In-Person (Campus Selection Board Room)' ? (
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-crimson-600" /> Campus Room &amp; Building:
              </label>
              <input
                type="text"
                value={roomVenue}
                onChange={(e) => setRoomVenue(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          ) : (
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <LinkIcon className="w-3.5 h-3.5 text-brand-600" /> Meeting Link:
              </label>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-brand-600" /> Selection Committee Members:
            </label>
            <input
              type="text"
              value={committeeMembers}
              onChange={(e) => setCommitteeMembers(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Candidate Instructions &amp; Presentation Format:</label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">
              Notification &amp; Calendar invites dispatched instantly.
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                {submitting ? 'Dispatching Invites...' : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Confirm &amp; Schedule
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
