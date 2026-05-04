import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-16 px-4 md:px-20">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-white rounded flex items-center justify-center overflow-hidden">
              <img alt="Ekuase General Supplies Logo" className="w-full h-full object-contain" src="/logo.png"/>
            </div>
            <h2 className="text-xl font-black tracking-tight uppercase">Ekuase General Supplies</h2>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">Leading provider of industrial-grade building materials for enterprise-level construction projects across North America.</p>
          <div className="flex gap-4">
            <div className="size-10 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center text-slate-500 hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">share</span>
            </div>
            <div className="size-10 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center text-slate-500 hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">mail</span>
            </div>
            <div className="size-10 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center text-slate-500 hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">rss_feed</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Materials</h4>
          <ul className="space-y-4 text-sm font-medium text-slate-500">
            <li><Link className="hover:text-primary" href="#">Steel & Rebar</Link></li>
            <li><Link className="hover:text-primary" href="#">Concrete & Cement</Link></li>
            <li><Link className="hover:text-primary" href="#">Piping & Plumbing</Link></li>
            <li><Link className="hover:text-primary" href="#">Flooring & Tiles</Link></li>
            <li><Link className="hover:text-primary" href="#">Electrical Systems</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Company</h4>
          <ul className="space-y-4 text-sm font-medium text-slate-500">
            <li><Link className="hover:text-primary" href="#">About Ekuase General Supplies</Link></li>
            <li><Link className="hover:text-primary" href="#">Warehouse Network</Link></li>
            <li><Link className="hover:text-primary" href="#">Logistics API</Link></li>
            <li><Link className="hover:text-primary" href="#">Enterprise Solutions</Link></li>
            <li><Link className="hover:text-primary" href="#">Careers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Support</h4>
          <ul className="space-y-4 text-sm font-medium text-slate-500">
            <li><Link className="hover:text-primary" href="#">Track Bulk Order</Link></li>
            <li><Link className="hover:text-primary" href="#">Shipping Policy</Link></li>
            <li><Link className="hover:text-primary" href="#">Warehouse Pickup</Link></li>
            <li><Link className="hover:text-primary" href="#">Contact Support</Link></li>
            <li><Link className="hover:text-primary" href="#">FAQ</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto mt-16 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-400">© 2024 Ekuase General Supplies Industrial Logistics Inc. All rights reserved.</p>
        <div className="flex gap-8 text-xs text-slate-400">
          <Link className="hover:text-primary" href="#">Privacy Policy</Link>
          <Link className="hover:text-primary" href="#">Terms of Service</Link>
          <Link className="hover:text-primary" href="#">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
};
