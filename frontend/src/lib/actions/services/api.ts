import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const getAuthToken = async () => {
  const response = await fetch('/api/get-authtoken');
  const data = await response.json();
  return data.authtoken?.value;
};

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL
});

// Add request interceptor
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const blogApi = {
  // Category APIs
  getAllCategories: () => axiosInstance.get(`/api/blog/getallcategories`),

  getSingleBlog: ({ slug, blogId }: { slug?: string, blogId?: string }) => {
    const param = slug ? `slug=${slug}` : blogId ? `blogid=${blogId}` : '';

    return axiosInstance.get(`/api/blog/getblog?${param}`);
  },

  createCategory: (data: any) => axiosInstance.post(`/api/blog/createcategory`, data),

  editCategory: (slug: string, data: any) => axiosInstance.post(`/api/blog/editcategory?slug=${slug}`, data),

  // Blog Content APIs
  publishDraft: (slug: string) => axiosInstance.patch(`/api/blog/publish-draft/?slug=${slug}`, {}),

  updateBlog: (slug: string, blogContext: any) => axiosInstance.patch(`/api/blog/updateBlog/?slug=${slug}`, { blogContext }),

  // Image APIs
  uploadImage: (formData: FormData) => axiosInstance.post(`/api/blog/upload-image`, formData),

  deleteImage: (imageUrl: string) => axiosInstance.delete(`/api/blog/delete-image`, {
    data: { imageUrl }
  }),



  // Comment APIs
  addComment: (commentContext: any) => axiosInstance.post(`/api/comment/add-comment`, commentContext),

  editComment: (commentId: string, commentContext: any) => axiosInstance.patch(`/api/comment/edit-comment?commentid=${commentId}`, commentContext),

  deleteComment: (commentId: string) => axiosInstance.delete(`/api/comment/delete-comment?commentid=${commentId}`),

  getReplies: (commentId: any, start: number, limit: number) =>
    axiosInstance.get(`/api/comment/get-replies?commentid=${commentId}&start=${start}&limit=${limit}`),

  getComments: (blogId: string, start: number, limit: number) =>
    axiosInstance.get(`/api/comment/get-comments?blogid=${blogId}&start=${start}&limit=${limit}`),
};
