"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const url = 'mongodb://localhost:27018';
const dbName = 'ManagementApplication';
const client = new mongodb_1.MongoClient(url, {});
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        let db;
        try {
            yield client.connect();
            console.log('Conexión establecida a MongoDB.');
            db = client.db(dbName);
            //const collection: Collection = db.collection('Task');
            // Ejemplo: Consultar todos los documentos de una colección
            // const result = await collection.find({}).toArray();
            //console.log('Documentos encontrados:', result);
        }
        catch (error) {
            db = undefined;
            console.error('Error al conectar o realizar operaciones en MongoDB:', error);
        }
        return db;
    });
}
exports.default = connectToDatabase;
