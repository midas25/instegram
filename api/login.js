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

    if (req.method === 'POST') {
        const { username, password } = req.body;
        const newUser = new User({ username, password });

        try {
            await newUser.save();
            res.status(200).send('User saved successfully!');
        } catch (err) {
            res.status(500).send('Error saving user');
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
ㅅ