import React, {useState} from 'react'

export const PrimerComponente = () => {

    //let nombre = "Papu";
    let web = "papuweb.es";

    const [nombre, setNombre] = useState("Papu Use State");

    let cursos = [
        "Master en JavaScript",
        "Master en PHP",
        "Master en Python",
        "Master en CSS"
    ];

    const cambiarNombre = (nuevoNombre) => {
        setNombre(nuevoNombre);
    }

  return (
    <div>
        <h1>Holaaa</h1>
        <h2>primer componenten en marcha</h2>
        <p>Mi nombre es: 
            <>Mi nombre es: <strong className={nombre.length >= 4 ? 'verde' : 'rojo'}>{nombre}</strong></>
        </p>
        
        <p>Mi web  es: {web}</p>

        <input type="text" onChange={e => cambiarNombre(e.target.value)} placeholder='cambiar nombre'/>

        <button onClick={e => {
            console.log("El valor de tu estado actual es: ", nombre);
        }}>
            Mostrar valor en consola
        </button>

        <button onClick={ e => cambiarNombre("Aleps Salinas web")}>
            Cambiar Nombre
        </button>

        <ul>
            {
                cursos.map( (curso, indice) => {
                    return (<li key={indice}>
                        {curso}
                    </li>)
                })
            }
        </ul>
    </div>
  )
}
