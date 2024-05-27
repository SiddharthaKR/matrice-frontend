import axiosClient from './axiosClient'

const taskApi = {
  create: (boardId, params) => axiosClient.post(`boards/${boardId}/tasks`, params),
  updatePosition: (boardId, params) => axiosClient.put(
    `boards/${boardId}/tasks/update-position`,
    params
  ),
  assign: (boardId, taskId, params) => axiosClient.post(`boards/${boardId}/tasks/${taskId}/assign`,params),
  delete: (boardId, taskId) => axiosClient.delete(`boards/${boardId}/tasks/${taskId}`),
  update: (boardId, taskId, params) => axiosClient.put(
    `boards/${boardId}/tasks/${taskId}`,
    params
  )
}

export default taskApi