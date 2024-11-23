const bwipjs = require('bwip-js');

exports.generateBarcode = async (sku) => {
  try {
    const buffer = await bwipjs.toBuffer({
      bcid: 'code128',
      text: sku,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center',
    });
    
    // In a real application, you'd probably want to save this to a file storage
    // and return the URL. For now, we'll just return the SKU
    return sku;
  } catch (error) {
    console.error('Error generating barcode:', error);
    throw error;
  }
}; 