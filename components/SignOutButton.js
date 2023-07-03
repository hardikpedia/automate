import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Image from "next/image";

// SignOutButton component
function SignOutButton({ onClick }) {
  return (
    <div
      className="hover:bg-sprinklr-red py-2 px-4 rounded-full flex  ml-2 hover:cursor-pointer border-sprinklr-red border-2 items-center gap-1 transition-all duration-300"
      onClick={onClick}
    >
      {/* Render the ExitToAppIcon */}
      <ExitToAppIcon />
      <div>Sign Out</div>
    </div>
  );
}

export default SignOutButton;
