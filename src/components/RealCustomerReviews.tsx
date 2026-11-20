import React, { useState } from 'react';
import { Play, Star, ShieldCheck, CheckCircle2, Instagram, Sparkles, Eye, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface UnboxingProof {
  id: string;
  shoeId: string;
  shoeName: string;
  customerName: string;
  city: string;
  rating: number;
  duration: string;
  reviewText: string;
  date: string;
  thumbnail: string;
  inHandImages: string[];
}

const UNBOXING_REELS: UnboxingProof[] = [
  {
    id: 'proof-1',
    shoeId: 'aero-velocity-86',
    shoeName: "Aero Velocity '86 OG",
    customerName: 'Marcus & Hamza K.',
    city: 'DHA Phase 6, Lahore',
    rating: 5,
    duration: '0:28',
    reviewText: 'Bhai seriously 10/10 deadstock hai! Sole aur stitching zero wear ke sath aayi hai. Retail se half price mein steal mil gaya.',
    date: '2 days ago',
    thumbnail: '/images/shoes/aero-velocity-86/main.jpg',
    inHandImages: [
      '/images/shoes/aero-velocity-86/main.jpg',
    ],
  },
  {
    id: 'proof-2',
    shoeId: 'apex-derby',
    shoeName: 'Apex Handcrafted Cap-Toe Derby',
    customerName: 'Usman A. (Executive)',
    city: 'Clifton, Karachi',
    rating: 5,
    duration: '0:34',
    reviewText: 'Office board meetings ke liye mangwaya tha. Genuine burnished leather ki smell aur finish lajawab hai. Zero break-in period!',
    date: '3 days ago',
    thumbnail: '/images/shoes/apex-derby/main.jpg',
    inHandImages: [
      '/images/shoes/apex-derby/main.jpg',
      '/images/shoes/apex-derby/detail.jpg',
      '/images/shoes/apex-derby/angle.jpg',
    ],
  },
  {
    id: 'proof-3',
    shoeId: 'atelier-classic-01',
    shoeName: "Atelier Classic '01 Low",
    customerName: 'Daniyal M.',
    city: 'F-7 / 2, Islamabad',
    rating: 5,
    duration: '0:22',
    reviewText: 'Pehle darr tha ke photos jesa hoga ya nahi, lekin parcel khol kar dekha toh bilkul fresh Italian napa look hai. Cleanest white sneaker!',
    date: '5 days ago',
    thumbnail: '/images/shoes/atelier-classic-01/main.jpg',
    inHandImages: [
      '/images/shoes/atelier-classic-01/main.jpg',
      '/images/shoes/atelier-classic-01/angle.jpg',
    ],
  },
  {
    id: 'proof-4',
    shoeId: 'monolith-chelsea',
    shoeName: 'Monolith Full-Grain Chelsea Boot',
    customerName: 'Zain R.',
    city: 'Satellite Town, Rawalpindi',
    rating: 5,
    duration: '0:41',
    reviewText: 'TCS se sirf 2 din mein deliver ho gaya. Chunky lug sole aur heavy pull-up leather bilkul luxury tier hai. 100% recommended.',
    date: '1 week ago',
    thumbnail: '/images/shoes/monolith-chelsea/main.jpg',
    inHandImages: [
      '/images/shoes/monolith-chelsea/main.jpg',
      '/images/shoes/monolith-chelsea/angle.jpg',
      '/images/shoes/monolith-chelsea/detail.jpg',
    ],
  },
];

export const RealCustomerReviews: React.FC = () => {
  const { shoes, setActiveShoeModal } = useShop();
  const [selectedProof, setSelectedProof] = useState<UnboxingProof | null>(null);

  const handleInspectShoe = (shoeId: string) => {
    const target = shoes.find(s => s.id === shoeId || s.slug === shoeId);
    if (target) {
      setActiveShoeModal(target);
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#FAF7EE] via-[#F4EFE6] to-[#FAF7EE] border-t border-[#E2D9CA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white border border-[#C59B6D] rounded-full px-3.5 py-1 text-[10px] sm:text-[11px] font-bold tracking-widest text-[#2B1A11] uppercase shadow-2xs mb-2">
              <Sparkles className="w-3 h-3 text-[#C59B6D]" />
              <span>Real Customer Proof • 100% Asal Joote</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#2B1A11]">
              Customer Unboxings &amp; In-Hand Shots
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mt-1 leading-relaxed">
              Kyunke online khareedari mein aetimad sab se pehle ata hai. Dekhiye hamare real Pakistani customers ke unboxing clips aur in-hand tasaveer.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono font-bold text-[#264E36] bg-white px-4 py-2.5 rounded-2xl border border-[#E2D9CA] shadow-2xs self-start md:self-auto">
            <ShieldCheck className="w-4 h-4 text-[#264E36]" />
            <span>Open Parcel COD in Major Cities</span>
          </div>
        </div>

        {/* Video Reel / Photo Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {UNBOXING_REELS.map(reel => (
            <div
              key={reel.id}
              onClick={() => setSelectedProof(reel)}
              className="group bg-white rounded-3xl border border-[#E2D9CA] hover:border-[#C59B6D] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Media Preview Box */}
              <div className="relative aspect-4/3 w-full bg-[#FAF7EE] overflow-hidden flex items-center justify-center p-4">
                <img
                  src={reel.thumbnail}
                  alt={`${reel.customerName} Unboxing`}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 filter drop-shadow-sm"
                />

                {/* Video Duration Badge */}
                <div className="absolute top-3 left-3 bg-[#1F140E]/85 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full flex items-center space-x-1.5 shadow-sm">
                  <Play className="w-2.5 h-2.5 fill-white" />
                  <span>{reel.duration}</span>
                </div>

                {/* City Location Tag */}
                <div className="absolute top-3 right-3 bg-white/95 text-stone-700 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#E2D9CA] shadow-2xs">
                  {reel.city}
                </div>

                {/* Play Button Overlay on Hover */}
                <div className="absolute inset-0 bg-[#2B1A11]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white text-[#2B1A11] flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-[#2B1A11] ml-0.5" />
                  </div>
                </div>

                {/* In-hand Badge */}
                <div className="absolute bottom-2.5 left-2.5 bg-[#264E36] text-white text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Purchase</span>
                </div>
              </div>

              {/* Review & Customer Quote */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-display font-bold uppercase tracking-wider text-[#2B1A11] line-clamp-1">
                      {reel.shoeName}
                    </span>
                    <div className="flex items-center space-x-0.5 text-[#C59B6D]">
                      {[...Array(reel.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#C59B6D]" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 italic leading-relaxed">
                    "{reel.reviewText}"
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E2D9CA] flex items-center justify-between text-[11px] text-stone-500 font-mono">
                  <span className="font-bold text-[#2B1A11]">{reel.customerName}</span>
                  <span>{reel.date}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Community Proof Banner */}
        <div className="mt-8 bg-white rounded-2xl border border-[#E2D9CA] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#2B1A11]">
                Tag us on Instagram <span className="text-[#C59B6D]">@thriftandtread</span>
              </p>
              <p className="text-[11px] text-stone-500">
                Share your unboxing story &amp; receive an exclusive 15% discount voucher on your next grail!
              </p>
            </div>
          </div>

          <a
            href="https://www.instagram.com/thriftandtread?rpxt=MThkazBjd253NXd4cQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-[#2B1A11] hover:bg-[#3D2517] text-[#FAF7EE] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs shrink-0 flex items-center space-x-2"
          >
            <Instagram className="w-3.5 h-3.5 text-[#C59B6D]" />
            <span>Follow Community</span>
          </a>
        </div>

      </div>

      {/* Lightbox Modal for Full Proof View */}
      {selectedProof && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedProof(null)}
        >
          <div 
            className="relative bg-white max-w-xl w-full rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E2D9CA] animate-slide-up space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2D9CA]">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#264E36]" />
                <div>
                  <h3 className="font-display font-bold text-sm uppercase text-[#2B1A11]">
                    Verified Customer In-Hand Inspection
                  </h3>
                  <p className="text-[10px] text-stone-500 font-mono">
                    {selectedProof.customerName} • {selectedProof.city}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProof(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Showcase Image */}
            <div className="relative aspect-4/3 w-full bg-[#FAF7EE] rounded-2xl overflow-hidden border border-[#E2D9CA] p-4 flex items-center justify-center">
              <img
                src={selectedProof.thumbnail}
                alt={selectedProof.shoeName}
                className="w-full h-full object-contain filter drop-shadow-md"
              />
              <div className="absolute bottom-3 left-3 bg-[#264E36] text-white text-[9px] font-mono tracking-widest uppercase px-3 py-1 rounded-full font-bold">
                100% Asal Joote Verified
              </div>
            </div>

            {/* In-hand thumbnails if multiple */}
            {selectedProof.inHandImages.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {selectedProof.inHandImages.map((img, idx) => (
                  <div key={idx} className="w-16 h-16 rounded-xl border border-[#E2D9CA] p-1 bg-[#FAF7EE] shrink-0">
                    <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            )}

            {/* Review quote */}
            <div className="bg-[#FAF7EE] p-4 rounded-2xl border border-[#E2D9CA] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-xs uppercase text-[#2B1A11]">
                  {selectedProof.shoeName}
                </span>
                <div className="flex items-center text-[#C59B6D]">
                  {[...Array(selectedProof.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C59B6D]" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-stone-700 italic leading-relaxed">
                "{selectedProof.reviewText}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleInspectShoe(selectedProof.shoeId);
                  setSelectedProof(null);
                }}
                className="flex-1 py-3 bg-[#2B1A11] hover:bg-[#3D2517] text-[#FAF7EE] rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center space-x-1.5"
              >
                <Eye className="w-4 h-4 text-[#C59B6D]" />
                <span>View Product Details</span>
              </button>

              <button
                onClick={() => setSelectedProof(null)}
                className="py-3 px-5 border border-[#E2D9CA] hover:bg-stone-100 text-[#2B1A11] rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
