import { GoogleGenAI, Type } from "@google/genai";
import { Persona } from "../types";

// Safety check for process.env
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';

// Initialize safely
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateSystemInstruction = (persona: Partial<Persona>): string => {
  return `
PROMPT:
Eres ${persona.name}, una persona (${persona.type}) a la que le van a intentar vender
${persona.productDetails || "un producto"}. Tu rol es el de un ${persona.role} de alto nivel, muy
difícil, escéptico y con tiempo limitado, simulando una interacción de ventas realista y
desafiante.

1. Perfil Básico y Profesional del Prospecto
Tipo de Prospecto: ${persona.type}
Nombre Completo: ${persona.name}
Edad: ${persona.age}
Puesto/Rol: ${persona.role}
Sector de Industria: ${persona.industry}
Tamaño de la Empresa: ${persona.companySize || "N/A"}
Descripción/Personalidad: ${persona.description || "Analytical decision maker"}

2. Oferta de Ventas y Objetivos del Entrenamiento
Detalles del Producto/Servicio (Oferta del Vendedor): ${persona.productDetails}
Objetivos de Entrenamiento: ${persona.trainingObjectives?.join(", ")}
Desafíos/Objeciones Clave: ${persona.challenges?.join(", ")}

3. Marco de Conversación y Directrices de Comportamiento de la IA
Objetividad y Escepticismo: Actúa como un tomador de decisiones analítico y escéptico. No te dejes convencer fácilmente. Exige datos concretos y un claro ROI.
Respuestas Rápidas (Puesta a Prueba): Tus respuestas deben ser concisas. Si el vendedor es ambiguo, interrumpe para pedir clarificación.
Hacer Objeciones (Aposta): Introduce activamente las objeciones clave (${persona.challenges?.join(", ")}). No aceptes un "no" por respuesta a tu objeción.
Presión de Tiempo: Menciona que tienes poco tiempo.

Tipo de Interacción: ${persona.conversationType}
Tu primera respuesta debe incluir una objeción inmediata y una mención a tu falta de tiempo.
`;
};

// Generates a preview JSON just to show the user "Persona Created" details
export const generateDetailedPersona = async (
  formData: Partial<Persona>
): Promise<any> => {
  if (!ai) {
    return {
      name: formData.name || "John Doe",
      company: formData.company || "Acme Corp",
      bio: `A ${formData.age} year old ${formData.role} in the ${formData.industry} industry. ${formData.description}`,
      openingLine: "I only have 5 minutes, so make this count."
    };
  }

  try {
    const prompt = `Based on this data: ${JSON.stringify(formData)}, create a brief 2-sentence bio and a cold, skeptical opening line for a sales call.
    Return JSON: { bio, openingLine }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                bio: { type: Type.STRING },
                openingLine: { type: Type.STRING }
            }
        }
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini generation error:", error);
    // Fallback
    return {
        bio: "Generated persona ready for simulation.",
        openingLine: "I'm listening, but I'm skeptical."
    };
  }
};

export const getCoachingTips = async (performanceData: any): Promise<string[]> => {
  if (!ai) {
     return [
       "Ask more open-ended questions to uncover pain points.",
       "Acknowledge the objection before pivoting to the solution.",
       "Quantify the value proposition earlier in the call."
     ];
  }

  try {
    const prompt = `Analyze this sales performance data and give 3 short, punchy, actionable bullet points for improvement.
    Data: ${JSON.stringify(performanceData)}
    
    Output format: JSON Array of strings.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
      console.error("Coaching generation error", error);
      return ["Error generating tips."];
  }
}