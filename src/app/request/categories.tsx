import React, { useState, useEffect } from 'react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const category_default = "Categoría"
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
    <select name="category" id="categoryList">
      <option defaultValue={category_default}>{category_default}</option>
      {categories.map(item => (
        <option key={item["category_id"]} value={item["category_id"]}>{item["name"]}</option>
      ))}
    </select>
  );
};

export default Categories;
