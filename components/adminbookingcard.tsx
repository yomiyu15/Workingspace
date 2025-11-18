// BookingCard.tsx
export function BookingCard({ booking }: { booking: any }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <p><strong>{booking.user_name}</strong> ({booking.email})</p>
      <p>Space: {booking.space}</p>
      <p>Status: {booking.status}</p>
    </div>
  )
}


export function ServiceCard({ service }: { service: any }) {
  return (
    <div className="p-4 bg-white rounded shadow flex justify-between items-center">
      <div>
        <p className="font-semibold">{service.name}</p>
        <p>Price: Br {service.price}</p>
      </div>
      <div>
        <button className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
        <button className="px-3 py-1 bg-red-600 text-white rounded ml-2">Delete</button>
      </div>
    </div>
  )
}
