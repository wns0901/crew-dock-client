import api from './baseApi';

export const login = (username, password) =>
  api.post('login', {username, password}, {headers: {"Content-Type": "application/x-www-form-urlencoded"}}); 

export const userInfo = () => api.get('user');

export const authInfo = () => api.get('auth');

export const register = (data) => api.post('user/register', data);

export const getStacks = () => api.get('stacks');

export const verifyNickname = (nickname) => api.get(`user/check/nickname?nickname=${nickname}`);

export const verifyUsername = (email) => api.get(`user/check/email?email=${email}`);

export const verifyEmailCode = (code, email) => api.get(`user/check/authNum?email=${email}&authNum=${code}`);