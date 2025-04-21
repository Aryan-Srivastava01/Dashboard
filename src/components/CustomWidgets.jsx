import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Multi-segment donut (SVG) for Cloud Accounts
export function CloudAccountsWidget({ content, title }) {
  const connected = content?.Connected || 0;
  const notConnected = content?.["Not Connected"] || 0;
  const total = connected + notConnected;
  const connectedPct = total ? (connected / total) * 100 : 0;
  const notConnectedPct = total ? (notConnected / total) * 100 : 0;
  const radius = 48, stroke = 12, C = 2 * Math.PI * radius;
  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #e9ecf1', padding: 24, minWidth: 340, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <div>
        {title && <div style={{fontWeight:600, fontSize:15, marginBottom:16}}>{title}</div>}
        <div style={{ width: 110, height: 110, position: 'relative' }}>
          <svg width={110} height={110}>
            {/* Not Connected (background) */}
            <circle
              cx={55} cy={55} r={radius}
              stroke="#e9ecf1"
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={C}
              strokeDashoffset={0}
            />
            {/* Connected (foreground) */}
            <circle
              cx={55} cy={55} r={radius}
              stroke="#4d8cff"
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - connectedPct / 100)}
              style={{ transition: 'stroke-dashoffset 0.5s', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
          </svg>
          {/* Center label */}
          <div style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', fontWeight:700, fontSize:22, color:'#222'}}>
            <span style={{fontSize:22, fontWeight:700, marginTop:-2, textAlign:'center'}}>{connected}</span>
            <span style={{fontSize:13, fontWeight:400, color:'#888'}}>Total</span>
          </div>
        </div>
      </div>
      <div style={{ marginLeft: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#4d8cff', display: 'inline-block', marginRight: 8 }}></span>
          <span style={{ color: '#222', fontSize: 14 }}>Connected ({connected})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#e9ecf1', display: 'inline-block', marginRight: 8 }}></span>
          <span style={{ color: '#b0b7c3', fontSize: 14 }}>Not Connected ({notConnected})</span>
        </div>
      </div>
    </div>
  );
}

// Multi-segment donut (SVG) for Risk Assessment
export function CloudRiskWidget({ content, title }) {
  const total = content?.Total || 0;
  // Prepare default segments for the donut
  const failed = content?.Failed || 0;
  const warning = content?.Warning || 0;
  const passed = content?.Passed || 0;
  const na = content?.NotAvailable || 0;
  const segments = [
    { value: failed, color: '#e53935', label: 'Failed', count: failed },
    { value: warning, color: '#ffd600', label: 'Warning', count: warning },
    { value: na, color: '#bdbdbd', label: 'Not available', count: na },
    { value: passed, color: '#43a047', label: 'Passed', count: passed },
  ];
  let acc = 0;
  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #e9ecf1', padding: 24, minWidth: 340, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <div>
        {title && <div style={{fontWeight:600, fontSize:15, marginBottom:16}}>{title}</div>}
        <div style={{ width: 110, height: 110, position: 'relative' }}>
          <svg width={110} height={110}>
            {(() => {
              let prev = 0;
              return segments.map((seg, i) => {
                const angle = (seg.value / total) * 2 * Math.PI;
                const dashArray = 2 * Math.PI * 48;
                const dashOffset = dashArray * (1 - prev);
                const segmentLength = dashArray * (seg.value / total);
                const gap = dashArray - segmentLength;
                const circleDashArray = `${segmentLength} ${gap}`;
                const el = (
                  <circle
                    key={seg.label}
                    cx={55} cy={55} r={48}
                    stroke={seg.color}
                    strokeWidth={12}
                    fill="none"
                    strokeDasharray={circleDashArray}
                    strokeDashoffset={dashOffset}
                    style={{
                      transition: 'stroke-dashoffset 0.5s',
                      transform: 'rotate(-90deg)',
                      transformOrigin: '50% 50%',
                      opacity: seg.value > 0 ? 1 : 0.18,
                    }}
                  />
                );
                prev += seg.value / total;
                return el;
              });
            })()}
          </svg>
          {/* Center label */}
          <div style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', fontWeight:700, fontSize:22, color:'#222'}}>
            <span style={{fontSize:22, fontWeight:700, marginTop:-2, textAlign:'center'}}>{total}</span>
            <span style={{fontSize:13, fontWeight:400, color:'#888'}}>Total</span>
          </div>
        </div>
      </div>
      <div style={{ marginLeft: 32 }}>
        {segments.map(seg => (
          <div key={seg.label} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: seg.color, display: 'inline-block', marginRight: 8 }}></span>
            <span style={{ color: seg.label === 'Not available' ? '#b0b7c3' : '#222', fontSize: 14 }}>{seg.label} ({seg.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
