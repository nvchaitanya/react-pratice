export function getFormattedFloat(number) {
    return parseFloat(number).toLocaleString('en-US');
}

export function getFormattedInt(number) {
    var value = parseInt(number).toLocaleString('en-US');

    return value != "NaN" ? value : '';
}

export function getPager(totalItems, currentPage = 1, pageSize) {
    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);
    let startPage, endPage;
    if (totalPages <= 5) {
        // less than 5 total pages so show all
        startPage = 1;
        endPage = totalPages;
    } else {
        // more than 5 total pages so calculate start and end pages
        if (currentPage <= 3) {
            startPage = 1;
            endPage = 5;
        } else if (currentPage + 2 >= totalPages) {
            startPage = totalPages - 4;
            endPage = totalPages;
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }
    }
    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // calculate start and end record count
    const startRecordCount = (currentPage - 1) * pageSize + 1;
    let endRecordCount = totalItems;
    if (pageSize < totalItems) {
        endRecordCount = pageSize * currentPage;
        if (endRecordCount > totalItems) {
            endRecordCount = totalItems;
        }
    }

    // create an array of pages to ng-repeat in the pager control
    const range = (start, end) => Array.from(Array(end - start + 1), (_, i) => start + i);
    const pages = range(startPage, endPage);
    // return object with all pager properties required by the view
    return {
        totalItems: totalItems,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        startRecordCount: startRecordCount,
        endRecordCount: endRecordCount,
        pages: pages
    };
}
