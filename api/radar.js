// Importamos la memoria temporal (en un entorno de producción avanzado usaríamos una base de datos)
import { memoriaRadar } from './webhook.js';

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        return res.status(200).json({
            radar: memoriaRadar || [],
            // Aquí centralizamos tu Watchlist para que el domingo solo actualices Vercel 
            // y automáticamente se refleje en todos los widgets instalados.
            preMarket: [
                { activo: "EURUSD", sesgo: "BAJISTA", nota: "Cerró bajo EMA 50. Continuación probable hacia PDC." },
                { activo: "NAS100", sesgo: "COMPRESIÓN", nota: "Inside Week confirmada. Esperar rompimiento direccional." },
                { activo: "XAUUSD", sesgo: "ALCISTA", nota: "Rechazó bajo mensual. Buscando liquidez superior." }
                // La lista completa se cargará aquí
            ]
        });
    }

    return res.status(405).json({ error: "Método no permitido" });
}