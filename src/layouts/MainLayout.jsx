import {
  useNavigate,
} from 'react-router-dom';

import toast from 'react-hot-toast';

function MainLayout({
  children,
}) {

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
          width: '260px',
          backgroundColor:
            'white',
          borderRight:
            '1px solid #ececec',
          display: 'flex',
          flexDirection:
            'column',
          justifyContent:
            'center',
          alignItems:
            'center',
          padding:
            '40px 20px',
        }}
      >

        {/* LOGO */}
        <div
          style={{
            textAlign:
              'center',
          }}
        >

          <img
            src="/icadepro-logo.png"
            alt="IcadePro"
            style={{
              width: '180px',
              objectFit:
                'contain',
              marginBottom:
                '20px',
            }}
          />

          <p
            style={{
              color:
                '#9ca3af',
              fontSize:
                '15px',
              margin: 0,
            }}
          >
            Sistema de fichajes
          </p>

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

          <div>

            <h2
              style={{
                margin: 0,
                fontSize:
                  '34px',
                color:
                  '#111827',
                fontWeight:
                  '700',
              }}
            >
              Panel principal
            </h2>

            <p
              style={{
                marginTop: '8px',
                color:
                  '#9ca3af',
                fontSize:
                  '15px',
              }}
            >
              Gestión académica y
              control de fichajes
            </p>

          </div>

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

        {/* LOGOUT */}
        {isAuthenticated && (
          <button
            onClick={
              handleLogout
            }
            style={{
              position:
                'fixed',
              bottom: '20px',
              left: '20px',
              padding:
                '14px 18px',
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

      </main>

    </div>
  );
}

export default MainLayout;
