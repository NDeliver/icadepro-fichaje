import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

function HistoryPage() {
  const [checkins, setCheckins] =
    useState([]);

  useEffect(() => {
    fetchCheckins();
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
              s.dni_code ==
              checkin.code
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

  return (
    <div>
      <h1>
        Historial de Fichajes
      </h1>

      <div
        style={{
          marginTop: '20px',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          overflowX: 'auto',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>
                Alumno
              </th>

              <th style={thStyle}>
                Código
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
            {checkins.map((item) => (
              <tr key={item.created_at}>
                <td style={tdStyle}>
                  {item.student_name}
                </td>

                <td style={tdStyle}>
                  {item.code}
                </td>

                <td style={tdStyle}>
                  {item.course}
                </td>

                <td style={tdStyle}>
                  {item.classroom}
                </td>

                <td style={tdStyle}>
                  {item.type}
                </td>

                <td style={tdStyle}>
                  {new Date(
                    item.created_at
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '12px',
  borderBottom: '2px solid #ddd',
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #eee',
};

export default HistoryPage;
