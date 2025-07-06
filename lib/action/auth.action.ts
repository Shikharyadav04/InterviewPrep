"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

export const Signup = async (params: SignUpParams) => {
  const { uid, name, email } = params;

  try {
    const existedUser = await db.collection("users").doc(uid).get();

    if (existedUser.exists) {
      return {
        success: false,
        message: "User already exists.Please sign in",
      };
    }

    const user = await db.collection("users").doc(uid).set({
      email,
      name,
    });

    return {
      success: true,
      messsage: "Your account is created .....please sign in",
    };
  } catch (error: any) {
    console.error("Error creating a user ", error);

    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email already exist",
      };
    }

    return {
      success: false,
      message: "Error in creating a user",
    };
  }
};

export const setSessionCookie = async (idToken: string) => {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: 60 * 60 * 24 * 7 * 1000,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export const SignIn = async (params: SignInParams) => {
  const { email, idToken } = params;

  try {
    const user = await auth.getUserByEmail(email);

    if (!user) {
      return {
        success: false,
        message: "User does not exist please sign up",
      };
    }

    await setSessionCookie(idToken);
  } catch (error) {
    console.log("error in signin ", error);
    return {
      success: false,
      message: "Error in sign in",
    };
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user;
};
