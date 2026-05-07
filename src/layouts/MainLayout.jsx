import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import toast from 'react-hot-toast';

function MainLayout({ children }) {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const isAuthenticated =
    localStorage.getItem(
      'icadepro_admin'
    ) === 'true';

  // OCULTAR EN FICHAJES
  const isCheckinPage =
    location.pathname === '/' ||
    location.pathname === '/teacher-checkin';

  const handleLogout = () => {

    localStorage.removeItem(
      'icadepro_admin'
    );

    toast.success(
      'Sesión cerrada'
    );

    navigate('/login');
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor:
          '#f7f8fa',
        fontFamily:
          'Arial, Helvetica, sans-serif',
      }}
    >

      {/* SIDEBAR */}
      {!isCheckinPage && (
        <aside
          style={{
            width: '240px',
            backgroundColor:
              'white',
            borderRight:
              '1px solid #ececec',
            padding: '30px 20px',
            display: 'flex',
            flexDirection:
              'column',
            justifyContent:
              'space-between',
          }}
        >

          <div>

            {/* LOGO */}
            <div
              style={{
                textAlign: 'center',
                marginBottom: '40px',
              }}
            >

              <img
                src="/icadepro-logo.png"
                alt="IcadePro"
                style={{
                  width: '170px',
                  margin:
                    '0 auto 10px auto',
                  display: 'block',
                }}
              />

              <p
                style={{
                  color: '#9ca3af',
                  fontSize: '14px',
                }}
              >
                Sistema de fichajes
              </p>

            </div>

            {/* MENÚ */}
            <nav
              style={{
                display: 'flex',
                flexDirection:
                  'column',
                gap: '10px',
              }}
            >

              <Link
                to="/"
                style={linkStyle}
              >
                Inicio
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/admin"
                    style={linkStyle}
                  >
                    Administración
                  </Link>

                  <Link
                    to="/history"
                    style={linkStyle}
                  >
                    Historial
                  </Link>
                </>
              )}

            </nav>

          </div>

          {/* FOOTER */}
          {isAuthenticated && (
            <button
              onClick={
                handleLogout
              }
              style={{
                marginTop: '20px',
                padding: '14px',
                border: 'none',
                borderRadius:
                  '14px',
                backgroundColor:
                  '#111827',
                color: 'white',
                cursor:
                  'pointer',
                fontWeight:
                  '600',
              }}
            >
              Cerrar sesión
            </button>
          )}

        </aside>
      )}

      {/* CONTENIDO */}
      <main
        style={{
          flex: 1,
          padding:
            isCheckinPage
              ? '0px'
              : '35px',
        }}
      >

        {children}

      </main>

    </div>
  );
}

const linkStyle = {
  textDecoration: 'none',
  color: '#6b7280',
  padding: '14px 16px',
  borderRadius: '14px',
  fontWeight: '500',
  fontSize: '15px',
};

export default MainLayout;