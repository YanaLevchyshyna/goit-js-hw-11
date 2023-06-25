import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImg(searchTerm, currentPage) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: '37711184-b39a9acb33bf742f63bced6b4',
        q: searchTerm,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: currentPage,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Oops! Something went wrong!');
  }
}
