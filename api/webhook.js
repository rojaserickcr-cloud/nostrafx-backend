// Memoria temporal del servidor
export let memoriaPreMarket = [];
export let memoriaRadar = [];

export default function handler(req, res) {
    // Permisos de seguridad CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        // Atrapamos el JSON que envía TradingView
        const payload = req.body;
        
        // 1. Si es una alerta de Pre-Market (la que acabamos de crear)
        if (payload.tipo === "premarket") {
            // Buscamos si el activo ya existe en la memoria para actualizarlo (no duplicarlo)
            const index = memoriaPreMarket.findIndex(item => item.activo === payload.activo);
            
            if (index !== -1) {
                memoriaPreMarket[index] = payload; // Actualiza el existente
            } else {
                memoriaPreMarket.push(payload); // Agrega uno nuevo
            }
            
            console.log(`NostraFX: Pre-Market actualizado -> ${payload.activo}`);
            return res.status(200).json({ status: "success", message: "Pre-Market actualizado" });
        } 
        
        // 2. Si es una alerta de Radar (Ejecución rápida intradía - Fase 2)
        else {
            memoriaRadar.unshift(payload);
            if (memoriaRadar.length > 5) memoriaRadar.pop(); // Mantiene solo los últimos 5 gatillos
            
            console.log(`NostraFX: Radar actualizado -> ${payload.activo}`);
            return res.status(200).json({ status: "success", message: "Radar actualizado" });
        }
    }

    return res.status(405).json({ error: "Método no permitido" });
}