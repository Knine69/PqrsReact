"use client";

import "./login.css";
import { useRouter } from "next/navigation";
import {  useEffect, useState } from "react";
import { useGlobalProp } from "../context/page";
import ContextValidator from "../context/utils";

export default function Page() {
  const router = useRouter();
  const [documentId, setDocumentId] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const { jwt, setJwt } = useGlobalProp();
  const { encryptData } = ContextValidator();

  useEffect(() => {
    if(jwt !== "" && authenticated){
      router.push("/home")
    }
  }, [jwt]);

  const returnRequestBody = (data: FormData ) => {
    const jsonData: any = {};
    data.forEach((value, key) => {
      jsonData[key] = value;
    });

    return jsonData
};

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const data = returnRequestBody(formData);
      data.password = encryptData(password);
      const response = await fetch("http://localhost:5000/login/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const { sessionToken, validSession, description }: { sessionToken: string, validSession: boolean, description: string } = await response.json()

      if(validSession){
        setJwt(sessionToken)
        setAuthenticated(validSession)
        localStorage.setItem("sessionToken", sessionToken)
      } else {
        alert(`Something went wrong: ${description}`)
      }
    } catch(error) {
      alert(`Something went wrong: ${error}`)
    }
    setDocumentId('');
    setPassword('');
  }

  return (
    <div className="content-container">
      <h1>POLI PQRS</h1>
      <p>Ingresa a tu cuenta</p>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="documentId">Document ID</label>
          <input
            type="text"
            id="documentId"
            name="document"
            value={documentId}
            onChange={(event) => setDocumentId(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit" className="select-button">
          Submit
        </button>
      </form>
    </div>
  );
}
