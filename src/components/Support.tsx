import React from 'react';
import { HelpCircle, Mail, MessageSquare, FileQuestion, ExternalLink } from 'lucide-react';

export default function Support() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-4xl font-black text-on-surface font-headline tracking-tight">Support</h1>
        <p className="text-on-surface-variant font-medium mt-2">Get help and learn how to use Focused Curator</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
            <FileQuestion size={24} />
          </div>
          <h3 className="text-lg font-bold font-headline text-on-surface mb-2">Documentation</h3>
          <p className="text-sm text-on-surface-variant mb-4">Learn about all features and how to maximize your study efficiency.</p>
          <button className="flex items-center gap-2 text-primary text-sm font-bold hover:underline">
            Read Guide <ExternalLink size={14} />
          </button>
        </div>

        <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-4">
            <MessageSquare size={24} />
          </div>
          <h3 className="text-lg font-bold font-headline text-on-surface mb-2">Community</h3>
          <p className="text-sm text-on-surface-variant mb-4">Join other students to share tips, resources, and study strategies.</p>
          <button className="flex items-center gap-2 text-secondary text-sm font-bold hover:underline">
            Join Discord <ExternalLink size={14} />
          </button>
        </div>

        <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-surface-tint/10 rounded-2xl flex items-center justify-center text-surface-tint mb-4">
            <Mail size={24} />
          </div>
          <h3 className="text-lg font-bold font-headline text-on-surface mb-2">Contact Us</h3>
          <p className="text-sm text-on-surface-variant mb-4">Need personalized help? Our support team is here for you.</p>
          <button className="flex items-center gap-2 text-surface-tint text-sm font-bold hover:underline">
            Send Email <ExternalLink size={14} />
          </button>
        </div>
      </div>

      <section className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/20 shadow-sm">
        <h2 className="text-xl font-bold font-headline text-on-surface mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "How do I import my syllabus?", a: "Go to the 'Edital Vertical' tab and click on the 'Import .txt' button. Your file should follow the hierarchical numbering format (e.g., 1. Subject, 1.1 Topic, 1.1.1 Subtopic)." },
            { q: "Is my data saved automatically?", a: "Yes, all your progress, including syllabus status, mock tests, and study sessions, is saved locally in your browser automatically." },
            { q: "Can I use Focused Curator on multiple devices?", a: "Currently, data is stored locally on each device. We are working on a cloud sync feature for future updates." },
            { q: "How is mastery calculated?", a: "Mastery is based on the completion status of topics and subtopics within each subject, weighted by their hierarchical structure." }
          ].map((item, i) => (
            <div key={i} className="p-4 bg-surface-container-high rounded-2xl">
              <h4 className="font-bold text-on-surface mb-2">{item.q}</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
