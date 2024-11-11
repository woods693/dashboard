const { default: Chart } = require("chart.js/auto");

Chart.defaults.set({
  plugins: {
    tooltip: {
      mode: 'nearest',
    }
  },
  hover: {
    mode: 'nearest',
    intersect: false,
  },
})