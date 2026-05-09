import { useEffect } from "react"

/**
 * Suppresses browser extension attributes that cause hydration mismatches.
 * Works by using MutationObserver to clean unwanted attributes after hydration.
 */
export function useSuppressExtensions() {
  useEffect(() => {
    // List of attributes commonly added by form-filling extensions
    const extensionAttrs = ["fdprocessedid", "data-autofill-hint", "data-1p-ignore"]

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.target instanceof HTMLElement) {
          const el = mutation.target
          extensionAttrs.forEach((attr) => {
            if (el.hasAttribute(attr)) {
              el.removeAttribute(attr)
            }
          })
        }
      })
    })

    // Start observing the document for attribute changes
    observer.observe(document.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: extensionAttrs,
    })

    return () => observer.disconnect()
  }, [])
}
