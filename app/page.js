"use client";
import Header from "@/components/Header";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [dropdown, setDropdown] = useState([

  ]);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      let rjson = await response.json();
      setProducts(rjson.products);
    };
    fetchProducts();
  }, []);
  const buttonAction = async (action, slug, initialQuantity) => {
    //Immediately change the quantity of the product with the given slug
    let index = products.findIndex((item)=> item.slug == slug)
    console.log(index)
    let newProducts = JSON.parse(JSON.stringify(products)) 
    if (action =="plus"){
      newProducts[index].quantity = parseInt(initialQuantity) + 1
    } 
    else{
      newProducts[index].quantity = parseInt(initialQuantity) - 1
    }
    setProducts(newProducts)

    let indexdrop = dropdown.findIndex((item)=> item.slug == slug)
    console.log(indexdrop,"parse")
    let newDropdown = JSON.parse(JSON.stringify(dropdown)) 
    if (action =="plus"){
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1
      console.log(newDropdown[indexdrop].quantity)
    } 
    else{
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1
    }
    setDropdown(newDropdown)

    console.log(action, slug);
    setLoadingAction(true);
    const response = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, slug, initialQuantity })
    });
    let r = await response.json();
    console.log(r);
    setLoadingAction(false);
  };
  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        console.log("Product added successfully");
        setAlert("Your Product has been added!");
        setProductForm({});
      } else {
        // Handle error cases
        console.error("Error adding product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };
  const onDropdownEdit = async (e) => {
    setQuery(e.target.value);

    if (query.length>3) {
      setLoading(true);
      setDropdown([]);
      const response = await fetch("/api/search?query=" + query);
      let rjson = await response.json();
      setDropdown(rjson.products);
      setLoading(false);
    }
  };
  return (
    <>
      <Header />
      {/* Search a Product */}
      <div className="container mx-auto my-8">
        <div className="text-green-700 text-center">{alert}</div>
        <h1 className="text-3xl font-semibold mb-6">Search a Product</h1>
        {/* Search form with input and dropdown */}
        <div className="max-w-full flex items-center">
          <div className="flex-1 mb-2">
            <div className="mb-2">Product Name:</div>
            <input
              onChange={onDropdownEdit}
              type="text"
              id="productNameSearch"
              name="productNameSearch"
              className="border rounded-md p-2 w-full"
            />
          </div>
          <div className="flex-1 ml-2">
            <div className="mb-2">Category:</div>
            <select
              id="categoryDropdown"
              name="categoryDropdown"
              className="border rounded-md p-2 w-full"
              // Add any necessary select handling logic or state management
            >
              <option value="">All</option>
              <option value="category1">Category 1</option>
              <option value="category2">Category 2</option>
              {/* Add more options as needed */}
            </select>
          </div>
        </div>
        {loading && (
          <svg
            width="200px"
            height="200px"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
            style={{
              margin: "auto",
              background: "rgb(241, 242, 243)",
              display: "block",
              shapeRendering: "auto",
            }}
          >
            <path
              d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
              fill="#1d0e0b"
              stroke="none"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="1s"
                repeatCount="indefinite"
                keyTimes="0;1"
                values="0 50 51;360 50 51"
              ></animateTransform>
            </path>
          </svg>
        )}
        <div className="dropcontainer absolute w-[39vw] bg-purple-100 rounded-md   border-1 ">
          {dropdown.map((item) => {
            return (
              <div
                key={item.slug}
                className="container flex justify-between p-2 my-1 border-b-2"
              >
                <span className="slug">
                  {item.slug} ({item.quantity} available for ${item.price})
                </span>
                <div className="mx-5">
                  <button
                    onClick={() => {
                      buttonAction("minus", item.slug, item.quantity);
                    }}
                    disabled={loadingAction}
                    className="subtract inline-block px-2 cursor-pointer bg-purple-500 text-white font-semibolde rounded-lg shadow-md mx-2 disabled:bg-purple-200"
                  >
                    -
                  </button>
                  <span className="quantity mx-8">{item.quantity}</span>
                  <button
                    onClick={() => {
                      buttonAction("plus", item.slug, item.quantity);
                    }}
                    disabled={loadingAction}
                    className="subtract inline-block px-2 cursor-pointer bg-purple-500 text-white font-semibolde rounded-lg shadow-md mx-2 disabled:bg-purple-200"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add a Product */}
      <div className="container mx-auto ny-8">
        <h1 className="text-3xl font-semibold mb-6">Add a Product</h1>
        <form className="mt-4">
          <label className="block mb-2" htmlFor="productName">
            Product Slug:
            <input
              value={productForm?.slug || ""}
              onChange={handleChange}
              type="text"
              id="productName"
              name="slug"
              className="border rounded-md p-2 w-full"
              // Add any necessary form handling logic or state management
            />
          </label>
          <label className="block mb-2" htmlFor="quantity">
            Quantity:
            <input
              value={productForm?.quantity || ""}
              onChange={handleChange}
              type="number"
              id="quantity"
              name="quantity"
              className="border rounded-md p-2 w-full"
              // Add any necessary form handling logic or state management
            />
          </label>
          <label className="block mb-2" htmlFor="price">
            Price:
            <input
              value={productForm?.price || ""}
              onChange={handleChange}
              type="number"
              id="price"
              name="price"
              className="border rounded-md p-2 w-full"
              // Add any necessary form handling logic or state management
            />
          </label>
          <button onClick={addProduct} type = "submit" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out">
            Add Product
          </button>
        </form>
      </div>

      {/* Display Current Stock */}
      <div className="container my-6 mx-auto my-8">
        <h1 className="text-3xl font-semibold mb-6">Display Current Stock</h1>

        {/* Table for displaying stock */}
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4">Product Name</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Price</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            {/* Example row, replace with your actual stock data */}
            {products.map((product) => {
              return (
                <tr key={product.slug}>
                  <td className="py-2 px-4 border">{product.slug}</td>
                  <td className="py-2 px-4 border">{product.quantity}</td>
                  <td className="py-2 px-4 border">${product.price}</td>
                  {/* Add more cells as needed */}
                </tr>
              );
            })}

            {/* Add more rows based on your stock data */}
          </tbody>
        </table>
      </div>
    </>
  );
}
