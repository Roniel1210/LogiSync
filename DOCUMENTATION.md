# Documentación del Proyecto: LogiSync

LogiSync es una plataforma avanzada de gestión logística que integra Inteligencia Artificial Generativa para optimizar la cadena de suministro, predecir la demanda y facilitar la toma de decisiones basada en datos.

## 📋 Descripción General

LogiSync actúa como un centro de control operativo (Control Tower) que permite visualizar KPIs críticos, gestionar un repositorio documental inteligente y realizar análisis predictivos mediante modelos estocásticos. La aplicación está diseñada con una estética moderna y funcional, priorizando la claridad de los datos y la facilidad de uso.

## 🚀 Tecnologías Utilizadas

- **Frontend Core**: [React 19](https://react.dev/) con [TypeScript](https://www.typescriptlang.org/).
- **Bundler**: [Vite 6](https://vitejs.dev/).
- **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/) para un diseño responsivo y moderno.
- **Visualización de Datos**: [Recharts](https://recharts.org/) para gráficas interactivas y dinámicas.
- **Animaciones**: [Motion](https://motion.dev/) (anteriormente Framer Motion) para transiciones suaves y micro-interacciones.
- **Iconografía**: [Lucide React](https://lucide.dev/).
- **Inteligencia Artificial**: Integración con [Google Generative AI](https://ai.google.dev/) (Gemini API).

## 🛠️ Arquitectura del Proyecto

El proyecto sigue una estructura modular de componentes de React:

- `/src/components`: Contiene las vistas principales y elementos de la interfaz.
  - `TopNav.tsx`: Barra de navegación superior con selector de vistas.
  - `DashboardView.tsx`: Vista principal con KPIs y gráficas de flujo global.
  - `RepositoryView.tsx`: Gestión documental basada en búsqueda semántica (Nexo Vectorial).
  - `PredictiveView.tsx`: Modelado de demanda y detección de rupturas de stock.
  - `ReportsView.tsx`: Generación y programación de reportes operativos.
  - `ChatbotView.tsx`: Asistente de IA para consultas en lenguaje natural.
- `/src/lib`: Utilidades y configuraciones compartidas.
- `/src/App.tsx`: Punto de entrada principal que gestiona el enrutamiento interno de vistas.

## ✨ Características Principales

### 1. Panel de Control (Dashboard)
Visualización en tiempo real de métricas clave:
- Sincronización de inventario.
- SLA de entregas.
- Optimización de costos de compra.
- Distribución de carga por tipo de transporte (Terrestre, Aéreo, Marítimo).

### 2. Nexo Vectorial (Repositorio Inteligente)
Un repositorio documental que no solo almacena archivos, sino que permite búsquedas semánticas.
- Indexación de contratos, facturas y guías de remisión.
- Representación visual de la red vectorial de datos.
- Cálculo de "Match" porcentual basado en relevancia contextual.

### 3. Analítica Predictiva
Modelos de previsión de demanda para anticipar problemas en la cadena de suministro:
- Gráficas de Inventario Proyectado vs. Demanda Estimada.
- Detección automática de rupturas de stock (Alertas tempranas).
- "Motor de Decisión" para generar órdenes de compra automáticas basadas en inferencias de IA.

### 4. Generación de Reportes
Sistema flexible para la exportación de datos:
- Formatos PDF, XLSX y CSV.
- Programación de tareas automáticas (Diario, Semanal, Mensual).
- Plantillas personalizables.

### 5. Asistente de IA (Chatbot)
Interfaz conversacional que permite interactuar con los datos del negocio:
- Resumen de flujos operativos.
- Interpretación de proyecciones complejas.
- Búsqueda y recomendación de proveedores.

## ⚙️ Configuración y Ejecución

### Requisitos Previos
- [Node.js](https://nodejs.org/) instalado.

### Pasos para Ejecutar
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Configurar variables de entorno:
   - Crear un archivo `.env` o `.env.local`.
   - Añadir la clave de API de Gemini: `VITE_GEMINI_API_KEY=tu_clave_aqui`.
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 📈 Roadmap y Próximas Mejoras
- [ ] Integración completa del Chatbot con el historial vectorial real.
- [ ] Notificaciones push para alertas de stock crítico.
- [ ] Integración con APIs externas de proveedores de transporte en tiempo real.
- [ ] Panel de administración multi-usuario con roles y permisos.
