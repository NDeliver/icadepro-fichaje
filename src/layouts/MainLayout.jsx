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
  'center',
        }}
      >

        <div>

          {/* LOGO */}
          <div
            style={{
              marginBottom:
                '45px',
              textAlign:
                'center',
            }}
          >

            <img
              src="/icadepro-logo.png"
              alt="IcadePro"
              style={{
                width: '180px',
                display:
                  'block',
                margin:
                  '0 auto',
              }}
            />

            <p
              style={{
                color:
                  '#9ca3af',
                marginTop:
                  '10px',
                fontSize:
                  '14px',
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
              style={{
                ...linkStyle,
                ...(location.pathname ===
                '/'
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
                    ...(location.pathname ===
                    '/admin'
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
                    ...(location.pathname ===
                    '/history'
                      ? activeLink
                      : {}),
                  }}
                >
                  Historial
                </Link>

              </>
            )}

          </nav>

        </div>

        {/* FOOTER */}
        <div
          style={{
            paddingTop: '20px',
            borderTop:
              '1px solid #f1f1f1',
          }}
        >

          {isAuthenticated && (
            <button
              onClick={
                handleLogout
              }
              style={{
                width: '100%',
                padding: '14px',
                marginBottom:
                  '16px',
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
                fontSize:
                  '14px',
              }}
            >
              Cerrar sesión
            </button>
          )}

          <div
            style={{
              fontSize: '13px',
              color: '#9ca3af',
            }}
          >
            © 2026 IcadePro
          </div>

        </div>

      </aside>

      {/* CONTENIDO */}
      <main
        style={{
          flex: 1,
          padding: '35px',
        }}
      >

        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems:
              'center',
            marginBottom:
              '30px',
          }}
        >

          <div />

          {isAuthenticated && (
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
          )}

        </div>

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
  fontSize: '15px',
  fontWeight: '500',
  transition: '0.2s',
};

const activeLink = {
  backgroundColor:
    '#fff4ec',
  color: '#f47920',
};

export default MainLayout;
