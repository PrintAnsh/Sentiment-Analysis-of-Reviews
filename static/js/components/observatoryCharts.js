/**
 * ObservatoryCharts.js - Chart.js & Confusion Matrix Grid Renderer inside Observatory
 * Realm of Echoes: The Sentiment Oracle
 */

class ObservatoryCharts {
  constructor() {
    this.donutChart = null;
    this.histogramChart = null;
  }

  init(metricsData) {
    this.renderDonutChart();
    this.renderHistogramChart();
    this.renderConfusionMatrix(metricsData ? metricsData.confusion_matrix : null);
    this.renderWordCloud(metricsData);
  }

  renderDonutChart() {
    const ctx = document.getElementById('observatory-donut-canvas');
    if (!ctx) return;

    if (this.donutChart) this.donutChart.destroy();

    this.donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [{
          data: [58, 24, 18],
          backgroundColor: ['#00e676', '#ffc400', '#ff1744'],
          borderColor: '#0a0d14',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', font: { family: 'Outfit', size: 11 } }
          }
        }
      }
    });
  }

  renderHistogramChart() {
    const ctx = document.getElementById('observatory-histogram-canvas');
    if (!ctx) return;

    if (this.histogramChart) this.histogramChart.destroy();

    this.histogramChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'],
        datasets: [{
          label: 'Confidence Scores',
          data: [5, 12, 28, 85, 140],
          backgroundColor: '#00e5ff',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }

  renderConfusionMatrix(matrix) {
    const gridEl = document.getElementById('confusion-matrix-grid');
    if (!gridEl) return;

    const data = matrix || [
      [1420, 110, 70],
      [95,   1340, 115],
      [60,   105,  1685]
    ];

    const labels = ['Negative', 'Neutral', 'Positive'];
    let html = '<table style="width:100%; border-collapse:collapse; text-align:center; font-family:var(--font-pixel); font-size:9px;">';
    
    // Header
    html += '<tr><th>Actual \\ Pred</th>';
    labels.forEach(l => html += `<th style="padding:6px; color:var(--neon-cyan);">${l}</th>`);
    html += '</tr>';

    data.forEach((row, i) => {
      html += `<tr><th style="padding:6px; color:var(--text-pixel-gold);">${labels[i]}</th>`;
      row.forEach((val, j) => {
        const isDiagonal = i === j;
        const bg = isDiagonal ? 'rgba(0, 230, 118, 0.25)' : 'rgba(255, 23, 68, 0.15)';
        const color = isDiagonal ? '#00e676' : '#ff1744';
        html += `<td style="background:${bg}; color:${color}; padding:8px; border:1px solid rgba(255,255,255,0.05);">${val}</td>`;
      });
      html += '</tr>';
    });

    html += '</table>';
    gridEl.innerHTML = html;
  }

  renderWordCloud(metrics) {
    const cloudEl = document.getElementById('aspect-word-cloud');
    if (!cloudEl) return;

    const posWords = (metrics && metrics.top_positive_features) || ["masterpiece", "flawless", "stunning", "smooth", "brilliant", "awesome"];
    const negWords = (metrics && metrics.top_negative_features) || ["garbage", "horrible", "crashes", "unusable", "terrible", "waste"];

    let html = '<div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; align-items:center; height:100%;">';
    
    posWords.forEach(w => {
      html += `<span class="rune-chip positive" style="font-size:${Math.random() * 6 + 10}px; box-shadow:0 0 8px rgba(0,230,118,0.3);">${w}</span>`;
    });

    negWords.forEach(w => {
      html += `<span class="rune-chip negative" style="font-size:${Math.random() * 6 + 10}px; box-shadow:0 0 8px rgba(255,23,68,0.3);">${w}</span>`;
    });

    html += '</div>';
    cloudEl.innerHTML = html;
  }
}
