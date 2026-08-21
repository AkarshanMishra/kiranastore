import React, { useState } from 'react';
import { X, Scan, Camera, Search, Plus, CheckCircle2 } from 'lucide-react';

export default function BarcodeScannerModal({ isOpen, onClose, products = [], onAddToCart }) {
  const [barcodeInput, setBarcodeInput] = useState('8901030384728');
  const [scannedProduct, setScannedProduct] = useState(null);
  const [isScanning, setIsScanning] = useState(true);

  if (!isOpen) return null;

  const handleScanSimulation = (code) => {
    setBarcodeInput(code);
    setIsScanning(false);
    // Find matching product
    const match = products.find(p => p.id === 1 || p.name.toLowerCase().includes('milk')) || products[0];
    setScannedProduct(match);
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 relative shadow-2xl animate-in zoom-in duration-150">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 dark:hover:text-white bg-gray-100 dark:bg-slate-800 p-2 rounded-full"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Scan size={24} />
          </div>
          <h3 className="font-black text-base text-gray-900 dark:text-white">Smart Barcode Scanner</h3>
          <p className="text-xs text-gray-500 font-medium">Scan any grocery packaging barcode to view price & add to basket</p>
        </div>

        {/* Camera Viewfinder View */}
        <div className="relative bg-slate-950 rounded-2xl h-48 flex flex-col items-center justify-center overflow-hidden border-2 border-purple-500/50 my-3">
          <div className="absolute inset-x-8 top-1/2 h-0.5 bg-rose-500 animate-pulse shadow-[0_0_12px_#f43f5e]" />
          
          <div className="text-center text-white/70 text-xs font-bold space-y-1">
            <Camera size={28} className="mx-auto opacity-50 mb-1" />
            <span>Align barcode within red laser line</span>
          </div>

          <div className="absolute bottom-2 flex gap-1.5">
            <button
              onClick={() => handleScanSimulation('8901030384728')}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg"
            >
              Simulate Milk Barcode
            </button>
            <button
              onClick={() => handleScanSimulation('8901058852301')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg"
            >
              Simulate Atta Barcode
            </button>
          </div>
        </div>

        {/* Scanned Result Card */}
        {scannedProduct && (
          <div className="bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 rounded-2xl p-3 flex items-center justify-between gap-3 mt-3 animate-in slide-in-from-bottom duration-150">
            <img
              src={scannedProduct.image_url}
              alt={scannedProduct.name}
              className="w-12 h-12 object-cover rounded-xl bg-white border border-purple-100"
            />
            <div className="flex-1">
              <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold block">BARCODE MATCHED ✓</span>
              <h4 className="font-extrabold text-xs text-gray-900 dark:text-white line-clamp-1">{scannedProduct.name}</h4>
              <span className="font-black text-xs text-purple-700">₹{scannedProduct.discount_price || scannedProduct.price}</span>
            </div>
            <button
              onClick={() => {
                onAddToCart(scannedProduct);
                alert(`${scannedProduct.name} added to cart!`);
                onClose();
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-3 py-2 rounded-xl flex items-center gap-1 shadow-sm"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
