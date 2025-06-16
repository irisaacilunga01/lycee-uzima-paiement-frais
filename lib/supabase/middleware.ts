// import { createServerClient } from "@supabase/ssr";
// import { NextResponse, type NextRequest } from "next/server";
// import { hasEnvVars } from "../utils";

// export async function updateSession(request: NextRequest) {
//   let supabaseResponse = NextResponse.next({
//     request,
//   });

//   // If the env vars are not set, skip middleware check. You can remove this once you setup the project.
//   if (!hasEnvVars) {
//     return supabaseResponse;
//   }

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll();
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value }) =>
//             request.cookies.set(name, value)
//           );
//           supabaseResponse = NextResponse.next({
//             request,
//           });
//           cookiesToSet.forEach(({ name, value, options }) =>
//             supabaseResponse.cookies.set(name, value, options)
//           );
//         },
//       },
//     }
//   );

//   // Do not run code between createServerClient and
//   // supabase.auth.getUser(). A simple mistake could make it very hard to debug
//   // issues with users being randomly logged out.

//   // IMPORTANT: DO NOT REMOVE auth.getUser()

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (
//     request.nextUrl.pathname !== "/" &&
//     !user &&
//     !request.nextUrl.pathname.startsWith("/login") &&
//     !request.nextUrl.pathname.startsWith("/auth")
//   ) {
//     // no user, potentially respond by redirecting the user to the login page
//     const url = request.nextUrl.clone();
//     url.pathname = "/auth/login";
//     return NextResponse.redirect(url);
//   }

//   // IMPORTANT: You *must* return the supabaseResponse object as it is.
//   // If you're creating a new response object with NextResponse.next() make sure to:
//   // 1. Pass the request in it, like so:
//   //    const myNewResponse = NextResponse.next({ request })
//   // 2. Copy over the cookies, like so:
//   //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
//   // 3. Change the myNewResponse object to fit your needs, but avoid changing
//   //    the cookies!
//   // 4. Finally:
//   //    return myNewResponse
//   // If this is not done, you may be causing the browser and server to go out
//   // of sync and terminate the user's session prematurely!

//   return supabaseResponse;
// }
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- LOGIQUE DE REDIRECTION ---
  // Si l'utilisateur est connecté, vérifie son rôle et le redirige.
  if (user) {
    const userRole = user.user_metadata.role;

    // Redirige depuis la page d'accueil pour éviter les boucles
    if (request.nextUrl.pathname === "/") {
      if (userRole === "parent") {
        // Si le rôle est 'parent', redirige vers /parents
        return NextResponse.redirect(new URL("/parents", request.url));
      } else {
        // Sinon, redirige vers /dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  // Redirige les utilisateurs non authentifiés vers la page de connexion
  if (
    request.nextUrl.pathname !== "/" &&
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
