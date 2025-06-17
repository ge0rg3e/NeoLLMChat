import { getSyncConfig } from 'elysiajs-sync/client';
import { t } from 'elysia';

export const config = getSyncConfig({
	name: 'neo-llm-chat',
	schema: {
		chats: t.Object({
			id: t.String(),
			title: t.String(),
			messages: t.Array(
				t.Object({
					id: t.String(),
					role: t.Union([t.Literal('user'), t.Literal('assistant')]),
					content: t.String(),
					attachments: t.Array(
						t.Object({
							fileName: t.String(),
							mimeType: t.String(),
							data: t.String()
						})
					)
				})
			),
			createdBy: t.String(),
			createdAt: t.Date()
		}),
		activeRequests: t.Object({
			requestId: t.String(),
			chatId: t.String()
		})
	},
	keys: {
		chats: ['id'],
		activeRequests: ['requestId']
	},
	latestVerno: 1,
	previousVersions: []
});
