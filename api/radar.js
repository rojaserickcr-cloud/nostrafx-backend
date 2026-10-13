// Memoria temporal (Se mantiene viva mientras Vercel esté "caliente")
let memoriaRadar = [];
let memoriaPreMarket = [];

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 1. RECIBIR DATOS (Cuando TradingView dispara la alerta)
    if (req.method === 'POST') {
        const payload = req.body;
        
        if (payload.tipo === "premarket") {
            const index = memoriaPreMarket.findIndex(item => item.activo === payload.activo);
            if (index !== -1) {
                memoriaPreMarket[index] = payload;
            } else {
                memoriaPreMarket.push(payload);
            }
            return res.status(200).json({ status: "success", message: "Pre-Market actualizado" });
        } 
        else if (payload.tipo === "radar") {
            memoriaRadar.unshift(payload);
            if (memoriaRadar.length > 5) memoriaRadar.pop(); // Guarda los últimos 5 gatillos
            return res.status(200).json({ status: "success", message: "Radar actualizado" });
        }
    }

    // 2. ENVIAR DATOS (Cuando tu Extensión de Chrome consulta)
    if (req.method === 'GET') {
        return res.status(200).json({
            radar: memoriaRadar,
            preMarket: memoriaPreMarket.length > 0 ? memoriaPreMarket : [
                { activo: "SISTEMA", sesgo: "COMPRESIÓN", nota: "Esperando sincronización con TradingView..." }
            ]
        });
    }

    return res.status(405).json({ error: "Método no permitido" });
}