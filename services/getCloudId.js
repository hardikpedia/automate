import axios from "axios";
import { hasCookie, setCookie, getCookies } from "cookies-next";
import { encryptCookie, decryptCookie } from "@/pages/api/cookieHandler";

// Function to retrieve the Cloud ID
export const getCloudId = async (decryptedAtlassianAccessToken, req, res) => {
  // Check if the Cloud ID cookie already exists
  if (hasCookie("cloudId", { req, res })) {
    // If it exists, retrieve and decrypt the Cloud ID cookie value
    const { cloudId } = getCookies({ req, res });
    return decryptCookie(cloudId);
  }

  // If the Cloud ID cookie doesn't exist, make an API call to fetch it
  const apiUrl = "https://api.atlassian.com/oauth/token/accessible-resources";
  try {
    // Send a GET request to the API endpoint with the access token
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${decryptedAtlassianAccessToken}`,
        Accept: "application/json",
      },
    });

    // Extract the response data
    const responseData = await response.data;

    // Set the Cloud ID as a cookie
    setCookie("cloudId", encryptCookie(responseData[0].id), {
      req,
      res,
      path: "/",
    });

    console.log("Cloud ID cookie set");

    // Return the retrieved Cloud ID
    return responseData[0].id;
  } catch (error) {
    console.error("API Error:", error.message);
  }
};
