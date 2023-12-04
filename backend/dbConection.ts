import { MongoClient, Db, Collection } from 'mongodb';

const url:string = 'mongodb://localhost:27018'; 
const dbName:string = 'ManagementApplication';

const client = new MongoClient(url, { });

async function connectToDatabase(): Promise<Db | undefined> {
  let db: Db | undefined;
  try {
   await client.connect();
   console.log('Conexión establecida a MongoDB.');
   db = client.db(dbName);

   //const collection: Collection = db.collection('Task');
    // Ejemplo: Consultar todos los documentos de una colección
  // const result = await collection.find({}).toArray();
   //console.log('Documentos encontrados:', result);
  } catch (error) {
    db = undefined;
    console.error('Error al conectar o realizar operaciones en MongoDB:', error);
  }
  return db;
}

export default connectToDatabase;