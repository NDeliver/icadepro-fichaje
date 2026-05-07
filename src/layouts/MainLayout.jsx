import { Link, useLocation } from 'react-router-dom';

function MainLayout({ children }) {
  const location = useLocation();

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f5f7fb',
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#1f1f1f',
          color: 'white',
          padding: '30px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow:
            '2px 0 10px rgba(0,0,0,0.08)',
        }}
      >
        <div>
          {/* LOGO */}
          <div
            style={{
              marginBottom: '50px',
            }}
          >
            <h1
              style={{
                color: '#f47920',
                fontSize: '32px',
                margin: 0,
                fontWeight: '700',
              }}
            >
              IcadePro
            </h1>

            <p
              style={{
                color: '#999',
                marginTop: '8px',
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
              gap: '12px',
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
              Fichaje
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
              Histórico
            </Link>
          </nav>
        </div>

        {/* FOOTER */}
        <div
          style={{
            fontSize: '13px',
            color: '#777',
            borderTop:
              '1px solid rgba(255,255,255,0.08)',
            paddingTop: '20px',
          }}
        >
          © 2026 IcadePro
        </div>
      </aside>

      {/* CONTENIDO */}
      <main
        style={{
          flex: 1,
          padding: '40px',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '14px',
            padding: '20px 30px',
            marginBottom: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow:
              '0 2px 10px rgba(0,0,0,0.05)',
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: '28px',
                color: '#111827',
              }}
            >
              Panel de Control
            </h2>

            <p
              style={{
                margin: '5px 0 0 0',
                color: '#6b7280',
              }}
            >
              Gestión de fichajes y alumnos
            </p>
          </div>

          <div
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              backgroundColor: '#f47920',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px',
            }}
          >
            A
          </div>
        </div>

        {/* CONTENIDO DINÁMICO */}
        {children}
      </main>
    </div>
  );
}

const linkStyle = {
  color: '#d1d5db',
  textDecoration: 'none',
  fontSize: '16px',
  padding: '14px 18px',
  borderRadius: '10px',
  transition: '0.2s',
  fontWeight: '500',
};

const activeLink = {
  backgroundColor: '#f47920',
  color: 'white',
};

export default MainLayout;