// Import dependencies
import axios from "axios";
import { getCookies, setCookie } from "cookies-next";
import { encryptCookie, decryptCookie } from "./cookieHandler";
require("dotenv").config();

// Function to refresh access tokens
const refreshTokens = async (req, res) => {
  // Get the cookies containing refresh tokens and expiration times
  const {
    atlassianRefreshToken1,
    atlassianRefreshToken2,
    gitlabRefreshToken,
    atlassianExpireTime,
    gitlabExpireTime,
  } = getCookies({ req, res });

  // Refresh Atlassian access token if it has expired or is about to expire
  if (
    atlassianRefreshToken1 &&
    atlassianRefreshToken2 &&
    atlassianExpireTime < Math.floor(Date.now() / 1000) + 60
  ) {
    // Decrypt the Atlassian refresh token
    const decryptedAtlassianRefreshToken =
      decryptCookie(atlassianRefreshToken1) +
      decryptCookie(atlassianRefreshToken2);

    // Construct the URL and parameters for token refresh request
    const url = `https://auth.atlassian.com/oauth/token`;
    const params = {
      grant_type: "refresh_token",
      client_id: process.env.ATLASSIAN_CLIENT_ID,
      client_secret: process.env.ATLASSIAN_CLIENT_SECRET,
      refresh_token: decryptedAtlassianRefreshToken,
    };

    // Send a POST request to refresh the token
    const response = await axios.post(url, params, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Extract the response data
    const data = await response.data;

    if (data) {
      const options = {
        req,
        res,
        maxAge: data.expires_in,
        path: "/",
      };

      // Split the access token into two parts
      const token = data.access_token;
      const atlassianAccessToken1 = token.substring(0, token.length / 2);
      const atlassianAccessToken2 = token.substring(
        token.length / 2,
        token.length
      );

      // Split the refresh token into two parts
      const atlassianRefreshToken1 = data.refresh_token.substring(
        0,
        data.refresh_token.length / 2
      );
      const atlassianRefreshToken2 = data.refresh_token.substring(
        data.refresh_token.length / 2,
        data.refresh_token.length
      );

      // Set the updated access tokens and expiration time as cookies
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
      setCookie(
        "atlassianExpireTime",
        data.expires_in + Math.floor(Date.now() / 1000),
        options
      );
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

      console.log("Refreshed Atlassian token");
    }
  }

  // Refresh GitLab access token if it has expired or is about to expire
  if (
    gitlabRefreshToken &&
    gitlabExpireTime < Math.floor(Date.now() / 1000) + 60
  ) {
    // Decrypt the GitLab refresh token
    const decryptedGitlabRefreshToken = decryptCookie(gitlabRefreshToken);

    // Construct the URL and parameters for token refresh request
    const url = `https://gitlab.com/oauth/token`;
    const params = {
      grant_type: "refresh_token",
      client_id: process.env.GITLAB_CLIENT_ID,
      client_secret: process.env.GITLAB_CLIENT_SECRET,
      refresh_token: decryptedGitlabRefreshToken,
    };

    // Send a POST request to refresh the token
    const response = await axios.post(url, params, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Extract the response data
    const data = await response.data;
    console.log(data);

    if (data) {
      const options = {
        req,
        res,
        maxAge: data.expires_in,
        path: "/",
      };

      // Set the updated access token, expiration time, and refresh token as cookies
      setCookie("gitlabAccessToken", encryptCookie(data.access_token), options);
      setCookie(
        "gitlabExpireTime",
        data.expires_in + Math.floor(Date.now() / 1000),
        options
      );
      setCookie(
        "gitlabRefreshToken",
        encryptCookie(data.refresh_token),
        options
      );

      console.log("Refreshed GitLab token");
    }
  }
};

// Export the refreshTokens function
export default refreshTokens;
