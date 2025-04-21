import React from 'react';
import Dashboard from './components/Dashboard';
import { Provider } from 'react-redux';
import store from './redux/store';
import './App.css';


function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Dashboard />
      </div>
    </Provider>
  );
}

export default App;
