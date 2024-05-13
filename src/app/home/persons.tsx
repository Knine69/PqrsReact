"use client";
import "./styles/persons-list.css";
import { useRouter } from "next/navigation";
import { useGlobalProp } from "../context/page";
import { useCallback, useEffect, useState } from "react";
import ContextValidator from "../context/utils";
import { jwtDecode } from "jwt-decode";

const People = ({ viewRequest }: { viewRequest: (item: any) => void }) => {
  const { jwt } = useGlobalProp();
  const router = useRouter();
  const [person, setPerson] = useState([]);
  const [sessionRole, setSessionRole] = useState("")
  const { validateTokenSession, returnAuthHeaders } = ContextValidator();

  const loadPersonsFetch = useCallback(async () => {
    const token = validateTokenSession();
    if (token) {
      try {
        const { documentId, role }: { documentId: string, role: string } = jwtDecode(token);
        setSessionRole(role);
        const response_category = await fetch("http://localhost:5000/person/", {
          method: "GET",
          headers: returnAuthHeaders(documentId, token),
        });

        const data = await response_category.json();
        if (!data.ERROR) {
          setPerson(data);
        } else {
          console.error("Failed to fetch people:", data.ERROR);
        }
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    } else {
      router.push("/login");
    }
  }, [jwt]);

  useEffect(() => {
    loadPersonsFetch();
  }, [loadPersonsFetch]);

  const toggleView = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: any
  ) => {
    viewRequest(person.filter((x) => x["person_id"] === item["person_id"]));
  };


  return (
    <div>
      {sessionRole === "Admin" && 
          <div className="person-container">
          <h2>Person List</h2>
          {person.length > 0  ? (person.map((item, index) => (
            <div className="request-list" key={index} onClick={(event) => toggleView(event, item)}>
              <h4>{item["email"]}</h4>
              <p>{item["name"]}</p>
            </div>
          ))) : (<></>)}
        </div>
      }
    </div>
  );
};

export default People;