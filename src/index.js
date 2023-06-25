import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImg } from './fetch_img';
import { renderGallery } from './render_img';
fetchImg();

let currentPage;

let searchTerm = '';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  searchBtn: document.querySelector('.searh-btn'),
  loaderBtn: document.querySelector('.load-more'),
};

let galleryLightbox = new SimpleLightbox('.gallery a', {
  captions: false,
});

refs.searchForm.addEventListener('submit', onSubmit);
refs.loaderBtn.addEventListener('click', loadMoreImages);

function onSubmit(e) {
  e.preventDefault();
  currentPage = 1;
  searchTerm = e.target.searchQuery.value.trim();

  if (!searchTerm) {
    clearSearch();
    return Notify.failure(`Enter a search query, please.`);
  }
  fetchImg(searchTerm, currentPage).then(data => {
    if (!data.data.hits.length) {
      clearSearch();
      return Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    }
    Notify.success(`Hooray! We found ${data.data.totalHits} images.`);
    refs.gallery.innerHTML = renderGallery(data.data.hits);
    galleryLightbox.refresh();
    if (currentPage > data.data.totalHits / 40) {
      refs.gallery.insertAdjacentHTML(
        'beforeend',
        `<p class='result-text'>We're sorry, but you've reached the end of search results.</p>`
      );
    } else {
      refs.loaderBtn.style.display = 'block';
    }
  });
}

function loadMoreImages() {
  currentPage += 1;
  fetchImg(searchTerm, currentPage).then(data => {
    refs.gallery.insertAdjacentHTML('beforeend', renderGallery(data.data.hits));
    galleryLightbox.refresh();

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    if (currentPage > data.data.totalHits / 40) {
      refs.loaderBtnstyle.display = 'none';
      refs.gallery.insertAdjacentHTML(
        'beforeend',
        `<p class='result-text'>We're sorry, but you've reached the end of search results.</p>`
      );
    }
  });
}

function clearSearch() {
  refs.searchForm.reset();
  refs.gallery.innerHTML = '';
  refs.loaderBtn.style.display = 'none';
}
