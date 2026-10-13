// Memoria temporal en el servidor
let memoriaRadar = [];

export default function handler(req, res) {
    // Configuración de seguridad (CORS) para permitir que la extensión lea los datos
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const tvData = req.body;
        
        // Aquí Vercel traduce el dato crudo de TradingView al análisis institucional
        const nuevaAlerta = {
            activo: tvData.activo || "Desconocido",
            sesion: tvData.sesion || "Activa",
            ventanaHoraria: new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' }) + " EST",
            proyeccion: "Gatillo de ejecución inminente",
            contexto: tvData.contexto || "Convergencia de zonas detectada.",
            estructura: tvData.estructura || "Patrón detectado",
            emas: tvData.emas || "Rompimiento confirmado",
            rvol: "Calculando...", // En la Fase 2 conectaremos esto a una API de volumen
            distanciaLiquidez: "Pendiente",
            filtroMacro: "Monitoreo Activo",
            recomendacion: tvData.direccion === "LONG" ? "Buscar compras al retroceso." : "Buscar ventas direccionales."
        };

        // Guardamos la alerta en la primera posición
        memoriaRadar.unshift(nuevaAlerta);
        
        // Mantenemos solo las últimas 5 alertas para no saturar el widget
        if (memoriaRadar.length > 5) memoriaRadar.pop();

        console.log("Alerta recibida desde TradingView:", nuevaAlerta.activo);
        return res.status(200).json({ status: "success", message: "Alerta registrada en Vercel" });
    }

    return res.status(405).json({ error: "Método no permitido" });
}