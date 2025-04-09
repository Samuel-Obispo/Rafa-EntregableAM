// Colección de consejos sobre el cuidado de parcelas agrícolas
export const farmingTips = [
    "Rota tus cultivos para prevenir el agotamiento de nutrientes específicos del suelo y reducir plagas.",
    "Implementa sistemas de riego por goteo para ahorrar hasta un 60% de agua en comparación con métodos tradicionales.",
    "Analiza el pH del suelo regularmente. La mayoría de cultivos prefieren un pH entre 6.0 y 7.0.",
    "Utiliza cultivos de cobertura en temporadas de descanso para prevenir la erosión y mejorar la estructura del suelo.",
    "Instala estaciones meteorológicas en tus parcelas para tomar decisiones basadas en datos precisos.",
    "Mantén registros detallados de rendimientos, tratamientos y condiciones climáticas para optimizar futuras temporadas.",
    "Considera implementar técnicas de agricultura de precisión para aplicar insumos solo donde se necesitan.",
    "Establece barreras vegetales para reducir la erosión por viento y crear microclimas favorables.",
    "Monitorea regularmente la presencia de plagas y enfermedades para intervenir tempranamente.",
    "Incorpora materia orgánica al suelo para mejorar su estructura y capacidad de retención de agua.",
    "Calibra tus equipos de aplicación de fertilizantes y pesticidas para evitar desperdicios y contaminación.",
    "Implementa prácticas de labranza mínima para preservar la estructura del suelo y reducir la erosión.",
    "Utiliza cultivos trampa para atraer plagas lejos de tus cultivos principales.",
    "Mantén zonas de biodiversidad cerca de tus parcelas para fomentar la presencia de polinizadores y depredadores naturales.",
    "Ajusta los horarios de riego según las condiciones climáticas para maximizar la eficiencia del agua.",
    "Considera el uso de sensores de humedad del suelo para optimizar los ciclos de riego.",
    "Aplica compost para mejorar la estructura del suelo y aumentar la actividad microbiana beneficiosa.",
    "Implementa control biológico de plagas utilizando insectos beneficiosos como mariquitas o avispas parasitoides.",
    "Establece calendarios de siembra basados en datos históricos climáticos de tu región.",
    "Utiliza variedades de cultivos adaptadas a las condiciones específicas de tu zona.",
    "Mantén limpios y calibrados los sistemas de riego para evitar obstrucciones y garantizar una distribución uniforme.",
    "Considera la instalación de cortavientos para proteger cultivos sensibles y reducir la evaporación.",
    "Implementa técnicas de cosecha de agua de lluvia para reducir la dependencia de fuentes externas.",
    "Realiza análisis de suelo anuales para ajustar tus planes de fertilización.",
    "Utiliza herramientas digitales y aplicaciones para monitorear el desarrollo de tus cultivos.",
  ]
  
  // Función para obtener un consejo aleatorio
  export function getRandomTip(): string {
    const randomIndex = Math.floor(Math.random() * farmingTips.length)
    return farmingTips[randomIndex]
  }
  
  // Función para obtener un consejo basado en la temporada actual
  export function getSeasonalTip(): string {
    const month = new Date().getMonth()
  
    // Consejos específicos por temporada (ajustar según hemisferio y región)
    if (month >= 2 && month <= 4) {
      // Primavera
      return "En primavera, monitorea la aparición temprana de plagas que despiertan con el aumento de temperatura."
    } else if (month >= 5 && month <= 7) {
      // Verano
      return "Durante el verano, ajusta los horarios de riego para evitar pérdidas por evaporación. Riega temprano en la mañana o al atardecer."
    } else if (month >= 8 && month <= 10) {
      // Otoño
      return "El otoño es ideal para tomar muestras de suelo y planificar enmiendas para la próxima temporada."
    } else {
      // Invierno
      return "Aprovecha el invierno para mantener y reparar sistemas de riego, maquinaria y estructuras de la parcela."
    }
  }
  
  // Función para obtener un consejo basado en condiciones climáticas
  export function getWeatherBasedTip(temperature: number, humidity: number): string {
    if (temperature > 30 && humidity < 40) {
      return "Con altas temperaturas y baja humedad, considera aumentar la frecuencia de riego y aplicar mulch para conservar la humedad del suelo."
    } else if (humidity > 80) {
      return "Con alta humedad, vigila la aparición de enfermedades fúngicas. Mejora la ventilación entre plantas si es posible."
    } else if (temperature < 10) {
      return "Con temperaturas bajas, protege cultivos sensibles con cubiertas o túneles y reduce la frecuencia de riego."
    } else {
      return getRandomTip()
    }
  }
  