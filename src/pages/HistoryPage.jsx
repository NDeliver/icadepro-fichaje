import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

import * as XLSX from 'xlsx';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function HistoryPage() {
  const [checkins, setCheckins] =
    useState([]);

  const [searchCode, setSearchCode] =
    useState('');

  const [filterCourse, setFilterCourse] =
    useState('');

  const [filterType, setFilterType] =
    useState('');

  useEffect(() => {
    fetchCheckins();
  }, []);

  const fetchCheckins = async () => {
    // FICHAJES
    const { data, error } =
      await supabase
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
      data.map((checkin) => {
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
      {/* HEADER */}
      <div
        style={{
          marginBottom: '35px',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '42px',
            color: '#111827',
          }}
        >
          Histórico y Reportes
        </h1>

        <p
          style={{
            marginTop: '10px',
            color: '#6b7280',
            fontSize: '16px',
          }}
        >
          Consulta y exporta el
          historial completo de
          fichajes.
        </p>
      </div>

      {/* CARD FILTROS */}
      <div style={filterCard}>
        <div style={filterGrid}>
          <input
            type="text"
            placeholder="Buscar alumno..."
            value={searchCode}
            onChange={(e) =>
              setSearchCode(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <select
            value={filterCourse}
            onChange={(e) =>
              setFilterCourse(
                e.target.value
              )
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
              setFilterType(
                e.target.value
              )
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

        {/* EXPORTAR */}
        <div
          style={{
            display: 'flex',
            gap: '15px',
            marginTop: '25px',
            flexWrap: 'wrap',
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
      </div>

      {/* TABLA */}
      <div style={tableCard}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor:
                  '#f47920',
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
                <tr
                  key={item.id}
                  style={{
                    transition:
                      '0.2s',
                  }}
                >
                  <td style={tdStyle}>
                    <strong>
                      {
                        item.student_name
                      }
                    </strong>
                  </td>

                  <td style={tdStyle}>
                    {item.course}
                  </td>

                  <td style={tdStyle}>
                    {item.classroom}
                  </td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        ...badgeStyle,
                        backgroundColor:
                          item.type ===
                          'Entrada'
                            ? '#dcfce7'
                            : '#fee2e2',

                        color:
                          item.type ===
                          'Entrada'
                            ? '#166534'
                            : '#991b1b',
                      }}
                    >
                      {item.type}
                    </span>
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

const filterCard = {
  backgroundColor: 'white',
  padding: '28px',
  borderRadius: '30px',
  border: '1px solid #ececec',
  boxShadow:
    '0 4px 20px rgba(0,0,0,0.03)',
  marginBottom: '24px',
};

const filterGrid = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '16px',
};

const inputStyle = {
  padding: '18px',
  borderRadius: '18px',
  border: '1px solid #ececec',
  fontSize: '15px',
  outline: 'none',
  backgroundColor: '#fafafa',
};

const excelButton = {
  padding: '16px 22px',
  backgroundColor: '#217346',
  color: 'white',
  border: 'none',
  borderRadius: '18px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '15px',
};

const pdfButton = {
  padding: '16px 22px',
  backgroundColor: '#d32f2f',
  color: 'white',
  border: 'none',
  borderRadius: '18px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '15px',
};

const tableCard = {
  backgroundColor: 'white',
  borderRadius: '30px',
  overflowX: 'auto',
  border: '1px solid #ececec',
  boxShadow:
    '0 4px 20px rgba(0,0,0,0.03)',
};

const thStyle = {
  padding: '22px',
  textAlign: 'left',
  fontSize: '14px',
  fontWeight: '700',
};

const tdStyle = {
  padding: '22px',
  borderBottom: '1px solid #f5f5f5',
  color: '#374151',
  fontSize: '15px',
};

const badgeStyle = {
  padding: '10px 16px',
  borderRadius: '999px',
  fontSize: '13px',
  fontWeight: '700',
};
export default HistoryPage;