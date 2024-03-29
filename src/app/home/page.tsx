"use client";

import "./home.css";
import { useRouter } from 'next/navigation'

export default function Page() {

  const router = useRouter()
  const toggleForm = () => {
    router.push("/request")
  };
  
  return (
      <div className="content-container">
        <h1>POLI PQRS</h1>
        <p>¿Cómo podemos ayudarte?</p>
        <button onClick={toggleForm} className="select-button">
          Enviar Solicitud
        </button>
      </div>
    );
}
