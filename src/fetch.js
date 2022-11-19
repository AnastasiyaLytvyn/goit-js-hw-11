import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31365887-26ab2d64c6ea6999261bbdea7'

export async function fetchImg(r, page) {
  const apiData = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${r}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  )
  return apiData;
}