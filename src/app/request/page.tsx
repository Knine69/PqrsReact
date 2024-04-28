"use client";

import "./request.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Categories from "./categories";
import { useGlobalProp } from "../context/page";
import ContextValidator from "../context/utils";
import { jwtDecode } from "jwt-decode";


export default function RequestMaker() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { setJwt } = useGlobalProp();
  const router = useRouter();
  const { returnAuthHeaders, validateTokenSession } = ContextValidator();
  const toggleForm = () => {
    tokenCleanUp();
    router.push("/login");
  };
  
  const tokenCleanUp = () => {
    localStorage.removeItem("sessionToken");
    setJwt("");
  }

  const updateCategory = (selected: string) => {
    setSelectedCategory(selected);
  };
  
  const createRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = validateTokenSession();
    if (token) {
      const formData = new FormData(event.currentTarget);
      const { documentId }: { documentId: string } = jwtDecode(token);
      const response = await fetch("http://localhost:5000/request/new_request", {
        method: "POST",
        headers: returnAuthHeaders(documentId, token),
        body: JSON.stringify(returnRequestBody(formData)),
      });

      const data = await response.json();
        if (!data.ERROR) {
          console.log("Created successfully")
        } else {
          console.error(
            "Failed to fetch categories:",
            data.ERROR
          );
        }
    }
  };

  const returnRequestBody = (data: FormData ) => {
      const jsonData: any = {};
      data.forEach((value, key) => {
        jsonData[key] = value;
      });

      return jsonData
  };

  return (
    <div className="request-container">
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
        Logout
      </button>
    </div>
  );
}
