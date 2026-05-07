import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

function HistoryPage() {

  const [history, setHistory] =
    useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {

    // ALUMNOS
    const {
      data: checkinsData,
    } = await supabase
      .from('checkins')
      .select('*');

    // PROFESORES
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
              checkin.created_at,
            name: student
              ? student.full_name
              : 'Alumno',
            type:
              checkin.type,
            role: 'Alumno',
            course:
              checkin.course,
            classroom:
              checkin.classroom,
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
              teacher.created_at,
            name:
              teacher.teacher_name,
            type:
              teacher.type,
            role:
              'Profesor',
            course: '-',
            classroom: '-',
            created_at:
              teacher.created_at,
          };
        }
      );

    // UNIR Y ORDENAR
    const combined =
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

    setHistory(combined);
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