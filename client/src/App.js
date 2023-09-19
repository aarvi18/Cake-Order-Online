import { Route, Routes } from 'react-router-dom';

// Router links
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'
import PageNotFound from './pages/PageNotFound'
import CartPage from './pages/CartPage';
import SignupPage from './pages/SignupPage';



function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
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
