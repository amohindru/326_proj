import express from 'express';
import bodyParser from 'body-parser';
import PouchDB from 'pouchdb';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const db = new PouchDB('http://localhost:5984/foodshare');
const GOOGLE_MAPS_API_KEY = 'AIzaSyD4GpAyh_HLnQ_qW2Vdf8_RhPqmHTCFHX4';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));

/**
 * get nearby food banks using the location and distance parameters
 * @route GET /api/results
 * @param {string} req.query.location - location to search for
 * @param {number} req.query.maxDistance - max distance to search for a food bank within
 * @returns {Object[]} 200 - array of food bank results
 * @returns {Error} 500 - server error
 */
app.get('/api/results', async (req, res) => {
    const { location, maxDistance } = req.query;
    try {
      const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_MAPS_API_KEY}`);
      const geocodeData = await geocodeResponse.json();
      const { lat, lng } = geocodeData.results[0].geometry.location;
  
      const placesResponse = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${maxDistance * 1609.34}&keyword=food bank&key=${GOOGLE_MAPS_API_KEY}`);
      const placesData = await placesResponse.json();
  
      const results = placesData.results.map(place => ({
        name: place.name,
        address: place.vicinity,
        place_id: place.place_id
      }));
  
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

/**
 * adds new result to database
 * @route POST /api/results
 * @param {Object} req.body - result to add
 * @returns {Object} 200 - added result
 * @returns {Error} 500 - server error
 */
app.post('/api/results', async (req, res) => {
    try {
      const result = req.body;
      const response = await db.put(result);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

/**
 * update a result in the database
 * @route PUT /api/results/:id
 * @param {string} req.params.id - ID of result to update
 * @param {Object} req.body - the updated result data
 * @returns {Object} 200 - the updated result
 * @returns {Error} 500 - server error
 */
app.put('/api/results/:id', async (req, res) => {
    try {
      const result = req.body;
      const response = await db.put(result);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

/**
 * deletes result from database
 * @route DELETE /api/results/:id
 * @param {string} req.params.id - ID of the result to delete
 * @returns {Object} 200 - the deletion response
 * @returns {Error} 500 - server error
 */
app.delete('/api/results/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await db.get(id);
      const response = await db.remove(result);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

//port is set up to host server for application
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});