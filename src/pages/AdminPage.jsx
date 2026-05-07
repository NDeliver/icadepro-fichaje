import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import QRCode from 'qrcode';

function AdminPage() {
  const [studentName, setStudentName] =
    useState('');

  const [dniCode, setDniCode] =
    useState('');

  const [students, setStudents] =
    useState([]);

  const [courseName, setCourseName] =
    useState('');

  const [classroom, setClassroom] =
    useState('');

  const [courses, setCourses] =
    useState([]);

  const [qrCodes, setQrCodes] =
    useState({});

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  useEffect(() => {
    generateQRCodes();
  }, [students]);

  // GENERAR QR
  const generateQRCodes = async () => {
    const qrMap = {};

    for (const student of students) {
      try {
        const qrUrl = `https://icadepro-fichaje-app.vercel.app/?code=${student.dni_code}`;

        const qr =
          await QRCode.toDataURL(qrUrl);

        qrMap[student.id] = qr;
      } catch (error) {
        console.error(error);
      }
    }

    setQrCodes(qrMap);
  };

  // OBTENER ALUMNOS
  const fetchStudents = async () => {
    const { data } = await supabase
      .from('students')
      .select('*')
      .order('created_at', {
        ascending: false,
      });

    if (data) {
      setStudents(data);
    }
  };

  // OBTENER CURSOS
  const fetchCourses = async () => {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', {
        ascending: false,
      });

    if (data) {
      setCourses(data);
    }
  };

  // CREAR ALUMNO
  const createStudent = async () => {
    if (!studentName || !dniCode) {
      alert('Completa los datos');
      return;
    }

    const { error } = await supabase
      .from('students')
      .insert([
        {
          full_name: studentName,
          dni_code: dniCode,
        },
      ]);

    if (error) {
      alert('Error al crear alumno');
      return;
    }

    alert('Alumno creado');

    setStudentName('');
    setDniCode('');

    fetchStudents();
  };

  // CREAR CURSO
  const createCourse = async () => {
    if (!courseName || !classroom) {
      alert('Completa los datos');
      return;
    }

    const { error } = await supabase
      .from('courses')
      .insert([
        {
          name: courseName,
          classroom,
        },
      ]);

    if (error) {
      alert('Error al crear curso');
      return;
    }

    alert('Curso creado');

    setCourseName('');
    setClassroom('');

    fetchCourses();
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
          Administración
        </h1>

        <p
          style={{
            marginTop: '10px',
            color: '#6b7280',
            fontSize: '16px',
          }}
        >
          Gestiona alumnos, cursos y
          códigos QR.
        </p>
      </div>

      {/* GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            '1fr 1fr',
          gap: '25px',
        }}
      >
        {/* ALUMNOS */}
        <div style={cardStyle}>
          <h2 style={titleStyle}>
            Crear Alumno
          </h2>

          <div style={fieldContainer}>
            <label style={labelStyle}>
              Nombre completo
            </label>

            <input
              type="text"
              placeholder="Ej: Juan Pérez"
              value={studentName}
              onChange={(e) =>
                setStudentName(
                  e.target.value
                )
              }
              style={inputStyle}
            />
          </div>

          <div style={fieldContainer}>
            <label style={labelStyle}>
              Código DNI
            </label>

            <input
              type="text"
              placeholder="4 dígitos"
              maxLength="4"
              value={dniCode}
              onChange={(e) =>
                setDniCode(
                  e.target.value
                )
              }
              style={inputStyle}
            />
          </div>

          <button
            onClick={createStudent}
            style={primaryButton}
          >
            Crear Alumno
          </button>

          {/* LISTA ALUMNOS */}
          <div
            style={{
              marginTop: '35px',
            }}
          >
            {students.map((student) => (
              <div
                key={student.id}
                style={studentCard}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: '#111827',
                      fontSize: '18px',
                    }}
                  >
                    {
                      student.full_name
                    }
                  </h3>

                  <p
                    style={{
                      marginTop: '8px',
                      color: '#6b7280',
                    }}
                  >
                    Código:{' '}
                    {
                      student.dni_code
                    }
                  </p>
                </div>

                {qrCodes[
                  student.id
                ] && (
                  <img
                    src={
                      qrCodes[
                        student.id
                      ]
                    }
                    alt="QR"
                    width="90"
                    height="90"
                    style={{
                      borderRadius:
                        '10px',
                      backgroundColor:
                        'white',
                      padding: '5px',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CURSOS */}
        <div style={cardStyle}>
          <h2 style={titleStyle}>
            Crear Curso
          </h2>

          <div style={fieldContainer}>
            <label style={labelStyle}>
              Nombre del curso
            </label>

            <input
              type="text"
              placeholder="Ej: Marketing Digital"
              value={courseName}
              onChange={(e) =>
                setCourseName(
                  e.target.value
                )
              }
              style={inputStyle}
            />
          </div>

          <div style={fieldContainer}>
            <label style={labelStyle}>
              Aula
            </label>

            <input
              type="text"
              placeholder="Ej: Aula 3"
              value={classroom}
              onChange={(e) =>
                setClassroom(
                  e.target.value
                )
              }
              style={inputStyle}
            />
          </div>

          <button
            onClick={createCourse}
            style={primaryButton}
          >
            Crear Curso
          </button>

          {/* LISTA CURSOS */}
          <div
            style={{
              marginTop: '35px',
            }}
          >
            {courses.map((course) => (
              <div
                key={course.id}
                style={courseCard}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: '#111827',
                      fontSize: '18px',
                    }}
                  >
                    {course.name}
                  </h3>

                  <p
                    style={{
                      marginTop: '8px',
                      color: '#6b7280',
                    }}
                  >
                    {
                      course.classroom
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: 'white',
  padding: '35px',
  borderRadius: '24px',
  boxShadow:
    '0 10px 30px rgba(0,0,0,0.05)',
};

const titleStyle = {
  marginTop: 0,
  marginBottom: '30px',
  fontSize: '28px',
  color: '#111827',
};

const fieldContainer = {
  marginBottom: '20px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '10px',
  color: '#374151',
  fontWeight: '600',
};

const inputStyle = {
  width: '100%',
  padding: '16px',
  borderRadius: '14px',
  border: '1px solid #d1d5db',
  fontSize: '16px',
  boxSizing: 'border-box',
};

const primaryButton = {
  marginTop: '10px',
  padding: '16px 22px',
  backgroundColor: '#f47920',
  color: 'white',
  border: 'none',
  borderRadius: '14px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '600',
  width: '100%',
};

const studentCard = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '20px',
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '18px',
  padding: '20px',
  marginBottom: '18px',
};

const courseCard = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '18px',
  padding: '20px',
  marginBottom: '18px',
};

export default AdminPage;