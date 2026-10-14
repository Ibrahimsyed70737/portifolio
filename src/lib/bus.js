// Tiny shared state between the DOM layer and the 3D scene.
// Kept outside React so scrolling never triggers re-renders of the canvas.

export const scrollState = {
  f: 0, // continuous section position: 0 = hero, 1 = about, ... 5 = contact
  section: 0,
  snap: false, // screenshot mode: skip camera easing
}

const cursorListeners = new Set()
export const cursor = {
  set(label) {
    cursorListeners.forEach((fn) => fn(label))
  },
  subscribe(fn) {
    cursorListeners.add(fn)
    return () => cursorListeners.delete(fn)
  },
}

// App replaces this once Lenis is ready.
export const nav = { to: () => {} }
