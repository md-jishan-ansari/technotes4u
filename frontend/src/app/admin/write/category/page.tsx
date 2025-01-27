"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useCallback, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks"
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
import { toast } from "react-toastify"
import { fetchCategories } from "@/src/redux/slices/blogSlice"

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
    const dispatch = useAppDispatch();

  const searchParams = useSearchParams()
  const [slug, setSlug] = useState(searchParams.get('slug'));
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
    setSlug(searchParams.get('slug'));
    form.reset({
      name: "",
      parent: "",
      predecessor: "",
      iconType: "",
      icon: "",
      darkIcon: ""
    });
  }, [searchParams])


  useEffect(() => {
    if (categorylist?.length > 0) {
      const categories = categorylist
        .filter(category => category.slug !== slug)
        .map(category => ({
          label: category.name,
          value: category.id
        }));
      setParentCategories(categories);
    }
  }, [categorylist, slug]);

  // Add this new useEffect to fetch and set data when blogId exists
  useEffect(() => {
    if (slug && categorylist?.length > 0) {
      const currentCategory = categorylist.find(category => category.slug === slug);

      if (currentCategory) {
        form.setValue('name', currentCategory.name);
        form.setValue('parent', currentCategory.parentId || '');
      } else {
        setSlug(null);
      }
    } else {
      form.setValue('name', '');
    }

  }, [searchParams, categorylist, form, slug]);

  useEffect(() => {
    const parentValue = form.watch('parent');
    const filteredPredecessors = categorylist
      ?.filter(category => {
        if (category.slug === slug) return false;
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
  }, [form.watch('parent'), categorylist, slug]);

  useEffect(() => {
    const parentValue = form.getValues('parent');
    if (parentValue) {
      form.setValue('predecessor', '');
    }
  }, [form.watch('parent'), slug]);

  const handleSubmit = useCallback(async (data: FormValues, shouldNavigate: boolean = false) => {
    try {
      const res = slug
        ? await blogApi.editCategory(slug, data)
        : await blogApi.createCategory(data);

      toast.success("Category saved successfully");

      dispatch(fetchCategories());
      if (shouldNavigate) {
        form.reset();
        router.push(`/admin/write/blog?slug=${res.data.blog.slug}`);
      }
    } catch (error) {
      console.error(error);
    }
  }, [slug, form, router]);


  return (
    <Container>
      <Form {...form}>
        <form >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-12">
            <FormField
              control={form.control}
              name="name"
              disabled={!!slug}
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
              defaultSet={!slug}
            />

            {slug && (
              <p className="text-red-500 dark:text-red-900 lg:col-span-2 mt-3">
                If you don&apos;t want to change below field for this category than leave it empty
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
          {slug ? (
            <div className="flex gap-3 mt-6 max-w-[500px] ml-auto">
              <Button
                type="button"
                fullWidth
                variant="dark"
                onClick={form.handleSubmit((data) => handleSubmit(data, false))}
              >
                Save
              </Button>
              <Button
                type="button"
                fullWidth
                variant="dark"
                onClick={form.handleSubmit((data) => handleSubmit(data, true))}
              >
                Save & Next
              </Button>
            </div>
          ) : (
            <div className="mt-6 max-w-[300px] ml-auto">
              <Button
                type="button"
                fullWidth
                variant="dark"
                onClick={form.handleSubmit((data) => handleSubmit(data, true))}
              >
                Next
              </Button>
            </div>
          )}
        </form>
      </Form>
    </Container>
  )
}

export default WriteBlog;


