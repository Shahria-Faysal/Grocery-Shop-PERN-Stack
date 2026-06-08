import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center mt-20 gap-4">
      <h1 className="text-3xl">Welcome to Grocery Shop</h1>

      <div className="flex gap-4">
        <Link href="/login" className="underline">
          Login
        </Link>
        <Link href="/register" className="underline">
          Register
        </Link>
      </div>
    </div>
  );
}