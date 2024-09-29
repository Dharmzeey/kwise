import { LOGIN } from "@/utils/urls/authUrls";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(LOGIN, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });

        const user = await res.json();

        if (res.ok && user) {
          return user; 
        } else {
          return null; 
        }
      },
    }),
  ],
  pages: {
    signIn: "../../login", 
  },
  callbacks: {
    async jwt({ token, user }) {
      return {...token, ...user}
      // if (user) {
      //   token.accessToken = user.access_token; // Store access token
      // }
      // return token;
    },
    async session({ session, token, user }) {
      session.user = token as any
      return session
      // session.access_token = token.accessToken; // Include access token in session
      // return session;
    },
  },
});

// import { LOGIN, SIGNUP } from "@/utils/urls/authUrls";

// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { signIn } from "next-auth/react";

// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         const response = await fetch(LOGIN, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: credentials?.email,
//             password: credentials?.password,
//           }),
//         });

//         const data = await response.json();
//         const user = data.data;
//         if (response.ok && data.access_token) {
//           return user;
//         }
//         // If authentication fails, return null
//         return null;
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       return { ...token, ...user };
//       //   if (user) {
//       //     token.accessToken = user.access_token;
//       //     token.refreshToken = user.refreshToken; // optional
//       //   }
//       //   return token;
//     },
//     async session({ session, token, user }) {
//       session.user = token as any;
//       return session;
//     },
//   },
//   pages: {
//     signIn: '../../login'
//   }
// //   session: {
// //     strategy: "jwt",
// //   },
// //   secret: process.env.NEXTAUTH_SECRET,
// });
