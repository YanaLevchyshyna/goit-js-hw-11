const refs = {
  gallery: document.querySelector('.gallery'),
};

export function renderGallery(hits) {
  return hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href="${largeImageURL}" class="lightbox"> <div class="photo-card">
 <div class="lightbox-cover-wrap"> <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div></div>
  </div>
  </a>`;
      }
    )
    .join('');
  // refs.gallery.insertAdjacentHTML('beforeend', markup);
}
