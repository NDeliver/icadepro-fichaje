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
  padding: '40px',
  borderRadius: '24px',
  boxShadow:
    '0 10px 30px rgba(0,0,0,0.06)',
};

const fieldContainer = {
  marginBottom: '24px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '10px',
  color: '#374151',
  fontWeight: '600',
  fontSize: '15px',
};

const inputStyle = {
  width: '100%',
  padding: '16px',
  borderRadius: '14px',
  border: '1px solid #d1d5db',
  fontSize: '16px',
  outline: 'none',
  boxSizing: 'border-box',
};

const buttonContainer = {
  display: 'flex',
  gap: '15px',
  marginTop: '30px',
  flexWrap: 'wrap',
};

const entryButton = {
  flex: 1,
  padding: '16px',
  backgroundColor: '#f47920',
  color: 'white',
  border: 'none',
  borderRadius: '14px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '600',
  minWidth: '220px',
};

const exitButton = {
  flex: 1,
  padding: '16px',
  backgroundColor: '#111827',
  color: 'white',
  border: 'none',
  borderRadius: '14px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '600',
  minWidth: '220px',
};

const studentCard = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '18px',
  padding: '20px',
  marginBottom: '24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const studentBadge = {
  backgroundColor: '#22c55e',
  color: 'white',
  padding: '10px 14px',
  borderRadius: '12px',
  fontWeight: '700',
};

export default CheckInPage;