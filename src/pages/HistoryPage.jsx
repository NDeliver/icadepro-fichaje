import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function HistoryPage() {

  const [checkins, setCheckins] =
    useState([]);

  const [startDate, setStartDate] =
    useState('');

  const [endDate, setEndDate] =
    useState('');

  const [searchStudent,
    setSearchStudent] =
    useState('');

  const [selectedCourse,
    setSelectedCourse] =
    useState('');

  useEffect(() => {
    fetchCheckins();
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

  // FILTROS
  const filteredCheckins =
    checkins.filter((item) => {

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

      if (
        searchStudent &&
        !item.student_name
          ?.toLowerCase()
          .includes(
            searchStudent.toLowerCase()
          )
      ) {
        return false;
      }

      if (
        selectedCourse &&
        item.course !==
          selectedCourse
      ) {
        return false;
      }

      return true;
    });

  // EXPORTAR EXCEL
  const exportExcel = () => {

    const data =
      filteredCheckins.map(
        (item) => ({
          Alumno:
            item.student_name,
          Curso:
            item.course,
          Aula:
            item.classroom,
          Tipo:
            item.type,
          Fecha:
            formatDate(
              item.created_at
            ),
        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        data
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Historial'
    );

    XLSX.writeFile(
      workbook,
      'historial_alumnado.xlsx'
    );
  };

  // EXPORTAR PDF
  const exportPDF = () => {

    const doc = new jsPDF();

    doc.text(
      'Historial Alumnado',
      14,
      15
    );

    autoTable(doc, {
      startY: 25,
      head: [[
        'Alumno',
        'Curso',
        'Aula',
        'Tipo',
        'Fecha',
      ]],
      body:
        filteredCheckins.map(
          (item) => [
            item.student_name,
            item.course,
            item.classroom,
            item.type,
            formatDate(
              item.created_at
            ),
          ]
        ),
    });

    doc.save(
      'historial_alumnado.pdf'
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
        Histórico y Reportes
      </h1>

      <p
        style={{
          color: '#6b7280',
          marginBottom: '30px',
          fontSize: '18px',
        }}
      >
        Consulta y exporta el historial completo de fichajes.
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
            alignItems: 'end',
          }}
        >

          <input
            type="text"
            placeholder="Buscar alumno..."
            value={searchStudent}
            onChange={(e) =>
              setSearchStudent(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <select
            value={selectedCourse}
            onChange={(e) =>
              setSelectedCourse(
                e.target.value
              )
            }
            style={inputStyle}
          >

            <option value="">
              Todos los cursos
            </option>

            {[...new Set(
              checkins.map(
                (item) =>
                  item.course
              )
            )].map((course) => (

              <option
                key={course}
                value={course}
              >
                {course}
              </option>
            ))}

          </select>

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

        <div
          style={{
            display: 'flex',
            gap: '15px',
            marginTop: '25px',
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

const excelButton = {
  backgroundColor: '#15803d',
  color: 'white',
  border: 'none',
  padding: '14px 22px',
  borderRadius: '14px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '14px',
};

const pdfButton = {
  backgroundColor: '#dc2626',
  color: 'white',
  border: 'none',
  padding: '14px 22px',
  borderRadius: '14px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '14px',
};

export default HistoryPage;