import React from 'react';

const RiskWidget = ({ data }) => {
  return (
    <div className="widget risk-widget">
      <h3>Risk Widget</h3>
      <div className="risk-content">
        <div>Total: <span>{data.Total}</span></div>
        <div>Failed: <span>{data.Failed}</span></div>
        <div>Warning: <span>{data.Warning}</span></div>
        <div>Passed: <span>{data.Passed}</span></div>
      </div>
    </div>
  );
};

export default RiskWidget;
