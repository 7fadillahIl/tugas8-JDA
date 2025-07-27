// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // redirect kalau belum login
  },
});

export const config = {
  matcher: ["/dashboard/:path*"], // semua halaman di /dashboard butuh login
};
