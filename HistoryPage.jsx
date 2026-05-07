import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

function HistoryPage() {

  const [checkins, setCheckins] =
    useState([]);

  const [teacherCheckins,
    setTeacherCheckins] =
    useState([]);

  useEffect(() => {
    fetchCheckins();
    fetchTeacherCheckins();
  }, []);

  const fetchCheckins = async () => {

    // FICHAJES
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

    // ALUMNOS
    const { data: studentsData } =
      await supabase
        .from('students')
        .select('*');

    // UNIR DATOS
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

  // PROFESORES
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

  // FORMATEAR FECHA CANARIAS
  const formatCanaryDate = (
    date
  ) => {

    const d = new Date(date);

    d.setHours(
      d.getHours() + 1
    );

    return d.toLocaleString(
      'es-ES'
    );
  };

  return (
    <div>

      <h1>
        Historial de Fichajes
      </h1>

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

            {checkins.map(
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
                    {formatCanaryDate(
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
                    {formatCanaryDate(
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

export default HistoryPage;