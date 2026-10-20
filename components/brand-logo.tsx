/** Keep the approved artwork; remove its near-black field at render time.
 * The luminance-derived alpha leaves ivory/gold opaque and preserves edge smoothing.
 */
export function BrandLogo({ variant = 'wordmark', idPrefix }: { variant?: 'wordmark' | 'portrait'; idPrefix?: string }) {
  const id = idPrefix ?? `krausbraeu-${variant}`;
  const filterId = `brand-alpha-${id}`;
  const maskId = `brand-mask-${id}`;
  const portrait = variant === 'portrait';
  return <svg className={portrait ? 'logo-portrait' : 'logo-wordmark'} viewBox={portrait ? '0 0 1200 1200' : '80 125 1040 225'} aria-hidden="true" focusable="false">
    <defs>
      <filter id={filterId} colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  .2126 .7152 .0722 0 0"/>
        <feComponentTransfer><feFuncA type="linear" slope="5" intercept="-.5"/></feComponentTransfer>
      </filter>
      {!portrait && <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="480" style={{ maskType: 'alpha' }}>
        <image href="/brand/schriftzug.webp" width="1200" height="480" filter={`url(#${filterId})`}/>
      </mask>}
    </defs>
    {portrait ? <image href="/brand/siegel-kopf.webp" width="1200" height="1200" filter={`url(#${filterId})`}/> : <g mask={`url(#${maskId})`}>
      <rect className="logo-primary" width="1200" height="480"/>
      <path className="logo-accent" d="M660 0H1200V300H660Z M0 300H1200V480H0Z"/>
    </g>}
  </svg>;
}
