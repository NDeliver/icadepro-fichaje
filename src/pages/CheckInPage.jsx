import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

function CheckInPage() {
  const [code, setCode] = useState('');
  const [course, setCourse] = useState('');
  const [classroom, setClassroom] = useState('');
  const [courses, setCourses] = useState([]);
  const [student, setStudent] =
    useState(null);

  // LEER CÓDIGO DESDE QR
  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const qrCode =
      params.get('code');

    if (qrCode) {
      setCode(qrCode);
      fetchStudentByCode(qrCode);
    }

    fetchCourses();
  }, []);

  // OBTENER CURSOS
  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return;
    }

    setCourses(data);
  };

  // BUSCAR ALUMNO
  const fetchStudentByCode =
    async (studentCode) => {
      const { data, error } =
        await supabase
          .from('students')
          .select('*')
          .eq(
            'dni_code',
            studentCode
          )
          .single();

      if (error) {
        console.error(error);
        return;
      }

      setStudent(data);
    };

  // REGISTRAR FICHAJE
  const handleCheckIn = async (type) => {
    if (!code || !course || !classroom) {
      alert('Completa todos los campos');
      return;
    }

    // VALIDAR ALUMNO
    const {
      data: studentData,
      error: studentError,
    } = await supabase
      .from('students')
      .select('*')
      .eq('dni_code', code)
      .single();

    if (studentError || !studentData) {
      alert('Alumno no encontrado');
      return;
    }

    // OBTENER ÚLTIMO FICHAJE
    const {
      data: lastCheckin,
    } = await supabase
      .from('checkins')
      .select('type')
      .eq('code', Number(code))
      .order('id', {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    // EVITAR DOBLE ENTRADA/SALIDA
    if (
      lastCheckin &&
      lastCheckin.type === type
    ) {
      alert(
        `Ya existe una ${type.toLowerCase()} registrada`
      );

      return;
    }

    // GUARDAR FICHAJE
    const { error } = await supabase
      .from('checkins')
      .insert([
        {
          code,
          course,
          classroom,
          type,
        },
      ]);

    if (error) {
      console.error(error);
      alert('Error al guardar fichaje');
      return;
    }

    alert(
      `${type} registrada correctamente`
    );

    setCode('');
    setCourse('');
    setClassroom('');
    setStudent(null);
  };

  // CAMBIO DE CURSO
  const handleCourseChange = (value) => {
    setCourse(value);

    const selectedCourse = courses.find(
      (item) => item.name === value
    );

    if (selectedCourse) {
      setClassroom(
        selectedCourse.classroom
      );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '700px',
        }}
      >
        {/* TÍTULO */}
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
            Fichaje
          </h1>

          <p
            style={{
              marginTop: '10px',
              color: '#6b7280',
              fontSize: '16px',
            }}
          >
            Registra entradas y salidas
            de alumnos de forma rápida.
          </p>
        </div>

        {/* CARD PRINCIPAL */}
        <div style={cardStyle}>
          {/* CÓDIGO */}
          <div style={fieldContainer}>
            <label style={labelStyle}>
              Código de alumno
            </label>

            <input
              type="text"
              maxLength="4"
              value={code}
              onChange={(e) =>
                setCode(e.target.value)
              }
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
                    marginBottom: '5px',
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
                  {student.full_name}
                </h3>

                <p
                  style={{
                    marginTop: '5px',
                    color: '#6b7280',
                  }}
                >
                  Código:{' '}
                  {student.dni_code}
                </p>
              </div>

              <div style={studentBadge}>
                OK
              </div>
            </div>
          )}

          {/* CURSO */}
          <div style={fieldContainer}>
            <label style={labelStyle}>
              Curso
            </label>

            <select
              value={course}
              onChange={(e) =>
                handleCourseChange(
                  e.target.value
                )
              }
              style={inputStyle}
            >
              <option value="">
                Seleccionar curso
              </option>

              {courses.map((item) => (
                <option
                  key={item.id}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>
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
              style={{
                ...inputStyle,
                backgroundColor:
                  '#f3f4f6',
              }}
            />
          </div>

          {/* BOTONES */}
          <div style={buttonContainer}>
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
    </div>
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
  justifyContent: 'space-between',
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