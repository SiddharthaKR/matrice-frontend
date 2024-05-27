import axiosClient from './axiosClient'

const boardApi = {
  create: () => axiosClient.post('boards'),
  getAll: () => axiosClient.get('boards'),
  getAllMembers: (id) => axiosClient.get(`boards/${id}/members`),
  updatePositoin: (params) => axiosClient.put('boards', params),
  getOne: (id) => axiosClient.get(`boards/${id}`),
  delete: (id) => axiosClient.delete(`boards/${id}`),
  update: (id, params) => axiosClient.put(`boards/${id}`, params),
  addMember: (id,params) => axiosClient.post(`boards/${id}/member`,params),
  getFavourites: () => axiosClient.get('boards/favourites'),
  updateFavouritePosition: (params) => axiosClient.put('boards/favourites', params)
}

export default boardApi