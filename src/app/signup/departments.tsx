import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGlobalProp } from "../context/page";
import { jwtDecode } from "jwt-decode";
import ContextValidator from "../context/utils";

const Department = ({ setDepartment }: { setDepartment: any }) => {
  const router = useRouter();
  const [departments, setDepartments] = useState([]);
  const department_default = "Department";
  const { validateTokenSession, returnAuthHeaders } = ContextValidator();

  const loadDepartmentFetch = async () => {
    try {
      const response = await fetch("http://localhost:5000/department/", {
        method: "GET",
      });

      const data = await response.json();
      if (!data.ERROR) {
        setDepartments(data);
      } else {
        console.error("Failed to fetch departments:", data.ERROR);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    loadDepartmentFetch();
  }, []);

  return (
    <select
      name="department"
      id="departmentList"
      onChange={({ target: { value } }) => {
        setDepartment(value);
      }}
    >
      {departments.length > 0 ? (
        departments.map((item) => (
          <option key={item["department_id"]} value={item["name"]}>
            {item["name"]}
          </option>
        ))
      ) : (
        <option defaultValue={department_default}>{department_default}</option>
      )}
    </select>
  );
};

export default Department;
