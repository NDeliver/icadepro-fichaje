import { Link, useLocation } from 'react-router-dom';

function MainLayout({ children }) {
  const location = useLocation();

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f7f8fa',
        fontFamily:
          'Arial, Helvetica, sans-serif',
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: '240px',
          backgroundColor: 'white',
          borderRight:
            '1px solid #ececec',
          padding: '30px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent:
            'space-between',
        }}
      >
        <div>
          {/* LOGO */}
          <div
            style={{
              marginBottom: '45px',
            }}
          >
            <h1
              style={{
                color: '#f47920',
                fontSize: '30px',
                margin: 0,
                fontWeight: '700',
              }}
            >
              IcadePro
            </h1>

            <p
              style={{
                color: '#9ca3af',
                marginTop: '6px',
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
              flexDirection: 'column',
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
        {/* TOPBAR */}
        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center',
            marginBottom: '30px',
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: '34px',
                color: '#111827',
                fontWeight: '700',
              }}
            >
              Panel principal
            </h2>

            <p
              style={{
                marginTop: '8px',
                color: '#9ca3af',
                fontSize: '15px',
              }}
            >
              Gestión académica y
              control de fichajes
            </p>
          </div>

          {/* PERFIL */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              backgroundColor: 'white',
              padding:
                '10px 16px',
              borderRadius: '18px',
              border:
                '1px solid #ececec',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor:
                  '#f47920',
                display: 'flex',
                alignItems:
                  'center',
                justifyContent:
                  'center',
                color: 'white',
                fontWeight: '700',
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

        {/* CONTENIDO */}
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
  backgroundColor: '#fff4ec',
  color: '#f47920',
};

export default MainLayout;