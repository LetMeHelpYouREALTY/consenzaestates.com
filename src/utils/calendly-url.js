import settings from '../config/settings.js';

const LISTING_CONSULTATION = 'listing-consultation';

/**
 * Build a Calendly URL with UTM tags. Uses settings for the default strategy meeting;
 * listing-consultation uses website placement tags per ship workflow.
 */
export function buildCalendlyUrl({
	eventSlug = '',
	utmCampaign = '',
	utmContent = '',
} = {}) {
	if (!eventSlug || eventSlug === 'realtor_strategy_meeting') {
		return settings.calendly?.urlWithUtm
			? settings.calendly.urlWithUtm(utmCampaign)
			: (settings.calendly?.url ?? 'https://calendly.com/drjanduffy/realtor_strategy_meeting');
	}

	const base = `https://calendly.com/drjanduffy/${eventSlug}`;
	const params = new URLSearchParams({
		utm_source: 'consenzaestates.com',
		utm_medium: 'website',
	});
	if (utmContent) params.set('utm_content', utmContent);
	if (utmCampaign) params.set('utm_campaign', utmCampaign);
	return `${base}?${params.toString()}`;
}

export { LISTING_CONSULTATION };
