/**
 * Chart.js Integration for Dashboard Analytics
 */

let trendChartInstance = null;

function initTrendChart() {
  const canvas = document.getElementById('trendChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Destroy previous instance if re-initializing
  if (trendChartInstance) {
    trendChartInstance.destroy();
  }

  const records = window.dataStore.getRecords();

  // Aggregate monthly or daily trends
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const counts = [12, 19, 15, 28, 22, 9, 6]; // Default baseline representation

  trendChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [{
        label: 'Surat Diterbitkan',
        data: counts,
        backgroundColor: [
          'rgba(20, 83, 45, 0.4)',
          'rgba(20, 83, 45, 0.5)',
          'rgba(20, 83, 45, 0.4)',
          'rgba(20, 83, 45, 0.95)', // Peak bar
          'rgba(20, 83, 45, 0.7)',
          'rgba(20, 83, 45, 0.3)',
          'rgba(20, 83, 45, 0.2)'
        ],
        borderColor: '#14532D',
        borderWidth: 1.5,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#0F172A',
          titleFont: { family: 'Poppins', size: 13, weight: '600' },
          bodyFont: { family: 'Poppins', size: 12 },
          padding: 10,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `Total Diterbitkan: ${context.raw} surat`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Poppins', size: 12 }, color: '#64748B' }
        },
        y: {
          grid: { color: '#F1F5F9' },
          ticks: { font: { family: 'Poppins', size: 11 }, color: '#94A3B8', stepSize: 5 },
          beginAtZero: true
        }
      }
    }
  });
}

window.initTrendChart = initTrendChart;
