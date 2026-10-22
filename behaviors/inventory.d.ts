import type { Direction } from './navigation.js';
export interface InventoryItem { label: string; icon?: string; }
// icon: a Phosphor icon name from styles/icons.css (drawn as an icon) or any other text symbol.
export declare function createInventory<T extends InventoryItem>(root: HTMLElement, options: { items: Iterable<T>; columns?: number; rowHeight?: number; overscan?: number; onSelect?: (item: T, index: number) => void }): { move(direction: Direction | 'pageup' | 'pagedown'): void; activate(): void; setItems(items: Iterable<T>): void; destroy(): void };
