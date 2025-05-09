// src/components/Pagination.tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  // Se não houver páginas ou apenas uma página, não mostrar a paginação
  if (totalPages <= 1) {
    return null;
  }

  // Criar um array com os números das páginas que serão exibidos
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Sempre mostrar a primeira página
    pageNumbers.push(1);

    // Calcular quais páginas mostrar ao redor da página atual
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    // Adicionar elipses se necessário
    if (rangeStart > 2) {
      pageNumbers.push("...");
    }

    // Adicionar páginas do intervalo
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i);
    }

    // Adicionar elipses se necessário
    if (rangeEnd < totalPages - 1) {
      pageNumbers.push("...");
    }

    // Sempre mostrar a última página se houver mais de uma página
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav aria-label="Paginação" className="flex justify-center">
      <ul className="inline-flex items-center -space-x-px">
        {/* Botão Anterior */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`block px-3 py-2 ml-0 leading-tight bg-white border border-gray-300 rounded-l-lg ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            <span className="sr-only">Anterior</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>

        {/* Números de Página */}
        {pageNumbers.map((pageNumber, index) => (
          <li key={index}>
            {pageNumber === "..." ? (
              <span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300">
                ...
              </span>
            ) : (
              <button
                onClick={() =>
                  typeof pageNumber === "number" && onPageChange(pageNumber)
                }
                className={`px-3 py-2 leading-tight border border-gray-300 ${
                  currentPage === pageNumber
                    ? "text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                    : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {pageNumber}
              </button>
            )}
          </li>
        ))}

        {/* Botão Próximo */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`block px-3 py-2 leading-tight bg-white border border-gray-300 rounded-r-lg ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            <span className="sr-only">Próximo</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
