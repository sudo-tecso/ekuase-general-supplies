import { Button } from "@/components/ui/Button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-8 p-12 bg-white rounded-2xl border shadow-xl">
        <div className="flex justify-center">
          <div className="p-4 bg-danger/10 rounded-full text-danger">
            <ShieldAlert className="w-16 h-16" />
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-heading font-black uppercase tracking-tighter">Access Denied</h1>
          <p className="text-secondary text-sm">
            You do not have permission to view this page. This area is restricted to specific user roles.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/">
            <Button className="w-full h-12 font-bold uppercase tracking-widest">Go Home</Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="w-full h-12 font-bold uppercase tracking-widest">Sign in with different account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
