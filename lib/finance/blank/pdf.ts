import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { BlankBreakdown } from "./types";
import { buildPyGRows } from "./pygRows";
import { formatCurrencyCOP, formatNumber, formatPercent } from "@/lib/finance/formatters";

interface ExportPyGPdfParams {
  breakdown: BlankBreakdown;
  ocupacionPct: number;
  diasOperativosMes: number;
  adrPromedio: number;
}

const DEEP_900: [number, number, number] = [14, 32, 54];
const ARENA_100: [number, number, number] = [241, 231, 210];
const DANGER_500: [number, number, number] = [156, 74, 60];
const DORADO_700: [number, number, number] = [125, 78, 35];

export function exportPyGToPdf({ breakdown, ocupacionPct, diasOperativosMes, adrPromedio }: ExportPyGPdfParams): void {
  const doc = new jsPDF();
  const rows = buildPyGRows(breakdown);

  doc.setFontSize(16);
  doc.setTextColor(...DEEP_900);
  doc.text("P&G — Simulador GEHsuites", 14, 18);

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Generado el ${new Date().toLocaleDateString("es-CO")}`, 14, 24);

  doc.setFontSize(9);
  doc.setTextColor(40);
  const variables = [
    `% Ocupación: ${formatPercent(ocupacionPct)}`,
    `ADR promedio: ${formatCurrencyCOP(adrPromedio)}`,
    `Días operativos/mes: ${formatNumber(diasOperativosMes, 0)}`,
    `Room-noches/mes: ${formatNumber(breakdown.roomNoches.mensual, 1)}`,
    `Room-noches/año: ${formatNumber(breakdown.roomNoches.anual, 1)}`,
  ];
  doc.text(variables.join("   ·   "), 14, 32, { maxWidth: 182 });

  const body = rows.map((row) => {
    if (row.kind === "section") {
      return [{ content: row.label, colSpan: 3 }];
    }
    if (row.kind === "percent") {
      return [row.label, "", formatPercent(row.mensual ?? 0)];
    }
    const mensual = row.mensual ?? 0;
    const anual = row.anual ?? 0;
    const showMinus = row.isDeduction || mensual < 0;
    const sign = showMinus ? "−" : "";
    return [row.label, `${sign}${formatCurrencyCOP(Math.abs(mensual))}`, `${sign}${formatCurrencyCOP(Math.abs(anual))}`];
  });

  autoTable(doc, {
    startY: 40,
    head: [["Concepto", "Mensual", "Anual"]],
    body,
    styles: { fontSize: 8, cellPadding: 2.2, textColor: [30, 30, 30] },
    headStyles: { fillColor: DEEP_900, textColor: 255, fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "right", cellWidth: 40 },
      2: { halign: "right", cellWidth: 40 },
    },
    didParseCell: (data) => {
      const row = rows[data.row.index];
      if (!row) return;
      if (row.kind === "section") {
        data.cell.styles.fillColor = ARENA_100;
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fontSize = 7.5;
      } else if (row.kind === "subtotal") {
        data.cell.styles.fillColor = [250, 247, 240];
        data.cell.styles.fontStyle = "bold";
      } else if (row.kind === "percent" && data.column.index === 2) {
        data.cell.styles.fontStyle = "bold";
      } else if (row.isDeduction && data.column.index > 0) {
        data.cell.styles.textColor = DORADO_700;
      }
      if ((row.mensual ?? 0) < 0 && data.column.index > 0) {
        data.cell.styles.textColor = DANGER_500;
      }
    },
  });

  doc.save("pyg-simulador-gehsuites.pdf");
}
