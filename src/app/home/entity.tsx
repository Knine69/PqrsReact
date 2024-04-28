"use client";
import "./styles/entity.css";
import { useEffect, useState } from "react";
import ContextValidator from "../context/utils";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const Entity = ({
  entity,
  toggleView,
  isPerson,
}: {
  entity: any;
  toggleView: () => void;
  isPerson: boolean;
}) => {
  const router = useRouter();
  const [sessionRole, setSessionRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { validateTokenSession, returnAuthHeaders, returnRequestBody } =
    ContextValidator();

  const validateSession = () => {
    const token = validateTokenSession();
    if (token) {
      const { role }: { role: string } = jwtDecode(token);
      setSessionRole(role);
    } else {
      router.push("/login");
    }
  };

  const editForm = () => {
    setIsEditing(!isEditing);
  };

  const saveChanges = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = validateTokenSession();
    if (token) {
      const table = isPerson ? "person" : "request";
      const formData = new FormData(event.currentTarget);
      const requestBody: Record<string, any> = returnRequestBody(formData);
      const { documentId }: { documentId: string } = jwtDecode(token);

      let id = 0;

      if (table === "person") {
        id = sessionRole === "Admin" ? entity["person_id"] : "";
      } else {
        id =
          sessionRole === "Admin" ? entity["request_id"] : entity["RequestId"];

        if (checkRestricted(requestBody)) {
          alert("These are restricted properties, cannot edit them");
          return;
        }
      }

      const response = await fetch(`http://localhost:5000/${table}/${id}`, {
        method: "PATCH",
        headers: returnAuthHeaders(documentId, token),
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (!data.ERROR) {
        console.log("Patched successfully");
        toggleView();
      } else {
        console.error("Failed to patch entity:", data.ERROR);
        if (data.ERROR.toLowerCase().includes("expired")) {
          router.push("/login");
        }
      }
    }
  };

  const checkRestricted = (jsonData: Record<string, any>) => {
    const keysToCheck = ["RequestId", "Solver", "State", "Timestamp"];
    let result = false;
    keysToCheck.forEach((key) => {
      if (jsonData[key]) {
        result = true;
        return;
      }
    });
    return result;
  };

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  return (
    <div className="single-entity-container">
      <h2>Request</h2>
      <form id="requestForm" onSubmit={saveChanges}>
        <div>
          <div className="form-fields">
            {Object.keys(entity).map((key, index) => (
              <div key={index}>
                <label htmlFor={key}>{key}</label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  autoComplete="off"
                  readOnly={!isEditing}
                  min={1}
                  placeholder={entity[key]}
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="home-button" disabled={!isEditing}>
          Save changes
        </button>
      </form>

      <button onClick={editForm} className="home-button">
        Edit request
      </button>

      <button onClick={toggleView} className="home-button">
        Go back
      </button>
    </div>
  );
};
export default Entity;
