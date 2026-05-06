import { Link } from 'react-router-dom';

function MainLayout({ children }) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: '250px',
          backgroundColor: '#555555',
          color: 'white',
          padding: '20px',
        }}
      >
        <h2 style={{ marginBottom: '30px', color: '#f47920' }}>
          IcadePro
        </h2>

        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}
        >
          <Link to="/" style={linkStyle}>
            Fichaje
          </Link>

          <Link to="/admin" style={linkStyle}>
            Administración
          </Link>

          <Link to="/history" style={linkStyle}>
            Histórico
          </Link>
        </nav>
      </aside>

      {/* Contenido */}
      <main
        style={{
          flex: 1,
          padding: '30px',
        }}
      >
        {children}
      </main>
    </div>
  );
}

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '16px',
};

export default MainLayout;
