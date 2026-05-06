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

    alert('Fichaje registrado correctamente');

    setCode('');
    setCourse('');
    setClassroom('');
  };

  // CAMBIO DE CURSO
  const handleCourseChange = (value) => {
    setCourse(value);

    const selectedCourse = courses.find(
      (item) => item.name === value
    );

    if (selectedCourse) {
      setClassroom(selectedCourse.classroom);
    }
  };

  return (
    <div>
      <h1>Pantalla de Fichaje</h1>

      <div
        style={{
          marginTop: '20px',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          maxWidth: '500px',
        }}
      >
        {/* CÓDIGO */}
        <div style={{ marginBottom: '20px' }}>
          <label>Código de 4 dígitos</label>

          <input
            type="text"
            maxLength="4"
            value={code}
            onChange={(e) =>
              setCode(e.target.value)
            }
            placeholder="Ej: 1234"
            style={inputStyle}
          />
        </div>

        {/* ALUMNO */}
        {student && (
          <div
            style={{
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f5f5f5',
              borderRadius: '10px',
            }}
          >
            <strong>
              {student.full_name}
            </strong>

            <div>
              Código:{' '}
              {student.dni_code}
            </div>
          </div>
        )}

        {/* CURSO */}
        <div style={{ marginBottom: '20px' }}>
          <label>Curso</label>

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
        <div style={{ marginBottom: '20px' }}>
          <label>Aula</label>

          <input
            type="text"
            value={classroom}
            readOnly
            style={{
              ...inputStyle,
              backgroundColor: '#f0f0f0',
            }}
          />
        </div>

        {/* BOTONES */}
        <div
          style={{
            display: 'flex',
            gap: '15px',
          }}
        >
          <button
            onClick={() =>
              handleCheckIn('Entrada')
            }
            style={entryButton}
          >
            Registrar Entrada
          </button>

          <button
            onClick={() =>
              handleCheckIn('Salida')
            }
            style={exitButton}
          >
            Registrar Salida
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginTop: '8px',
  borderRadius: '6px',
  border: '1px solid #ccc',
};

const entryButton = {
  flex: 1,
  padding: '12px',
  backgroundColor: '#f47920',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const exitButton = {
  flex: 1,
  padding: '12px',
  backgroundColor: '#555555',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

export default CheckInPage;