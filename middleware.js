// middleware.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; 


export function middleware(req) {
    const cookieStore = cookies(); // Get the cookie store from the request
    const userData = cookieStore.get('myCookie'); // Get the 'myCookie' cookie

    console.log(">>>>>>>>>>>.", userData);

  if (!userData) {
    const url = req.nextUrl.clone();
    url.pathname = 'admin/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
    matcher: [
      '/admin/company-settings/:path*', 
      '/admin/user-management/:path*'
    ], 
  };