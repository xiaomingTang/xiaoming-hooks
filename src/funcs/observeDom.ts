import { voidFunc } from "./utils"

type Disconnect = () => void

// @ts-ignore
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver

export function observeDOM(obj: Node, callback: () => void): Disconnect {
  if (!obj || obj.nodeType !== Node.ELEMENT_NODE) {
    return voidFunc
  }

  if (MutationObserver) {
    // define a new observer
    const mutationObserver = new MutationObserver(callback)

    // have the observer observe foo for changes in children
    mutationObserver.observe(obj, { childList: true, subtree: true })
    return () => {
      mutationObserver.disconnect()
    }
  }

  // fallback
  obj.addEventListener("DOMNodeInserted", callback, false)
  obj.addEventListener("DOMNodeRemoved", callback, false)
  return () => {
    if (obj?.nodeType === Node.ELEMENT_NODE) {
      obj.removeEventListener("DOMNodeInserted", callback, false)
      obj.removeEventListener("DOMNodeRemoved", callback, false)
    }
  }
}
