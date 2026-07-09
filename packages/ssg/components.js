import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId } from 'react';
const cn = (...classes) => classes.filter(Boolean).join(' ');
const getTagHref = (tag) => `/search/?tag=${encodeURIComponent(tag)}`;
const visiblePaginationPages = 3;
const getPaginationItems = (page, pages) => {
    if (pages <= visiblePaginationPages + 2) {
        return Array.from({ length: pages }, (_value, index) => ({
            page: index + 1,
            type: 'page',
        }));
    }
    const halfWindow = Math.floor(visiblePaginationPages / 2);
    const windowStart = Math.max(2, Math.min(page - halfWindow, pages - visiblePaginationPages));
    const windowEnd = Math.min(pages - 1, windowStart + visiblePaginationPages - 1);
    const items = [
        {
            page: 1,
            type: 'page',
        },
    ];
    if (windowStart > 2) {
        items.push({
            key: 'start-ellipsis',
            type: 'ellipsis',
        });
    }
    for (let itemPage = windowStart; itemPage <= windowEnd; itemPage += 1) {
        items.push({
            page: itemPage,
            type: 'page',
        });
    }
    if (windowEnd < pages - 1) {
        items.push({
            key: 'end-ellipsis',
            type: 'ellipsis',
        });
    }
    items.push({
        page: pages,
        type: 'page',
    });
    return items;
};
const headerSearchScript = String.raw `
(() => {
  const minimumQueryLength = 2;
  const headers = document.querySelectorAll('.vyriy-header');

  headers.forEach((header) => {
    if (header.dataset.searchReady === 'true') {
      return;
    }

    header.dataset.searchReady = 'true';

    const checkbox = header.querySelector('.vyriy-header__search-checkbox');
    const form = header.querySelector('.vyriy-header__search');
    const input = form ? form.querySelector('input[name="q"]') : null;

    if (!checkbox || !form || !input) {
      return;
    }

    const focusSearchInput = (attempt = 0) => {
      if (!checkbox.checked) {
        return;
      }

      input.focus();

      if (document.activeElement === input || attempt >= 4) {
        return;
      }

      const scheduleFocus = window.requestAnimationFrame || window.setTimeout;

      scheduleFocus(() => focusSearchInput(attempt + 1));
    };

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        focusSearchInput();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !checkbox.checked) {
        return;
      }

      checkbox.checked = false;
      input.blur();
    });

    input.addEventListener('input', () => {
      input.setCustomValidity('');
    });

    form.addEventListener('submit', (event) => {
      const query = input.value.trim();

      if (query.length >= minimumQueryLength) {
        input.value = query;
        input.setCustomValidity('');
        return;
      }

      event.preventDefault();
      input.setCustomValidity('Enter at least ' + minimumQueryLength + ' characters.');
      input.reportValidity();
    });
  });
})();
`;
const searchScript = String.raw `
(() => {
  const root = document.getElementById('search-root');

  if (!root) {
    return;
  }

  const documentsUrl = root.dataset.documentsUrl || '/search/documents.json';
  const indexUrl = root.dataset.indexUrl || '/search/minisearch-index.json';
  const parameters = new URLSearchParams(window.location.search);
  const tag = parameters.get('tag');
  const query = (parameters.get('q') || '').trim();
  const formInput = document.querySelector('.vyriy-search-page__form input[name="q"]');

  if (formInput) {
    formInput.value = query;
  }

  if (!tag && !query) {
    root.innerHTML = '<p class="vyriy-search-page__status">Choose a post tag or enter a search query to see matching articles and examples.</p>';
    return;
  }

  const searchOptions = {
    boost: {
      content: 1,
      description: 2,
      tags: 3,
      title: 4
    },
    fuzzy: 0.2,
    prefix: true
  };
  const miniSearchOptions = {
    fields: ['title', 'description', 'tags', 'content'],
    storeFields: ['title', 'description', 'section', 'slug', 'url', 'tags', 'date'],
    searchOptions
  };
  const resultPageSize = 10;
  let currentMatches = [];
  let visibleResultCount = resultPageSize;
  const normalizeTag = (value) => value.trim().toLowerCase();
  const escapeHtml = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
  const getDocumentDescription = (document) => document.description || document.content || '';
  const getDocumentTags = (document) => Array.isArray(document.tags) ? document.tags : [];
  const renderTag = (value) => '<a class="vyriy-search-page__tag" href="/search/?tag=' + encodeURIComponent(value) + '">' + escapeHtml(value) + '</a>';
  const renderDocument = (document) => {
    const description = getDocumentDescription(document);
    const tags = getDocumentTags(document);
    const descriptionHtml = description
      ? '<p class="vyriy-search-page__result-description">' + escapeHtml(description) + '</p>'
      : '';
    const tagsHtml = tags.length
      ? '<div class="vyriy-search-page__tags">' + tags.map(renderTag).join('') + '</div>'
      : '';

    return '<article class="vyriy-search-page__result">' +
      '<a class="vyriy-search-page__result-link" href="' + escapeHtml(document.url) + '">' +
        '<h2 class="vyriy-search-page__result-title">' + escapeHtml(document.title) + '</h2>' +
        descriptionHtml +
      '</a>' +
      tagsHtml +
    '</article>';
  };
  const getDocumentMap = (documents) => new Map(documents.map((document) => [document.id, document]));
  const getTagMatches = (documents, value) => {
    const normalizedTag = normalizeTag(value);

    return documents.filter((document) =>
      getDocumentTags(document).some((candidate) => normalizeTag(candidate) === normalizedTag),
    );
  };
  const getQueryMatches = (documents, indexJson, value) => {
    const MiniSearch = window.MiniSearch;

    if (!MiniSearch) {
      throw new Error('MiniSearch is unavailable.');
    }

    const documentsById = getDocumentMap(documents);
    const search = MiniSearch.loadJSON(JSON.stringify(indexJson), miniSearchOptions);

    return search.search(value).map((result) => documentsById.get(result.id) || result).filter(Boolean);
  };
  const renderResults = (documents, emptyMessage) => {
    if (!documents.length) {
      return '<p class="vyriy-search-page__status">' + emptyMessage + '</p>';
    }

    const visibleDocuments = documents.slice(0, visibleResultCount);
    const remainingCount = documents.length - visibleDocuments.length;
    const moreButton = remainingCount > 0
      ? '<button class="vyriy-search-page__more" type="button" data-search-more>Show more (' + remainingCount + ')</button>'
      : '';

    return (
      '<div class="vyriy-search-page__results">' + visibleDocuments.map(renderDocument).join('') + '</div>' +
      moreButton
    );
  };
  const renderStatus = () => {
    if (tag && query) {
      return 'Query: <strong>' + escapeHtml(query) + '</strong> · Tag: <strong>' + escapeHtml(tag) + '</strong>';
    }

    if (query) {
      return 'Query: <strong>' + escapeHtml(query) + '</strong>';
    }

    return 'Tag: <strong>' + escapeHtml(tag) + '</strong>';
  };
  const renderSearchState = (emptyMessage) => {
    root.innerHTML =
      '<p class="vyriy-search-page__status">' + renderStatus() + '</p>' +
      renderResults(currentMatches, emptyMessage);
  };

  root.addEventListener('click', (event) => {
    const target = event.target;

    if (!target || !target.closest('[data-search-more]')) {
      return;
    }

    visibleResultCount += resultPageSize;
    renderSearchState(query ? 'No posts match this search yet.' : 'No posts use this tag yet.');
  });

  const dataRequests = [fetch(documentsUrl)];

  if (query) {
    dataRequests.push(fetch(indexUrl));
  }

  Promise.all(dataRequests)
    .then((responses) => {
      for (const response of responses) {
        if (!response.ok) {
          throw new Error('Search data is unavailable.');
        }
      }

      return Promise.all(responses.map((response, index) => index === 1 ? response.text() : response.json()));
    })
    .then(([documents, indexText]) => {
      const indexJson = indexText ? JSON.parse(indexText) : undefined;
      const queryMatches = query ? getQueryMatches(documents, indexJson, query) : documents;
      currentMatches = tag ? getTagMatches(queryMatches, tag) : queryMatches;

      document.title = 'Vyriy Search: ' + (query || tag);
      renderSearchState(query ? 'No posts match this search yet.' : 'No posts use this tag yet.');
    })
    .catch(() => {
      root.innerHTML = '<p class="vyriy-search-page__status">Search data could not be loaded.</p>';
    });
})();
`;
const SearchForm = (props) => {
    const { action = '/search/', buttonLabel = 'Search', className, inputLabel = 'Search query', inputName = 'q', method = 'get', minimumQueryLength = 2, placeholder = 'Search', showButton = true, ...rest } = props;
    const inputId = useId();
    return (_jsxs("form", { ...rest, action: action, className: cn('vyriy-search-form', className), method: method, children: [_jsx("label", { className: "vyriy-search-form__label", htmlFor: inputId, children: inputLabel }), _jsx("input", { className: "vyriy-search-form__input", id: inputId, minLength: minimumQueryLength, name: inputName, placeholder: placeholder, required: true, type: "search" }), showButton ? (_jsx("button", { className: "vyriy-search-form__button", type: "submit", children: buttonLabel })) : null] }));
};
const Navigation = (props) => {
    const { ariaLabel = 'Main navigation', className, menuLabel = 'Menu', ...rest } = props;
    const menuId = useId();
    const listId = useId();
    return (_jsxs("nav", { ...rest, "aria-label": ariaLabel, className: cn('vyriy-navigation', className), children: [_jsx("input", { "aria-controls": listId, "aria-label": menuLabel, className: "vyriy-navigation__checkbox", id: menuId, type: "checkbox" }), _jsxs("label", { className: "vyriy-navigation__toggle", htmlFor: menuId, children: [_jsxs("span", { className: "vyriy-navigation__toggle-icon", "aria-hidden": "true", children: [_jsx("span", { className: "vyriy-navigation__toggle-line" }), _jsx("span", { className: "vyriy-navigation__toggle-line" }), _jsx("span", { className: "vyriy-navigation__toggle-line" })] }), _jsx("span", { className: "vyriy-navigation__toggle-text", children: menuLabel })] }), _jsxs("ul", { className: "vyriy-navigation__list", id: listId, children: [_jsx("li", { className: "vyriy-navigation__item", children: _jsx("a", { className: "vyriy-navigation__link", href: "/blog/", children: "Blog" }) }), _jsx("li", { className: "vyriy-navigation__item", children: _jsx("a", { className: "vyriy-navigation__link", href: "/examples/", children: "Examples" }) }), _jsx("li", { className: "vyriy-navigation__item", children: _jsx("a", { className: "vyriy-navigation__link", href: "/docs/", children: "Documentation" }) }), _jsx("li", { className: "vyriy-navigation__item", children: _jsx("a", { className: "vyriy-navigation__link", href: "https://github.com/evheniy/vyriy", rel: "noreferrer", target: "_blank", children: "GitHub" }) }), _jsx("li", { className: "vyriy-navigation__item", children: _jsx("a", { className: "vyriy-navigation__link", href: "/consulting/", children: "Consulting" }) })] })] }));
};
const Header = (props) => {
    const { className, homeHref = '/', logoAlt = '', logoSrc = '/assets/vyriy-v-wings.png', name, ...rest } = props;
    const searchToggleId = useId();
    return (_jsxs("header", { ...rest, className: cn('vyriy-header', className), children: [_jsxs("div", { className: "vyriy-header__inner", children: [_jsxs("a", { className: "vyriy-header__brand", href: homeHref, children: [_jsx("img", { className: "vyriy-header__logo", src: logoSrc, alt: logoAlt, width: "72", height: "46", fetchPriority: "low" }), name] }), _jsxs("div", { className: "vyriy-header__actions", children: [_jsxs("div", { className: "vyriy-header__search-shell", children: [_jsx("input", { className: "vyriy-header__search-checkbox", id: searchToggleId, type: "checkbox" }), _jsxs("label", { className: "vyriy-header__search-toggle", htmlFor: searchToggleId, children: [_jsx("span", { className: "vyriy-header__search-label", children: "Search" }), _jsx("span", { className: "vyriy-header__search-icon", "aria-hidden": "true" })] }), _jsx(SearchForm, { className: "vyriy-header__search", placeholder: "Search", showButton: false })] }), _jsx(Navigation, { className: "vyriy-header__navigation" })] })] }), _jsx("script", { dangerouslySetInnerHTML: { __html: headerSearchScript } })] }));
};
const Footer = (props) => {
    const { className, text, ...rest } = props;
    return (_jsx("footer", { ...rest, className: cn('vyriy-footer', className), children: _jsx("div", { className: "vyriy-footer__inner", children: _jsx("p", { className: "vyriy-footer__text", children: text }) }) }));
};
const Layout = (props) => {
    const { children, footerText, name } = props;
    return (_jsxs("div", { className: "vyriy-layout", children: [_jsx(Header, { name: name }), _jsx("main", { className: "vyriy-layout__main", children: children }), _jsx(Footer, { text: footerText })] }));
};
export const Card = (props) => {
    const { className, date, description, href, tags = [], title, ...rest } = props;
    const hasMetadata = Boolean(date) || tags.length > 0;
    return (_jsx("article", { ...rest, className: cn('vyriy-card', className), children: _jsxs("a", { "aria-label": title, className: "vyriy-card__link", href: href, children: [_jsx("h2", { className: "vyriy-card__title", children: title }), _jsx("p", { className: "vyriy-card__description", children: description }), hasMetadata ? (_jsxs("div", { className: "vyriy-card__meta", children: [date ? (_jsx("time", { className: "vyriy-card__date", dateTime: date, children: date })) : null, tags.length > 0 ? (_jsx("ul", { className: "vyriy-card__tags", "aria-label": "Tags", children: tags.map((tag) => (_jsx("li", { className: "vyriy-card__tag", children: tag }, tag))) })) : null] })) : null] }) }));
};
export const Page = (props) => {
    const { content, featured = [], related = [], tags = [] } = props;
    return (_jsx(Layout, { footerText: "Copyright \u00A9 2026 Vyriy", name: "Vyriy", children: _jsxs("section", { className: "vyriy-page", children: [_jsx("div", { className: "vyriy-page__content", children: content }), featured.length > 0 ? (_jsx("section", { "aria-label": "Featured posts", className: "vyriy-page__featured", children: _jsx("div", { className: "vyriy-page__featured-list", children: featured.map((item) => (_jsx(Card, { className: "vyriy-page__featured-card", description: item.description, href: item.href, title: item.title }, item.href))) }) })) : null, tags.length > 0 ? (_jsx("nav", { "aria-label": "Post tags", className: "vyriy-page__tags", children: tags.map((tag) => (_jsx("a", { className: "vyriy-page__tag", href: getTagHref(tag), children: tag }, tag))) })) : null, related.length > 0 ? (_jsxs("aside", { "aria-labelledby": "related-posts-title", className: "vyriy-page__related", children: [_jsx("h2", { className: "vyriy-page__section-title", id: "related-posts-title", children: "Related posts" }), _jsx("div", { className: "vyriy-page__related-list", children: related.map((item) => (_jsx(Card, { className: "vyriy-page__related-card", description: item.description, href: item.href, title: item.title }, item.href))) })] })) : null] }) }));
};
const Pagination = (props) => {
    const { className, getHref, page, pages, ...rest } = props;
    if (pages <= 1) {
        return null;
    }
    const paginationItems = getPaginationItems(page, pages);
    const renderControl = (label, targetPage, disabled) => {
        if (!getHref || disabled) {
            return (_jsx("button", { className: "vyriy-pagination__control", disabled: disabled, type: "button", children: label }));
        }
        return (_jsx("a", { className: "vyriy-pagination__control", href: getHref(targetPage), children: label }));
    };
    return (_jsxs("nav", { ...rest, "aria-label": "Pagination", className: cn('vyriy-pagination', className), children: [renderControl('Prev', page - 1, page === 1), _jsx("ol", { className: "vyriy-pagination__pages", children: paginationItems.map((item) => {
                    if (item.type === 'ellipsis') {
                        return (_jsx("li", { className: "vyriy-pagination__item", children: _jsx("span", { className: "vyriy-pagination__ellipsis", "aria-hidden": "true", children: "..." }) }, item.key));
                    }
                    return (_jsx("li", { className: "vyriy-pagination__item", children: getHref && item.page !== page ? (_jsx("a", { className: "vyriy-pagination__page", href: getHref(item.page), children: item.page })) : (_jsx("button", { "aria-current": item.page === page ? 'page' : undefined, className: "vyriy-pagination__page", disabled: item.page === page, type: "button", children: item.page })) }, item.page));
                }) }), renderControl('Last', pages, page === pages)] }));
};
export const Catalog = (props) => {
    const { content, paginate } = props;
    return (_jsx(Layout, { footerText: "Copyright \u00A9 2026 Vyriy", name: "Vyriy", children: _jsxs("section", { className: "vyriy-catalog", children: [_jsx("div", { className: "vyriy-catalog__content", children: content }), _jsx(Pagination, { getHref: paginate.getHref, page: paginate.page, pages: paginate.pages })] }) }));
};
export const NotFoundPage = (props) => {
    const { homeHref = '/' } = props;
    return (_jsx(Page, { content: _jsxs(_Fragment, { children: [_jsx("h1", { children: "Page not found" }), _jsx("p", { children: "The page you are looking for does not exist. Return to the home page or use the navigation above." }), _jsx("p", { children: _jsx("a", { href: homeHref, children: "Return home" }) })] }) }));
};
export const SearchPage = (props) => {
    const { documentsUrl = '/search/documents.json', indexUrl = '/search/minisearch-index.json', miniSearchScriptUrl = '/assets/minisearch.js', } = props;
    return (_jsx(Page, { content: _jsxs("section", { className: "vyriy-search-page", children: [_jsx("h1", { children: "Search" }), _jsx("p", { children: "Search articles and examples by text query or tag." }), _jsx(SearchForm, { className: "vyriy-search-page__form", placeholder: "Search articles and examples" }), _jsx("div", { "data-documents-url": documentsUrl, "data-index-url": indexUrl, id: "search-root" }), _jsx("script", { src: miniSearchScriptUrl }), _jsx("script", { dangerouslySetInnerHTML: { __html: searchScript } })] }) }));
};
