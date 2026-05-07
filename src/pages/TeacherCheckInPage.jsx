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
    <div
      style={{
        display: 'flex',
        justifyContent:
          'center',
      }}
    >

      <div
        style={{
          width: '100%',
          maxWidth: '700px',
        }}
      >

        <h1>
          Fichaje Profesores
        </h1>

        <div
          style={{
            background: 'white',
            padding: '30px',
            borderRadius: '25px',
          }}
        >

          <input
            type="text"
            placeholder="Código profesor"
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
              }
            }}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '16px',
              marginBottom: '20px',
            }}
          />

          {teacher && (
            <div
              style={{
                marginBottom: '20px',
              }}
            >

              <h3>
                {
                  teacher.full_name
                }
              </h3>

              <p>
                Código: {
                  teacher.teacher_code
                }
              </p>

            </div>
          )}

          <button
            onClick={() =>
              handleCheckIn(
                'Entrada'
              )
            }
          >
            Registrar Entrada
          </button>

          <button
            onClick={() =>
              handleCheckIn(
                'Salida'
              )
            }
            style={{
              marginLeft: '10px',
            }}
          >
            Registrar Salida
          </button>

        </div>

      </div>

    </div>
  );
}

export default TeacherCheckInPage;