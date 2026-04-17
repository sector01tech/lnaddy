import { useState, useEffect } from 'react';
import { useSeoMeta } from '@unhead/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QRCodeCanvas } from '@/components/ui/qrcode';
import { NWCHelpDialog } from '@/components/NWCHelpDialog';
import { useLightningAddressInternal, type LightningAddress } from '@/hooks/useLightningAddress';
import { useToast } from '@/hooks/useToast';

function QRCodeDialog({ 
  address,
  open,
  onOpenChange
}: { 
  address: LightningAddress;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const fullAddress = `${address.username}@${address.domain}`;
  
  // Generate LNURL for payment (this would need a backend in production)
  // For now, we show the lightning address as the LNURL
  const lnurlData = `lightning:${fullAddress}`;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Scan to Pay</DialogTitle>
          <DialogDescription>
            Send sats to {fullAddress}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          <div className="bg-white p-4 rounded-xl mb-4">
            <QRCodeCanvas 
              value={lnurlData} 
              size={200} 
              level="M"
              className="rounded-lg"
            />
          </div>
          
          <div className="space-y-3 w-full">
            <div className="p-3 rounded-lg bg-background/50 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Lightning Address</p>
              <code className="text-sm font-mono text-primary break-all">
                {fullAddress}
              </code>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  navigator.clipboard.writeText(fullAddress);
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2v0a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Copy
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  navigator.clipboard.writeText(lnurlData);
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Copy LNURL
              </Button>
            </div>
          </div>
          
          {address.nwcConnection && (
            <div className="mt-4 pt-4 border-t border-border/30 w-full text-center">
              <span className="flex items-center justify-center gap-2 text-green-500">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Wallet Connected - Payments will arrive in your linked wallet
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddressCard({ 
  address, 
  onUnlinkNWC,
  onDelete,
  onSetPrimary,
  isPrimary,
  onUpdateNWC
}: { 
  address: LightningAddress;
  onUnlinkNWC: (id: string) => void;
  onDelete: (id: string) => void;
  onSetPrimary: (id: string) => void;
  isPrimary: boolean;
  onUpdateNWC: (id: string, nwc: string) => void;
}) {
  const [showNWCInput, setShowNWCInput] = useState(false);
  const [nwcString, setNWCString] = useState('');
  const [showQRDialog, setShowQRDialog] = useState(false);
  const fullAddress = `${address.username}@${address.domain}`;
  
  const handleLinkNWC = () => {
    if (nwcString.trim()) {
      onUpdateNWC(address.id, nwcString);
      setShowNWCInput(false);
      setNWCString('');
    }
  };

  return (
    <>
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <code className="text-xl font-mono font-semibold text-foreground truncate">
                  {fullAddress}
                </code>
                {isPrimary && (
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    Primary
                  </Badge>
                )}
              </div>
              
              {address.alias && (
                <p className="text-sm text-muted-foreground mb-2">
                  Also known as: {address.alias}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-sm">
                {address.nwcConnection ? (
                  <span className="flex items-center gap-1.5 text-green-500">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Wallet Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    No wallet linked
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowQRDialog(true)}
                className="border-primary/30 hover:bg-primary/10"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                QR
              </Button>
              
              {!isPrimary && address.nwcConnection && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSetPrimary(address.id)}
                  className="border-primary/30 hover:bg-primary/10"
                >
                  Primary
                </Button>
              )}
              
              {address.nwcConnection ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUnlinkNWC(address.id)}
                  className="border-destructive/30 hover:bg-destructive/10 text-destructive"
                >
                  Unlink
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => setShowNWCInput(!showNWCInput)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Link Wallet
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onDelete(address.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Delete
              </Button>
            </div>
          </div>
          
          {showNWCInput && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="nostr+walletconnect://..."
                  value={nwcString}
                  onChange={(e) => setNWCString(e.target.value)}
                  className="flex-1 bg-background/50 border-border/50 font-mono"
                />
                <Button 
                  onClick={handleLinkNWC}
                  disabled={!nwcString.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  Connect
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  Paste your NWC connection string from Alby, Wallet of Satoshi, or other NIP-98 compatible wallet
                </p>
                <NWCHelpDialog
                  trigger={
                    <button className="text-xs text-primary hover:underline">
                      How to get NWC?
                    </button>
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <QRCodeDialog 
        address={address}
        open={showQRDialog}
        onOpenChange={setShowQRDialog}
      />
    </>
  );
}

function CreateAddressDialog({ 
  open, 
  onOpenChange,
  onCreate 
}: { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (username: string) => Promise<void>;
}) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { DEFAULT_DOMAIN } = useLightningAddressInternal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await onCreate(username.trim());
      setUsername('');
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setUsername('');
      setError(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Lightning Address</DialogTitle>
          <DialogDescription>
            Choose a unique username for your {DEFAULT_DOMAIN} address
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="username"
                type="text"
                placeholder="choose-username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                className="flex-1 bg-background/50 border-border/50 font-mono text-lg"
                autoComplete="off"
              />
              <span className="text-muted-foreground font-mono text-sm whitespace-nowrap">
                @{DEFAULT_DOMAIN}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Only lowercase letters, numbers, and hyphens. Must start and end with a letter or number.
            </p>
          </div>
          
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!username.trim() || isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Creating...' : 'Create Address'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-warm mb-6">
        <svg 
          className="w-10 h-10 text-primary" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M13 10V3L4 14h7v7l9-11h-7z" 
          />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold mb-3">
        No Lightning Addresses Yet
      </h2>
      
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Create your first lightning address to start receiving payments instantly via Nostr.
      </p>
      
      <Button 
        onClick={onCreateClick}
        size="lg"
        className="bg-primary hover:bg-primary/90 text-primary-foreground glow-orange"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Create Address
      </Button>
    </div>
  );
}

export default function Index() {
  const { toast } = useToast();
  const {
    addresses,
    activeAddress,
    createAddress,
    linkNWC,
    unlinkNWC,
    deleteAddress,
    setPrimary,
  } = useLightningAddressInternal();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useSeoMeta({
    title: 'UnityPay - Lightning Addresses',
    description: 'Create custom lightning addresses and link them to NWC for instant Bitcoin payments via Nostr',
  });

  const handleCreate = async (username: string) => {
    const result = await createAddress(username);
    if (result.success) {
      toast({
        title: 'Address Created',
        description: `Your lightning address ${result.address?.username}@unitypay.cash is ready!`,
      });
    } else {
      throw new Error(result.error || 'Failed to create address');
    }
  };

  const handleUpdateNWC = async (id: string, nwc: string) => {
    await linkNWC(id, nwc);
    toast({
      title: 'Wallet Connected',
      description: 'Your wallet has been linked to this address',
    });
  };

  const handleUnlinkNWC = async (id: string) => {
    await unlinkNWC(id);
    toast({
      title: 'Wallet Unlinked',
      description: 'Your wallet has been disconnected from this address',
    });
  };

  const handleDelete = async (id: string) => {
    await deleteAddress(id);
    toast({
      title: 'Address Deleted',
      description: 'The lightning address has been removed',
    });
  };

  const handleSetPrimary = async (id: string) => {
    await setPrimary(id);
    toast({
      title: 'Primary Address Updated',
      description: 'This address will be used for receiving payments',
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Copied to clipboard',
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent">
                <svg 
                  className="w-5 h-5 text-background" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z" 
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">
                  UnityPay
                </h1>
                <p className="text-xs text-muted-foreground">
                  lightning addresses
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <NWCHelpDialog
                trigger={
                  <Button variant="outline" className="border-border/50">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.002 2.577-.359.021-.717-.008-1.055-.074m0 5.838c-.814.008-1.595.122-2.3.337-1.355.414-2.3 1.682-2.3 3.156 0 1.516 1.164 2.75 2.692 2.988 1.336.208 2.733.208 4.068 0 1.528-.238 2.692-1.472 2.692-2.988 0-1.474-.945-2.742-2.3-3.156-.705-.215-1.486-.33-2.3-.337m0 5.838c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1z" />
                    </svg>
                    <span className="hidden sm:inline">Help</span>
                  </Button>
                }
              />
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">New Address</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {addresses.length === 0 ? (
          <EmptyState onCreateClick={() => setShowCreateDialog(true)} />
        ) : (
          <div className="space-y-6">
            {/* Active Address Banner */}
            {activeAddress && (
              <Card className="border-primary/30 bg-card/50">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Active Lightning Address
                      </p>
                      <code className="text-2xl font-mono font-bold text-primary">
                        {activeAddress.username}@{activeAddress.domain}
                      </code>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(`${activeAddress.username}@${activeAddress.domain}`)}
                        className="border-primary/30 hover:bg-primary/10"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2v0a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Copy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Addresses List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight">
                Your Addresses
              </h2>
              
              <div className="space-y-4">
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    isPrimary={address.isPrimary}
                    onUpdateNWC={handleUpdateNWC}
                    onUnlinkNWC={handleUnlinkNWC}
                    onDelete={handleDelete}
                    onSetPrimary={handleSetPrimary}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 pt-8 border-t border-border/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-card mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Secure</h3>
              <p className="text-sm text-muted-foreground">
                NWC encrypted connections
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-card mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Instant</h3>
              <p className="text-sm text-muted-foreground">
                Receive sats instantly
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-card mb-4">
                <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Nostr</h3>
              <p className="text-sm text-muted-foreground">
                Built on decentralized protocol
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Create Dialog */}
      <CreateAddressDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreate={handleCreate}
      />

      {/* Footer */}
      <footer className="border-t border-border/30 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>UnityPay.cash - Lightning Addresses</p>
            <a 
              href="https://shakespeare.diy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Vibed with Shakespeare
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}