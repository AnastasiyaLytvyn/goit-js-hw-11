import axios from 'axios';
import Notiflix from 'notiflix';
import { fetchImg } from './fetch';
import SimpleLightbox from 'simplelightbox';
import simpleLightbox from 'simplelightbox';

let getEl = selector => document.querySelector(selector);
getEl('.search-form').addEventListener('submit', onSearch);
getEl('.load-more').addEventListener('click', onLoadMore);

let page = 1;
let query = '';

function onSearch(e) {
  e.preventDefault();
  const value = e.currentTarget.searchQuery.value;
  console.log(value);
  getEl('.gallery').innerHTML = '';
  fetchImg(value, page)
    .then(data => {
      page = 1;
      if (data.totalHits === 0) {
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        markupGallery(data.hits);
        simpleLightbox.refresh();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
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
  `<a class="photo-link" href = ${largeImageURL}>
    <div class="photo-card">
      <img src=${webformatURL} alt=${tags} loading="lazy"  />
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
    </div>
  </a>`;
}

function onLoadMore() {
  page += 1;
  fetchImg();
}
