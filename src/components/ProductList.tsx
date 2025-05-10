import { useEffect } from "react";
import { useProductStore } from "../store/productStore";
import LoadingSpinner from "./LoadingSpinner";
import ProductCard from "./ProductCard";
import FilterBar from "./FilterBar";
import Pagination from "./Pagination";

const ProductList = () => {
  const {
    products = [],
    isLoading,
    error,
    fetchProducts,
    currentPage,
    totalPages,
    setPage,
  } = useProductStore();

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button
            onClick={() => fetchProducts(currentPage)}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <FilterBar />

      {products.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold text-gray-600">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-500 mt-2">
            Tente ajustar os filtros de busca
          </p>
        </div>
      ) : (
        <>
          <div
            data-testid="product-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 mb-6 w-full"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
