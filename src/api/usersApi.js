import axiosClient from './axiosClient'

const usersApi = {
  getAll: () => axiosClient.get('users/getallusers'),
}

export default usersApi