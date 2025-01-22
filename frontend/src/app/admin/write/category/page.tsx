"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/componentsSadcn/ui/form"

import { Input } from "@/src/componentsSadcn/ui/input"
import Button from "@/src/components/Button"
import Link from "next/link"
import { useEffect, useState } from "react"
import SelectInput from "@/src/components/inputs/SelectInput"
import { useSelector } from "react-redux"
import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import Container from "@/src/components/Container"

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  parent: z.string().optional(),
  predecessor: z.string().optional(),
  iconType: z.enum(['url', 'image', '']).optional(),
  icon: z.string().optional(),
  darkIcon: z.string().optional()
})



const WriteBlog = () => {
  const { categorylist } = useSelector((state: any) => state.blog);
  const [parentCategories, setParentCategories] = useState([]);
  const [predecessors, setPredecessors] = useState([]);
  const searchParams = useSearchParams()
  let [blogId, setblogId] = useState(searchParams.get('blogId'));

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      name: "",
      parent: "",
      predecessor: "",
      iconType: "",
      icon: "",
      darkIcon: ""
    }
  })

  useEffect(() => {
    if (categorylist?.length > 0) {
      const categories = [];
        for (let i = 0; i < categorylist.length; i++) {
          if(categorylist[i].id !== blogId) {
            categories.push({
                label: categorylist[i].name,
                value: categorylist[i].id
            });
          }
        }
        setParentCategories(categories);
    }
  }, [categorylist]);

  // Add this new useEffect to fetch and set data when blogId exists
  useEffect(() => {
    if (blogId && categorylist?.length > 0) {
      let currentCategory = categorylist.filter(category => category.id === blogId);
      console.log({currentCategory});
      if(currentCategory.length > 0) {
        form.setValue('name', currentCategory[0].name);
        form.setValue('parent', currentCategory[0].parentId);
      } else {
        setblogId(null);
      }
    }
  }, [searchParams, categorylist]);

  useEffect(() => {
    const parentValue = form.watch('parent');
    const filteredPredecessors = [];

    for (let i = 0; i < categorylist?.length; i++) {
        const category = categorylist[i];
        if (parentValue && category.id != blogId) {
            if (category.id === parentValue || category.parentId === parentValue) {
                filteredPredecessors.push({
                    value: category.id,
                    label: category.name
                });
            }
        } else if (!category.parentId && category.id != blogId) {
            filteredPredecessors.push({
                value: category.id,
                label: category.name
            });
        }
    }

    setPredecessors(filteredPredecessors);
  }, [form.watch('parent'), categorylist]);

  useEffect(() => {
    const parentValue = form.getValues('parent');
    if (parentValue) {
      form.setValue('predecessor', '');
    }
  }, [form.watch('parent')]);

  function onSubmit(data: z.infer<typeof FormSchema>) {

    let url = "";
    if (blogId) {
      url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/blog/editcategory?blogId=' + blogId;
    } else {
      url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/blog/createcategory';
    }

    axios({
      method: 'post',
      url: url,
      data
    }).then((res) => {
      console.log(res);

      form.reset();
      router.push("/admin/write/blog?blogId=" + res.data.blog.id);

    }).catch((error: any) => {
      console.log(error);
    });

  }

  return (
    <Container>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-12">
            <FormField
              control={form.control}
              name="name"
              disabled={!!blogId}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SelectInput
              form={form}
              name="parent"
              label="Parent blog"
              placeholder="Select a blog"
              description="Select parent blog"
              inputlists={parentCategories}
              defaultSet={!blogId}
            />

            {blogId && (
                <p className="text-red-500 dark:text-red-900 lg:col-span-2 mt-3">If you don't want to change below field for this category than leave it empty</p>
            )}

            <SelectInput
              form={form}
              name="predecessor"
              label="Predecessor"
              placeholder="Select a blog"
              description="Select predecessor blog"
              inputlists={predecessors}
            />

              <SelectInput
                form={form}
                name="iconType"
                label="Icon Type"
                placeholder="Select icon type"
                description="Choose between URL or Image upload"
                inputlists={[
                  { value: 'url', label: 'URL' },
                  { value: 'image', label: 'Image Upload' }
                ]}
                className="mb-4"
              />

                {form.watch('iconType') === 'url' && (
                  <div className="p-4 border rounded-md lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-12">
                    <FormField
                      control={form.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon URL</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter icon URL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="darkIcon"
                      render={({ field }) => (
                        <FormItem >
                          <FormLabel>Dark Icon URL</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter dark icon URL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {form.watch('iconType') === 'image' && (
                  <div className="p-4 border rounded-md lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-12">
                    <FormField
                      control={form.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon Image</FormLabel>
                          <FormControl>
                            <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files?.[0])} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="darkIcon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dark Icon Image</FormLabel>
                          <FormControl>
                            <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files?.[0])} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

          </div>
          <div className="mt-6 max-w-[300px] ml-auto">
            <Button type="submit" fullWidth variant="dark" >Next</Button>
          </div>
        </form>
      </Form>
    </Container>
  )
}

export default WriteBlog;
