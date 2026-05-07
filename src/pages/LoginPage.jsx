import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function LoginPage() {
  const [password, setPassword] =
    useState('');

  const navigate = useNavigate();

  const handleLogin = () => {
    // CONTRASEÑA ADMIN
    if (password === 'admin123') {
      localStorage.setItem(
        'icadepro_admin',
        'true'
      );

      toast.success(
        'Sesión iniciada'
      );

      navigate('/admin');

      return;
    }

    toast.error(
      'Contraseña incorrecta'
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f8fa',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'white',
          borderRadius: '30px',
          padding: '40px',
          border: '1px solid #ececec',
          boxShadow:
            '0 4px 20px rgba(0,0,0,0.03)',
        }}
      >
        {/* LOGO */}
        <div
          style={{
            marginBottom: '35px',
            textAlign: 'center',
          }}
        >
          <img
  src="/icadepro-logo.png"
  alt="IcadePro"
  style={{
    width: '240px',
    objectFit: 'contain',
    marginBottom: '0px',
  }}
/>

          <p
            style={{
              color: '#6b7280',
              marginTop: '0px',
            }}
          >
            Acceso administrador
          </p>
        </div>

        {/* PASSWORD */}
        <div
          style={{
            marginBottom: '20px',
          }}
        >
          <label
            style={{
              display: 'block',
              marginBottom: '10px',
              color: '#6b7280',
              fontWeight: '600',
            }}
          >
            Contraseña
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            placeholder="Introduce la contraseña"
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '18px',
              border:
                '1px solid #ececec',
              backgroundColor:
                '#fafafa',
              fontSize: '16px',
              boxSizing:
                'border-box',
              outline: 'none',
            }}
          />
        </div>

        {/* BOTÓN */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '20px',
            border: 'none',
            borderRadius: '20px',
            backgroundColor:
              '#f47920',
            color: 'white',
            fontSize: '17px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow:
              '0 8px 20px rgba(244,121,32,0.20)',
          }}
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}

export default LoginPage;