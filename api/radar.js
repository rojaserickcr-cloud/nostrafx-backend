import { memoriaRadar, memoriaPreMarket } from './webhook.js';

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        // Enviamos la memoria real a la extensión de Chrome
        return res.status(200).json({
            radar: memoriaRadar || [],
            // Si TradingView aún no ha enviado alertas, mostramos un mensaje de espera
            preMarket: memoriaPreMarket.length > 0 ? memoriaPreMarket : [
                { 
                    activo: "SISTEMA", 
                    sesgo: "COMPRESIÓN", 
                    nota: "Esperando sincronización con TradingView al cierre de vela..." 
                }
            ]
        });
    }

    return res.status(405).json({ error: "Método no permitido" });
}