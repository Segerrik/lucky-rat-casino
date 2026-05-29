export interface StoredSlotSession {
  balanceWei: string;
  chainAnchor: string;
}

function storageKey(address: string) {
  return `lucky-rat-slot-${address.toLowerCase()}`;
}

export function readStoredSession(address: string): StoredSlotSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(storageKey(address));
    if (!raw) return null;
    return JSON.parse(raw) as StoredSlotSession;
  } catch {
    return null;
  }
}

export function persistSession(
  address: string,
  balanceWei: bigint,
  chainAnchor: bigint,
) {
  if (typeof window === 'undefined') return;
  const payload: StoredSlotSession = {
    balanceWei: balanceWei.toString(),
    chainAnchor: chainAnchor.toString(),
  };
  localStorage.setItem(storageKey(address), JSON.stringify(payload));
}

/** Merge on-chain balance with locally tracked slot session. */
export function resolveSessionBalance(
  address: string,
  chainBalance: bigint,
): bigint {
  const stored = readStoredSession(address);

  if (!stored) {
    persistSession(address, chainBalance, chainBalance);
    return chainBalance;
  }

  const anchor = BigInt(stored.chainAnchor);
  const sessionBal = BigInt(stored.balanceWei);

  if (chainBalance > anchor) {
    const depositDelta = chainBalance - anchor;
    const next = sessionBal + depositDelta;
    persistSession(address, next, chainBalance);
    return next;
  }

  if (chainBalance < sessionBal) {
    persistSession(address, chainBalance, chainBalance);
    return chainBalance;
  }

  return sessionBal;
}

export function updateSessionBalance(address: string, balanceWei: bigint) {
  const stored = readStoredSession(address);
  const anchor = stored ? BigInt(stored.chainAnchor) : balanceWei;
  persistSession(address, balanceWei, anchor);
}
