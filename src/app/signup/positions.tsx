import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGlobalProp } from "../context/page";
import { jwtDecode } from "jwt-decode";
import ContextValidator from "../context/utils";

const Position = ({ setPosition }: { setPosition: any }) => {
  const router = useRouter();
  const [positions, setPositions] = useState([]);
  const position_default = "Position";
  const { validateTokenSession, returnAuthHeaders } = ContextValidator();

  const loadPositionFetch = async () => {
    try {
      const response = await fetch("http://localhost:5000/position/", {
        method: "GET",
      });

      const data = await response.json();
      if (!data.ERROR) {
        setPositions(data);
      } else {
        console.error("Failed to fetch positions:", data.ERROR);
      }
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  useEffect(() => {
    loadPositionFetch();
  }, []);

  return (
    <select
      name="position"
      id="positionList"
      onChange={({ target: { value } }) => {
        setPosition(value);
      }}
    >
      {positions.length > 0 ? (
        positions.map((item) => (
          <option key={item["position_id"]} value={item["name"]}>
            {item["name"]}
          </option>
        ))
      ) : (
        <option defaultValue={position_default}>{position_default}</option>
      )}
    </select>
  );
};

export default Position;
