import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function BarcodeScanner({ onScan, onClose }) {
    const scannerRef = useRef(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            'barcode-reader',
            {
                fps: 10,
                qrbox: { width: 250, height: 150 },
                supportedScanTypes: [0], // solo cámara
            },
            false
        );

        scanner.render(
            (decodedText) => {
                onScan(decodedText);
                scanner.clear();
            },
            (error) => {
                // errores silenciosos mientras escanea
            }
        );

        scannerRef.current = scanner;

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(() => {});
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        📷 Escanear Código
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ✕
                    </button>
                </div>

                <div id="barcode-reader" className="w-full" />

                <p className="text-xs text-gray-500 text-center mt-3">
                    Apunta la cámara al código de barra del producto
                </p>
            </div>
        </div>
    );
}
