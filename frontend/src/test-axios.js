import axios from 'axios';

axios.get('http://localhost:5000').then(response => {
  console.log('Backend response:', response.data);
}).catch(error => {
  console.error('Axios test failed:', error);
});