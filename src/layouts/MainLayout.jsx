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
          }}
        >

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
                  }}
                >
                  Cerrar sesión
                </button>
              </>
            )}

          </nav>

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

        {/* HEADER ADMIN */}
        {!isCheckinPage &&
          isAuthenticated && (
          <div
            style={{
              display: 'flex',
              marginBottom:
                '30px',
            }}
          >

            <div
              style={{
                display: 'flex',
                alignItems:
                  'center',
                gap: '14px',
                backgroundColor:
                  'white',
                padding:
                  '10px 16px',
                borderRadius:
                  '18px',
                border:
                  '1px solid #ececec',
              }}
            >

              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius:
                    '50%',
                  backgroundColor:
                    '#f47920',
                  display: 'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                  color: 'white',
                  fontWeight:
                    '700',
                }}
              >
                A
              </div>

              <div>

                <div
                  style={{
                    fontSize:
                      '14px',
                    fontWeight:
                      '600',
                    color:
                      '#111827',
                  }}
                >
                  Administrador
                </div>

                <div
                  style={{
                    fontSize:
                      '12px',
                    color:
                      '#9ca3af',
                  }}
                >
                  IcadePro
                </div>

              </div>

            </div>

          </div>
        )}

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
};

export default MainLayout;