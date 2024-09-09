const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const connectDb = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
};

export default async function handler(req, res) {
    await connectDb();

    if (req.method === 'GET') {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ error: 'Error retrieving users' });
        }
    } else if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            await User.findByIdAndDelete(id);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Error deleting user' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
