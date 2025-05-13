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
  // Número máximo de botões de página para mostrar
  const maxPageButtons = 5;

  // Gera um array de números de página para renderizar
  const getPageNumbers = (): number[] => {
    if (totalPages <= maxPageButtons) {
      // Se houver menos páginas que o máximo de botões, mostra todas
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Caso contrário, mostra um número fixo de botões com a página atual no centro (quando possível)
    const halfMaxButtons = Math.floor(maxPageButtons / 2);
    let startPage = Math.max(1, currentPage - halfMaxButtons);
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    // Ajusta a página inicial se não conseguirmos mostrar maxPageButtons
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      {/* Botão "Anterior" */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
        }`}
      >
        Anterior
      </button>

      {/* Botão primeira página (se não estiver visível) */}
      {getPageNumbers()[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            1
          </button>
          {getPageNumbers()[0] > 2 && (
            <span className="px-2 py-1 text-gray-500">...</span>
          )}
        </>
      )}

      {/* Números das páginas */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Botão última página (se não estiver visível) */}
      {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
        <>
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
            <span className="px-2 py-1 text-gray-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Botão "Próximo" */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
        }`}
      >
        Próximo
      </button>
    </div>
  );
};

export default Pagination;
