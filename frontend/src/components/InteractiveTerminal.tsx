'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTelemetryStore } from '@/store/telemetryStore';
import confetti from 'canvas-confetti';

interface TermLine {
  text: string;
  type: 'prompt' | 'output' | 'error' | 'success' | 'accent' | 'secondary';
  cmd?: string;
}

export default function InteractiveTerminal() {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [inputVal, setInputVal] = useState('');
  const [lines, setLines] = useState<TermLine[]>([
    { text: "AN.SYSTEMS [Version 2.0.4] Core Initialize...", type: 'success' },
    { text: "Terminal ready. Type 'help' to see active commands.", type: 'output' },
    { text: "──────────────────────────────────────────────", type: 'output' },
  ]);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const trackAction = useTelemetryStore((state) => state.trackAction);

  const commandResponses: Record<string, { lines: string[]; type: TermLine['type'] }> = {
    help: {
      type: 'accent',
      lines: [
        'Available commands:',
        '  about      ➔ Detail developer profile',
        '  skills     ➔ Tech stack & tool metrics',
        '  experience ➔ Commercial work chronology',
        '  projects   ➔ Featured engineering systems',
        '  contact    ➔ Direct communication details',
        '  resume     ➔ Download technical PDF CV',
        '  clear      ➔ Wipe terminal buffer history',
        '  easteregg  ➔ 🎯 Trigger hidden routine'
      ]
    },
    about: {
      type: 'success',
      lines: [
        'Name     : Abhinandan Naik',
        'Role     : Full-Stack Software Engineer',
        'Employer : Digit Insurance (Motor Insurance Division)',
        'Degree   : BE (Hons.) Information Science & Engineering',
        'Focus    : Scalable backend APIs, database tuning, and GenAI integrations',
        'Languages: English, Hindi, Kannada',
        'Status   : Open to full-stack software engineering engagements 🚀'
      ]
    },
    skills: {
      type: 'accent',
      lines: [
        'Backend  : Java, Spring Boot, Microservices, Security, REST APIs',
        'Database : PostgreSQL, MySQL, Redis, DBeaver database tuning',
        'DevOps   : Kubernetes, Bitbucket, Jenkins CI/CD, Dynatrace validation',
        'Frontend : Next.js, Supabase, TypeScript, React, TailwindCSS'
      ]
    },
    experience: {
      type: 'secondary',
      lines: [
        '[July 2025 - Present] Software Engineer @ Digit Insurance',
        '  ➔ Architected scalable backend APIs for Motor Loader & Single Page modules',
        '  ➔ Implemented Redis caching for bulk policy and payment processing',
        '  ➔ Tuned complex database schemas in PostgreSQL to ensure integrity',
        '  ➔ Automated deployment via Bitbucket & Jenkins, microservices in Kubernetes',
        '  ➔ Monitored endpoints using Dynatrace and contributed to Agentic AI automation'
      ]
    },
    projects: {
      type: 'success',
      lines: [
        '1. FlowSync ➔ AI-Powered Kanban Board (Next.js, Supabase, State Sync, AI Workflow)',
        '2. FlashPoll ➔ Real-Time Voting Platform (Node.js, Express, Socket.io, Sessions)',
        '3. Smart-Bin ➔ IoT Waste Manager (ESP8266, Sensor dashboard, Route optimization)'
      ]
    },
    contact: {
      type: 'accent',
      lines: [
        'Primary Email : abhinandannaik1717@gmail.com',
        'LinkedIn Profile: linkedin.com/in/abhinandan-naik',
        'GitHub Page    : github.com/abhinandan-naik',
        'Availability   : ● ACTIVE FOR INTERVIEWS'
      ]
    },
    resume: {
      type: 'success',
      lines: [
        'Assembling technical credentials...',
        '✓ Packaging latest database telemetry...',
        '✓ Compiling PDF binary stream...',
        '➔ Download initiated: Abhinandan_Naik_Resume.pdf 📄'
      ]
    },
    easteregg: {
      type: 'secondary',
      lines: [
        '  ╔══════════════════════════════════════════════╗',
        '  ║         EASTER EGG COMPILE SUCCESS 🎉        ║',
        '  ║                                              ║',
        '  ║   "Java is to JavaScript as car is to      ║',
        '  ║    carpet." - Chris Heilmann                 ║',
        '  ║                                              ║',
        '  ║   Spring != Spring Boot                      ║',
        '  ║   Docker != VM (Virtual Machine)             ║',
        '  ╚══════════════════════════════════════════════╝'
      ]
    }
  };

  // Scroll terminal to bottom on line update
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommand = (cmdText: string) => {
    const cmd = cmdText.trim().toLowerCase();
    if (!cmd) return;

    trackAction('TERMINAL_COMMAND', cmd);
    
    // Add command to history
    const newHistory = [...history, cmdText];
    setHistory(newHistory);
    setHistoryIdx(newHistory.length);

    // Print command prompt line
    const promptLine: TermLine = { text: `abhinandan@portfolio:~$`, type: 'prompt', cmd: cmdText };
    
    if (cmd === 'clear') {
      setLines([
        { text: 'Terminal buffer cleared. Ready for input.', type: 'accent' }
      ]);
      return;
    }

    if (cmd === 'easteregg') {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    if (cmd === 'resume') {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
      // Trigger actual resume PDF download
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = '/Abhinandan_Naik_Resume.pdf';
        link.download = 'Abhinandan_Naik_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 500);
    }

    const response = commandResponses[cmd];
    const newLines: TermLine[] = [];

    if (response) {
      response.lines.forEach((l) => {
        newLines.push({ text: l, type: response.type });
      });
    } else {
      newLines.push({
        text: `bash: ${cmd}: command not found. Type 'help' to review blueprints.`,
        type: 'error'
      });
    }

    setLines((prev) => [...prev, promptLine, ...newLines]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx < history.length - 1) {
        const nextIdx = historyIdx + 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      } else {
        setHistoryIdx(history.length);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion mapping
      const match = Object.keys(commandResponses).find((c) => c.startsWith(inputVal.trim().toLowerCase()));
      if (match) {
        setInputVal(match);
      }
    }
  };

  return (
    <section id="terminal-section" className="relative py-24 px-6 md:px-12 bg-bg max-w-6xl mx-auto w-full">
      <div className="text-accent font-mono text-xs tracking-widest uppercase mb-2">
        // Command Interface
      </div>
      <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-12">
        Interactive Terminal
      </h2>

      {/* Terminal Grid Container */}
      <div 
        className="w-full rounded-xl border border-accent/25 bg-[#07070B] overflow-hidden flex flex-col font-mono"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Header */}
        <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
            <span className="text-muted ml-3 text-[10px] tracking-wider uppercase select-none">abhinandan@naik-systems:~$</span>
          </div>
        </div>

        {/* Scrollable logs */}
        <div 
          ref={bodyRef}
          className="p-6 h-[260px] overflow-y-auto flex flex-col gap-1.5 text-xs text-muted/90 select-text"
        >
          {lines.map((line, idx) => {
            if (line.type === 'prompt') {
              return (
                <div key={idx} className="flex gap-2">
                  <span className="text-accent">{line.text}</span>
                  <span className="text-white font-bold">{line.cmd}</span>
                </div>
              );
            }
            return (
              <div 
                key={idx} 
                className="leading-relaxed"
                style={{ 
                  color: line.type === 'error' 
                    ? '#EF4444' 
                    : (line.type === 'success' 
                      ? '#22C55E' 
                      : (line.type === 'accent' 
                        ? '#00F5FF' 
                        : (line.type === 'secondary' ? '#8B5CF6' : 'inherit')))
                }}
              >
                {line.text}
              </div>
            );
          })}
        </div>

        {/* Terminal Input Line */}
        <div className="flex items-center gap-2 border-t border-white/5 px-6 py-3 bg-white/2">
          <span className="text-accent text-xs select-none">abhinandan@portfolio:~$</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-xs text-white caret-accent font-mono"
            placeholder="Type 'help' to review commands..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck="false"
          />
        </div>

      </div>
    </section>
  );
}
