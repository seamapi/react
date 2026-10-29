import { expect, test } from 'vitest'

import { getRequirementKinds, getRequirementPills } from './model.js'

const legal =
  'To be able to use this system, you will need to first sign an EULA with Salto.'
const combined =
  'To be able to use this system, you will both need to first sign an EULA with Salto and install a Seam bridge to make it cloud-ready.'

test('an EULA is a legal prerequisite, distinct from a subscription', () => {
  expect(getRequirementKinds(legal)).toEqual(['legal'])
  expect(getRequirementKinds('Sign an end-user license agreement.')).toEqual([
    'legal',
  ])
  expect(getRequirementKinds('Sign a waiver.')).toEqual(['legal'])
})

test('a combined provider requirement preserves legal and bridge categories and source copy', () => {
  expect(getRequirementKinds(combined)).toEqual(['legal', 'bridge'])
  expect(
    getRequirementPills({
      requirements: [{ message: combined, capabilities: ['Access codes'] }],
    })
  ).toEqual([
    { label: 'Accessories Required', messages: [combined] },
    { label: 'Legal Requirements', messages: [combined] },
  ])
})

test('existing accessory and subscription categories remain distinct; unknown prose stays explicit', () => {
  expect(getRequirementKinds('A compatible bridge is required.')).toEqual([
    'bridge',
  ])
  expect(getRequirementKinds('An external keypad is required.')).toEqual([
    'keypad',
  ])
  expect(
    getRequirementKinds('A paying Nuki SmartHosting subscription is required.')
  ).toEqual(['subscription'])
  expect(
    getRequirementKinds('Contact the provider to configure access.')
  ).toEqual(['other'])
})
