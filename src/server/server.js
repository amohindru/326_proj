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



