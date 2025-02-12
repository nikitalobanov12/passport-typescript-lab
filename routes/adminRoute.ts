import express from 'express';
import { ensureAdmin } from '../middleware/checkAuth';
import { SessionData, Store } from 'express-session';

const router = express.Router();

router.get('/', ensureAdmin, (req, res) => {
	req.sessionStore.all!((error: any, obj?: SessionData[] | { [sid: string]: SessionData } | null) => {
		if (error) {
			console.error('Error fetching sessions:', error);
			return res.status(500).send('Error fetching sessions');
		}

		if (!obj || Array.isArray(obj)) {
			return res.render('admin', { sessions: [], currentSessionId: req.sessionID });
		}

		const sessionObject: { [sid: string]: SessionData } = obj;

		const activeSessions = Object.entries(obj).map(([sessionId, session]) => {
			return {
				sessionId,
				userId: session.passport?.user,
				createdAt: new Date(session.cookie?.originalMaxAge || Date.now()),
				isCurrentSession: sessionId === req.sessionID,
			};
		});

		console.log('Active Sessions:', activeSessions);
		res.render('admin', {
			sessions: activeSessions,
			currentSessionId: req.sessionID,
		});
	});
});

router.post('/revoke-session', ensureAdmin, (req, res) => {
	const { sessionId } = req.body;

	req.sessionStore.destroy(sessionId, err => {
		if (err) {
			console.error('Error revoking session:', err);
			return res.status(500).send('failed to revoke session');
		}
		console.log(`Session ${sessionId} revoked successfully`);
		res.redirect('/admin');
	});
});

export default router;
