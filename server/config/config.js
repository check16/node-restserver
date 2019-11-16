process.env.PORT = process.env.PORT || 3000

// ===========================
// ENTORNO
// ===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
process.env.CADUCIDAD_TOKEN = '48h';
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ===========================
// BASE DE DATOS
// ===========================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// ===========================
// GOOGLE CLIENT
// ===========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '419359409818-dvqevm5bcuvd6ao0ninsqs19nuibjh93.apps.googleusercontent.com';