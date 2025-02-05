import api from './baseApi';

export const login = (username, password) =>
  api.post('login', {username, password}, {headers: {"Content-Type": "application/x-www-form-urlencoded"}}); 

export const userInfo = () => api.get('user');

export const authInfo = () => api.get('auth');

export const join = (data) => api.post('user/join', data);