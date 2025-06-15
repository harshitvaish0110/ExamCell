import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-10 px-6 mt-12 rounded-t-[2.5rem] shadow-inner">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-primary">
            Quick Links
          </h3>
          <ul className="space-y-1 flex flex-col">
            <Link to="/dashboard" className="hover:underline cursor-pointer">
              Dashboard
            </Link>
            <Link to="/inputform" className="hover:underline cursor-pointer">
              Student Details
            </Link>
            <Link to="/logout" className="hover:underline cursor-pointer">
              Logout
            </Link>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-primary">Contact</h3>
          <ul className="space-y-1">
            <li>📧 exam@university.edu</li>
            <li>📱 (123) 456-7890</li>
            <li>📍 Main Campus</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-primary">Resources</h3>
          <ul className="space-y-1">
            <li className="hover:underline cursor-pointer">Help Center</li>
            <li className="hover:underline cursor-pointer">FAQs</li>
            <li className="hover:underline cursor-pointer">Support</li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-6 text-xs border-t pt-4">
        © {new Date().getFullYear()} Exam Cell. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
