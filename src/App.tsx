import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import TourDetails from './pages/TourDetails'
import { ROUTES } from './constants'

const App = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.TOUR_DETAILS} element={<TourDetails />} />
    </Routes>
  )
}
export default App
