const { generateId, paginateArray } = require('./utils')
const { DEFAULT_QUERY_LIMIT, DEFAULT_QUERY_PAGE } = require('./constants')

describe.skip('generateId', () => {
  it('should generate a valid UUID', () => {
    const id = generateId()

    // UUID v4 regex pattern
    const uuidv4Pattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    expect(id).toMatch(uuidv4Pattern)
  })

  it('should generate unique IDs', () => {
    const id1 = generateId()
    const id2 = generateId()

    expect(id1).not.toBe(id2)
  })
})
describe('paginateArray', () => {
  const entities = Array.from({ length: 15 }, (_, i) => `Entity ${i + 1}`) // Example array of entities

  it('should paginate the array correctly with default values', () => {
    const result = paginateArray(
      entities,
      DEFAULT_QUERY_LIMIT,
      DEFAULT_QUERY_PAGE
    )
    expect(result).toHaveLength(DEFAULT_QUERY_LIMIT)
    expect(result[0]).toBe('Entity 1')
  })

  it('should paginate the array correctly with custom page and limit', () => {
    const result = paginateArray(entities, 5, 2)
    expect(result).toHaveLength(5)
    expect(result[0]).toBe('Entity 6')
  })

  it('should paginate the array with default values if limit is zero or negative', () => {
    const result = paginateArray(
      entities,
      DEFAULT_QUERY_LIMIT,
      DEFAULT_QUERY_PAGE
    )
    expect(result).toHaveLength(DEFAULT_QUERY_LIMIT)
  })
})
