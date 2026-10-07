import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure, newDocumentOptions, documentActions} from './structure'

export default defineConfig({
  name: 'default',
  title: 'DJM Portfolio',

  projectId: 'q6natj20',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    newDocumentOptions,
    actions: documentActions,
  },
})
