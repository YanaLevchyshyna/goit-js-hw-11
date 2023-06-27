import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImg } from './fetch_img';
import { renderGallery } from './render_img';

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
  searchTerm = e.currentTarget.searchQuery.value.trim();

  if (!searchTerm) {
    clearSearch();
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  fetchImg(searchTerm, currentPage).then(data => {
    if (!data.data.hits.length) {
      clearSearch();
      Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
      return;
    }
    Notify.success(`Hooray! We found ${data.data.totalHits} images.`);
    refs.gallery.innerHTML = renderGallery(data.data.hits);

    galleryLightbox.refresh();

    if (data.data.totalHits <= currentPage * 40) {
      refs.loaderBtn.style.display = 'none';
      Notify.info("We're sorry, but you've reached the end of search results");
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

    if (data.data.totalHits <= currentPage * 40) {
      refs.loaderBtn.style.display = 'none';
      Notify.info("We're sorry, but you've reached the end of search results");
    }
  });
}

function clearSearch() {
  refs.searchForm.reset();
  refs.gallery.innerHTML = '';
  refs.loaderBtn.style.display = 'none';
}
