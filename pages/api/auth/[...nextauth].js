import NextAuth, { NextAuthOptions } from "next-auth";
import AtlassianProvider from "next-auth/providers/atlassian";
import GitlabProvider from "next-auth/providers/gitlab";
import { getCookie, getCookies, setCookie } from "cookies-next";
import { encryptCookie } from "../cookieHandler";
require("dotenv").config();
import {  setDoc,doc } from 'firebase/firestore';
import {db} from '../../../firebaseConfig'
// Define the configuration options for NextAuth
const nextAuthOptions = (req, res) => {
  
  return {
    
    secret: process.env.NEXTAUTH_SECRET, // Secret used to encrypt session cookies
    providers: [
      AtlassianProvider({
        clientId: process.env.ATLASSIAN_CLIENT_ID, // Client ID for Atlassian integration
        clientSecret: process.env.ATLASSIAN_CLIENT_SECRET, // Client secret for Atlassian integration
        authorization: {
          params: {
            scope:
              "write:jira-work read:jira-work read:jira-user offline_access read:me", // Scopes required for accessing Jira API
          },
        },
      }),
      GitlabProvider({
        clientId: process.env.GITLAB_CLIENT_ID, // Client ID for Gitlab integration
        clientSecret: process.env.GITLAB_CLIENT_SECRET, // Client secret for Gitlab integration
        authorization: {
          params: {
            scope: "api ", // Scope required for accessing Gitlab API
          },
        },
      }),
    ],
    session: {
      jwt: false, // Disable JWT session tokens
    },
    callbacks: {
      // Callback function to handle token generation and cookie setting
      async jwt({ token, account, user }) {
       

        if (account?.provider === "atlassian") {
          const docRef = doc(db, "auth", user.email );
          const data = {
            atlassianAccessToken: account.access_token,
            atlassianRefreshToken: account.refresh_token,
            atlassianExpiresAt: account.expires_at,
          };
          await setDoc(docRef, data,{merge:true})
        
          // If the account is from Atlassian provider
          const options = {
            req,
            res,
            maxAge: account.expires_at - Math.floor(Date.now() / 1000), // Set cookie expiry based on token expiry
            path: "/", // Set the cookie path
          };
          try {
            // Split the access token and refresh token into two parts
            const atlassianAccessToken1 = account.access_token.substring(
              0,
              account.access_token.length / 2
            );
            const atlassianAccessToken2 = account.access_token.substring(
              account.access_token.length / 2,
              account.access_token.length
            );

            // Split the refresh token into two parts
            const atlassianRefreshToken1 = account.refresh_token.substring(
              0,
              account.refresh_token.length / 2
            );
            const atlassianRefreshToken2 = account.refresh_token.substring(
              account.refresh_token.length / 2,
              account.refresh_token.length
            );

            // Set the cookies with the token parts
            setCookie(
              "atlassianAccessToken1",
              encryptCookie(atlassianAccessToken1),
              options
            );
            setCookie(
              "atlassianAccessToken2",
              encryptCookie(atlassianAccessToken2),
              options
            );
            setCookie("atlassianExpireTime", account.expires_at, options);
            setCookie(
              "atlassianRefreshToken1",
              encryptCookie(atlassianRefreshToken1),
              options
            );
            setCookie(
              "atlassianRefreshToken2",
              encryptCookie(atlassianRefreshToken2),
              options
            );
          } catch (err) {
            console.log(err);
          }
        }
        if (account?.provider === "gitlab") {
          // If the account is from Gitlab provider
          const docRef = doc(db, "auth", user.email );
          const data = {
            gitlabAccessToken : account.access_token,
            gitlabRefreshToken: account.refresh_token,
            gitlabExpiresAt: account.expires_at,
          };
          await setDoc(docRef, data,{merge:true})
          const options = {
            req,
            res,
            maxAge: account.expires_at - Math.floor(Date.now() / 1000), // Set cookie expiry based on token expiry
            path: "/", // Set the cookie path
          };
          try {
            // Set the cookies with the access token, refresh token, and expiry time
            setCookie(
              "gitlabAccessToken",
              encryptCookie(account.access_token),
              options
            );
            setCookie("gitlabExpireTime", account.expires_at, options);
            setCookie(
              "gitlabRefreshToken",
              encryptCookie(account.refresh_token),
              options
            );
          } catch (err) {
            console.log(err);
          }
        }

        return token;
      },
    },
  };
};

// Export the default function that handles NextAuth authentication
export default (req, res) => {
  // Pass the request, response, and configuration options to NextAuth
  return NextAuth(req, res, nextAuthOptions(req, res));
};
