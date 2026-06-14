import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './GraficoStock.css'; // 👈 Sincronizamos tus nuevos estilos separados

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraficoStock = ({ productos = [] }) => {
  // 🧠 PROCESAMIENTO REAL: Agrupamos y contamos las prendas según su columna 'estado'
  const conteoEstados = productos.reduce((acc, prod) => {
    const estadoPrenda = prod.estado || 'Sin Estado';
    acc[estadoPrenda] = (acc[estadoPrenda] || 0) + 1;
    return acc;
  }, {});

  const estadosLabels = Object.keys(conteoEstados);
  const cantidades = Object.values(conteoEstados);

  // Configuración de los datos del gráfico
  const data = {
    labels: estadosLabels,
    datasets: [
      {
        label: 'Cantidad de Artículos',
        data: cantidades,
        backgroundColor: [
          'rgba(50, 215, 75, 0.6)',  // Verde para Disponible
          'rgba(255, 69, 58, 0.6)',  // Rojo para Vendido
          'rgba(255, 159, 10, 0.6)', // Naranja para otros estados
          'rgba(142, 142, 147, 0.6)' // Gris neutro
        ],
        borderColor: [
          'rgba(50, 215, 75, 1)',
          'rgba(255, 69, 58, 1)',
          'rgba(255, 159, 10, 1)',
          'rgba(142, 142, 147, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Opciones de personalización visual con Leyenda Estática (Blindada)
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#fff' },
        onClick: null // 🔒 Leyenda blindada contra clicks accidentales
      },
      title: {
        display: true,
        text: '📊 Análisis Operativo: Disponibilidad de Inventario',
        color: '#fff',
        font: { size: 16 }
      },
    },
    scales: {
      x: { 
        ticks: { color: '#fff' }, 
        grid: { color: '#444' }
      },
      y: { 
        ticks: { color: '#fff', stepSize: 1 }, 
        grid: { color: '#444' }, 
        beginAtZero: true
      }
    }
  };

  return (
    // 🚀 Cambiado: Ahora usa la clase CSS en vez del atributo 'style' en línea
    <div className="grafico-contenedor">
      <Bar data={data} options={options} />
    </div>
  );
};

export default GraficoStock;