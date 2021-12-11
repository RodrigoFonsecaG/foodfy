const links = document.querySelectorAll('.links a');
const currentPage = window.location.pathname;

for (let link of links) {
  currentPage.includes(link.pathname) ? link.classList.add('active') : null;
}

// Paginação
function paginate(selectedPage, totalPages) {
  let pages = [],
    oldPage;

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;

    if (
      firstAndLastPage ||
      (pagesAfterSelectedPage && pagesBeforeSelectedPage)
    ) {
      if (oldPage && currentPage - oldPage > 2) {
        pages.push('...');
      }

      if (oldPage && currentPage - oldPage == 2) {
        pages.push(oldPage + 1);
      }

      pages.push(currentPage);

      oldPage = currentPage;
    }
  }

  return pages;
}

function activePage(actualPage) {
  const allPages = document.querySelectorAll('.pagination a');

  allPages.forEach((item) => {
    if (item.innerHTML == actualPage) {
      item.classList.add('active');
    }
  });
}

function createPagination(pagination) {
  const total = +pagination.dataset.total;
  const page = +pagination.dataset.page;
  const pages = paginate(page, total);
  const filter = pagination.dataset.filter;

  let elements = '';

  for (let page of pages) {
    if (String(page).includes('...')) {
      elements += `<span>${page}</span>`;
    } else {
      if (filter) {
        elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`;
      } else {
        elements += `<a href="?page=${page}">${page}</a>`;
      }
    }
  }

  pagination.innerHTML = elements;

  activePage(page);
}

const pagination = document.querySelector('.pagination');

if (pagination) {
  createPagination(pagination);
}
