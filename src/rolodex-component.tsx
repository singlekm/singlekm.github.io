import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const initialContacts = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-555-5555' },
];

const Rolodex = () => {
  const [contacts, setContacts] = useState(initialContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState({ id: null, name: '', email: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (contact = null) => {
    if (contact) {
      setCurrentContact(contact);
      setIsEditing(true);
    } else {
      setCurrentContact({ id: Date.now(), name: '', email: '', phone: '' });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentContact({ id: null, name: '', email: '', phone: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentContact(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveContact = () => {
    if (isEditing) {
      setContacts(contacts.map(c => c.id === currentContact.id ? currentContact : c));
    } else {
      setContacts([...contacts, currentContact]);
    }
    handleCloseDialog();
  };

  const handleDeleteContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Contact Rolodex</h1>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow bg-gray-200 text-gray-800 placeholder-gray-500"
        />
        <Button onClick={() => handleOpenDialog()} className="bg-gray-700 text-white hover:bg-gray-600">
          Add Contact
        </Button>
      </div>
      <div className="space-y-4">
        {filteredContacts.map(contact => (
          <Card key={contact.id} className="bg-gray-300 shadow-md">
            <CardHeader className="font-bold text-gray-800">{contact.name}</CardHeader>
            <CardContent className="text-gray-700">
              <p>Email: {contact.email}</p>
              <p>Phone: {contact.phone}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button onClick={() => handleOpenDialog(contact)} className="bg-gray-500 text-white hover:bg-gray-400">
                Edit
              </Button>
              <Button onClick={() => handleDeleteContact(contact.id)} className="bg-gray-700 text-white hover:bg-gray-600">
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-200">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-700">Name</Label>
              <Input id="name" name="name" value={currentContact.name} onChange={handleInputChange} className="bg-gray-100" />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input id="email" name="email" value={currentContact.email} onChange={handleInputChange} className="bg-gray-100" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-700">Phone</Label>
              <Input id="phone" name="phone" value={currentContact.phone} onChange={handleInputChange} className="bg-gray-100" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCloseDialog} className="bg-gray-500 text-white hover:bg-gray-400">Cancel</Button>
            <Button onClick={handleSaveContact} className="bg-gray-700 text-white hover:bg-gray-600">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rolodex;
