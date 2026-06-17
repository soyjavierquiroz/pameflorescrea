const activeRegistrationSubmits = new Set<string>();

export function acquireRegistrationSubmitLock(key: string): boolean {
  if (activeRegistrationSubmits.has(key)) {
    return false;
  }

  activeRegistrationSubmits.add(key);
  return true;
}

export function releaseRegistrationSubmitLock(key: string): void {
  activeRegistrationSubmits.delete(key);
}

export function clearRegistrationSubmitLocks(): void {
  activeRegistrationSubmits.clear();
}
