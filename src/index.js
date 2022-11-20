import axios from 'axios';
import Notiflix from 'notiflix';
import { fetchImg } from './fetch';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let getEl = selector => document.querySelector(selector);
getEl('.search-form').addEventListener('submit', onSearch);
getEl('.load-more').addEventListener('click', onLoadMore);

let page = 1;
let query = '';
const lightbox = new SimpleLightbox('.gallery a');

function onSearch(e) {
  e.preventDefault();
  page = 1;
  const value = e.currentTarget.searchQuery.value;
  console.log(value);

  getEl('.gallery').innerHTML = '';

  if (value === '') {
    getEl('.load-more').classList.add('is-hidden');
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }
  fetchImg(value, page)
    .then(data => {
      if (data.data.hits.length === 0) {
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        markupGallery(data.data.hits);
        lightbox.refresh();
        Notiflix.Notify.success(`Hooray! We found ${data.data.totalHits} images.`);
        query = value;
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      getEl('.search-form').reset();
    });
}

function markupGallery(hits) {
  getEl('.gallery').insertAdjacentHTML('beforeend', makeGallery(hits));
}


function makeGallery() {
  `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
</div>`;
}

function onLoadMore() {
  page += 1;
  fetchImg();
}
