import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { useState } from "react";

const categories = [
  "Jean",
  "T-Shirt",
  "Shoes",
  "Glasses",
  "Jacket",
  "Suit",
  "Bag",
];

const CreateProductForm: React.FC = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(newProduct);
    // Handle product creation logic here
  };
  return (
    <motion.div
      className="bg-gray-800 shadow-lg mb-8 p-8 rounded-lg max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-emerald-300">
        Create a new product
      </h2>
      <form action="" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-400"
          >
            Product Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="mt-1 block w-full rounded-md border py-2 px-3 bg-gray-700 border-gray-600 shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-300"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            step="0.01"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-1 flex items-center">
          <input
            type="file"
            id="image"
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image"
            className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Image
          </label>
          {newProduct.image && (
            <span className="ml-3 text-sm text-gray-400">Image uploaded </span>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
