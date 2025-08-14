export const donutQaulityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                }
            }
        }
    }
};

export const donutAvailabilityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
        legend: {
            position: "bottom",
            labels: {
                boxWidth: 12,
                padding: 20,
                font: {
                    family: "Inter, sans-serif",
                },
            },
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    return `${context.label}: ${context.raw}%`;
                }
            }
        },
    },
};

export const dounutEfficiencyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    return `${context.label}: ${context.raw}%`;
                }
            }
        }
    },
    cutout: '70%'
};

export const barChartDeadTimes = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            grid: {
                display: false,
            },
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Minutos'
            },
            grid: {
                color: "#E5E7EB",
            },
        },
    },
    plugins: {
        legend: {
            position: "top",
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    return `${context.dataset.label}: ${context.raw} min`;
                }
            }
        }
    },
};    