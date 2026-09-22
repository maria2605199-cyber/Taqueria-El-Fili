import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Protege todas las rutas del panel administrador. Cualquier visitante
// sin sesión que intente entrar a /dashboard es enviado a /login.
// Las rutas públicas del catálogo (/negocio/[slug]) nunca pasan por aquí.
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
