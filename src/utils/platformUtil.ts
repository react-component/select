export function isPlatformMac(): boolean {
  return /mac\sos/i.test(navigator.appVersion);
}
