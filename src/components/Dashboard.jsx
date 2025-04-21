import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCategories } from '../redux/dashboard';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CloudAccountsWidget, CloudRiskWidget } from './CustomWidgets';
import { RegistryRiskBar, RegistryStatusBar } from './RegistryBars';
import AddWidgetModal from './AddWidgetModal';
import './Dashboard.css';


const MAX_WIDGETS_PER_ROW = 3;

const Dashboard = () => {
  const categories = useSelector(selectCategories) || [];
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [search, setSearch] = useState('');
  const [addWidgetCategoryId, setAddWidgetCategoryId] = useState(null);

  const handleAddWidget = (categoryId) => {
    setAddWidgetCategoryId(categoryId);
    setShowAddWidget(true);
  };
  const handleCloseModal = () => {
    setShowAddWidget(false);
    setAddWidgetCategoryId(null);
  };
  const dispatch = useDispatch();
  const handleConfirmModal = (selectedWidgets) => {
    // Add each new widget to the correct category
    selectedWidgets.forEach(widget => {
      dispatch({
        type: 'dashboard/addWidgetToCategory',
        payload: { categoryId: addWidgetCategoryId, widget },
      });
    });
    setShowAddWidget(false);
    setAddWidgetCategoryId(null);
  };

  // Search logic: flatten all widgets and filter for matches if searching
  let filteredCategories;
  let searchResults = [];
  if (search.trim() === '') {
    filteredCategories = categories;
  } else {
    // Enhanced search: if search matches category name, include all its widgets
    const lowerSearch = search.toLowerCase();
    let searchResults = [];
    categories.forEach(category => {
      const categoryMatches = category.name && category.name.toLowerCase().includes(lowerSearch);
      if (categoryMatches) {
        // All widgets from this category
        searchResults.push(...(category.widgets || []));
      } else {
        // Only widgets that match
        searchResults.push(...((category.widgets || []).filter(widget =>
          widget.name.toLowerCase().includes(lowerSearch) ||
          (widget.text || '').toLowerCase().includes(lowerSearch) ||
          (widget.content && typeof widget.content === 'object' &&
            Object.values(widget.content).some(val =>
              String(val).toLowerCase().includes(lowerSearch)
            ))
        )));
      }
    });
    // Remove duplicates (by widget id)
    const seen = new Set();
    searchResults = searchResults.filter(widget => {
      if (!widget || !widget.id) return false;
      if (seen.has(widget.id)) return false;
      seen.add(widget.id);
      return true;
    });
    filteredCategories = searchResults.length > 0 ? [{
      id: 'search-results',
      name: `Search Results (${searchResults.length})`,
      widgets: searchResults
    }] : [];
  }

  return (
    <div className="dashboard">
      {/* Breadcrumb and Search Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px 8px 16px',
        minHeight: 60,
        background: '#fff',
        borderBottom: '1.5px solid #e3e7ee',
        boxShadow: '0 2px 8px #f3f4f7',
        zIndex: 2
      }}>
        {/* Left: Breadcrumb */}
        <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
          <div className="dashboard-breadcrumb" style={{fontSize: 16, fontWeight: 600, color: '#232e5c'}}>
            <a href="#" style={{color:'#232e5c', textDecoration:'none'}}>Home</a> &gt; <span>Dashboard V2</span>
          </div>
        </div>
        {/* Center: Search */}
        <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
          <input
            className="dashboard-search"
            type="text"
            placeholder="Search anything..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              border: '1px solid #e3e7ee',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '1rem',
              width: '260px',
              background: '#fff',
              outline: 'none',
            }}
          />
        </div>
        {/* Right: Empty for spacing/alignment */}
        <div style={{flex: 1}}></div>
      </div>

      {showAddWidget && (
        <AddWidgetModal
          open={showAddWidget}
          selected={[]}
          onChange={()=>{}}
          onClose={handleCloseModal}
          onConfirm={handleConfirmModal}
          categoryKey={addWidgetCategoryId}
          allWidgets={categories.flatMap(cat => cat.widgets || [])}
        />
      )}
      {/* CNAPP Dashboard Heading and Actions Row */}
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '28px 16px 12px 16px', width: '100%'}}>
        <h2 style={{margin: 0, fontWeight: 800, fontSize: 26, color: '#232e5c', marginRight: 32}}>CNAPP Dashboard</h2>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto'}}>
          <button
            className="add-widget-btn"
            style={{
              height: 44,
              padding: '0 18px',
              fontSize: '1rem',
              fontWeight: 600,
              border: '1px solid #e3e7ee',
              borderRadius: '8px',
              background: '#fff',
              color: '#232e5c',
              cursor: 'pointer',
              boxShadow: '0 1px 3px #e9ecf1',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => handleAddWidget(categories[0]?.id)}
          >
            Add Widget +
          </button>
          <button
            title="Refresh dashboard"
            style={{
              height: 44,
              width: 44,
              border: '1px solid #e3e7ee',
              borderRadius: '8px',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 22,
              color: '#232e5c',
              boxShadow: '0 1px 3px #e9ecf1',
              padding: 0,
              marginTop: 20
            }}
            onClick={() => window.location.reload()}
          >
            &#x21bb;
          </button>
          <button style={{height: 44, width: 44, background: 'none', border: '1px solid #e3e7ee', borderRadius: '8px', fontSize: '1.5rem', cursor: 'pointer', display:'flex',alignItems:'center',justifyContent:'center',color:'#232e5c', marginTop: 20  }}>
            ⋮
          </button>
          <select style={{height: 44, border: '1px solid #e3e7ee', borderRadius: '8px', padding: '0 12px', fontSize: '1rem', background: '#fff', cursor:'pointer', marginTop: 20}}>
            <option>Last 2 days</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
      </div>
      {filteredCategories.map((category, idx) => {
        const widgets = category.widgets || [];
        const emptyCount = Math.max(0, MAX_WIDGETS_PER_ROW - (widgets.length % MAX_WIDGETS_PER_ROW || MAX_WIDGETS_PER_ROW));
        const widgetCards = [
          ...widgets.map((widget) => {
            // Remove widget handler
            const handleRemoveWidget = () => {
              dispatch({
                type: 'dashboard/removeWidgetFromCategory',
                payload: { categoryId: category.id, widgetId: widget.id },
              });
            };
            // Custom rendering for Cloud Accounts and Cloud Account Risk Assessment
            const crossStyle = {
              position: 'absolute',
              top: 8,
              right: 12,
              fontSize: 20,
              color: '#b0b7c3',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              zIndex: 2,
            };
            if (widget.id === 'cloud-accounts') {
              return (
                <div key={widget.id} className="widget-card" style={{position:'relative'}}>
                  <button style={crossStyle} title="Remove widget" onClick={handleRemoveWidget}>×</button>
                  <CloudAccountsWidget content={widget.content} title={widget.name} />
                </div>
              );
            }
            if (widget.id === 'risk-assessment') {
              return (
                <div key={widget.id} className="widget-card" style={{position:'relative'}}>
                  <button style={crossStyle} title="Remove widget" onClick={handleRemoveWidget}>×</button>
                  <CloudRiskWidget content={widget.content} title={widget.name} />
                </div>
              );
            }
            if (widget.id === 'image-risk') {
              return (
                <div key={widget.id} className="widget-card" style={{position:'relative'}}>
                  <button style={crossStyle} title="Remove widget" onClick={handleRemoveWidget}>×</button>
                  <RegistryRiskBar content={widget.content} />
                </div>
              );
            }
            if (widget.id === 'image-security') {
              return (
                <div key={widget.id} className="widget-card" style={{position:'relative'}}>
                  <button style={crossStyle} title="Remove widget" onClick={handleRemoveWidget}>×</button>
                  <RegistryStatusBar content={widget.content} />
                </div>
              );
            }
            // Fallback for other widgets
            return (
              <div key={widget.id} className="widget-card" style={{position:'relative'}}>
                <button style={crossStyle} title="Remove widget" onClick={handleRemoveWidget}>×</button>
                <h3>{widget.name}</h3>
                {widget.type === 'status' && (
                  <div className="status-widget">
                    {Object.entries(widget.content).map(([key, value]) => (
                      <div key={key} className="status-item">
                        <CircularProgressbar
                          value={value}
                          maxValue={4}
                          text={`${value}`}
                          styles={buildStyles({
                            pathColor: '#3e98c7',
                            textColor: '#333',
                          })}
                        />
                        <span>{key}</span>
                      </div>
                    ))}
                  </div>
                )}
                {widget.id === 'cloud-accounts' && (
                  <CloudAccountsWidget content={widget.content} />
                )}
                {widget.id === 'risk-assessment' && (
                  <CloudRiskWidget content={widget.content} />
                )}
                {widget.type === 'text' && (
                  <div className="empty-widget">
                    <span className="empty-icon" role="img" aria-label="No Data">📊</span>
                    <div style={{fontWeight: 500, marginBottom: 8}}>No Graph data available!</div>
                  </div>
                )}
              </div>
            );
          }),
          ...Array(emptyCount).fill(0).map((_, idx) => (
            <div key={`empty-${idx}`} className="widget-card empty-widget">
              <button className="add-widget-btn" style={{margin:'auto'}} onClick={() => handleAddWidget(category.id)}>+ Add Widget</button>
            </div>
          ))
        ];
        return (
          <div key={category.id || idx} className="category-section">
            <h2>{category.name}:</h2>
            <div className="widgets-grid">
              {widgetCards}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;