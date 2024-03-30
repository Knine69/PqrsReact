import React, { useState, useEffect } from "react";

const Categories = ({ setCategory }: { setCategory: any }) => {
  const [categories, setCategories] = useState([]);
  const category_default = "Categoría";

  useEffect(() => {
    const loadCategoryFetch = async () => {
      const response_category = await fetch("http://localhost:5000/category/", {
        method: "GET",
      }).then((response) => {
        if (response.ok) {
          return response.json();
        }
        return [];
      });
      setCategories(response_category);
    };

    loadCategoryFetch();
  }, []);

  return (
    <select
      name="category"
      id="categoryList"
      onChange={({ target: { value } }) => {
        setCategory(value);
      }}
    >
      <option defaultValue={category_default}>{category_default}</option>
      {categories.map((item) => (
        <option key={item["category_id"]} value={item["name"]}>
          {item["name"]}
        </option>
      ))}
    </select>
  );
};

export default Categories;
