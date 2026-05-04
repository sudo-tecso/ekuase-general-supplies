import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent z-10"></div>
        <img alt="Construction Site" className="absolute inset-0 w-full h-full object-cover" data-alt="Modern construction site with steel beams and concrete" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzmf_ahggo1QYwaizMaefJxzOutafcjannzqEnFMHMnYDRYb4tlTLNDv4B0-cq6EXT1rbq2oCmSXsW5Ok-E3S6BjAirCbQTgisjTqg2b-NUtaW1iPiqDORnr1kIwE0aTab45dk3A8dqo1uNdMateyT2uKjWIpQhxOaq9jNT1mOIVoa3rPVKwnwlPBvApJzgwiy1tZ6L6jjD_a4XijOurz3cPAYV6FayC0Rj3zFuadOitksprweRkZhLJ2mOqHavpucGoQ9L4jXjpSy"/>
        <div className="relative z-20 max-w-[1440px] mx-auto h-full flex flex-col justify-center px-4 md:px-20">
          <div className="max-w-2xl space-y-6">
            <span className="inline-block px-3 py-1 bg-primary text-background-dark text-xs font-black uppercase rounded tracking-widest">Enterprise Logistics</span>
            <h1 className="text-white text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter">
              The Backbone of <br/><span className="text-primary">Modern Industry.</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl font-medium max-w-lg">
              Industrial-grade materials with real-time warehouse-level logistics for construction professionals.
            </p>
            <div className="flex w-full max-w-xl group">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary">search</span>
                <input className="w-full h-16 pl-12 pr-4 bg-white border-none rounded-l-lg focus:ring-0 text-slate-900 placeholder:text-slate-400 text-base font-medium" placeholder="Search materials, SKUs, or warehouses..." type="text"/>
              </div>
              <button className="h-16 px-8 bg-primary text-background-dark font-black uppercase text-sm rounded-r-lg hover:brightness-110 transition-all">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 md:px-20 py-16 space-y-20">
        {/* Shop by Category */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tighter">Shop by Category</h2>
              <p className="text-slate-500 font-medium">Browse our full inventory of industrial supplies</p>
            </div>
            <Link href="#" className="text-primary font-bold flex items-center hover:underline">
              View All <span className="material-symbols-outlined ml-1">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Category Cards */}
            <div className="group cursor-pointer bg-white dark:bg-slate-900 p-8 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary transition-all shadow-sm hover:shadow-xl">
              <div className="size-14 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-primary group-hover:text-background-dark transition-colors mb-6">
                <span className="material-symbols-outlined text-3xl">grid_view</span>
              </div>
              <h3 className="text-xl font-bold mb-1">Tiles</h3>
              <p className="text-slate-500 text-sm">Ceramic & Porcelain</p>
            </div>
            <div className="group cursor-pointer bg-white dark:bg-slate-900 p-8 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary transition-all shadow-sm hover:shadow-xl">
              <div className="size-14 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-primary group-hover:text-background-dark transition-colors mb-6">
                <span className="material-symbols-outlined text-3xl">precision_manufacturing</span>
              </div>
              <h3 className="text-xl font-bold mb-1">Cement</h3>
              <p className="text-slate-500 text-sm">OPC & PPC 53 Grade</p>
            </div>
            <div className="group cursor-pointer bg-white dark:bg-slate-900 p-8 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary transition-all shadow-sm hover:shadow-xl">
              <div className="size-14 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-primary group-hover:text-background-dark transition-colors mb-6">
                <span className="material-symbols-outlined text-3xl">rebase_edit</span>
              </div>
              <h3 className="text-xl font-bold mb-1">Steel</h3>
              <p className="text-slate-500 text-sm">TMT Bars & Mesh</p>
            </div>
            <div className="group cursor-pointer bg-white dark:bg-slate-900 p-8 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary transition-all shadow-sm hover:shadow-xl">
              <div className="size-14 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-primary group-hover:text-background-dark transition-colors mb-6">
                <span className="material-symbols-outlined text-3xl">plumbing</span>
              </div>
              <h3 className="text-xl font-bold mb-1">Plumbing</h3>
              <p className="text-slate-500 text-sm">PVC & Industrial Fittings</p>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tighter">Featured Products</h2>
              <p className="text-slate-500 font-medium">Bestsellers and new arrivals for large scale projects</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Product Card 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden group">
              <div className="aspect-square relative overflow-hidden bg-slate-100">
                <img alt="Steel Rebar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="Close up of high quality steel rebar bundle" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzhASx-Y52B_xRafrJr7vN8G9mYINu5iqiS2GWlO_vWCUX5u2-3xlsZmba8dILWdEsqmFHamz77qECska4dB2o048LwVhtiovvtVL-VbhtFVYkG5ssmhrR-wfhb7VN_pUc6aPtQCr2iWj8_s1q2mUbsIp9TNFujdyYwbwnqQ-DXu2E6YizilDdbyB0KCD0HgoV_F1CqG5UBUieWWMRLqMhe31fsxT1ZKOTSo9Rm3-QwI3o6u3YqPkrdjph-eykK2aRKZ8-snVEOmxn"/>
                <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded uppercase">In Stock</div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg leading-tight">TMT Steel Bars (12mm)</h4>
                    <p className="text-slate-400 text-xs mt-1 uppercase">SKU: ST-12-FE500D</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-slate-100">$845.00</span>
                  <span className="text-slate-500 text-sm font-medium">/ton</span>
                </div>
                <button className="w-full py-3 bg-slate-900 dark:bg-primary text-white dark:text-background-dark font-bold text-sm rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                  Add to Cart
                </button>
              </div>
            </div>
            {/* Product Card 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden group">
              <div className="aspect-square relative overflow-hidden bg-slate-100">
                <img alt="Cement Bags" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="Stack of industrial cement bags on a pallet" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxZi8PkFNkp2TxbToZJK_fKmxzk5kejm7BaWkswSxXk72lBBR3Ks4abRxivim9vgOObTXrOPF6u7kUxje6aMcy8pzHYzXVmFv4jIal48-EZ9u1zzH0X6jt2LlaV6kpB1MzZ5DBjonSqtPsY00nKuDEnCTkYFp127FU6JN4d4CjuTxhpTk-GAewd8NJDrMLQmn4ODalPrujz9S2csHQxu5FlllQVVxhSti9E-oODvwg1cJDo-GnMKB2FeaVdU84b476JUUT3eWHFw_G"/>
                <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded uppercase">In Stock</div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg leading-tight">Portland Cement 53G</h4>
                    <p className="text-slate-400 text-xs mt-1 uppercase">SKU: CE-53-OPC</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-slate-100">$6.50</span>
                  <span className="text-slate-500 text-sm font-medium">/bag</span>
                </div>
                <button className="w-full py-3 bg-slate-900 dark:bg-primary text-white dark:text-background-dark font-bold text-sm rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                  Add to Cart
                </button>
              </div>
            </div>
            {/* Product Card 3 */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden group">
              <div className="aspect-square relative overflow-hidden bg-slate-100">
                <img alt="Ceramic Tiles" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="Polished grey ceramic floor tiles large format" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnraW_qqO-oqIjn13NhjdOkcEK_XspwlbRnbAhsQzw-fFngKokvQrMNFZzD2Z754dpWyrTjVtObb1sMRoFsC_2hIptBP_1HYeJ8WASZh9JqTJE6BVCiirOC0nXrySEoVjnWFPWDBEpD095Z5F5MIq_l-ntJfgRZjM6Y0pcr8By1tkaJLLzFrPhexaAKH0kCOZOAj7r7NGppZwHbC0vDLbwgHTzpYguX2NEiKVi0CZ5kM6rywuj6c0bVK0GT7Sez_DIitW5Moicnir2"/>
                <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded uppercase">In Stock</div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg leading-tight">Polished Vitrified Tile</h4>
                    <p className="text-slate-400 text-xs mt-1 uppercase">SKU: TL-600X1200</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-slate-100">$2.20</span>
                  <span className="text-slate-500 text-sm font-medium">/sq.ft</span>
                </div>
                <button className="w-full py-3 bg-slate-900 dark:bg-primary text-white dark:text-background-dark font-bold text-sm rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                  Add to Cart
                </button>
              </div>
            </div>
            {/* Product Card 4 */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden group">
              <div className="aspect-square relative overflow-hidden bg-slate-100">
                <img alt="PVC Pipes" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="Blue industrial PVC pipes for water distribution" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzLl8LkMapTS2GXAWWej9Ojpbh9BhEWMMW8s-kh9sr1TAFXeUjVFznVgs9xK-6Upz6mfvfM3S71tZXUHyTAsDzQyhWcbNH7Za7M5KRuVT2WbQ3u4qpaz3-mTC9UWnTPrICkZTsOpabg-elnfonLPG38Uh0X6qrAanqErBaSK6JEMGXA87LGYkz4eCe2zqQIiWjisLbJcwhaiORS1a0Ddm2NXoaiw3dvGNkvFDL2j0U3bOlfC_dWWnjDs4Uxz-GU3L-pnDuEc4fRJNG"/>
                <div className="absolute top-3 right-3 px-2 py-1 bg-primary text-background-dark text-[10px] font-bold rounded uppercase">Low Stock</div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg leading-tight">ASTM PVC Pressure Pipe</h4>
                    <p className="text-slate-400 text-xs mt-1 uppercase">SKU: PL-PVC-4IN</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-slate-100">$18.40</span>
                  <span className="text-slate-500 text-sm font-medium">/unit</span>
                </div>
                <button className="w-full py-3 bg-slate-900 dark:bg-primary text-white dark:text-background-dark font-bold text-sm rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Shop by Warehouse */}
        <section className="bg-slate-900 rounded-xl overflow-hidden flex flex-col lg:flex-row">
          <div className="p-12 lg:w-1/3 flex flex-col justify-center space-y-6">
            <span className="text-primary text-sm font-black uppercase tracking-widest">Regional Distribution</span>
            <h2 className="text-white text-4xl font-black tracking-tighter">Shop by Warehouse</h2>
            <p className="text-slate-400">Save on logistics by sourcing materials from our nearest distribution center to your job site.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-primary transition-colors cursor-pointer group">
                <div className="size-10 bg-primary/20 text-primary rounded flex items-center justify-center font-bold">W1</div>
                <div>
                  <h4 className="text-white font-bold">North Hub - Chicago</h4>
                  <p className="text-slate-500 text-sm">Capacity: 45,000 SQFT</p>
                </div>
                <span className="material-symbols-outlined text-slate-600 ml-auto group-hover:text-primary">location_on</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-primary transition-colors cursor-pointer group">
                <div className="size-10 bg-primary/20 text-primary rounded flex items-center justify-center font-bold">W2</div>
                <div>
                  <h4 className="text-white font-bold">Coastal - Houston</h4>
                  <p className="text-slate-500 text-sm">Capacity: 82,000 SQFT</p>
                </div>
                <span className="material-symbols-outlined text-slate-600 ml-auto group-hover:text-primary">location_on</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-primary transition-colors cursor-pointer group border-primary bg-primary/5">
                <div className="size-10 bg-primary text-background-dark rounded flex items-center justify-center font-bold">W3</div>
                <div>
                  <h4 className="text-white font-bold">Central - Denver</h4>
                  <p className="text-slate-500 text-sm">Capacity: 31,000 SQFT</p>
                </div>
                <span className="material-symbols-outlined text-primary ml-auto">location_on</span>
              </div>
            </div>
            <button className="flex items-center justify-center w-full py-4 text-white font-bold border-2 border-slate-700 hover:border-primary rounded-lg transition-all group">
              Explore Logistics Network
              <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
          <div className="lg:w-2/3 h-[500px] lg:h-auto bg-slate-800 relative">
            <img alt="Warehouse Location Map" className="w-full h-full object-cover grayscale opacity-50" data-alt="Stylized dark architectural site map with location pins" data-location="Denver, USA" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAL0-3NhLZRJJWmW26Y_jZ8R8VBspNtccdVXEeO1AFSsELzO8wIdOQ7vsO1a7evJ2ecIckComlSuPsSrfltaoKkmkV5XnZeeKqdi50JsRkSny_jX85L6JNM08dX9WoZ2uTScxZSYxtltjnB5_phC6HQgzuFMyc-J9GyYSaKdvBLzjuqokJLUHKjTfqhVDMTWB2rNFITgmqcbnMoT9oqrty4Zn8aZD3e13s_C7g65Cew__hHyo8AX-yIbRQ5FHjiDGuO4vj0-T0pI8HG"/>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent lg:hidden"></div>
            {/* Pulse Pins */}
            <div className="absolute top-[40%] left-[30%] group">
              <div className="size-4 bg-primary rounded-full animate-ping absolute inset-0"></div>
              <div className="size-4 bg-primary rounded-full relative shadow-lg shadow-primary/50"></div>
            </div>
            <div className="absolute top-[60%] left-[55%] group">
              <div className="size-4 bg-primary rounded-full animate-ping absolute inset-0"></div>
              <div className="size-4 bg-primary rounded-full relative shadow-lg shadow-primary/50"></div>
            </div>
            <div className="absolute top-[25%] left-[75%] group">
              <div className="size-4 bg-primary rounded-full animate-ping absolute inset-0"></div>
              <div className="size-4 bg-primary rounded-full relative shadow-lg shadow-primary/50"></div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
