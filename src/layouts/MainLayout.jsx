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
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundColor:
              'white',
            borderRight:
              '1px solid #ececec',
            padding: '30px 20px',
            boxSizing: 'border-box',
            overflowY: 'auto',
            overflowX: 'hidden',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >

          {/* LOGO */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '50px',
              flexShrink: 0,
            }}
          >

            <img
              src="/icadepro-logo.png"
              alt="Logo"
              style={{
                width: '170px',
                display: 'block',
                margin: '0 auto',
              }}
            />

            <p
              style={{
                color: '#9ca3af',
                fontSize: '14px',
                marginTop: '10px',
              }}
            >
              Sistema de fichajes
            </p>

          </div>

          {/* MENÚ */}
          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              flexShrink: 0,
            }}
          >

            <Link
              to="/"
              style={{
                ...linkStyle,
                ...(location.pathname === '/'
                  ? activeLink
                  : {}),
              }}
            >
              Inicio
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/admin"
                  style={{
                    ...linkStyle,
                    ...(location.pathname === '/admin'
                      ? activeLink
                      : {}),
                  }}
                >
                  Administración
                </Link>

                <Link
                  to="/history"
                  style={{
                    ...linkStyle,
                    ...(location.pathname === '/history'
                      ? activeLink
                      : {}),
                  }}
                >
                  Historial
                </Link>

                <button
                  onClick={
                    handleLogout
                  }
                  style={{
                    width: '100%',
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
                    fontSize: '14px',
                    marginTop: '10px',
                    flexShrink: 0,
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
          marginLeft:
            isCheckinPage
              ? '0px'
              : '240px',
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

const activeLink = {
  backgroundColor:
    '#fff4ec',
  color: '#f47920',
};

export default MainLayout;