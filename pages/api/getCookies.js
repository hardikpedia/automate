import { getCookies } from "cookies-next";
import { decryptCookie } from "./cookieHandler"
export default async function handler(req, res) {
    // const { atlassianAccessToken1, atlassianAccessToken2, gitlabAccessToken } = getCookies({ req, res });
    const cookies=getCookies({req,res})
    // const decryptedAtlassianAccessToken = decryptCookie(atlassianAccessToken1)+decryptCookie(atlassianAccessToken2);
    // const decryptedGitlabAccessToken = decryptCookie(gitlabAccessToken);
    // res.status(200).json({ decryptedAtlassianAccessToken, decryptedGitlabAccessToken });
    res.status(200).json(cookies)
}