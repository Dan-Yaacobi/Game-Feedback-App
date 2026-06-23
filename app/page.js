'use client';

import { useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

/* ── SVG motifs ── */
function BowSVG({ size = 48 }) {
  return (
    <svg
      className="bow-svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Bow curve */}
      <path
        d="M12 6 C4 16, 4 32, 12 42"
        stroke="#f0b429"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Bowstring */}
      <line x1="12" y1="6" x2="12" y2="42" stroke="#c99a2e" strokeWidth="1" strokeDasharray="3 2" />
      {/* Arrow shaft */}
      <line x1="12" y1="24" x2="40" y2="24" stroke="#e8eaf0" strokeWidth="1.5" strokeLinecap="round" />
      {/* Arrowhead */}
      <path d="M40 24 L34 20 L35 24 L34 28 Z" fill="#f0b429" />
      {/* Fletching */}
      <path d="M14 24 L11 20" stroke="#8892a4" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14 24 L11 28" stroke="#8892a4" strokeWidth="1.2" strokeLinecap="round" />
      {/* Draw indicator dot */}
      <circle cx="12" cy="24" r="2" fill="#f0b429" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <polyline points="6,14 12,20 22,9" stroke="#52c96a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Rating row component ── */
function RatingRow({ id, label, lowLabel, highLabel, value, onChange }) {
  return (
    <div className="rating-row">
      <span className="rating-label">{label}</span>
      <div className="rating-scale">
        <div className="rating-stars" role="group" aria-label={label}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`rating-star${value === n ? ' selected' : ''}`}
              onClick={() => onChange(n)}
              aria-label={`${n} out of 5`}
              aria-pressed={value === n}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="rating-endpoints">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Pill select ── */
function PillSelect({ options, value, onChange }) {
  return (
    <div className="pill-group" role="group">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`pill-btn${value === opt ? ' selected' : ''}`}
          onClick={() => onChange(opt)}
          aria-pressed={value === opt}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ── Bug entry ── */
function BugEntry({ index, data, onChange, onRemove, showRemove }) {
  return (
    <div className="bug-entry">
      <div className="bug-entry-header">
        <span className="bug-entry-number">Bug #{index + 1}</span>
        {showRemove && (
          <button type="button" className="remove-btn" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>

      <div className="field-row">
        <div>
          <label htmlFor={`cat-${index}`}>Category</label>
          <select
            id={`cat-${index}`}
            value={data.category}
            onChange={(e) => onChange({ ...data, category: e.target.value })}
          >
            <option value="">Select…</option>
            {['Combat', 'Movement', 'Enemy Behavior', 'UI', 'Progression', 'Other'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`where-${index}`}>Where in the game?</label>
          <select
            id={`where-${index}`}
            value={data.where}
            onChange={(e) => onChange({ ...data, where: e.target.value })}
          >
            <option value="">Select…</option>
            {['Main Menu', 'Rift', 'Boss Fight', 'After Dying', 'Other'].map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>
        </div>
      </div>

      <textarea
        placeholder={`What happened, what were you doing, does it repeat? e.g. "Game froze when I dashed off the edge on rift 3, happened twice"`}
        value={data.description}
        onChange={(e) => onChange({ ...data, description: e.target.value })}
        rows={4}
      />
    </div>
  );
}

/* ── Main form ── */
function FeedbackForm() {
  const searchParams = useSearchParams();
  const version = searchParams.get('version') || 'unknown';

  const [type, setType] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState('');

  // Bug report state
  const [bugs, setBugs] = useState([{ category: '', where: '', description: '' }]);

  // Feedback state
  const [ratings, setRatings] = useState({
    fun: 0, clarity: 0, difficulty: 0, fairness: 0, bow: 0, movement: 0,
  });
  const [pullMechanic, setPullMechanic] = useState('');
  const [progress, setProgress] = useState('');
  const [playAgain, setPlayAgain] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  // Shared
  const [contactEmail, setContactEmail] = useState('');

  const ratingDefs = [
    { id: 'fun', label: 'How fun was it overall?', lowLabel: 'Not fun', highLabel: 'Very fun' },
    { id: 'clarity', label: 'How easy was it to understand what to do?', lowLabel: 'Confusing', highLabel: 'Crystal clear' },
    { id: 'difficulty', label: 'How did the difficulty feel?', lowLabel: 'Too easy', highLabel: 'Too hard' },
    { id: 'fairness', label: 'How fair did deaths feel?', lowLabel: 'Very unfair', highLabel: 'Very fair' },
    { id: 'bow', label: 'How good did the bow feel to use?', lowLabel: 'Bad', highLabel: 'Great' },
    { id: 'movement', label: 'How good did movement feel?', lowLabel: 'Bad', highLabel: 'Great' },
  ];

  const addBug = useCallback(() => {
    setBugs((prev) => [...prev, { category: '', where: '', description: '' }]);
  }, []);

  const updateBug = useCallback((index, data) => {
    setBugs((prev) => prev.map((b, i) => (i === index ? data : b)));
  }, []);

  const removeBug = useCallback((index) => {
    setBugs((prev) => prev.filter((_, i) => i !== index));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const fd = new FormData(e.target);
    fd.set('type', type);
    fd.set('version', version);

    if (type === 'bug') {
      fd.set('bugs', JSON.stringify(bugs));
    } else {
      fd.set('ratings', JSON.stringify(ratings));
      fd.set('pullMechanic', pullMechanic);
      fd.set('progress', progress);
      fd.set('playAgain', playAgain);
      fd.set('feedbackCategory', feedbackCategory);
      fd.set('feedbackText', feedbackText);
    }

    fd.set('contactEmail', contactEmail);

    // Attach screenshot if present
    if (fileRef.current?.files?.[0]) {
      fd.set('screenshot', fileRef.current.files[0]);
    }

    try {
      const res = await fetch('/api/feedback', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success) {
        setStatus('success');
      } else {
        setErrorMsg(json.error || 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error — please try again.');
      setStatus('error');
    }
  }

  function reset() {
    setType(null);
    setStatus('idle');
    setErrorMsg('');
    setFileName('');
    setBugs([{ category: '', where: '', description: '' }]);
    setRatings({ fun: 0, clarity: 0, difficulty: 0, fairness: 0, bow: 0, movement: 0 });
    setPullMechanic('');
    setProgress('');
    setPlayAgain('');
    setFeedbackCategory('');
    setFeedbackText('');
    setContactEmail('');
  }

  if (status === 'success') {
    return (
      <div className="card success-screen">
        <div className="success-icon">
          <CheckIcon />
        </div>
        <h2 className="success-title">Arrow Landed!</h2>
        <p className="success-body">
          Thanks for taking the time — your feedback goes straight to the developer and
          genuinely helps shape the game. Every report counts.
        </p>
        <button className="btn btn-outline" onClick={reset} style={{ margin: '0 auto' }}>
          Submit another report
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        {/* Honeypot */}
        <div className="honeypot" aria-hidden="true">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        {/* Type selector */}
        <div className="type-selector" role="group" aria-label="Report type">
          <button
            type="button"
            className={`type-btn${type === 'bug' ? ' active' : ''}`}
            onClick={() => setType('bug')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2C9.24 2 7 4.24 7 7v1H5a1 1 0 000 2h1.09A8.001 8.001 0 003 17v1a1 1 0 001 1h1v1a1 1 0 002 0v-1h10v1a1 1 0 002 0v-1h1a1 1 0 001-1v-1a8.001 8.001 0 00-4.09-7H17V7c0-2.76-2.24-5-5-5zM9 7a3 3 0 016 0v1H9V7z" fill="currentColor" opacity=".6" />
              <circle cx="9.5" cy="14" r="1.5" fill="currentColor" />
              <circle cx="14.5" cy="14" r="1.5" fill="currentColor" />
            </svg>
            Bug Report
          </button>
          <button
            type="button"
            className={`type-btn${type === 'feedback' ? ' active' : ''}`}
            onClick={() => setType('feedback')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l7.1-1.01L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" opacity=".7" />
            </svg>
            Feedback
          </button>
        </div>

        {!type && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0', fontSize: '0.9rem' }}>
            Select a report type above to get started.
          </p>
        )}

        {/* ── Bug Report ── */}
        {type === 'bug' && (
          <>
            {bugs.map((bug, i) => (
              <BugEntry
                key={i}
                index={i}
                data={bug}
                onChange={(d) => updateBug(i, d)}
                onRemove={() => removeBug(i)}
                showRemove={bugs.length > 1}
              />
            ))}

            <button type="button" className="add-bug-btn" onClick={addBug}>
              + Add another bug
            </button>

            <div className="divider" />

            <div className="form-section">
              <label htmlFor="screenshot">
                Screenshot <span className="label-note">(optional, image files only)</span>
              </label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="screenshot"
                  ref={fileRef}
                  accept="image/*"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                />
                <div className="file-input-text">
                  {fileName
                    ? <span className="file-chosen">📎 {fileName}</span>
                    : <><span>Click to attach</span> or drag an image here</>}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Feedback ── */}
        {type === 'feedback' && (
          <>
            <div className="form-section">
              <div className="field-label">Rate your experience</div>
              <div className="rating-group">
                {ratingDefs.map((rd) => (
                  <RatingRow
                    key={rd.id}
                    {...rd}
                    value={ratings[rd.id]}
                    onChange={(v) => setRatings((r) => ({ ...r, [rd.id]: v }))}
                  />
                ))}
              </div>
            </div>

            <div className="form-section">
              <div className="field-label">Did you understand the pull mechanic?</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.6rem' }}>
                (the core bow charging system)
              </p>
              <PillSelect
                options={['Yes', 'No', 'Took a while']}
                value={pullMechanic}
                onChange={setPullMechanic}
              />
            </div>

            <div className="form-section">
              <label htmlFor="progress">How far did you get?</label>
              <select
                id="progress"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
              >
                <option value="">Select…</option>
                {[
                  'Finished a full run',
                  'Rift 3–4',
                  'Rift 1–2',
                  'Died very early',
                ].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div className="form-section">
              <div className="field-label">Would you play again?</div>
              <PillSelect
                options={['Yes', 'Maybe', 'No']}
                value={playAgain}
                onChange={setPlayAgain}
              />
            </div>

            <div className="form-section">
              <label htmlFor="feedbackCategory">Category for written feedback</label>
              <select
                id="feedbackCategory"
                value={feedbackCategory}
                onChange={(e) => setFeedbackCategory(e.target.value)}
              >
                <option value="">Select…</option>
                {['Combat', 'Movement', 'Enemies', 'UI', 'Difficulty', 'Other'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-section">
              <label htmlFor="feedbackText">
                Written feedback <span className="label-note">(optional)</span>
              </label>
              <textarea
                id="feedbackText"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={`What are you reacting to and what would feel better? e.g. "Dash felt too slow, expected it to carry more momentum"`}
                rows={4}
              />
            </div>
          </>
        )}

        {/* ── Shared fields ── */}
        {type && (
          <>
            <div className="divider" />
            <div className="form-section">
              <label htmlFor="contactEmail">
                Contact email{' '}
                <span className="label-note">— only if you want a reply</span>
              </label>
              <input
                type="email"
                id="contactEmail"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            {status === 'error' && (
              <div className="error-banner" role="alert">{errorMsg}</div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <>
                  <span className="spinner" />
                  Sending…
                </>
              ) : (
                'Send Report'
              )}
            </button>
          </>
        )}
      </div>
    </form>
  );
}

export default function Page() {
  return (
    <div className="page-wrapper">
      <div className="container">
        <header className="site-header">
          <div className="header-bow">
            <BowSVG size={44} />
            <h1 className="site-title">Sky Archer</h1>
          </div>
          <p className="site-subtitle">Feedback &amp; Bug Reports</p>
        </header>

        <Suspense fallback={<div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>}>
          <FeedbackForm />
        </Suspense>
      </div>
    </div>
  );
}
