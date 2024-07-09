// middleware.js
import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';

export function middleware(request) {
  const { cookies } = request;
  const myCookie = cookies.get('myCookie');
  const { pathname } = request.nextUrl;

  console.log(">>>>>",pathname)

  // Exclude login and unauthorized routes from protection
  const unprotectedRoutes = [
    '/admin/login',
    '/login',
    '/unauthorized',
    '/vendor/login/access',
    '/vendor/login/password-confimation' // Added this route to unprotectedRoutes
  ];

  if (unprotectedRoutes.includes(pathname)) {
    console.log(">>>>>+++++++++++++")
    return NextResponse.next();
  } else if (myCookie) {
    try {
      let cookieValue;
      if (typeof myCookie === 'string') {
        cookieValue = JSON.parse(decodeURIComponent(myCookie));
      } else {
        cookieValue = myCookie;
      }

      if (typeof cookieValue === 'string') {
        cookieValue = JSON.parse(cookieValue);
      }
      const decodedCookie = decodeURIComponent(myCookie.value);
      console.log("Decoded Cookie (Value):", decodedCookie);

      cookieValue = JSON.parse(decodedCookie);
      console.log("Parsed Cookie Value:", cookieValue);

      const { token, role, companyType } = cookieValue;
      console.log("Token:", token, "Role:", role, "Company Type:", companyType);


      // Define role-based protected routes
      const adminRoutes = ['/admin', '/admin/*'];
      const vendorRoutes = ['/vendor', '/vendor/*'];

      const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
      const isVendorRoute = vendorRoutes.some(route => pathname.startsWith(route));

      // Check if the route is an admin route
      if (isAdminRoute) {
        // Only Super Admins can access admin routes
        if (role !== 'Super Admin') {
          return NextResponse.redirect(new URL('/admin/login', request.url));
        }
      }

      // Check if the route is a vendor route
      if (isVendorRoute) {
        // Only users with role 'Admin' and company type 'vendor' can access vendor routes
        if (role !== 'Admin' || companyType !== 'vendor') {
          return NextResponse.redirect(new URL('/vendor/login/access', request.url));
        }
      }

    } catch (error) {
      console.error('Error decoding or parsing cookie:', error);
      // Redirect to admin login page in case of an error
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  } else {
    // Redirect to appropriate login page if no cookie is found
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    } else if (pathname.startsWith('/vendor')) {
      return NextResponse.redirect(new URL('/vendor/login/access', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Allow the request to proceed if the cookie is present and valid
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*' ,'/vendor/:path*'],
};
