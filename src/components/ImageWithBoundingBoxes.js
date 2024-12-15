import React, { useState, useEffect } from 'react';

// Componente que dibuja los bounding boxes sobre una imagen y el mapa de calor estático
function ImageWithBoundingBoxes({ imageUrl, detections }) {
  const [heatmap, setHeatmap] = useState([]);

  // Cálculo de la "actividad" de cada área
  useEffect(() => {
    const newHeatmap = calculateHeatmap(detections);
    setHeatmap(newHeatmap);
  }, [detections]);

  const calculateHeatmap = (detections) => {
    const heatmapData = [];
    
    // Define el tamaño de las celdas del mapa de calor (por ejemplo, dividir la imagen en una cuadrícula)
    const gridSize = 10;
    
    // Inicializar el mapa de calor con valores de actividad 0
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        heatmapData.push({ x: i, y: j, activity: 0 });
      }
    }

    // Para cada detección, aumentar la actividad en la celda correspondiente
    detections.forEach((detection) => {
      detection.Instances.forEach((instance) => {
        const box = instance.BoundingBox;
        
        // Calcular en qué celda de la cuadrícula se encuentra el centro del bounding box
        const centerX = (box.Left * 100)+ (box.Width * 100) / 2;
        const centerY = (box.Top * 100) + (box.Height * 100) / 2;
        
        const gridX = Math.floor(centerX * gridSize);  // Convertir a índice de la cuadrícula (normalizado)
        const gridY = Math.floor(centerY * gridSize);
        
        // Incrementar la actividad en la celda correspondiente
        if (gridX < gridSize && gridY < gridSize) {
          heatmapData[gridY * gridSize + gridX].activity += 1;
        }
      });
    });

    return heatmapData;
  };

  // Función para mapear la actividad a un color de mapa de calor
  const getHeatmapColor = (activity) => {
    const intensity = Math.min(activity * 20, 255);  // Ajuste de intensidad
    return `rgb(${intensity}, ${255 - intensity}, 0)`;  // De rojo a verde
  };

  return (
    <div className="image-container" style={{ position: 'relative' }}>
      <img src={imageUrl} alt="Frame" style={{ width: '100%' }} />
      
      {/* Mapa de calor */}
      {heatmap.map((cell, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${(cell.x / 10) * 100}%`,
            top: `${(cell.y / 10) * 100}%`,
            width: `${100 / 10}%`,
            height: `${100 / 10}%`,
            backgroundColor: getHeatmapColor(cell.activity),
            opacity: 0.6, // Transparencia para que se vea la imagen de fondo
            zIndex: -1, // Poner debajo de los bounding boxes
          }}
        ></div>
      ))}

      {/* Bounding Boxes */}
      {detections.map((detection, index) =>
        detection.Instances.map((instance, i) => (
          <div
            key={`${index}-${i}`}
            style={{
              position: 'absolute',
              border: '2px solid red',
              left: `${instance.BoundingBox.Left * 100}%`,
              top: `${instance.BoundingBox.Top * 100}%`,
              width: `${instance.BoundingBox.Width * 100}%`,
              height: `${instance.BoundingBox.Height * 100}%`,
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: '50%',
                top: '-15px',
                transform: 'translateX(-50%)',
                color: 'white',
                fontSize: '9px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                padding: '2px 5px',
                fontWeight: 'bold',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {detection.Label.Name} - {Math.round(detection.Label.Confidence)}%
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default ImageWithBoundingBoxes;
