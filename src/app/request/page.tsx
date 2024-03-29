"use client";

import "./request.css";
import Categories from "./categories";

export default function Request() {

  return (
    <div className="content-container">
      <h1>POLI PQRS</h1>
      <p>SOLICITUD</p>
      <form action="procesarFormulario.php" method="POST" id="requestForm">
        <div className="form-fields">
          <label htmlFor="category">Categoria</label>
          <Categories />
        </div>

        <div className="form-fields">
          <label htmlFor="nombre">NOMBRE</label>
          <input type="text" id="nombre" name="nombre" autoComplete="off" />
        </div>
        <div className="form-fields">
          <label htmlFor="documento">DOCUMENTO DE IDENTIDAD</label>
          <input
            type="text"
            id="documento"
            name="documento"
            autoComplete="off"
          />
        </div>
        <div className="form-fields">
          <label htmlFor="email">EMAIL INSTITUCIONAL</label>
          <input type="email" id="email" name="email" autoComplete="off" />
        </div>
        <div className="form-fields">
          <label htmlFor="comentarios">COMENTARIOS</label>
          <textarea
            id="comentarios"
            name="comentarios"
            rows={4}
            autoComplete="off"
          ></textarea>
        </div>

        <button id="enviarSolicitudBtn">Enviar Solicitud</button>
      </form>
      <a href="index.html" className="home-button">
        Home
      </a>
    </div>
  );
}
