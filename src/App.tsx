import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TourPage from './pages/TourPage'
import { ROUTES } from './constants'

const App = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.TOUR_DETAILS} element={<TourPage />} />
    </Routes>
  )
}
export default App
