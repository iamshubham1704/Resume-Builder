// middleware.js
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/resumebuilder/:path*", "/dashboard/:path*"]
};