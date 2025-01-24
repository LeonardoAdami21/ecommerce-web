import CategoryItem from "../components/CategoryItem";

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/tshirts", name: "T-Shirts", imageUrl: "/tshirts.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
];

const HomePage = () => {
  return (
    <div className="relative max-h-screen text-white overflow-hidden">
      <h1 className="text-center z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-bold text-emerald-400 mb-4">
        Explore Our Categories
      </h1>
      <p className="text-center text-xl text-gray-300 mb-12">
        Discover the latest products from our top categories
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryItem key={category.name} category={category} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
