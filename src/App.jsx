import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

import CheckInPage from './pages/CheckInPage';
import AdminPage from './pages/AdminPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';

// PROTEGER RUTAS
function ProtectedRoute({
  children,
}) {
  const isAuthenticated =
    localStorage.getItem(
      'icadepro_admin'
    ) === 'true';

  return isAuthenticated
    ? children
    : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* APP */}
        <Route
          path="*"
          element={
            <MainLayout>
              <Routes>
                <Route
                  path="/"
                  element={
                    <CheckInPage />
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <HistoryPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;