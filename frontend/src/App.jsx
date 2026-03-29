import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import MusicPlayer from './components/common/MusicPlayer'
import Layout from './components/layout/Layout'
import HomePage from './pages/home/HomePage'
import TeamsPage from './pages/teams/TeamsPage'
import PlayersPage from './pages/players/PlayersPage'
import MyTeamPage from './pages/squad/MyTeamPage'
import MatchesPage from './pages/matches/MatchesPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rutas de autenticación (sin Layout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rutas principales con Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="teams" element={<TeamsPage />} />
              <Route path="players" element={<PlayersPage />} />
              <Route path="matches" element={<MatchesPage />} />
              <Route path="my-team" element={<MyTeamPage />} />
            </Route>
          </Routes>
          <MusicPlayer />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

