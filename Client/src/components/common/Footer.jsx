import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full  py-20 px-10  flex flex-col md:flex-row justify-between items-center bg-surface-container-lowest border-t border-outline-variant">
      <div className="mb-lg md:mb-0">
        <span className="text-headline-md font-headline-md font-bold text-primary mb-2 block">NexusMarket</span>
        <p className="text-on-surface-variant text-body-md max-w-[330px]">
          Elevating the commerce experience through technical excellence and curated partnerships.
        </p>
      </div>
      <div className="flex flex-col items-center md:items-end gap-md">
        <div className="flex gap-5 mb-5 ">
          <Link className="text-on-surface-variant hover:text-secondary transition-colors text-label-md font-label-md" to="/buyer-protection">Buyer Protection</Link>
          <Link className="text-on-surface-variant hover:text-secondary transition-colors text-label-md font-label-md" to="/vendor-terms">Vendor Terms</Link>
          <Link className="text-on-surface-variant hover:text-secondary transition-colors text-label-md font-label-md" to="/privacy">Privacy Policy</Link>
          <Link className="text-on-surface-variant hover:text-secondary transition-colors text-label-md font-label-md" to="/docs">API Docs</Link>
        </div>
        <p className="text-on-surface-variant/60 text-body-md text-sm">© 2026 NexusMarket Infrastructure. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;