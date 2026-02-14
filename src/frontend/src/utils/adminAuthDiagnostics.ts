/**
 * Lightweight diagnostics for admin auth transitions.
 * Uses internal de-duplication to avoid repeated logs in render loops.
 */

const tracedEvents = new Set<string>();
const TRACE_RESET_DELAY = 5000; // Reset trace memory after 5 seconds

function createTraceKey(event: string, detail?: string): string {
  return detail ? `${event}:${detail}` : event;
}

export function traceAuthTransition(event: string, detail?: string): void {
  const key = createTraceKey(event, detail);
  
  if (tracedEvents.has(key)) {
    return; // Already traced recently
  }
  
  tracedEvents.add(key);
  
  const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
  const message = detail 
    ? `[Admin Auth ${timestamp}] ${event}: ${detail}`
    : `[Admin Auth ${timestamp}] ${event}`;
  
  console.log(message);
  
  // Clear trace memory after delay to allow re-tracing if event happens again later
  setTimeout(() => {
    tracedEvents.delete(key);
  }, TRACE_RESET_DELAY);
}
