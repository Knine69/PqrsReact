"use client";
import "./styles/request-list.css";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useGlobalProp } from "../context/page";
import { jwtDecode } from "jwt-decode";
import ContextValidator from "../context/utils";

const RequestList = ({ viewRequest }: { viewRequest: (item: any) => void }) => {
  const [requests, setRequests] = useState([]);
  const [sessionRole, setSessionRole] = useState("");
  const { jwt } = useGlobalProp();
  const router = useRouter();
  const { validateTokenSession, returnAuthHeaders } = ContextValidator();

  const toggleView = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: any
  ) => {
    viewRequest(filterBySession(item));
  };

  const filterBySession = (item: any) => {
    return sessionRole === "Admin"
      ? requests.filter((x) => x["request_id"] === item["request_id"])
      : requests.filter((x) => x["RequestId"] === item["RequestId"]);
  };

  const loadRequests = useCallback(async () => {
    const token = validateTokenSession();
    if (token) {
      try {
        const { documentId, role }: { documentId: string; role: string } =
        jwtDecode(token);
        setSessionRole(role);
        const response_requests = await fetch(
          "http://localhost:5000/request/",
          {
            method: "GET",
            headers: returnAuthHeaders(documentId, token),
          }
        );

        const data = await response_requests.json();
        if (!data.ERROR) {
          setRequests(data);
        } else {
          console.error("Failed to fetch requests:", data.ERROR);

          if (data.ERROR.toLowerCase().includes("expired")) {
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Something went wrong: ", error);
      }
    } else {
      router.push("/login");
    }
  }, [jwt]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  return (
    <div className="list-container">
      <h2>Request List</h2>
      {sessionRole === "Admin"
        ? requests.map((item, index) => (
            <div
              className="request-list"
              key={index}
              onClick={(event) => toggleView(event, item)}
            >
              <h4>{item["summary"]}</h4>
              <p>{item["generated_at"]}</p>
            </div>
          ))
        : requests.map((item, index) => (
            <div
              className="request-list"
              key={index}
              onClick={(event) => toggleView(event, item)}
            >
              <h4>{item["Summary"]}</h4>
              <p>{item["Category"]}</p>
              <p>Solver: {item["Solver"]}</p>
            </div>
          ))}
    </div>
  );
};

export default RequestList;
