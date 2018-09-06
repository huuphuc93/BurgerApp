import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-my-bugger-ba690.firebaseio.com/'
});

export default instance;
