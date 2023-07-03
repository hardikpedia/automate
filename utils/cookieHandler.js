import { setCookie } from "cookies-next";

//Clearing cookies on logout
export const clearCookies = () => {
  const options = {
    maxAge: 0,
    path: "/",
  };
  setCookie("atlassianAccessToken1", null, options);
  setCookie("atlassianAccessToken2", null, options);
  setCookie("atlassianExpireTime", null, options);
  setCookie("atlassianRefreshToken1", null, options);
  setCookie("atlassianRefreshToken2", null, options);
  setCookie("gitlabAccessToken", null, options);
  setCookie("gitlabExpireTime", null, options);
  setCookie("gitlabRefreshToken", null, options);
  setCookie("cloudId", null, options);
};
