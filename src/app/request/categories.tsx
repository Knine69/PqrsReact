import React, { useState, useEffect, useCallback } from "react";
import { useGlobalProp } from "../context/page";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import ContextValidator from "../context/utils";

const Categories = ({ setCategory }: { setCategory: any }) => {
  const { jwt } = useGlobalProp();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const category_default = "Categoría";
  const { validateTokenSession, returnAuthHeaders } = ContextValidator();
  
  const loadCategoryFetch = useCallback(async () => {
    const token = validateTokenSession();
    if (token) {
      try {
        const { documentId }: { documentId: string } = jwtDecode(token);
        const response_category = await fetch(
          "http://localhost:5000/category/",
          {
            method: "GET",
            headers: returnAuthHeaders(documentId, token),
          }
        );

        const data = await response_category.json();
        if (!data.ERROR) {
          setCategories(data);
        } else {
          console.error(
            "Failed to fetch categories:",
            data.ERROR
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    } else {
      router.push("/login")
    }
  }, [jwt]);
  
  useEffect(() => {
    loadCategoryFetch();
  }, [loadCategoryFetch]);

  return (
    <select
      name="category"
      id="categoryList"
      onChange={({ target: { value } }) => {
        setCategory(value);
      }}
    >
      {categories.length > 0 ? (
        categories.map((item) => (
          <option key={item["category_id"]} value={item["name"]}>
            {item["name"]}
          </option>
        ))
      ) : (
        <option defaultValue={category_default}>{category_default}</option>
      )}
    </select>
  );
};

export default Categories;
