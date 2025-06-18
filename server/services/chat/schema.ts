import { t } from 'elysia';

export const messages = t.Array(
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
);
