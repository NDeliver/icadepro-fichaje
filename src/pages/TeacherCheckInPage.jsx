import { useState } from 'react';
import { supabase } from '../services/supabase';
import toast from 'react-hot-toast';

function TeacherCheckInPage() {

  const [code, setCode] =
    useState('');

  const [teacher, setTeacher] =
    useState(null);

  // BUSCAR DOCENTE
  const fetchTeacher = async (
    teacherCode
  ) => {

    const {
      data,
      error,
    } = await supabase
      .from('teachers')
      .select('*')
      .eq(
        'teacher_code',
        teacherCode
      )
      .single();

    if (error || !data) {

      setTeacher(null);

      return;
    }

    setTeacher(data);
  };

  // FICHAJE
  const handleCheckIn = async (
    type
  ) => {

    if (!teacher) {

      toast.error(
        'Profesor no encontrado'
      );

      return;
    }

    // ÚLTIMO FICHAJE
    const {
      data: lastCheckin,
    } = await supabase
      .from('teacher_checkins')
      .select('type')
      .eq(
        'teacher_code',
        teacher.teacher_code
      )
      .order('id', {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    // EVITAR DUPLICADOS
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
        .from('teacher_checkins')
        .insert([
          {
            teacher_code:
              teacher.teacher_code,

            teacher_name:
              teacher.full_name,

            type,

            created_at:
              new Date().toISOString(),
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
    setTeacher(null);
  };

  return (

    <div>

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
          Fichaje Profesores
        </h1>

      </div>

      {/* CARD */}
      <div style={cardStyle}>

        {/* CODIGO */}
        <div style={fieldContainer}>

          <label style={labelStyle}>
            Código profesor
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

                await fetchTeacher(
                  value
                );

              } else {

                setTeacher(null);
              }
            }}
            placeholder="Introduce el código"
            style={inputStyle}
          />

        </div>

        {/* PROFESOR */}
        {teacher && (

          <div style={teacherCard}>

            <div>

              <div
                style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom:
                    '5px',
                }}
              >
                Profesor detectado
              </div>

              <h3
                style={{
                  margin: 0,
                  color: '#111827',
                }}
              >
                {
                  teacher.full_name
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
                  teacher.teacher_code
                }
              </p>

            </div>

            <div
              style={teacherBadge}
            >
              OK
            </div>

          </div>
        )}

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

const teacherCard = {
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

const teacherBadge = {
  backgroundColor: '#22c55e',
  color: 'white',
  padding: '12px 16px',
  borderRadius: '14px',
  fontWeight: '700',
  fontSize: '14px',
};

export default TeacherCheckInPage;