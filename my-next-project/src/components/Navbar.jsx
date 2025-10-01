import Link from "next/link";
import { useRouter } from "next/router";
import { FaRegUser } from "react-icons/fa";
import { MdAutoGraph } from "react-icons/md";

export default function Navbar() {
  const router = useRouter();
  const isActive = (path) => router.pathname === path;

  return (
  <nav className="bg-transparent text-white p-4 flex justify-around items-center">
    <div className="flex space-x-6">
      <Link href="/" className={isActive("/") ? "p-2" : "p-2"}>
        <FaRegUser className="size-5" />
      </Link>
    </div>
    <div>
      <Link
        href="/artists"
        className={isActive("/artists") ? "p-2" : "p-2"}
      >
        <MdAutoGraph className="size-5" />
      </Link>
    </div>
  </nav>
);
}