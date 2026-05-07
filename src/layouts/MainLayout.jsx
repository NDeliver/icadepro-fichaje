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
    backgroundColor:
      'white',
    borderRight:
      '1px solid #ececec',
    padding: '30px 20px',
    display: 'flex',
    flexDirection:
      'column',
    position: 'relative',
    flexShrink: 0,
  }}
>

  {/* CONTENIDO SUPERIOR */}
  <div>

    {/* LOGO */}
    <div
      style={{
        textAlign: 'center',
        marginBottom: '50px',
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
        flexDirection:
          'column',
        gap: '10px',
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
        </>
      )}

    </nav>

  </div>

  {/* BOTÓN FIJO */}
  {isAuthenticated && (
    <div
      style={{
        position: 'absolute',
        top: '255px',
        left: '20px',
        right: '20px',
      }}
    >
      <button
        onClick={
          handleLogout
        }
        style={{
          width: '100%',
          height: '48px',
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
        }}
      >
        Cerrar sesión
      </button>
    </div>
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
  transition: '0.2s',
};

const activeLink = {
  backgroundColor:
    '#fff4ec',
  color: '#f47920',
};

export default MainLayout;