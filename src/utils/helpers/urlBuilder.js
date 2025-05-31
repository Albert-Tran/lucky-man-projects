/**
 * Xây dựng URL từ một template và các tham số.
 * Ví dụ: buildUrl('/users/:id/posts/:postId', { id: 1, postId: 10 }) => '/users/1/posts/10'
 * @param {string} urlTemplate - Chuỗi URL với các placeholders (ví dụ: '/groups/:id').
 * @param {Object} params - Đối tượng chứa các giá trị để thay thế placeholders.
 * @returns {string} URL đã hoàn chỉnh.
 */
export const buildUrl = (urlTemplate, params) => {
  let url = urlTemplate;
  for (const key in params) {
    if (Object.hasOwnProperty.call(params, key)) {
      url = url.replace(`:${key}`, params[key]);
    }
  }
  return url;
};