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

        <Tabs defaultValue="alby" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="alby">Alby</TabsTrigger>
            <TabsTrigger value="wos">Wallet of Satoshi</TabsTrigger>
            <TabsTrigger value="zeus">Zeus</TabsTrigger>
          </TabsList>

          <TabsContent value="alby" className="space-y-4">
            <Card className="border-border/50 bg-background/50">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <h4 className="font-semibold">Alby</h4>
                    <p className="text-xs text-muted-foreground">Browser extension & mobile</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto">Popular</Badge>
                </div>

                <div className="space-y-3">
                  <h5 className="text-sm font-medium">How to get your NWC connection:</h5>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">1.</span>
                      <span>Open Alby extension or app</span>
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
                      Open Alby Website
                      <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wos" className="space-y-4">
            <Card className="border-border/50 bg-background/50">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    W
                  </div>
                  <div>
                    <h4 className="font-semibold">Wallet of Satoshi</h4>
                    <p className="text-xs text-muted-foreground">Mobile app (iOS & Android)</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="text-sm font-medium">How to get your NWC connection:</h5>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">1.</span>
                      <span>Open Wallet of Satoshi app</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">2.</span>
                      <span>Tap <strong className="text-foreground">Settings</strong> (gear icon)</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">3.</span>
                      <span>Tap <strong className="text-foreground">Nostr Wallet Connect</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">4.</span>
                      <span>Tap <strong className="text-foreground">Add Connection</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">5.</span>
                      <span>Tap <strong className="text-foreground">Copy</strong> to copy the connection string</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('https://walletofsatoshi.com', '_blank')}
                    >
                      Open Wallet of Satoshi
                      <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="zeus" className="space-y-4">
            <Card className="border-border/50 bg-background/50">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold">
                    Z
                  </div>
                  <div>
                    <h4 className="font-semibold">Zeus Node</h4>
                    <p className="text-xs text-muted-foreground">Mobile app (iOS & Android)</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="text-sm font-medium">How to get your NWC connection:</h5>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">1.</span>
                      <span>Open Zeus app and go to your node</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">2.</span>
                      <span>Tap the <strong className="text-foreground">menu</strong> (three dots)</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">3.</span>
                      <span>Tap <strong className="text-foreground">Connect App</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-mono text-xs">4.</span>
                      <span>Tap <strong className="text-foreground">Create App</strong> to generate new credentials</span>
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
                      onClick={() => window.open('https://zeusln.com', '_blank')}
                    >
                      Open Zeus Website
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