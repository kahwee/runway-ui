/** Coalesces requests for a link. Settling removes listeners; failures clear href for retry.
 * The host retains the link until settlement. There is no background polling or mounted handle.
 */
export declare function loadStylesheet(link: HTMLLinkElement, href?: string): Promise<void>;
