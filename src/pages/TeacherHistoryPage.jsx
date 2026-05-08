import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

function TeacherHistoryPage() {

  const [teacherCheckins,
    setTeacherCheckins] =
    useState([]);

  const [startDate,
    setStartDate] =
    useState('');

  const [endDate,
    setEndDate] =
    useState('');

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

  // FILTRAR FECHAS
  const filteredTeacherCheckins =
    teacherCheckins.filter(
      (item) => {

        if (
          !startDate &&
          !endDate
        ) {
          return true;
        }

        const itemDate =
          new Date(
            item.created_at
          );

        const start =
          startDate
            ? new Date(startDate)
            : null;

        const end =
          endDate
            ? new Date(
                endDate +
                'T23:59:59'
              )
            : null;

        if (
          start &&
          itemDate < start
        ) {
          return false;
        }

        if (
          end &&
          itemDate > end
        ) {
          return false;
        }

        return true;
      }
    );

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

      {/* FILTROS */}
      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '30px',
          borderRadius: '30px',
          marginBottom: '30px',
        }}
      >

        <div
          style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
          }}
        >

          <div>

            <label
              style={labelStyle}
            >
              Fecha desde
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(
                  e.target.value
                )
              }
              style={inputStyle}
            />

          </div>

          <div>

            <label
              style={labelStyle}
            >
              Fecha hasta
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(
                  e.target.value
                )
              }
              style={inputStyle}
            />

          </div>

        </div>

      </div>

      {/* TABLA */}
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

            {filteredTeacherCheckins.map(
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

const inputStyle = {
  padding: '16px',
  borderRadius: '14px',
  border: '1px solid #d1d5db',
  fontSize: '15px',
  minWidth: '220px',
  backgroundColor: 'white',
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  color: '#374151',
};

export default TeacherHistoryPage;