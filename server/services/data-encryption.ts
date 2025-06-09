import { generateKeyPairSync, publicEncrypt, privateDecrypt, constants } from 'crypto';
import { mkdir } from 'fs/promises';
import { join } from 'path';

const SECRETS_DIR = join(process.cwd(), 'secrets');
const PUBLIC_KEY_PATH = join(SECRETS_DIR, 'neollmchat_public.pem');
const PRIVATE_KEY_PATH = join(SECRETS_DIR, 'neollmchat_private.pem');

const getKeys = async () => {
	// Check if files exist
	const publicKeyFile = Bun.file(PUBLIC_KEY_PATH);
	const privateKeyFile = Bun.file(PRIVATE_KEY_PATH);

	const publicKeyExists = await publicKeyFile.exists();
	const privateKeyExists = await privateKeyFile.exists();

	if (publicKeyExists && privateKeyExists) {
		const publicKey = await publicKeyFile.text();
		const privateKey = await privateKeyFile.text();
		if (publicKey && privateKey) {
			return { publicKey, privateKey };
		}
	}

	console.log('Keys not found, generating new keys...');
	return await generateKeys();
};

const generateKeys = async () => {
	try {
		// Ensure the secrets directory exists
		await mkdir(SECRETS_DIR, { recursive: true });

		const { publicKey, privateKey } = generateKeyPairSync('rsa', {
			modulusLength: 2048
		});

		const publicKeyPem = publicKey.export({ type: 'pkcs1', format: 'pem' });
		await Bun.write(PUBLIC_KEY_PATH, publicKeyPem);

		const privateKeyPem = privateKey.export({ type: 'pkcs1', format: 'pem' });
		await Bun.write(PRIVATE_KEY_PATH, privateKeyPem);

		return { publicKey: publicKeyPem, privateKey: privateKeyPem };
	} catch (err) {
		console.error('Failed to generate keys:', err);
		return null;
	}
};

export const encrypt = async (content: string) => {
	try {
		const keys = await getKeys();
		if (!keys || !keys.publicKey) {
			throw new Error('Public key not available');
		}

		const buffer = Buffer.from(content);
		const encrypted = publicEncrypt(
			{
				key: keys.publicKey,
				padding: constants.RSA_PKCS1_OAEP_PADDING,
				oaepHash: 'sha256'
			},
			buffer
		);
		return encrypted.toString('base64');
	} catch (err) {
		console.error('Encryption failed:', err);
		return null;
	}
};

export const decrypt = async (content: string) => {
	try {
		const keys = await getKeys();
		if (!keys || !keys.privateKey) {
			throw new Error('Private key not available');
		}

		const buffer = Buffer.from(content, 'base64');
		const decrypted = privateDecrypt(
			{
				key: keys.privateKey,
				padding: constants.RSA_PKCS1_OAEP_PADDING,
				oaepHash: 'sha256'
			},
			buffer
		);
		return decrypted.toString('utf8');
	} catch (err) {
		console.error('Decryption failed:', err);
		return null;
	}
};
