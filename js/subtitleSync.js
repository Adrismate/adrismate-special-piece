/**
 * Subtitle Sync Engine
 * Tracks audio.currentTime via requestAnimationFrame
 * Fires callback only when the active segment index changes
 */
function createSubtitleSync({ audio, segments, onSegmentChange }) {
  let rafId = null;
  let currentIndex = -1;
  let isDestroyed = false;

  function findActive(time) {
    for (let i = 0; i < segments.length; i++) {
      if (time >= segments[i].start && time < segments[i].end) return i;
    }
    return -1;
  }

  function tick() {
    if (isDestroyed) return;
    const idx = findActive(audio.currentTime);
    if (idx !== currentIndex) {
      currentIndex = idx;
      onSegmentChange(idx >= 0 ? segments[idx] : null, idx);
    }
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (isDestroyed) return;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  }

  function destroy() {
    isDestroyed = true;
    if (rafId) cancelAnimationFrame(rafId);
  }

  audio.addEventListener('play', start);
  audio.addEventListener('pause', destroy);
  audio.addEventListener('ended', destroy);

  return { start, destroy };
}
