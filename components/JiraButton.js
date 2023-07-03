import Jira from "../public/Jira.png";
import Image from "next/image";

// JiraButton component
const JiraButton = ({ text, onClick, isJiraSignedIn }) => {
  return (
    <button
      className="flex  px-3 ml-2 hover:bg-sprinklr-green enabled:hover:cursor-pointer disabled:bg-sprinklr-green disabled:cursor-not-allowed items-center  rounded-full border-sprinklr-green border-2 gap-1 transition-all duration-300"
      onClick={onClick}
      disabled={isJiraSignedIn}
    >
      <div>
        {/* Render the Jira image */}
        <Image src={Jira} width={29} alt="jira-logo" />
      </div>
      <div>{text}</div>
    </button>
  );
};

export default JiraButton;
