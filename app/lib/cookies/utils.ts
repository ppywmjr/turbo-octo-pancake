import {
    googleLocalStorageFunctionalItems,
    indexedDBFunctionalItems,
    indexedDBAnalyticsItems,
} from './data'

// Consent-related localStorage keys managed by CookieModal.tsx
const CONSENT_KEYS = ['cookie_consent_given', 'cookie_consent_rejected']

/**
 * Check if the user has rejected cookie consent.
 * Returns true if cookies were explicitly rejected, false otherwise.
 */
export function areCookiesRejected(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('cookie_consent_rejected') === 'true'
}

/**
 * Check if the user has given cookie consent.
 * Returns true if cookies were explicitly accepted, false otherwise.
 */
export function hasCookieConsent(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('cookie_consent_given') === 'true'
}

/**
 * Delete all non-essential localStorage items.
 * Preserves: necessary storage keys + consent-related keys.
 */
export function deleteNonEssentialLocalStorage(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return

    const necessaryKeys = new Set<string>()
    for (const item of googleLocalStorageFunctionalItems) {
        necessaryKeys.add(item.key)
    }

    const keysToDelete: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && !necessaryKeys.has(key) && !CONSENT_KEYS.includes(key)) {
            keysToDelete.push(key)
        }
    }

    for (const key of keysToDelete) {
        localStorage.removeItem(key)
    }
}

/**
 * Delete all non-essential sessionStorage items.
 * Preserves: necessary session storage keys.
 */
export function deleteNonEssentialSessionStorage(): void {
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return

    // No non-essential sessionStorage items are tracked in our data,
    // but we provide this function for future extensibility
}

/**
 * Delete all non-essential IndexedDB databases.
 * This deletes entire databases, not just records within them.
 */
export async function deleteNonEssentialIndexedDB(): Promise<void> {
    if (typeof window === 'undefined' || typeof window.indexedDB === 'undefined') return

    const databaseNames = new Set<string>()
    for (const item of [...indexedDBFunctionalItems, ...indexedDBAnalyticsItems]) {
        // Database names are the part before "→" (e.g., 'YtIdbMeta' from 'YtIdbMeta → databases')
        const dbName = item.database.split('→')[0].trim()
        if (dbName) {
            databaseNames.add(dbName)
        }
    }

    const deletePromises = Array.from(databaseNames).map(
        (name) => new Promise<void>((resolve) => {
            try {
                const request = window.indexedDB.deleteDatabase(name)
                request.onsuccess = () => resolve()
                request.onerror = () => resolve()
                request.onblocked = () => resolve()
            } catch {
                resolve()
            }
        })
    )

    await Promise.allSettled(deletePromises)
}

/**
 * Delete all non-essential storage across all types.
 * localStorage → sessionStorage → IndexedDB
 *
 * Note: This cannot delete third-party cookies (e.g., .youtube.com) or
 * HttpOnly cookies. To prevent those from being set, use areCookiesRejected()
 * to conditionally avoid loading third-party services (e.g., YouTube player).
 */
export async function deleteNonEssentialStorage(): Promise<void> {
    deleteNonEssentialLocalStorage()
    deleteNonEssentialSessionStorage()
    await deleteNonEssentialIndexedDB()
}
