import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

function HistoryPage() {

  const [checkins, setCheckins] =
    useState([]);

  const [teacherCheckins,
    setTeacherCheckins] =
    useState([]);

  const [startDate, setStartDate] =
    useState('');

  const [endDate, setEndDate] =
    useState('');

  useEffect(() => {
    fetchCheckins();
    fetchTeacherCheckins();
  }, []);

  // HISTORIAL ALUMNADO
  const fetchCheckins = async () => {

    const {
      data: checkinsData,
      error,
    } = await supabase
      .from('checkins')
      .select('*')
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return;
    }

    const { data: studentsData } =
      await supabase
        .from('students')
        .select('*');

    const formattedCheckins =
      checkinsData.map((checkin) => {

        const student =
          studentsData.find(
            (s) =>
              String(s.dni_code) ===
              String(checkin.code)
          );

        return {
          ...checkin,
          student_name: student
            ? student.full_name
            : 'No encontrado',
        };
      });

    setCheckins(formattedCheckins);
  };

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
  const filteredCheckins =
    checkins.filter((item) => {

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
    });

  return (
    <div>

      <h1>
        Historial de Fichajes
      </h1>

      <div
  style={{
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
    marginBottom: '20px',
  }}
>

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

      {/* FILTROS */}
      <div
        style={{
          display: 'flex',
          gap: '15px',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >

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

      {/* HISTORIAL ALUMNADO */}
      <div
        style={{
          marginTop: '20px',
          backgroundColor:
            'white',
          padding: '20px',
          borderRadius: '10px',
          overflowX: 'auto',
        }}
      >

        <h2
          style={{
            marginTop: 0,
            marginBottom: '20px',
          }}
        >
          Historial Alumnado
        </h2>

        <table
          style={{
            width: '100%',
            borderCollapse:
              'collapse',
          }}
        >

          <thead>

            <tr>

              <th style={thStyle}>
                Alumno
              </th>

              <th style={thStyle}>
                Curso
              </th>

              <th style={thStyle}>
                Aula
              </th>

              <th style={thStyle}>
                Tipo
              </th>

              <th style={thStyle}>
                Fecha/Hora
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredCheckins.map(
              (item) => (

                <tr
                  key={
                    item.created_at
                  }
                >

                  <td style={tdStyle}>
                    {
                      item.student_name
                    }
                  </td>

                  <td style={tdStyle}>
                    {item.course}
                  </td>

                  <td style={tdStyle}>
                    {
                      item.classroom
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

      {/* HISTORIAL PROFESORADO */}
      <div
        style={{
          marginTop: '30px',
          backgroundColor:
            'white',
          padding: '20px',
          borderRadius: '10px',
          overflowX: 'auto',
        }}
      >

        <h2
          style={{
            marginTop: 0,
            marginBottom: '20px',
          }}
        >
          Historial Profesorado
        </h2>

        <table
          style={{
            width: '100%',
            borderCollapse:
              'collapse',
          }}
        >

          <thead>

            <tr>

              <th style={thStyle}>
                Profesor
              </th>

              <th style={thStyle}>
                Tipo
              </th>

              <th style={thStyle}>
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

const thStyle = {
  textAlign: 'left',
  padding: '12px',
  borderBottom:
    '2px solid #ddd',
};

const tdStyle = {
  padding: '12px',
  borderBottom:
    '1px solid #eee',
};

const inputStyle = {
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid #ddd',
  fontSize: '14px',
};

export default HistoryPage;