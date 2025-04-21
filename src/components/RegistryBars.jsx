import React from 'react';

// Registry Scan Risk Bar (horizontal stacked bar)
export function RegistryRiskBar({ content }) {
  // Critical, High, Warning, Passed, Not Available (default 0 if missing)
  const total = content?.Total || 0;
  const critical = content?.Critical || 0;
  const high = content?.High || 0;
  const warning = content?.Warning || 0;
  const passed = content?.Passed || 0;
  const na = content?.NotAvailable || 0;
  // Order: Critical, High, Warning, Passed, Not Available
  const segments = [
    { value: critical, color: '#a80000', label: 'Critical' },
    { value: high, color: '#d32f2f', label: 'High' },
    { value: warning, color: '#ffc107', label: 'Warning' },
    { value: passed, color: '#ffe082', label: 'Passed' },
    { value: na, color: '#bdbdbd', label: 'Not Available' },
  ].filter(seg => seg.value > 0);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 6 }}>{total} <span style={{ fontWeight: 400, fontSize: 15 }}>Total Vulnerabilities</span></div>
      <div style={{ display: 'flex', height: 14, borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px #e3e7ee', marginBottom: 12 }}>
        {segments.map((seg, idx) => (
          <div
            key={seg.label}
            style={{
              width: total ? `${(seg.value / total) * 100}%` : '0%',
              background: seg.color,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              color: '#fff',
              fontWeight: 500,
              transition: 'width 0.5s',
            }}
          >

          </div>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: 0, gap: 18 }}>
        {segments.map(seg => (
          <div key={seg.label} style={{ display: 'flex', alignItems: 'center', fontSize: 13 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: seg.color, display: 'inline-block', marginRight: 7 }}></span>
            <span>{seg.label} ({seg.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Registry Scan Status Bar (horizontal stacked bar)
export function RegistryStatusBar({ content }) {
  // Critical, High, Warning, Passed, Not Available (default 0 if missing)
  const total = content?.['Total Images'] ?? (
    (content?.Critical || 0) + (content?.High || 0) + (content?.Warning || 0) + (content?.Passed || 0) + (content?.NotAvailable || 0)
  );
  const critical = content?.Critical || 0;
  const high = content?.['High Vulnerabilities'] || 0;
  const warning = content?.Warning || 0;
  const passed = content?.Passed || 0;
  const na = content?.NotAvailable || 0;
  // Order: Critical, High, Warning, Passed, Not Available
  const segments = [
    { value: critical, color: '#a80000', label: 'Critical' },
    { value: high, color: '#d32f2f', label: 'High' },
    { value: warning, color: '#ffc107', label: 'Warning' },
    { value: passed, color: '#ffe082', label: 'Passed' },
    { value: na, color: '#bdbdbd', label: 'Not Available' },
  ].filter(seg => seg.value > 0);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 6 }}>{total} <span style={{ fontWeight: 400, fontSize: 15 }}>Total Images</span></div>
      <div style={{ display: 'flex', height: 14, borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px #e3e7ee', marginBottom: 12 }}>
        {segments.map((seg, idx) => (
          <div
            key={seg.label}
            style={{
              width: total ? `${(seg.value / total) * 100}%` : '0%',
              background: seg.color,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              color: '#fff',
              fontWeight: 500,
              transition: 'width 0.5s',
            }}
          >
            {seg.value > 0 && (seg.value / total) > 0.08 ? seg.value : ''}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: 0, gap: 18 }}>
        {segments.map(seg => (
          <div key={seg.label} style={{ display: 'flex', alignItems: 'center', fontSize: 13 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: seg.color, display: 'inline-block', marginRight: 7 }}></span>
            <span>{seg.label} ({seg.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
