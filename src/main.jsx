// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client'; 

 

// Renderizar la aplicación en el DOM
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <h2>Hello World!</h2>
  </React.StrictMode>
);