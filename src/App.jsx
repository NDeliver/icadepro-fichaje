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
import TeacherHistoryPage from './pages/TeacherHistoryPage';
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

        {/* FICHAJE */}
        <Route
          path="/"
          element={
            <MainLayout>
              <CheckInPage />
            </MainLayout>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>

              <MainLayout>
                <AdminPage />
              </MainLayout>

            </ProtectedRoute>
          }
        />

        {/* HISTORIAL ALUMNOS */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>

              <MainLayout>
                <HistoryPage />
              </MainLayout>

            </ProtectedRoute>
          }
        />

        {/* HISTORIAL PROFESORES */}
        <Route
          path="/teacher-history"
          element={
            <ProtectedRoute>

              <MainLayout>
                <TeacherHistoryPage />
              </MainLayout>

            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;