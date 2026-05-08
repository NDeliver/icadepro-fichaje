import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  const [searchTeacher,
    setSearchTeacher] =
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

  // FILTROS
  const filteredTeacherCheckins =
    teacherCheckins.filter(
      (item) => {

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
          searchTeacher &&
          !item.teacher_name
            ?.toLowerCase()
            .includes(
              searchTeacher.toLowerCase()
            )
        ) {
          return false;
        }

        return true;
      }
    );

  // EXPORTAR EXCEL
  const exportExcel = () => {

    const data =
      filteredTeacherCheckins.map(
        (item) => ({
          Profesor:
            item.teacher_name,
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
      'Profesorado'
    );

    XLSX.writeFile(
      workbook,
      'historial_profesorado.xlsx'
    );
  };

  // EXPORTAR PDF
  const exportPDF = () => {

    const doc = new jsPDF();

    // LOGO TEXTO
    doc.setFontSize(24);

    doc.setTextColor(
      244,
      121,
      32
    );

    doc.text(
      'ICADEPRO',
      14,
      20
    );

    // TITULO
    doc.setFontSize(18);

    doc.setTextColor(
      17,
      24,
      39
    );

    doc.text(
      'Historial Profesorado',
      14,
      35
    );

    // FECHA
    doc.setFontSize(11);

    doc.setTextColor(
      107,
      114,
      128
    );

    doc.text(
      `Generado: ${new Date().toLocaleString('es-ES')}`,
      14,
      43
    );

    autoTable(doc, {

      startY: 55,

      head: [[
        'Profesor',
        'Tipo',
        'Fecha',
      ]],

      body:
        filteredTeacherCheckins.map(
          (item) => [
            item.teacher_name,
            item.type,
            formatDate(
              item.created_at
            ),
          ]
        ),

      headStyles: {
        fillColor: [
          244,
          121,
          32,
        ],
        textColor: 255,
        fontStyle: 'bold',
      },

      styles: {
        fontSize: 10,
        cellPadding: 4,
      },

      alternateRowStyles: {
        fillColor: [
          248,
          248,
          248,
        ],
      },

      margin: {
        left: 14,
        right: 14,
      },

    });

    doc.save(
      'historial_profesorado_icadepro.pdf'
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
            placeholder="Buscar profesor..."
            value={searchTeacher}
            onChange={(e) =>
              setSearchTeacher(
                e.target.value
              )
            }
            style={inputStyle}
          />

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

        {/* BOTONES */}
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

export default TeacherHistoryPage;