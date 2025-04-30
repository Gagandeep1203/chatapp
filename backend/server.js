const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); // Required for Socket.IO
const { Server } = require("socket.io"); // Import Server from socket.io
const mongoose = require('mongoose'); // Import mongoose
const jwt = require('jsonwebtoken'); // Import JWT
const User = require('./models/User'); // Import User model

// Load environment variables
dotenv.config();

// --- Database Connection ---
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Mongoose 6+ options are default, no need for useNewUrlParser, etc.
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

connectDB(); // Connect to database
// --------------------------

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, { // Initialize Socket.IO
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000", // Use env variable or default
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Basic route
app.get('/', (req, res) => {
    res.send('Chat App Backend Running');
});

// --- API Routes ---
app.use('/api/auth', require('./routes/authRoutes')); // Mount auth routes
// ------------------

// --- Socket.IO Logic ---
let onlineUsers = {}; // Store user info: { userId: { username, socketId } }

const verifyTokenAndGetUser = async (token) => {
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id).select('username'); // Fetch username
        return user;
    } catch (err) {
        console.error("Socket token verification failed:", err.message);
        return null;
    }
};

io.on('connection', (socket) => {
    console.log('Connection attempt with socket ID:', socket.id);

    // User sends token upon connection to identify themselves
    socket.on('authenticate', async (token) => {
        const user = await verifyTokenAndGetUser(token);
        if (user) {
            console.log(`User ${user.username} (${user._id}) authenticated with socket ${socket.id}`);
            // Store user info associated with this socket
            socket.user = user; // Attach user object to socket instance
            onlineUsers[user._id] = { username: user.username, socketId: socket.id };

            // Send current online users list to the newly connected user
            socket.emit('update user list', Object.values(onlineUsers).map(u => u.username));

            // Broadcast updated user list to everyone else
            socket.broadcast.emit('update user list', Object.values(onlineUsers).map(u => u.username));

        } else {
            console.log('Socket authentication failed:', socket.id);
            // Optional: disconnect socket if authentication fails
            // socket.disconnect();
        }
    });

    socket.on('disconnect', () => {
        if (socket.user) {
            console.log(`User ${socket.user.username} disconnected:`, socket.id);
            delete onlineUsers[socket.user._id];
            // Broadcast updated user list
            io.emit('update user list', Object.values(onlineUsers).map(u => u.username));
        } else {
            console.log('Unknown user disconnected:', socket.id);
        }
    });

    // Handle chat messages
    socket.on('chat message', (msgContent) => {
        // Only process message if user is authenticated (associated with socket)
        if (socket.user && msgContent) {
            console.log(`Message from ${socket.user.username}: ${msgContent}`);
            // Broadcast message with sender's username
            io.emit('chat message', { 
                username: socket.user.username,
                content: msgContent,
                timestamp: new Date()
            });
            // TODO: Save message to database here (optional)
        } else {
             console.log("Unauthenticated message attempt or empty message ignored.");
        }
    });
});
// -----------------------

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => { // Use server.listen instead of app.listen
    console.log(`Server running on port ${PORT}`);
});

// Add basic error handling (optional but good practice)
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
}); 