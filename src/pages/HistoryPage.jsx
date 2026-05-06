import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

import * as XLSX from 'xlsx';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function HistoryPage() {
  const [checkins, setCheckins] = useState([]);

  const [searchCode, setSearchCode] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchCheckins();
  }, []);

  const fetchCheckins = async () => {
    // FICHAJES
    const { data, error } = await supabase
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
    const formattedCheckins = data.map(
      (checkin) => {
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
      }
    );

    setCheckins(formattedCheckins);
  };

  const filteredCheckins =
    checkins.filter((item) => {
      const matchesCode =
        item.student_name
          .toLowerCase()
          .includes(
            searchCode.toLowerCase()
          );

      const matchesCourse =
        filterCourse === '' ||
        item.course === filterCourse;

      const matchesType =
        filterType === '' ||
        item.type === filterType;

      return (
        matchesCode &&
        matchesCourse &&
        matchesType
      );
    });

  // EXPORTAR EXCEL
  const exportExcel = () => {
    const data = filteredCheckins.map(
      (item) => ({
        Alumno: item.student_name,
        Curso: item.course,
        Aula: item.classroom,
        Tipo: item.type,
        Fecha: new Date(
          item.created_at
        ).toLocaleString(),
      })
    );

    const worksheet =
      XLSX.utils.json_to_sheet(data);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Fichajes'
    );

    XLSX.writeFile(
      workbook,
      'historico-fichajes.xlsx'
    );
  };

  // EXPORTAR PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text(
      'Histórico de Fichajes',
      14,
      15
    );

    autoTable(doc, {
      startY: 25,
      head: [
        [
          'Alumno',
          'Curso',
          'Aula',
          'Tipo',
          'Fecha',
        ],
      ],
      body: filteredCheckins.map(
        (item) => [
          item.student_name,
          item.course,
          item.classroom,
          item.type,
          new Date(
            item.created_at
          ).toLocaleString(),
        ]
      ),
    });

    doc.save(
      'historico-fichajes.pdf'
    );
  };

  return (
    <div>
      <h1>Histórico y Reportes</h1>

      {/* Filtros */}
      <div
        style={{
          marginTop: '20px',
          marginBottom: '20px',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder="Buscar alumno"
          value={searchCode}
          onChange={(e) =>
            setSearchCode(e.target.value)
          }
          style={inputStyle}
        />

        <select
          value={filterCourse}
          onChange={(e) =>
            setFilterCourse(e.target.value)
          }
          style={inputStyle}
        >
          <option value="">
            Todos los cursos
          </option>

          <option value="Marketing Digital">
            Marketing Digital
          </option>

          <option value="Diseño Web">
            Diseño Web
          </option>

          <option value="Excel Avanzado">
            Excel Avanzado
          </option>
        </select>

        <select
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value)
          }
          style={inputStyle}
        >
          <option value="">
            Todos
          </option>

          <option value="Entrada">
            Entrada
          </option>

          <option value="Salida">
            Salida
          </option>
        </select>
      </div>

      {/* Botones exportación */}
      <div
        style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={exportExcel}
          style={excelButton}
        >
          Descargar Excel
        </button>

        <button
          onClick={exportPDF}
          style={pdfButton}
        >
          Descargar PDF
        </button>
      </div>

      {/* Tabla */}
      <div
        style={{
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
            <tr
              style={{
                backgroundColor: '#f47920',
                color: 'white',
              }}
            >
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
                Fecha
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredCheckins.map(
              (item) => (
                <tr key={item.id}>
                  <td style={tdStyle}>
                    {item.student_name}
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
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  minWidth: '200px',
};

const excelButton = {
  padding: '12px 18px',
  backgroundColor: '#217346',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const pdfButton = {
  padding: '12px 18px',
  backgroundColor: '#d32f2f',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const thStyle = {
  padding: '12px',
  textAlign: 'left',
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #ddd',
};

export default HistoryPage;
