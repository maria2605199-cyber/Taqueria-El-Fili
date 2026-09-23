import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      businessId: string;
      businessSlug: string;
      businessName: string;
      role: string;
      plan: string;
    } & DefaultSession["user"];
  }

  interface User {
    businessId: string;
    businessSlug: string;
    businessName: string;
    role: string;
    plan: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    businessId: string;
    businessSlug: string;
    businessName: string;
    role: string;
    plan: string;
  }
}
