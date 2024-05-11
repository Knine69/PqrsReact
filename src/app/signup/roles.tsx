import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGlobalProp } from "../context/page";
import { jwtDecode } from "jwt-decode";
import ContextValidator from "../context/utils";

const Role = ({ setRole }: { setRole: any }) => {
  const router = useRouter();
  const [roles, setRoles] = useState([]);
  const role_default = "Role";
  const { validateTokenSession, returnAuthHeaders } = ContextValidator();

  const loadRoleFetch = async () => {
    try {
      const response = await fetch("http://localhost:5000/role/", {
        method: "GET",
      });

      const data = await response.json();
      if (!data.ERROR) {
        const response = data.filter((item: { name: string, role_id: string }) => item["name"] !== "Admin" && item["name"] !== "Solucionador");
        setRoles(response);
      } else {
        console.error("Failed to fetch roles:", data.ERROR);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    loadRoleFetch();
  }, []);

  return (
    <select
      name="role"
      id="roleList"
      onChange={({ target: { value } }) => {
        setRole(value);
      }}
    >
      {roles.length > 0 ? (
        roles.map((item) => (
          <option key={item["role_id"]} value={item["name"]}>
            {item["name"]}
          </option>
        ))
      ) : (
        <option defaultValue={role_default}>{role_default}</option>
      )}
    </select>
  );
};

export default Role;
