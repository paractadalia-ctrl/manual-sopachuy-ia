/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_DATA,
  searchCatalog,
  filterByCategory,
  getCalendarEventForMonth,
  validateAdminPin,
  getQuechuaGlossary
} from './agricultural.ts';

test('INITIAL_DATA contains required Sopachuy valley crops and pests', () => {
  assert.ok(INITIAL_DATA.crops.length >= 2, 'Should have at least 2 default crops');
  assert.ok(INITIAL_DATA.pests.length >= 1, 'Should have at least 1 default pest');
  assert.equal(INITIAL_DATA.calendarEvents.length, 12, 'Should have all 12 months for Sopachuy calendar');

  const papa = INITIAL_DATA.crops.find((c) => c.name.toLowerCase().includes('papa'));
  assert.ok(papa, 'Papa should be present');
  assert.match(papa!.variety, /imilla/i, 'Papa variety should be Imilla');
  assert.match(papa!.sowingPeriod, /octubre/i, 'Papa sowing period should mention October');
  assert.match(papa!.harvestPeriod, /marzo|abril/i, 'Papa harvest should mention March or April');

  const maiz = INITIAL_DATA.crops.find((c) => c.name.toLowerCase().includes('maíz'));
  assert.ok(maiz, 'Maíz should be present');
  assert.match(maiz!.variety, /choclero/i, 'Maíz variety should mention Choclero');

  const cogollero = INITIAL_DATA.pests.find((p) => p.name.toLowerCase().includes('cogollero'));
  assert.ok(cogollero, 'Gusano Cogollero should be present');
  assert.match(cogollero!.symptoms, /hojas tiernas perforadas|excremento/i);
});

test('searchCatalog filters items by crop name, variety, and symptoms', () => {
  const allItems = [...INITIAL_DATA.crops, ...INITIAL_DATA.pests];

  // Search by crop name
  const papaResults = searchCatalog(allItems, 'papa');
  assert.ok(papaResults.length >= 1, 'Search for papa should return papa');

  // Search by variety
  const chocleroResults = searchCatalog(allItems, 'choclero');
  assert.ok(chocleroResults.length >= 1, 'Search for choclero should return maíz');

  // Search by symptoms
  const symptomResults = searchCatalog(allItems, 'perforadas');
  assert.ok(symptomResults.length >= 1, 'Search by symptoms should return matching pest');

  // Empty search should return all items
  const all = searchCatalog(allItems, '   ');
  assert.equal(all.length, allItems.length, 'Empty search should return all items');
});

test('filterByCategory separates crops and pests accurately', () => {
  const allItems = [...INITIAL_DATA.crops, ...INITIAL_DATA.pests];

  const onlyCrops = filterByCategory(allItems, 'cultivos');
  assert.ok(onlyCrops.every((i) => i.category === 'cultivo'), 'Only crops should be returned');
  assert.equal(onlyCrops.length, INITIAL_DATA.crops.length);

  const onlyPests = filterByCategory(allItems, 'plagas');
  assert.ok(onlyPests.every((i) => i.category === 'plaga'), 'Only pests should be returned');
  assert.equal(onlyPests.length, INITIAL_DATA.pests.length);

  const all = filterByCategory(allItems, 'all');
  assert.equal(all.length, allItems.length);
});

test('getCalendarEventForMonth returns correct month data for Sopachuy', () => {
  const oct = getCalendarEventForMonth(INITIAL_DATA.calendarEvents, 10);
  assert.ok(oct, 'October calendar event should exist');
  assert.equal(oct!.monthName, 'Octubre');
  assert.match(oct!.title, /siembra de papa|preparación/i);

  const nonexistent = getCalendarEventForMonth(INITIAL_DATA.calendarEvents, 99);
  assert.equal(nonexistent, undefined);
});

test('validateAdminPin correctly checks the "1234" PIN', () => {
  assert.equal(validateAdminPin('1234'), true, 'Pin 1234 should be valid');
  assert.equal(validateAdminPin(' 1234 '), true, 'Trimmed 1234 should be valid');
  assert.equal(validateAdminPin('0000'), false, 'Wrong PIN should fail');
  assert.equal(validateAdminPin('admin'), false, 'Wrong PIN should fail');
});

test('getQuechuaGlossary returns valid agricultural terms', () => {
  const glossary = getQuechuaGlossary();
  assert.ok(glossary['Tarpuy'], 'Tarpuy should be defined');
  assert.ok(glossary['Aymoray'], 'Aymoray should be defined');
  assert.ok(glossary['Sara'], 'Sara should be defined');
});

test('findNearestMicroclimateZone resolves correct Sopachuy zone based on coords', async () => {
  const { findNearestMicroclimateZone, SOPACHUY_MICROCLIMATE_ZONES } = await import('./agricultural.ts');
  assert.equal(SOPACHUY_MICROCLIMATE_ZONES.length, 4, 'Should have 4 defined microclimate zones');

  // Test near Sopachuy Centro
  const centro = findNearestMicroclimateZone(-19.489, -64.478);
  assert.equal(centro.id, 'sopachuy-centro');
  assert.equal(centro.elevation, 2050);

  // Test high altitude Tomina Cabeceras
  const altura = findNearestMicroclimateZone(-19.418, -64.512);
  assert.equal(altura.id, 'alturas-cabeceras');
  assert.equal(altura.frostRisk, 'Alto');
});

test('BIOSCIENCE_DATA contains scientific botanical taxonomy and C3/C4 pathways', async () => {
  const { BIOSCIENCE_DATA } = await import('./agricultural.ts');
  assert.ok(BIOSCIENCE_DATA['Papa'], 'Papa bioscience profile should exist');
  assert.equal(BIOSCIENCE_DATA['Papa'].scientificName, 'Solanum tuberosum L.');
  assert.equal(BIOSCIENCE_DATA['Papa'].photosyntheticPathway, 'C3');

  assert.ok(BIOSCIENCE_DATA['Maíz'], 'Maíz bioscience profile should exist');
  assert.equal(BIOSCIENCE_DATA['Maíz'].scientificName, 'Zea mays L.');
  assert.equal(BIOSCIENCE_DATA['Maíz'].photosyntheticPathway, 'C4');
  assert.match(BIOSCIENCE_DATA['Maíz'].biologicalActionMechanism, /Kranz/i);
});

test('getMicroclimateCropAdvisory adjusts crop recommendations by altitude and zone', async () => {
  const { getMicroclimateCropAdvisory, SOPACHUY_MICROCLIMATE_ZONES, INITIAL_DATA } = await import('./agricultural.ts');
  const papa = INITIAL_DATA.crops.find((c) => c.name.toLowerCase().includes('papa'))!;
  const maiz = INITIAL_DATA.crops.find((c) => c.name.toLowerCase().includes('maíz'))!;
  
  const cabecerasAltas = SOPACHUY_MICROCLIMATE_ZONES.find((z) => z.id === 'alturas-cabeceras')!;
  const riberaCalida = SOPACHUY_MICROCLIMATE_ZONES.find((z) => z.id === 'ribera-san-pedro')!;

  const papaAdvisoryAlta = getMicroclimateCropAdvisory(papa, cabecerasAltas);
  assert.match(papaAdvisoryAlta, /heladas tardías|ceniza|tubérculos nativos/i);

  const maizAdvisoryRibera = getMicroclimateCropAdvisory(maiz, riberaCalida);
  assert.match(maizAdvisoryRibera, /mishka|primicia|C4/i);
});

test('getMicroclimateCalendarAdvisory provides frost and sowing warnings per zone', async () => {
  const { getMicroclimateCalendarAdvisory, SOPACHUY_MICROCLIMATE_ZONES } = await import('./agricultural.ts');
  const cabecerasAltas = SOPACHUY_MICROCLIMATE_ZONES.find((z) => z.id === 'alturas-cabeceras')!;
  const centro = SOPACHUY_MICROCLIMATE_ZONES.find((z) => z.id === 'sopachuy-centro')!;

  // Month 6 = June (winter frost season)
  const juneAltas = getMicroclimateCalendarAdvisory(6, cabecerasAltas);
  assert.match(juneAltas, /heladas severas|microtúneles|paja/i);

  // Month 10 = October (sowing season)
  const octCentro = getMicroclimateCalendarAdvisory(10, centro);
  assert.match(octCentro, /siembra general|compost/i);
});

test('getMicroclimatePestAdvisory calibrates pest risk by thermal zone', async () => {
  const { getMicroclimatePestAdvisory, SOPACHUY_MICROCLIMATE_ZONES, INITIAL_DATA } = await import('./agricultural.ts');
  const cogollero = INITIAL_DATA.pests.find((p) => p.name.toLowerCase().includes('cogollero'))!;
  const riberaCalida = SOPACHUY_MICROCLIMATE_ZONES.find((z) => z.id === 'ribera-san-pedro')!;
  const cabecerasAltas = SOPACHUY_MICROCLIMATE_ZONES.find((z) => z.id === 'alturas-cabeceras')!;

  const cogolleroRibera = getMicroclimatePestAdvisory(cogollero, riberaCalida);
  assert.match(cogolleroRibera, /alta incidencia|cálidas/i);

  const cogolleroAltas = getMicroclimatePestAdvisory(cogollero, cabecerasAltas);
  assert.match(cogolleroAltas, /baja presión térmica/i);
});

