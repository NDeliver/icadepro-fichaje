import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import QRCode from 'qrcode';

function AdminPage() {
  const [studentName, setStudentName] = useState('');
  const [dniCode, setDniCode] = useState('');
  const [students, setStudents] = useState([]);

  const [courseName, setCourseName] = useState('');
  const [classroom, setClassroom] = useState('');
  const [courses, setCourses] = useState([]);

  const [qrCodes, setQrCodes] = useState({});

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
        const qrUrl = `https://honey-venice-waiting-starting.trycloudflare.com/?code=${student.dni_code}`;

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
      <h1>Panel de Administración</h1>

      {/* ALUMNOS */}
      <div style={cardStyle}>
        <h2>Crear Alumno</h2>

        <input
          type="text"
          placeholder="Nombre completo"
          value={studentName}
          onChange={(e) =>
            setStudentName(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Últimos 4 DNI"
          maxLength="4"
          value={dniCode}
          onChange={(e) =>
            setDniCode(e.target.value)
          }
          style={inputStyle}
        />

        <button
          onClick={createStudent}
          style={buttonStyle}
        >
          Crear Alumno
        </button>

        <div style={{ marginTop: '20px' }}>
          {students.map((student) => (
            <div
              key={student.id}
              style={{
                ...listItem,
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div>
                <strong>
                  {student.full_name}
                </strong>

                <div>
                  Código:{' '}
                  {student.dni_code}
                </div>
              </div>

              {qrCodes[student.id] && (
                <img
                  src={qrCodes[student.id]}
                  alt="QR"
                  width="80"
                  height="80"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CURSOS */}
      <div style={cardStyle}>
        <h2>Crear Curso</h2>

        <input
          type="text"
          placeholder="Nombre del curso"
          value={courseName}
          onChange={(e) =>
            setCourseName(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Aula"
          value={classroom}
          onChange={(e) =>
            setClassroom(e.target.value)
          }
          style={inputStyle}
        />

        <button
          onClick={createCourse}
          style={buttonStyle}
        >
          Crear Curso
        </button>

        <div style={{ marginTop: '20px' }}>
          {courses.map((course) => (
            <div
              key={course.id}
              style={listItem}
            >
              {course.name} -{' '}
              {course.classroom}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: 'white',
  padding: '25px',
  borderRadius: '10px',
  marginTop: '20px',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginTop: '12px',
  borderRadius: '6px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  marginTop: '15px',
  padding: '12px 18px',
  backgroundColor: '#f47920',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const listItem = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
};

export default AdminPage;