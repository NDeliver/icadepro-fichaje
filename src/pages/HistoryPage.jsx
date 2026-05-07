import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

function HistoryPage() {

  const [history, setHistory] =
    useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {

    // FICHAJES ALUMNOS
    const {
      data: checkinsData,
      error,
    } = await supabase
      .from('checkins')
      .select('*');

    if (error) {
      console.error(error);
      return;
    }

    // FICHAJES PROFESORES
    const {
      data: teacherData,
    } = await supabase
      .from('teacher_checkins')
      .select('*');

    // ALUMNOS
    const { data: studentsData } =
      await supabase
        .from('students')
        .select('*');

    // FORMATEAR ALUMNOS
    const studentHistory =
      checkinsData.map(
        (checkin) => {

          const student =
            studentsData.find(
              (s) =>
                String(
                  s.dni_code
                ) ===
                String(
                  checkin.code
                )
            );

          return {
            id:
              checkin.created_at +
              checkin.code,

            name: student
              ? student.full_name
              : 'Alumno',

            role: 'Alumno',

            course:
              checkin.course,

            classroom:
              checkin.classroom,

            type:
              checkin.type,

            teacher:
              checkin.teacher,

            created_at:
              checkin.created_at,
          };
        }
      );

    // FORMATEAR PROFESORES
    const teacherHistory =
      teacherData.map(
        (teacher) => {

          return {
            id:
              teacher.created_at +
              teacher.teacher_code,

            name:
              teacher.teacher_name,

            role:
              'Profesor',

            course: '-',

            classroom: '-',

            type:
              teacher.type,

            teacher: '-',

            created_at:
              teacher.created_at,
          };
        }
      );

    // UNIR HISTORIAL
    const combinedHistory =
      [
        ...studentHistory,
        ...teacherHistory,
      ].sort(
        (a, b) =>
          new Date(
            b.created_at
          ) -
          new Date(
            a.created_at
          )
      );

    setHistory(
      combinedHistory
    );
  };

  return (
    <div>

      <h1>
        Historial de Fichajes
      </h1>

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
                Nombre
              </th>

              <th style={thStyle}>
                Rol
              </th>

              <th style={thStyle}>
                Docente
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
                Fecha
              </th>

            </tr>

          </thead>

          <tbody>

            {history.map(
              (item) => (

                <tr key={item.id}>

                  <td style={tdStyle}>
                    {item.name}
                  </td>

                  <td style={tdStyle}>
                    {item.role}
                  </td>

                  <td style={tdStyle}>
                    {item.teacher}
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
                    {new Date(
                      item.created_at
                    ).toLocaleString(
                      'es-ES'
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
