import React from "react";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const isAdmin = false;
  const user = false; // Replace with actual authentication logic
  return (
    <div>
      <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-b-slate-700">
        <div className="container mx-auto px-4 py-3 ">
          <div className="flex flex-wrap justify-between items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-slate-300 hover:text-slate-200 transition-colors duration-300"
            >
              The Transformed Me Academy
            </Link>
            <nav className="flex flex-wrap items-center gap-4 ">
              <Link
                to={"/"}
                className="text-slate-300 hover:text-slate-200 transition-colors duration-300"
              >
                Home
              </Link>
              {user && (
                <Link
                  to={"/cart"}
                  className="relative  text-slate-300 hover:text-slate-200 transition-colors duration-300"
                >
                  <ShoppingCart className="w-6 h-6 text-slate-300 hover:text-slate-200 transition-colors duration-300" />
                  <span className="hidden sm:inline">Cart</span>
                  <span className="absolute -top-2 -left-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </Link>
              )}
              {isAdmin && (
                <Link className="text-slate-300 hover:text-slate-200 transition-colors duration-300">
                  <Lock className="w-6 h-6 text-slate-300 hover:text-slate-200 transition-colors duration-300" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}
              {user ? (
                <button className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-300 flex items-center gap-2 ease-in-out">
                  <LogOut size={18} />
                  <span className="hidden sm:inline ml-2">Logout</span>
                </button>
              ) : (
                <>
                  <Link
                    to={"/signup"}
                    className="bg-slate-600 text-white py-2 px-4 rounded hover:bg-slate-500 transition-colors duration-300 flex items-center gap-2 ease-in-out"
                  >
                    <UserPlus className="mr-2" size={18} />
                    Sign Up
                  </Link>
                  <Link
                    to={"/login"}
                    className="bg-slate-600 text-white py-2 px-4 rounded hover:bg-slate-500 transition-colors duration-300 flex items-center gap-2 ease-in-out"
                  >
                    <LogIn className="mr-2" size={18} />
                    Login
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
