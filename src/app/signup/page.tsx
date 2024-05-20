"use client";

import "./signup.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ContextValidator from "../context/utils";
import Department from "./departments";
import Position from "./positions";
import Role from "./roles";

export default function SignUp() {
  // Initialize states for each input field
  const [name, setName] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  const router = useRouter();
  const { encryptData } = ContextValidator();

  const updateDepartment = (selected: string) => {
    setDepartment(selected);
  };

  const updatePosition = (selected: string) => {
    setPosition(selected);
  };

  const updateRole = (selected: string) => {
    setRole(selected);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const domainRegex = /^[a-zA-Z0-9._%+-]+@elpoli\.edu\.co$/;
    if (!domainRegex.test(email)) {
      setEmailError(
        "Por favor ingresa correos electrónicos que pertenezcan al dominio del poli."
      );
      return;
    }

    setEmailError("");

    const formData = new FormData(e.currentTarget);
    const data = returnRequestBody(formData);
    data.password = encryptData(password);

    const response = await fetch("http://localhost:5000/person/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (!responseData.ERROR) {
      router.push("/login");
    } else {
      console.error("Failed to fetch positions:", data.ERROR);
    }
  };

  const returnRequestBody = (data: FormData) => {
    const jsonData: any = {};
    data.forEach((value, key) => {
      jsonData[key] = value;
    });

    return jsonData;
  };

  return (
    <div className="content-container">
      <h3>Registro de Nuevo Usuario</h3>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="documentId">ID:</label>
          <input
            type="text"
            id="documentId"
            name="documentId"
            value={documentId}
            onChange={(event) => {
              const filteredValue = event.target.value.replace(/[^0-9]/g, "");
              if (filteredValue) {
                setDocumentId(filteredValue);
              }
            }}
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && (
            <p style={{ color: "red", fontSize: "smaller" }}>{emailError}</p>
          )}
        </div>

        <div className="form-fields">
          <label htmlFor="department">Departmento</label>
          <Department setDepartment={updateDepartment} />
        </div>

        <div className="form-fields">
          <label htmlFor="position">Posición</label>
          <Position setPosition={updatePosition} />
        </div>

        <div className="form-fields">
          <label htmlFor="role">Rol</label>
          <Role setRole={updateRole} />
        </div>

        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <button type="submit" className="select-button">
            Registrarse
          </button>

          <button
            className="goBackButton"
            onClick={(event) => router.push("/login")}
          >
            Volver
          </button>
        </div>
      </form>
    </div>
  );
}