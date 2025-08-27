"use client";

import { useSearchParams, useRouter } from "next/navigation";

const Pagination = ({ paginationState, name = "results" }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page") || 1);

  const updatePage = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  if (!paginationState?.totalPages) return null;

  return (
    <div className="flex items-center justify-between overflow-x-auto p-4 rounded-bl-lg rounded-br-lg">
      <div className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-medium">{paginationState.currentPage}</span> to{" "}
        <span className="font-medium">{paginationState.totalPages}</span> of{" "}
        <span className="font-medium">{paginationState.totalItems}</span> {name}
      </div>

      <div className="flex space-x-2">
        <button
          className="px-3 py-1 cursor-pointer rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => currentPage > 1 && updatePage(currentPage - 1)}
        >
          Previous
        </button>

        {Array.from({ length: paginationState.totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => currentPage !== index + 1 && updatePage(index + 1)}
            className={`px-3 py-1 cursor-pointer rounded-md border text-sm font-medium ${
              currentPage === index + 1
                ? "bg-blue-50 text-blue-600 border-blue-300"
                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 cursor-pointer rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() =>
            currentPage < paginationState.totalPages &&
            updatePage(currentPage + 1)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
