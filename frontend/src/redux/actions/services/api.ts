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

  editCategory: (slug: string, data: any) => axios.post(`${BASE_URL}/api/blog/editcategory?slug=${slug}`, data),

  // Blog Content APIs
  saveToDraft: (slug: string, content: string) => axios.post(`${BASE_URL}/api/blog/save-to-draft/?slug=${slug}`, {content}),

  publishDraft: (slug: string, content: string) => axios.post(`${BASE_URL}/api/blog/publish-draft/?slug=${slug}`, {content}),

  unpublishBlog: (slug: string, content: string) => axios.post(`${BASE_URL}/api/blog/unpublish-blog/?slug=${slug}`, {content}),

  // Image APIs
  uploadImage: (formData: FormData) => axios.post(`${BASE_URL}/api/blog/upload-image`, formData),

  deleteImage: (imageUrl: string) => axios.delete(`${BASE_URL}/api/blog/delete-image`, {
      data: { imageUrl }
  })
};