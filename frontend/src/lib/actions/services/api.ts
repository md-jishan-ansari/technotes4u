import axios from 'axios';
import { cookies } from 'next/headers';

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

  getReplies: (commentId: any, start: number) => axiosInstance.get(`/api/comment/get-replies?commentid=${commentId}&start=${start}`),

  getComments: (blogId: string, start: number) => axiosInstance.get(`/api/comment/get-comments?blogid=${blogId}&start=${start}`),
};
// export const blogApi = {
//   // Category APIs
//   getAllCategories: () => axios.get(`${BASE_URL}/api/blog/getallcategories`),

//   getSingleBlog: ({slug, blogId}: {slug?: string, blogId?: string}) => {
//     const param = slug ? `slug=${slug}` : blogId ? `blogid=${blogId}` : '';

//     return axios.get(`${BASE_URL}/api/blog/getblog?${param}`);
//   },

//   createCategory: (data: any) => axios.post(`${BASE_URL}/api/blog/createcategory`, data),

//   editCategory: (slug: string, data: any) => axios.post(`${BASE_URL}/api/blog/editcategory?slug=${slug}`, data),

//   // Blog Content APIs
//   publishDraft: (slug: string) => axios.patch(`${BASE_URL}/api/blog/publish-draft/?slug=${slug}`, {}),

//   updateBlog: (slug: string, blogContext: any) => axios.patch(`${BASE_URL}/api/blog/updateBlog/?slug=${slug}`, {blogContext}),

//   // Image APIs
//   uploadImage: (formData: FormData) => axios.post(`${BASE_URL}/api/blog/upload-image`, formData),

//   deleteImage: (imageUrl: string) => axios.delete(`${BASE_URL}/api/blog/delete-image`, {
//       data: { imageUrl }
//   }),



//   // Comment APIs
//   addComment: (commentContext: any) => axios.post(`${BASE_URL}/api/comment/add-comment`, commentContext),
// };