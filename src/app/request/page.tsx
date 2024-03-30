"use client";

import "./request.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Categories from "./categories";

export default function Request() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const router = useRouter();
  const toggleForm = () => {
    router.push("/home");
  };

  const updateCategory = (selected: string) => {
    setSelectedCategory(selected);
  };

  const createRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await fetch("http://localhost:5000/request/new_request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(returnRequestBody(formData)),
    });
  };

  const returnRequestBody = (data: FormData ) => {
      const jsonData: any = {};
      data.forEach((value, key) => {
        jsonData[key] = value;
      });

      // TODO: Current user, need to define sessions
      jsonData["id"] = 1;

      return jsonData
  };

  return (
    <div className="content-container">
      <h1>POLI PQRS</h1>
      <p>SOLICITUD</p>
      <form onSubmit={createRequest} id="requestForm">
        <div className="form-fields">
          <label htmlFor="category">Categoria</label>
          <Categories setCategory={updateCategory} />
        </div>
        <div className="form-fields">
          <label htmlFor="documento">DOCUMENTO DE IDENTIDAD</label>
          <input
            type="text"
            id="documento"
            name="documentId"
            autoComplete="off"
          />
        </div>
        <div className="form-fields">
          <label htmlFor="comentarios">COMENTARIOS</label>
          <textarea
            id="comentarios"
            name="summary"
            rows={4}
            autoComplete="off"
          ></textarea>
        </div>

        <button id="enviarSolicitudBtn" type="submit">
          Enviar Solicitud
        </button>
      </form>
      <button onClick={toggleForm} className="home-button">
        Home
      </button>
    </div>
  );
}
