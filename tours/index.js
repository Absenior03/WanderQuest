const express = require('express');
const cors = require('cors');
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- AWS DynamoDB Client Initialization ---
const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const docClient = DynamoDBDocumentClient.from(client);
const TOURS_TABLE_NAME = 'WanderQuest-Tours';

// --- API Routes ---

// GET /tours - Retrieve all available tour packages
app.get('/tours', async (req, res) => {
    const params = {
        TableName: TOURS_TABLE_NAME,
        // Projecting only the fields needed for the summary view
        ProjectionExpression: "id, title, destination, basePrice, imageUrl, durationDays"
    };

    try {
        const command = new ScanCommand(params);
        const data = await docClient.send(command);
        res.status(200).json(data.Items);
    } catch (error) {
        console.error("Error fetching all tours:", error);
        res.status(500).json({ error: 'Could not retrieve tours' });
    }
});

// GET /tours/:id - Retrieve full details for a single tour
app.get('/tours/:id', async (req, res) => {
    const params = {
        TableName: TOURS_TABLE_NAME,
        Key: {
            id: req.params.id,
        },
    };

    try {
        const command = new GetCommand(params);
        const data = await docClient.send(command);
        if (data.Item) {
            res.status(200).json(data.Item);
        } else {
            res.status(404).json({ error: 'Tour not found' });
        }
    } catch (error) {
        console.error(`Error fetching tour with id ${req.params.id}:`, error);
        res.status(500).json({ error: 'Could not retrieve tour' });
    }
});


const PORT = process.env.PORT || 4001; // Each service will run on a different port
app.listen(PORT, () => {
    console.log(`Tours Service listening on port ${PORT}`);
});