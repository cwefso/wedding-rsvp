import { useEffect, useState } from "react";

interface RSVP {
  name: string;
  attending: string;
  message?: string;
}

export default function RsvpList() {
  const [rsvpList, setRsvpList] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRsvps = async () => {
      try {
        const res = await fetch("/api/rsvp/list");
        if (!res.ok) {
          throw new Error("Failed to fetch RSVP data.");
        }
        const data: RSVP[] = await res.json();
        setRsvpList(data);
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchRsvps();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Loading RSVPs...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          RSVP List
        </h1>
        {rsvpList.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Attending
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Message
                </th>
              </tr>
            </thead>
            <tbody>
              {rsvpList.map((rsvp, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {rsvp.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {rsvp.attending === "yes" ? "Yes" : "No"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {rsvp.message || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center mt-8 text-gray-600">No RSVPs yet.</p>
        )}
      </div>
    </div>
  );
}
