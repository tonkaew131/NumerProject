// src/lib/server/lucia.ts
import prismaAdapter from '@lucia-auth/adapter-prisma';
import { sveltekit } from 'lucia/middleware';
import { prisma } from '$lib/server/prisma';
import { dev } from '$app/environment';
import { lucia } from 'lucia';

// Provider
import { google } from '@lucia-auth/oauth/providers';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from '$env/static/private';

export const auth = lucia({
	adapter: prismaAdapter.prisma(prisma),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	getUserAttributes: (data) => {
		return {
			googleEmail: data.google_email,
			googleId: data.google_sub,
			googleName: data.google_name,
			googleProfile: data.google_profile
		};
	}
});

export const googleAuth = google(auth, {
	clientId: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	redirectUri: GOOGLE_REDIRECT_URI
});
