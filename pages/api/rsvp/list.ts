import { NextApiRequest, NextApiResponse } from 'next';

// Mock data (replace with your database logic)
let rsvpData: Array<{
  name: string;
  attending: string;
  message?: string;
}> = [];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // Return the mock data
    res.status(200).json(rsvpData);
  } else if (req.method === 'POST') {
    const { name, attending, message } = req.body;

    if (!name || !attending) {
      return res.status(400).json({ error: 'Name and attendance status are required.' });
    }

    rsvpData.push({ name, attending, message });
    res.status(200).json({ message: 'RSVP added successfully.' });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
