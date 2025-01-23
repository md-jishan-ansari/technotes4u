"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useCallback, useEffect, useState } from "react"
import { useAppSelector } from "@/src/redux/hooks"
import { useRouter, useSearchParams } from "next/navigation"

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
import SelectInput from "@/src/components/inputs/SelectInput"
import Container from "@/src/components/Container"
import { blogApi } from "@/src/redux/actions/services/api"

const ICON_TYPES = ['url', 'image', ''] as const;

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  parent: z.string().optional(),
  predecessor: z.string().optional(),
  iconType: z.enum(ICON_TYPES).optional(),
  icon: z.string().optional(),
  darkIcon: z.string().optional()
})

type FormValues = z.infer<typeof FormSchema>;


const WriteBlog = () => {
  const { categorylist } = useAppSelector(state => state.blog);
  const [parentCategories, setParentCategories] = useState<Array<{ label: string, value: string }>>([]);
  const [predecessors, setPredecessors] = useState<Array<{ label: string, value: string }>>([]);

  const searchParams = useSearchParams()
  let [blogId, setblogId] = useState(searchParams.get('blogid'));
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
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
      const categories = categorylist
        .filter(category => category.id !== blogId)
        .map(category => ({
          label: category.name,
          value: category.id
        }));
      setParentCategories(categories);
    }
  }, [categorylist, blogId]);

  // Add this new useEffect to fetch and set data when blogId exists
  useEffect(() => {
    if (blogId && categorylist?.length > 0) {
      const currentCategory = categorylist.find(category => category.id === blogId);

      if (currentCategory) {
        form.setValue('name', currentCategory.name);
        form.setValue('parent', currentCategory.parentId || '');
      } else {
        setblogId(null);
      }
    }
  }, [searchParams, categorylist, form, blogId]);

  useEffect(() => {
    const parentValue = form.watch('parent');
    const filteredPredecessors = categorylist
      ?.filter(category => {
        if (category.id === blogId) return false;
        if (parentValue) {
          return category.id === parentValue || category.parentId === parentValue;
        }
        return !category.parentId;
      })
      .map(category => ({
        value: category.id,
        label: category.name
      }));

    setPredecessors(filteredPredecessors || []);
  }, [form.watch('parent'), categorylist, blogId]);

  useEffect(() => {
    const parentValue = form.getValues('parent');
    if (parentValue) {
      form.setValue('predecessor', '');
    }
  }, [form.watch('parent')]);

  const onSubmit = useCallback(async (data: FormValues) => {
    try {
      const res = blogId
        ? await blogApi.editCategory(blogId, data)
        : await blogApi.createCategory(data);

      form.reset();
      router.push(`/admin/write/blog?blogid=${res.data.blog.id}`);
    } catch (error) {
      console.error(error);
    }
  }, [blogId, form, router]);

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
              <p className="text-red-500 dark:text-red-900 lg:col-span-2 mt-3">
                If you don't want to change below field for this category than leave it empty
              </p>
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
