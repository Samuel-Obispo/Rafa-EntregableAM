import { Line, Bar, PolarArea, Radar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
  ArcElement,
  RadarController,
} from "chart.js"

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  RadarController,
  Title,
  Tooltip,
  Legend,
  Filler,
)

// Opciones comunes para todos los gráficos
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      titleFont: {
        size: 13,
      },
      bodyFont: {
        size: 12,
      },
      padding: 10,
      cornerRadius: 4,
    },
  },
}

// Opciones específicas para el gráfico de líneas
const lineOptions = {
  ...commonOptions,
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxRotation: 45,
        minRotation: 45,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
    },
  },
  elements: {
    line: {
      tension: 0.3,
    },
    point: {
      radius: 2,
      hoverRadius: 4,
    },
  },
}

// Opciones específicas para el gráfico de barras
const barOptions = {
  ...commonOptions,
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxRotation: 45,
        minRotation: 45,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
    },
  },
}

// Opciones específicas para el gráfico de área polar
const polarAreaOptions = {
  ...commonOptions,
  plugins: {
    ...commonOptions.plugins,
    tooltip: {
      ...commonOptions.plugins.tooltip,
      callbacks: {
        label: (context) => {
          const dataset = context.dataset
          const originalValue = dataset.originalValues[context.dataIndex]
          const maxValue = dataset.maxValues[context.dataIndex]
          const percentage = Math.round((originalValue / maxValue) * 100)
          return `${context.label}: ${originalValue} / ${maxValue} (${percentage}%)`
        },
      },
    },
  },
  scales: {
    r: {
      ticks: {
        backdropColor: "transparent",
      },
    },
  },
}

// Opciones específicas para el gráfico de radar (araña)
const radarOptions = {
  ...commonOptions,
  scales: {
    r: {
      angleLines: {
        display: true,
        color: "rgba(0, 0, 0, 0.1)",
      },
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      pointLabels: {
        font: {
          size: 14,
          weight: "bold",
        },
        color: "#333",
      },
      beginAtZero: true,
      ticks: {
        backdropColor: "transparent",
        showLabelBackdrop: false,
      },
    },
  },
  plugins: {
    ...commonOptions.plugins,
    legend: {
      position: "bottom",
      display: true,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      ...commonOptions.plugins.tooltip,
      callbacks: {
        label: (context) => {
          const dataset = context.dataset
          const originalValue = dataset.originalValues ? dataset.originalValues[context.dataIndex] : context.raw
          const maxValue = dataset.maxValues ? dataset.maxValues[context.dataIndex] : null

          if (maxValue !== null) {
            const percentage = Math.round((originalValue / maxValue) * 100)
            return `${context.dataset.label}: ${originalValue} / ${maxValue} (${percentage}%)`
          }

          return `${context.dataset.label}: ${originalValue}`
        },
      },
    },
  },
}

// Componentes de gráficos
const LineChart = ({ data }) => <Line data={data} options={lineOptions} />
const BarChart = ({ data }) => <Bar data={data} options={barOptions} />
const PolarAreaChart = ({ data }) => <PolarArea data={data} options={polarAreaOptions} />
const RadarChart = ({ data }) => <Radar data={data} options={radarOptions} />

// Exportar todos los gráficos como un objeto
const CombinedCharts = {
  Line: LineChart,
  Bar: BarChart,
  PolarArea: PolarAreaChart,
  Radar: RadarChart,
}

export default CombinedCharts
