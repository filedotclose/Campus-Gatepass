import { getUserFromToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentView from "@/components/dashboard/StudentView";
import WardenView from "@/components/dashboard/WardenView";
import LibrarianView from "@/components/dashboard/LibrarianView";
import Navbar from "@/components/dashboard/Navbar";

export default async function Dashboard() {
  const user = await getUserFromToken();

  if (!user) {
    redirect("/login");
  }

  // user is now guaranteed to be IUser
  const currentUser = user;

  let roleView;

  switch (currentUser.role) {
    case "student":
      roleView = <StudentView user={currentUser} />;
      break;
    case "warden":
      roleView = <WardenView user={currentUser} />;
      break;
    case "librarian":
      roleView = <LibrarianView user={currentUser} />;
      break;
    default:
      roleView = <div>Invalid role</div>;
  }

  return <div>Dashboard Hub</div>;
}
