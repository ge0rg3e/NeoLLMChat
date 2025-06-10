import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const key = Buffer.from(Bun.env.CONTENT_ENCRYPTION_KEY!, 'hex');
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

export const encryptContent = (input: string): string => {
	const iv = randomBytes(IV_LENGTH);
	const cipher = createCipheriv(ALGORITHM, key, iv);

	const encrypted = Buffer.concat([cipher.update(input, 'utf8'), cipher.final()]);
	const tag = cipher.getAuthTag();

	const payload = Buffer.concat([iv, tag, encrypted]);
	return payload.toString('base64');
};

export const decryptContent = (input: string): string => {
	const payload = Buffer.from(input, 'base64');

	const iv = payload.slice(0, IV_LENGTH);
	const tag = payload.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
	const encrypted = payload.slice(IV_LENGTH + TAG_LENGTH);

	const decipher = createDecipheriv(ALGORITHM, key, iv);
	decipher.setAuthTag(tag);

	const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
	return decrypted.toString('utf8');
};
