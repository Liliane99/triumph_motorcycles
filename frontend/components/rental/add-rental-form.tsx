import { useState } from 'react';
import { createRental } from '@/lib/apiExpress'; 

const RentalForm = () => {
  const [reference, setReference] = useState('');
  const [rentalDate, setRentalDate] = useState('');
  const [price, setPrice] = useState(0);
  const [motorcycleId, setMotorcycleId] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rentalData = {
      reference,
      rentalDate,
      price,
      motorcycleId,
      ownerId: 'userId_from_token', 
    };

    try {
      await createRental(rentalData, token);
      alert('Location créée avec succès!');
    } catch (error) {
      alert('Erreur lors de la création de la location.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Référence"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
      />
      <input
        type="date"
        value={rentalDate}
        onChange={(e) => setRentalDate(e.target.value)}
      />
      <input
        type="number"
        placeholder="Prix"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />
      <input
        type="text"
        placeholder="ID Moto"
        value={motorcycleId}
        onChange={(e) => setMotorcycleId(e.target.value)}
      />
      <button type="submit">Créer une Location</button>
    </form>
  );
};

export default RentalForm;
