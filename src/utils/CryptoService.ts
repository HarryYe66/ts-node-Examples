import crypto from 'crypto'

/**
 * 加密服务使用实例
 * import CryptoService from './CryptoService';
 * const cryptoService = new CryptoService(privateKey);
 */

export default class CryptoService {
  private privateKey: crypto.KeyObject

  /**
   * 初始化
   * @param privateKey 私钥字符串
   */

  constructor(privateKeyPem: string, passphrase: string) {
    this.privateKey = crypto.createPrivateKey({
      key: privateKeyPem,
      format: 'pem',
      passphrase: passphrase,
    })
  }

  // 加密消息
  encryptMessage(message: string, key: string): string {
    const iv = crypto.randomBytes(16) // 生成 16 字节（128 位）的 IV
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(key, 'base64'),
      iv
    )
    let encrypted = cipher.update(message, 'utf8', 'base64')
    encrypted += cipher.final('base64')
    return iv.toString('base64') + ':' + encrypted
  }

  // 解密消息
  decryptMessage(encryptedMessage: string, key: string): string {
    const parts = encryptedMessage.split(':')
    const iv = Buffer.from(parts[0], 'base64')
    const encryptedText = parts[1]
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(key, 'base64'),
      iv
    )
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }

  // 加密 AES 密钥
  encryptAESKey(aesKey: string, publicKey: string): string {
    const encryptedKey = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(aesKey)
    )
    return encryptedKey.toString('base64')
  }

  // 解密 AES 密钥
  decryptAESKey(encryptedKey: string): string {
    const decryptedKey = crypto.privateDecrypt(
      {
        key: this.privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encryptedKey, 'base64')
    )
    return decryptedKey.toString('utf8')
  }
}

/**
 * 实例大全
 * const crypto = require('crypto');
  // 生成随机 AES 密钥
  const aesKey = crypto.randomBytes(32).toString('base64');
  console.log('AES Key:', aesKey);

  // 使用 RSA 公钥加密 AES 密钥
  const publicKey = fs.readFileSync('public_key.pem', 'utf8');
  const encryptedAESKey = crypto.publicEncrypt(publicKey, Buffer.from(aesKey));
  console.log('Encrypted AES Key:', encryptedAESKey.toString('base64'));

  // 使用 RSA 私钥解密 AES 密钥
  const privateKey = fs.readFileSync('private_key.pem', 'utf8');
  const decryptedAESKey = crypto.privateDecrypt({ key: privateKey, passphrase: 'your-passphrase' }, encryptedAESKey);
  console.log('Decrypted AES Key:', decryptedAESKey.toString('utf8'));

  // 使用 AES 加密消息
  const message = "Hello, World!";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(decryptedAESKey, 'base64'), iv);
  let encryptedMessage = cipher.update(message, 'utf8', 'base64');
  encryptedMessage += cipher.final('base64');
  console.log('Encrypted Message:', encryptedMessage);

  // 使用 AES 解密消息
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(decryptedAESKey, 'base64'), iv);
  let decryptedMessage = decipher.update(encryptedMessage, 'base64', 'utf8');
  decryptedMessage += decipher.final('utf8');
  console.log('Decrypted Message:', decryptedMessage);
 */
