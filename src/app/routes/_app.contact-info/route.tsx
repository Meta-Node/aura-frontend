'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import DefaultHeader from '@/components/Header/DefaultHeader';

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone: string) => /^\+?[1-9]\d{1,14}$/.test(phone);

type Contact = {
  type: 'email' | 'phone';
  value: string;
};

export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [type, setType] = useState<'email' | 'phone'>('email');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (type === 'email' && !isValidEmail(value)) {
      setError('Invalid email address');
      return;
    }
    if (type === 'phone' && !isValidPhone(value)) {
      setError('Invalid phone number');
      return;
    }

    setContacts([...contacts, { type, value }]);
    setValue('');
    setError('');
  };

  return (
    <>
      <DefaultHeader title="Trusted Contacts" />
      <div className="space-y-4 p-4 text-sm dark:text-white">
        <p>
          Add trusted contacts (email or phone). These are stored securely using
          hashed values, so your contacts remain private. This helps relatives
          find you safely in the app.
        </p>

        <div className="flex flex-col gap-2">
          {contacts.map((c, i) => (
            <Card
              key={i}
              className="flex items-center justify-between p-4 text-sm"
            >
              <span className="capitalize">{c.type}:</span>
              <span>{c.value}</span>
            </Card>
          ))}
        </div>
      </div>

      {/* Floating Action Button and Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="h-12 bg-primary/60 p-0 text-black hover:bg-primary/90"
            variant="default"
          >
            <Plus size={24} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[320px]">
          <DialogHeader>
            <DialogTitle>Add Contact Information</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                variant={type === 'email' ? 'default' : 'outline'}
                onClick={() => {
                  setType('email');
                  setError('');
                }}
              >
                Email
              </Button>
              <Button
                variant={type === 'phone' ? 'default' : 'outline'}
                onClick={() => {
                  setType('phone');
                  setError('');
                }}
              >
                Phone
              </Button>
            </div>

            <div className="space-y-1">
              <Label htmlFor="value">
                {type === 'email' ? 'Email Address' : 'Phone Number'}
              </Label>
              <Input
                id="value"
                placeholder={
                  type === 'email' ? 'you@example.com' : '+1234567890'
                }
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError('');
                }}
              />
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>

            <Button onClick={handleAdd} className="w-full">
              Save Contact
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
