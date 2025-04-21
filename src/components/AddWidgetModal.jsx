import React, { useState } from 'react';
import './AddWidgetModal.css';

const TABS = [
  { label: 'CSPM', key: 'cspm' },
  { label: 'CWPP', key: 'cwpp' },
  { label: 'Image', key: 'image' },
  { label: 'Ticket', key: 'ticket' },
];

export default function AddWidgetModal({ open, selected = [], onClose, onConfirm, allWidgets = [], categoryKey = 'cspm' }) {
  const [tab, setTab] = useState(categoryKey);
  // Keep tab in sync with categoryKey
  React.useEffect(() => { setTab(categoryKey); }, [categoryKey]);
  const [checked, setChecked] = useState(selected);
  
  const [widgets, setWidgets] = useState(allWidgets);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  if (!open) return null;

  // Filter widgets by tab/category only
  const filteredWidgets = widgets.filter(w => (w.tab === tab || !w.tab));

  const handleCheck = id => {
    setChecked(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleTab = key => {
    setTab(key);
    setChecked(widgets.filter(w => (w.tab === key || !w.tab)).map(w => w.id));
  };

  const handleAddWidget = () => {
    setShowAdd(true);
    setNewName('');
    setNewDesc('');
  };

  const handleSaveWidget = () => {
    if (!newName.trim()) return;
    const id = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const widget = { id, name: newName, text: newDesc, tab: categoryKey };
    setWidgets(prev => [...prev, widget]);
    setChecked(prev => [...prev, id]);
    setShowAdd(false);
    setNewName('');
    setNewDesc('');
  };


  const handleConfirm = () => {
    const selectedWidgets = widgets.filter(w => checked.includes(w.id) && (w.tab === tab || !w.tab));
    onConfirm(selectedWidgets);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="add-widget-modal">
        <div className="modal-header">
          <span>Add Widget</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-subtitle">Personalise your dashboard by adding the following widget</div>
        <div className="modal-tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              className={tab === t.key ? 'active' : ''}
              onClick={() => handleTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>


        <div className="modal-widget-list">
          {filteredWidgets.length === 0 ? (
            <div style={{padding:'18px 28px',color:'#888',fontSize:15}}>No widgets found.</div>
          ) : (
            filteredWidgets.map(w => (
              <label key={w.id} className="modal-widget-row">
                <input
                  type="checkbox"
                  checked={checked.includes(w.id)}
                  onChange={() => handleCheck(w.id)}
                />
                <span className="widget-name">{w.name}</span>
                {w.text && <span className="widget-desc">{w.text}</span>}
              </label>
            ))
          )}
        </div>
        {showAdd ? (
          <div style={{padding:'18px 28px 0 28px', display:'flex', flexDirection:'column', gap:8}}>
            <input
              type="text"
              placeholder="Widget Name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              style={{padding:'8px',fontSize:15,borderRadius:5,border:'1.5px solid #e9ecf1',marginBottom:6}}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              style={{padding:'8px',fontSize:15,borderRadius:5,border:'1.5px solid #e9ecf1',marginBottom:6}}
            />
            <button className="modal-confirm" style={{width:120,alignSelf:'flex-end',marginTop:2}} onClick={handleSaveWidget}>Save</button>
          </div>
        ) : (
          <div style={{padding:'18px 28px 0 28px'}}>
            <button className="modal-confirm" style={{width:140}} onClick={handleAddWidget}>+ Add Widget</button>
          </div>
        )}
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-confirm" onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
