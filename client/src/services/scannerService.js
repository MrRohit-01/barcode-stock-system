export const scannerService = {
  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  },

  getDefaultScannerConfig() {
    const isMobile = this.isMobileDevice();
    
    return {
      fps: 10,
      qrbox: isMobile 
        ? { width: 250, height: 250 }
        : { width: 500, height: 100 },
      aspectRatio: isMobile ? 1.0 : 3.0,
      showTorchButtonIfSupported: true,
      formatsToSupport: [
        'EAN-13',
        'EAN-8',
        'UPC-A',
        'UPC-E',
        'CODE-128',
        'CODE-39'
      ]
    };
  },

  formatBarcode(barcode) {
    // Remove any non-numeric characters
    return barcode.replace(/[^0-9]/g, '');
  },

  validateBarcode(barcode) {
    // Basic validation - can be expanded based on your needs
    return barcode.length >= 8 && barcode.length <= 14;
  }
};
