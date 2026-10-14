// Memoria temporal viva
let memoriaRadar = [];
let memoriaPreMarket = [];
let ordenPendiente = null; // Nuestro buzón para MetaTrader

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 1. RECIBIR DATOS (De TradingView o de tu Extensión)
    if (req.method === 'POST') {
        const payload = req.body;
        
        // Si TradingView envía un análisis de Pre-Market
        if (payload.tipo === "premarket") {
            const index = memoriaPreMarket.findIndex(item => item.activo === payload.activo);
            if (index !== -1) { memoriaPreMarket[index] = payload; } 
            else { memoriaPreMarket.push(payload); }
            return res.status(200).json({ status: "success", message: "Pre-Market actualizado" });
        } 
        // Si TradingView envía un gatillo de Radar
        else if (payload.tipo === "radar") {
            memoriaRadar.unshift(payload);
            if (memoriaRadar.length > 5) memoriaRadar.pop(); 
            return res.status(200).json({ status: "success", message: "Radar actualizado" });
        }
        // NUEVO: Si tu extensión de Chrome envía una orden de ejecución
        else if (payload.tipo === "ejecucion") {
            ordenPendiente = payload;
            console.log("NostraFX: Nueva orden recibida para MT4/MT5 ->", payload);
            return res.status(200).json({ status: "success", message: "Orden en cola" });
        }
    }

    // 2. ENVIAR DATOS (A tu Extensión o a MetaTrader)
    if (req.method === 'GET') {
        // Si MetaTrader está preguntando si hay órdenes (el EA usa este parámetro)
        if (req.query.source === 'metatrader') {
            const orden = ordenPendiente;
            ordenPendiente = null; // Vaciamos el buzón apenas MT lo lee para no duplicar trades
            return res.status(200).json(orden || { status: "vacio" });
        }
        
        // Respuesta normal para tu extensión de Chrome
        return res.status(200).json({
            radar: memoriaRadar,
            preMarket: memoriaPreMarket.length > 0 ? memoriaPreMarket : [
                { activo: "SISTEMA", sesgo: "COMPRESIÓN", nota: "Esperando sincronización con TradingView..." }
            ]
        });
    }

    return res.status(405).json({ error: "Método no permitido" });
}