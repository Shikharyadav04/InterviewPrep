"use client";
import React from "react";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { email } from "zod/v4-mini";
import { toast } from "sonner";
import FormField from "./FormField";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { SignIn, Signup } from "@/lib/action/auth.action";
// import { Link } from "lucide-react";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";
  let path = isSignIn ? "/sign-up" : "/sign-in";

  const router = useRouter();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const result = await Signup({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully .Please sign in ");
        router.push("/sign-in");
      } else {
        const { email, password } = values;

        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredentials.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in failed");
          return;
        }
        await SignIn({ email, idToken });

        toast.success("Successfully Signed In ");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error  ${error}`);
    }
  }
  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 items-center">
          <Image src="/logo.svg" width={24} height={24} alt="logo" />
          <h2 className="text-primary-100">Interview Prep</h2>
        </div>
        <h3>Clear Interviews by practicing with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your Email"
              type="email"
            />
            <FormField
              control={form.control}
              type="password"
              name="password"
              label="Password"
              placeholder="Your Password"
            />

            <Button type="submit" className="btn">
              {!isSignIn ? "Sign up" : "Sign in"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already"}
          <Link href={path} className="font-bold text-user-primary ml-1">
            {isSignIn ? "SignUp" : "SignIn"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
