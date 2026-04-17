import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface LightningAddress {
  /** Unique identifier for the address */
  id: string;
  /** Username part of the lightning address (e.g., "john" for john@unitypay.cash) */
  username: string;
  /** Domain for the lightning address */
  domain: string;
  /** NWC connection string (nostr+walletconnect://...) */
  nwcConnection?: string;
  /** Optional alias/display name */
  alias?: string;
  /** Whether this is the primary/default address */
  isPrimary: boolean;
  /** Unix timestamp when created */
  createdAt: number;
  /** Unix timestamp when last updated */
  updatedAt: number;
}

export interface LightningAddressState {
  addresses: LightningAddress[];
  /** The active/selected address for receiving payments */
  activeAddressId: string | null;
}

const DEFAULT_DOMAIN = 'unitypay.cash';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || username.length < 1) {
    return { valid: false, error: 'Username is required' };
  }
  
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }
  
  if (username.length > 40) {
    return { valid: false, error: 'Username must be less than 40 characters' };
  }
  
  // Only allow lowercase letters, numbers, and hyphens
  const usernameRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;
  if (!usernameRegex.test(username)) {
    return { valid: false, error: 'Only lowercase letters, numbers, and hyphens allowed. Must start and end with a letter or number.' };
  }
  
  // Disallow reserved names
  const reservedNames = ['admin', 'root', 'www', 'mail', 'ftp', 'api', 'test', 'demo', 'support', 'help'];
  if (reservedNames.includes(username.toLowerCase())) {
    return { valid: false, error: 'This username is reserved' };
  }
  
  return { valid: true };
}

export function useLightningAddressInternal() {
  const [state, setState] = useLocalStorage<LightningAddressState>('unitypay:addresses', {
    addresses: [],
    activeAddressId: null,
  });

  /** Create a new lightning address */
  const createAddress = useCallback(async (
    username: string,
    options?: {
      domain?: string;
      alias?: string;
      nwcConnection?: string;
    }
  ): Promise<{ success: boolean; address?: LightningAddress; error?: string }> => {
    const domain = options?.domain || DEFAULT_DOMAIN;
    
    // Validate username
    const validation = validateUsername(username);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
    
    // Check for duplicate
    const exists = state.addresses.find(
      a => a.username.toLowerCase() === username.toLowerCase() && a.domain === domain
    );
    if (exists) {
      return { success: false, error: 'This lightning address already exists' };
    }
    
    const now = Date.now();
    const isFirst = state.addresses.length === 0;
    
    const newAddress: LightningAddress = {
      id: generateId(),
      username: username.toLowerCase(),
      domain,
      nwcConnection: options?.nwcConnection,
      alias: options?.alias,
      isPrimary: isFirst,
      createdAt: now,
      updatedAt: now,
    };
    
    setState(prev => ({
      addresses: [...prev.addresses, newAddress],
      activeAddressId: isFirst ? newAddress.id : prev.activeAddressId,
    }));
    
    return { success: true, address: newAddress };
  }, [state.addresses, setState]);

  /** Update an existing lightning address */
  const updateAddress = useCallback(async (
    id: string,
    updates: Partial<Pick<LightningAddress, 'alias' | 'nwcConnection'>>
  ): Promise<{ success: boolean; error?: string }> => {
    const address = state.addresses.find(a => a.id === id);
    if (!address) {
      return { success: false, error: 'Address not found' };
    }
    
    // If updating username, validate it
    if (updates.alias !== undefined) {
      const username = updates.alias;
      if (username) {
        const validation = validateUsername(username);
        if (!validation.valid) {
          return { success: false, error: validation.error };
        }
        
        // Check for duplicate (excluding current address)
        const exists = state.addresses.find(
          a => a.id !== id && a.username.toLowerCase() === username.toLowerCase() && a.domain === address.domain
        );
        if (exists) {
          return { success: false, error: 'This username is already taken' };
        }
        
        updates = { ...updates, alias: username.toLowerCase() };
      }
    }
    
    setState(prev => ({
      ...prev,
      addresses: prev.addresses.map(a => 
        a.id === id 
          ? { ...a, ...updates, updatedAt: Date.now() }
          : a
      ),
    }));
    
    return { success: true };
  }, [state.addresses, setState]);

  /** Link NWC connection to an address */
  const linkNWC = useCallback(async (
    addressId: string,
    nwcConnection: string
  ): Promise<{ success: boolean; error?: string }> => {
    const address = state.addresses.find(a => a.id === addressId);
    if (!address) {
      return { success: false, error: 'Address not found' };
    }
    
    // Validate NWC URI
    if (!nwcConnection.startsWith('nostr+walletconnect://') && !nwcConnection.startsWith('nostrwalletconnect://')) {
      return { success: false, error: 'Invalid NWC connection string. Must start with nostr+walletconnect:// or nostrwalletconnect://' };
    }
    
    setState(prev => ({
      ...prev,
      addresses: prev.addresses.map(a => 
        a.id === addressId 
          ? { ...a, nwcConnection, updatedAt: Date.now() }
          : a
      ),
    }));
    
    return { success: true };
  }, [state.addresses, setState]);

  /** Unlink NWC connection from an address */
  const unlinkNWC = useCallback(async (
    addressId: string
  ): Promise<{ success: boolean; error?: string }> => {
    const address = state.addresses.find(a => a.id === addressId);
    if (!address) {
      return { success: false, error: 'Address not found' };
    }
    
    setState(prev => ({
      ...prev,
      addresses: prev.addresses.map(a => 
        a.id === addressId 
          ? { ...a, nwcConnection: undefined, updatedAt: Date.now() }
          : a
      ),
    }));
    
    return { success: true };
  }, [state.addresses, setState]);

  /** Delete a lightning address */
  const deleteAddress = useCallback(async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    const address = state.addresses.find(a => a.id === id);
    if (!address) {
      return { success: false, error: 'Address not found' };
    }
    
    const newAddresses = state.addresses.filter(a => a.id !== id);
    const wasPrimary = address.isPrimary;
    
    setState(prev => ({
      addresses: newAddresses,
      activeAddressId: prev.activeAddressId === id 
        ? (newAddresses[0]?.id || null)
        : prev.activeAddressId,
    }));
    
    // If deleted address was primary, make the first remaining address primary
    if (wasPrimary && newAddresses.length > 0) {
      setState(prev => ({
        ...prev,
        addresses: [{ ...prev.addresses[0], isPrimary: true }, ...prev.addresses.slice(1)],
      }));
    }
    
    return { success: true };
  }, [state.addresses, setState]);

  /** Set an address as primary */
  const setPrimary = useCallback(async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    const address = state.addresses.find(a => a.id === id);
    if (!address) {
      return { success: false, error: 'Address not found' };
    }
    
    setState(prev => ({
      ...prev,
      addresses: prev.addresses.map(a => ({
        ...a,
        isPrimary: a.id === id,
        updatedAt: a.id === id ? Date.now() : a.updatedAt,
      })),
    }));
    
    return { success: true };
  }, [state.addresses, setState]);

  /** Get the full lightning address string (e.g., john@unitypay.cash) */
  const getFullAddress = useCallback((address: LightningAddress): string => {
    return `${address.username}@${address.domain}`;
  }, []);

  /** Get the active address */
  const activeAddress = useMemo(() => {
    if (!state.activeAddressId) return null;
    return state.addresses.find(a => a.id === state.activeAddressId) || null;
  }, [state]);

  return {
    addresses: state.addresses,
    activeAddress,
    activeAddressId: state.activeAddressId,
    createAddress,
    updateAddress,
    linkNWC,
    unlinkNWC,
    deleteAddress,
    setPrimary,
    getFullAddress,
    DEFAULT_DOMAIN,
  };
}