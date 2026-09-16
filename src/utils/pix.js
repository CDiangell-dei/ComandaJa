/**
 * Gera payload PIX no padrão EMV BR Code (Banco Central)
 */
function crc16(data) {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function emvField(id, value) {
  const len = String(value.length).padStart(2, '0');
  return `${id}${len}${value}`;
}

export function generatePixPayload({
  key = 'contato@comandaja.com.br',
  name = 'COMANDA JA PASTELARIA',
  city = 'SAO PAULO',
  amount = 0.00,
  txid = 'CMD' + Math.floor(Math.random() * 10000)
}) {
  // Format amount to 2 decimal places
  const formattedAmount = amount.toFixed(2);
  
  // Clean string inputs
  const cleanName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 25).toUpperCase();
  const cleanCity = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 15).toUpperCase();
  const cleanTxid = txid.replace(/[^A-Za-z0-9]/g, '').slice(0, 25) || 'CMD001';

  // 26 - Merchant Account Information (GUI + Key)
  const gui = emvField('00', 'br.gov.bcb.pix');
  const chavePix = emvField('01', key);
  const merchantAccountInfo = emvField('26', `${gui}${chavePix}`);

  // 62 - Additional Data Field Template (TXID)
  const txidField = emvField('05', cleanTxid);
  const additionalData = emvField('62', txidField);

  let payload = 
    emvField('00', '01') + // Format Indicator
    emvField('01', '12') + // Point of Initiation: 12 (Dynamic/Reusable)
    merchantAccountInfo +
    emvField('52', '0000') + // Merchant Category Code
    emvField('53', '986') +  // Currency: 986 (BRL)
    emvField('54', formattedAmount) + // Amount
    emvField('58', 'BR') +   // Country Code
    emvField('59', cleanName) + // Merchant Name
    emvField('60', cleanCity) + // Merchant City
    additionalData +
    '6304'; // CRC16 prefix

  const crc = crc16(payload);
  return `${payload}${crc}`;
}

/**
 * Returns a high-contrast visual QR Code image URL using qr-server API with fallback
 */
export function getQrCodeImageUrl(text, size = 250) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(text)}`;
}
