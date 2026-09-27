import { nav } from '../config/nav.js';
import { getNeighborhoodBySlug } from '../config/neighborhoods.js';
import settings from '../config/settings.js';

function humanizeSlug(segment) {
	return segment
		.split('-')
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

function stripTitleSuffix(title) {
	if (!title) return undefined;
	const template = settings.seo?.titleTemplate;
	if (template && template.includes('%s')) {
		const suffix = template.replace('%s', '').trim();
		if (suffix && title.endsWith(suffix)) {
			return title.slice(0, title.length - suffix.length).trim();
		}
	}
	return title;
}

/**
 * Build BreadcrumbList JSON-LD for inner pages (Home > … > current).
 * @param {string} pathname - URL pathname (e.g. /about)
 * @param {{ breadcrumbLabel?: string; title?: string }} [options]
 * @returns {object | null}
 */
export function buildBreadcrumbList(pathname, options = {}) {
	const normalized = pathname.replace(/\/$/, '') || '/';
	if (normalized === '/') return null;

	const siteUrl = (settings.url || '').replace(/\/$/, '');
	const crumbs = [{ name: 'Home', path: '/' }];
	const segments = normalized.split('/').filter(Boolean);

	let accumulated = '';
	for (let i = 0; i < segments.length; i++) {
		accumulated += `/${segments[i]}`;
		const isLast = i === segments.length - 1;
		let name;

		const navMatch = nav.find((item) => item.slug.replace(/\/$/, '') === accumulated);
		if (navMatch) {
			name = navMatch.title;
		} else if (segments[0] === 'neighborhoods' && segments.length === 2 && i === 1) {
			name = getNeighborhoodBySlug(segments[1])?.name ?? humanizeSlug(segments[1]);
		} else if (segments[0] === 'blog' && segments[1] === 'tags' && i === 1) {
			name = 'Tags';
		} else if (segments[0] === 'company' && i === 0) {
			name = 'Company';
		} else if (segments[0] === 'landing-pages' && i === 0) {
			name = 'Landing Pages';
		} else if (segments[0] === 'theme' && i === 0) {
			name = 'Theme';
		} else if (isLast && options.breadcrumbLabel) {
			name = options.breadcrumbLabel;
		} else if (isLast && options.title) {
			name = stripTitleSuffix(options.title) ?? humanizeSlug(segments[i]);
		} else {
			name = humanizeSlug(segments[i]);
		}

		crumbs.push({ name, path: `${accumulated}/` });
	}

	return {
		'@type': 'BreadcrumbList',
		'@id': `${siteUrl}${normalized}/#breadcrumb`,
		itemListElement: crumbs.map((crumb, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: crumb.name,
			item: `${siteUrl}${crumb.path === '/' ? '/' : crumb.path}`,
		})),
	};
}
