'use client';
import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { User } from '@/src/types/types';
import Button from '../Button';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
  } from "@/src/componentsSadcn/ui/form"
import { Input } from '@/src/componentsSadcn/ui/input';

const formSchema = z
    .object({
        name: z
            .string()
            .min(1, "Name is required"),
        email: z
            .string()
            .min(1, "Email is required")
            .email("Invalid email address"),
        password: z
            .string()
            .min(1, "Password is required")
            .min(8, "Passsword must be at least 8 characters"),
        confirmPassword: z
            .string()
            .min(1, "Confirm password is required")
            .min(8, "Passsword must be at least 8 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Password do not match',
    });

type FormData = z.infer<typeof formSchema>;

interface signUpFormProps {
    currentUser: User | null
}

const SignUpForm:React.FC<signUpFormProps> = ({currentUser}) => {
    const router = useRouter();

    useEffect(() => {
        if(currentUser) {
            router.push('/');
            router.refresh();
        }
    }, []);

    const form = useForm<FormData>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        resolver: zodResolver(formSchema)
    });

    // const get_random_value = () => {
    //     return Math.floor(Math.random()*100) + 1;
    // }

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const {name, email, password, confirmPassword} = data;

        signIn('credentials', {
            name,
            email,
            password,
            confirmPassword,
            action: "register",
            redirect: false
        }).then((callback) => {
            if(callback?.ok) {
                router.push('/');
                router.refresh();
            }
            if(callback?.error) {
                console.log(callback.error);
            }
        });
    }

    if(currentUser) {
        return <p className="text-center">
            Logged in. Redirection...
        </p>
    }

  return (
    <>
        <h3 className="text-slate-800 dark:text-white text-3xl text-center font-semibold mb-2">Sign Up</h3>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <p className="text-sm mb-[4px]">Name</p>
                            <FormControl>
                                <Input className="!mt-[2px]" placeholder="Enter your Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="mt-3">
                            <p className="text-sm mb-[4px]">Email</p>
                            <FormControl>
                                <Input className="!mt-[2px]" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="mt-3">
                            <p className="text-sm mb-[4px]">Password</p>
                            <FormControl>
                                <Input className="!mt-[2px]" type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem className="mt-3">
                            <p className="text-sm mb-[4px]">Confirm Password</p>
                            <FormControl>
                                <Input className="!mt-[2px]" type="password" placeholder="Enter your password again" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="mt-6">
                    {form.formState.errors.root && <p className='text-red-600'>{form.formState.errors.root.message}</p>}

                    <Button
                        variant="dark"
                        size="md"
                        rounded="rounded-lg"
                        isLoading={false}
                        fullWidth
                        type="submit"
                    >
                        {form.formState.isSubmitting ? "Submitting..." : "Sign Up" }
                    </Button>
                </div>
            </form>
        </Form>

        <div className="flex items-center gap-2 my-3 text-slate-600">
            <div className="w-full border-b-[1px] border-slate-400" />
            <span>Or</span>
            <div className="w-full border-b-[1px] border-slate-400" />
        </div>

        <Button
            variant="dark"
            size="md"
            rounded="rounded-lg"
            isLoading={false}
            fullWidth
            onClick={() => signIn('google')}
        >
            Sign Up with Google
        </Button>

        <p className='text-sm text-slate-700 dark:text-white mt-2'>If you already have an account, please <Link href="/sign-in" className="text-blue-700 font-medium" >Sign In</Link></p>
    </>
  )
}

export default SignUpForm
