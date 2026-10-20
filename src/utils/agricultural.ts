/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Manual Digital Agrícola de Sopachuy - Módulo de Lógica Agrícola
 * Autor: Claudio Jimenez Aramayo (6to A, Sistemas Informáticos)
 * Ubicación: Sopachuy, Chuquisaca, Bolivia
 */

export interface CropItem {
  id: string;
  category: 'cultivo';
  name: string;
  quechuaName?: string;
  variety: string;
  sowingPeriod: string;
  harvestPeriod: string;
  soilManagement: string;
  organicManure: string;
  irrigation: string;
  generalCare: string;
  valleyTips: string;
  iconName: string;
  image?: string;
}

export interface PestItem {
  id: string;
  category: 'plaga';
  name: string;
  scientificName?: string;
  targetCrops: string;
  symptoms: string;
  preventiveControl: string;
  correctiveControl: string;
  organicRecipe: string;
  iconName: string;
  image?: string;
}

export interface LunarPhaseInfo {
  fase: string;
  icono: string;
  influencia: string;
  recomendacionAndina: string;
}

export interface CalendarEvent {
  id: string;
  month: number; // 1 = Enero, 12 = Diciembre
  monthName: string;
  title: string;
  crops: string[];
  tasks: string[];
  valleyWeatherNote: string;
  quechuaSeason?: string;
  faseLunar: LunarPhaseInfo;
}

export interface InitialData {
  crops: CropItem[];
  pests: PestItem[];
  calendarEvents: CalendarEvent[];
}

export const INITIAL_DATA: InitialData = {
  crops: [
    {
      id: "cultivo-1",
      category: "cultivo",
      name: "Papa",
      quechuaName: "Papa / Ch'oqe",
      variety: "Variedad Imilla (Blanca y Negra)",
      sowingPeriod: "Octubre - Noviembre (Inicio de lluvias de valle)",
      harvestPeriod: "Marzo - Abril (Cosecha principal 'Aymoray')",
      soilManagement: "Suelo franco y bien mullido con arado profundo (25-30 cm). Realizar aporque alto cuando la planta alcance 20-25 cm para proteger los tubérculos del sol y la polilla.",
      organicManure: "Abono de estiércol fermentado de ovino o bovino (5 a 8 t/ha) mezclado con ceniza vegetal para aportar potasio y mejorar la resistencia.",
      irrigation: "Riego por surcos cada 7 a 10 días durante la fase vegetativa. Suspender el riego 15 días antes de la cosecha para curar la piel.",
      generalCare: "Monitoreo permanente de tizón tardío tras lluvias prolongadas y deshierbe manual oportuno antes de la floración.",
      valleyTips: "En el valle de Sopachuy, sembrar en parcelas con buen drenaje para evitar encharcamientos en las laderas.",
      iconName: "Sprout"
    },
    {
      id: "cultivo-2",
      category: "cultivo",
      name: "Maíz",
      quechuaName: "Sara",
      variety: "Variedad Choclero y Blanco Criollo",
      sowingPeriod: "Septiembre - Octubre (Siembra 'Mishka' temprana bajo riego)",
      harvestPeriod: "Febrero - Marzo (Choclo tierno) y Mayo (Grano seco)",
      soilManagement: "Suelos profundos, fértiles y con buen contenido de materia orgánica. Surcado a 80 cm entre hileras y 30 cm entre plantas.",
      organicManure: "Incorporación de compost maduro y aplicaciones foliares de biol cada 15 días hasta el espigado.",
      irrigation: "Riego crítico en germinación, floración femenina (aparición de pelos de choclo) y llenado de grano.",
      generalCare: "Aporque preventivo contra el acame por vientos de valle y control precoz del gusano cogollero.",
      valleyTips: "Tradición agrícola en Sopachuy: alternar hileras con poroto o calabaza para fijar nitrógeno natural al suelo.",
      iconName: "Wheat"
    },
    {
      id: "cultivo-3",
      category: "cultivo",
      name: "Trigo de Valle",
      quechuaName: "Trigu / Triku",
      variety: "Variedad Tarabuco y Criollo",
      sowingPeriod: "Mayo - Junio (Siembra de invierno bajo riego en planicies)",
      harvestPeriod: "Octubre - Noviembre",
      soilManagement: "Preparación fina del terreno para asegurar emergencia uniforme. Densidad de siembra de 100-120 kg/ha.",
      organicManure: "Abono verde previo (vicia o haba incorporada al suelo) más enmienda con humus de lombriz.",
      irrigation: "Riego ligero por inundación o manto cada 12-15 días en la época seca de invierno de Sopachuy.",
      generalCare: "Vigilar presencia de roya lineal y malezas de hoja ancha durante el macollaje.",
      valleyTips: "Aprovechar los descansos de las parcelas de maíz para rotar con trigo de invierno.",
      iconName: "Wheat"
    },
    {
      id: "cultivo-4",
      category: "cultivo",
      name: "Durazno de Valle",
      quechuaName: "Duraznu",
      variety: "Ulincate y Gumucio Reyes",
      sowingPeriod: "Junio - Julio (Injertos y trasplante a raíz desnuda)",
      harvestPeriod: "Diciembre - Febrero (Fruta fresca de temporada)",
      soilManagement: "Hoyos amplios (60x60x60 cm) con sustrato enriquecido. Poda de formación en vaso abierto y poda de fructificación en invierno.",
      organicManure: "Corona de estiércol maduro (15 kg por árbol) aplicado al inicio de brotación primaveral.",
      irrigation: "Riego localizado por goteo o cajetes semanales durante el cuajado y engorde del fruto.",
      generalCare: "Raleo de frutos cuando tienen tamaño de nuez para lograr calibres comerciales de primera calidad.",
      valleyTips: "Proteger las flores de las heladas tardías de septiembre con riegos nocturnos preventivos.",
      iconName: "Apple"
    },
    {
      id: "cultivo-5",
      category: "cultivo",
      name: "Hortalizas: Cebolla y Tomate",
      quechuaName: "Cebolla / Tomati",
      variety: "Cebolla Arequipeña Roja / Tomate Río Grande",
      sowingPeriod: "Almácigos en Marzo-Abril; Trasplante en Mayo-Junio",
      harvestPeriod: "Septiembre - Noviembre",
      soilManagement: "Camellones elevados con cobertura de paja o rastrojo (mulch) para conservar humedad en época seca.",
      organicManure: "Biol enriquecido con harina de roca y ceniza, aplicado al pie de cada planta.",
      irrigation: "Riego frecuente pero sin encharcar el cuello de la raíz para evitar la caída de plántulas.",
      generalCare: "Tutorado en tomate y despunte de flores sobrantes. Deshierbe manual continuo.",
      valleyTips: "Ideal para huertos familiares y micro-parcelas escolares en Sopachuy.",
      iconName: "Carrot"
    }
  ],
  pests: [
    {
      id: "plaga-1",
      category: "plaga",
      name: "Gusano Cogollero",
      scientificName: "Spodoptera frugiperda",
      targetCrops: "Maíz, Sorgo y Gramíneas",
      symptoms: "Hojas tiernas perforadas tipo perdigonada, cogollo carcomido y presencia abundante de excremento húmedo similar a aserrín en la garganta de la planta.",
      preventiveControl: "Siembra temprana en época adecuada. Conservación de avispas parasitoides (Trichogramma) y trampas con melaza fermentada.",
      correctiveControl: "Aplicación directa al cogollo de ceniza cernida con arena fina, o bioinsecticida a base de Bacillus thuringiensis.",
      organicRecipe: "Extracto de Ajo y Ají picante: Moler 5 cabezas de ajo y 5 locotos con 1 litro de agua y una pizca de jabón neutro. Filtrar y diluir al 10% en mochila fumigadora.",
      iconName: "Bug"
    },
    {
      id: "plaga-2",
      category: "plaga",
      name: "Polilla de la Papa",
      scientificName: "Phthorimaea operculella",
      targetCrops: "Papa en campo y almacén",
      symptoms: "Minas translúcidas en hojas y galerías profundas con restos fecales en los tubérculos tanto en tierra como en depósitos de acopio.",
      preventiveControl: "Aporque alto y compacto para no dejar tubérculos descubiertos. Cosecha inmediata una vez maduro el cultivo.",
      correctiveControl: "Almacenar la papa seleccionada en capas intercaladas con hojas secas de muña (Minthostachys) o eucalipto.",
      organicRecipe: "Polvo de Muña protectora: Secar hojas de muña a la sombra, pulverizarlas y espolvorear 500 g por cada quintal de papa almacenada.",
      iconName: "AlertTriangle"
    },
    {
      id: "plaga-3",
      category: "plaga",
      name: "Tizón Tardío (Lancha de la Papa)",
      scientificName: "Phytophthora infestans",
      targetCrops: "Papa, Tomate y Solanáceas",
      symptoms: "Manchas necróticas pardas de aspecto aceitoso en las hojas con moho blanquecino en el envés bajo humedad alta; quema total del follaje.",
      preventiveControl: "Evitar densidades excesivas de siembra, asegurar drenaje rápido del terreno y utilizar semilla certificada sana.",
      correctiveControl: "Aplicación preventiva de Caldo Bordelés al 1% ante las primeras neblinas o lluvias continuas de valle.",
      organicRecipe: "Caldo Bordelés tradicional: Disolver 100 g de sulfato de cobre en 5 litros de agua en balde plástico; por separado apagar 100 g de cal viva en 5 litros de agua. Mezclar volcando el cobre sobre la cal y aplicar de inmediato.",
      iconName: "ShieldAlert"
    },
    {
      id: "plaga-4",
      category: "plaga",
      name: "Pulgones de Hortalizas",
      scientificName: "Aphis gossypii / Myzus persicae",
      targetCrops: "Hortalizas, Haba, Frutales",
      symptoms: "Hojas arrugadas y encrespadas hacia abajo, brotes amarillentos y secreción pegajosa (melaza) sobre la cual prolifera el hongo de fumagina negra.",
      preventiveControl: "Siembra de plantas trampa y aromáticas repelentes en bordes de parcela (ruda, manzanilla, caléndula).",
      correctiveControl: "Lavado con agua a presión e hidro-solución jabonosa orgánica biodegradable.",
      organicRecipe: "Solución de Jabón Potásico o Ceniza: 200 g de ceniza tamizada de leña hervida en 5 litros de agua con 30 g de jabón neutro disuelto. Aplicar al atardecer sobre el envés foliar.",
      iconName: "Sparkles"
    }
  ],
  calendarEvents: [
    {
      id: "mes-1",
      month: 1,
      monthName: "Enero",
      title: "Deshierbe y Aporque en Lluvias Plenas",
      crops: ["Papa", "Maíz", "Poroto"],
      tasks: [
        "Segundo aporque intensivo en parcelas de papa para evitar que el agua descubra tubérculos.",
        "Monitoreo fitosanitario contra tizón tardío y orugas foliáceas.",
        "Cosecha inicial de choclo tierno de siembras mishka."
      ],
      valleyWeatherNote: "Época de lluvias torrenciales en el valle de Sopachuy. Mantener zanjas de coronación limpias.",
      quechuaSeason: "Poqoy Mita (Época de crecimiento y lluvias)",
      faseLunar: {
        fase: "Cuarto Creciente (Killa Wiñay)",
        icono: "moon",
        influencia: "La savia asciende con fuerza estimulada por las lluvias plenas de verano.",
        recomendacionAndina: "Realizar el segundo aporque de la papa antes de luna llena para vigorizar las raíces. Momento ideal para pulverizar bioles caseros nutritivos sobre el follaje del maíz."
      }
    },
    {
      id: "mes-2",
      month: 2,
      monthName: "Febrero",
      title: "Cosecha de Choclo y Frutales de Valle",
      crops: ["Maíz Choclero", "Durazno", "Haba verde"],
      tasks: [
        "Cosecha masiva de choclo dulce y selección de semilla criolla.",
        "Recolección de duraznos en madurez comercial para venta y desecado tradicional (mocochinchi).",
        "Control biológico en huertos de valle."
      ],
      valleyWeatherNote: "Humedad relativa alta y temperaturas templadas en el valle.",
      quechuaSeason: "Pukllay Mita (Tiempo de abundancia y fiesta)",
      faseLunar: {
        fase: "Luna Llena (Pura Killa)",
        icono: "circle",
        influencia: "Máxima concentración de humedad y azúcares en la parte aérea del cultivo.",
        recomendacionAndina: "Cosechar choclos tiernos y duraznos en Pura Killa para mayor dulzura y terneza. Evitar podar ramas gruesas ya que la savia fluye intensamente."
      }
    },
    {
      id: "mes-3",
      month: 3,
      monthName: "Marzo",
      title: "Gran Cosecha de Papa (Aymoray Inicial)",
      crops: ["Papa Imilla", "Hortalizas", "Maíz"],
      tasks: [
        "Corte de follaje de papa 10 días antes para madurar la cáscara del tubérculo.",
        "Inicio de cosecha de parcelas tempranas en laderas con buen drenaje.",
        "Preparación de almácigos de hortalizas para la temporada invernal."
      ],
      valleyWeatherNote: "Disminución paulatina de lluvias; días soleados óptimos para secado de campos.",
      quechuaSeason: "Aymoray Mita (Inicio de cosechas)",
      faseLunar: {
        fase: "Cuarto Menguante (Killa Wañuy)",
        icono: "moon",
        influencia: "La savia desciende y se concentra en los tubérculos bajo tierra.",
        recomendacionAndina: "Inicio del Aymoray: cosechar la papa en luna menguante asegura que los tubérculos tengan piel firme, cicatricen rápido y resistan el ataque de la polilla en el almacén comunal."
      }
    },
    {
      id: "mes-4",
      month: 4,
      monthName: "Abril",
      title: "Cosecha General y Almacenamiento Seguro",
      crops: ["Papa Principal", "Maíz Grano", "Trigo"],
      tasks: [
        "Cosecha total de papa y selección estricta de semilla sana y libre de polilla.",
        "Curado y almacenamiento de papa en lugares oscuros y ventilados con muña.",
        "Doblado de cañas de maíz para favorecer el secado del grano en la mazorca."
      ],
      valleyWeatherNote: "Ambiente fresco al atardecer; cese de lluvias en Sopachuy.",
      quechuaSeason: "Jawkay Killa (Mes de descanso de la tierra)",
      faseLunar: {
        fase: "Cuarto Menguante a Luna Nueva (Wañuy Killa)",
        icono: "moon",
        influencia: "Mínima humedad interna en los tejidos; reposo de la savia en la tierra.",
        recomendacionAndina: "Cosecha y troje de maíz seco y papa principal. Tradición de Sopachuy: guardar la semilla con ramas de muña en luna menguante para repeler gorgojos."
      }
    },
    {
      id: "mes-5",
      month: 5,
      monthName: "Mayo",
      title: "Preparación de Suelos de Invierno y Trigo",
      crops: ["Trigo de Invierno", "Cebolla", "Ajo"],
      tasks: [
        "Roturación de rastrojos de maíz e incorporación al suelo.",
        "Siembra de trigo de valle bajo sistema de riego por gravedad.",
        "Trasplante de plántulas de cebolla y hortalizas resistentes a camellones."
      ],
      valleyWeatherNote: "Entrada del estiaje seco y descenso nocturno de temperatura.",
      quechuaSeason: "Chiri Mita (Época de frío)",
      faseLunar: {
        fase: "Luna Nueva (Mosoq Killa)",
        icono: "disc",
        influencia: "Reposo vegetativo total en el suelo; baja actividad de malezas.",
        recomendacionAndina: "Arado y desmenuzado profundo en luna nueva para desenterrar plagas y frenar rebrotes. Sembrar el trigo de invierno en los días previos a cuarto creciente con riego."
      }
    },
    {
      id: "mes-6",
      month: 6,
      monthName: "Junio",
      title: "Manejo de Heladas y Riego de Trigo",
      crops: ["Trigo", "Hortalizas de invierno", "Frutales"],
      tasks: [
        "Riegos ligeros continuos al trigo para evitar deshidratación por frío seco.",
        "Protección de almácigos con micro-túneles o cubiertas de paja contra heladas.",
        "Limpieza fitosanitaria y descanso vegetativo en huertos frutales."
      ],
      valleyWeatherNote: "Riesgo de heladas en las partes bajas del valle de Sopachuy.",
      quechuaSeason: "Qasa Pacha (Tiempo de helada)",
      faseLunar: {
        fase: "Cuarto Creciente (Killa Wiñay)",
        icono: "moon",
        influencia: "La savia comienza a subir hacia los brotes y espigas jóvenes.",
        recomendacionAndina: "Riego por manto o acequia en las mañanas de creciente para que el trigo absorba agua y minerales antes de las heladas nocturnas de invierno."
      }
    },
    {
      id: "mes-7",
      month: 7,
      monthName: "Julio",
      title: "Poda de Frutales y Abonamiento Invernal",
      crops: ["Durazno", "Manzana", "Cebada"],
      tasks: [
        "Poda técnica de invierno en durazneros: despeje del centro y ramas secas.",
        "Sellado de cortes de poda con pasta bordelesa o ceniza para evitar hongos.",
        "Aporte profundo de estiércol fermentado en corona alrededor de los frutales."
      ],
      valleyWeatherNote: "Pico de bajas temperaturas invernales; días despejados con fuerte sol diurno.",
      quechuaSeason: "Chiri Killa (Mes más frío)",
      faseLunar: {
        fase: "Cuarto Menguante (Killa Wañuy)",
        icono: "moon",
        influencia: "Los árboles frutales se encuentran en dormancia y la savia se refugia en las raíces.",
        recomendacionAndina: "Poda invernal de durazneros y frutales exclusivamente en luna menguante. Los cortes no sangran y cicatrizan rápido sellándolos con ceniza vegetal o caldo bordelés."
      }
    },
    {
      id: "mes-8",
      month: 8,
      monthName: "Agosto",
      title: "Macerados Orgánicos y Riego de Despertar",
      crops: ["Frutales en brotación", "Hortalizas", "Ajo"],
      tasks: [
        "Riego de 'despertar' en frutales para estimular floración pareja.",
        "Preparación de bioles y composteras con residuos de la comunidad.",
        "Deshierbe manual en parcelas de hortalizas invernales."
      ],
      valleyWeatherNote: "Vientos característicos de agosto en la región de Tomina y Sopachuy.",
      quechuaSeason: "Pachamama Killa (Mes de agradecimiento a la Madre Tierra)",
      faseLunar: {
        fase: "Luna Llena (Pura Killa - Pachamama)",
        icono: "circle",
        influencia: "Despertar de la fuerza telúrica y circulación de energía en la corteza vegetal.",
        recomendacionAndina: "Mes de respeto a la Pachamama. Aplicar el 'riego de despertar' en luna llena para inducir floración pareja y preparar bioles fermentados con guano y ceniza."
      }
    },
    {
      id: "mes-9",
      month: 9,
      monthName: "Septiembre",
      title: "Siembra Temprana Mishka de Maíz",
      crops: ["Maíz Mishka", "Papa temprana", "Zapallo"],
      tasks: [
        "Arado profundo y mullido de parcelas destinadas a siembras tempranas con riego.",
        "Desinfección de semilla de maíz con extractos botánicos naturales.",
        "Siembra en hileras de maíz choclero aprovechando canales de riego comunales."
      ],
      valleyWeatherNote: "Inicio de ascenso de temperatura; aire seco con primeras nubes aisladas.",
      quechuaSeason: "Pawkar Waray (Renacimiento primaveral)",
      faseLunar: {
        fase: "Cuarto Creciente (Killa Wiñay)",
        icono: "moon",
        influencia: "Atracción ascendente de la luna que acelera la germinación y desarrollo de tallos.",
        recomendacionAndina: "Siembra de maíz temprano 'Mishka' en luna creciente con agua de acequia. La semilla brota vigorosa y desarrolla cañas gruesas resistentes al viento de primavera."
      }
    },
    {
      id: "mes-10",
      month: 10,
      monthName: "Octubre",
      title: "Preparación Principal de Terreno y Siembra de Papa",
      crops: ["Papa Imilla Principal", "Maíz Blanco", "Poroto"],
      tasks: [
        "Preparación exhaustiva de suelo con estiércol ovino para la siembra grande de papa.",
        "Siembra principal de tubérculos brotados sanos a 30 cm de distancia.",
        "Cosecha del trigo de invierno sembrado en mayo."
      ],
      valleyWeatherNote: "Primeras lluvias moderadas de primavera en el valle de Sopachuy.",
      quechuaSeason: "Tarpuy Mita (Época cumbre de siembras)",
      faseLunar: {
        fase: "Cuarto Menguante (Killa Wañuy)",
        icono: "moon",
        influencia: "La savia baja hacia el interior de la tierra, favoreciendo el enraizamiento profundo.",
        recomendacionAndina: "Regla de oro de los agricultores de Sopachuy: la siembra grande de papa (Tarpuy) se hace en luna menguante para que la energía se concentre bajo tierra y rinda tubérculos grandes y abundantes."
      }
    },
    {
      id: "mes-11",
      month: 11,
      monthName: "Noviembre",
      title: "Siembra General y Manejo de Malezas",
      crops: ["Papa", "Maíz", "Haba", "Frutales"],
      tasks: [
        "Culminación de siembras de secano en laderas y terrazas.",
        "Primer deshierbe y aporque temprano en parcelas de maíz y papa emergidas.",
        "Monitoreo inicial de plagas emergentes como gusano cogollero."
      ],
      valleyWeatherNote: "Lluvias regulares y temperaturas cálidas favorables para la germinación.",
      quechuaSeason: "Ayamarka Killa",
      faseLunar: {
        fase: "Cuarto Creciente (Killa Wiñay)",
        icono: "moon",
        influencia: "Impulso vigoroso a la emergencia de hojas, brotes y vainas aéreas.",
        recomendacionAndina: "Siembra de porotos, habas y maíz tardío de secano en creciente. El deshierbe manual conviene realizarlo en la fase menguante previa para evitar que las malas hierbas vuelvan a brotar."
      }
    },
    {
      id: "mes-12",
      month: 12,
      monthName: "Diciembre",
      title: "Manejo Integral de Follaje y Riego Complementario",
      crops: ["Papa en floración", "Maíz en crecimiento", "Durazno verde"],
      tasks: [
        "Aplicaciones preventivas de bioles y caldo bordelés ante lluvias continuas.",
        "Raleo de frutos en árboles de durazno para favorecer calibres grandes.",
        "Limpieza de acequias comunales para regular excedentes de lluvia."
      ],
      valleyWeatherNote: "Temporada plena de lluvias de verano en Chuquisaca.",
      quechuaSeason: "Qhapaq Inti Raymi (Solsticio de verano)",
      faseLunar: {
        fase: "Luna Llena (Pura Killa - Solsticio)",
        icono: "circle",
        influencia: "Máxima luz nocturna y expansión foliar en coincidencia con el solsticio de verano (Qhapaq Raymi).",
        recomendacionAndina: "Monitoreo nocturno intensivo: mariposas de polilla y orugas cogolleras están más activas bajo Pura Killa. Aplicar trampas de luz o extractos botánicos de ajo y ají al atardecer."
      }
    }
  ]
};

/**
 * Searches the catalog of crops and pests in real time.
 */
export function searchCatalog(
  items: (CropItem | PestItem)[],
  query: string
): (CropItem | PestItem)[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  return items.filter((item) => {
    if (item.category === "cultivo") {
      const crop = item as CropItem;
      return (
        crop.name.toLowerCase().includes(q) ||
        crop.variety.toLowerCase().includes(q) ||
        (crop.quechuaName && crop.quechuaName.toLowerCase().includes(q)) ||
        crop.sowingPeriod.toLowerCase().includes(q) ||
        crop.harvestPeriod.toLowerCase().includes(q) ||
        crop.soilManagement.toLowerCase().includes(q) ||
        crop.organicManure.toLowerCase().includes(q) ||
        crop.irrigation.toLowerCase().includes(q) ||
        crop.generalCare.toLowerCase().includes(q) ||
        crop.valleyTips.toLowerCase().includes(q)
      );
    } else {
      const pest = item as PestItem;
      return (
        pest.name.toLowerCase().includes(q) ||
        (pest.scientificName && pest.scientificName.toLowerCase().includes(q)) ||
        pest.targetCrops.toLowerCase().includes(q) ||
        pest.symptoms.toLowerCase().includes(q) ||
        pest.preventiveControl.toLowerCase().includes(q) ||
        pest.correctiveControl.toLowerCase().includes(q) ||
        pest.organicRecipe.toLowerCase().includes(q)
      );
    }
  });
}

/**
 * Filters items by category tab.
 */
export function filterByCategory(
  items: (CropItem | PestItem)[],
  category: "all" | "cultivos" | "plagas"
): (CropItem | PestItem)[] {
  if (category === "cultivos") {
    return items.filter((i) => i.category === "cultivo");
  }
  if (category === "plagas") {
    return items.filter((i) => i.category === "plaga");
  }
  return items;
}

/**
 * Gets calendar event for a specific month (1-12).
 */
export function getCalendarEventForMonth(
  events: CalendarEvent[],
  month: number
): CalendarEvent | undefined {
  return events.find((e) => e.month === month);
}

/**
 * Validates the administrative PIN.
 */
export function validateAdminPin(pin: string): boolean {
  return pin.trim() === "1234";
}

/**
 * Returns Quechua cultural terminology for agricultural operations.
 */
export function getQuechuaGlossary(): Record<string, string> {
  return {
    "Tarpuy": "Siembra / Colocar la semilla en la tierra",
    "Aymoray": "Cosecha / Recoger el fruto maduro",
    "Allpa": "Tierra / Suelo fértil",
    "Yaku / Unu": "Agua de riego o lluvia",
    "Qarpay": "Riego de parcelas",
    "Hallmay": "Aporque / Arrimar tierra al pie de la planta",
    "Wanu": "Abono / Estiércol natural orgánico",
    "Sara": "Maíz sagrado",
    "Papa / Ch'oqe": "Papa andina",
    "Killa": "Luna / Ciclos lunares para labores del campo"
  };
}

export interface MicroclimateZone {
  id: string;
  name: string;
  elevation: number; // msnm
  lat: number;
  lng: number;
  climateType: string;
  frostRisk: 'Bajo' | 'Moderado' | 'Alto';
  averageTemp: string;
  annualRainfall: string;
  topCrops: string[];
  sowingAdjustment: string;
  irrigationNote: string;
  soilAdvisory: string;
  phytosanitaryAlert: string;
}

export interface BioscienceProfile {
  scientificName: string;
  family: string;
  photosyntheticPathway: 'C3' | 'C4' | 'CAM';
  thermalRange: string;
  optimalSoilPh: string;
  biologicalActionMechanism: string;
  biochemicalCompounds: string[];
  scientificCitation: string;
}

export const SOPACHUY_MICROCLIMATE_ZONES: MicroclimateZone[] = [
  {
    id: "sopachuy-centro",
    name: "Sopachuy Centro (Valle Fértil)",
    elevation: 2050,
    lat: -19.4892,
    lng: -64.4785,
    climateType: "Valle mesotérmico templado subhúmedo",
    frostRisk: "Moderado",
    averageTemp: "16°C a 24°C",
    annualRainfall: "550 - 650 mm",
    topCrops: ["Papa Imilla", "Maíz Choclero", "Durazno", "Cebolla", "Tomate"],
    sowingAdjustment: "Calendario estándar: siembra temprana (mishka) en septiembre y siembra principal a inicios de octubre.",
    irrigationNote: "Riego por gravedad desde acequias comunales cada 8 a 10 días.",
    soilAdvisory: "Suelos aluviales de vega con buena retención hídrica. Aportar materia orgánica compostada (5-8 t/ha).",
    phytosanitaryAlert: "En veranos húmedos, vigilar tizón tardío por neblinas matutinas."
  },
  {
    id: "laderas-amancaya",
    name: "Laderas y Amancaya (Valle Medio)",
    elevation: 2280,
    lat: -19.4620,
    lng: -64.4510,
    climateType: "Valle de ladera templado semiárido",
    frostRisk: "Moderado",
    averageTemp: "14°C a 21°C",
    annualRainfall: "500 - 580 mm",
    topCrops: ["Papa Imilla", "Maíz Blanco Criollo", "Trigo de Valle", "Haba"],
    sowingAdjustment: "Siembra sincronizada con las primeras lluvias firmes (mediados a fines de octubre) para asegurar germinación.",
    irrigationNote: "Riego por turnos de canal o secano mejorado con zanjas de infiltración en curvas de nivel.",
    soilAdvisory: "Pendiente pronunciada con susceptibilidad a erosión. Imprescindible siembra en contorno y aporque alto.",
    phytosanitaryAlert: "Aumento de polilla de la papa en periodos secos; mantener cobertura de tubérculos."
  },
  {
    id: "alturas-cabeceras",
    name: "Cabeceras y Alturas de Tomina (Valle Alto)",
    elevation: 2580,
    lat: -19.4180,
    lng: -64.5120,
    climateType: "Valle alto andino fresco con alta radiación UV",
    frostRisk: "Alto",
    averageTemp: "10°C a 18°C",
    annualRainfall: "600 - 750 mm",
    topCrops: ["Papa Huaycha rústica", "Cebada", "Haba", "Trigo Criollo"],
    sowingAdjustment: "Adelantar siembras a principios de octubre o postergar a noviembre según el cese de heladas tardías.",
    irrigationNote: "Aprovechar humedad residual de quebradas y riego ligero de supervivencia.",
    soilAdvisory: "Suelos francos a franco-pedregosos. Requerimiento alto de fósforo y estiércol fermentado para generar calor en la rizosfera.",
    phytosanitaryAlert: "Riesgo de heladas invernales severas; usar abrigos de paja en almácigos."
  },
  {
    id: "ribera-san-pedro",
    name: "Ribera Río San Pedro / Cañada Cálida",
    elevation: 1900,
    lat: -19.5310,
    lng: -64.4390,
    climateType: "Valle abrigado templado-cálido",
    frostRisk: "Bajo",
    averageTemp: "18°C a 27°C",
    annualRainfall: "480 - 550 mm",
    topCrops: ["Maíz Primicia", "Frutales (Durazno, Chirimoya, Cítricos)", "Hortalizas bajo riego"],
    sowingAdjustment: "Permite siembras tempranas en agosto-septiembre sin riesgo de heladas, logrando precios de primicia.",
    irrigationNote: "Riego permanente por bombeo o derivación directa del río San Pedro.",
    soilAdvisory: "Suelos arenosos a franco-arenosos con drenaje ultra rápido; requiere enriquecimiento frecuente de humus.",
    phytosanitaryAlert: "Mayor presión de plagas masticadoras (gusano cogollero) y pulgones por temperaturas cálidas."
  }
];

export const BIOSCIENCE_DATA: Record<string, BioscienceProfile> = {
  "Papa": {
    scientificName: "Solanum tuberosum L.",
    family: "Solanaceae",
    photosyntheticPathway: "C3",
    thermalRange: "15°C a 20°C óptimo (inhibición de tuberización >25°C)",
    optimalSoilPh: "5.2 - 6.5 (ácido moderado a neutro)",
    biologicalActionMechanism: "Asimilación C3 sensible a fotorrespiración bajo altas temperaturas. Requiere noches frescas para translocar carbohidratos vía floema hacia el estolón.",
    biochemicalCompounds: ["Solanina (defensa natural)", "Glicialcaloides", "Antocianinas en variedades nativas"],
    scientificCitation: "CIP (Centro Internacional de la Papa) & FAO Agro-Ecology Compendium"
  },
  "Maíz": {
    scientificName: "Zea mays L.",
    family: "Poaceae (Gramineae)",
    photosyntheticPathway: "C4",
    thermalRange: "18°C a 30°C óptimo (alta eficiencia del uso del agua y luz)",
    optimalSoilPh: "5.8 - 7.2",
    biologicalActionMechanism: "Anatomía foliar tipo Kranz con concentración de CO2 en células de la vaina, eliminando fotorrespiración y maximizando biomasa en valles cálidos.",
    biochemicalCompounds: ["Ácido ferúlico en pericarpio", "Zeatina (fitohormona citoquinina)", "Almidón amilasa"],
    scientificCitation: "CIMMYT World Maize Phenology and Andean Valley Adaptation"
  },
  "Trigo de Valle": {
    scientificName: "Triticum aestivum L.",
    family: "Poaceae",
    photosyntheticPathway: "C3",
    thermalRange: "12°C a 22°C (óptimo para invierno bajo riego)",
    optimalSoilPh: "6.0 - 7.5",
    biologicalActionMechanism: "Vía C3 con respuesta favorable a fotoperiodos soleados de invierno andino; macollaje estimulado por frío moderado nocturno.",
    biochemicalCompounds: ["Glutenina y Gliadina", "Ácidos fenólicos antioxidantes"],
    scientificCitation: "EMBL-EBI InterPro & USDA Cereal Chemistry"
  },
  "Durazno de Valle": {
    scientificName: "Prunus persica (L.) Batsch",
    family: "Rosaceae",
    photosyntheticPathway: "C3",
    thermalRange: "Requerimiento de 200 a 400 horas frío (<7°C) en invierno para romper dormancia",
    optimalSoilPh: "6.0 - 6.8",
    biologicalActionMechanism: "Fisiología perenne caducifolia. El reposo invernal sincroniza la diferenciación de yemas florales ante el aumento de temperatura en agosto.",
    biochemicalCompounds: ["Amigdalina en semilla", "Polifenoles y flavonoides en epidermis"],
    scientificCitation: "Bioversity International & EMBRAPA Fruticultura de Valle"
  },
  "Gusano Cogollero": {
    scientificName: "Spodoptera frugiperda (J.E. Smith)",
    family: "Noctuidae (Lepidoptera)",
    photosyntheticPathway: "C3", // N/A, organism biological model
    thermalRange: "Tasa reproductiva máxima entre 24°C y 28°C",
    optimalSoilPh: "N/A",
    biologicalActionMechanism: "Larvas masticadoras con tubo digestivo de pH alcalino (pH 9-10). Vulnerables a endotoxinas delta Cry de Bacillus thuringiensis y principios activos amargos (azadiractina, alicina).",
    biochemicalCompounds: ["Feromona sexual Z-9-tetradecenil acetato", "Enzimas citocromo P450"],
    scientificCitation: "CABI Compendium & Journal of Economic Entomology"
  },
  "Tizón Tardío (Lancha de la Papa)": {
    scientificName: "Phytophthora infestans (Mont.) de Bary",
    family: "Peronosporaceae (Oomycota)",
    photosyntheticPathway: "C3",
    thermalRange: "Esporulación a 15°C - 20°C con humedad relativa >90%",
    optimalSoilPh: "N/A",
    biologicalActionMechanism: "Oomiceto hemibiotrófico que secreta efectores RXLR que suprimen la inmunidad basal de la planta. El ión Cu2+ del Caldo Bordelés desnaturaliza las enzimas de germinación del zoosporangio.",
    biochemicalCompounds: ["Ácido beta-glucano en pared celular", "Efectores proteicos AVR"],
    scientificCitation: "RCSB PDB Structure 6V4L & Phytopathology"
  }
};

/**
 * Calculates distance in kilometers between two GPS coordinates (Haversine formula).
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the nearest microclimate zone around Sopachuy based on coordinates.
 */
export function findNearestMicroclimateZone(lat: number, lng: number): MicroclimateZone {
  let nearest = SOPACHUY_MICROCLIMATE_ZONES[0];
  let minDistance = Infinity;

  for (const zone of SOPACHUY_MICROCLIMATE_ZONES) {
    const dist = calculateDistanceKm(lat, lng, zone.lat, zone.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = zone;
    }
  }

  return nearest;
}

/**
 * Generates specific agronomic crop recommendations tailored to a microclimate zone.
 */
export function getMicroclimateCropAdvisory(crop: CropItem, zone: MicroclimateZone): string {
  const isTop = zone.topCrops.some((tc) => tc.toLowerCase().includes(crop.name.toLowerCase()));
  const isHighAltitude = zone.elevation >= 2400;
  const isLowValley = zone.elevation <= 2000;

  if (crop.name.toLowerCase().includes('papa')) {
    if (isHighAltitude) {
      return `Altitud ${zone.elevation} msnm ideal para tubérculos nativos y resistentes. Cuidar de heladas tardías de primavera y aplicar abundante ceniza y estiércol fermentado para mantener calor edáfico.`;
    }
    if (isLowValley) {
      return `En cota ${zone.elevation} msnm con mayor temperatura, sincronizar con riego de vega y aporcar oportunamente para evitar sobrecalentamiento del camellón.`;
    }
    return `Valle medio (${zone.elevation} msnm): Siembra principal recomendada entre octubre y noviembre con primeras lluvias estables. Aporque a los 20 cm.`;
  }

  if (crop.name.toLowerCase().includes('maíz') || crop.name.toLowerCase().includes('maiz')) {
    if (isHighAltitude) {
      return `En cotas altas (${zone.elevation} msnm), el ciclo fenológico se alarga 20-30 días por menores temperaturas medias nocturnas. Proteger contra vientos fríos y preferir maíz blanco o variedades de ciclo corto.`;
    }
    if (isLowValley) {
      return `Excelente respuesta fisiológica C4 al calor de ribera (${zone.elevation} msnm). Permite siembras tempranas mishka (septiembre) con alta productividad para choclo primicia.`;
    }
    return `Condición óptima de valle templado (${zone.elevation} msnm): Siembra en surcos a 80 cm, asociación recomendada con poroto para fijar nitrógeno.`;
  }

  if (crop.name.toLowerCase().includes('trigo')) {
    if (isHighAltitude) {
      return `Cereal rústico apto para secano alto y rastrojo. Buena tolerancia a temperaturas bajas durante el macollaje andino.`;
    }
    return `Siembra de invierno bajo riego en las planicies del valle (${zone.elevation} msnm). Requiere riegos regulares cada 12-15 días.`;
  }

  if (crop.name.toLowerCase().includes('durazno') || crop.name.toLowerCase().includes('frutales')) {
    if (isHighAltitude) {
      return `Sensible a heladas en floración primaveral. Plantar en laderas con buena circulación de aire térmico, nunca en fondos de quebrada cerrada.`;
    }
    return `Cumple holgadamente las horas frío invernales en ${zone.name}. Poda de fructificación en julio y abonamiento orgánico en corona profunda.`;
  }

  return isTop
    ? `Cultivo altamente recomendado para la zona de ${zone.name} (${zone.elevation} msnm).`
    : `Cultivo adaptable a ${zone.name}. Calibrar riego según la retención del suelo local.`;
}

/**
 * Returns month-specific advice tailored to the microclimate zone.
 */
export function getMicroclimateCalendarAdvisory(month: number, zone: MicroclimateZone): string {
  const isHighAltitude = zone.elevation >= 2400;
  const isLowValley = zone.elevation <= 2000;

  // Meses de heladas (Mayo - Agosto)
  if (month >= 5 && month <= 8) {
    if (isHighAltitude) {
      return `Alerta de heladas severas en ${zone.name} (${zone.elevation} msnm). Proteger almácigos con microtúneles de paja y realizar riegos preventivos antes de noches despejadas.`;
    }
    if (isLowValley) {
      return `Bajo riesgo de heladas destructivas en esta cota cálida (${zone.elevation} msnm). Aprovechar para cultivo continuo de hortalizas con riego del río.`;
    }
    return `Temporada de frío en el valle (${zone.elevation} msnm). Poda sanitaria de frutales en julio y aplicación de pasta protectora de ceniza o caldo bordelés.`;
  }

  // Meses de siembra (Septiembre - Noviembre)
  if (month >= 9 && month <= 11) {
    if (isHighAltitude) {
      return `Monitorear el cese de heladas tardías en ${zone.name}. Concentrar la siembra principal de papa en octubre-noviembre cuando la temperatura del suelo sea estable.`;
    }
    if (isLowValley) {
      return `Cota cálida favorable para siembras tempranas mishka desde septiembre. Vigilar eclosión temprana de gusano cogollero en plántulas tiernas.`;
    }
    return `Siembra general en ${zone.name}. Incorporar compost maduro y asegurar buena nivelación de surcos para drenar excesos de tormentas primaverales.`;
  }

  // Meses de cosecha (Marzo - Abril)
  if (month === 3 || month === 4) {
    if (isHighAltitude) {
      return `Inicio de la gran cosecha andina en ${zone.name}. Cosechar en días soleados y seleccionar tubérculos libres de daño mecánico para semilla.`;
    }
    return `Cosecha general y doblado de maíz para secado de grano. Almacenar la papa con hojas secas de muña contra polilla en ambientes ventilados.`;
  }

  return `Labores regulares de manejo y deshierbe oportuno adaptadas a ${zone.name} (${zone.elevation} msnm).`;
}

/**
 * Returns pest management advisory tailored to the microclimate zone.
 */
export function getMicroclimatePestAdvisory(pest: PestItem, zone: MicroclimateZone): string {
  const isLowValley = zone.elevation <= 2000;
  const isHighAltitude = zone.elevation >= 2400;

  if (pest.name.toLowerCase().includes('cogollero')) {
    if (isLowValley) {
      return `Alta incidencia por temperaturas templado-cálidas (${zone.averageTemp}) en ${zone.name}. Monitorear plántulas cada 3 días y aplicar extracto de ají/ceniza de inmediato.`;
    }
    if (isHighAltitude) {
      return `Baja presión térmica de cogollero en cotas altas (${zone.elevation} msnm). Mantener control biológico preventivo sin aplicaciones agresivas.`;
    }
    return `Incidencia moderada en ${zone.name}. Control manual en el cogollo y rotación con leguminosas.`;
  }

  if (pest.name.toLowerCase().includes('tizón') || pest.name.toLowerCase().includes('lancha')) {
    if (isHighAltitude || zone.annualRainfall.includes('750')) {
      return `Mayor susceptibilidad en periodos de neblina o lluvias persistentes en ${zone.name}. Aplicación preventiva obligatoria de Caldo Bordelés al 1% tras lluvias.`;
    }
    return `Vigilar humedad relativa en el valle. Mantener aporque alto y buen drenaje de surcos.`;
  }

  return `Manejo agroecológico estándar recomendado para la zona de ${zone.name}.`;
}

