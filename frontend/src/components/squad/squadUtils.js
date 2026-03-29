// Calcula un rating entre 50-99 basado en estadísticas del jugador
export function calculatePlayerRating(player) {
  try {
    const stats = typeof player.statistics === 'string'
      ? JSON.parse(player.statistics || '{}')
      : (player.statistics || {})

    const goalsScore   = (stats.goals       || 0) * 0.4
    const assistsScore = (stats.assists     || 0) * 0.3
    const matchesScore = (stats.matches     || 0) * 0.2
    const cardsScore   = ((stats.yellowCards || 0) + (stats.redCards || 0) * 2) * -0.1

    const rating = Math.min(99, Math.max(50, 75 + goalsScore + assistsScore + matchesScore + cardsScore))
    return Math.round(rating)
  } catch {
    return 75
  }
}

// Devuelve color de fondo de la carta según rating
export function getRatingColor(rating) {
  if (rating >= 90) return '#FFD700' // Dorado
  if (rating >= 80) return '#C0C0C0' // Plata
  return '#CD7F32'                   // Bronce
}

// Abrevia nombre del jugador: "Lionel Messi" → "L. Messi"
export function abbreviateName(firstName, lastName) {
  if (!firstName && !lastName) return 'Desconocido'
  if (!firstName) return lastName
  return `${firstName.charAt(0)}. ${lastName}`
}
