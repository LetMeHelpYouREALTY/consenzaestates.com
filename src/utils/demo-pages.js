/** Odyssey theme demo routes — noindex and excluded from sitemap. */
const DEMO_PATH_PREFIXES = [
	'/blog',
	'/company/',
	'/landing-pages/',
	'/theme/',
];

export function isOdysseyDemoPath(pathname) {
	const path = pathname.endsWith('/') && pathname.length > 1
		? pathname.slice(0, -1)
		: pathname;
	return DEMO_PATH_PREFIXES.some((prefix) => {
		if (prefix.endsWith('/')) {
			return path.startsWith(prefix.slice(0, -1));
		}
		return path === prefix || path.startsWith(`${prefix}/`);
	});
}
