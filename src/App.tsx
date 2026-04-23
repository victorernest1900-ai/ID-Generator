import React, { useState, useCallback, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Download, Printer, User, Binary, School, BookOpen, MapPin, RefreshCw, CheckCircle, FileImage, FileText, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

// --- Types ---

interface UserData {
  name: string;
  gender: string;
  matNo: string;
  dept: string;
  faculty: string;
  validTill: string;
  passport: string | null;
  signature: string | null;
  logo: string | null;
  qrContent: string;
}

const INITIAL_DATA: UserData = {
  name: "EMMANUEL ERNEST",
  gender: "MALE",
  matNo: "NMU/2018/1234",
  dept: "MARINE ENGINEERING",
  faculty: "ENGINEERING",
  validTill: "2024",
  passport: null,
  signature: null,
  logo: null,
  qrContent: "NMU/2018/1234",
};

// --- Components ---

const IDCard = ({ data }: { data: UserData }) => {
  return (
    <div 
      id="printable-id-card"
      className="relative w-[340px] h-[540px] bg-white shadow-2xl overflow-hidden font-sans border border-gray-400 select-none"
      style={{ 
        aspectRatio: '340/540',
        color: '#000000'
      }}
    >
      {/* Header - Navy Purple Block with V-shape bottom */}
      <div 
        className="bg-[#1e1464] pt-5 pb-6 px-4 text-center relative"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)' }}
      >
        <h1 className="text-white font-black text-xl leading-none uppercase tracking-tighter m-0" style={{ fontSize: '20px' }}>
          NIGERIA MARITIME UNIVERSITY
        </h1>
        <h2 className="text-white font-black leading-none uppercase m-0 mt-1" style={{ fontSize: '18.5px' }}>
          OKERENKOKO, DELTA STATE
        </h2>
      </div>

      {/* Logo Wrapper */}
      <div className="flex justify-center -mt-3 mb-0.5 relative z-10">
        <div className="w-[90px] h-[70px] flex items-center justify-center">
           {data.logo ? (
             <img src={data.logo} alt="NMU Logo" className="w-full h-full object-contain" />
           ) : (
             /* Recreating the NMU Crest visually with CSS/Icons as fallback */
             <div className="relative w-16 h-16 border-[1px] border-[#1e1464] bg-white rounded-sm flex flex-col items-center justify-center p-1 shadow-sm opacity-50">
                <div className="text-[5px] font-bold text-[#1e1464] uppercase">Nigeria Maritime</div>
                <div className="text-[5px] font-bold text-[#1e1464] uppercase">University</div>
                <div className="w-8 h-8 rounded-full bg-blue-50 my-1 border-[1px] border-[#1e1464]/20 flex items-center justify-center">
                  <School className="text-[#1e1464] w-5 h-5" />
                </div>
                <div className="bg-[#1e1464] w-full h-[2px] mt-1"></div>
                <div className="text-[4px] font-black text-[#1e1464] mt-1">HONOUR OF EXCELLENCE</div>
             </div>
           )}
        </div>
      </div>

      {/* Passport Area - Exact placement */}
      <div className="flex justify-center mt-1 relative">
        <div className="w-[190px] h-[190px] bg-[#1e1464] border-[1px] border-black flex items-center justify-center">
          {data.passport ? (
             <img 
               src={data.passport} 
               alt="Passport" 
               className="w-full h-full object-cover"
               referrerPolicy="no-referrer"
             />
          ) : (
             <span className="text-white/50 text-sm font-bold uppercase">Passport</span>
          )}
        </div>

        {/* Valid Till - Placed to the right of passport, vertical along edge */}
        <div className="absolute right-[-50px] top-1/2 -translate-y-1/2 rotate-[90deg] flex items-center gap-2 z-20 w-[200px] justify-center">
          <span className="text-[18px] font-black text-[#1e1464] tracking-widest uppercase whitespace-nowrap">VALID TILL</span>
          <span className="text-[18px] font-black text-[#1e1464] leading-none whitespace-nowrap">{data.validTill || ''}</span>
        </div>
      </div>

      {/* Main Info Body */}
      <div className="mt-0.5 pl-3 pr-5 relative h-[180px]">
          {/* Exact Watermark "NMU" */}
          <div 
            className="absolute top-[42%] left-[48%] -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 rotate-[-25deg]"
          >
            <span 
              className="font-black text-[#0a1d6e] opacity-[0.46]" 
              style={{ fontSize: '119px', letterSpacing: '-5px', filter: 'blur(0.5px)' }}
            >
              NMU
            </span>
          </div>

          {/* Fields - Exact Labels and Layout */}
          <div className="flex flex-col gap-[1.8px] relative z-10">
            <div className="flex items-start">
              <span className="w-[80px] font-black text-[15px] text-black shrink-0 tracking-tight">NAME:</span>
              <span className="text-[15px] font-black text-black uppercase break-words pr-2 tracking-tight">{data.name || ''}</span>
            </div>
            <div className="flex items-start">
              <span className="w-[80px] font-black text-[15px] text-black shrink-0 tracking-tight">GENDER:</span>
              <span className="text-[15px] font-black text-black uppercase tracking-tight">{data.gender || ''}</span>
            </div>
            <div className="flex items-start">
              <span className="w-[80px] font-black text-[15px] text-black shrink-0 tracking-tight">MAT NO:</span>
              <span className="text-[15px] font-black text-black uppercase tracking-tight">{data.matNo || ''}</span>
            </div>
            <div className="flex items-start">
              <span className="w-[80px] font-black text-[15px] text-black shrink-0 tracking-tight">DEPT:</span>
              <span className="text-[15px] font-black text-black uppercase leading-[1.2] tracking-tight">{data.dept || ''}</span>
            </div>
            <div className="flex items-start">
              <span className="w-[80px] font-black text-[15px] text-black shrink-0 tracking-tight">FACULTY:</span>
              <span className="text-[15px] font-black text-black uppercase leading-[1.2] tracking-tight">{data.faculty || ''}</span>
            </div>
          </div>
      </div>

      {/* Bottom Area: QR and Footer */}
      <div className="absolute bottom-0 left-0 w-full">
        {/* QR Code Container - Exact as template */}
        <div className="absolute bottom-10 right-2 z-20 w-[107px] h-[107px] flex items-center justify-center">
           {data.qrContent ? (
              <QRCodeSVG 
                value={data.qrContent}
                size={107}
                level="M"
              />
           ) : (
              <div className="w-[107px] h-[107px] flex items-center justify-center text-[10px] font-bold text-center">QR code</div>
           )}
        </div>

        {/* Signature Area */}
        <div className="absolute bottom-[35px] left-[50%] -translate-x-1/2 w-[330px] h-[43px] flex items-center justify-center p-1 z-30">
          {data.signature && (
            <img 
              src={data.signature} 
              alt="Signature" 
              className="max-w-full max-h-full object-contain filter contrast-125 saturate-0 mix-blend-multiply" 
            />
          )}
        </div>

        {/* Footer - Purple Block with CADET */}
        <div className="bg-[#1e1464] flex items-center justify-center" style={{ height: '40px', borderRadius: '20px 20px 0 0' }}>
          <span className="text-white font-black uppercase text-[26px] tracking-[8px]" style={{ fontFamily: 'system-ui, sans-serif' }}>
            CADET
          </span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [data, setData] = useState<UserData>(INITIAL_DATA);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const passportInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'passport' | 'logo' | 'signature') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportPng = async () => {
    const element = document.getElementById('printable-id-card');
    if (!element) return;
    
    try {
      const dataUrl = await toPng(element, { 
        quality: 1.0, 
        pixelRatio: 4,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `${data.name.replace(/\s+/g, '_')}_ID_Card.png`;
      link.href = dataUrl;
      link.click();
      setShowExportOptions(false);
      handleComplete();
    } catch (err) {
      console.error('PNG Export failed', err);
    }
  };

  const handleExportJpeg = async () => {
    const element = document.getElementById('printable-id-card');
    if (!element) return;
    
    try {
      const dataUrl = await toJpeg(element, { 
        quality: 1.0, 
        pixelRatio: 4,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `${data.name.replace(/\s+/g, '_')}_ID_Card.jpg`;
      link.href = dataUrl;
      link.click();
      setShowExportOptions(false);
      handleComplete();
    } catch (err) {
      console.error('JPEG Export failed', err);
    }
  };

  const handleExportPdf = async () => {
    const element = document.getElementById('printable-id-card');
    if (!element) return;

    try {
      const dataUrl = await toPng(element, { 
        quality: 1.0, 
        pixelRatio: 4,
        backgroundColor: '#ffffff'
      });
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [85, 135] // Matches card aspect ratio roughly
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, 85, 135);
      pdf.save(`${data.name.replace(/\s+/g, '_')}_ID_Card.pdf`);
      setShowExportOptions(false);
      handleComplete();
    } catch (err) {
      console.error('PDF Export failed', err);
    }
  };

  const handleComplete = () => {
    setShowSuccess(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2D1B69', '#FFFFFF', '#4C1D95']
    });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] text-[#1E1B4B] font-sans selection:bg-[#2D1B69]/20">
      {/* Navbar */}
      <header className="bg-white border-b border-[#2D1B69]/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="flex items-center gap-3">
          <div className="bg-[#2D1B69] p-2 rounded-lg">
            <School className="text-white w-6 h-6" />
          </div>
          <h1 className="font-bold text-xl tracking-tight hidden sm:block">NMU ID Generator</h1>
        </div>
        <div className="flex gap-2 relative">
          <div className="relative" ref={exportMenuRef}>
            <button 
             onClick={() => setShowExportOptions(!showExportOptions)}
             className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm bg-white border border-[#2D1B69]/20 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Export Card
              <ChevronDown className={`w-4 h-4 transition-transform ${showExportOptions ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showExportOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#2D1B69]/10 overflow-hidden z-[60]"
                >
                  <div className="p-2 space-y-1">
                    <button
                      onClick={handleExportPng}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-[#2D1B69] hover:bg-[#2D1B69]/5 rounded-xl transition-colors"
                    >
                      <FileImage className="w-4 h-4" />
                      Save as PNG
                    </button>
                    <button
                      onClick={handleExportJpeg}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-[#2D1B69] hover:bg-[#2D1B69]/5 rounded-xl transition-colors"
                    >
                      <FileImage className="w-4 h-4" />
                      Save as JPEG
                    </button>
                    <button
                      onClick={handleExportPdf}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-[#2D1B69] hover:bg-[#2D1B69]/5 rounded-xl transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Save as PDF
                    </button>
                    <div className="h-px bg-[#2D1B69]/10 my-1" />
                    <button
                      onClick={() => {
                        window.print();
                        setShowExportOptions(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-[#2D1B69] hover:bg-[#2D1B69]/5 rounded-xl transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      Print Direct
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={handleComplete}
            className="flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm bg-[#2D1B69] text-white hover:bg-[#1E1B4B] transition-all active:scale-95 shadow-lg shadow-[#2D1B69]/20"
          >
            <Download className="w-4 h-4" />
            Finish
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-8 lg:p-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Side: Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-black text-[#2D1B69] mb-2 uppercase italic tracking-tight">Cadet Information</h2>
              <p className="text-gray-500 font-medium tracking-tight">Please fill in your details to populate the maritime ID card.</p>
            </div>

            <div className="grid gap-5">
              {/* Image Uploads */}
              <div className="grid grid-cols-3 gap-3">
                {/* Logo Upload */}
                <div 
                  className="group relative h-32 border-2 border-dashed border-[#2D1B69]/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#2D1B69]/40 hover:bg-[#2D1B69]/5 transition-all overflow-hidden"
                  onClick={() => logoInputRef.current?.click()}
                >
                  {data.logo ? (
                    <div className="absolute inset-0 w-full h-full">
                      <img src={data.logo} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                        <RefreshCw className="text-white w-5 h-5 animate-spin-slow" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-[#2D1B69]/10 p-2 rounded-full mb-1 group-hover:scale-110 transition-transform">
                        <School className="text-[#2D1B69] w-4 h-4" />
                      </div>
                      <span className="font-bold text-[10px] text-[#2D1B69] text-center px-1">University Logo</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={logoInputRef} 
                    onChange={(e) => handleImageUpload(e, 'logo')} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>

                {/* Passport Upload */}
                <div 
                  className="group relative h-32 border-2 border-dashed border-[#2D1B69]/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#2D1B69]/40 hover:bg-[#2D1B69]/5 transition-all overflow-hidden"
                  onClick={() => passportInputRef.current?.click()}
                >
                  {data.passport ? (
                    <div className="absolute inset-0 w-full h-full">
                      <img src={data.passport} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                        <RefreshCw className="text-white w-5 h-5 animate-spin-slow" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-[#2D1B69]/10 p-2 rounded-full mb-1 group-hover:scale-110 transition-transform">
                        <User className="text-[#2D1B69] w-4 h-4" />
                      </div>
                      <span className="font-bold text-[10px] text-[#2D1B69]">Passport Photo</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={passportInputRef} 
                    onChange={(e) => handleImageUpload(e, 'passport')} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>

                {/* Signature Upload */}
                <div 
                  className="group relative h-32 border-2 border-dashed border-[#2D1B69]/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#2D1B69]/40 hover:bg-[#2D1B69]/5 transition-all overflow-hidden"
                  onClick={() => signatureInputRef.current?.click()}
                >
                  {data.signature ? (
                    <div className="absolute inset-0 w-full h-full">
                      <img src={data.signature} alt="Signature Preview" className="w-full h-full object-contain p-2" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                        <RefreshCw className="text-white w-5 h-5 animate-spin-slow" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-[#2D1B69]/10 p-2 rounded-full mb-1 group-hover:scale-110 transition-transform">
                        <Upload className="text-[#2D1B69] w-4 h-4" />
                      </div>
                      <span className="font-bold text-[10px] text-[#2D1B69]">Signature</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={signatureInputRef} 
                    onChange={(e) => handleImageUpload(e, 'signature')} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid gap-4">
                 <div className="space-y-1 focus-within:translate-x-1 transition-transform duration-200">
                    <label className="text-[10px] uppercase font-black text-[#2D1B69] tracking-widest flex items-center gap-1.5 ml-1">
                      <User className="w-3 h-3" /> Full Name
                    </label>
                    <input 
                      name="name"
                      value={data.name}
                      onChange={handleInputChange}
                      placeholder="Enter Full Name"
                      className="w-full bg-white border border-[#2D1B69]/10 p-3.5 rounded-xl font-bold placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D1B69]/20 shadow-sm transition-shadow"
                    />
                 </div>

                 <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-black text-[#2D1B69] tracking-widest flex items-center gap-1.5 ml-1">
                        <RefreshCw className="w-3 h-3" /> Gender
                      </label>
                      <select 
                        name="gender"
                        value={data.gender}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-[#2D1B69]/10 p-3.5 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#2D1B69]/20 shadow-sm appearance-none cursor-pointer"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-black text-[#2D1B69] tracking-widest flex items-center gap-1.5 ml-1">
                        <Binary className="w-3 h-3" /> Matric Number
                      </label>
                      <input 
                        name="matNo"
                        value={data.matNo}
                        onChange={handleInputChange}
                        placeholder="NMU/2018/XXXX"
                        className="w-full bg-white border border-[#2D1B69]/10 p-3.5 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#2D1B69]/20 shadow-sm"
                      />
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-[#2D1B69] tracking-widest flex items-center gap-1.5 ml-1">
                      <BookOpen className="w-3 h-3" /> Department
                    </label>
                    <input 
                      name="dept"
                      value={data.dept}
                      onChange={handleInputChange}
                      placeholder="e.g. Marine Engineering"
                      className="w-full bg-white border border-[#2D1B69]/10 p-3.5 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#2D1B69]/20 shadow-sm"
                    />
                 </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-[#2D1B69] tracking-widest flex items-center gap-1.5 ml-1">
                      <Binary className="w-3 h-3" /> QR Content
                    </label>
                    <input 
                      name="qrContent"
                      value={data.qrContent}
                      onChange={handleInputChange}
                      placeholder="Information for QR Code"
                      className="w-full bg-white border border-[#2D1B69]/10 p-3.5 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#2D1B69]/20 shadow-sm"
                    />
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-[#2D1B69] tracking-widest flex items-center gap-1.5 ml-1">
                      <MapPin className="w-3 h-3" /> Faculty
                    </label>
                    <input 
                      name="faculty"
                      value={data.faculty}
                      onChange={handleInputChange}
                      placeholder="e.g. Engineering"
                      className="w-full bg-white border border-[#2D1B69]/10 p-3.5 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#2D1B69]/20 shadow-sm"
                    />
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-[#2D1B69] tracking-widest flex items-center gap-1.5 ml-1">
                      <CheckCircle className="w-3 h-3" /> Valid Till
                    </label>
                    <input 
                      name="validTill"
                      value={data.validTill}
                      onChange={handleInputChange}
                      placeholder="e.g. 2024"
                      className="w-full bg-white border border-[#2D1B69]/10 p-3.5 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#2D1B69]/20 shadow-sm"
                    />
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Preview */}
          <div className="flex flex-col items-center justify-center sticky top-28 py-8 lg:py-0">
            <motion.div
              layoutId="id-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="relative p-2 bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(45,27,105,0.2)] group"
            >
              <IDCard data={data} />
              
              {/* Floating Labels */}
              <div className="absolute -top-4 -right-4 bg-white px-4 py-2 rounded-full shadow-lg border border-[#2D1B69]/10 pointer-events-none group-hover:scale-110 transition-transform">
                <span className="text-[10px] font-black uppercase text-[#2D1B69] tracking-widest">Live Preview</span>
              </div>
            </motion.div>

            {/* Success Toast */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8 bg-[#2D1B69] text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl"
                >
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-bold">ID Card Generated Successfully!</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 text-center text-gray-400 max-w-[300px]">
              <p className="text-xs font-semibold uppercase tracking-widest leading-relaxed">
                The visual output is optimized for high-quality printing based on NMU official templates.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Global CSS for printing and custom styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-id-card, #printable-id-card * {
            visibility: visible;
          }
          #printable-id-card {
            position: fixed;
            left: 0;
            top: 0;
            width: 8.5cm;
            height: 12cm;
            margin: 0;
            box-shadow: none;
            border: none;
          }
        }
        
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
