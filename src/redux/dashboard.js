import { createSlice, createSelector } from '@reduxjs/toolkit';
import dashboardData from '../data/dashboard.json';

const initialState = {
  categories: dashboardData.categories || [],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Add reducers for category/widget actions if needed
    initializeDashboard: (state, action) => {
      state.categories = action.payload.categories;
      state.availableWidgets = action.payload.availableWidgets;
    },
    addWidgetToCategory: (state, action) => {
      const { categoryId, widget } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.widgets.push(widget);
      }
    },
    removeWidgetFromCategory: (state, action) => {
      const { categoryId, widgetId } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.widgets = category.widgets.filter(w => w.id !== widgetId);
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    }
  }
});

// Selectors
export const selectCategories = (state) => state.dashboard.categories;
export const selectFilteredAvailableWidgets = createSelector(
  [(state) => state.dashboard.availableWidgets, (state) => state.dashboard.searchTerm],
  (widgets, searchTerm) => {
    return widgets.filter(widget => 
      widget.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
);

export const selectWidgets = (state) => state.dashboard.widgets;

export const { 
  initializeDashboard, 
  addWidgetToCategory, 
  removeWidgetFromCategory,
  setSearchTerm
} = dashboardSlice.actions;

export default dashboardSlice.reducer;