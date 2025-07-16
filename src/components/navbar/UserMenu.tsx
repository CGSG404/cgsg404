"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const UserMenu = () => {
  const [showProfile, setShowProfile] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.removeItem("sb-access-token");
      localStorage.removeItem("sb-refresh-token");
      toast.success("Signed out successfully");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error signing out"
      );
    }
  };

  if (!user)
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push("/signin")}
        className="border-casino-border-subtle hover:bg-casino-dark text-white hidden md:inline-flex"
      >
        <User className="w-4 h-4 mr-2" /> Sign&nbsp;In
      </Button>
    );

  return (
    <div className="relative hidden md:flex items-center space-x-3">
      <button
        onClick={() => setShowProfile(!showProfile)}
        className="flex items-center gap-2"
      >
        <Button variant="ghost" size="icon">
          {user?.user_metadata?.avatar_url ? (
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.user_metadata.avatar_url}
                alt={user.email || "User"}
              />
              <AvatarFallback>
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User className="h-5 w-5" />
          )}
        </Button>
      </button>

      {showProfile && (
        <div className="absolute right-0 top-12 z-50 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
