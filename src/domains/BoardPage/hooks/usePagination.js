import { useMemo } from "react"

export const usePagination = ({currentPage, totalPages}) => {
    return useMemo(() => {
        const pageNumbers = [];

        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            pageNumbers.push({
                page: 1,
                type: 'number'
                });
            if (startPage > 2) {
                pageNumbers.push({
                    type: 'ellipsis'
                });
            }   
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push({
              page: i,
              type: 'number',
              isActive: currentPage === i
            });
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
              pageNumbers.push({
                type: 'ellipsis'
              });
            }
            pageNumbers.push({
              page: totalPages,
              type: 'number'
            });
        }

        return pageNumbers;
    }, [currentPage, totalPages]);
};
