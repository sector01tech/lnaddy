import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NWCHelpDialogProps {
  trigger?: React.ReactNode;
}

export function NWCHelpDialog({ trigger }: NWCHelpDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.002 2.577-.359.021-.717-.008-1.055-.074m0 5.838c-.814.008-1.595.122-2.3.337-1.355.414-2.3 1.682-2.3 3.156 0 1.516 1.164 2.75 2.692 2.988 1.336.208 2.733.208 4.068 0 1.528-.238 2.692-1.472 2.692-2.988 0-1.474-.945-2.742-2.3-3.156-.705-.215-1.486-.33-2.3-.337m0 5.838c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1z" />
            </svg>
            Help
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Connect Your Lightning Wallet</DialogTitle>
          <DialogDescription>
            Link your wallet to receive payments sent to your lightning address
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="albyhub" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="albyhub">Alby Hub ⚡</TabsTrigger>
            <TabsTrigger value="alby">Alby Extension</TabsTrigger>
          </TabsList>

          <TabsContent value="albyhub" className="space-y-4">
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold text-lg">
                    ⚡
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Alby Hub</h4>
                    <p className="text-xs text-muted-foreground">Free Lightning wallet with NWC</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto bg-green-500/20 text-green-400">Recommended</Badge>
                </div>

                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-sm text-green-400">
                    Alby Hub provides a free Lightning wallet with built-in NWC support. Perfect for receiving payments to your UnityPay address!
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="text-sm font-medium">How to connect Alby Hub:</h5>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">1.</span>
                      <span>Go to <strong className="text-foreground">hub.getalby.com</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">2.</span>
                      <span>Create an account or log in</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">3.</span>
                      <span>Click <strong className="text-foreground">Settings</strong> ⚙️</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">4.</span>
                      <span>Click <strong className="text-foreground">Advanced</strong> → <strong className="text-foreground">Nostr Wallet Connect</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">5.</span>
                      <span>Click <strong className="text-foreground">Create Connection</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">6.</span>
                      <span>Copy the <strong className="text-foreground">nostr+walletconnect://...</strong> string</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('https://hub.getalby.com', '_blank')}
                    >
                      Open Alby Hub
                      <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-border/30">
                  <h5 className="text-sm font-medium">Getting your first sats:</h5>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">1.</span>
                      <span>In Alby Hub, go to <strong className="text-foreground">Bitcoin</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">2.</span>
                      <span>Click <strong className="text-foreground">Get Bitcoin</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">3.</span>
                      <span>Use a faucet or buy with fiat to fund your wallet</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alby" className="space-y-4">
            <Card className="border-border/50 bg-background/50">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <h4 className="font-semibold">Alby Extension</h4>
                    <p className="text-xs text-muted-foreground">Browser extension</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="text-sm font-medium">How to get your NWC connection:</h5>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">1.</span>
                      <span>Open Alby extension</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">2.</span>
                      <span>Go to <strong className="text-foreground">Settings</strong> → <strong className="text-foreground">Developer</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">3.</span>
                      <span>Click <strong className="text-foreground">Nostr Wallet Connect</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">4.</span>
                      <span>Click <strong className="text-foreground">Create Connection</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">5.</span>
                      <span>Copy the <strong className="text-foreground">nostr+walletconnect://...</strong> string</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('https://getalby.com', '_blank')}
                    >
                      Get Alby Extension
                      <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/30">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Security Tip
          </h4>
          <p className="text-sm text-muted-foreground">
            Your NWC connection string is like a password. Never share it publicly - anyone with this string can spend from your wallet.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}