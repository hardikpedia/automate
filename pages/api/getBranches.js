import axios from "axios";
import { decryptCookie } from "./cookieHandler";
import { getCookies, hasCookie } from "cookies-next";
import refreshTokens from "./refreshTokens";

require("dotenv").config();
const GITLAB_API_URL = process.env.GITLAB_API_URL;

const getBranches = async (projectId, gitlabAccessToken) => {
  const perPage = 100;
  let page = 1;
  let branches = [];
  while (true) {
    const url = `${GITLAB_API_URL}/projects/${projectId}/repository/branches?per_page=${perPage}&page=${page}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${gitlabAccessToken} `,
    };

    const response = await axios.get(url, { headers });
    page++;
    if (response.data.length === 0) {
      break;
    }
    branches = branches.concat(response.data);
  }
  return branches.map((branch) => {
    return {
      "label": branch.name,
      "value": branch.name,
    };
  });
};

export default async (req, res) => {
  if (
    hasCookie("atlassianAccessToken1", { req, res }) &&
    hasCookie("atlassianAccessToken2", { req, res }) &&
    hasCookie("gitlabAccessToken", { req, res })
  ) {
    await refreshTokens(req, res);
    const { gitlabAccessToken } = getCookies({ req, res });
    const decryptedGitlabAccessToken = decryptCookie(gitlabAccessToken);
    const branches = await getBranches(
      req.body.project_id,
      decryptedGitlabAccessToken
    );
    console.log("---------------------------------");
    res.status(200).json({ branches });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
