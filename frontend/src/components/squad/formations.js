// Definición de formaciones: posiciones y coordenadas en el campo
// top: distancia desde arriba (100% = fondo del campo/arco propio)
// Jugadores subidos ~7%, laterales más al centro para evitar solapamiento
export const FORMATIONS = {
  '4-3-3': {
    label: '4-3-3 (Ataque)',
    positions: {
      GK:  { top: '80%', left: '50%', label: 'POR' },
      LB:  { top: '68%', left: '14%', label: 'LI' },
      CB1: { top: '68%', left: '34%', label: 'DFC' },
      CB2: { top: '68%', left: '66%', label: 'DFC' },
      RB:  { top: '68%', left: '86%', label: 'LD' },
      CM1: { top: '47%', left: '24%', label: 'MC' },
      CM2: { top: '50%', left: '50%', label: 'MC' },
      CM3: { top: '47%', left: '76%', label: 'MC' },
      LW:  { top: '18%', left: '17%', label: 'EI' },
      ST:  { top: '10%', left: '50%', label: 'DC' },
      RW:  { top: '18%', left: '83%', label: 'ED' },
    },
  },
  '4-2-3-1': {
    label: '4-2-3-1 (Equilibrado)',
    positions: {
      GK:   { top: '80%', left: '50%', label: 'POR' },
      LB:   { top: '68%', left: '14%', label: 'LI' },
      CB1:  { top: '68%', left: '34%', label: 'DFC' },
      CB2:  { top: '68%', left: '66%', label: 'DFC' },
      RB:   { top: '68%', left: '86%', label: 'LD' },
      CDM1: { top: '45%', left: '34%', label: 'MCD' },
      CDM2: { top: '45%', left: '66%', label: 'MCD' },
      CAM1: { top: '31%', left: '17%', label: 'MCO' },
      CAM2: { top: '27%', left: '50%', label: 'MCO' },
      CAM3: { top: '31%', left: '83%', label: 'MCO' },
      ST:   { top: '10%', left: '50%', label: 'DC' },
    },
  },
  '4-2-4': {
    label: '4-2-4 (Ultra Ataque)',
    positions: {
      GK:  { top: '80%', left: '50%', label: 'POR' },
      LB:  { top: '68%', left: '14%', label: 'LI' },
      CB1: { top: '68%', left: '34%', label: 'DFC' },
      CB2: { top: '68%', left: '66%', label: 'DFC' },
      RB:  { top: '68%', left: '86%', label: 'LD' },
      CM1: { top: '45%', left: '34%', label: 'MC' },
      CM2: { top: '45%', left: '66%', label: 'MC' },
      LW:  { top: '25%', left: '14%', label: 'EI' },
      ST1: { top: '20%', left: '36%', label: 'DC' },
      ST2: { top: '20%', left: '64%', label: 'DC' },
      RW:  { top: '25%', left: '86%', label: 'ED' },
    },
  },
}

export const FORMATION_LIST = Object.keys(FORMATIONS)
