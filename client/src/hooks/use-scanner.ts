import { useState, useEffect, useRef } from "react";
import Quagga from "@ericblade/quagga2";

type ScannerConfig = {
  width?: number;
  height?: number;
  facingMode?: string;
};

export function useScanner(elementId: string, config?: ScannerConfig) {
  const [barcode, setBarcode] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<typeof Quagga | null>(null);
  
  const defaultConfig: ScannerConfig = {
    width: 640,
    height: 480,
    facingMode: "environment"
  };
  
  const mergedConfig = { ...defaultConfig, ...config };

  const startScanner = async () => {
    try {
      setError(null);
      setScanning(true);
      
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with id '${elementId}' not found`);
      }
      
      await Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: `#${elementId}`,
          constraints: {
            width: mergedConfig.width,
            height: mergedConfig.height,
            facingMode: mergedConfig.facingMode
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: 2,
        frequency: 10,
        decoder: {
          readers: ["ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader"]
        },
        locate: true
      });

      Quagga.start();
      scannerRef.current = Quagga;
      
      Quagga.onDetected((result) => {
        if (result.codeResult?.code) {
          setBarcode(result.codeResult.code);
          setScanning(false);
          Quagga.stop();
        }
      });

    } catch (err) {
      setScanning(false);
      setError(err instanceof Error ? err.message : "Failed to initialize scanner");
      console.error("Scanner error:", err);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      setScanning(false);
    }
  };

  const resetScanner = () => {
    setBarcode(null);
    setError(null);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
      }
    };
  }, []);

  return {
    barcode,
    scanning,
    error,
    startScanner,
    stopScanner,
    resetScanner
  };
}
