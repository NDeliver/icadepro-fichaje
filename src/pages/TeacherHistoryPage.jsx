import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

function TeacherHistoryPage() {

  const [teacherCheckins,
    setTeacherCheckins] =
    useState([]);

  useEffect(() => {
    fetchTeacherCheckins();
  }, []);

  // HISTORIAL PROFESORADO
  const fetchTeacherCheckins =
    async () => {

      const {
        data,
        error,
      } = await supabase
        .from(
          'teacher_checkins'
        )
        .select('*')
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        console.error(error);
        return;
      }

      setTeacherCheckins(data);
    };

  // FORMATEAR FECHA
  const formatDate = (
    date
  ) => {

    return new Date(
      date
    ).toLocaleString(
      'es-ES',
      {
        timeZone:
          'Atlantic/Canary',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }
    );
  };

  return (
    <div>

      <h1
        style={{
          fontSize: '48px',
          marginBottom: '10px',
          color: '#111827',
        }}
      >
        Historial Profesorado
      </h1>

      <p
        style={{
          color: '#6b7280',
          marginBottom: '30px',
          fontSize: '18px',
        }}
      >
        Consulta el historial completo de fichajes del profesorado.
      </p>

      <div
        style={tableContainer}
      >

        <table
          style={tableStyle}
        >

          <thead
            style={{
              backgroundColor:
                '#f47920',
              color: 'white',
            }}
          >

            <tr>

              <th
                style={{
                  ...thStyle,
                  borderTopLeftRadius:
                    '20px',
                }}
              >
                Profesor
              </th>

              <th style={thStyle}>
                Tipo
              </th>

              <th
                style={{
                  ...thStyle,
                  borderTopRightRadius:
                    '20px',
                }}
              >
                Fecha/Hora
              </th>

            </tr>

          </thead>

          <tbody>

            {teacherCheckins.map(
              (item) => (

                <tr
                  key={
                    item.created_at
                  }
                >

                  <td style={tdStyle}>
                    {
                      item.teacher_name
                    }
                  </td>

                  <td style={tdStyle}>
                    {item.type}
                  </td>

                  <td style={tdStyle}>
                    {formatDate(
                      item.created_at
                    )}
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

const tableContainer = {
  backgroundColor: 'white',
  borderRadius: '30px',
  overflow: 'hidden',
  boxShadow:
    '0 4px 20px rgba(0,0,0,0.03)',
};

const tableStyle = {
  width: '100%',
  borderCollapse:
    'collapse',
};

const thStyle = {
  textAlign: 'left',
  padding: '18px',
  color: 'white',
  fontWeight: '700',
};

const tdStyle = {
  padding: '18px',
  borderBottom:
    '1px solid #f1f1f1',
  backgroundColor: 'white',
};

export default TeacherHistoryPage;