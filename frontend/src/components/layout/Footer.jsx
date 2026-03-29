function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-uefa-dark border-t-2 border-uefa-gold mt-auto">
      <div className="container-uefa py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1: Información */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">⚽</span>
              <h3 className="text-xl font-bold text-gold-gradient">FIFPRO2K26</h3>
            </div>
            <p className="text-uefa-silver text-sm">
              Plataforma de gestión de la UEFA Champions League. 
              Gestiona equipos, jugadores y partidos del torneo más prestigioso de Europa.
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h4 className="text-uefa-gold font-bold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="/teams" className="text-uefa-silver hover:text-uefa-gold transition-colors duration-300">
                  Equipos
                </a>
              </li>
              <li>
                <a href="/players" className="text-uefa-silver hover:text-uefa-gold transition-colors duration-300">
                  Jugadores
                </a>
              </li>
              <li>
                <a href="/matches" className="text-uefa-silver hover:text-uefa-gold transition-colors duration-300">
                  Partidos
                </a>
              </li>
              <li>
                <a href="/stats" className="text-uefa-silver hover:text-uefa-gold transition-colors duration-300">
                  Estadísticas
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Redes sociales */}
          <div>
            <h4 className="text-uefa-gold font-bold mb-4">Síguenos</h4>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-uefa-blue hover:bg-uefa-light-blue flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <span className="text-white text-xl">f</span>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-uefa-blue hover:bg-uefa-light-blue flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <span className="text-white text-xl">𝕏</span>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-uefa-blue hover:bg-uefa-light-blue flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <span className="text-white text-xl">📷</span>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-uefa-blue hover:bg-uefa-light-blue flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <span className="text-white text-xl">▶</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-uefa-blue mt-8 pt-6 text-center">
          <p className="text-uefa-silver text-sm">
            © {currentYear} FIFPRO2K26. Todos los derechos reservados. 
            <span className="text-uefa-gold ml-2">⭐</span>
          </p>
          <p className="text-uefa-silver text-xs mt-2">
            Desarrollado con ❤️ para los amantes del fútbol
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
