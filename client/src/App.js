import { Route, Routes } from 'react-router-dom';

// Router links
import HomePage from './pages/HomePage';
import PageNotFound from './pages/PageNotFound'


function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
