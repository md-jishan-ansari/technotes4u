import axios from 'axios';
import { Blog, Category } from '@/src/types/types';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const blogApi = {
  // Category APIs
  getAllCategories: () => axios.get(`${BASE_URL}/api/blog/getallcategories`),

  getSingleBlog: ({slug, blogId}: {slug?: string, blogId?: string}) => {
    const param = slug ? `slug=${slug}` : blogId ? `blogid=${blogId}` : '';

    return axios.get(`${BASE_URL}/api/blog/getblog?${param}`);
  },

  createCategory: (data: any) => axios.post(`${BASE_URL}/api/blog/createcategory`, data),

  editCategory: (blogId: string, data: any) => axios.post(`${BASE_URL}/api/blog/editcategory?blogid=${blogId}`, data),

  // Blog Content APIs
  getBlog: (blogId: string) => axios.get<{blog: Blog}>(`${BASE_URL}/api/blog/getblog?blogid=${blogId}`),

  saveToDraft: (blogId: string, content: string) => axios.post(`${BASE_URL}/api/blog/save-to-draft/?blogid=${blogId}`, {content}),

  publishDraft: (blogId: string, content: string) => axios.post(`${BASE_URL}/api/blog/publish-draft/?blogid=${blogId}`, {content}),

  unpublishBlog: (blogId: string, content: string) => axios.post(`${BASE_URL}/api/blog/unpublish-blog/?blogid=${blogId}`, {content}),

  // Image APIs
  uploadImage: (formData: FormData) => axios.post(`${BASE_URL}/api/blog/upload-image`, formData),

  deleteImage: (imageUrl: string) => axios.delete(`${BASE_URL}/api/blog/delete-image`, {
      data: { imageUrl }
  })
};