# PROMPT MAESTRO — Landing Page Simulador de Rentabilidad
## Proyecto Patio Corao × GEHsuites

Copia y pega todo el bloque de abajo (desde "ROL Y CONTEXTO" hasta el final) en Claude Code, Cursor, v0.dev o la herramienta que uses para generar el sitio.

---

## ROL Y CONTEXTO

Actúa como **arquitecto senior full-stack**, **diseñador UX/UI premium** y **experto en modelos financieros para inversión inmobiliaria turística**. Vas a construir una **landing page comercial** cuyo componente central es un **simulador interactivo de rentabilidad** para inversionistas del proyecto **Patio Corao**, operado y comercializado bajo la marca **GEHsuites**.

El simulador debe traducir un modelo financiero real (P&G de hospedaje, 3 escenarios) en una experiencia visual simple, confiable y persuasiva para un inversionista que NO es financiero: debe entender en segundos cuánto podría ganar según cuánto invierte y bajo qué escenario de ocupación/tarifa.

---

## STACK TÉCNICO OBLIGATORIO

Crear una aplicación web moderna usando:
- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- Componentes reutilizables
- Estado local con **React hooks** (sin backend — toda la lógica del simulador corre en frontend)
- Formateo monetario profesional (COP, separador de miles, símbolo $)
- Código limpio, escalable y bien documentado (comentarios claros en el motor de cálculo)

**No usar backend inicialmente.** Toda la lógica financiera debe estar implementada como funciones puras de TypeScript, desacopladas de la UI, fáciles de testear y auditar.

---

## ESTILO VISUAL OBLIGATORIO

- Fondo claro con acentos **azul profundo**, **azul Caribe**, **blanco**, **arena** y **dorado suave**.
- Diseño premium tipo inversión inmobiliaria (no template genérico de SaaS).
- Tarjetas con **bordes redondeados**.
- **Sombras suaves** (elevación sutil, sin bordes duros).
- Íconos financieros y hoteleros (usar librería tipo `lucide-react`: gráficas, monedas, llave/habitación, playa/palmera, etc.).
- **Animaciones ligeras** (transición de números tipo count-up, entrada suave de gráficas y tarjetas al hacer scroll).
- **Layout mobile first.**
- 100% compatible con escritorio, tablet y celular.

---

## 1. DATOS BASE DEL PROYECTO (fuente: modelo financiero real, hoja "PyG Hospedaje")

- P&G mensual con proyección anualizada (mes × 12), en **COP**.
- Modelo de solo ingresos por hospedaje + rentas complementarias (rooftop, café, spa).
- **Comercializador/operador:** GEHsuites — cobra un fee fijo mensual + un fee variable escalonado sobre ingresos.
- El modelo trabaja con **3 escenarios fijos** (no hay proyección multi-año dentro de esta hoja, es un estado de resultados en régimen/steady-state mensual y anualizado):

| Escenario | % Ocupación | ADR (tarifa promedio) |
|---|---|---|
| Pesimista | 50% | $490.000 |
| Conservador | 68% | $700.000 |
| Optimista | 75% | $790.000 |

- **Room-noches ocupadas:** Pesimista 120/mes (1.440/año) · Conservador 163,2/mes (1.958,4/año) · Optimista 180/mes (2.160/año).
  - Esto implica un inventario aproximado de **8 habitaciones** operando ~30 días efectivos al mes (~360 días/año). Deja esta variable como **parámetro configurable** (`numeroHabitaciones`, `diasOperativosMes`) para que el proyecto pueda ajustarla si crece el inventario.

---

## 2. TABLAS DE RESULTADOS POR ESCENARIO (fuente de verdad — usar estos valores, no inventar cifras)

### INGRESOS (COP)
| Concepto | Pesimista (mes) | Pesimista (año) | Conservador (mes) | Conservador (año) | Optimista (mes) | Optimista (año) |
|---|---|---|---|---|---|---|
| Ingresos por Venta de Hospedaje | 58.800.000 | 705.600.000 | 114.240.000 | 1.370.880.000 | 142.200.000 | 1.706.400.000 |
| Ingreso Rooftop (fijo) | 10.000.000 | 120.000.000 | 10.000.000 | 120.000.000 | 10.000.000 | 120.000.000 |
| Ingreso Local Café (arriendo fijo) | 6.000.000 | 72.000.000 | 6.000.000 | 72.000.000 | 6.000.000 | 72.000.000 |
| Ingreso SPA (arriendo fijo) | 1.500.000 | 18.000.000 | 1.500.000 | 18.000.000 | 1.500.000 | 18.000.000 |
| **TOTAL INGRESOS** | **76.300.000** | **915.600.000** | **131.740.000** | **1.580.880.000** | **159.700.000** | **1.916.400.000** |

### COSTOS DIRECTOS (COP)
| Concepto | Pesimista (mes) | Pesimista (año) | Conservador (mes) | Conservador (año) | Optimista (mes) | Optimista (año) |
|---|---|---|---|---|---|---|
| Comisión Booking.com | 7.878.367 | 94.540.405 | 15.306.542 | 183.678.502 | 19.052.786 | 228.633.429 |
| Costo de Desayuno | 4.200.000 | 50.400.000 | 5.712.000 | 68.544.000 | 6.300.000 | 75.600.000 |
| Costo de Minibar | 557.271 | 6.687.251 | 1.082.698 | 12.992.373 | 1.347.686 | 16.172.229 |
| Costo de Lavandería | 273.237 | 3.278.839 | 530.860 | 6.370.316 | 660.786 | 7.929.437 |
| Costo de Aseo y Cafetería | 6.695.162 | 80.341.947 | 7.699.437 | 92.393.239 | 8.084.408 | 97.012.901 |
| Energía Eléctrica | 9.150.000 | 109.800.000 | 9.607.500 | 115.290.000 | 10.087.875 | 121.054.500 |
| Arrendamiento | 46.000.000 | 552.000.000 | 46.000.000 | 552.000.000 | 46.000.000 | 552.000.000 |
| Agua y Alcantarillado | 1.400.000 | 16.800.000 | 1.470.000 | 17.640.000 | 1.543.500 | 18.522.000 |
| Gas | 250.000 | 3.000.000 | 262.500 | 3.150.000 | 275.625 | 3.307.500 |
| Internet y Cable | 500.000 | 6.000.000 | 500.000 | 6.000.000 | 500.000 | 6.000.000 |
| **TOTAL COSTOS DIRECTOS** | **76.904.037** | **922.848.442** | **88.171.536** | **1.058.058.430** | **93.852.666** | **1.126.231.997** |

### UTILIDAD BRUTA (COP)
| Pesimista (mes) | Pesimista (año) | Conservador (mes) | Conservador (año) | Optimista (mes) | Optimista (año) |
|---|---|---|---|---|---|
| -604.037 | -7.248.442 | 43.568.464 | 522.821.570 | 65.847.334 | 790.168.003 |

### GASTOS OPERACIONALES (COP)
| Concepto | Pesimista (mes) | Pesimista (año) | Conservador (mes) | Conservador (año) | Optimista (mes) | Optimista (año) |
|---|---|---|---|---|---|---|
| Nómina | 19.500.000 | 234.000.000 | 19.500.000 | 234.000.000 | 19.500.000 | 234.000.000 |
| Honorarios | 542.252 | 6.507.019 | 1.053.517 | 12.642.209 | 1.311.364 | 15.736.363 |
| Impuestos (ICA, etc.) | 431.069 | 5.172.827 | 837.505 | 10.050.064 | 1.042.483 | 12.509.796 |
| Seguros | 151.468 | 1.817.617 | 294.281 | 3.531.371 | 366.306 | 4.395.666 |
| Servicios Administrativos | 1.550.000 | 18.600.000 | 1.627.500 | 19.530.000 | 1.708.875 | 20.506.500 |
| Asesoría Legal | 158.469 | 1.901.625 | 307.882 | 3.694.585 | 383.236 | 4.598.827 |
| Mantenimiento y Reparaciones | 1.350.000 | 16.200.000 | 1.417.500 | 17.010.000 | 1.488.375 | 17.860.500 |
| Adecuación e Instalación | 1.040.000 | 12.480.000 | 1.092.000 | 13.104.000 | 1.146.600 | 13.759.200 |
| Gastos Diversos | 1.204.940 | 14.459.276 | 1.265.187 | 15.182.239 | 1.328.446 | 15.941.351 |
| **TOTAL GASTOS OPERACIONALES** | **25.928.197** | **311.138.364** | **27.395.372** | **328.744.468** | **28.275.684** | **339.308.203** |

### EBITDA / UTILIDAD OPERACIONAL (COP)
| Pesimista (mes) | Pesimista (año) | Conservador (mes) | Conservador (año) | Optimista (mes) | Optimista (año) |
|---|---|---|---|---|---|
| -26.532.234 | -318.386.806 | 16.173.092 | 194.077.102 | 37.571.650 | 450.859.800 |

**Margen EBITDA %:** Pesimista -45,12% · Conservador 14,16% · Optimista 26,42%

### GASTOS NO OPERACIONALES (COP)
| Concepto | Pesimista (mes) | Pesimista (año) | Conservador (mes) | Conservador (año) | Optimista (mes) | Optimista (año) |
|---|---|---|---|---|---|---|
| Gasto Financiero (Bancario) | 2.106.333 | 25.275.993 | 2.422.283 | 29.067.392 | 2.785.625 | 33.427.500 |

### COMERCIALIZACIÓN GEH SUITES (COP)
| Concepto | Pesimista (mes) | Pesimista (año) | Conservador (mes) | Conservador (año) | Optimista (mes) | Optimista (año) |
|---|---|---|---|---|---|---|
| Fee Fijo Mensual GEHsuites | 3.000.000 | 36.000.000 | 3.000.000 | 36.000.000 | 3.000.000 | 36.000.000 |
| Fee Variable GEHsuites (% s/ventas) | 1.526.000 | 18.312.000 | 3.952.200 | 47.426.400 | 6.388.000 | 76.656.000 |
| **TOTAL FEE GEHsuites** | **4.526.000** | **54.312.000** | **6.952.200** | **83.426.400** | **9.388.000** | **112.656.000** |

**Tabla de tramos del Fee Variable (sobre ingresos totales mensuales):**
- Ingresos mensuales entre $58MM y $80MM → **2%**
- Ingresos mensuales entre $81MM y $110MM → **3%**
- Ingresos mensuales entre $111MM y $190MM → **4%**

*(Implementar esta tabla de tramos como función de cálculo; usar los valores de la tabla como validación/calibración — el escenario Optimista, con ingresos de $159,7MM, aplica el tramo del 4%).*

### UTILIDAD / PÉRDIDA NETA (COP)
| Pesimista (mes) | Pesimista (año) | Conservador (mes) | Conservador (año) | Optimista (mes) | Optimista (año) |
|---|---|---|---|---|---|
| -33.164.567 | -397.974.799 | 6.798.609 | 81.583.311 | 25.398.025 | 304.776.300 |

**Margen Neto %:** Pesimista -56,40% · Conservador 5,95% · Optimista 17,86%

---

## 3. LÓGICA DEL MOTOR DE CÁLCULO (funciones puras en TypeScript)

```
// 1) Ingreso por hospedaje
roomNoches(mes) = %Ocupación × N°Habitaciones × díasOperativosMes   // ≈30 días/mes
ingresoHospedaje(mes) = roomNoches(mes) × ADR

// 2) Ingresos totales
ingresosTotales(mes) = ingresoHospedaje(mes) + ingresoRooftop(fijo) + ingresoCafe(fijo) + ingresoSPA(fijo)

// 3) Costos directos
// La comisión de Booking.com, el costo de desayuno/minibar/lavandería/aseo escalan con la ocupación/ingresos;
// energía, arrendamiento, agua, gas e internet son mayormente fijos (leve variación entre escenarios).
// Para el modo "custom" (fuera de los 3 escenarios fijos), interpolar cada línea de costo proporcionalmente
// al cambio en ingresoHospedaje respecto al escenario Conservador (escenario base de calibración).
totalCostosDirectos(mes) = suma de líneas de costos directos (tabla sección 2)

utilidadBruta(mes) = ingresosTotales(mes) − totalCostosDirectos(mes)

// 4) Gastos operacionales (mayormente fijos, con leve variación entre escenarios ya tabulada)
totalGastosOperacionales(mes) = suma de líneas de gastos operacionales (tabla sección 2)

ebitda(mes) = utilidadBruta(mes) − totalGastosOperacionales(mes)
margenEbitda(mes) = ebitda(mes) / ingresosTotales(mes)

// 5) Gasto financiero (no operacional)
gastoFinanciero(mes) = valor tabulado por escenario (sección 2), interpolable proporcional a ingresos

// 6) Fee GEHsuites (comercialización)
feeFijoGEH = 3.000.000 (constante)
feeVariableGEH(mes) = ingresosTotales(mes) × tasaTramo(ingresosTotales(mes))
  donde tasaTramo:
    ingresosTotales(mes) entre 58.000.000 y 80.000.000 → 2%
    ingresosTotales(mes) entre 81.000.000 y 110.000.000 → 3%
    ingresosTotales(mes) entre 111.000.000 y 190.000.000 → 4%
totalFeeGEH(mes) = feeFijoGEH + feeVariableGEH(mes)

// 7) Utilidad neta
utilidadNeta(mes) = ebitda(mes) − gastoFinanciero(mes) − totalFeeGEH(mes)
margenNeto(mes) = utilidadNeta(mes) / ingresosTotales(mes)
utilidadNeta(año) = utilidadNeta(mes) × 12   // o suma de 12 meses si se permite estacionalidad futura

// 8) Rentabilidad del inversionista (pro-rata sobre el monto invertido)
// El monto total de inversión / valuación del proyecto NO viene en esta hoja: exponerlo como
// parámetro configurable en el código (constante `VALOR_TOTAL_PROYECTO`, editable fácilmente).
participacionInversionista(%) = montoInvertido / VALOR_TOTAL_PROYECTO
utilidadInversionista(año) = utilidadNeta(año) × participacionInversionista
roiAnual(%) = utilidadInversionista(año) / montoInvertido
paybackEstimado(años) = montoInvertido / utilidadInversionista(año)  // usar escenario en régimen (Conservador u Optimista)
```

> **Nota importante:** los 3 escenarios (Pesimista/Conservador/Optimista) son los **valores reales y exactos del modelo** — deben mostrarse siempre tal cual la tabla de la sección 2, sin recalcular. El motor de fórmulas de arriba se usa únicamente para el **modo "personalizado"** (cuando el usuario mueve el slider de ocupación/ADR fuera de los 3 valores fijos), interpolando proporcionalmente sobre el escenario Conservador como base. Etiquetar visualmente los resultados personalizados como **"estimación interpolada"** para no confundirlos con los escenarios oficiales del modelo.

---

## 4. FUNCIONALIDAD DEL SIMULADOR (obligatorio)

### Inputs del usuario:
1. **Escenario**: Pesimista / Conservador / Optimista (selector tipo tabs, Conservador preseleccionado por defecto) — usa los valores exactos de la tabla.
2. **Modo personalizado** (opcional, toggle "Ajustar mi propio escenario"): sliders de % Ocupación y ADR que recalculan con el motor de la sección 3, mostrando claramente que es una estimación interpolada.
3. **Monto a invertir** (COP) — input numérico con formato de miles.
4. **Horizonte**: vista Mensual / Anual (toggle).

### Outputs en tiempo real (sin botón "calcular", recálculo reactivo):
- **Utilidad neta estimada** (mensual y anual) — tarjeta destacada, número más grande de la página.
- **ROI anual (%)** y **Payback estimado (años)** sobre el monto invertido.
- Desglose visual tipo waterfall/funnel: Ingresos Totales → Costos Directos → Utilidad Bruta → Gastos Operacionales → EBITDA → Gasto Financiero → Fee GEHsuites → Utilidad Neta.
- Gráfica comparativa de los 3 escenarios (barras) para Ingresos, EBITDA y Utilidad Neta simultáneamente, siempre visible como referencia de transparencia.
- Tarjeta explicando el **Fee GEHsuites** (fijo + variable escalonado) como parte de la transparencia del modelo de comercialización.
- Indicador de **margen EBITDA %** y **margen neto %** con código de color (rojo si negativo, ámbar si bajo, verde si saludable).

### Reglas de UX:
- Recalcular instantáneamente al mover cualquier control.
- Formatear todos los valores en COP con separador de miles y símbolo $ (usar `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })`).
- Mostrar SIEMPRE el escenario Pesimista visible (incluye utilidad neta negativa) — es parte de la transparencia del proyecto, no ocultarlo.
- Disclaimer permanente y visible: *"Cifras basadas en el modelo financiero P&G de hospedaje de Patio Corao, operado por GEHsuites. No constituyen garantía de rentabilidad. El escenario personalizado es una estimación interpolada y no forma parte del modelo oficial."*

---

## 5. ESTRUCTURA DE LA LANDING PAGE

1. **Hero**: propuesta de valor + CTA a "Simula tu inversión" (scroll al simulador). Imagen/video estilo boutique hotel caribeño, marca GEHsuites visible.
2. **Simulador interactivo** (sección ancla, componente central, descrito en sección 4).
3. **Por qué invertir en Patio Corao**: operador especializado GEHsuites, ingresos diversificados (hospedaje + rooftop + café + spa), estructura de costos transparente.
4. **Desglose financiero transparente**: acordeón o tabla con costos directos y gastos operacionales (sección 2) para inversionistas que quieran profundidad.
5. **Comparativo de escenarios**: gráfica de ingresos/EBITDA/utilidad neta en los 3 escenarios (mensual y anual).
6. **Modelo de comercialización GEHsuites**: explicar fee fijo + fee variable escalonado, en lenguaje simple.
7. **FAQ**: qué pasa si la ocupación es menor a la esperada (mostrar el caso Pesimista con transparencia), qué cubre el fee de GEHsuites, cómo se calcula el ROI, cuándo se distribuyen utilidades.
8. **CTA final + formulario de contacto** (nombre, email, teléfono, monto a invertir).
9. **Footer** con disclaimers legales y datos de la marca GEHsuites.

---

## 6. ARQUITECTURA DE CÓDIGO SUGERIDA

```
/app
  /page.tsx                    -> Landing page (composición de secciones)
/components
  /Hero.tsx
  /Simulator/
    Simulator.tsx               -> Contenedor con estado (React hooks)
    ScenarioSelector.tsx
    CustomModeSliders.tsx
    InvestmentInput.tsx
    ResultsSummaryCard.tsx      -> Utilidad neta, ROI, Payback
    WaterfallBreakdown.tsx
    ScenarioComparisonChart.tsx
  /WhyInvest.tsx
  /FinancialBreakdown.tsx
  /GEHSuitesFeeExplainer.tsx
  /FAQ.tsx
  /ContactForm.tsx
  /Footer.tsx
/lib
  /finance
    constants.ts                -> Datos de las 3 tablas de la sección 2 (fuente de verdad)
    engine.ts                   -> Funciones puras de la sección 3 (roomNoches, ingresosTotales, feeGEH, utilidadNeta, roi, payback, etc.)
    formatters.ts                -> formatCurrencyCOP, formatPercent
  /types.ts                     -> Scenario, FinancialBreakdown, SimulatorInputs, SimulatorResults
```

- Todo cálculo debe vivir en `/lib/finance`, 100% desacoplado de componentes de UI, con funciones puras testeables (`ebitda(inputs): number`, etc.).
- Usar `useMemo` en el componente `Simulator.tsx` para recalcular resultados solo cuando cambien los inputs.

---

## 7. ENTREGABLE ESPERADO

Un proyecto Next.js + TypeScript + Tailwind funcional con:
- Landing page completa según la sección 5.
- Simulador 100% interactivo, motor de cálculo según sección 3, usando las tablas exactas de la sección 2 como fuente de verdad para los 3 escenarios oficiales.
- Diseño premium acorde a la paleta y estilo visual especificados (azul profundo, azul Caribe, blanco, arena, dorado suave; tarjetas redondeadas; sombras suaves; animaciones ligeras).
- Responsive completo, mobile first.
- Código limpio, tipado y documentado, listo para escalar (agregar backend/CMS más adelante sin refactor mayor).
