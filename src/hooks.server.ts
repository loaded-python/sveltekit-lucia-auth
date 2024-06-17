import { lucia } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);

	if (!sessionId && event.url.pathname !== '/login' && event.url.pathname !== '/signup') {
		const fromUrl = event.url.pathname + event.url.search;
		throw redirect(303, `/login?redirectTo=${fromUrl}`);
	}

	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}
	const { session, user } = await lucia.validateSession(sessionId);

	if (!session && event.url.pathname !== '/login' && event.url.pathname !== '/signup') {
		const fromUrl = event.url.pathname + event.url.search;
		throw redirect(303, `/login?redirectTo=${fromUrl}`);
	}

	if (session && (event.url.pathname === '/login' || event.url.pathname === '/signup')) {
		throw redirect(303, '/');
	}

	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};
