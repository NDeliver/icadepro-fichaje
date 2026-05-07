import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import toast from 'react-hot-toast';
import TeacherCheckInPage from './TeacherCheckInPage';

function CheckInPage() {

  const [code, setCode] =
    useState('');

  const [course, setCourse] =
    useState('');

  const [classroom, setClassroom] =
    useState('');

  const [teacher, setTeacher] =
    useState('');

  const [student, setStudent] =
    useState(null);

  // LEER QR
  useEffect(() => {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const qrCode =
      params.get('code');

    if (qrCode) {

      setCode(qrCode);

      fetchStudentByCode(
        qrCode
      );
    }

  }, []);

  // BUSCAR ALUMNO
  const fetchStudentByCode =
    async (studentCode) => {

      setCourse('');
      setClassroom('');
      setTeacher('');

      const {
        data: studentData,
        error: studentError,
      } = await supabase
        .from('students')
        .select('*')
        .eq(
          'dni_code',
          studentCode
        )
        .single();

      if (
        studentError ||
        !studentData
      ) {

        console.error(
          studentError
        );

        setStudent(null);

        return;
      }

      setStudent(studentData);

      const studentCourse =
        String(
          studentData.course || ''
        )
          .trim()
          .toLowerCase();

      const {
        data: coursesData,
        error: courseError,
      } = await supabase
        .from('courses')
        .select('*');

      if (
        courseError ||
        !coursesData
      ) {

        console.error(
          courseError
        );

        return;
      }

      const foundCourse =
        coursesData.find(
          (item) => {

            const courseName =
              String(
                item.name || ''
              )
                .trim()
                .toLowerCase();

            return (
              courseName ===
              studentCourse
            );
          }
        );

      if (!foundCourse) {

        console.log(
          'Curso no encontrado'
        );

        return;
      }

      setCourse(
        foundCourse.name || ''
      );

      setClassroom(
        foundCourse.classroom || ''
      );

      setTeacher(
        foundCourse.teacher || ''
      );
    };

  // REGISTRAR
  const handleCheckIn =
    async (type) => {

      if (
        !code ||
        !course ||
        !teacher
      ) {

        toast.error(
          'Completa todos los campos'
        );

        return;
      }

      const {
        data: studentData,
        error: studentError,
      } = await supabase
        .from('students')
        .select('*')
        .eq(
          'dni_code',
          code
        )
        .single();

      if (
        studentError ||
        !studentData
      ) {

        toast.error(
          'Alumno no encontrado'
        );

        return;
      }

      const {
        data: lastCheckin,
      } = await supabase
        .from('checkins')
        .select('type')
        .eq(
          'code',
          Number(code)
        )
        .order('id', {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (
        lastCheckin &&
        lastCheckin.type === type
      ) {

        toast.error(
          `Ya existe una ${type.toLowerCase()} registrada`
        );

        return;
      }

      // GUARDAR
      const { error } =
        await supabase
          .from('checkins')
          .insert([
            {
              code,
              course,
              classroom,
              teacher,
              type,
            },
          ]);

      if (error) {

        console.error(error);

        toast.error(
          'Error al guardar fichaje'
        );

        return;
      }

      toast.success(
        `${type} registrada correctamente`
      );

      setCode('');
      setCourse('');
      setClassroom('');
      setTeacher('');
      setStudent(null);
    };

  return (
    <>
      <style>
        {`
          aside {
  display: none !important;
}

main {
  padding-left: 60px !important;
}
        `}
      </style>

<div
  style={{
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '10px',
  }}
>

  <div
    style={{
      textAlign: 'center',
    }}
  >

    <img
      src="/icadepro-logo.png"
      alt="IcadePro"
      style={{
        width: '600px',
        objectFit: 'contain',
        marginBottom: '18px',
      }}
    />

    <p
      style={{
        color: '#9ca3af',
        fontSize: '15px',
        margin: 0,
      }}
    >
      Sistema de fichajes
    </p>

  </div>

</div>
      <div
        style={{
          display: 'flex',
          gap: '30px',
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginTop: '-40px',
          flexWrap: 'nowrap',
        }}
      >

        {/* ALUMNADO */}
        <div
          style={{
            width: '100%',
            maxWidth: '600px',
          }}
        >

          {/* TITULO */}
          <div
            style={{
              marginBottom: '30px',
            }}
          >

            <h1
              style={{
                margin: 0,
                fontSize: '42px',
                color: '#111827',
                fontWeight: '700',
              }}
            >
              Fichaje Alumnado
            </h1>

            <p
              style={{
                marginTop: '10px',
                color: '#6b7280',
                fontSize: '16px',
              }}
            >
              Registra entradas y
              salidas de alumnos.
            </p>

          </div>

          {/* CARD */}
          <div style={cardStyle}>

            {/* CODIGO */}
            <div style={fieldContainer}>

              <label style={labelStyle}>
                Código de alumno
              </label>

              <input
                type="text"
                maxLength="4"
                value={code}
                onChange={async (e) => {

                  const value =
                    e.target.value;

                  setCode(value);

                  if (
                    value.length === 4
                  ) {

                    await fetchStudentByCode(
                      value
                    );

                  } else {

                    setStudent(null);

                    setCourse('');
                    setClassroom('');
                    setTeacher('');
                  }
                }}
                placeholder="Introduce el código"
                style={inputStyle}
              />

            </div>

            {/* ALUMNO */}
            {student && (

              <div style={studentCard}>

                <div>

                  <div
                    style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      marginBottom:
                        '5px',
                    }}
                  >
                    Alumno detectado
                  </div>

                  <h3
                    style={{
                      margin: 0,
                      color: '#111827',
                    }}
                  >
                    {
                      student.full_name
                    }
                  </h3>

                  <p
                    style={{
                      marginTop: '5px',
                      color: '#6b7280',
                    }}
                  >
                    Código:{' '}
                    {
                      student.dni_code
                    }
                  </p>

                </div>

                <div
                  style={
                    studentBadge
                  }
                >
                  OK
                </div>

              </div>
            )}

            {/* CURSO */}
            <div style={fieldContainer}>

              <label style={labelStyle}>
                Curso
              </label>

              <input
                type="text"
                value={course}
                readOnly
                placeholder="Curso automático"
                style={{
                  ...inputStyle,
                  backgroundColor:
                    '#f3f4f6',
                }}
              />

            </div>

            {/* DOCENTE */}
            <div style={fieldContainer}>

              <label style={labelStyle}>
                Docente
              </label>

              <input
                type="text"
                value={teacher}
                readOnly
                placeholder="Docente automático"
                style={{
                  ...inputStyle,
                  backgroundColor:
                    '#f3f4f6',
                }}
              />

            </div>

            {/* AULA */}
            <div style={fieldContainer}>

              <label style={labelStyle}>
                Aula
              </label>

              <input
                type="text"
                value={classroom}
                readOnly
                placeholder="Aula automática"
                style={{
                  ...inputStyle,
                  backgroundColor:
                    '#f3f4f6',
                }}
              />

            </div>

            {/* BOTONES */}
            <div
              style={buttonContainer}
            >

              <button
                onClick={() =>
                  handleCheckIn(
                    'Entrada'
                  )
                }
                style={entryButton}
              >
                Registrar Entrada
              </button>

              <button
                onClick={() =>
                  handleCheckIn(
                    'Salida'
                  )
                }
                style={exitButton}
              >
                Registrar Salida
              </button>

            </div>

          </div>

        </div>

        {/* PROFESORES */}
        <div
          style={{
            width: '100%',
            maxWidth: '600px',
          }}
        >

          <TeacherCheckInPage />

        </div>

      </div>
    </>
  );
}

const cardStyle = {
  backgroundColor: 'white',
  padding: '32px',
  borderRadius: '30px',
  border: '1px solid #ececec',
  boxShadow:
    '0 4px 20px rgba(0,0,0,0.03)',
};

const fieldContainer = {
  marginBottom: '22px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '10px',
  color: '#6b7280',
  fontWeight: '600',
  fontSize: '14px',
};

const inputStyle = {
  width: '100%',
  padding: '18px',
  borderRadius: '18px',
  border: '1px solid #e5e7eb',
  fontSize: '16px',
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: '#fafafa',
};

const buttonContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginTop: '35px',
};

const entryButton = {
  width: '100%',
  padding: '22px',
  backgroundColor: '#f47920',
  color: 'white',
  border: 'none',
  borderRadius: '22px',
  cursor: 'pointer',
  fontSize: '18px',
  fontWeight: '700',
  boxShadow:
    '0 8px 20px rgba(244,121,32,0.25)',
};

const exitButton = {
  width: '100%',
  padding: '22px',
  backgroundColor: 'white',
  color: '#111827',
  border: '2px solid #ececec',
  borderRadius: '22px',
  cursor: 'pointer',
  fontSize: '18px',
  fontWeight: '700',
};

const studentCard = {
  backgroundColor: '#fff7f2',
  border: '1px solid #ffe2cd',
  borderRadius: '22px',
  padding: '22px',
  marginBottom: '24px',
  display: 'flex',
  justifyContent:
    'space-between',
  alignItems: 'center',
};

const studentBadge = {
  backgroundColor: '#22c55e',
  color: 'white',
  padding: '12px 16px',
  borderRadius: '14px',
  fontWeight: '700',
  fontSize: '14px',
};

export default CheckInPage;