import Link from "next/link";
import { useRouter } from "next/router";
import { FaRegUser } from "react-icons/fa";
import { MdAutoGraph } from "react-icons/md";

export default function Navbar() {
  const router = useRouter();
  const isActive = (path) => router.pathname === path;

  return (
    <nav className="bg-black text-white h-18 flex justify-center items-center gap-x-25 shadow-t">
      <Link href="/" className={isActive("/") ? "text-purple-400" : "text-white"}>
        <FaRegUser className="w-7 h-7" />
      </Link>
      <Link
        href="/artists"
        className={isActive("/artists") ? "text-purple-400" : "text-white"}
      >
        <MdAutoGraph className="w-9 h-9" />
      </Link>
    </nav>
  );
}