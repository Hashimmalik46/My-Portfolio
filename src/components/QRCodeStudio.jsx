import { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  QrCode,
  Link as LinkIcon,
  Wifi,
  User,
  FileText,
  Mail,
  CreditCard,
  Download,
  Copy,
  Check,
  Edit3,
  Eye,
  Sliders,
  Sparkles,
  Share2,
} from "lucide-react";

// Predefined stylish color themes
const COLOR_PRESETS = [
  { id: "monochrome", name: "Classic Dark", fg: "#111827", bg: "#FFFFFF" },
  { id: "indigo", name: "Electric Indigo", fg: "#4F46E5", bg: "#F5F3FF" },
  { id: "emerald", name: "Emerald Forest", fg: "#059669", bg: "#ECFDF5" },
  { id: "midnight", name: "Midnight Navy", fg: "#0F172A", bg: "#F8FAFC" },
  { id: "sunset", name: "Sunset Crimson", fg: "#DC2626", bg: "#FEF2F2" },
  { id: "slate", name: "Minimal Slate", fg: "#334155", bg: "#F1F5F9" },
];

export default function QRCodeStudio() {
  // Mobile active tab view ('editor' | 'preview')
  const [mobileView, setMobileView] = useState("editor");

  // 1. Data Type & Fields State
  const [activeType, setActiveType] = useState("url"); // 'url' | 'wifi' | 'vcard' | 'text' | 'email' | 'upi'

  // URL state
  const [urlValue, setUrlValue] = useState("");

  // Wi-Fi state
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA"); // 'WPA' | 'WEP' | 'nopass'
  const [wifiHidden, setWifiHidden] = useState(false);

  // vCard state
  const [vcardName, setVcardName] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [vcardOrg, setVcardOrg] = useState("");
  const [vcardTitle, setVcardTitle] = useState("");
  const [vcardUrl, setVcardUrl] = useState("");

  // Plain Text state
  const [textValue, setTextValue] = useState("");

  // Email state
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // UPI Payment state
  const [upiId, setUpiId] = useState("");
  const [upiName, setUpiName] = useState("");
  const [upiAmount, setUpiAmount] = useState("");

  // 2. Styling State
  const [fgColor, setFgColor] = useState("#111827");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [errorCorrection, setErrorCorrection] = useState("M"); // 'L' | 'M' | 'Q' | 'H'
  const [marginSize, setMarginSize] = useState(2); // 0 to 4

  // 3. UI State
  const [dataUrl, setDataUrl] = useState("");
  const [svgString, setSvgString] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [exportRes, setExportRes] = useState(1024); // 512 | 1024 | 2048

  // Generate payload string based on active type
  const getPayloadString = () => {
    switch (activeType) {
      case "url":
        return urlValue.trim() || "https://";
      case "wifi": {
        const enc = wifiEncryption === "nopass" ? "nopass" : wifiEncryption;
        return `WIFI:S:${wifiSsid};T:${enc};P:${wifiPassword};H:${wifiHidden ? "true" : "false"};;`;
      }
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vcardName}\nFN:${vcardName}\nORG:${vcardOrg}\nTITLE:${vcardTitle}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nURL:${vcardUrl}\nEND:VCARD`;
      case "text":
        return textValue || " ";
      case "email":
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "upi": {
        const amStr = upiAmount ? `&am=${encodeURIComponent(upiAmount)}` : "";
        return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName || "Payee")}${amStr}&cu=INR`;
      }
      default:
        return urlValue || "https://";
    }
  };

  // Re-generate QR Code whenever input or styling changes
  useEffect(() => {
    const payload = getPayloadString();
    if (!payload) return;

    let isMounted = true;

    const generate = async () => {
      try {
        const options = {
          errorCorrectionLevel: errorCorrection,
          margin: marginSize,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          width: exportRes,
        };

        // 1. High-Res Data URL for Canvas/PNG
        const url = await QRCode.toDataURL(payload, options);
        if (isMounted) setDataUrl(url);

        // 2. Vector SVG String
        const svg = await QRCode.toString(payload, { ...options, type: "svg" });
        if (isMounted) setSvgString(svg);
      } catch (err) {
        console.error("QR Code Generation Error:", err);
      }
    };

    generate();

    return () => {
      isMounted = false;
    };
  }, [
    activeType,
    urlValue,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    wifiHidden,
    vcardName,
    vcardPhone,
    vcardEmail,
    vcardOrg,
    vcardTitle,
    vcardUrl,
    textValue,
    emailTo,
    emailSubject,
    emailBody,
    upiId,
    upiName,
    upiAmount,
    fgColor,
    bgColor,
    errorCorrection,
    marginSize,
    exportRes,
  ]);

// Device detection for iOS (iPhone, iPad, iPod, iPadOS Safari)
const isIOSDevice = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent || "") ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
};

// Export handlers
  const handleDownloadPng = async () => {
    if (!dataUrl) return;
    const filename = `qrcode_${activeType}_${Date.now()}.png`;

    try {
      // Convert data URL to Blob for clean processing across all browsers
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      // 1. On iOS / Mobile devices where Web Share API with files is supported,
      // invoke native Share Sheet so iOS users can tap "Save Image" (Photos) or "Save to Files"
      if (isIOSDevice() && navigator.canShare && typeof File !== "undefined") {
        const file = new File([blob], filename, { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "QR Code",
              text: "Smart QR Code Generator",
            });
            return;
          } catch (shareErr) {
            if (shareErr.name === "AbortError") {
              // User dismissed the iOS share sheet intentionally
              return;
            }
            console.warn("iOS Share API failed, falling back to direct download:", shareErr);
          }
        }
      }

      // 2. Standard Blob ObjectURL download (Works on Android, macOS Safari, Chrome, Edge, Firefox)
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
    } catch (err) {
      console.error("PNG download error:", err);
      // Fallback: direct data URL anchor
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleDownloadSvg = async () => {
    if (!svgString) return;
    const filename = `qrcode_${activeType}_${Date.now()}.svg`;
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });

    try {
      // 1. On iOS, share sheet allows saving SVG directly to Files / iCloud Drive
      if (isIOSDevice() && navigator.canShare && typeof File !== "undefined") {
        const file = new File([blob], filename, { type: "image/svg+xml" });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "QR Code (Vector SVG)",
              text: "Smart QR Code Generator (Vector SVG)",
            });
            return;
          } catch (shareErr) {
            if (shareErr.name === "AbortError") return;
            console.warn("iOS SVG share failed, falling back to download:", shareErr);
          }
        }
      }

      // 2. Standard Blob ObjectURL download
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
    } catch (err) {
      console.error("SVG download error:", err);
    }
  };

  const handleShareQr = async () => {
    if (!dataUrl) return;
    const filename = `qrcode_${activeType}_${Date.now()}.png`;

    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      if (navigator.canShare && typeof File !== "undefined") {
        const file = new File([blob], filename, { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "QR Code",
            text: `QR Code: ${getPayloadString()}`,
          });
          return;
        }
      }

      // Fallback text/link sharing if file sharing is not supported
      if (navigator.share) {
        await navigator.share({
          title: "QR Code",
          text: getPayloadString(),
          url: activeType === "url" && urlValue ? urlValue : undefined,
        });
      } else {
        // If navigator.share is completely unsupported, copy image instead
        handleCopyImage();
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Share error:", err);
      }
    }
  };

  const handleCopyImage = async () => {
    if (!dataUrl) return;
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      navigator.clipboard.writeText(getPayloadString());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const applyPreset = (preset) => {
    setFgColor(preset.fg);
    setBgColor(preset.bg);
  };

  const types = [
    { id: "url", label: "URL", fullLabel: "Website Link", icon: LinkIcon },
    { id: "wifi", label: "Wi-Fi", fullLabel: "Wi-Fi Network", icon: Wifi },
    { id: "vcard", label: "Contact", fullLabel: "Contact Card", icon: User },
    { id: "text", label: "Text", fullLabel: "Plain Text", icon: FileText },
    { id: "email", label: "Email", fullLabel: "Email Message", icon: Mail },
    { id: "upi", label: "UPI", fullLabel: "UPI Payment", icon: CreditCard },
  ];

  return (
    <div className="relative w-full max-w-4xl h-[680px] sm:h-[720px] max-h-[92dvh] mx-auto my-auto flex flex-col rounded-2xl sm:rounded-3xl bg-white dark:bg-[#11131b] border border-gray-200 dark:border-white/[0.08] overflow-hidden z-10 font-jakarta shadow-2xl selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transform-gpu transition-colors duration-200">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 border-b border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#11131b] shrink-0 gap-2 transition-colors duration-200">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xs shrink-0">
            <QrCode size={13} />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 font-jakarta min-w-0">
            <span className="text-xs font-bold text-gray-900 dark:text-white tracking-wide truncate">
              Smart QR Studio
            </span>
            <span className="text-gray-300 dark:text-gray-700 hidden md:inline">|</span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium hidden md:inline truncate">
              Vector & PNG Generator
            </span>
          </div>
        </div>

        {/* Mobile View Toggle & Resolution Pill */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile View Switcher (Visible only on mobile < lg) */}
          <div className="flex lg:hidden items-center bg-gray-100 dark:bg-white/[0.06] p-0.5 rounded-lg border border-gray-200 dark:border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setMobileView("editor")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                mobileView === "editor"
                  ? "bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white shadow-xs"
                  : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              <Edit3 size={11} />
              <span>Configure</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileView("preview")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                mobileView === "preview"
                  ? "bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white shadow-xs"
                  : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              <Eye size={11} />
              <span>Preview</span>
            </button>
          </div>

          {/* Quick Resolution Selector */}
          <div className="hidden sm:inline-flex rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.04] p-0.5 text-xs">
            {[
              { res: 512, label: "512px" },
              { res: 1024, label: "1024px HQ" },
              { res: 2048, label: "2K" },
            ].map((item) => (
              <button
                key={item.res}
                type="button"
                onClick={() => setExportRes(item.res)}
                className={`px-2 py-0.5 rounded-md text-[10.5px] sm:text-[11px] font-semibold transition-all cursor-pointer ${
                  exportRes === item.res
                    ? "bg-white dark:bg-white/[0.16] text-gray-900 dark:text-white shadow-xs"
                    : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Studio Canvas Area */}
      <div className="flex-1 bg-[#f8f7f3]/50 dark:bg-[#090b10] p-3.5 sm:p-5 overflow-y-auto min-h-0 flex flex-col lg:grid lg:grid-cols-12 gap-4 transition-colors duration-200">
        
        {/* =========================================================================
            SECTION 1: DATA INPUTS & CUSTOMIZATION (Shown on Desktop, or mobile editor view)
        ========================================================================= */}
        <div className={`lg:col-span-7 flex flex-col space-y-3.5 ${mobileView === "preview" ? "hidden lg:flex" : "flex"}`}>
          {/* Data Type Pill Selector */}
          <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-2 shadow-2xs transition-colors duration-200">
            <div className="grid grid-cols-6 gap-1">
              {types.map((t) => {
                const Icon = t.icon;
                const isSel = activeType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveType(t.id)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
                      isSel
                        ? "bg-gray-900 dark:bg-white text-white dark:text-black shadow-xs"
                        : "bg-gray-50/60 dark:bg-white/[0.04] hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    <Icon size={14} className="mb-0.5 shrink-0" />
                    <span className="text-[10px] font-semibold truncate w-full">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Inputs Container */}
          <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 shadow-xs space-y-3.5 flex-1 flex flex-col justify-between transition-colors duration-200">
            <div>
              {/* Active Type Header */}
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-gray-100 dark:border-white/[0.06]">
                <span className="text-xs font-bold text-gray-900 dark:text-white font-clash">
                  {types.find((t) => t.id === activeType)?.fullLabel}
                </span>
                <span className="text-[10.5px] text-gray-400 dark:text-gray-500 font-medium">
                  Instant live encoding
                </span>
              </div>

              {/* 1. URL Form */}
              {activeType === "url" && (
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 block">
                    Website or Destination Link
                  </label>
                  <div className="relative flex items-center">
                    <LinkIcon size={14} className="absolute left-3 text-gray-400 dark:text-gray-500" />
                    <input
                      type="url"
                      value={urlValue}
                      onChange={(e) => setUrlValue(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-[#0c0e14] focus:outline-none focus:border-gray-900 dark:focus:border-white/40"
                    />
                  </div>
                </div>
              )}

              {/* 2. Wi-Fi Form */}
              {activeType === "wifi" && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[10.5px] font-bold uppercase text-gray-600 dark:text-gray-400">
                        Network Name (SSID)
                      </label>
                      <input
                        type="text"
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                        placeholder="e.g. Studio_5GHz"
                        className="w-full px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-[#0c0e14] focus:outline-none focus:border-gray-900 dark:focus:border-white/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10.5px] font-bold uppercase text-gray-600 dark:text-gray-400">
                        Wi-Fi Password
                      </label>
                      <input
                        type="text"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        placeholder="e.g. securepass123"
                        className="w-full px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-[#0c0e14] focus:outline-none focus:border-gray-900 dark:focus:border-white/40"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[10.5px] text-gray-500 dark:text-gray-400 font-medium mr-1">Security:</span>
                      {["WPA", "WEP", "nopass"].map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setWifiEncryption(sec)}
                          className={`px-2 py-0.5 rounded-md text-[10.5px] font-semibold cursor-pointer ${
                            wifiEncryption === sec
                              ? "bg-gray-900 dark:bg-white text-white dark:text-black"
                              : "bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                          }`}
                        >
                          {sec === "nopass" ? "Open" : sec}
                        </button>
                      ))}
                    </div>

                    <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={wifiHidden}
                        onChange={(e) => setWifiHidden(e.target.checked)}
                        className="rounded text-black dark:text-white accent-black dark:accent-white"
                      />
                      <span className="text-[11px]">Hidden SSID</span>
                    </label>
                  </div>
                </div>
              )}

              {/* 3. vCard Contact Form */}
              {activeType === "vcard" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={vcardName}
                      onChange={(e) => setVcardName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="w-full px-2.5 py-1.5 rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={vcardPhone}
                      onChange={(e) => setVcardPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full px-2.5 py-1.5 rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={vcardEmail}
                      onChange={(e) => setVcardEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-2.5 py-1.5 rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400">
                      Company
                    </label>
                    <input
                      type="text"
                      value={vcardOrg}
                      onChange={(e) => setVcardOrg(e.target.value)}
                      placeholder="e.g. Studio"
                      className="w-full px-2.5 py-1.5 rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                    />
                  </div>
                  <div className="space-y-0.5 sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={vcardUrl}
                      onChange={(e) => setVcardUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-2.5 py-1.5 rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                    />
                  </div>
                </div>
              )}

              {/* 4. Plain Text Form */}
              {activeType === "text" && (
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 block">
                    Text Content
                  </label>
                  <textarea
                    rows={3}
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                    placeholder="Enter any text or note to encode into QR..."
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-[#0c0e14] focus:outline-none"
                  />
                </div>
              )}

              {/* 5. Email Form */}
              {activeType === "email" && (
                <div className="space-y-2">
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400">
                      Recipient Email
                    </label>
                    <input
                      type="email"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      placeholder="contact@company.com"
                      className="w-full px-2.5 py-1.5 rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="e.g. Project Inquiry"
                      className="w-full px-2.5 py-1.5 rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                    />
                  </div>
                </div>
              )}

              {/* 6. UPI Payment Form */}
              {activeType === "upi" && (
                <div className="space-y-2">
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400">
                      UPI VPA / ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. merchant@upi"
                      className="w-full px-2.5 py-1.5 rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400">
                        Payee Name
                      </label>
                      <input
                        type="text"
                        value={upiName}
                        onChange={(e) => setUpiName(e.target.value)}
                        placeholder="e.g. Alex Johnson"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400">
                        Amount (₹ Optional)
                      </label>
                      <input
                        type="number"
                        value={upiAmount}
                        onChange={(e) => setUpiAmount(e.target.value)}
                        placeholder="e.g. 500"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Styling Controls */}
            <div className="pt-2.5 border-t border-gray-100 dark:border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 font-clash">
                  Color Themes:
                </span>
                {/* Custom Color Pickers */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[10.5px] font-medium text-gray-500 dark:text-gray-400">
                    <span>Dots:</span>
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-4 h-4 rounded cursor-pointer border border-gray-200 dark:border-white/10 p-0"
                    />
                  </div>
                  <div className="flex items-center gap-1 text-[10.5px] font-medium text-gray-500 dark:text-gray-400">
                    <span>Bg:</span>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-4 h-4 rounded cursor-pointer border border-gray-200 dark:border-white/10 p-0"
                    />
                  </div>
                </div>
              </div>

              {/* Presets Chips */}
              <div className="flex items-center gap-1 flex-wrap">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] hover:bg-gray-50 dark:hover:bg-white/[0.08] text-[10px] font-semibold text-gray-700 dark:text-gray-300 shadow-2xs transition-colors cursor-pointer"
                  >
                    <span
                      className="w-2 h-2 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: preset.fg }}
                    />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Switch to Preview Button */}
            <div className="lg:hidden pt-2 border-t border-gray-100 dark:border-white/[0.06]">
              <button
                type="button"
                onClick={() => setMobileView("preview")}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Eye size={13} />
                <span>View QR & Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 2: BIG LIVE QR PREVIEW & EXPORT CENTER (Shown on Desktop, or mobile preview view)
        ========================================================================= */}
        <div className={`lg:col-span-5 flex flex-col justify-between space-y-3.5 ${mobileView === "editor" ? "hidden lg:flex" : "flex"}`}>
          {/* Large Live Preview Card */}
          <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-xs flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors duration-200">
            <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-white/[0.06]">
              <span className="text-xs font-bold text-gray-900 dark:text-white font-clash">
                Live Scannable QR
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-white/[0.08] text-gray-700 dark:text-gray-300 uppercase">
                {exportRes}px
              </span>
            </div>

            {/* Generous Large QR Box */}
            <div
              className="p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-md transition-all duration-300 w-full max-w-[260px] sm:max-w-[280px] aspect-square flex items-center justify-center my-auto"
              style={{ backgroundColor: bgColor }}
            >
              {dataUrl ? (
                <img
                  src={dataUrl}
                  alt="Generated QR Code"
                  className="w-full h-full object-contain rounded-lg select-auto pointer-events-auto cursor-pointer"
                  style={{ WebkitTouchCallout: "default" }}
                  title="Live QR Code (Tap and hold on iOS to Save to Photos)"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-300 dark:text-gray-600">
                  <QrCode size={64} />
                </div>
              )}
            </div>

            {/* Payload summary snippet & mobile hint */}
            <div className="w-full pt-3 mt-2 border-t border-gray-100 dark:border-white/[0.06] space-y-1">
              <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                <span className="font-mono text-[10.5px] truncate max-w-[190px] text-left">
                  {getPayloadString()}
                </span>
                <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Check size={11} /> Ready
                </span>
              </div>
            </div>
          </div>

          {/* Export Action Card */}
          <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-3.5 shadow-xs space-y-2 transition-colors duration-200">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownloadPng}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <Download size={13} />
                <span>Save PNG</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSvg}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <FileText size={13} />
                <span>Vector SVG</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopyImage}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-gray-700 dark:text-gray-200 text-xs font-semibold transition-all cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-emerald-700 dark:text-emerald-300 font-bold truncate">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} className="shrink-0" />
                    <span className="truncate">Copy Image</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShareQr}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-gray-700 dark:text-gray-200 text-xs font-semibold transition-all cursor-pointer"
              >
                <Share2 size={13} className="shrink-0" />
                <span className="truncate">Share QR</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
