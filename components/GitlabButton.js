import GitlabIcon from "../public/gitlab.png";
import Image from "next/image";

// GitlabButton component
const GitlabButton = ({ text, onClick, isGitlabSignedIn }) => {
  return (
    <button
      className="flex  pr-3 rounded-full hover:bg-sprinklr-green enabled:hover:cursor-pointer disabled:bg-sprinklr-green disabled:cursor-not-allowed items-center border-sprinklr-green border-2 transition-all duration-300 "
      onClick={onClick}
      disabled={isGitlabSignedIn}
    >
      <div>
        {/* Render the GitlabIcon image */}
        <Image src={GitlabIcon} width={46} alt="gitlab-logo" />
      </div>
      <div>{text}</div>
    </button>
  );
};

export default GitlabButton;
