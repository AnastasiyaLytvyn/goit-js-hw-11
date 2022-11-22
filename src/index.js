import Notiflix from 'notiflix';
import { fetchImg } from './fetch';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './styles.css';

let getEl = selector => document.querySelector(selector);
getEl('.load-more').classList.add('is-hidden');
getEl('.search-form').addEventListener('submit', onSearch);
getEl('.load-more').addEventListener('click', onLoadMore);

let page = 1;
let query = '';
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function onSearch(e) {
  e.preventDefault();
  page = 1;

  const value = e.currentTarget.searchQuery.value;
  console.log(value);

  getEl('.gallery').innerHTML = '';

  if (!value) {
    getEl('.load-more').classList.add('is-hidden');
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }
  fetchImg(value, page)
    .then(data => {
      console.log(data.hits);
      if (!data.totalHits) {
        getEl('.load-more').classList.add('is-hidden');
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        getEl('.gallery').insertAdjacentHTML(
          'beforeend',
          makeGallery(data.hits)
        );
        getEl('.load-more').classList.remove('is-hidden');
        lightbox.refresh();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        query = value;
      }
      if(data.totalHits < 40){
        getEl('.load-more').classList.add('is-hidden')
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      getEl('.search-form').reset();
    });
}

function onLoadMore() {
  page += 1;
  fetchImg(query, page)
    .then(data => {
      getEl('.gallery').insertAdjacentHTML('beforeend', makeGallery(data.hits));
      console.log(data.hits);
      lightbox.refresh();

      const totalPage = Math.ceil(data.totalHits / data.hits.length);

      if (page >= totalPage) {
        getEl('.load-more').classList.add('is-hidden');
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }

    })
    .catch(error => console.log(error));
}

function makeGallery(hits) {
  return hits
    .map(
      ({
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <a href="${webformatURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`
    )
    .join('');
}
