import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

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

  const [showStudents,
    setShowStudents] =
    useState(false);

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  useEffect(() => {
    generateQRCodes();
  }, [students]);

  // GENERAR QR
  const generateQRCodes =
    async () => {

      const qrMap = {};

      for (const student of students) {

        try {

          const qrUrl =
            `https://icadepro-fichaje-app.vercel.app/?code=${student.dni_code}`;

          const qr =
            await QRCode.toDataURL(
              qrUrl
            );

          qrMap[student.id] = qr;

        } catch (error) {

          console.error(error);
        }
      }

      setQrCodes(qrMap);
    };

  // OBTENER ALUMNOS
  const fetchStudents =
    async () => {

      const { data } =
        await supabase
          .from('students')
          .select('*')
          .order(
            'created_at',
            {
              ascending: false,
            }
          );

      if (data) {
        setStudents(data);
      }
    };

  // OBTENER CURSOS
  const fetchCourses =
    async () => {

      const { data } =
        await supabase
          .from('courses')
          .select('*')
          .order(
            'created_at',
            {
              ascending: false,
            }
          );

      if (data) {
        setCourses(data);
      }
    };

  // CREAR ALUMNO
  const createStudent =
    async () => {

      if (
        !studentName ||
        !dniCode
      ) {

        toast.error(
          'Completa los datos'
        );

        return;
      }

      const { error } =
        await supabase
          .from('students')
          .insert([
            {
              full_name:
                studentName,
              dni_code:
                dniCode,
            },
          ]);

      if (error) {

        toast.error(
          'Error al crear alumno'
        );

        return;
      }

      toast.success(
        'Alumno creado'
      );

      setStudentName('');
      setDniCode('');

      fetchStudents();
    };

  // CREAR CURSO
  const createCourse =
    async () => {

      if (
        !courseName ||
        !classroom
      ) {

        toast.error(
          'Completa los datos'
        );

        return;
      }

      const { error } =
        await supabase
          .from('courses')
          .insert([
            {
              name: courseName,
              classroom,
            },
          ]);

      if (error) {

        toast.error(
          'Error al crear curso'
        );

        return;
      }

      toast.success(
        'Curso creado'
      );

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
          Gestiona alumnos,
          cursos y códigos QR.
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

          {/* BOTON ALUMNOS */}
          <div
            style={{
              marginTop: '35px',
            }}
          >

            <button
              onClick={() =>
                setShowStudents(
                  !showStudents
                )
              }
              style={
                secondaryButton
              }
            >
              {showStudents
                ? 'Ocultar'
                : 'Alumnos'}
            </button>

            {/* LISTADO */}
            {showStudents && (

              <div
                style={{
                  marginTop: '20px',
                }}
              >

                {students.map(
                  (student) => (

                    <div
                      key={student.id}
                      style={
                        studentCard
                      }
                    >

                      <div>

                        <h3
                          style={{
                            margin: 0,
                            color:
                              '#111827',
                            fontSize:
                              '18px',
                          }}
                        >
                          {
                            student.full_name
                          }
                        </h3>

                        <p
                          style={{
                            marginTop:
                              '8px',
                            color:
                              '#6b7280',
                          }}
                        >
                          Código:{' '}
                          {
                            student.dni_code
                          }
                        </p>

                      </div>

                      <div
                        style={{
                          width:
                            '90px',
                          height:
                            '90px',
                          flexShrink: 0,
                          display:
                            'flex',
                          alignItems:
                            'center',
                          justifyContent:
                            'center',
                        }}
                      >

                        {qrCodes[
                          student.id
                        ] && (

                          <img
                            src={
                              qrCodes[
                                student
                                  .id
                              ]
                            }
                            alt="QR"
                            width="90"
                            height="90"
                            style={{
                              width:
                                '90px',
                              height:
                                '90px',
                              objectFit:
                                'contain',
                              display:
                                'block',
                              borderRadius:
                                '10px',
                              backgroundColor:
                                'white',
                              padding:
                                '5px',
                              flexShrink: 0,
                            }}
                          />
                        )}

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

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

            {courses.map(
              (course) => (

                <div
                  key={course.id}
                  style={courseCard}
                >

                  <div>

                    <h3
                      style={{
                        margin: 0,
                        color:
                          '#111827',
                        fontSize:
                          '18px',
                      }}
                    >
                      {course.name}
                    </h3>

                    <p
                      style={{
                        marginTop:
                          '8px',
                        color:
                          '#6b7280',
                      }}
                    >
                      {
                        course.classroom
                      }
                    </p>

                  </div>

                </div>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

const cardStyle = {
  backgroundColor: 'white',
  padding: '28px',
  borderRadius: '30px',
  border: '1px solid #ececec',
  boxShadow:
    '0 4px 20px rgba(0,0,0,0.03)',
};

const titleStyle = {
  marginTop: 0,
  marginBottom: '26px',
  fontSize: '24px',
  color: '#111827',
  fontWeight: '700',
};

const fieldContainer = {
  marginBottom: '18px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  color: '#6b7280',
  fontWeight: '600',
  fontSize: '14px',
};

const inputStyle = {
  width: '100%',
  padding: '18px',
  borderRadius: '18px',
  border: '1px solid #ececec',
  fontSize: '16px',
  boxSizing: 'border-box',
  backgroundColor: '#fafafa',
  outline: 'none',
};

const primaryButton = {
  marginTop: '8px',
  padding: '20px',
  backgroundColor: '#f47920',
  color: 'white',
  border: 'none',
  borderRadius: '20px',
  cursor: 'pointer',
  fontSize: '17px',
  fontWeight: '700',
  width: '100%',
  boxShadow:
    '0 8px 20px rgba(244,121,32,0.20)',
};

const secondaryButton = {
  width: '100%',
  padding: '18px',
  borderRadius: '20px',
  border: 'none',
  backgroundColor: '#111827',
  color: 'white',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer',
};

const studentCard = {
  display: 'flex',
  justifyContent:
    'space-between',
  alignItems: 'center',
  gap: '20px',
  backgroundColor: '#ffffff',
  border: '1px solid #f1f1f1',
  borderRadius: '22px',
  padding: '18px',
  marginBottom: '16px',
};

const courseCard = {
  backgroundColor: '#ffffff',
  border: '1px solid #f1f1f1',
  borderRadius: '22px',
  padding: '18px',
  marginBottom: '16px',
};

export default AdminPage;