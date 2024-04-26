import React, { useState, useEffect, useCallback } from "react";
import { useGlobalProp } from "../context/page";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const Categories = ({ setCategory }: { setCategory: any }) => {
  const { jwt } = useGlobalProp();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const category_default = "Categoría";
  
  const loadCategoryFetch = useCallback(async () => {
    const token = jwt || localStorage.getItem("sessionToken");
    if (!token) {
      alert("You are not authenticated");
      router.push("/home");
    } else {
      try {
        const { documentId }: { documentId: string } = jwtDecode(token);
        const response_category = await fetch(
          "http://localhost:5000/category/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token,
              "documentId": documentId,
            },
          }
        );

        if (response_category.ok) {
          const categoriesData = await response_category.json();
          setCategories(categoriesData);
        } else {
          console.error(
            "Failed to fetch categories:",
            response_category.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
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
