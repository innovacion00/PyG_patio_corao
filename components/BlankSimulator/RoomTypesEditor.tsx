"use client";

import { Plus, Trash2 } from "lucide-react";
import type { RoomType } from "@/lib/finance/blank/types";
import { createId } from "@/lib/finance/blank/id";
import { formatCurrencyCOP } from "@/lib/finance/formatters";

interface RoomTypesEditorProps {
  rooms: RoomType[];
  onChange: (rooms: RoomType[]) => void;
}

export function RoomTypesEditor({ rooms, onChange }: RoomTypesEditorProps) {
  function updateRoom(id: string, patch: Partial<RoomType>) {
    onChange(rooms.map((room) => (room.id === id ? { ...room, ...patch } : room)));
  }

  function addRoom() {
    onChange([...rooms, { id: createId("room"), nombre: "Nuevo tipo de habitación", cantidad: 1, adr: 0 }]);
  }

  function removeRoom(id: string) {
    onChange(rooms.filter((room) => room.id !== id));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-deep-700/60">Tipos de habitación</p>
        <button
          type="button"
          onClick={addRoom}
          className="inline-flex items-center gap-1.5 rounded-lg bg-arena-100 px-3 py-1.5 text-xs font-semibold text-deep-900 transition hover:bg-arena-200"
        >
          <Plus className="h-3.5 w-3.5" />
          Agregar tipo
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {rooms.length === 0 && (
          <p className="rounded-lg border border-dashed border-arena-300 p-4 text-center text-sm text-deep-700/50">
            No hay tipos de habitación. Agrega uno para empezar a simular.
          </p>
        )}

        {rooms.map((room) => (
          <div key={room.id} className="rounded-xl border border-arena-200 bg-white p-3 space-y-2.5">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={room.nombre}
                onChange={(e) => updateRoom(room.id, { nombre: e.target.value })}
                placeholder="Nombre del tipo de habitación"
                className="flex-1 rounded-lg border border-arena-200 bg-arena-50 px-3 py-2 text-sm font-medium text-deep-900"
                aria-label="Nombre del tipo de habitación"
              />
              <button
                type="button"
                onClick={() => removeRoom(room.id)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-deep-700/40 transition hover:bg-danger-500/10 hover:text-danger-500"
                aria-label={`Eliminar ${room.nombre}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-deep-700/50">Cantidad</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={room.cantidad}
                  onChange={(e) => updateRoom(room.id, { cantidad: Number(e.target.value) || 0 })}
                  className="rounded-lg border border-arena-200 px-3 py-2 text-sm tabular-nums text-deep-900"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-deep-700/50">ADR (COP/noche)</span>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={room.adr}
                  onChange={(e) => updateRoom(room.id, { adr: Number(e.target.value) || 0 })}
                  className="rounded-lg border border-arena-200 px-3 py-2 text-sm tabular-nums text-deep-900"
                />
              </label>
            </div>
            <p className="text-xs text-deep-700/40">ADR aplicado: {formatCurrencyCOP(room.adr)} por noche</p>
          </div>
        ))}
      </div>
    </div>
  );
}
