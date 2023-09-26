import { Route, Routes } from 'react-router-dom';

// Router links
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'
import PageNotFound from './pages/PageNotFound'
import CartPage from './pages/CartPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './user/Dashboard';
import PrivateRoute from './components/Routes/Private';



function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="" element={<Dashboard />} />
        </Route>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signuppage' element={<SignupPage />} />
        <Route path='/cart' element={<CartPage />} />
        {/* <Route path='/signup' element={<SignUpPage />} /> */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
