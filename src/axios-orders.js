import axios from 'axios';


const instance = axios.create({
  baseURL: 'https://react-my-burger-53b2b.firebaseio.com/'
});

export default instance;