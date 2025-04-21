import React from 'react';

const StatusWidget = ({ data }) => {
  return (
    <div className="widget status-widget">
      <h3>Status Widget</h3>
      <div className="status-content">
        <div>Status1: <span>{data.Status1}</span></div>
        <div>Status2: <span>{data.Status2}</span></div>
      </div>
    </div>
  );
};

export default StatusWidget;
