import { addMinutes, isBefore, isAfter, isEqual } from 'date-fns';

export type TimeRange = { start: Date; end: Date };

export interface GetAvailableSlotsParams {
  dateStr: string; // Fecha solicitada, ej. '2026-03-18'
  serviceDurationMinutes: number;
  branchBusinessHours: TimeRange; // Horario de apertura y cierre convertidos a UTC (Date)
  branchBlocks: TimeRange[];
  staffBlocks: TimeRange[];
  existingBookings: TimeRange[];
  intervalMinutes?: number; // Cada cuántos minutos ofrecer una cita (p.ej., cada 30 min)
}

/**
 * Calcula los cupos disponibles para una fecha, servicio y staff,
 * restando bloqueos de sucursal, bloqueos de personal y reservas existentes.
 */
export function getAvailableSlots(params: GetAvailableSlotsParams): TimeRange[] {
  const {
    serviceDurationMinutes,
    branchBusinessHours,
    branchBlocks,
    staffBlocks,
    existingBookings,
    intervalMinutes = 30
  } = params;

  const availableSlots: TimeRange[] = [];
  
  // Iniciamos iteración desde la hora de apertura
  let currentSlotStart = new Date(branchBusinessHours.start);
  const endOfDay = new Date(branchBusinessHours.end);

  // Unificamos absolutamente todos los periodos donde el staff/sucursal NO está disponible
  const allUnavailablePeriods = [...branchBlocks, ...staffBlocks, ...existingBookings].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );

  // Recorremos el día comercial incrementando según el intervalMinutes
  while (isBefore(currentSlotStart, endOfDay)) {
    const currentSlotEnd = addMinutes(currentSlotStart, serviceDurationMinutes);

    // Si la cita termina DESPUÉS de la hora de cierre, cortamos el cálculo
    if (isAfter(currentSlotEnd, endOfDay)) {
      break;
    }

    // Verificamos matemáticamente si existe solapamiento (overlap) con los periodos ocupados
    const isOverlapping = allUnavailablePeriods.some((unavailable) => {
      // Condición de solapamiento:
      // El inicio de la cita prospecto es ANTES del fin del periodo ocupado 
      // Y el fin de la cita prospecto es DESPUÉS del inicio del periodo ocupado
      return (
        isBefore(currentSlotStart, unavailable.end) &&
        isAfter(currentSlotEnd, unavailable.start)
      );
    });

    // Si no hay solapamiento con ningún bloqueo o cita, es un slot disponible
    if (!isOverlapping) {
      availableSlots.push({
        start: currentSlotStart,
        end: currentSlotEnd
      });
    }

    // Avanzamos al siguiente slot candidato (ej., 30 minutos después)
    currentSlotStart = addMinutes(currentSlotStart, intervalMinutes);
  }

  return availableSlots;
}
