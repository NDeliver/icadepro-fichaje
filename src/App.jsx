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
import TeacherCheckInPage from './pages/TeacherCheckInPage';

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

        {/* FICHAJE ALUMNOS */}
        <Route
          path="/"
          element={
            <MainLayout>
              <CheckInPage />
            </MainLayout>
          }
        />

        {/* FICHAJE PROFESORES */}
        <Route
          path="/teacher-checkin"
          element={
            <MainLayout>
              <TeacherCheckInPage />
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

        {/* HISTORY */}
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

      </Routes>

    </BrowserRouter>
  );
}

export default App;
