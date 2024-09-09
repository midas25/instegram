// api/login.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      await client.connect();
      const db = client.db('your-database-name');
      const collection = db.collection('users');

      const newUser = { username, password };
      await collection.insertOne(newUser);

      res.status(200).send('User saved successfully!');
    } catch (error) {
      res.status(500).send('Error saving user');
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
