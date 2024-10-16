"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Header: React.FC = () => {
  // const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  // const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-8 w-8 text-black" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="text-[#560bad]">
                Hello, {user?.displayName || "User"}
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 space-y-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-black hover:bg-[#560bad] hover:text-white"
                onClick={toggleMenu}
              >
                <Book className="mr-2 h-4 w-4" />
                My Questions
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-black hover:bg-[#560bad] hover:text-white"
                onClick={toggleMenu}
              >
                <Heart className="mr-2 h-4 w-4" />
                My Votes
              </Button>
            </nav>
            <div className="absolute bottom-4 left-4">
              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet> */}
        <h1 className="text-3xl font-black bg-gradient-to-r from-[#560bad] to-[#3a0ca3] text-transparent bg-clip-text">
          QRious
        </h1>
        <Button
          className="bg-transparent text-red-500 hover:bg-gray-600 hover:text-white"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
