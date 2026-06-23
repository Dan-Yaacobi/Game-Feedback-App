import { Resend } from 'resend';

function detectOS(userAgent = '') {
  if (/Windows NT/.test(userAgent)) return 'Windows';
  if (/Mac OS X/.test(userAgent)) return 'macOS';
  if (/Android/.test(userAgent)) return 'Android';
  if (/iPhone|iPad|iPod/.test(userAgent)) return 'iOS';
  if (/Linux/.test(userAgent)) return 'Linux';
  return 'Unknown';
}

function ratingBar(n) {
  const filled = '■'.repeat(n);
  const empty = '□'.repeat(5 - n);
  return `${filled}${empty} ${n}/5`;
}

function buildBugHtml(bugs, version, os) {
  const bugSections = bugs.map((bug, i) => `
    <div style="margin-bottom:20px;padding:16px;background:#0e1529;border-left:3px solid #f0b429;border-radius:4px;">
      <p style="margin:0 0 8px;font-size:12px;color:#8892a4;text-transform:uppercase;letter-spacing:.08em;">Bug #${i + 1}</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:10px;">
        <tr>
          <td style="padding:3px 0;color:#8892a4;font-size:13px;width:140px;">Category</td>
          <td style="padding:3px 0;color:#e8eaf0;font-size:13px;">${esc(bug.category || '—')}</td>
        </tr>
        <tr>
          <td style="padding:3px 0;color:#8892a4;font-size:13px;">Where</td>
          <td style="padding:3px 0;color:#e8eaf0;font-size:13px;">${esc(bug.where || '—')}</td>
        </tr>
      </table>
      <p style="margin:0;color:#e8eaf0;font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(bug.description || '(no description)')}</p>
    </div>
  `).join('');

  return buildEmailShell(`Bug Report — Sky Archer`, `
    ${metaBlock(version, os)}
    <h2 style="color:#f0b429;font-size:18px;margin:24px 0 16px;">Bug${bugs.length > 1 ? 's' : ''} Reported (${bugs.length})</h2>
    ${bugSections}
  `);
}

function buildFeedbackHtml(data, version, os) {
  const ratingRows = [
    ['Fun overall', data.ratings?.fun],
    ['Understand what to do', data.ratings?.clarity],
    ['Difficulty feel', data.ratings?.difficulty],
    ['Deaths fairness', data.ratings?.fairness],
    ['Bow feel', data.ratings?.bow],
    ['Movement feel', data.ratings?.movement],
  ].map(([label, val]) => `
    <tr>
      <td style="padding:6px 0;color:#8892a4;font-size:13px;width:200px;">${esc(label)}</td>
      <td style="padding:6px 0;color:#f0b429;font-family:monospace;font-size:13px;">${val ? ratingBar(val) : '—'}</td>
    </tr>
  `).join('');

  return buildEmailShell(`Feedback — Sky Archer`, `
    ${metaBlock(version, os)}

    <h2 style="color:#f0b429;font-size:18px;margin:24px 0 16px;">Ratings</h2>
    <table style="width:100%;border-collapse:collapse;background:#0e1529;padding:16px;border-radius:4px;border-left:3px solid #f0b429;">
      ${ratingRows}
    </table>

    <h2 style="color:#f0b429;font-size:18px;margin:24px 0 16px;">Experience</h2>
    <table style="width:100%;border-collapse:collapse;background:#0e1529;padding:16px;border-radius:4px;border-left:3px solid #c99a2e;">
      ${row('Understood pull mechanic?', data.pullMechanic)}
      ${row('How far did they get?', data.progress)}
      ${row('Would play again?', data.playAgain)}
      ${row('Feedback category', data.feedbackCategory)}
    </table>

    ${data.feedbackText ? `
      <h2 style="color:#f0b429;font-size:18px;margin:24px 0 16px;">Written Feedback</h2>
      <div style="background:#0e1529;padding:16px;border-left:3px solid #c99a2e;border-radius:4px;">
        <p style="margin:0;color:#e8eaf0;font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(data.feedbackText)}</p>
      </div>
    ` : ''}
  `);
}

function metaBlock(version, os) {
  return `
    <table style="width:100%;border-collapse:collapse;background:#0e1529;padding:12px 16px;border-radius:4px;margin-bottom:8px;">
      ${row('Game Version', version)}
      ${row('OS', os)}
    </table>
  `;
}

function row(label, value) {
  return `
    <tr>
      <td style="padding:5px 0;color:#8892a4;font-size:13px;width:180px;">${esc(label)}</td>
      <td style="padding:5px 0;color:#e8eaf0;font-size:13px;">${esc(value || '—')}</td>
    </tr>
  `;
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildEmailShell(title, body) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080c1a;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <div style="margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #1e2d4a;">
      <h1 style="margin:0;color:#f0b429;font-size:22px;letter-spacing:.03em;">${esc(title)}</h1>
    </div>
    ${body}
    <p style="margin-top:32px;font-size:11px;color:#4a5568;">Sent via Sky Archer feedback form</p>
  </div>
</body>
</html>`;
}

export async function POST(request) {
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: 'Invalid form data.' }, { status: 400 });
  }

  // Honeypot check
  const honeypot = formData.get('website');
  if (honeypot) {
    return Response.json({ success: true });
  }

  const type = formData.get('type');
  const version = formData.get('version') || 'unknown';
  const contactEmail = formData.get('contactEmail') || '';
  const ua = request.headers.get('user-agent') || '';
  const os = detectOS(ua);

  if (!type) {
    return Response.json({ error: 'Missing report type.' }, { status: 400 });
  }

  let htmlBody;
  let subject;

  if (type === 'bug') {
    let bugs;
    try {
      bugs = JSON.parse(formData.get('bugs') || '[]');
    } catch {
      return Response.json({ error: 'Invalid bug data.' }, { status: 400 });
    }
    subject = `[Sky Archer] Bug Report (v${version})`;
    htmlBody = buildBugHtml(bugs, version, os);
  } else if (type === 'feedback') {
    let ratings;
    try {
      ratings = JSON.parse(formData.get('ratings') || '{}');
    } catch {
      return Response.json({ error: 'Invalid ratings data.' }, { status: 400 });
    }
    subject = `[Sky Archer] Feedback (v${version})`;
    htmlBody = buildFeedbackHtml({
      ratings,
      pullMechanic: formData.get('pullMechanic'),
      progress: formData.get('progress'),
      playAgain: formData.get('playAgain'),
      feedbackCategory: formData.get('feedbackCategory'),
      feedbackText: formData.get('feedbackText'),
    }, version, os);
  } else {
    return Response.json({ error: 'Unknown report type.' }, { status: 400 });
  }

  if (contactEmail) {
    subject += ` — reply to ${contactEmail}`;
  }

  // Build email payload
  const emailPayload = {
    from: 'Sky Archer Feedback <onboarding@resend.dev>',
    to: process.env.CONTACT_EMAIL,
    subject,
    html: htmlBody,
    reply_to: contactEmail || undefined,
  };

  // Attach screenshot if provided
  const screenshot = formData.get('screenshot');
  if (screenshot && screenshot.size > 0) {
    const buffer = Buffer.from(await screenshot.arrayBuffer());
    emailPayload.attachments = [
      {
        filename: screenshot.name || 'screenshot.png',
        content: buffer,
      },
    ];
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send(emailPayload);
    if (error) {
      console.error('Resend error:', error);
      return Response.json({ error: 'Failed to send email.' }, { status: 500 });
    }
    return Response.json({ success: true });
  } catch (err) {
    console.error('Send error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
