import { LANGUAGE_COOKIE } from '@/i18n/constants';
import { THEME_STORAGE_KEY } from '@/theme/themePreference';

/**
 * Runs synchronously in `<head>` before the first paint. Theme and language are
 * client state (localStorage + cookie) that the static shell cannot know, so
 * they are applied to `<html>` here rather than in an effect — no flash of the
 * wrong palette, and no wrong `lang` for assistive tech.
 *
 * Kept dependency-free and tiny on purpose: it must execute before hydration.
 */
export const BOOTSTRAP_SCRIPT = `(function(){var r=document.documentElement;try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});if(t==="light"||t==="dark"){r.setAttribute("data-theme",t)}else{r.removeAttribute("data-theme")}}catch(e){}try{var m=document.cookie.match(/(?:^|; )${LANGUAGE_COOKIE}=([^;]*)/);if(m){r.lang=decodeURIComponent(m[1])}}catch(e){}})()`;
