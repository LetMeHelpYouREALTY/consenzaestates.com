/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/image/client" />

interface ImportMetaEnv {
	PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
	PUBLIC_GOOGLE_MAPS_API_KEY?: string;
	PUBLIC_GOOGLE_MAPS_MAP_ID?: string;
	PUBLIC_FOLLOW_UP_BOSS_API_KEY?: string;
	FOLLOW_UP_BOSS_API_KEY?: string;
}

interface ImportMeta {
	env: ImportMetaEnv;
}